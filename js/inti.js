/* =====================================================================
 * inti.js — alat bersama untuk semua bagian
 * (penyimpanan aman, audio, pembaca tanda warna, animasi artikel)
 * Tidak ada konten di sini: semua teks ada di data.js.
 * ===================================================================== */
var APP = (function () {
  'use strict';

  var APP = { bagian: {} };

  /* ---------------------------------------------------------------
   * Kabar antar-bagian (mis. progress berubah → menu diperbarui)
   * --------------------------------------------------------------- */
  var pendengar = {};
  APP.dengar = function (nama, fn) { (pendengar[nama] = pendengar[nama] || []).push(fn); };
  APP.kabar = function (nama, isi) { (pendengar[nama] || []).forEach(function (fn) { fn(isi); }); };

  APP.gerakDikurangi = function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };

  /* ---------------------------------------------------------------
   * Penyimpanan (localStorage dibungkus try/catch).
   * Kalau localStorage tidak tersedia, data disimpan di memori saja
   * selama halaman terbuka.
   * --------------------------------------------------------------- */
  APP.simpan = (function () {
    var KUNCI = (DATA.pengaturan && DATA.pengaturan.kunciPenyimpanan) || 'werWenWem.v1';
    var bisa = false;
    var isi = {};
    try {
      var uji = KUNCI + '.uji';
      window.localStorage.setItem(uji, '1');
      window.localStorage.removeItem(uji);
      bisa = true;
      var mentah = window.localStorage.getItem(KUNCI);
      if (mentah) {
        var o = JSON.parse(mentah);
        if (o && typeof o === 'object' && !Array.isArray(o)) isi = o;
      }
    } catch (e) { /* tidak tersedia atau rusak: pakai memori */ }

    function tulis() {
      if (!bisa) return;
      try { window.localStorage.setItem(KUNCI, JSON.stringify(isi)); } catch (e) { /* penuh / diblokir */ }
    }
    return {
      bisa: function () { return bisa; },
      ambil: function (k, bawaan) { return Object.prototype.hasOwnProperty.call(isi, k) ? isi[k] : bawaan; },
      taruh: function (k, v) { isi[k] = v; tulis(); },
      // progress: { bagian: { kunci: 1 } }
      tandai: function (bagian, kunci) {
        var p = isi.progres && typeof isi.progres === 'object' ? isi.progres : (isi.progres = {});
        var b = p[bagian] && typeof p[bagian] === 'object' ? p[bagian] : (p[bagian] = {});
        if (b[kunci]) return false;
        b[kunci] = 1;
        tulis();
        APP.kabar('progres', bagian);
        return true;
      },
      sudah: function (bagian, kunci) {
        return !!(isi.progres && isi.progres[bagian] && isi.progres[bagian][kunci]);
      },
      // semua kunci yang sudah ditandai di satu bagian
      daftar: function (bagian) {
        var b = isi.progres && isi.progres[bagian];
        return b && typeof b === 'object' ? Object.keys(b).filter(function (k) { return b[k]; }) : [];
      },
      hapusSemua: function () {
        var proyektor = isi.proyektor;
        isi = {};
        if (proyektor) isi.proyektor = proyektor;
        tulis();
        APP.kabar('progres', null);
      }
    };
  })();

  /** Hitung progress: berapa kunci dari daftar yang sudah ditandai. */
  APP.hitungProgres = function (bagian, daftarKunci) {
    var selesai = 0;
    daftarKunci.forEach(function (k) { if (APP.simpan.sudah(bagian, k)) selesai++; });
    return { selesai: selesai, total: daftarKunci.length };
  };

  /* ---------------------------------------------------------------
   * Teks & tanda warna
   * --------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  APP.esc = esc;

  // [g|teks] atau [g|teks|KASUS]
  var RE_FRASE = /\[(m|n|f|pl|-)\|([^\]|]*)(?:\|(NOM|AKK|DAT))?\]/g;

  APP.kelasGender = function (g) { return 'g-' + (g === '-' || !g ? 'x' : g); };

  APP.badge = function (k, panjang) {
    var d = DATA.kasus[k];
    if (!d) return '';
    var isi = panjang
      ? '<span class="badge-ikon" aria-hidden="true">' + d.ikon + '</span>' + d.kode + ' · ' + esc(d.tanyaUtama)
      : d.kode;
    return '<span class="badge k-' + k + '" title="' + esc(d.nama + ' · ' + d.tanya + ' · ' + d.peran) + '">' + isi + '</span>';
  };

  function inline(h) {
    return h
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.+?)\*/g, '<i lang="de">$1</i>')
      .replace(/==(.+?)==/g, '<mark class="aksen">$1</mark>')
      .replace(/\{(.+?)\}/g, '<span class="akhiran">$1</span>');
  }

  /** Ubah teks bertanda (lihat penjelasan di data.js) menjadi HTML. */
  APP.teks = function (s) {
    var h = esc(s).replace(RE_FRASE, function (_, g, isi, k) {
      var kasus = k ? k.toLowerCase() : '';
      return '<span class="fr ' + APP.kelasGender(g) + (kasus ? ' ber-kasus' : '') + '">' + isi +
        (kasus ? APP.badge(kasus) : '') + '</span>';
    });
    return inline(h);
  };

  /** Pecah teks bertanda menjadi potongan: {jenis:'teks'|'frase', isi, g, kasus}. */
  APP.potong = function (s) {
    var hasil = [], akhir = 0, m;
    var re = new RegExp(RE_FRASE.source, 'g');
    while ((m = re.exec(s))) {
      if (m.index > akhir) hasil.push({ jenis: 'teks', isi: s.slice(akhir, m.index) });
      hasil.push({ jenis: 'frase', g: m[1], isi: m[2], kasus: m[3] ? m[3].toLowerCase() : '' });
      akhir = re.lastIndex;
    }
    if (akhir < s.length) hasil.push({ jenis: 'teks', isi: s.slice(akhir) });
    return hasil;
  };

  /** Teks polos untuk dibacakan (tanda dihapus, isi kurung tidak dibaca). */
  APP.ucapan = function (s) {
    return String(s == null ? '' : s)
      .replace(RE_FRASE, '$2')
      .replace(/\*\*|\*|==|[{}]/g, '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/([.!?])\s+[–—]\s+/g, '$1 ')
      .replace(/\s+[–—]\s+/g, ', ')
      .replace(/[–—]/g, '')
      .replace(/\s*\/\s*/g, ', ')
      .replace(/\s*→\s*/g, ', ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
  };

  /* ---------------------------------------------------------------
   * Audio (Web Speech API, de-DE)
   * --------------------------------------------------------------- */
  APP.suara = (function () {
    var ok = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
    var pilihan = null;
    var aktif = null;

    function pilihSuara() {
      try {
        var semua = window.speechSynthesis.getVoices() || [];
        var de = semua.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
        pilihan = de.filter(function (v) { return /^de[-_]DE/i.test(v.lang) && v.localService; })[0] ||
                  de.filter(function (v) { return /^de[-_]DE/i.test(v.lang); })[0] || de[0] || null;
      } catch (e) { pilihan = null; }
    }
    if (ok) {
      pilihSuara();
      try {
        if (typeof window.speechSynthesis.addEventListener === 'function') {
          window.speechSynthesis.addEventListener('voiceschanged', pilihSuara);
        } else {
          window.speechSynthesis.onvoiceschanged = pilihSuara;
        }
      } catch (e) { /* abaikan */ }
    }

    function lepas() {
      if (aktif) { aktif.classList.remove('bicara'); aktif.setAttribute('aria-pressed', 'false'); aktif = null; }
    }
    function henti() {
      if (ok) { try { window.speechSynthesis.cancel(); } catch (e) { /* abaikan */ } }
      lepas();
    }
    function ucap(teks, tombol) {
      if (!ok || !teks) return;
      if (tombol && aktif === tombol) { henti(); return; }   // klik lagi = berhenti
      try {
        window.speechSynthesis.cancel();
        lepas();
        var u = new window.SpeechSynthesisUtterance(teks);
        u.lang = 'de-DE';
        if (pilihan) u.voice = pilihan;
        u.rate = (DATA.pengaturan && DATA.pengaturan.kecepatanAudio) || 0.9;
        if (tombol) { aktif = tombol; tombol.classList.add('bicara'); tombol.setAttribute('aria-pressed', 'true'); }
        u.onend = lepas;
        u.onerror = lepas;
        window.speechSynthesis.speak(u);
      } catch (e) { lepas(); }
    }
    return { ok: ok, ucap: ucap, henti: henti };
  })();

  var IKON_SUARA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor"/>' +
    '<path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /** Tombol speaker kecil. s boleh berisi tanda warna. */
  APP.tombolSuara = function (s) {
    var t = APP.ucapan(s);
    if (!t) return '';
    return '<button type="button" class="suara" data-ucap="' + esc(t) + '" aria-pressed="false" ' +
      'aria-label="Dengarkan: ' + esc(t) + '" title="Dengarkan">' + IKON_SUARA + '</button>';
  };

  /** Kalimat Jerman + speaker + terjemahan. k = {de, id, ucapan} atau string. */
  APP.kalimat = function (k, kelas) {
    if (typeof k === 'string') k = { de: k };
    return '<div class="kal' + (kelas ? ' ' + kelas : '') + '">' +
      '<div class="kal-de"><span class="de" lang="de">' + APP.teks(k.de) + '</span>' +
      APP.tombolSuara(k.ucapan || k.de) + '</div>' +
      (k.id ? '<div class="kal-id">' + APP.teks(k.id) + '</div>' : '') +
      '</div>';
  };

  /** Catatan: string (Indonesia) atau {de, id}. */
  APP.catatan = function (c) {
    if (typeof c === 'string') return '<li>' + APP.teks(c) + '</li>';
    return '<li>' + APP.kalimat(c, 'kal-catatan') + '</li>';
  };

  /* ---------------------------------------------------------------
   * Animasi artikel
   * --------------------------------------------------------------- */

  /**
   * Kata yang berubah: bagian awal yang sama tetap, sisanya "berputar".
   * der → dem : "de" tetap, "r" keluar, "m" masuk.
   * opsi.cepat = tanpa jeda awal; opsi.tunda = jeda (detik); opsi.akhiran = bagian baru oranye.
   */
  APP.morf = function (dari, ke, opsi) {
    opsi = opsi || {};
    dari = dari == null ? '' : String(dari);
    ke = ke == null ? '' : String(ke);
    if (dari === ke) return '<span class="morf tetap">' + esc(ke) + '</span>';
    var i = 0;
    while (i < dari.length && i < ke.length && dari.charAt(i).toLowerCase() === ke.charAt(i).toLowerCase()) i++;
    var awal = ke.slice(0, i), lama = dari.slice(i), baru = ke.slice(i);
    var akhiran = opsi.akhiran || false;
    var gaya = opsi.tunda != null ? ' style="--tunda:' + opsi.tunda + 's"' : '';
    return '<span class="morf' + (opsi.cepat ? ' cepat' : '') + '"' + gaya + '>' +
      '<span class="sr-only">' + esc(ke) + '</span>' +
      '<span aria-hidden="true">' + esc(awal) +
      (lama ? '<span class="morf-lama">' + esc(lama) + '</span>' : '') +
      (baru ? '<span class="morf-baru' + (akhiran ? ' akhiran' : '') + '">' + esc(baru) + '</span>' : '') +
      '</span></span>';
  };

  /**
   * Preposisi + artikel melebur: zu + dem → zum.
   * Mencari bagian depan preposisi dan bagian belakang artikel yang membentuk hasil.
   */
  APP.lebur = function (prep, art, hasil) {
    var i;
    for (i = Math.min(prep.length, hasil.length); i >= 0; i--) {
      var ekor = hasil.slice(i);
      if (prep.slice(0, i) === hasil.slice(0, i) && art.length >= ekor.length &&
          art.slice(art.length - ekor.length) === ekor) break;
    }
    var rumus = esc(prep) + ' + ' + esc(art) + ' = <b>' + esc(hasil) + '</b>';
    if (i < 0) return '<span class="lebur-item"><span class="lb-rumus">' + rumus + '</span></span>';
    var ekorA = hasil.slice(i);
    var hilangA = art.slice(0, art.length - ekorA.length);
    return '<span class="lebur-item">' +
      '<span class="lebur" lang="de"><span class="sr-only">' + esc(prep + ' + ' + art + ' = ' + hasil) + '</span>' +
      '<span class="lb" aria-hidden="true">' +
        '<span class="lb-p">' + esc(prep.slice(0, i)) +
          (prep.slice(i) ? '<span class="lb-hilang">' + esc(prep.slice(i)) + '</span>' : '') + '</span>' +
        '<span class="lb-plus">+</span>' +
        '<span class="lb-a">' + (hilangA ? '<span class="lb-hilang">' + esc(hilangA) + '</span>' : '') + esc(ekorA) + '</span>' +
      '</span></span>' +
      '<span class="lb-rumus" aria-hidden="true">' + rumus + '</span>' +
      '</span>';
  };

  /* ---------------------------------------------------------------
   * Potongan tampilan yang dipakai banyak bagian
   * --------------------------------------------------------------- */
  APP.menuItem = function (id) {
    for (var i = 0; i < DATA.menu.length; i++) if (DATA.menu[i].id === id) return DATA.menu[i];
    return null;
  };
  APP.nomorBagian = function (id) {
    for (var i = 0; i < DATA.menu.length; i++) if (DATA.menu[i].id === id) return i + 1;
    return 0;
  };

  /** Kepala halaman bagian: nomor, judul (h1), pengantar. */
  APP.kop = function (id, intro) {
    var item = APP.menuItem(id) || { judul: id, ikon: '' };
    return '<header class="kop-bagian">' +
      '<p class="nomor">Bagian ' + APP.nomorBagian(id) + '</p>' +
      '<h1 tabindex="-1"><span class="kop-ikon" aria-hidden="true">' + item.ikon + '</span>' + esc(item.judul) + '</h1>' +
      (intro ? '<p class="intro">' + APP.teks(intro) + '</p>' : '') +
      '</header>';
  };

  APP.cariKata = function (id) {
    for (var i = 0; i < DATA.kataBenda.length; i++) if (DATA.kataBenda[i].id === id) return DATA.kataBenda[i];
    return null;
  };

  /* ---------------------------------------------------------------
   * Alat tambahan (tahap 2): bentuk kata, teks templat, umpan balik
   * --------------------------------------------------------------- */

  /** Ganti %KUNCI% di templat dengan nilai dari peta. */
  APP.isiTemplat = function (templat, peta) {
    return String(templat || '').replace(/%([A-Z_]+)%/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(peta, k) ? peta[k] : m;
    });
  };

  /** Salinan daftar dalam urutan acak. */
  APP.acak = function (daftar) {
    var a = daftar.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /**
   * Kartu kata: 'kind' (tunggal) atau 'kind:pl' (plural).
   * Hasil: { id, kata, g ('m'|'n'|'f'|'pl'), plural, ikon, arti }
   */
  APP.kartuKata = function (kode) {
    var bagian = String(kode).split(':');
    var kata = APP.cariKata(bagian[0]);
    if (!kata) return null;
    var plural = bagian[1] === 'pl' || kata.g === 'pl';
    var artiDasar = String(kata.arti || '').replace(/ \(.*\)$/, '');
    return {
      id: kode, kata: kata, g: plural ? 'pl' : kata.g, plural: plural,
      ikon: plural ? (kata.ikonPl || (kata.ikon ? kata.ikon + kata.ikon : '')) : (kata.ikon || ''),
      arti: plural ? (kata.artiPl || 'para ' + artiDasar) : artiDasar,
      jenis: kata.jenis
    };
  };

  /**
   * Frasa kata benda dalam satu kasus.
   * Hasil: { art ('' bila tanpa artikel), nomen, tambahN (true bila Dativ plural + n), teks }
   */
  APP.frasa = function (kartu, kasus, tentu) {
    var art = DATA.artikel[tentu ? 'tentu' : 'taktentu'][kasus][kartu.g];
    if (art === '–') art = '';
    var k = kartu.kata;
    var nomen = kartu.plural ? (kasus === 'dat' ? (k.datPl || k.pl) : k.pl) : k.sg;
    var tambahN = kartu.plural && kasus === 'dat' && k.datPl === k.pl + 'n';
    return { art: art, nomen: nomen, tambahN: tambahN, teks: (art ? art + ' ' : '') + nomen,
             tanda: (art ? art + ' ' : '') + (tambahN ? k.pl + '{n}' : nomen) };
  };

  /** Di kasus mana saja bentuk artikel ini dipakai untuk gender g? (mis. 'der', 'f' → ['dat']) */
  APP.kasusArtikel = function (art, g) {
    var hasil = [];
    ['nom', 'akk', 'dat'].forEach(function (k) {
      var a = String(art).toLowerCase();
      if (DATA.artikel.tentu[k][g] === a || DATA.artikel.taktentu[k][g] === a) hasil.push(k);
    });
    return hasil;
  };

  /**
   * Seret & lepas dengan mouse/pena (tahap 3). Di layar sentuh tidak aktif:
   * di sana bagian memakai ketuk-ketuk, supaya halaman tetap bisa digulir.
   * opsi: { kartu: selektor yang bisa diseret, target: selektor tempat lepas,
   *         mulai(elKartu), lepas(elKartu, elTarget atau null) }
   * Hasil: { hapus(), baruSaja() } — baruSaja() = true tepat setelah menyeret (abaikan klik).
   */
  APP.seretLepas = function (wadah, opsi) {
    var seret = null, baru = false;
    function cariTarget(x, y) {
      if (seret && seret.hantu) seret.hantu.style.display = 'none';
      var t = document.elementFromPoint(x, y);
      if (seret && seret.hantu) seret.hantu.style.display = '';
      t = t && t.closest ? t.closest(opsi.target) : null;
      return t && wadah.contains(t) ? t : null;
    }
    function bersihkanSorot() {
      wadah.querySelectorAll('.di-atas').forEach(function (x) { x.classList.remove('di-atas'); });
    }
    function mulai(e) {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      var k = e.target.closest ? e.target.closest(opsi.kartu) : null;
      if (!k || !wadah.contains(k)) return;
      var r = k.getBoundingClientRect();
      seret = { el: k, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, lebar: r.width, aktif: false, hantu: null };
    }
    function gerak(e) {
      if (!seret) return;
      if (!seret.aktif) {
        if (Math.abs(e.clientX - seret.x) + Math.abs(e.clientY - seret.y) < 8) return;
        seret.aktif = true;
        var h = seret.el.cloneNode(true);
        h.classList.add('hantu');
        h.setAttribute('aria-hidden', 'true');
        h.style.width = seret.lebar + 'px';
        document.body.appendChild(h);
        seret.hantu = h;
        seret.el.classList.add('sedang-diseret');
        document.body.classList.add('sedang-menyeret');
        if (opsi.mulai) opsi.mulai(seret.el);
      }
      seret.hantu.style.transform = 'translate(' + (e.clientX - seret.dx) + 'px,' + (e.clientY - seret.dy) + 'px)';
      bersihkanSorot();
      var t = cariTarget(e.clientX, e.clientY);
      if (t) t.classList.add('di-atas');
    }
    function selesai(e, batal) {
      if (!seret) return;
      var s = seret;
      var t = s.aktif && !batal ? cariTarget(e.clientX, e.clientY) : null;
      seret = null;
      if (!s.aktif) return;
      if (s.hantu) s.hantu.remove();
      s.el.classList.remove('sedang-diseret');
      document.body.classList.remove('sedang-menyeret');
      bersihkanSorot();
      baru = true;
      setTimeout(function () { baru = false; }, 0);
      if (opsi.lepas) opsi.lepas(s.el, t);
    }
    function lepas(e) { selesai(e, false); }
    function batal(e) { selesai(e, true); }
    wadah.addEventListener('pointerdown', mulai);
    window.addEventListener('pointermove', gerak);
    window.addEventListener('pointerup', lepas);
    window.addEventListener('pointercancel', batal);
    return {
      baruSaja: function () { return baru; },
      hapus: function () {
        wadah.removeEventListener('pointerdown', mulai);
        window.removeEventListener('pointermove', gerak);
        window.removeEventListener('pointerup', lepas);
        window.removeEventListener('pointercancel', batal);
        if (seret && seret.hantu) seret.hantu.remove();
        document.body.classList.remove('sedang-menyeret');
        seret = null;
      }
    };
  };

  /** Kotak umpan balik. Selalu dengan ikon dan kata, tidak hanya warna. */
  APP.umpan = function (benar, isiHTML) {
    return '<div class="umpan ' + (benar ? 'benar' : 'salah') + '">' +
      '<span class="umpan-ikon" aria-hidden="true">' + (benar ? '✓' : '✗') + '</span>' +
      '<div class="umpan-isi"><p class="umpan-judul">' + (benar ? 'Benar!' : 'Belum tepat') + '</p>' + isiHTML + '</div></div>';
  };

  return APP;
})();

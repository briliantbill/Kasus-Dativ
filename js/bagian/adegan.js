/* =====================================================================
 * Bagian 4 — Adegan "Wer gibt wem was?"
 * Ketuk tokoh/benda → badge kasus + perubahan artikel.
 * Bila si pelaku dan si penerima terbuka → panah dari pelaku ke penerima.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'adegan';
  var PANGGUNG = ['nom', 'akk', 'dat'];   // kiri: pelaku · tengah: benda · kanan: penerima
  var st = { i: 0 };                      // adegan aktif (diingat selama halaman terbuka)

  /* ---------------- Membaca kalimat adegan ---------------- */
  function bacaAdegan(a) {
    var potong = APP.potong(a.kalimat);
    var frasa = {}, verb = a.verb || '';
    potong.forEach(function (p, i) {
      if (p.jenis !== 'frase' || !p.kasus) return;
      frasa[p.kasus] = p;
      if (p.kasus === 'nom' && !verb && potong[i + 1] && potong[i + 1].jenis === 'teks') {
        verb = potong[i + 1].isi.trim().split(/\s+/)[0] || '';
      }
    });
    return { potong: potong, frasa: frasa, verb: verb };
  }

  // teks tanpa tanda; {n} dibuang (bentuk dasar) atau dipertahankan (bentuk kasus)
  function tanpaTanda(s, simpanAkhiran) {
    return String(s).replace(/\*\*/g, '').replace(/\{([^}]*)\}/g, simpanAkhiran ? '$1' : '').trim();
  }

  /** Bentuk dasar (Nominativ) dan bentuk di kalimat untuk satu frasa. */
  function bentuk(p) {
    var kataKasus = tanpaTanda(p.isi, true).split(/\s+/);
    var kataDasar = tanpaTanda(p.isi, false).split(/\s+/);
    var adaArtikel = kataKasus.length > 1;
    var art = adaArtikel ? kataKasus[0].toLowerCase() : '';
    var artDasar = art;
    if (art && p.g !== '-') {
      if (DATA.artikel.tentu[p.kasus][p.g] === art) artDasar = DATA.artikel.tentu.nom[p.g];
      else if (DATA.artikel.taktentu[p.kasus][p.g] === art) artDasar = DATA.artikel.taktentu.nom[p.g];
    }
    var nomen = kataKasus.slice(adaArtikel ? 1 : 0).join(' ');
    var nomenDasar = kataDasar.slice(adaArtikel ? 1 : 0).join(' ');
    return {
      art: art, artDasar: artDasar, nomen: nomen, nomenDasar: nomenDasar,
      teks: (art ? art + ' ' : '') + nomen,
      dasar: (artDasar ? artDasar + ' ' : '') + nomenDasar,
      akhiranN: /\{n\}/.test(p.isi)
    };
  }

  function namaHTML(b, terbuka) {
    if (!terbuka) return esc(b.dasar);
    return (b.art ? APP.morf(b.artDasar, b.art, { tunda: 0.25 }) + ' ' : '') +
      APP.morf(b.nomenDasar, b.nomen, { tunda: 0.25, akhiran: b.akhiranN });
  }

  function kapital(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------------- Tampilan ---------------- */
  function navHTML() {
    return DATA.adegan.daftar.map(function (a, i) {
      var selesai = APP.simpan.sudah(BAGIAN, 'a' + (i + 1));
      return '<button type="button" class="ad-pilih' + (selesai ? ' selesai' : '') + '" data-adegan="' + i + '" aria-pressed="' +
        (i === st.i ? 'true' : 'false') + '"><span class="ad-pilih-ikon" aria-hidden="true">' + esc(a.latar || '') + '</span>' +
        '<span class="ad-pilih-judul" lang="de">' + esc(a.judul) + '</span>' +
        (selesai ? '<span class="ad-pilih-cek" aria-label="selesai">✓</span>' : '') + '</button>';
    }).join('');
  }

  function render(el) {
    var A = DATA.adegan;
    var hapusPendengar = [];
    var terbuka = {};
    var info = null;           // kasus yang terakhir diketuk
    var sudahTerbang = false;
    var a, baca;

    el.innerHTML = APP.kop(BAGIAN, A.intro) +
      '<nav class="ad-nav" aria-label="Pilih adegan"></nav>' +
      '<section class="kartu ad-kartu" aria-live="off"></section>';
    var elNav = el.querySelector('.ad-nav');
    var elKartu = el.querySelector('.ad-kartu');

    function tokohHTML(k) {
      var p = baca.frasa[k];
      if (!p) return '<span></span>';
      var b = bentuk(p);
      var buka = !!terbuka[k];
      return '<button type="button" class="ad-tokoh' + (buka ? ' terbuka' : '') + (k === 'akk' ? ' ad-benda' : '') + '" data-kasus="' + k + '" ' +
        'aria-expanded="' + (buka ? 'true' : 'false') + '" aria-controls="ad-info">' +
        '<span class="ad-ikon" aria-hidden="true">' + esc((a.ikon && a.ikon[k]) || '❓') + '</span>' +
        '<span class="ad-badge">' + APP.badge(k, true) + '</span>' +
        '<span class="ad-nama fr ' + APP.kelasGender(p.g) + '" lang="de">' + namaHTML(b, buka) + '</span>' +
        '<span class="ad-arti">' + esc((a.arti && a.arti[k]) || '') + '</span>' +
        '</button>';
    }

    function kalimatHTML() {
      var h = baca.potong.map(function (p) {
        if (p.jenis === 'teks') return APP.teks(p.isi);
        var kode = p.kasus && terbuka[p.kasus] ? '|' + DATA.kasus[p.kasus].kode : '';
        return APP.teks('[' + p.g + '|' + p.isi + kode + ']');
      }).join('');
      return '<div class="kal ad-kalimat"><div class="kal-de"><span class="de" lang="de">' + h + '</span>' +
        APP.tombolSuara(a.kalimat) + '</div><div class="kal-id">' + APP.teks(a.id || '') + '</div></div>';
    }

    function infoHTML() {
      if (!info || !baca.frasa[info]) {
        return '<p class="ad-petunjuk">👆 Ketuk si pelaku, bendanya, dan si penerima.</p>';
      }
      var k = info, p = baca.frasa[k], b = bentuk(p), d = DATA.kasus[k];
      var jawab = kapital(p.isi.replace(/\*\*/g, '')) + '.';
      var perubahan = APP.isiTemplat(b.dasar === b.teks ? A.teks.tetap : A.teks.berubah, {
        DASAR: b.dasar, BENTUK: (b.art ? b.art + ' ' : '') + (b.akhiranN ? b.nomenDasar + '{n}' : b.nomen)
      });
      return '<div class="ad-info-kop">' + APP.badge(k, true) + '<span class="ad-info-peran">' + esc(d.peran) + '</span></div>' +
        APP.kalimat({ de: ((a.tanya && a.tanya[k]) || '') + ' – [' + p.g + '|' + jawab + ']' }) +
        '<p class="ad-perubahan">' + APP.teks(perubahan) + '</p>';
    }

    function lengkap() { return PANGGUNG.every(function (k) { return !baca.frasa[k] || terbuka[k]; }); }

    function renderKartu() {
      a = A.daftar[st.i];
      baca = bacaAdegan(a);
      elNav.innerHTML = navHTML();
      elKartu.innerHTML =
        '<div class="ad-kop"><span class="ad-latar" aria-hidden="true">' + esc(a.latar || '') + '</span>' +
          '<h2 lang="de">' + esc(a.judul) + '</h2>' +
          '<span class="ad-nomor">Adegan ' + (st.i + 1) + ' dari ' + A.daftar.length + '</span></div>' +
        '<div class="ad-panggung">' +
          '<svg class="ad-panah" aria-hidden="true" focusable="false"></svg>' +
          '<div class="ad-tokoh-baris">' + PANGGUNG.map(tokohHTML).join('') + '</div>' +
        '</div>' +
        '<div class="ad-info" id="ad-info" aria-live="polite">' + infoHTML() + '</div>' +
        '<div class="ad-bawah">' + kalimatHTML() + '<div class="ad-selesai"></div></div>' +
        '<div class="ad-aksi">' +
          '<button type="button" class="tombol tombol-garis" data-aksi="semua">Tampilkan semua</button>' +
          '<button type="button" class="tombol tombol-garis" data-aksi="ulang">↺ Ulangi</button>' +
          '<button type="button" class="tombol tombol-utama" data-aksi="lanjut">Adegan berikutnya →</button>' +
        '</div>';
      perbaruiSelesai();
      gambarPanah(false);
    }

    function perbaruiTokoh(k) {
      var lama = elKartu.querySelector('.ad-tokoh[data-kasus="' + k + '"]');
      if (lama) lama.outerHTML = tokohHTML(k);
    }

    function perbaruiSelesai() {
      var wadah = elKartu.querySelector('.ad-selesai');
      if (!wadah) return;
      if (lengkap()) {
        wadah.innerHTML = '<p class="ad-lengkap">🎉 ' + APP.teks(A.teks.lengkap) + '</p>' +
          (a.catatan ? '<p class="ad-catatan">💡 ' + APP.teks(a.catatan) + '</p>' : '');
        if (APP.simpan.tandai(BAGIAN, 'a' + (st.i + 1))) elNav.innerHTML = navHTML();
      } else {
        wadah.innerHTML = '';
      }
    }

    /* ---- panah dari si pelaku ke si penerima ---- */
    function gambarPanah(animasi) {
      var panggung = elKartu.querySelector('.ad-panggung');
      var svg = panggung && panggung.querySelector('.ad-panah');
      if (!svg) return;
      if (!(terbuka.nom && terbuka.dat)) { svg.innerHTML = ''; return; }
      var r = panggung.getBoundingClientRect();
      var ia = panggung.querySelector('.ad-tokoh[data-kasus="nom"] .ad-ikon');
      var ib = panggung.querySelector('.ad-tokoh[data-kasus="dat"] .ad-ikon');
      if (!ia || !ib || !r.width) return;
      var a1 = ia.getBoundingClientRect(), b1 = ib.getBoundingClientRect();
      var x1 = a1.left + a1.width / 2 - r.left, y1 = a1.top - r.top - 2;
      var x2 = b1.left + b1.width / 2 - r.left, y2 = b1.top - r.top - 2;
      var puncak = 6;
      var d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + x1.toFixed(1) + ' ' + puncak + ' ' +
        x2.toFixed(1) + ' ' + puncak + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
      var yLabel = 0.125 * (y1 + y2) + 0.75 * puncak + 20;
      var bergerak = animasi && !APP.gerakDikurangi();
      svg.setAttribute('viewBox', '0 0 ' + r.width.toFixed(1) + ' ' + r.height.toFixed(1));
      svg.innerHTML =
        '<defs><marker id="ad-ujung" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
          '<path d="M0 0 L10 5 L0 10 z" class="ad-ujung-isi"/></marker></defs>' +
        '<path id="ad-jalur" class="ad-garis' + (bergerak ? ' gambar' : '') + '" d="' + d + '" pathLength="1"' +
          (bergerak ? '' : ' marker-end="url(#ad-ujung)"') + '/>' +
        '<text class="ad-verb" x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + yLabel.toFixed(1) + '" text-anchor="middle" lang="de">' + esc(baca.verb) + '</text>';
      if (bergerak) {
        var jalur = svg.querySelector('#ad-jalur');
        setTimeout(function () { if (jalur.isConnected) jalur.setAttribute('marker-end', 'url(#ad-ujung)'); }, 650);
      }
    }

    // benda "terbang" dari pelaku ke penerima, sekali saat adegan lengkap
    function terbangkanBenda() {
      if (sudahTerbang || APP.gerakDikurangi()) return;
      var svg = elKartu.querySelector('.ad-panah');
      if (!svg || !svg.querySelector('#ad-jalur') || !(a.ikon && a.ikon.akk)) return;
      sudahTerbang = true;
      svg.insertAdjacentHTML('beforeend',
        '<text class="ad-terbang" text-anchor="middle" dominant-baseline="central" opacity="0">' + esc(a.ikon.akk) +
          '<animateMotion dur="1.4s" begin="indefinite" fill="freeze"><mpath href="#ad-jalur" xlink:href="#ad-jalur"/></animateMotion>' +
          '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="1.4s" begin="indefinite" fill="freeze"/>' +
        '</text>');
      var t = svg.lastElementChild;
      try { t.querySelectorAll('animateMotion, animate').forEach(function (x) { x.beginElement(); }); } catch (e) { /* abaikan */ }
    }

    function buka(k, nilai) {
      if (!baca.frasa[k]) return;
      terbuka[k] = nilai;
      info = k;
      perbaruiTokoh(k);
      var elInfo = elKartu.querySelector('.ad-info');
      if (elInfo) elInfo.innerHTML = infoHTML();
      var bawah = elKartu.querySelector('.ad-kalimat');
      if (bawah) bawah.outerHTML = kalimatHTML();
      perbaruiSelesai();
      var adaPanah = !!elKartu.querySelector('#ad-jalur');
      gambarPanah(!adaPanah);
      if (lengkap()) terbangkanBenda();
    }

    function gantiAdegan(i) {
      st.i = (i + A.daftar.length) % A.daftar.length;
      terbuka = {}; info = null; sudahTerbang = false;
      APP.suara.henti();
      renderKartu();
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-kasus], [data-aksi], [data-adegan]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-adegan')) { gantiAdegan(+t.getAttribute('data-adegan')); return; }
      if (t.hasAttribute('data-kasus')) {
        var k = t.getAttribute('data-kasus');
        if (terbuka[k]) { info = k; elKartu.querySelector('.ad-info').innerHTML = infoHTML(); }
        else buka(k, true);
        return;
      }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'semua') {
        ['nom', 'dat', 'akk'].forEach(function (k) { if (!terbuka[k]) buka(k, true); });
      } else if (aksi === 'ulang') {
        gantiAdegan(st.i);
      } else if (aksi === 'lanjut') {
        gantiAdegan(st.i + 1);
        elKartu.scrollIntoView({ block: 'start', behavior: APP.gerakDikurangi() ? 'auto' : 'smooth' });
      }
    });

    // panah mengikuti ukuran kartu (layar diubah, mode proyektor, huruf selesai dimuat)
    var tunda = null;
    function ukurUlang() { clearTimeout(tunda); tunda = setTimeout(function () { gambarPanah(false); }, 80); }
    if (typeof window.ResizeObserver === 'function') {
      var pengamat = new window.ResizeObserver(ukurUlang);
      pengamat.observe(elKartu);
      hapusPendengar.push(function () { pengamat.disconnect(); clearTimeout(tunda); });
    } else {
      window.addEventListener('resize', ukurUlang);
      hapusPendengar.push(function () { window.removeEventListener('resize', ukurUlang); clearTimeout(tunda); });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (el.isConnected) gambarPanah(false); });

    renderKartu();
    return function () { hapusPendengar.forEach(function (f) { f(); }); };
  }

  APP.bagian.adegan = {
    render: render,
    progres: function () {
      var kunci = DATA.adegan.daftar.map(function (_, i) { return 'a' + (i + 1); });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'adegan selesai';
      return p;
    }
  };
})();

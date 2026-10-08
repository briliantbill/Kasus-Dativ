/* =====================================================================
 * Bagian 7 — Sortir kata kerja
 * Seret kata kerja ke kotak AKK / DAT / AKK + DAT (mouse),
 * atau ketuk kata kerja lalu ketuk kotaknya (HP, keyboard).
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'verben';
  var KOTAK = ['akk', 'dat', 'akkDat'];

  var sesi = null;   // diingat selama halaman terbuka

  function semuaVerb() {
    var hasil = [];
    KOTAK.forEach(function (k) {
      (DATA.verben[k] || []).forEach(function (v) {
        hasil.push({ verb: v.verb, arti: v.arti, contoh: v.contoh, kotak: k });
      });
    });
    return hasil;
  }

  function sesiBaru() {
    sesi = { kartu: APP.acak(semuaVerb()), di: {}, salah: {}, pilih: null, umpan: '', benar: 0 };
  }

  function cari(verb) {
    for (var i = 0; i < sesi.kartu.length; i++) if (sesi.kartu[i].verb === verb) return sesi.kartu[i];
    return null;
  }

  function badgeKotak(k) {
    if (k === 'akk') return APP.badge('akk');
    if (k === 'dat') return APP.badge('dat');
    return APP.badge('akk') + '<span class="so-plus">+</span>' + APP.badge('dat');
  }

  function render(el) {
    var V = DATA.verben;
    if (!sesi) sesiBaru();
    var kilat = null, kilatTimer = null;

    el.innerHTML = APP.kop(BAGIAN, V.intro) +
      '<section class="kartu so-kartu" aria-label="Sortir kata kerja">' +
        '<div class="so-atas"></div>' +
        '<div class="so-kotak-baris"></div>' +
        '<div class="so-umpan" aria-live="polite"></div>' +
        '<h2 class="so-judul-kolam">Kata kerja</h2>' +
        '<p class="petunjuk so-cara">🖱️ Seret ke kotak. 👆 Atau ketuk kata kerja, lalu ketuk kotaknya.</p>' +
        '<div class="so-kolam"></div>' +
        '<p class="so-ulang"><button type="button" class="tombol tombol-garis" data-aksi="ulang">↺ Ulangi (urutan acak)</button></p>' +
      '</section>' +
      '<div class="so-cepat" role="region" aria-label="Taruh kata kerja terpilih" hidden></div>';

    var elAtas = el.querySelector('.so-atas');
    var elBaris = el.querySelector('.so-kotak-baris');
    var elUmpan = el.querySelector('.so-umpan');
    var elKolam = el.querySelector('.so-kolam');
    var elCepat = el.querySelector('.so-cepat');

    function jumlahDi() { return Object.keys(sesi.di).length; }

    function renderSemua() {
      var total = sesi.kartu.length;
      elAtas.innerHTML = '<span>Tersortir: <b>' + jumlahDi() + '</b> dari ' + total + '</span>' +
        '<span class="so-skor" title="Benar pada percobaan pertama">⭐ ' + sesi.benar + '</span>';

      elBaris.innerHTML = KOTAK.map(function (k) {
        var d = V.kotak[k];
        var isi = sesi.kartu.filter(function (c) { return sesi.di[c.verb] === k; }).map(function (c) {
          return '<li lang="de">' + esc(c.verb) + '</li>';
        }).join('');
        return '<div class="so-kotak' + (sesi.pilih ? ' siap' : '') + '" data-kotak="' + k + '">' +
          '<div class="so-kotak-kop">' + badgeKotak(k) + '<span class="so-kotak-tanya" lang="de">' + esc(d.tanya) + '</span></div>' +
          '<ul class="so-isi" aria-label="Kata kerja di kotak ' + esc(d.label) + '">' + isi + '</ul>' +
          '<button type="button" class="so-taruh" data-taruh="' + k + '">' +
            (sesi.pilih ? 'Taruh di sini' : esc(d.label)) + '</button>' +
          '</div>';
      }).join('');

      var sisa = sesi.kartu.filter(function (c) { return !sesi.di[c.verb]; });
      elKolam.innerHTML = sisa.length ? sisa.map(function (c) {
        var dipilih = sesi.pilih === c.verb;
        return '<button type="button" class="so-verb' + (dipilih ? ' dipilih' : '') + (sesi.salah[c.verb] ? ' pernah-salah' : '') + '"' +
          ' data-verb="' + esc(c.verb) + '" aria-pressed="' + (dipilih ? 'true' : 'false') + '">' +
          '<span class="so-verb-de" lang="de">' + esc(c.verb) + '</span><span class="so-verb-arti">' + esc(c.arti) + '</span></button>';
      }).join('') : '<p class="so-kosong">🎉 Semua kata kerja sudah di kotaknya.</p>';

      elUmpan.innerHTML = sesi.umpan +
        (!sisa.length ? '<p class="so-selesai">' + APP.teks(APP.isiTemplat(V.teks.selesai, { BENAR: sesi.benar, TOTAL: total })) + '</p>' : '');

      renderCepat();
    }

    function renderCepat() {
      var c = sesi.pilih ? cari(sesi.pilih) : null;
      if (c) {
        elCepat.innerHTML = '<p class="bk-cepat-atas"><b lang="de">' + esc(c.verb) + '</b> · taruh di:</p>' +
          KOTAK.map(function (k) {
            return '<button type="button" class="bk-cepat-btn" data-taruh="' + k + '">' + badgeKotak(k) + '</button>';
          }).join('') +
          '<button type="button" class="bk-cepat-batal" data-aksi="batal" aria-label="Batal memilih">✕</button>';
        elCepat.hidden = false;
      } else if (kilat) {
        elCepat.innerHTML = '<p class="bk-cepat-kilat">' + kilat + '</p>';
        elCepat.hidden = false;
      } else {
        elCepat.hidden = true;
        elCepat.innerHTML = '';
      }
    }

    function kilatkan(html) {
      kilat = html;
      clearTimeout(kilatTimer);
      kilatTimer = setTimeout(function () { kilat = null; if (el.isConnected) renderCepat(); }, 2600);
    }

    function pilih(verb) {
      sesi.pilih = sesi.pilih === verb ? null : verb;
      sesi.umpan = sesi.pilih ? '<p class="petunjuk">' + APP.teks(APP.isiTemplat(V.teks.dipilih, { VERB: verb })) + '</p>' : '';
      renderSemua();
      var b = el.querySelector('.so-verb[data-verb="' + verb + '"]');
      if (b) b.focus();
    }

    function sortir(verb, k) {
      var c = cari(verb);
      if (!c || sesi.di[verb]) return;
      var benar = c.kotak === k;
      var peta = { VERB: c.verb, ARTI: c.arti, KOTAK: V.kotak[c.kotak].label, PILIH: V.kotak[k].label, JELAS: V.kotak[c.kotak].jelas };
      if (benar) {
        sesi.di[verb] = k;
        if (!sesi.salah[verb]) sesi.benar++;
        APP.simpan.tandai(BAGIAN, 'v-' + verb);
      } else {
        sesi.salah[verb] = true;
      }
      sesi.pilih = null;
      sesi.umpan = APP.umpan(benar, '<p>' + APP.teks(APP.isiTemplat(benar ? V.teks.benar : V.teks.salah, peta)) + '</p>' +
        (c.contoh ? APP.kalimat(c.contoh) : ''));
      kilatkan((benar ? '✓ ' : '✗ ') + '<b lang="de">' + esc(c.verb) + '</b> → ' + badgeKotak(c.kotak));
      renderSemua();
      // fokus ke kata kerja berikutnya supaya keyboard tetap lancar
      var lanjut = el.querySelector('.so-verb');
      if (lanjut) lanjut.focus();
    }

    var seret = APP.seretLepas(el, {
      kartu: '.so-verb',
      target: '.so-kotak',
      mulai: function (k) {
        sesi.pilih = k.getAttribute('data-verb');
        el.querySelectorAll('.so-kotak').forEach(function (x) { x.classList.add('siap'); });
      },
      lepas: function (k, t) {
        var verb = k.getAttribute('data-verb');
        if (t) sortir(verb, t.getAttribute('data-kotak'));
        else { sesi.pilih = null; renderSemua(); }
      }
    });

    el.addEventListener('click', function (e) {
      if (seret.baruSaja()) return;
      var t = e.target.closest('[data-verb], [data-taruh], [data-aksi], [data-kotak]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-verb')) { pilih(t.getAttribute('data-verb')); return; }
      if (t.hasAttribute('data-aksi')) {
        var aksi = t.getAttribute('data-aksi');
        if (aksi === 'ulang') { sesiBaru(); renderSemua(); }
        else if (aksi === 'batal') {
          var tadi = sesi.pilih; sesi.pilih = null; sesi.umpan = ''; renderSemua();
          var b = tadi && el.querySelector('.so-verb[data-verb="' + tadi + '"]');
          if (b) b.focus();
        }
        return;
      }
      var k = t.getAttribute('data-taruh') || t.getAttribute('data-kotak');
      if (sesi.pilih) sortir(sesi.pilih, k);
      else if (t.hasAttribute('data-taruh')) { sesi.umpan = '<p class="petunjuk">' + APP.teks(V.teks.pilihDulu) + '</p>'; renderSemua(); }
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sesi.pilih) { sesi.pilih = null; sesi.umpan = ''; renderSemua(); }
    });

    sesi.pilih = null;
    renderSemua();
    return function () { seret.hapus(); clearTimeout(kilatTimer); };
  }

  APP.bagian.verben = {
    render: render,
    progres: function () {
      var kunci = semuaVerb().map(function (c) { return 'v-' + c.verb; });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'kata kerja tersortir';
      return p;
    }
  };
})();

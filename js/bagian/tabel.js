/* =====================================================================
 * Bagian 3 — Perubahan Artikel
 * Pilih gender, kasus, dan jenis artikel → artikel berubah dengan animasi.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'tabel';
  var GENDER = ['m', 'n', 'f', 'pl'];
  var KASUS = ['nom', 'akk', 'dat'];

  // Pilihan tetap diingat selama halaman terbuka
  var st = { g: 'm', k: 'nom', tentu: true, kata: {}, tampil: null };

  /* ---------------- Bentuk kata ---------------- */
  function artikel(k, g, tentu) { return DATA.artikel[tentu ? 'tentu' : 'taktentu'][k][g]; }

  function kataTerpilih(g) {
    var daftar = DATA.tabelHidup.pilihan[g] || [];
    var id = daftar.indexOf(st.kata[g]) >= 0 ? st.kata[g] : daftar[0];
    return APP.cariKata(id);
  }

  function bentukKata(kata, g, k) {
    if (g === 'pl') return k === 'dat' ? (kata.datPl || kata.pl) : kata.pl;
    return kata.sg;
  }

  function tambahN(kata, g, k) { return g === 'pl' && k === 'dat' && kata.datPl === kata.pl + 'n'; }

  function kapital(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function ikonKata(kata, g) {
    if (!kata.ikon) return '';
    return g === 'pl' ? (kata.ikonPl || kata.ikon + kata.ikon) : kata.ikon;
  }

  /* ---------------- Panggung ---------------- */
  function nomenHTML(kata, g, k, sebelum, animasi) {
    var nomen = bentukKata(kata, g, k);
    var statis = tambahN(kata, g, k) ? esc(kata.pl) + '<span class="akhiran">n</span>' : esc(nomen);
    if (!animasi || sebelum == null || sebelum === nomen) return statis;
    if (tambahN(kata, g, k) && sebelum === kata.pl) return APP.morf(sebelum, nomen, { cepat: true, akhiran: true });
    if (g === 'pl' && kata.datPl === kata.pl + 'n' && sebelum === kata.datPl && nomen === kata.pl) {
      return APP.morf(sebelum, nomen, { cepat: true });
    }
    return '<span class="muncul">' + statis + '</span>';
  }

  function panggungHTML(animasi) {
    var T = DATA.tabelHidup, g = st.g, k = st.k;
    var kata = kataTerpilih(g);
    var art = artikel(k, g, st.tentu);
    if (art === '–') art = '';
    var nomen = bentukKata(kata, g, k);
    var lalu = st.tampil;

    var artHTML = '';
    if (art) artHTML = animasi && lalu ? APP.morf(lalu.art, art, { cepat: true }) : esc(art);
    var frasa = (artHTML ? '<span class="th-art">' + artHTML + '</span> ' : '<span class="th-tanpa">(tanpa artikel)</span> ') +
      nomenHTML(kata, g, k, lalu ? lalu.kata : null, animasi);

    // bentuk dasar (Nominativ) sebagai pembanding
    var artDasar = artikel('nom', g, st.tentu);
    var dasar = (artDasar === '–' ? '' : artDasar + ' ') + bentukKata(kata, g, 'nom');

    // kalimat contoh
    var b = T.bingkai[k];
    var templat = g === 'pl' ? b.pl : b.sg;
    var posisi = templat.indexOf('%X%');
    var depan = templat.slice(0, posisi), belakang = templat.slice(posisi + 3);
    var artKal = posisi === 0 ? kapital(art) : art;
    var frasaKal = (artKal ? artKal + ' ' : '') + nomen;
    if (posisi === 0 && !artKal) frasaKal = kapital(frasaKal);
    var frasaKalHTML = (artKal ? '<b>' + esc(artKal) + '</b> ' : '') +
      (tambahN(kata, g, k) ? esc(kata.pl) + '<span class="akhiran">n</span>' : esc(nomen));
    var kalimatPolos = depan + frasaKal + belakang;

    // penjelasan
    var jelas = T.penjelasan[k + '-' + g] || '';
    if (g === 'pl' && k === 'dat' && T.datPl) {
      var catatan = kata.datPl === kata.pl + 'n' ? T.datPl.tambahN
        : /n$/.test(kata.pl) ? T.datPl.sudahN
        : /s$/.test(kata.pl) ? T.datPl.akhiranS : '';
      if (catatan) jelas += ' ' + catatan.replace(/%PL%/g, kata.pl).replace(/%DAT%/g, kata.datPl);
    }

    st.tampil = { art: art, kata: nomen };

    return '<div class="th-label">' + APP.badge(k, true) +
        '<span class="tag-g ' + APP.kelasGender(g) + '">' + esc(DATA.gender[g].nama) + '</span></div>' +
      '<p class="th-frase fr ' + APP.kelasGender(g) + '">' +
        '<span class="th-ikon" aria-hidden="true">' + ikonKata(kata, g) + '</span>' +
        '<span class="de" lang="de">' + frasa + '</span></p>' +
      '<p class="th-arti">' + esc(g === 'pl' ? (kata.artiPl || 'para ' + kata.arti.replace(/ \(.*\)$/, '')) : kata.arti) +
        (k !== 'nom' ? ' · <span class="th-dasar">bentuk dasar: <span lang="de">' + esc(dasar) + '</span></span>' : '') + '</p>' +
      '<div class="th-dialog">' +
        '<div class="kal"><div class="kal-de"><span class="de" lang="de">' + esc(b.tanya) + '</span>' + APP.tombolSuara(b.tanya) + '</div>' +
        '<div class="kal-id">' + esc(b.tanyaId) + '</div></div>' +
        '<div class="kal th-jawab"><div class="kal-de"><span class="de" lang="de">' + esc(depan) +
          '<span class="fr ' + APP.kelasGender(g) + '">' + frasaKalHTML + '</span>' + esc(belakang) + '</span>' +
          APP.tombolSuara(kalimatPolos) + '</div></div>' +
      '</div>' +
      '<p class="th-jelas" aria-live="polite">' + APP.teks(jelas) + '</p>';
  }

  /* ---------------- Kontrol ---------------- */
  function kontrolHTML() {
    var tombolG = GENDER.map(function (g) {
      var d = DATA.gender[g];
      return '<button type="button" class="pilih-g ' + APP.kelasGender(g) + '" data-g="' + g + '" aria-pressed="false">' +
        '<span class="pg-art" lang="de">' + esc(d.artikel) + '</span><span class="pg-nama">' + esc(d.nama) + '</span></button>';
    }).join('');
    var tombolK = KASUS.map(function (k) {
      var d = DATA.kasus[k];
      return '<button type="button" class="pilih-k" data-k="' + k + '" aria-pressed="false">' +
        APP.badge(k) + '<span class="pk-tanya" lang="de">' + esc(d.tanyaUtama) + '</span>' +
        '<span class="pk-nama">' + esc(d.nama) + '</span></button>';
    }).join('');
    return '<fieldset><legend>1 · Gender</legend><div class="pilihan pilihan-g">' + tombolG + '</div></fieldset>' +
      '<fieldset><legend>2 · Kasus</legend><div class="pilihan pilihan-k">' + tombolK + '</div></fieldset>' +
      '<fieldset><legend>3 · Artikel</legend><div class="pilihan pilihan-a">' +
        '<button type="button" class="pilih-a" data-tentu="1" aria-pressed="false"><span lang="de">der · das · die</span><small>bestimmt (tentu)</small></button>' +
        '<button type="button" class="pilih-a" data-tentu="0" aria-pressed="false"><span lang="de">ein · eine</span><small>unbestimmt (tak tentu)</small></button>' +
      '</div></fieldset>' +
      '<fieldset><legend>Kata benda</legend><div class="pilihan pilihan-kata"></div></fieldset>';
  }

  function chipKataHTML() {
    var g = st.g;
    var aktif = kataTerpilih(g);
    return (DATA.tabelHidup.pilihan[g] || []).map(function (id) {
      var kata = APP.cariKata(id);
      if (!kata) return '';
      return '<button type="button" class="chip-kata ' + APP.kelasGender(g) + '" data-kata="' + esc(id) + '" lang="de" aria-pressed="' +
        (kata === aktif ? 'true' : 'false') + '">' + esc(g === 'pl' ? kata.pl : kata.sg) + '</button>';
    }).join('');
  }

  /* ---------------- Tabel lengkap ---------------- */
  function isiSel(k, g, opsi) {
    var t = artikel(k, g, true), u = artikel(k, g, false);
    var h;
    if (opsi && opsi.dari) {
      var t0 = artikel(opsi.dari, g, true), u0 = artikel(opsi.dari, g, false);
      var sama = t0 === t && u0 === u;
      h = '<span class="sa-tentu" lang="de">' + APP.morf(t0, t, { tunda: opsi.tunda }) + '</span>' +
        '<span class="sa-taktentu" lang="de">' + APP.morf(u0, u, { tunda: opsi.tunda + 0.15 }) + '</span>' +
        '<span class="sa-tag ' + (sama ? 'sama' : 'beda') + '" style="--tunda:' + (opsi.tunda + 0.6) + 's">' +
        (sama ? '= sama' : 'berubah!') + '</span>';
    } else {
      h = '<span class="sa-tentu" lang="de">' + esc(t) + '</span><span class="sa-taktentu" lang="de">' + esc(u) + '</span>';
    }
    if (k === 'dat' && g === 'pl') h += '<span class="sa-n akhiran"' + (opsi && opsi.dari ? ' style="--tunda:' + (opsi.tunda + 0.6) + 's"' : '') + '>+ -n</span>';
    return h;
  }

  function tabelHTML() {
    var kepala = '<tr><th scope="col"><span class="sr-only">Kasus</span></th>' + GENDER.map(function (g) {
      var d = DATA.gender[g];
      return '<th scope="col" class="' + APP.kelasGender(g) + '"><span class="label-panjang">' + esc(d.nama) + '</span>' +
        '<span class="label-pendek">' + esc(d.singkat) + '</span></th>';
    }).join('') + '</tr>';
    var badan = KASUS.map(function (k) {
      var d = DATA.kasus[k];
      return '<tr class="baris-' + k + '"><th scope="row">' + APP.badge(k) +
        '<span class="th-baris-tanya" lang="de">' + esc(d.tanyaUtama) + '</span></th>' +
        GENDER.map(function (g) {
          var label = d.nama + ' ' + DATA.gender[g].nama + ': ' + artikel(k, g, true) + ', ' +
            (artikel(k, g, false) === '–' ? 'tanpa artikel' : artikel(k, g, false));
          var beda = k !== 'nom' && (artikel(k, g, true) !== artikel('nom', g, true));
          return '<td><button type="button" class="sel-artikel ' + APP.kelasGender(g) + (k === 'akk' ? (beda ? ' berubah' : ' sama') : '') + '"' +
            ' data-k="' + k + '" data-g="' + g + '" aria-pressed="false" aria-label="' + esc(label) + '">' + isiSel(k, g) + '</button></td>';
        }).join('') + '</tr>';
    }).join('');
    return '<table class="th-tabel"><caption class="sr-only">Tabel artikel: kasus dan gender</caption>' +
      '<thead>' + kepala + '</thead><tbody>' + badan + '</tbody></table>';
  }

  /* ---------------- Halaman ---------------- */
  function render(el) {
    var T = DATA.tabelHidup;

    el.innerHTML = APP.kop(BAGIAN, T.intro) +
      '<div class="th-grid">' +
        '<section class="kartu th-kontrol" aria-label="Pilihan">' + kontrolHTML() + '</section>' +
        '<section class="kartu th-panggung" aria-label="Hasil"></section>' +
      '</div>' +
      '<section class="kartu th-tabel-kartu" aria-labelledby="judul-tabel-lengkap">' +
        '<h2 id="judul-tabel-lengkap">Tabel lengkap</h2>' +
        '<p class="petunjuk">' + APP.teks(T.petunjukTabel || '') + '</p>' +
        '<div class="th-tabel-wadah">' + tabelHTML() + '</div>' +
        '<div class="th-aksi">' +
          '<button type="button" class="tombol tombol-garis" data-banding="akk">▶ NOM → AKK: apa yang berubah?</button>' +
          '<button type="button" class="tombol tombol-garis" data-banding="dat">▶ NOM → DAT: apa yang berubah?</button>' +
        '</div>' +
        '<div class="pesan-kunci" data-pesan="akk"><span class="pk-no">1</span><p>' + APP.teks(T.pesanKunci.akk) + '</p></div>' +
        '<div class="pesan-kunci" data-pesan="dat"><span class="pk-no">2</span><p>' + APP.teks(T.pesanKunci.dat) + '</p></div>' +
      '</section>';

    var elPanggung = el.querySelector('.th-panggung');
    var elTabel = el.querySelector('.th-tabel');
    st.tampil = null;

    function perbarui(animasi) {
      el.querySelectorAll('.pilih-g').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-g') === st.g ? 'true' : 'false'); });
      el.querySelectorAll('.pilih-k').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === st.k ? 'true' : 'false'); });
      el.querySelectorAll('.pilih-a').forEach(function (b) {
        b.setAttribute('aria-pressed', (b.getAttribute('data-tentu') === '1') === st.tentu ? 'true' : 'false');
      });
      el.querySelector('.pilihan-kata').innerHTML = chipKataHTML();
      elPanggung.innerHTML = panggungHTML(animasi);
      elTabel.classList.toggle('tentu', st.tentu);
      elTabel.classList.toggle('taktentu', !st.tentu);
      el.querySelectorAll('.sel-artikel').forEach(function (b) {
        var pilih = b.getAttribute('data-k') === st.k && b.getAttribute('data-g') === st.g;
        b.setAttribute('aria-pressed', pilih ? 'true' : 'false');
      });
      el.querySelectorAll('.pesan-kunci').forEach(function (p) {
        p.classList.toggle('aktif', p.getAttribute('data-pesan') === st.k);
      });
    }

    function ulangTabel() {
      KASUS.forEach(function (k) {
        GENDER.forEach(function (g) {
          var b = elTabel.querySelector('.sel-artikel[data-k="' + k + '"][data-g="' + g + '"]');
          if (b) b.innerHTML = isiSel(k, g);
        });
      });
      elTabel.classList.remove('banding-akk', 'banding-dat');
    }

    function bandingkan(k) {
      ulangTabel();
      void elTabel.offsetWidth;   // mulai ulang animasi
      elTabel.classList.add('banding-' + k);
      GENDER.forEach(function (g, i) {
        var b = elTabel.querySelector('.sel-artikel[data-k="' + k + '"][data-g="' + g + '"]');
        if (b) b.innerHTML = isiSel(k, g, { dari: 'nom', tunda: 0.3 + i * 0.5 });
      });
      el.querySelectorAll('.pesan-kunci').forEach(function (x) { x.classList.toggle('aktif', x.getAttribute('data-pesan') === k); });
      var p = el.querySelector('.pesan-kunci[data-pesan="' + k + '"]');
      if (p) {
        p.classList.remove('sorot');
        void p.offsetWidth;
        p.classList.add('sorot');
      }
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-g], [data-k], [data-tentu], [data-kata], [data-banding]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-banding')) { bandingkan(t.getAttribute('data-banding')); return; }
      if (t.classList.contains('sel-artikel')) {
        st.k = t.getAttribute('data-k');
        st.g = t.getAttribute('data-g');
      } else if (t.hasAttribute('data-kata')) {
        st.kata[st.g] = t.getAttribute('data-kata');
      } else if (t.hasAttribute('data-tentu')) {
        st.tentu = t.getAttribute('data-tentu') === '1';
      } else if (t.hasAttribute('data-g')) {
        st.g = t.getAttribute('data-g');
      } else if (t.hasAttribute('data-k')) {
        st.k = t.getAttribute('data-k');
      }
      APP.simpan.tandai(BAGIAN, st.k + '-' + st.g);
      perbarui(true);
    });

    perbarui(false);
  }

  APP.bagian.tabel = {
    render: render,
    progres: function () {
      var kunci = [];
      KASUS.forEach(function (k) { GENDER.forEach(function (g) { kunci.push(k + '-' + g); }); });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'kombinasi dicoba';
      return p;
    }
  };
})();

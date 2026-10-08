/* =====================================================================
 * Bagian 11 — Ringkasan cetak
 * Semua tabel dalam satu halaman. Isinya diambil dari bagian lain di data.js,
 * jadi ringkasan selalu sama dengan isi website. Tata letak cetak ada di css/cetak.css.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var GENDER = ['m', 'n', 'f', 'pl'];
  var KASUS = ['nom', 'akk', 'dat'];

  function blok(id, judul, isi, kelas) {
    return '<section class="rk-blok' + (kelas ? ' ' + kelas : '') + '" aria-labelledby="rk-' + id + '">' +
      '<h2 id="rk-' + id + '">' + judul + '</h2>' + isi + '</section>';
  }

  function blokKasus() {
    var J = DATA.beranda.jangkar;
    var frasa = {};
    APP.potong(J.kalimat).forEach(function (p) { if (p.jenis === 'frase' && p.kasus) frasa[p.kasus] = p; });
    var baris = KASUS.map(function (k) {
      var d = DATA.kasus[k], p = frasa[k];
      return '<tr><th scope="row">' + APP.badge(k) + ' <span>' + esc(d.nama) + '</span></th>' +
        '<td lang="de"><b>' + esc(d.tanya) + '</b></td><td>' + esc(d.peran) + '</td>' +
        '<td lang="de">' + (p ? APP.teks('[' + p.g + '|' + p.isi + ']') : '') + '</td></tr>';
    }).join('');
    // kalimat jangkar tanpa badge: badge kasusnya sudah ada di tabel di bawahnya
    return '<p class="rk-jangkar de" lang="de">' + APP.teks(J.kalimat.replace(/\|(NOM|AKK|DAT)\]/g, ']')) + '</p>' +
      '<table class="rk-tabel"><thead><tr><th scope="col">Kasus</th><th scope="col">Pertanyaan</th><th scope="col">Peran</th><th scope="col">Contoh</th></tr></thead>' +
      '<tbody>' + baris + '</tbody></table>';
  }

  function blokArtikel() {
    var kepala = '<tr><th scope="col"></th>' + GENDER.map(function (g) {
      return '<th scope="col" class="fr ' + APP.kelasGender(g) + '"><span class="label-panjang">' + esc(DATA.gender[g].nama) + '</span>' +
        '<span class="label-pendek">' + esc(DATA.gender[g].singkat) + '</span></th>';
    }).join('') + '</tr>';
    var badan = KASUS.map(function (k) {
      return '<tr><th scope="row">' + APP.badge(k) + '</th>' + GENDER.map(function (g) {
        var t = DATA.artikel.tentu[k][g], u = DATA.artikel.taktentu[k][g];
        var tambahN = k === 'dat' && g === 'pl' ? ' <span class="akhiran">+ -n</span>' : '';
        var beda = k !== 'nom' && t !== DATA.artikel.tentu.nom[g];
        return '<td class="fr ' + APP.kelasGender(g) + (beda ? ' rk-beda' : '') + '" lang="de">' + esc(t) + ' / ' + esc(u) + tambahN + '</td>';
      }).join('') + '</tr>';
    }).join('');
    var P = DATA.tabelHidup.pesanKunci;
    return '<table class="rk-tabel rk-artikel"><thead>' + kepala + '</thead><tbody>' + badan + '</tbody></table>' +
      '<p class="rk-kecil">Kotak bergaris tebal = artikel yang berubah dari Nominativ.</p>' +
      '<ol class="rk-kunci"><li>' + APP.teks(P.akk) + '</li><li>' + APP.teks(P.dat) + '</li></ol>';
  }

  function blokVerben() {
    var V = DATA.verben;
    return '<div class="rk-verben">' + ['akk', 'dat', 'akkDat'].map(function (k) {
      return '<div><p class="rk-verben-kop">' + esc(V.kotak[k].label) + ' <span lang="de">· ' + esc(V.kotak[k].tanya) + '</span></p>' +
        '<ul>' + V[k].map(function (v) { return '<li><b lang="de">' + esc(v.verb) + '</b> <span class="rk-arti">' + esc(v.arti) + '</span></li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  // tabel dari halaman buku (Bagian 2): isi sel sama persis dengan kartu A–F
  function blokKartu(c) {
    var kolom = c.kolom || [];
    var isi = '<table class="rk-tabel"><thead><tr>' + kolom.map(function (k) {
      return '<th scope="col">' + esc(k.label || '') + '</th>';
    }).join('') + '</tr></thead><tbody>' + c.baris.map(function (b) {
      return '<tr>' + b.sel.map(function (s, j) {
        return '<td lang="de"' + (kolom[j] && kolom[j].sempit ? ' class="rk-sempit"' : '') + '>' + APP.teks(s) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
    var catatan = (c.catatan || []).map(function (x) {
      return '<li>' + (typeof x === 'string' ? APP.teks(x) : '<span lang="de">' + APP.teks(x.de) + '</span> (' + APP.teks(x.id) + ')') + '</li>';
    }).join('');
    return blok('kartu-' + c.id, '<span class="rk-huruf">' + esc(c.id) + '</span> <span lang="de">' + esc(c.judul) + '</span>',
      isi + (catatan ? '<ul class="rk-catatan">' + catatan + '</ul>' : ''));
  }

  function blokOrt() {
    var R = DATA.ringkasan;
    return '<table class="rk-tabel"><thead><tr><th scope="col">Pertanyaan</th><th scope="col">Orang</th><th scope="col">Gedung / tempat</th></tr></thead><tbody>' +
      R.ort.map(function (o) {
        return '<tr><th scope="row" lang="de">' + esc(o.tanya) + ' <span class="rk-arti">' + esc(o.arti) + '</span></th>' +
          '<td lang="de">' + APP.teks(o.orang) + '</td><td lang="de">' + APP.teks(o.gedung) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p class="rk-kecil">Kurzformen: <span lang="de">zu + dem = zum · zu + der = zur · bei + dem = beim · von + dem = vom · in + dem = im</span></p>';
  }

  function render(el) {
    var R = DATA.ringkasan;
    var kartu = DATA.grammatik.kartu;
    el.innerHTML = APP.kop('ringkasan', R.intro) +
      '<p class="rk-alat"><button type="button" class="tombol tombol-utama" data-aksi="cetak">🖨️ Cetak ringkasan</button></p>' +
      '<article class="rk" aria-label="Ringkasan">' +
        '<header class="rk-kop"><p class="rk-merek">' + esc(DATA.pengaturan.judul) + '</p><h2 class="rk-judul">' + esc(R.judul) + '</h2>' +
          '<p class="rk-legenda">' + GENDER.map(function (g) {
            return '<span class="fr ' + APP.kelasGender(g) + '">■ ' + esc(DATA.gender[g].nama) + '</span>';
          }).join(' ') + ' <span class="akhiran">-n</span> · ' + KASUS.map(function (k) { return APP.badge(k); }).join(' ') + '</p>' +
        '</header>' +
        '<div class="rk-grid">' +
          blok('kasus', esc(R.judulBlok.kasus), blokKasus()) +
          blok('artikel', esc(R.judulBlok.artikel), blokArtikel()) +
          blok('verben', esc(R.judulBlok.verben), blokVerben()) +
          blok('ort', esc(R.judulBlok.ort), blokOrt()) +
          kartu.map(blokKartu).join('') +
        '</div>' +
      '</article>';

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-aksi="cetak"]');
      if (t) window.print();
    });
  }

  APP.bagian.ringkasan = { render: render };
})();

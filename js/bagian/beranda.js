/* =====================================================================
 * Bagian 1 — Beranda
 * Kalimat jangkar "Wer? Wen? Wem?", kode warna, dan peta belajar.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var URUTAN = ['nom', 'akk', 'dat'];

  function kalimatJangkar(J) {
    return APP.potong(J.kalimat).map(function (p) {
      if (p.jenis === 'teks') return APP.teks(p.isi);
      if (!p.kasus) return APP.teks('[' + p.g + '|' + p.isi + ']');
      return '<button type="button" class="potongan fr ber-kasus ' + APP.kelasGender(p.g) + '" data-kasus="' + p.kasus + '"' +
        ' aria-expanded="false" aria-controls="peran-' + p.kasus + '">' + APP.teks(p.isi) + APP.badge(p.kasus) + '</button>';
    }).join('');
  }

  function kartuPeran(J, k) {
    var d = DATA.kasus[k], p = J.peran[k];
    if (!p) return '';
    return '<div class="peran k-' + k + '" id="peran-' + k + '">' +
      '<button type="button" class="peran-kop" data-kasus="' + k + '" aria-expanded="false">' +
        '<span class="peran-tanya" lang="de">' + esc(d.tanya) + '</span>' +
        '<span class="peran-label">' + APP.badge(k, true) + '<span class="peran-nama-kasus">' + esc(d.nama) + '</span></span>' +
        '<span class="peran-petunjuk">Ketuk untuk melihat jawabannya</span>' +
      '</button>' +
      '<div class="peran-isi" hidden>' +
        '<p class="peran-peran">' + esc(d.peran) + '</p>' +
        APP.kalimat({ de: p.tanya + ' – ' + p.jawab, id: p.id }) +
        '<p class="peran-jelas">' + APP.teks(d.jelas) + '</p>' +
      '</div>' +
    '</div>';
  }

  function legenda() {
    var g = DATA.gender;
    var gender = ['m', 'n', 'f', 'pl'].map(function (k) {
      return '<li class="lg ' + APP.kelasGender(k) + '">' +
        '<span class="lg-chip">' + esc(g[k].artikel) + '</span>' +
        '<span class="lg-teks"><b>' + esc(g[k].nama) + '</b> · <span class="de" lang="de">' + APP.teks(g[k].contoh) + '</span>' +
        (g[k].catatan ? '<span class="lg-catatan">' + APP.teks(g[k].catatan) + '</span>' : '') + '</span></li>';
    }).join('');
    var kasus = URUTAN.map(function (k) {
      return '<li>' + APP.badge(k, true) + '<span>' + APP.teks(DATA.kasus[k].jelas) + '</span></li>';
    }).join('');
    return '<section class="kartu legenda" aria-labelledby="judul-legenda">' +
      '<h2 id="judul-legenda">Kode warna dan label</h2>' +
      '<div class="legenda-grid">' +
        '<div><h3>Warna = gender</h3><ul class="legenda-gender">' + gender + '</ul></div>' +
        '<div><h3>Label = kasus</h3><ul class="legenda-kasus">' + kasus + '</ul>' +
        '<p class="legenda-catatan">Warna selalu menunjukkan <b>gender</b>. Kasus selalu ditandai dengan <b>label</b> seperti ' +
        APP.badge('dat') + '.</p></div>' +
      '</div></section>';
  }

  function peta() {
    var terakhir = APP.menuItem(APP.simpan.ambil('terakhir', ''));
    var lanjut = terakhir && terakhir.id !== 'beranda'
      ? '<a class="tombol tombol-utama" href="#/' + terakhir.id + '">▶ Lanjutkan: ' + esc(terakhir.judul) + '</a>' : '';
    var kartu = DATA.menu.filter(function (m) { return m.id !== 'beranda'; }).map(function (m) {
      var status;
      if (!m.siap) {
        status = '<span class="chip-segera">Segera hadir</span>';
      } else {
        var mod = APP.bagian[m.id];
        var p = mod && mod.progres ? mod.progres() : null;
        if (p && p.total) {
          var persen = Math.round(100 * p.selesai / p.total);
          status = '<span class="peta-progres"><span class="bar" aria-hidden="true"><span class="bar-isi" style="width:' + persen + '%"></span></span>' +
            '<span class="peta-angka">' + p.selesai + ' dari ' + p.total + ' ' + esc(p.satuan || '') + (p.selesai === p.total ? ' ✓' : '') + '</span>' +
            (p.catatan ? '<span class="peta-catatan">' + esc(p.catatan) + '</span>' : '') + '</span>';
        } else {
          status = '';
        }
      }
      return '<li><a class="peta-kartu' + (m.siap ? '' : ' belum') + '" href="#/' + m.id + '">' +
        '<span class="peta-atas"><span class="peta-no">' + APP.nomorBagian(m.id) + '</span>' +
        '<span class="peta-ikon" aria-hidden="true">' + m.ikon + '</span></span>' +
        '<span class="peta-judul">' + esc(m.judul) + '</span>' +
        '<span class="peta-ringkas">' + APP.teks(m.ringkas) + '</span>' + status + '</a></li>';
    }).join('');
    return '<section class="peta" aria-labelledby="judul-peta">' +
      '<div class="peta-kop"><h2 id="judul-peta">Peta belajar</h2>' + lanjut + '</div>' +
      '<ol class="peta-grid">' + kartu + '</ol></section>';
  }

  function kaki() {
    var info = [];
    if (!APP.simpan.bisa()) info.push('Browser ini tidak bisa menyimpan progress (mungkin mode privat). Website tetap bisa dipakai, tetapi progress hilang saat halaman ditutup.');
    if (!APP.suara.ok) info.push('Audio pengucapan tidak tersedia di browser ini. Coba Chrome atau Edge terbaru.');
    return '<section class="beranda-kaki">' +
      info.map(function (t) { return '<p class="info">' + esc(t) + '</p>'; }).join('') +
      '<button type="button" class="tombol tombol-garis kecil" data-aksi="hapus">Hapus progress di perangkat ini</button>' +
      '</section>';
  }

  function render(el) {
    var B = DATA.beranda, J = B.jangkar;
    var terbuka = {};

    el.innerHTML =
      '<header class="kop-beranda">' +
        '<p class="nomor">Deutsch A1 · Kasus</p>' +
        '<h1 tabindex="-1">' + esc(B.judul) + '</h1>' +
        '<p class="sub">' + APP.teks(B.sub) + '</p>' +
      '</header>' +
      '<section class="kartu jangkar" aria-labelledby="judul-jangkar">' +
        '<h2 id="judul-jangkar">Satu kalimat, tiga peran</h2>' +
        '<p class="pengantar">' + APP.teks(B.pengantar) + '</p>' +
        '<p class="jangkar-ikon hias" aria-hidden="true">' +
          (J.ikon || []).map(function (i) { return '<span>' + i + '</span>'; }).join('<span class="panah">→</span>') + '</p>' +
        '<div class="jangkar-kalimat">' +
          '<p class="de" lang="de">' + kalimatJangkar(J) + '</p>' + APP.tombolSuara(J.kalimat) +
        '</div>' +
        '<p class="kal-id jangkar-id">' + APP.teks(J.id) + '</p>' +
        '<p class="petunjuk">👆 Ketuk bagian yang berwarna, atau ketuk pertanyaan di bawah.</p>' +
        '<div class="peran-grid">' + URUTAN.map(function (k) { return kartuPeran(J, k); }).join('') + '</div>' +
        '<p class="jangkar-aksi"><button type="button" class="tombol tombol-garis" data-aksi="semua">Tampilkan semua</button></p>' +
      '</section>' +
      legenda() + peta() + kaki();

    function setel(k, buka) {
      terbuka[k] = buka;
      el.querySelectorAll('[data-kasus="' + k + '"]').forEach(function (b) {
        b.setAttribute('aria-expanded', buka ? 'true' : 'false');
        b.classList.toggle('terbuka', buka);
      });
      var kartu = el.querySelector('#peran-' + k);
      if (kartu) {
        kartu.classList.toggle('terbuka', buka);
        kartu.querySelector('.peran-isi').hidden = !buka;
      }
      var semua = URUTAN.every(function (x) { return terbuka[x]; });
      var btn = el.querySelector('[data-aksi="semua"]');
      if (btn) btn.textContent = semua ? 'Sembunyikan semua' : 'Tampilkan semua';
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-kasus], [data-aksi]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-kasus')) {
        var k = t.getAttribute('data-kasus');
        setel(k, !terbuka[k]);
        return;
      }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'semua') {
        var buka = !URUTAN.every(function (x) { return terbuka[x]; });
        URUTAN.forEach(function (k) { setel(k, buka); });
      } else if (aksi === 'hapus') {
        if (window.confirm('Hapus semua progress di perangkat ini?')) {
          APP.simpan.hapusSemua();
          // gambar ulang di wadah baru (supaya pendengar klik tidak dobel)
          var baru = el.cloneNode(false);
          el.parentNode.replaceChild(baru, el);
          render(baru);
          var h1 = baru.querySelector('h1');
          if (h1) h1.focus();
        }
      }
    });
  }

  APP.bagian.beranda = { render: render };
})();

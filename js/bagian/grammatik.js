/* =====================================================================
 * Bagian 2 — Gambar grammatik
 * Semua tabel dari halaman buku (A–F) sebagai kartu interaktif.
 * Klik baris → penjelasan, audio, contoh lain, dan animasi artikel.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'grammatik';

  function kunciBaris(kartu, i) { return kartu.id + (i + 1); }

  function semuaKunci() {
    var k = [];
    DATA.grammatik.kartu.forEach(function (c) {
      (c.baris || []).forEach(function (_, i) { k.push(kunciBaris(c, i)); });
    });
    return k;
  }

  /* ---------------- Animasi di dalam panel ---------------- */
  var LABEL_POSISI = ['Posisi 0', 'Posisi 1', 'Posisi 2 · verba', '…'];

  function posisiHTML(pos) {
    return '<div class="posisi-wadah"><p class="posisi-judul">Kalimat 2:</p><div class="posisi" lang="de">' +
      pos.map(function (isi, i) {
        var kls = 'pos pos-' + i + (i === 0 && !isi ? ' kosong' : '');
        return '<span class="' + kls + '" style="--i:' + i + '">' +
          '<span class="pos-no">' + LABEL_POSISI[Math.min(i, 3)] + '</span>' +
          '<span class="pos-isi">' + (isi ? APP.teks(isi) : '—') + '</span></span>';
      }).join('') + '</div></div>';
  }

  var RE_MORF = /^\s*(m|n|f|pl|-)\s*:\s*(.+?)\s*→\s*(.+?)\s*$/;
  function morfItem(s, i) {
    var m = RE_MORF.exec(s);
    if (!m) return '<span class="morf-item">' + APP.teks(s) + '</span>';
    var dari = m[2], ke = m[3];
    var akhiran = m[1] === 'pl' && ke === dari + 'n';
    return '<span class="morf-item">' +
      '<span class="morf-kata fr ' + APP.kelasGender(m[1]) + '" lang="de">' +
        APP.morf(dari, ke, { tunda: 0.5 + i * 0.45, akhiran: akhiran }) + '</span>' +
      '<span class="morf-rumus" lang="de">' + esc(dari) + ' → ' + esc(ke) + '</span></span>';
  }

  var RE_LEBUR = /^\s*(\S+)\s*\+\s*(\S+)\s*=\s*(\S+)\s*$/;
  function leburItem(s, i) {
    var m = RE_LEBUR.exec(s);
    if (!m) return '<span class="lebur-item">' + APP.teks(s) + '</span>';
    return '<span class="lebur-wadah" style="--tunda:' + (0.5 + i * 0.7) + 's">' + APP.lebur(m[1], m[2], m[3]) + '</span>';
  }

  function animasiHTML(b) {
    var h = '';
    if (b.posisi) h += posisiHTML(b.posisi);
    if (b.morf && b.morf.length) h += '<div class="morf-daftar">' + b.morf.map(morfItem).join('') + '</div>';
    if (b.lebur && b.lebur.length) h += '<div class="lebur-daftar">' + b.lebur.map(leburItem).join('') + '</div>';
    return h;
  }

  function panelHTML(b) {
    var anim = animasiHTML(b);
    return (anim ? '<div class="g-anim"><div class="g-anim-isi">' + anim + '</div>' +
        '<button type="button" class="tombol tombol-garis kecil" data-ulang>↻ Putar lagi</button></div>' : '') +
      (b.penjelasan ? '<p class="penjelasan">' + APP.teks(b.penjelasan) + '</p>' : '') +
      (b.kalimat && b.kalimat.length ? '<div class="kal-daftar">' + b.kalimat.map(function (k) { return APP.kalimat(k); }).join('') + '</div>' : '') +
      (b.contoh && b.contoh.length ? '<h4 class="contoh-judul">Contoh lain</h4><div class="kal-daftar kal-contoh">' +
        b.contoh.map(function (k) { return APP.kalimat(k); }).join('') + '</div>' : '');
  }

  /* ---------------- Kartu & tabel ---------------- */
  function templatKolom(kolom) {
    return kolom.map(function (k) { return k.sempit ? 'auto' : 'minmax(0, 1fr)'; }).join(' ');
  }

  function kartuHTML(c) {
    var kolom = c.kolom || [];
    var kop = '<div class="gkop" aria-hidden="true">' + kolom.map(function (k) {
      return '<span class="gsel' + (k.sempit ? ' sempit' : '') + (k.penuh ? ' penuh' : '') + '">' +
        (k.pendek ? '<span class="label-panjang">' + esc(k.label) + '</span><span class="label-pendek">' + esc(k.pendek) + '</span>' : esc(k.label || '')) +
        '</span>';
    }).join('') + '</div>';

    var baris = (c.baris || []).map(function (b, i) {
      var kunci = kunciBaris(c, i);
      var sel = (b.sel || []).map(function (s, j) {
        var k = kolom[j] || {};
        var tag = j === 0 && b.g ? '<span class="tag-g ' + APP.kelasGender(b.g) + '">' + esc(DATA.gender[b.g] ? DATA.gender[b.g].nama : b.g) + '</span>' : '';
        return '<span class="gsel' + (k.sempit ? ' sempit' : '') + (k.penuh ? ' penuh' : '') + '" data-label="' + esc(k.label || '') + '">' +
          tag + '<span class="de" lang="de">' + APP.teks(s) + '</span></span>';
      }).join('');
      return '<div class="gitem">' +
        '<button type="button" class="gbaris' + (APP.simpan.sudah(BAGIAN, kunci) ? ' dilihat' : '') + '" aria-expanded="false" ' +
          'aria-controls="panel-' + kunci + '" data-kunci="' + kunci + '">' + sel +
          '<span class="gstatus" aria-hidden="true"></span></button>' +
        '<div class="gpanel" id="panel-' + kunci + '" hidden></div>' +
      '</div>';
    }).join('');

    var catatan = c.catatan && c.catatan.length
      ? '<ul class="catatan">' + c.catatan.map(APP.catatan).join('') + '</ul>' : '';

    return '<section class="kartu kartu-gram" id="kartu-' + c.id + '" aria-labelledby="judul-' + c.id + '">' +
      '<div class="kartu-kop"><span class="huruf" aria-hidden="true">' + esc(c.id) + '</span>' +
        '<div><h2 id="judul-' + c.id + '" lang="de"><span class="sr-only">' + esc(c.id) + '. </span>' + esc(c.judul) + '</h2>' +
        (c.sub ? '<p class="kartu-sub">' + APP.teks(c.sub) + '</p>' : '') + '</div></div>' +
      (c.intro ? '<p class="kartu-intro">' + APP.teks(c.intro) + '</p>' : '') +
      '<div class="gtabel' + (c.tumpuk ? ' tumpuk' : '') + '" style="--kolom:' + templatKolom(kolom) + '">' + kop + baris + '</div>' +
      catatan +
    '</section>';
  }

  /* ---------------- Halaman ---------------- */
  function render(el, param) {
    var G = DATA.grammatik;
    var daftar = G.kartu.map(function (c) { return c; });
    var cariBaris = {};
    daftar.forEach(function (c) { (c.baris || []).forEach(function (b, i) { cariBaris[kunciBaris(c, i)] = b; }); });

    el.innerHTML = APP.kop(BAGIAN, G.intro) +
      '<div class="g-alat">' +
        '<button type="button" class="tombol tombol-utama" data-aksi="gambar">📖 Lihat gambar asli dari buku</button>' +
        '<nav class="lompat" aria-label="Lompat ke bagian">' + daftar.map(function (c) {
          return '<button type="button" class="lompat-btn" data-lompat="' + esc(c.id) + '" title="' + esc(c.judul) + '">' + esc(c.id) + '</button>';
        }).join('') + '</nav>' +
      '</div>' +
      '<p class="petunjuk">👆 Klik atau ketuk satu baris tabel untuk penjelasan, audio, dan contoh lain.</p>' +
      daftar.map(kartuHTML).join('') +
      '<dialog class="dialog-gambar" aria-labelledby="judul-gambar">' +
        '<div class="dialog-kop"><h2 id="judul-gambar">Gambar asli dari buku</h2>' +
        '<button type="button" class="tombol-tutup" data-aksi="tutup" aria-label="Tutup gambar">✕</button></div>' +
        '<div class="dialog-isi"><img alt="Halaman grammatik dari buku: und, oder, aber · Dativ · Präpositionen mit Dativ" hidden>' +
        '<p class="gambar-galat" hidden>Gambarnya belum ada. Salin file <b>' + esc(G.gambar) + '</b> ke folder website ' +
        '(di sebelah <b>index.html</b>), lalu muat ulang halaman ini.</p></div>' +
      '</dialog>';

    var dialog = el.querySelector('.dialog-gambar');
    var img = dialog.querySelector('img');
    var galat = dialog.querySelector('.gambar-galat');
    img.addEventListener('load', function () { img.hidden = false; galat.hidden = true; });
    img.addEventListener('error', function () { img.hidden = true; galat.hidden = false; });

    function bukaGambar() {
      if (!img.getAttribute('src')) img.setAttribute('src', G.gambar);
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }
    function tutupGambar() {
      if (typeof dialog.close === 'function') { if (dialog.open) dialog.close(); } else { dialog.removeAttribute('open'); }
    }
    dialog.addEventListener('click', function (e) { if (e.target === dialog) tutupGambar(); });

    function bukaTutup(btn) {
      var kunci = btn.getAttribute('data-kunci');
      var panel = el.querySelector('#panel-' + kunci);
      var buka = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', buka ? 'true' : 'false');
      if (buka) {
        panel.innerHTML = panelHTML(cariBaris[kunci] || {});
        panel.hidden = false;
        btn.classList.add('dilihat');
        APP.simpan.tandai(BAGIAN, kunci);
      } else {
        panel.hidden = true;
        APP.suara.henti();
      }
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('.gbaris, [data-ulang], [data-lompat], [data-aksi]');
      if (!t || !el.contains(t)) return;
      if (t.classList.contains('gbaris')) { bukaTutup(t); return; }
      if (t.hasAttribute('data-ulang')) {
        var panel = t.closest('.gpanel');
        var isi = panel && panel.querySelector('.g-anim-isi');
        var kunci = panel && panel.id.replace('panel-', '');
        if (isi && cariBaris[kunci]) isi.innerHTML = animasiHTML(cariBaris[kunci]);
        return;
      }
      if (t.hasAttribute('data-lompat')) {
        var kartu = el.querySelector('#kartu-' + t.getAttribute('data-lompat'));
        if (kartu) kartu.scrollIntoView({ behavior: APP.gerakDikurangi() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'gambar') bukaGambar();
      else if (aksi === 'tutup') tutupGambar();
    });

    // Alamat seperti #/grammatik/D → langsung ke kartu D
    if (param) {
      var tujuan = el.querySelector('#kartu-' + String(param).toUpperCase());
      if (tujuan) {
        window.requestAnimationFrame(function () { tujuan.scrollIntoView({ block: 'start' }); });
      } else {
        window.scrollTo(0, 0);
      }
    }

    return function () { tutupGambar(); };
  }

  APP.bagian.grammatik = {
    render: render,
    progres: function () {
      var p = APP.hitungProgres(BAGIAN, semuaKunci());
      p.satuan = 'baris dibuka';
      return p;
    }
  };
})();

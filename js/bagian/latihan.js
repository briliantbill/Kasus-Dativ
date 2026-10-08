/* =====================================================================
 * Bagian 9 — Latihan berlevel
 * Level 1: pilihan ganda artikel · Level 2: isian · Level 3: mini-dialog.
 * Progress bar, alasan untuk setiap jawaban, lencana di akhir level.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'latihan';
  var LEVEL = ['level1', 'level2', 'level3'];
  var KUNCI_TERBAIK = 'latihanTerbaik';

  var st = { tampil: 'menu', level: null, urutan: [], pos: 0, benar: 0, opsi: [], jawab: null };

  function L() { return DATA.latihan; }
  function nomorLevel(lv) { return LEVEL.indexOf(lv) + 1; }

  function normal(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[.,!?;:]+$/, '').replace(/\s+/g, ' ').trim();
  }

  function lencanaUntuk(persen) {
    var daftar = L().lencana || [];
    for (var i = 0; i < daftar.length; i++) if (persen >= daftar[i].min) return daftar[i];
    return daftar[daftar.length - 1] || { ikon: '⭐', nama: '', teks: '' };
  }

  function terbaik() {
    var t = APP.simpan.ambil(KUNCI_TERBAIK, {});
    return t && typeof t === 'object' ? t : {};
  }

  /* ---------------- Tampilan soal ---------------- */
  function isiLubang(teksBertanda, isi) {
    var h = APP.teks(teksBertanda);
    return h.replace('___', isi == null
      ? '<span class="lubang" aria-label="tempat kosong">___</span>'
      : '<b class="lt-isi">' + esc(isi) + '</b>');
  }

  function soalSekarang() {
    var lv = L()[st.level];
    return { lv: lv, s: lv.soal[st.urutan[st.pos]], indeks: st.urutan[st.pos] };
  }

  function soalHTML(lv, s) {
    var jawab = st.jawab;
    var isi = jawab ? s.jawaban : null;
    if (lv.jenis === 'dialog') {
      var garis = s.dialog.map(function (d) {
        var ada = d.de.indexOf('___') >= 0;
        return '<div class="lt-garis' + (ada ? ' ada-lubang' : '') + '"><span class="lt-pembicara">' + esc(d.s) + '</span>' +
          '<span class="de" lang="de">' + (ada ? isiLubang(d.de, isi) : APP.teks(d.de)) + '</span></div>';
      }).join('');
      var ucapan = s.dialog.map(function (d) { return d.de.replace('___', s.jawaban); }).join(' ');
      return '<div class="lt-dialog">' + (s.tema ? '<p class="lt-tema">' + esc(s.tema) + '</p>' : '') + garis +
        (jawab ? '<p class="lt-dengar">' + APP.tombolSuara(ucapan) + ' Dengarkan dialognya</p>' : '') + '</div>';
    }
    return '<div class="kal-de lt-kalimat"><span class="de" lang="de">' + isiLubang(s.soal, isi) + '</span>' +
      (jawab ? APP.tombolSuara(s.soal.replace('___', s.jawaban)) : '') + '</div>' +
      (s.petunjuk ? '<p class="lt-kurung">(<span lang="de">' + esc(s.petunjuk) + '</span>)</p>' : '');
  }

  function jawabHTML(lv, s) {
    var jawab = st.jawab;
    if (lv.jenis === 'isi') {
      return '<form class="lt-isian" autocomplete="off">' +
        '<label class="sr-only" for="lt-masukan">Jawaban</label>' +
        '<input id="lt-masukan" class="lt-masukan' + (jawab ? (jawab.benar ? ' benar' : ' salah') : '') + '" type="text" lang="de"' +
        ' autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done"' +
        (jawab ? ' readonly value="' + esc(jawab.masukan) + '"' : '') + ' placeholder="tulis di sini">' +
        (jawab ? '' : '<button type="submit" class="tombol tombol-utama">Periksa</button>') +
        '</form>';
    }
    return '<div class="lt-opsi-daftar">' + st.opsi.map(function (o) {
      var kls = 'lt-opsi';
      if (jawab) {
        if (o === s.jawaban) kls += ' benar';
        else if (o === jawab.masukan) kls += ' salah';
      }
      var tanda = jawab && o === s.jawaban ? ' ✓' : (jawab && o === jawab.masukan ? ' ✗' : '');
      return '<button type="button" class="' + kls + '" data-opsi="' + esc(o) + '" lang="de"' + (jawab ? ' disabled' : '') + '>' +
        esc(o) + (tanda ? '<span class="lt-tanda">' + tanda + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  /* ---------------- Halaman ---------------- */
  function render(el) {
    el.innerHTML = APP.kop(BAGIAN, L().intro) + '<div class="lt-isi-halaman"></div>';
    var wadah = el.querySelector('.lt-isi-halaman');

    function tampilMenu() {
      st.tampil = 'menu';
      var tb = terbaik();
      wadah.innerHTML = '<div class="lt-level-grid">' + LEVEL.map(function (lv) {
        var d = L()[lv];
        if (!d || !d.soal) return '';
        var t = tb[lv];
        var pr = APP.hitungProgres(BAGIAN, d.soal.map(function (_, i) { return lv + '-' + (i + 1); }));
        return '<section class="kartu lt-level" aria-labelledby="judul-' + lv + '">' +
          '<p class="lt-level-ikon" aria-hidden="true">' + esc(d.ikon || '') + '</p>' +
          '<h2 id="judul-' + lv + '">' + esc(d.judul) + '</h2>' +
          '<p class="lt-level-sub">' + APP.teks(d.sub) + '</p>' +
          '<p class="lt-level-info">' + d.soal.length + ' soal · ' + pr.selesai + ' pernah benar</p>' +
          '<span class="bar" aria-hidden="true"><span class="bar-isi" style="width:' + Math.round(100 * pr.selesai / d.soal.length) + '%"></span></span>' +
          '<p class="lt-terbaik">' + (t ? 'Terbaik: <b>' + t.benar + '/' + t.total + '</b> <span class="lt-lencana-kecil" title="' + esc(t.nama || '') + '">' + esc(t.ikon || '') + '</span>'
            : 'Belum dicoba') + '</p>' +
          '<button type="button" class="tombol tombol-utama" data-mulai="' + lv + '">' + (t ? 'Ulangi ' : 'Mulai ') + esc(d.judul) + '</button>' +
          '</section>';
      }).join('') + '</div>';
    }

    function mulai(lv) {
      var d = L()[lv];
      st = { tampil: 'kuis', level: lv, urutan: APP.acak(d.soal.map(function (_, i) { return i; })), pos: 0, benar: 0, opsi: [], jawab: null };
      siapkanSoal();
      tampilKuis();
      fokusJawab();
    }

    function siapkanSoal() {
      var c = soalSekarang();
      st.jawab = null;
      st.opsi = c.s.pilihan ? APP.acak(c.s.pilihan) : [];
    }

    function tampilKuis() {
      var c = soalSekarang(), lv = c.lv, s = c.s;
      var total = st.urutan.length;
      var tampilArti = lv.jenis !== 'dialog' || st.jawab;
      wadah.innerHTML = '<section class="kartu lt-kuis" aria-label="' + esc(lv.judul) + '">' +
        '<div class="lt-atas"><span class="lt-nomor"><b>' + esc(lv.judul) + '</b> · Soal ' + (st.pos + 1) + ' dari ' + total + '</span>' +
          '<span class="lt-skor">⭐ ' + st.benar + '</span>' +
          '<button type="button" class="tombol tombol-garis kecil" data-aksi="keluar">✕ Keluar</button></div>' +
        '<span class="bar lt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + (st.pos + (st.jawab ? 1 : 0)) + '" aria-label="Progress level">' +
          '<span class="bar-isi" style="width:' + Math.round(100 * (st.pos + (st.jawab ? 1 : 0)) / total) + '%"></span></span>' +
        '<p class="lt-petunjuk">' + APP.teks(lv.petunjuk || '') + '</p>' +
        '<div class="lt-soal">' + soalHTML(lv, s) + '</div>' +
        (tampilArti && s.id ? '<p class="kal-id lt-arti">' + APP.teks(s.id) + '</p>' : '') +
        '<div class="lt-jawab">' + jawabHTML(lv, s) + '</div>' +
        '<div class="lt-umpan" aria-live="polite">' + (st.jawab ? st.jawab.umpan : '') + '</div>' +
        (st.jawab ? '<div class="lt-aksi"><button type="button" class="tombol tombol-utama" data-aksi="lanjut">' +
          (st.pos + 1 < total ? 'Soal berikutnya →' : 'Lihat hasil 🏅') + '</button></div>' : '') +
        '</section>';
    }

    function fokusJawab() {
      var x = wadah.querySelector('#lt-masukan:not([readonly])') || wadah.querySelector('.lt-opsi:not([disabled])');
      if (x) { try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }
    }

    function periksa(masukan) {
      var c = soalSekarang(), s = c.s, lv = c.lv, T = L().teks;
      var benar, khusus = '';
      if (lv.jenis === 'isi') {
        var n = normal(masukan);
        if (!n) {
          var u = wadah.querySelector('.lt-umpan');
          u.innerHTML = '<p class="petunjuk">' + APP.teks(T.kosong) + '</p>';
          fokusJawab();
          return;
        }
        var semua = [s.jawaban].concat(s.terima || []).map(normal);
        benar = semua.indexOf(n) >= 0;
        if (!benar && s.panjang && n === normal(s.panjang)) khusus = APP.isiTemplat(T.panjang, { JAWAB: s.jawaban });
      } else {
        benar = masukan === s.jawaban;
      }
      if (benar) {
        st.benar++;
        APP.simpan.tandai(BAGIAN, st.level + '-' + (c.indeks + 1));
      }
      var isi = (khusus ? '<p>' + APP.teks(khusus) + '</p>' : (!benar ? '<p>' + APP.teks(APP.isiTemplat(T.jawabanBenar, { JAWAB: s.jawaban })) + '</p>' : '')) +
        '<p>' + APP.teks(s.alasan || '') + '</p>';
      st.jawab = { masukan: masukan, benar: benar, umpan: APP.umpan(benar, isi) };
      tampilKuis();
      var lanjut = wadah.querySelector('[data-aksi="lanjut"]');
      if (lanjut) { try { lanjut.focus({ preventScroll: true }); } catch (e) { lanjut.focus(); } }
    }

    function tampilAkhir() {
      var lv = L()[st.level];
      var total = st.urutan.length;
      var persen = Math.round(100 * st.benar / total);
      var l = lencanaUntuk(persen);
      var tb = terbaik();
      var lama = tb[st.level];
      var rekor = !lama || persen > lama.persen;
      if (rekor) {
        tb[st.level] = { benar: st.benar, total: total, persen: persen, ikon: l.ikon, nama: l.nama };
        APP.simpan.taruh(KUNCI_TERBAIK, tb);
        APP.kabar('progres', BAGIAN);
      }
      st.tampil = 'akhir';
      wadah.innerHTML = '<section class="kartu lt-akhir" aria-labelledby="lt-akhir-judul">' +
        '<p class="lt-lencana" aria-hidden="true">' + esc(l.ikon) + '</p>' +
        '<h2 id="lt-akhir-judul">' + esc(lv.judul) + ' selesai! <span class="lt-lencana-nama">Lencana: ' + esc(l.nama) + '</span></h2>' +
        '<p class="lt-akhir-skor">' + APP.teks(APP.isiTemplat(L().teks.akhir, { BENAR: st.benar, TOTAL: total, PERSEN: persen })) + '</p>' +
        '<p>' + esc(l.teks) + '</p>' +
        (rekor && lama ? '<p class="lt-rekor">🎉 Rekor baru!</p>' : '') +
        '<div class="lt-akhir-aksi">' +
          '<button type="button" class="tombol tombol-utama" data-mulai="' + st.level + '">↺ Ulangi ' + esc(lv.judul) + '</button>' +
          (nomorLevel(st.level) < LEVEL.length ? '<button type="button" class="tombol tombol-garis" data-mulai="' + LEVEL[nomorLevel(st.level)] + '">Lanjut ke ' + esc(L()[LEVEL[nomorLevel(st.level)]].judul) + ' →</button>' : '') +
          '<button type="button" class="tombol tombol-garis" data-aksi="menu">Pilih level</button>' +
        '</div></section>';
      var h = wadah.querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-mulai], [data-opsi], [data-aksi]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-mulai')) { mulai(t.getAttribute('data-mulai')); el.scrollIntoView({ block: 'start' }); return; }
      if (t.hasAttribute('data-opsi')) { if (!st.jawab) periksa(t.getAttribute('data-opsi')); return; }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'lanjut') {
        APP.suara.henti();
        if (st.pos + 1 < st.urutan.length) { st.pos++; siapkanSoal(); tampilKuis(); fokusJawab(); }
        else tampilAkhir();
      } else if (aksi === 'keluar' || aksi === 'menu') {
        APP.suara.henti();
        tampilMenu();
      }
    });

    el.addEventListener('submit', function (e) {
      e.preventDefault();
      if (st.jawab) return;
      var m = wadah.querySelector('#lt-masukan');
      periksa(m ? m.value : '');
    });

    if (st.tampil === 'kuis' && st.level) tampilKuis();
    else tampilMenu();
  }

  APP.bagian.latihan = {
    render: render,
    progres: function () {
      var kunci = [];
      LEVEL.forEach(function (lv) {
        var d = DATA.latihan[lv];
        if (d && d.soal) d.soal.forEach(function (_, i) { kunci.push(lv + '-' + (i + 1)); });
      });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'soal pernah benar';
      var tb = terbaik();
      var ikon = LEVEL.map(function (lv) { return tb[lv] ? tb[lv].ikon : ''; }).filter(Boolean);
      if (ikon.length) p.catatan = 'Lencana: ' + ikon.join(' ');
      return p;
    }
  };
})();

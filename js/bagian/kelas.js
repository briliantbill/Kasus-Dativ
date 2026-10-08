/* =====================================================================
 * Bagian 10 — Mode Kelas (untuk guru)
 * Mode proyektor + layar penuh, dan kuis 2 tim:
 * skor besar, soal acak, tombol "Tunjukkan jawaban".
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var KUNCI = 'kuisTim';
  var KASUS_KODE = { NOM: 'nom', AKK: 'akk', DAT: 'dat' };

  function K() { return DATA.kuisTim; }

  /* ---------------- Soal ---------------- */
  function kumpulanSoal() {
    var hasil = [];
    (K().soal || []).forEach(function (s, i) { hasil.push({ asal: 'kuis', i: i }); });
    (K().sumber || []).forEach(function (lv) {
      var d = DATA.latihan[lv];
      if (d && d.soal) d.soal.forEach(function (s, i) { hasil.push({ asal: lv, i: i }); });
    });
    return hasil;
  }

  function ambil(ref) {
    if (ref.asal === 'kuis') {
      var a = (K().soal || [])[ref.i];
      return a ? { jenis: 'kasus', s: a } : null;
    }
    var lv = DATA.latihan[ref.asal];
    var b = lv && lv.soal ? lv.soal[ref.i] : null;
    return b ? { jenis: lv.jenis, s: b, level: lv } : null;
  }

  function isiLubang(teks, isi) {
    var h = APP.teks(teks);
    return h.replace('___', isi == null
      ? '<span class="lubang" aria-label="tempat kosong">___</span>'
      : '<b class="lt-isi">' + esc(isi) + '</b>');
  }

  /* ---------------- Penyimpanan kuis (supaya skor tidak hilang bila halaman dimuat ulang) ---------------- */
  function bacaKuis() {
    var k = APP.simpan.ambil(KUNCI, null);
    if (!k || typeof k !== 'object' || !Array.isArray(k.soal) || !Array.isArray(k.skor)) return null;
    return k;
  }
  function simpanKuis(k) { APP.simpan.taruh(KUNCI, k); }

  /* ---------------- Halaman ---------------- */
  function render(el) {
    var kuis = bacaKuis();
    var hapus = [];

    el.innerHTML = APP.kop('kelas', K().intro) +
      '<section class="kartu kt-proyektor" aria-labelledby="kt-proyektor-judul">' +
        '<h2 id="kt-proyektor-judul">📽️ Mode Proyektor</h2>' +
        '<p>' + APP.teks(K().proyektor) + '</p>' +
        '<div class="kt-proyektor-aksi">' +
          '<button type="button" class="tombol tombol-utama" data-aksi="proyektor" aria-pressed="false"></button>' +
          (document.documentElement.requestFullscreen ? '<button type="button" class="tombol tombol-garis" data-aksi="layar">⛶ Layar penuh</button>' : '') +
          '<a class="tombol tombol-garis" href="#/ringkasan">🖨️ Ringkasan cetak</a>' +
        '</div>' +
      '</section>' +
      '<section class="kartu kt-kuis" aria-labelledby="kt-kuis-judul">' +
        '<h2 id="kt-kuis-judul">🏆 Kuis tim</h2>' +
        '<div class="kt-isi"></div>' +
      '</section>';
    var elIsi = el.querySelector('.kt-isi');
    var btnProyektor = el.querySelector('[data-aksi="proyektor"]');
    var btnLayar = el.querySelector('[data-aksi="layar"]');

    function perbaruiTombol() {
      var nyala = document.documentElement.classList.contains('mode-proyektor');
      btnProyektor.setAttribute('aria-pressed', nyala ? 'true' : 'false');
      btnProyektor.textContent = nyala ? '📽️ Matikan mode proyektor' : '📽️ Nyalakan mode proyektor';
      if (btnLayar) btnLayar.textContent = document.fullscreenElement ? '⛶ Keluar layar penuh' : '⛶ Layar penuh';
    }
    function setProyektor(nyala) {
      if (document.documentElement.classList.contains('mode-proyektor') !== nyala) {
        document.getElementById('tombol-proyektor').click();   // pakai tombol di header supaya tersimpan
      }
    }
    // tombol tetap sinkron bila mode diganti lewat header atau huruf P
    var pengamat = new MutationObserver(perbaruiTombol);
    pengamat.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('fullscreenchange', perbaruiTombol);
    hapus.push(function () { pengamat.disconnect(); document.removeEventListener('fullscreenchange', perbaruiTombol); });
    perbaruiTombol();

    /* ---- tampilan: persiapan ---- */
    function tampilSiap() {
      var tim = (kuis && kuis.tim) || K().timBawaan;
      var belumSelesai = kuis && kuis.tahap === 'main' && kuis.pos < kuis.soal.length;
      elIsi.innerHTML =
        (belumSelesai ? '<div class="kt-lanjut"><p>' + esc(K().teks.lanjutkan) + ' Soal ' + (kuis.pos + 1) + ' dari ' + kuis.soal.length +
          ' · <b>' + esc(kuis.tim[0]) + ' ' + kuis.skor[0] + ' : ' + kuis.skor[1] + ' ' + esc(kuis.tim[1]) + '</b></p>' +
          '<button type="button" class="tombol tombol-utama" data-aksi="lanjutkan">▶ Lanjutkan kuis</button></div>' : '') +
        '<form class="kt-siap" autocomplete="off">' +
          '<p class="kt-cara">' + APP.teks(K().teks.cara) + '</p>' +
          '<div class="kt-nama">' +
            '<label>Nama tim 1<input type="text" name="tim0" maxlength="20" value="' + esc(tim[0]) + '"></label>' +
            '<label>Nama tim 2<input type="text" name="tim1" maxlength="20" value="' + esc(tim[1]) + '"></label>' +
          '</div>' +
          '<fieldset class="kt-jumlah"><legend>Jumlah soal</legend>' +
            K().pilihanJumlah.map(function (n) {
              return '<label><input type="radio" name="jumlah" value="' + n + '"' + (n === K().jumlahBawaan ? ' checked' : '') + '> ' + n + '</label>';
            }).join('') + '</fieldset>' +
          '<label class="kt-centang"><input type="checkbox" name="proyektor" checked> Nyalakan mode proyektor saat kuis dimulai</label>' +
          '<p class="kt-sumber">' + kumpulanSoal().length + ' soal tersedia (soal kuis tim + Latihan berlevel), diambil secara acak.</p>' +
          '<button type="submit" class="tombol tombol-utama kt-mulai">' + (belumSelesai ? 'Mulai kuis baru' : '▶ Mulai kuis') + '</button>' +
        '</form>';
    }

    function mulaiKuis(form) {
      var nama = [form.tim0.value.trim() || K().timBawaan[0], form.tim1.value.trim() || K().timBawaan[1]];
      var pilih = form.querySelector('input[name="jumlah"]:checked');
      var n = pilih ? +pilih.value : K().jumlahBawaan;
      var soal = APP.acak(kumpulanSoal()).slice(0, n).map(function (ref) {
        var x = ambil(ref);
        if (x && x.s.pilihan && x.jenis !== 'kasus') ref.opsi = APP.acak(x.s.pilihan);
        return ref;
      });
      kuis = { tahap: 'main', tim: nama, skor: [0, 0], soal: soal, pos: 0, terbuka: false, pilihTim: null };
      simpanKuis(kuis);
      if (form.proyektor.checked) setProyektor(true);
      tampilMain();
      el.querySelector('.kt-kuis').scrollIntoView({ block: 'start' });
    }

    /* ---- tampilan: kuis berjalan ---- */
    function papanHTML() {
      var giliran = kuis.tahap === 'main' ? kuis.pos % 2 : -1;
      return '<div class="kt-papan">' + [0, 1].map(function (t) {
        return '<div class="kt-tim kt-tim-' + t + (giliran === t ? ' giliran' : '') + '">' +
          '<p class="kt-tim-nama">' + esc(kuis.tim[t]) + '</p>' +
          '<p class="kt-tim-skor" aria-live="polite">' + kuis.skor[t] + '</p>' +
          (giliran === t ? '<p class="kt-tim-giliran">Giliran</p>' : '<p class="kt-tim-giliran kosong">&nbsp;</p>') +
          '<div class="kt-koreksi"><button type="button" class="kt-mini" data-koreksi="' + t + ':-1" aria-label="Kurangi satu poin ' + esc(kuis.tim[t]) + '">−1</button>' +
          '<button type="button" class="kt-mini" data-koreksi="' + t + ':1" aria-label="Tambah satu poin ' + esc(kuis.tim[t]) + '">+1</button></div>' +
          '</div>';
      }).join('<div class="kt-vs" aria-hidden="true">:</div>') + '</div>';
    }

    function soalHTML(x, ref) {
      var s = x.s, buka = kuis.terbuka;
      var h = '';
      if (x.jenis === 'kasus') {
        h = '<p class="kt-tanya">' + esc(K().teks.tanyaKasus) + '</p>' +
          '<div class="kt-kalimat"><span class="de" lang="de">' + APP.teks(s.soal) + '</span>' + (buka ? APP.tombolSuara(s.soal) : '') + '</div>';
      } else if (x.jenis === 'dialog') {
        h = (s.tema ? '<p class="lt-tema">' + esc(s.tema) + '</p>' : '') + '<div class="lt-dialog kt-dialog">' + s.dialog.map(function (d) {
          var ada = d.de.indexOf('___') >= 0;
          return '<div class="lt-garis"><span class="lt-pembicara">' + esc(d.s) + '</span><span class="de" lang="de">' +
            (ada ? isiLubang(d.de, buka ? s.jawaban : null) : APP.teks(d.de)) + '</span></div>';
        }).join('') + '</div>';
      } else {
        h = '<div class="kt-kalimat"><span class="de" lang="de">' + isiLubang(s.soal, buka ? s.jawaban : null) + '</span>' +
          (buka ? APP.tombolSuara(s.soal.replace('___', s.jawaban)) : '') + '</div>' +
          (s.petunjuk ? '<p class="lt-kurung">(<span lang="de">' + esc(s.petunjuk) + '</span>)</p>' : '');
      }
      // terjemahan: untuk isian selalu (dibutuhkan untuk und/oder/aber), lainnya setelah jawaban dibuka
      if (s.id && (x.jenis === 'isi' || buka)) h += '<p class="kal-id kt-arti">' + APP.teks(s.id) + '</p>';

      var opsi = x.jenis === 'kasus' ? s.pilihan : (ref.opsi || s.pilihan);
      if (opsi && opsi.length) {
        h += '<div class="kt-opsi-daftar">' + opsi.map(function (o, i) {
          var kls = 'kt-opsi';
          if (kuis.pilihTim === o) kls += ' dipilih';
          if (buka && o === s.jawaban) kls += ' benar';
          else if (buka && kuis.pilihTim === o) kls += ' salah';
          var isi = x.jenis === 'kasus' && KASUS_KODE[o] ? APP.badge(KASUS_KODE[o], true) : '<span lang="de">' + esc(o) + '</span>';
          return '<button type="button" class="' + kls + '" data-opsi="' + esc(o) + '"' + (buka ? ' disabled' : '') + '>' +
            '<span class="kt-huruf" aria-hidden="true">' + 'ABCDE'.charAt(i) + '</span>' + isi +
            (buka && o === s.jawaban ? '<span class="kt-cek" aria-label="jawaban benar">✓</span>' : '') + '</button>';
        }).join('') + '</div>';
      } else if (!buka) {
        h += '<p class="kt-lisan">🗣️ Tim menjawab secara lisan atau menulis di papan.</p>';
      }

      if (buka) {
        h += '<div class="kt-jawaban" aria-live="polite"><p class="kt-jawaban-judul">Jawaban: <b lang="de">' + esc(s.jawaban) + '</b>' +
          (kuis.pilihTim ? (kuis.pilihTim === s.jawaban ? ' · ✓ pilihan tim benar' : ' · ✗ pilihan tim: ' + esc(kuis.pilihTim)) : '') + '</p>' +
          '<p>' + APP.teks(s.alasan || '') + '</p></div>';
      }
      return h;
    }

    function tampilMain() {
      if (kuis.pos >= kuis.soal.length) { tampilAkhir(); return; }
      var ref = kuis.soal[kuis.pos];
      var x = ambil(ref);
      if (!x) { kuis.pos++; simpanKuis(kuis); tampilMain(); return; }   // soal dihapus dari data.js
      var giliran = kuis.tim[kuis.pos % 2];
      elIsi.innerHTML = papanHTML() +
        '<div class="kt-soal-kop"><span>Soal ' + (kuis.pos + 1) + ' dari ' + kuis.soal.length + '</span>' +
          '<span class="kt-giliran-teks">' + esc(APP.isiTemplat(K().teks.giliran, { TIM: giliran })) + '</span></div>' +
        '<span class="bar" aria-hidden="true"><span class="bar-isi" style="width:' + Math.round(100 * kuis.pos / kuis.soal.length) + '%"></span></span>' +
        '<div class="kt-soal">' + soalHTML(x, ref) + '</div>' +
        '<div class="kt-aksi">' +
          (kuis.terbuka
            ? '<button type="button" class="tombol tombol-utama" data-poin="0">✓ +1 ' + esc(kuis.tim[0]) + '</button>' +
              '<button type="button" class="tombol tombol-utama" data-poin="1">✓ +1 ' + esc(kuis.tim[1]) + '</button>' +
              '<button type="button" class="tombol tombol-garis" data-poin="-1">Tanpa poin →</button>'
            : '<button type="button" class="tombol tombol-utama kt-tunjukkan" data-aksi="tunjukkan">👁️ Tunjukkan jawaban</button>') +
        '</div>' +
        '<p class="kt-pintasan">' + esc(K().teks.pintasan) + '</p>' +
        '<p class="kt-akhiri"><button type="button" class="tombol tombol-garis kecil" data-aksi="akhiri">Akhiri kuis</button></p>';
    }

    function tunjukkan() {
      if (!kuis || kuis.tahap !== 'main' || kuis.terbuka) return;
      kuis.terbuka = true;
      simpanKuis(kuis);
      tampilMain();
      var b = elIsi.querySelector('[data-poin="' + (kuis.pos % 2) + '"]');
      if (b) b.focus();
    }

    function beriPoin(t) {
      if (!kuis || kuis.tahap !== 'main' || !kuis.terbuka) return;
      if (t === 0 || t === 1) kuis.skor[t]++;
      kuis.pos++;
      kuis.terbuka = false;
      kuis.pilihTim = null;
      if (kuis.pos >= kuis.soal.length) kuis.tahap = 'akhir';
      simpanKuis(kuis);
      APP.suara.henti();
      tampilMain();
      var f = elIsi.querySelector('.kt-tunjukkan') || elIsi.querySelector('[data-aksi="lagi"]');
      if (f) f.focus();
    }

    /* ---- tampilan: akhir ---- */
    function tampilAkhir() {
      kuis.tahap = 'akhir';
      simpanKuis(kuis);
      var a = kuis.skor[0], b = kuis.skor[1];
      var hasil = a === b ? K().teks.seri : APP.isiTemplat(K().teks.menang, { TIM: kuis.tim[a > b ? 0 : 1] });
      elIsi.innerHTML = papanHTML() +
        '<div class="kt-akhir"><p class="kt-akhir-ikon" aria-hidden="true">' + (a === b ? '🤝' : '🏆') + '</p>' +
        '<p class="kt-akhir-teks">' + esc(hasil) + '</p>' +
        '<div class="kt-aksi">' +
          '<button type="button" class="tombol tombol-utama" data-aksi="lagi">↺ Main lagi (soal baru)</button>' +
          '<button type="button" class="tombol tombol-garis" data-aksi="atur">Ganti tim / jumlah soal</button>' +
        '</div></div>';
    }

    function mainLagi() {
      var n = kuis.soal.length;
      var soal = APP.acak(kumpulanSoal()).slice(0, n).map(function (ref) {
        var x = ambil(ref);
        if (x && x.s.pilihan && x.jenis !== 'kasus') ref.opsi = APP.acak(x.s.pilihan);
        return ref;
      });
      kuis = { tahap: 'main', tim: kuis.tim, skor: [0, 0], soal: soal, pos: 0, terbuka: false, pilihTim: null };
      simpanKuis(kuis);
      tampilMain();
    }

    /* ---- klik ---- */
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-aksi], [data-poin], [data-opsi], [data-koreksi]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-poin')) { beriPoin(+t.getAttribute('data-poin')); return; }
      if (t.hasAttribute('data-opsi')) {
        if (kuis && !kuis.terbuka) {
          var o = t.getAttribute('data-opsi');
          kuis.pilihTim = kuis.pilihTim === o ? null : o;
          simpanKuis(kuis);
          tampilMain();
          var sama = elIsi.querySelector('.kt-opsi[data-opsi="' + o.replace(/"/g, '\\"') + '"]');
          if (sama) sama.focus();
        }
        return;
      }
      if (t.hasAttribute('data-koreksi')) {
        var bagian = t.getAttribute('data-koreksi').split(':');
        var tim = +bagian[0];
        kuis.skor[tim] = Math.max(0, kuis.skor[tim] + (+bagian[1]));
        simpanKuis(kuis);
        if (kuis.tahap === 'akhir') tampilAkhir(); else tampilMain();
        return;
      }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'proyektor') setProyektor(!document.documentElement.classList.contains('mode-proyektor'));
      else if (aksi === 'layar') {
        try {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        } catch (x) { /* abaikan */ }
      }
      else if (aksi === 'lanjutkan') { tampilMain(); }
      else if (aksi === 'tunjukkan') tunjukkan();
      else if (aksi === 'akhiri') { if (window.confirm('Akhiri kuis sekarang dan lihat hasilnya?')) tampilAkhir(); }
      else if (aksi === 'lagi') mainLagi();
      else if (aksi === 'atur') { tampilSiap(); }
    });

    el.addEventListener('submit', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('kt-siap')) mulaiKuis(e.target);
    });

    /* ---- pintasan keyboard untuk guru ---- */
    function tombol(e) {
      if (!kuis || kuis.tahap !== 'main') return;
      if (!elIsi.querySelector('.kt-papan')) return;           // bukan di layar kuis
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var target = e.target;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      var diTombol = target && target.tagName === 'BUTTON';
      if ((e.key === ' ' || e.key === 'Enter') && !diTombol) {
        if (!kuis.terbuka) { e.preventDefault(); tunjukkan(); }
      } else if (e.key === ' ' && diTombol && !kuis.terbuka && target.classList.contains('kt-opsi')) {
        // biarkan tombol pilihan bekerja seperti biasa
      } else if (kuis.terbuka && (e.key === '1' || e.key === '2')) {
        e.preventDefault(); beriPoin(+e.key - 1);
      } else if (kuis.terbuka && e.key === '0') {
        e.preventDefault(); beriPoin(-1);
      }
    }
    document.addEventListener('keydown', tombol);
    hapus.push(function () { document.removeEventListener('keydown', tombol); });

    tampilSiap();   // menampilkan "Lanjutkan kuis" bila ada kuis yang belum selesai

    return function () { hapus.forEach(function (f) { f(); }); };
  }

  APP.bagian.kelas = { render: render };
})();

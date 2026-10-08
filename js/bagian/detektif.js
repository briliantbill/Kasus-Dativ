/* =====================================================================
 * Bagian 5 — Detektif Kasus
 * Ketuk setiap kata benda, pilih Wer? / Wen? / Wem?.
 * Umpan balik langsung, selalu dengan alasan (tes pertanyaan + petunjuk artikel).
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'detektif';
  var OPSI = ['nom', 'akk', 'dat'];

  // Sesi diingat selama halaman terbuka
  var sesi = null;

  function sesiBaru(acak) {
    var idx = DATA.detektif.daftar.map(function (_, i) { return i; });
    sesi = { urutan: acak ? APP.acak(idx) : idx, pos: 0, benar: 0, total: 0, selesai: false, kal: null };
  }

  /* ---------------- Kalimat ---------------- */
  function frasaDari(kal) {
    return APP.potong(kal.kalimat).filter(function (p) { return p.jenis === 'frase' && p.kasus; });
  }

  function mulaiKalimat() {
    var data = DATA.detektif.daftar[sesi.urutan[sesi.pos]];
    sesi.kal = { data: data, frasa: frasaDari(data), status: {}, salah: {}, pilih: null, umpan: '' };
  }

  function tandaFrasa(p) { return p.isi.replace(/\*\*/g, ''); }

  // huruf kecil untuk frasa berartikel di tengah kalimat (Die Frau → die Frau); nama tetap
  function frasaKecil(p) {
    var f = tandaFrasa(p);
    return p.g !== '-' && /\s/.test(f) ? f.charAt(0).toLowerCase() + f.slice(1) : f;
  }

  function petunjukArtikel(p) {
    var T = DATA.detektif.teks;
    var polos = tandaFrasa(p).replace(/\{([^}]*)\}/g, '$1');
    var kata = polos.split(/\s+/);
    var h = '';
    if (p.g === '-' || kata.length < 2) {
      h = T.tanpaArtikel;
    } else {
      var art = kata[0].toLowerCase();
      var daftar = APP.kasusArtikel(art, p.g);
      var nama = daftar.map(function (k) { return DATA.kasus[k].nama; });
      var peta = { ART: art, GENDER: DATA.gender[p.g] ? DATA.gender[p.g].nama : p.g, KASUS: nama.join(' atau ') };
      if (daftar.length === 1) h = APP.isiTemplat(T.artikelPasti, peta);
      else if (daftar.length > 1) h = APP.isiTemplat(T.artikelGanda, peta);
    }
    if (/\{n\}/.test(p.isi)) {
      var nomen = tandaFrasa(p).split(/\s+/).pop();
      h += ' ' + APP.isiTemplat(T.akhiranN, { KATA: nomen });
    }
    return h;
  }

  function umpanBalik(kal, p, pilihan) {
    var T = DATA.detektif.teks;
    var benar = pilihan === p.kasus;
    var d = DATA.kasus[p.kasus], dp = DATA.kasus[pilihan];
    var frase = frasaKecil(p);
    var khusus = kal.data.peran || {};
    var peta = {
      TANYA: (kal.data.tanya && kal.data.tanya[p.kasus]) || d.tanyaUtama,
      JAWAB: frase, FRASE: frase,
      PERAN: (khusus[p.kasus] || d.peran) + ' (' + d.kode + ')',
      PERAN_PILIH: dp.peran + ' (' + dp.kode + ')'
    };
    var h = '<p>' + APP.teks(APP.isiTemplat(benar ? T.benar : T.salah, peta)) + '</p>' +
      '<p>' + APP.teks(petunjukArtikel(p)) + '</p>' +
      (kal.data.catatan ? '<p class="umpan-catatan">💡 ' + APP.teks(kal.data.catatan) + '</p>' : '');
    return APP.umpan(benar, h);
  }

  /* ---------------- Tampilan ---------------- */
  function kalimatHTML(kal) {
    var j = 0;
    return APP.potong(kal.data.kalimat).map(function (p) {
      if (p.jenis === 'teks') return APP.teks(p.isi);
      if (!p.kasus) return APP.teks('[' + p.g + '|' + p.isi + ']');
      var idx = j++;
      var ok = kal.status[idx];
      return '<button type="button" class="dt-frasa potongan fr ber-kasus ' + APP.kelasGender(p.g) + (ok ? ' terbuka' : '') +
        (kal.pilih === idx ? ' dipilih' : '') + '" data-frasa="' + idx + '" aria-pressed="' + (kal.pilih === idx ? 'true' : 'false') + '">' +
        APP.teks(p.isi) + APP.badge(p.kasus) +
        (ok ? '<span class="sr-only"> (sudah benar: ' + DATA.kasus[p.kasus].nama + ')</span>' : '') + '</button>';
    }).join('');
  }

  function pilihanHTML(kal) {
    if (kal.pilih == null || kal.status[kal.pilih]) return '';
    var p = kal.frasa[kal.pilih];
    return '<p class="dt-tanya-judul">Pertanyaan apa yang cocok untuk <span class="fr ' + APP.kelasGender(p.g) + '" lang="de">' +
      APP.teks(frasaKecil(p)) + '</span>?</p><div class="dt-opsi-daftar">' +
      OPSI.map(function (k) {
        var dicoba = kal.salah[kal.pilih] && kal.salah[kal.pilih][k];
        return '<button type="button" class="dt-opsi' + (dicoba ? ' dicoba' : '') + '" data-opsi="' + k + '">' +
          '<span class="dt-opsi-tanya" lang="de">' + esc(DATA.detektif.pilihan[k]) + '</span>' + APP.badge(k) + '</button>';
      }).join('') + '</div>';
  }

  function jumlahSelesai(kal) {
    return kal.frasa.filter(function (_, i) { return kal.status[i]; }).length;
  }

  function render(el) {
    var D = DATA.detektif;
    if (!sesi) sesiBaru(false);
    if (!sesi.kal && !sesi.selesai) mulaiKalimat();

    el.innerHTML = APP.kop(BAGIAN, D.intro) +
      '<section class="kartu dt-kartu" aria-label="Kalimat"></section>' +
      '<section class="kartu dt-kunci" aria-labelledby="dt-kunci-judul">' +
        '<h2 id="dt-kunci-judul">Petunjuk detektif</h2><ul>' +
        OPSI.map(function (k) {
          return '<li>' + APP.badge(k) + ' <b lang="de">' + esc(D.pilihan[k]) + '</b> → ' + APP.teks(DATA.kasus[k].jelas) + '</li>';
        }).join('') + '</ul></section>';
    var elKartu = el.querySelector('.dt-kartu');

    function renderKartu(fokus) {
      if (sesi.selesai) {
        var akhir = APP.isiTemplat(D.teks.akhir, { BENAR: sesi.benar, TOTAL: sesi.total });
        elKartu.innerHTML = '<div class="dt-akhir"><p class="dt-akhir-ikon" aria-hidden="true">🕵️</p>' +
          '<p class="dt-akhir-teks">' + APP.teks(akhir) + '</p>' +
          '<button type="button" class="tombol tombol-utama" data-aksi="lagi">Main lagi (urutan acak)</button></div>';
        var b = elKartu.querySelector('[data-aksi="lagi"]');
        if (fokus && b) b.focus();
        return;
      }
      var kal = sesi.kal;
      var total = sesi.urutan.length;
      var semua = jumlahSelesai(kal) === kal.frasa.length;
      elKartu.innerHTML =
        '<div class="dt-atas"><span class="dt-nomor">Kalimat ' + (sesi.pos + 1) + ' dari ' + total + '</span>' +
          '<span class="dt-skor" title="Benar pada percobaan pertama">⭐ ' + sesi.benar + '</span></div>' +
        '<span class="bar dt-bar" aria-hidden="true"><span class="bar-isi" style="width:' + Math.round(100 * sesi.pos / total) + '%"></span></span>' +
        '<div class="dt-kalimat"><p class="de" lang="de">' + kalimatHTML(kal) + '</p>' + APP.tombolSuara(kal.data.kalimat) + '</div>' +
        '<p class="kal-id dt-arti">' + APP.teks(kal.data.id || '') + '</p>' +
        '<div class="dt-pilihan">' + pilihanHTML(kal) + '</div>' +
        '<div class="dt-umpan" aria-live="polite">' + (kal.umpan || (semua ? '' : '<p class="petunjuk">👆 ' + APP.teks(D.teks.pilihKata) + '</p>')) + '</div>' +
        '<div class="dt-aksi">' +
          (semua ? '<p class="dt-selesai">' + APP.teks(D.teks.selesaiKalimat) + '</p>' : '') +
          '<button type="button" class="tombol ' + (semua ? 'tombol-utama' : 'tombol-garis') + '" data-aksi="lanjut"' + (semua ? '' : ' disabled') + '>' +
            (sesi.pos + 1 < total ? 'Kalimat berikutnya →' : 'Lihat hasil →') + '</button>' +
        '</div>';
      if (fokus === 'opsi') { var o = elKartu.querySelector('.dt-opsi'); if (o) o.focus(); }
      else if (fokus === 'lanjut') { var l = elKartu.querySelector('[data-aksi="lanjut"]'); if (l) l.focus(); }
      else if (typeof fokus === 'number') { var f = elKartu.querySelector('[data-frasa="' + fokus + '"]'); if (f) f.focus(); }
    }

    function jawab(k) {
      var kal = sesi.kal, i = kal.pilih;
      if (i == null || kal.status[i]) return;
      var p = kal.frasa[i];
      kal.umpan = umpanBalik(kal, p, k);
      if (k === p.kasus) {
        kal.status[i] = true;
        sesi.total++;
        if (!kal.salah[i]) sesi.benar++;
        kal.pilih = null;
        // fokus ke kata benda berikutnya yang belum terpecahkan
        var berikut = null;
        for (var x = 0; x < kal.frasa.length; x++) if (!kal.status[x]) { berikut = x; break; }
        if (berikut == null) APP.simpan.tandai(BAGIAN, 'k' + (sesi.urutan[sesi.pos] + 1));
        renderKartu(berikut == null ? 'lanjut' : berikut);
      } else {
        kal.salah[i] = kal.salah[i] || {};
        kal.salah[i][k] = true;
        renderKartu('opsi');
      }
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-frasa], [data-opsi], [data-aksi]');
      if (!t || !el.contains(t)) return;
      var kal = sesi.kal;
      if (t.hasAttribute('data-frasa')) {
        var i = +t.getAttribute('data-frasa');
        if (kal.status[i]) {
          // sudah benar: tampilkan lagi alasannya
          kal.pilih = null;
          kal.umpan = umpanBalik(kal, kal.frasa[i], kal.frasa[i].kasus);
          renderKartu(i);
        } else {
          kal.pilih = i;
          kal.umpan = '';
          renderKartu('opsi');
        }
        return;
      }
      if (t.hasAttribute('data-opsi')) { jawab(t.getAttribute('data-opsi')); return; }
      var aksi = t.getAttribute('data-aksi');
      if (aksi === 'lanjut') {
        APP.suara.henti();
        if (sesi.pos + 1 < sesi.urutan.length) { sesi.pos++; mulaiKalimat(); }
        else { sesi.selesai = true; sesi.kal = null; }
        renderKartu(true);
        elKartu.scrollIntoView({ block: 'start', behavior: APP.gerakDikurangi() ? 'auto' : 'smooth' });
        var pertama = elKartu.querySelector('[data-frasa]');
        if (pertama) { try { pertama.focus({ preventScroll: true }); } catch (x) { pertama.focus(); } }
      } else if (aksi === 'lagi') {
        sesiBaru(true);
        mulaiKalimat();
        renderKartu();
        var f = elKartu.querySelector('[data-frasa]');
        if (f) f.focus();
      }
    });

    renderKartu();
  }

  APP.bagian.detektif = {
    render: render,
    progres: function () {
      var kunci = DATA.detektif.daftar.map(function (_, i) { return 'k' + (i + 1); });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'kalimat terpecahkan';
      return p;
    }
  };
})();

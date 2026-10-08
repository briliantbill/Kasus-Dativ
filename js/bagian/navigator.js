/* =====================================================================
 * Bagian 8 — Präpositionen-Navigator
 * Pilih tempat di peta → pilih Wohin? / Wo? / Woher? → pilih preposisi.
 * Kalimat terbentuk dengan Kurzform yang tepat; Laura bergerak di peta.
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'navigator';
  var TANYA = ['wohin', 'wo', 'woher'];
  var AWAL = { x: 50, y: 90 };           // posisi awal Laura (persen)

  var st = { tempat: null, tanya: null, dicoba: {}, benar: false };

  function N() { return DATA.navigator; }
  function tempat(id) {
    for (var i = 0; i < N().tempat.length; i++) if (N().tempat[i].id === id) return N().tempat[i];
    return null;
  }
  function artDat(t) { return DATA.artikel.tentu.dat[t.g]; }
  function artNom(t) { return DATA.artikel.tentu.nom[t.g]; }

  /** Preposisi yang benar untuk pertanyaan + jenis tempat. */
  function prepBenar(q, t) {
    var P = N().prep;
    for (var p in P) {
      if (P.hasOwnProperty(p) && P[p].tanya === q && (P[p].untuk === 'semua' || P[p].untuk === t.jenis)) return p;
    }
    return null;
  }

  /** prep + artikel Dativ → 'zum' atau 'in der' */
  function frasaPrep(p, t) {
    var art = artDat(t);
    return N().kurzform[p + ' ' + art] || (p + ' ' + art);
  }

  function kalimatTanda(q, t, isi) {
    return N().tanya[q].kalimat.replace('%X%', '[' + t.g + '|' + isi + ' ' + t.kata + ']');
  }

  /* ---------------- Peta ---------------- */
  function petaHTML() {
    var jalan =
      '<svg class="nv-jalan" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<rect class="nv-taman" x="58" y="52" width="16" height="14" rx="3"/>' +
        '<rect class="nv-taman" x="27" y="6" width="14" height="12" rx="3"/>' +
        '<path class="nv-jalan-isi" d="M0 45 H100 M50 0 V100 M20 20 V45 M80 20 V45 M18 70 V45 M82 70 V45"/>' +
        '<path class="nv-jalan-garis" d="M0 45 H100 M50 0 V100"/>' +
      '</svg>';
    var tombol = N().tempat.map(function (t) {
      var dipilih = st.tempat === t.id;
      return '<button type="button" class="nv-tempat ' + APP.kelasGender(t.g) + (dipilih ? ' dipilih' : '') + '" data-tempat="' + t.id + '"' +
        ' style="left:' + t.x + '%;top:' + t.y + '%" aria-pressed="' + (dipilih ? 'true' : 'false') + '">' +
        '<span class="nv-tempat-ikon" aria-hidden="true">' + esc(t.ikon) + '</span>' +
        '<span class="nv-tempat-nama fr" lang="de">' + esc(artNom(t) + ' ' + t.kata) + '</span></button>';
    }).join('');
    return jalan + tombol +
      '<span class="nv-laura" aria-hidden="true" style="left:' + AWAL.x + '%;top:' + AWAL.y + '%">' + esc(N().tokoh.ikon) +
      '<span class="nv-laura-nama">' + esc(N().tokoh.nama) + '</span></span>';
  }

  function ringkasHTML() {
    var baris = N().tempat.map(function (t) {
      return '<tr><th scope="row"><span class="fr ' + APP.kelasGender(t.g) + '" lang="de">' + esc(artNom(t) + ' ' + t.kata) + '</span></th>' +
        TANYA.map(function (q) {
          var ok = APP.simpan.sudah(BAGIAN, t.id + '-' + q);
          var isi = ok ? '<span lang="de">' + esc(frasaPrep(prepBenar(q, t), t)) + '</span>' : '<span class="nv-belum" aria-label="belum">·</span>';
          return '<td class="' + (ok ? 'ok' : '') + '">' + isi + '</td>';
        }).join('') + '</tr>';
    }).join('');
    return '<h2>Ringkasan kotaku</h2>' +
      '<p class="petunjuk">Kotak terisi setelah kamu menjawab dengan benar.</p>' +
      '<table class="nv-tabel"><thead><tr><th scope="col"><span class="sr-only">Tempat</span></th>' +
      TANYA.map(function (q) { return '<th scope="col" lang="de">' + esc(N().tanya[q].label) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + baris + '</tbody></table>';
  }

  /* ---------------- Panel langkah ---------------- */
  function panelHTML() {
    var T = N().teks;
    var t = st.tempat ? tempat(st.tempat) : null;
    var h = '<div class="nv-langkah"><p class="nv-langkah-judul"><span class="nv-no">1</span> Tempat</p>' +
      (t ? '<p class="nv-pilihan-tempat"><span aria-hidden="true">' + esc(t.ikon) + '</span> <b class="fr ' + APP.kelasGender(t.g) + '" lang="de">' +
        esc(artNom(t) + ' ' + t.kata) + '</b> <span class="nv-arti">(' + esc(t.arti) + ')</span></p>'
        : '<p class="petunjuk">👆 ' + APP.teks(T.pilihTempat) + '</p>') + '</div>';

    h += '<div class="nv-langkah"><p class="nv-langkah-judul"><span class="nv-no">2</span> Pertanyaan</p><div class="nv-tanya-daftar">' +
      TANYA.map(function (q) {
        var d = N().tanya[q];
        return '<button type="button" class="nv-tanya" data-tanya="' + q + '" aria-pressed="' + (st.tanya === q ? 'true' : 'false') + '">' +
          '<span class="nv-tanya-ikon" aria-hidden="true">' + d.ikon + '</span><span class="nv-tanya-label" lang="de">' + esc(d.label) + '</span>' +
          '<span class="nv-tanya-arti">' + esc(d.arti) + '</span></button>';
      }).join('') + '</div></div>';

    if (!t || !st.tanya) return h;

    var q = st.tanya;
    var benar = prepBenar(q, t);
    var situasi = APP.isiTemplat(N().situasi[q][t.jenis], { ARTI: t.arti });
    var isiLubang = st.benar ? '**' + frasaPrep(benar, t) + '**' : '___';
    var kal = APP.teks(kalimatTanda(q, t, isiLubang)).replace('___', '<span class="lubang" aria-label="tempat kosong">___</span>');

    h += '<div class="nv-situasi"><p class="nv-situasi-id"><span aria-hidden="true">💬</span> ' + esc(situasi) + '</p>' +
      '<div class="kal-de nv-kalimat"><span class="de" lang="de">' + kal + '</span>' +
      (st.benar ? APP.tombolSuara(kalimatTanda(q, t, frasaPrep(benar, t))) : '') + '</div></div>';

    h += '<div class="nv-langkah"><p class="nv-langkah-judul"><span class="nv-no">3</span> ' + APP.teks(T.pilihPrep) + '</p>' +
      '<div class="nv-prep-daftar">' + N().pilihan[q].map(function (p) {
        var kls = 'nv-prep' + (st.dicoba[p] ? ' dicoba' : '') + (st.benar && p === benar ? ' benar' : '');
        return '<button type="button" class="' + kls + '" data-prep="' + p + '" lang="de"' + (st.benar ? ' disabled' : '') + '>' + esc(p) + '</button>';
      }).join('') + '</div>' +
      (q === 'wohin' ? '<p class="nv-catatan">💡 ' + APP.teks(T.wohin) + '</p>' : '') + '</div>';

    h += '<div class="nv-hasil" aria-live="polite">' + (st.umpan || '') + '</div>';
    return h;
  }

  function umpanBenar(t, q, p) {
    var T = N().teks, P = N().prep;
    var art = artDat(t);
    var kurz = N().kurzform[p + ' ' + art];
    // bila ada Kurzform, rumusnya sudah tampil di animasi lebur
    var teks = APP.isiTemplat(T.benar, { PREP: p, ARTI: P[p].arti }) +
      (kurz ? '' : ' ' + APP.isiTemplat(T.tanpaKurz, { PREP: p, ART: art }));
    return APP.umpan(true,
      (kurz ? '<div class="nv-lebur">' + APP.lebur(p, art, kurz) + '</div>' : '') +
      '<p>' + APP.teks(teks) + '</p>' +
      (t.id === 'haus' && q === 'wohin' && T.catatanHaus ? '<p class="umpan-catatan">💡 ' + APP.teks(T.catatanHaus) + '</p>' : ''));
  }

  function umpanSalah(t, q, pilih, benar) {
    var T = N().teks, P = N().prep;
    var qp = P[pilih].tanya;
    var teks = qp !== q
      ? APP.isiTemplat(T.salahTanya, { PILIH: pilih, TANYA_PILIH: N().tanya[qp].label, ARTI_TANYA: N().tanya[qp].arti, TANYA: N().tanya[q].label })
      : APP.isiTemplat(T.salahJenis, { PILIH: pilih, UNTUK_PILIH: P[pilih].arti, TEMPAT: artNom(t) + ' ' + t.kata,
                                       JENIS: N().jenis[t.jenis] || t.jenis, PREP: benar });
    return APP.umpan(false, '<p>' + APP.teks(teks) + '</p>');
  }

  /* ---------------- Halaman ---------------- */
  function render(el) {
    el.innerHTML = APP.kop(BAGIAN, N().intro) +
      '<section class="kartu nv-kartu" aria-label="Peta dan langkah">' +
        '<div class="nv-tata">' +
          '<div class="nv-peta" role="group" aria-label="Peta kota"></div>' +
          '<div class="nv-panel"></div>' +
        '</div>' +
      '</section>' +
      '<section class="kartu nv-ringkas" aria-label="Ringkasan"></section>';
    var elPeta = el.querySelector('.nv-peta');
    var elPanel = el.querySelector('.nv-panel');
    var elRingkas = el.querySelector('.nv-ringkas');
    var timer = null;

    function renderPeta() { elPeta.innerHTML = petaHTML(); }
    function renderPanel() { elPanel.innerHTML = panelHTML(); }
    function renderRingkas() { elRingkas.innerHTML = ringkasHTML(); }

    function lauraKe(x, y, opsi) {
      var l = elPeta.querySelector('.nv-laura');
      if (!l) return;
      opsi = opsi || {};
      l.classList.toggle('di-dalam', !!opsi.diDalam);
      if (opsi.dari) {
        l.classList.add('tanpa-transisi');
        l.style.left = opsi.dari.x + '%'; l.style.top = opsi.dari.y + '%';
        void l.offsetWidth;
        l.classList.remove('tanpa-transisi');
      }
      clearTimeout(timer);
      timer = setTimeout(function () { l.style.left = x + '%'; l.style.top = y + '%'; }, opsi.dari ? 60 : 0);
    }

    function gerakkanLaura() {
      var t = tempat(st.tempat), q = st.tanya;
      if (q === 'wohin') lauraKe(t.x, Math.min(t.y + 14, 94), { dari: AWAL });
      else if (q === 'wo') lauraKe(t.x + 5, t.y - 2, { diDalam: true });
      else lauraKe(t.x + (AWAL.x - t.x) * 0.55, t.y + (AWAL.y - t.y) * 0.55, { dari: { x: t.x, y: t.y } });
    }

    function reset() {
      st.dicoba = {}; st.benar = false; st.umpan = '';
      lauraKe(AWAL.x, AWAL.y);
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tempat], [data-tanya], [data-prep]');
      if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-tempat')) {
        st.tempat = t.getAttribute('data-tempat');
        reset();
        el.querySelectorAll('.nv-tempat').forEach(function (b) {
          var ya = b.getAttribute('data-tempat') === st.tempat;
          b.classList.toggle('dipilih', ya);
          b.setAttribute('aria-pressed', ya ? 'true' : 'false');
        });
        renderPanel();
        return;
      }
      if (t.hasAttribute('data-tanya')) {
        st.tanya = t.getAttribute('data-tanya');
        reset();
        renderPanel();
        var p1 = elPanel.querySelector('.nv-prep');
        if (p1 && st.tempat) p1.focus();
        return;
      }
      if (t.hasAttribute('data-prep') && st.tempat && st.tanya && !st.benar) {
        var tp = tempat(st.tempat), p = t.getAttribute('data-prep');
        var benar = prepBenar(st.tanya, tp);
        if (p === benar) {
          st.benar = true;
          st.umpan = umpanBenar(tp, st.tanya, p);
          APP.simpan.tandai(BAGIAN, tp.id + '-' + st.tanya);
          renderPanel();
          renderRingkas();
          gerakkanLaura();
          var s = elPanel.querySelector('.nv-kalimat .suara');
          if (s) s.focus();
        } else {
          st.dicoba[p] = true;
          st.umpan = umpanSalah(tp, st.tanya, p, benar);
          renderPanel();
          var b = elPanel.querySelector('.nv-prep[data-prep="' + p + '"]');
          if (b) b.focus();
        }
      }
    });

    renderPeta();
    renderPanel();
    renderRingkas();
    if (st.benar && st.tempat && st.tanya) gerakkanLaura();
    return function () { clearTimeout(timer); };
  }

  APP.bagian.navigator = {
    render: render,
    progres: function () {
      var kunci = [];
      DATA.navigator.tempat.forEach(function (t) { TANYA.forEach(function (q) { kunci.push(t.id + '-' + q); }); });
      var p = APP.hitungProgres(BAGIAN, kunci);
      p.satuan = 'kalimat tempat';
      return p;
    }
  };
})();

/* =====================================================================
 * Bagian 6 — Satz-Baukasten
 * Seret kartu kata ke kotak Wer? / Wem? / Was? (mouse),
 * atau ketuk kartu lalu ketuk kotaknya (HP, keyboard).
 * Artikel berubah otomatis sesuai posisi (NOM / DAT / AKK).
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var BAGIAN = 'baukasten';
  var SLOT = ['nom', 'dat', 'akk'];

  // Disimpan selama halaman terbuka
  var st = {
    verb: 0,
    slot: { nom: null, dat: null, akk: null },
    tentu: { nom: true, dat: true, akk: false },
    pilih: null,          // kode kartu yang sedang dipilih
    pesan: null
  };

  function B() { return DATA.baukasten; }
  function kartu(kode) { return APP.kartuKata(kode); }
  function bolehDi(kode, k) {
    var c = kartu(kode);
    if (!c) return false;
    return c.jenis === 'benda' ? k === 'akk' : k !== 'akk';
  }
  function slotDari(kode) {
    for (var i = 0; i < SLOT.length; i++) if (st.slot[SLOT[i]] === kode) return SLOT[i];
    return null;
  }
  function kapital(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------------- Potongan tampilan ---------------- */
  function bentukBank(c) { return APP.frasa(c, 'nom', true).teks; }

  function kartuHTML(kode, k, animDari) {
    var c = kartu(kode);
    if (!c) return '';
    var isi;
    if (!k) {
      isi = esc(bentukBank(c));
    } else {
      var f = APP.frasa(c, k, st.tentu[k]);
      var nomenStatis = f.tambahN ? esc(c.kata.pl) + '<span class="akhiran">n</span>' : esc(f.nomen);
      var artHTML = !f.art ? '' : (animDari && animDari.art !== f.art ? APP.morf(animDari.art, f.art, { cepat: true }) : esc(f.art));
      var nomenHTML = animDari && animDari.nomen !== f.nomen
        ? APP.morf(animDari.nomen, f.nomen, { cepat: true, akhiran: f.tambahN }) : nomenStatis;
      isi = (artHTML ? artHTML + ' ' : '') + nomenHTML;
    }
    var dipilih = st.pilih === kode;
    return '<button type="button" class="kartu-kata ' + APP.kelasGender(c.g) + (k ? ' di-slot' : '') + (dipilih ? ' dipilih' : '') + '"' +
      ' data-kartu="' + esc(kode) + '"' + (k ? ' data-dari="' + k + '"' : '') + ' aria-pressed="' + (dipilih ? 'true' : 'false') + '"' +
      (k ? ' title="Ketuk untuk mengembalikan kartu"' : '') + '>' +
      '<span class="kk-ikon" aria-hidden="true">' + esc(c.ikon) + '</span>' +
      '<span class="kk-teks fr de" lang="de">' + isi + '</span></button>';
  }

  function slotHTML(k, animDari) {
    var S = B().slot[k], d = DATA.kasus[k];
    var kode = st.slot[k];
    var kelas = 'slot slot-' + k + (kode ? ' terisi' : '');
    if (st.pilih) kelas += bolehDi(st.pilih, k) ? ' bisa' : ' tidak';
    var isi;
    if (kode) {
      var tentu = st.tentu[k];
      isi = kartuHTML(kode, k, animDari) +
        '<button type="button" class="tukar-artikel" data-tukar="' + k + '" aria-label="Ganti artikel: ' +
        (tentu ? 'jadikan ein/eine' : 'jadikan der/das/die') + '"><span lang="de">' + (tentu ? 'der → ein' : 'ein → der') + '</span></button>';
    } else {
      isi = '<button type="button" class="slot-kosong" data-taruh="' + k + '">' + esc(S.kosong) + '</button>';
    }
    return '<div class="' + kelas + '" data-slot="' + k + '">' +
      '<div class="slot-kop">' + APP.badge(k) + '<span class="slot-tanya" lang="de">' + esc(S.tanya) + '</span>' +
      '<span class="slot-label">' + esc(S.label) + '</span></div>' + isi + '</div>';
  }

  function bankHTML() {
    var dipakai = {};
    SLOT.forEach(function (k) { if (st.slot[k]) dipakai[st.slot[k]] = true; });
    function grup(judul, daftar) {
      return '<div class="bk-grup"><h3>' + esc(judul) + '</h3><div class="bk-kartu">' +
        daftar.map(function (kode) {
          return dipakai[kode] ? '<span class="kartu-kosong" aria-hidden="true"></span>' : kartuHTML(kode, null);
        }).join('') + '</div></div>';
    }
    return grup('Orang (untuk Wer? dan Wem?)', B().orang) + grup('Benda (untuk Was?)', B().benda);
  }

  function verbSekarang() {
    var v = B().verben[st.verb] || B().verben[0];
    var c = st.slot.nom ? kartu(st.slot.nom) : null;
    return { teks: c && c.plural ? v.pl : v.sg, arti: v.arti, inf: v.inf };
  }

  function hasilHTML() {
    var lengkap = SLOT.every(function (k) { return st.slot[k]; });
    if (!lengkap) {
      var kurang = SLOT.filter(function (k) { return !st.slot[k]; }).map(function (k) { return B().slot[k].tanya; });
      return '<p class="bk-belum">Masih kosong: <b lang="de">' + esc(kurang.join(' · ')) + '</b></p>';
    }
    var v = verbSekarang();
    var bagian = {};
    SLOT.forEach(function (k) {
      var c = kartu(st.slot[k]);
      var f = APP.frasa(c, k, st.tentu[k]);
      var tanda = k === 'nom' ? kapital(f.tanda) : f.tanda;
      bagian[k] = '[' + c.g + '|' + tanda + '|' + DATA.kasus[k].kode + ']';
    });
    var urutan = B().urutan || SLOT;
    var de = bagian[urutan[0]] + ' ' + v.teks + ' ' + urutan.slice(1).map(function (k) { return bagian[k]; }).join(' ') + '.';
    var arti = APP.isiTemplat(B().terjemah, {
      NOM: kapital(kartu(st.slot.nom).arti), VERB: v.arti,
      DAT: kartu(st.slot.dat).arti, AKK: kartu(st.slot.akk).arti
    });
    return '<p class="bk-hasil-judul">Kalimatmu:</p>' +
      APP.kalimat({ de: de, id: 'Artinya kira-kira: ' + arti }, 'bk-kalimat');
  }

  /* ---------------- Halaman ---------------- */
  function render(el) {
    var hapusPendengar = [];

    el.innerHTML = APP.kop(BAGIAN, B().intro) +
      '<section class="kartu bk-susun" aria-label="Kalimat yang disusun">' +
        '<div class="bk-verben" role="group" aria-label="Kata kerja"><span class="bk-verben-label">Kata kerja:</span>' +
          B().verben.map(function (v, i) {
            return '<button type="button" class="chip-verb" data-verb="' + i + '" aria-pressed="false" lang="de">' + esc(v.inf) + '</button>';
          }).join('') + '</div>' +
        '<div class="bk-baris">' +
          '<div class="bk-tempat" data-tempat="nom"></div>' +
          '<div class="bk-verb-tampil" lang="de" aria-live="polite"></div>' +
          '<div class="bk-tempat" data-tempat="dat"></div>' +
          '<div class="bk-tempat" data-tempat="akk"></div>' +
        '</div>' +
        '<div class="bk-pesan" aria-live="polite"></div>' +
        '<div class="bk-hasil"></div>' +
        '<div class="bk-aksi">' +
          '<button type="button" class="tombol tombol-garis" data-aksi="acak">🎲 Kalimat acak</button>' +
          '<button type="button" class="tombol tombol-garis" data-aksi="kosong">Kosongkan</button>' +
        '</div>' +
      '</section>' +
      '<section class="kartu bk-bank" aria-labelledby="bk-bank-judul">' +
        '<h2 id="bk-bank-judul">Kartu kata</h2>' +
        '<p class="petunjuk bk-cara">🖱️ Seret kartu ke kotak. 👆 Atau ketuk kartu, lalu ketuk kotaknya. Ketuk kartu di dalam kotak untuk mengembalikannya.</p>' +
        '<div class="bk-bank-isi"></div>' +
      '</section>' +
      // bilah "Taruh di:" yang menempel di bawah layar HP (supaya tidak perlu menggulir)
      '<div class="bk-cepat" role="region" aria-label="Taruh kartu terpilih" hidden></div>';

    var elBank = el.querySelector('.bk-bank-isi');
    var elPesan = el.querySelector('.bk-pesan');
    var elHasil = el.querySelector('.bk-hasil');
    var elVerb = el.querySelector('.bk-verb-tampil');
    var elCepat = el.querySelector('.bk-cepat');
    var kilat = null, kilatTimer = null;

    function renderCepat() {
      if (st.pilih && kartu(st.pilih)) {
        var c = kartu(st.pilih);
        elCepat.innerHTML = '<p class="bk-cepat-atas"><span aria-hidden="true">' + esc(c.ikon) + '</span> ' +
          '<b class="fr ' + APP.kelasGender(c.g) + '" lang="de">' + esc(bentukBank(c)) + '</b> · taruh di:</p>' +
          SLOT.map(function (k) {
            return '<button type="button" class="bk-cepat-btn" data-taruh="' + k + '"' + (bolehDi(st.pilih, k) ? '' : ' disabled') + '>' +
              APP.badge(k) + ' <span lang="de">' + esc(B().slot[k].tanya) + '</span></button>';
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

    // pesan singkat di bilah bawah (HP), hilang sendiri
    function kilatkan(html) {
      kilat = html;
      clearTimeout(kilatTimer);
      kilatTimer = setTimeout(function () { kilat = null; if (el.isConnected) renderCepat(); }, 2600);
    }

    // teks = teks bertanda (di-escape); awalHTML = potongan HTML siap pakai (mis. badge)
    function pesan(teks, awalHTML) {
      st.pesan = teks;
      elPesan.innerHTML = teks ? '<p>' + (awalHTML || '') + APP.teks(teks) + '</p>' : '';
    }

    function renderSlot(k, animDari) {
      el.querySelector('[data-tempat="' + k + '"]').innerHTML = slotHTML(k, animDari);
    }

    function renderSemua(anim) {
      anim = anim || {};
      el.querySelectorAll('.chip-verb').forEach(function (b) {
        b.setAttribute('aria-pressed', +b.getAttribute('data-verb') === st.verb ? 'true' : 'false');
      });
      SLOT.forEach(function (k) { renderSlot(k, anim[k]); });
      elVerb.textContent = verbSekarang().teks;
      elBank.innerHTML = bankHTML();
      elHasil.innerHTML = hasilHTML();
      if (SLOT.every(function (k) { return st.slot[k]; })) {
        // kalimat baru = kombinasi kartu + kata kerja yang baru (ganti der/ein tidak dihitung)
        var kunci = SLOT.map(function (k) { return st.slot[k]; }).join('|') + '|' + st.verb;
        APP.simpan.tandai(BAGIAN, kunci);
      }
      if (st.pesan == null) pesan(B().pesan.mulai);
      renderCepat();
    }

    // bentuk yang sedang terlihat (untuk animasi perubahan)
    function bentukDari(kode, k) { return APP.frasa(kartu(kode), k, st.tentu[k]); }

    function fokusKartu(kode) {
      var b = el.querySelector('.kartu-kata[data-kartu="' + kode + '"]');
      if (b) b.focus();
    }

    function taruh(kode, k) {
      var c = kartu(kode);
      if (!c) return;
      if (!bolehDi(kode, k)) {
        pesan(APP.isiTemplat(c.jenis === 'benda' ? B().pesan.bendaSalah : B().pesan.orangSalah,
          { IKON: c.ikon, KATA: bentukBank(c) }));
        kilatkan(elPesan.querySelector('p').innerHTML);
        st.pilih = null;
        renderSemua();
        return;
      }
      var asal = slotDari(kode);
      var anim = {};
      // animasi dari bentuk yang terlihat sebelumnya ke bentuk baru
      if (asal) {
        anim[k] = bentukDari(kode, asal);
      } else {
        anim[k] = APP.frasa(c, 'nom', st.tentu[k]);
      }
      var lama = st.slot[k];
      if (asal) st.slot[asal] = null;
      if (lama && lama !== kode) {
        // kartu lama pindah ke tempat asal (bila cocok), atau kembali ke bank
        if (asal && bolehDi(lama, asal)) { anim[asal] = bentukDari(lama, k); st.slot[asal] = lama; }
      }
      st.slot[k] = kode;
      st.pilih = null;
      var f = APP.frasa(c, k, st.tentu[k]);
      var dasar = APP.frasa(c, 'nom', st.tentu[k]);
      var jelas = DATA.tabelHidup.penjelasan[k + '-' + c.g] || '';
      var tandaBentuk = (f.art ? f.art + ' ' : '') + (f.tambahN ? c.kata.pl + '{n}' : f.nomen);
      var templat = dasar.teks === f.teks ? B().pesan.tetap : B().pesan.ditaruh;
      pesan(APP.isiTemplat(templat, { DASAR: dasar.teks, BENTUK: tandaBentuk, JELAS: jelas }), APP.badge(k) + ' ');
      kilatkan('✓ ' + APP.badge(k) + ' ' + APP.teks(dasar.teks === f.teks ? '*' + dasar.teks + '*' : '*' + dasar.teks + '* → *' + tandaBentuk + '*'));
      renderSemua(anim);
      if (SLOT.every(function (x) { return st.slot[x]; })) {
        elPesan.insertAdjacentHTML('beforeend', '<p class="bk-lengkap">🎉 ' + APP.teks(B().pesan.lengkap) + '</p>');
      }
    }

    function kembalikan(k) {
      var kode = st.slot[k];
      if (!kode) return;
      st.slot[k] = null;
      st.pilih = null;
      pesan(APP.isiTemplat(B().pesan.kembali, { KATA: bentukBank(kartu(kode)) }));
      renderSemua();
    }

    function pilihKartu(kode) {
      st.pilih = st.pilih === kode ? null : kode;
      pesan(st.pilih ? APP.isiTemplat(B().pesan.dipilih, { KATA: bentukBank(kartu(kode)) }) : B().pesan.mulai);
      renderSemua();
      fokusKartu(kode);
    }

    /* ---- klik / ketuk ---- */
    var abaikanKlik = false;
    el.addEventListener('click', function (e) {
      if (abaikanKlik) return;
      var t = e.target.closest('[data-kartu], [data-taruh], [data-tukar], [data-verb], [data-aksi], [data-slot]');
      if (!t || !el.contains(t)) return;

      if (t.hasAttribute('data-verb')) {
        st.verb = +t.getAttribute('data-verb');
        renderSemua();
        return;
      }
      if (t.hasAttribute('data-tukar')) {
        var kt = t.getAttribute('data-tukar');
        var dari = bentukDari(st.slot[kt], kt);
        st.tentu[kt] = !st.tentu[kt];
        var anim = {}; anim[kt] = dari;
        renderSemua(anim);
        var tb = el.querySelector('[data-tukar="' + kt + '"]');
        if (tb) tb.focus();
        return;
      }
      if (t.hasAttribute('data-aksi')) {
        var aksi = t.getAttribute('data-aksi');
        if (aksi === 'batal') {
          var tadi = st.pilih;
          st.pilih = null; pesan(B().pesan.mulai); renderSemua();
          if (tadi) fokusKartu(tadi);
        } else if (aksi === 'kosong') {
          st.slot = { nom: null, dat: null, akk: null }; st.pilih = null;
          pesan(B().pesan.mulai);
          renderSemua();
        } else if (aksi === 'acak') {
          var orang = APP.acak(B().orang), benda = APP.acak(B().benda);
          st.verb = Math.floor(Math.random() * B().verben.length);
          var anim2 = {};
          var baru = { nom: orang[0], dat: orang[1], akk: benda[0] };
          st.tentu.akk = Math.random() < 0.5;
          SLOT.forEach(function (k) {
            var lama = st.slot[k];
            anim2[k] = lama ? bentukDari(lama, k) : APP.frasa(kartu(baru[k]), 'nom', st.tentu[k]);
            st.slot[k] = baru[k];
          });
          st.pilih = null;
          pesan(B().pesan.lengkap);
          renderSemua(anim2);
        }
        return;
      }
      if (t.hasAttribute('data-kartu')) {
        var kode = t.getAttribute('data-kartu');
        var diSlot = t.getAttribute('data-dari');
        if (diSlot) {
          if (st.pilih && st.pilih !== kode) taruh(st.pilih, diSlot);   // ganti isi kotak
          else kembalikan(diSlot);
        } else {
          pilihKartu(kode);
        }
        return;
      }
      var k = t.getAttribute('data-taruh') || t.getAttribute('data-slot');
      if (k) {
        if (st.pilih) taruh(st.pilih, k);
        else if (t.hasAttribute('data-taruh')) pesan(B().pesan.pilihDulu);
      }
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && st.pilih) { st.pilih = null; pesan(B().pesan.mulai); renderSemua(); }
    });

    /* ---- seret & lepas (mouse / pena). Di layar sentuh: ketuk-ketuk. ---- */
    var seret = null;
    function mulai(e) {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      var c = e.target.closest('.kartu-kata');
      if (!c || !el.contains(c)) return;
      var r = c.getBoundingClientRect();
      seret = { kode: c.getAttribute('data-kartu'), x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top,
                sumber: c, aktif: false, hantu: null, lebar: r.width };
    }
    function gerak(e) {
      if (!seret) return;
      if (!seret.aktif) {
        if (Math.abs(e.clientX - seret.x) + Math.abs(e.clientY - seret.y) < 8) return;
        seret.aktif = true;
        st.pilih = seret.kode;
        SLOT.forEach(function (k) {
          var s = el.querySelector('[data-slot="' + k + '"]');
          if (s) { s.classList.add(bolehDi(seret.kode, k) ? 'bisa' : 'tidak'); }
        });
        seret.sumber.classList.add('sedang-diseret');
        var h = seret.sumber.cloneNode(true);
        h.classList.add('hantu');
        h.removeAttribute('data-kartu');
        h.setAttribute('aria-hidden', 'true');
        h.style.width = seret.lebar + 'px';
        document.body.appendChild(h);
        seret.hantu = h;
        document.body.classList.add('sedang-menyeret');
      }
      seret.hantu.style.transform = 'translate(' + (e.clientX - seret.dx) + 'px,' + (e.clientY - seret.dy) + 'px)';
      el.querySelectorAll('.slot.di-atas').forEach(function (s) { s.classList.remove('di-atas'); });
      seret.hantu.style.display = 'none';
      var bawah = document.elementFromPoint(e.clientX, e.clientY);
      seret.hantu.style.display = '';
      var slot = bawah && bawah.closest('[data-slot]');
      if (slot && el.contains(slot)) slot.classList.add('di-atas');
    }
    function selesai(e, batal) {
      if (!seret) return;
      var s = seret;
      seret = null;
      if (!s.aktif) return;
      if (s.hantu) s.hantu.remove();
      document.body.classList.remove('sedang-menyeret');
      abaikanKlik = true;
      setTimeout(function () { abaikanKlik = false; }, 0);
      var bawah = batal ? null : document.elementFromPoint(e.clientX, e.clientY);
      var slot = bawah && bawah.closest('[data-slot]');
      if (slot && el.contains(slot)) {
        taruh(s.kode, slot.getAttribute('data-slot'));
      } else {
        var asal = slotDari(s.kode);
        st.pilih = null;
        if (asal && !batal && bawah && bawah.closest('.bk-bank')) kembalikan(asal);
        else renderSemua();
      }
    }
    function lepas(e) { selesai(e, false); }
    function batal(e) { selesai(e, true); }
    el.addEventListener('pointerdown', mulai);
    window.addEventListener('pointermove', gerak);
    window.addEventListener('pointerup', lepas);
    window.addEventListener('pointercancel', batal);
    hapusPendengar.push(function () {
      clearTimeout(kilatTimer);
      window.removeEventListener('pointermove', gerak);
      window.removeEventListener('pointerup', lepas);
      window.removeEventListener('pointercancel', batal);
      if (seret && seret.hantu) seret.hantu.remove();
      document.body.classList.remove('sedang-menyeret');
      seret = null;
    });

    st.pilih = null;
    st.pesan = null;
    renderSemua();
    return function () { hapusPendengar.forEach(function (f) { f(); }); };
  }

  APP.bagian.baukasten = {
    render: render,
    progres: function () {
      var target = DATA.baukasten.target || 5;
      return { selesai: Math.min(APP.simpan.daftar(BAGIAN).length, target), total: target, satuan: 'kalimat disusun' };
    }
  };
})();

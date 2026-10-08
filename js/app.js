/* =====================================================================
 * app.js — menu, navigasi (#/bagian), mode proyektor, halaman "Segera hadir"
 * ===================================================================== */
(function () {
  'use strict';

  var esc = APP.esc;
  var elKonten = document.getElementById('konten');
  var elMenu = document.getElementById('menu');
  var elTirai = document.getElementById('tirai');
  var btnMenu = document.getElementById('tombol-menu');
  var btnProyektor = document.getElementById('tombol-proyektor');
  var halaman = null;      // { id, hapus }
  var idAktif = null;

  /* ---------------- Mode proyektor ---------------- */
  function setProyektor(nyala, simpan) {
    document.documentElement.classList.toggle('mode-proyektor', nyala);
    btnProyektor.setAttribute('aria-pressed', nyala ? 'true' : 'false');
    btnProyektor.title = nyala ? 'Matikan mode proyektor (P)' : 'Mode proyektor: huruf besar, kontras tinggi (P)';
    if (simpan) APP.simpan.taruh('proyektor', nyala);
    tutupMenu();
  }
  setProyektor(!!APP.simpan.ambil('proyektor', false), false);
  btnProyektor.addEventListener('click', function () {
    setProyektor(!document.documentElement.classList.contains('mode-proyektor'), true);
  });

  /* ---------------- Menu ---------------- */
  function progresBagian(id) {
    var mod = APP.bagian[id];
    return mod && typeof mod.progres === 'function' ? mod.progres() : null;
  }

  function renderMenu() {
    var h = '<ol class="menu-daftar">';
    DATA.menu.forEach(function (item, i) {
      var status = '';
      if (!item.siap) {
        status = '<span class="menu-segera">Segera</span>';
      } else {
        var p = progresBagian(item.id);
        if (p && p.total) {
          var persen = Math.round(100 * p.selesai / p.total);
          status = '<span class="menu-progres" title="' + p.selesai + ' dari ' + p.total + '">' +
            '<span class="sr-only">progress ' + persen + ' persen</span>' +
            '<span class="menu-progres-isi" style="width:' + persen + '%"></span></span>';
        }
      }
      h += '<li><a class="menu-item' + (item.siap ? '' : ' belum') + '" href="#/' + item.id + '"' +
        (item.id === idAktif ? ' aria-current="page"' : '') + '>' +
        '<span class="menu-no">' + (i + 1) + '</span>' +
        '<span class="menu-ikon" aria-hidden="true">' + item.ikon + '</span>' +
        '<span class="menu-judul">' + esc(item.judul) + '</span>' + status + '</a></li>';
    });
    h += '</ol><p class="menu-kaki">Tekan <kbd>P</kbd> untuk mode proyektor.</p>';
    elMenu.innerHTML = h;
  }
  APP.dengar('progres', renderMenu);

  function menuMelayang() {
    // Menu samping tetap terlihat hanya di layar lebar dan bukan mode proyektor
    var lebar = window.matchMedia ? window.matchMedia('(min-width: 1024px)').matches : true;
    return !lebar || document.documentElement.classList.contains('mode-proyektor');
  }
  function bukaMenu() {
    elMenu.classList.add('terbuka');
    elTirai.hidden = false;
    btnMenu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-terbuka');
    var pertama = elMenu.querySelector('[aria-current]') || elMenu.querySelector('a');
    if (pertama) pertama.focus();
  }
  function tutupMenu(kembalikanFokus) {
    if (!elMenu.classList.contains('terbuka')) return;
    elMenu.classList.remove('terbuka');
    elTirai.hidden = true;
    btnMenu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-terbuka');
    if (kembalikanFokus) btnMenu.focus();
  }
  btnMenu.addEventListener('click', function () {
    if (elMenu.classList.contains('terbuka')) tutupMenu(true); else bukaMenu();
  });
  elTirai.addEventListener('click', function () { tutupMenu(true); });
  // Tautan di menu selalu menutup menu (juga bila halamannya sama)
  elMenu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) tutupMenu();
  });

  /* ---------------- Halaman "Segera hadir" ---------------- */
  function renderSegera(el, item) {
    el.innerHTML = APP.kop(item.id, item.ringkas) +
      '<section class="kartu segera">' +
        '<p class="chip-segera">Segera hadir</p>' +
        '<p>Bagian ini sedang disiapkan. Rencananya:</p>' +
        '<ul class="daftar-rencana">' + (item.rencana || []).map(function (r) { return '<li>' + APP.teks(r) + '</li>'; }).join('') + '</ul>' +
        '<p><a class="tombol" href="#/beranda">← Kembali ke Beranda</a></p>' +
      '</section>';
  }

  /* ---------------- Navigasi sebelum / sesudah ---------------- */
  function navLanjut(id) {
    var i = APP.nomorBagian(id) - 1;
    var seb = DATA.menu[i - 1], ses = DATA.menu[i + 1];
    return '<nav class="lanjut" aria-label="Bagian sebelum dan sesudah">' +
      (seb ? '<a class="lanjut-seb" href="#/' + seb.id + '"><span class="lanjut-label">← Sebelumnya</span>' +
             '<span class="lanjut-judul">' + esc(seb.judul) + '</span></a>' : '<span></span>') +
      (ses ? '<a class="lanjut-ses" href="#/' + ses.id + '"><span class="lanjut-label">Berikutnya →</span>' +
             '<span class="lanjut-judul">' + esc(ses.judul) + '</span></a>' : '<span></span>') +
      '</nav>';
  }

  /* ---------------- Router ---------------- */
  function bacaHash() {
    var h = location.hash || '';
    if (h && h.indexOf('#/') !== 0) return null;          // tautan lain: abaikan
    var bagian = h.replace(/^#\/?/, '').split('/');
    return { id: bagian[0] || 'beranda', param: bagian[1] ? decodeURIComponent(bagian[1]) : '' };
  }

  function rute() {
    var r = bacaHash();
    if (!r) return;
    var item = APP.menuItem(r.id);
    if (!item) { item = APP.menuItem('beranda'); r = { id: 'beranda', param: '' }; }

    APP.suara.henti();
    tutupMenu();
    if (halaman && typeof halaman.hapus === 'function') { try { halaman.hapus(); } catch (e) { /* abaikan */ } }

    idAktif = item.id;
    var wadah = document.createElement('div');
    wadah.className = 'halaman halaman-' + item.id;
    elKonten.innerHTML = '';
    elKonten.appendChild(wadah);

    var mod = APP.bagian[item.id];
    halaman = { id: item.id };
    if (item.siap && mod && typeof mod.render === 'function') {
      try {
        var hapus = mod.render(wadah, r.param);
        if (typeof hapus === 'function') halaman.hapus = hapus;
      } catch (e) {
        wadah.innerHTML = '<div class="kartu galat"><h1 tabindex="-1">Ups, ada yang salah</h1>' +
          '<p>Bagian ini tidak bisa ditampilkan. Mungkin ada salah ketik di <code>data.js</code>.</p>' +
          '<p class="galat-detail">' + esc(e && e.message) + '</p></div>';
        if (window.console) console.error(e);
      }
    } else {
      renderSegera(wadah, item);
    }
    if (item.id !== 'beranda') wadah.insertAdjacentHTML('beforeend', navLanjut(item.id));

    document.title = (item.id === 'beranda' ? '' : item.judul + ' · ') + DATA.pengaturan.judul;
    if (item.id !== 'beranda') APP.simpan.taruh('terakhir', item.id);
    renderMenu();

    // Fokus ke judul (untuk pembaca layar), lalu kembali ke atas,
    // kecuali alamat menunjuk ke tempat tertentu (mis. #/grammatik/D).
    if (!r.param) {
      var h1 = wadah.querySelector('h1');
      if (h1) { try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } }
      window.scrollTo(0, 0);
    }
  }

  /* ---------------- Tombol speaker (di semua halaman) ---------------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-ucap]') : null;
    if (b) APP.suara.ucap(b.getAttribute('data-ucap'), b);
  });

  /* ---------------- Tombol keyboard ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && elMenu.classList.contains('terbuka')) { tutupMenu(true); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'p' || e.key === 'P') {
      setProyektor(!document.documentElement.classList.contains('mode-proyektor'), true);
    }
  });

  // Tutup menu melayang bila layar dilebarkan
  window.addEventListener('resize', function () { if (!menuMelayang()) tutupMenu(); });

  // Tanpa audio: sembunyikan semua tombol speaker
  if (!APP.suara.ok) document.documentElement.classList.add('tanpa-suara');

  window.addEventListener('hashchange', rute);
  rute();
})();

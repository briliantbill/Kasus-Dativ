/* =====================================================================
 * data.js — SEMUA KONTEN WEBSITE ADA DI SINI
 * ---------------------------------------------------------------------
 * Ibu/Bapak guru cukup mengubah file ini untuk menambah atau mengganti
 * kalimat, penjelasan, dan soal. Logika website ada di file lain.
 *
 * TANDA WARNA (bisa dipakai di semua kalimat dan penjelasan):
 *   [m|der Mann]          → biru   (maskulin)
 *   [n|das Kind]          → hijau  (neutral)
 *   [f|die Frau]          → merah  (feminin)
 *   [pl|die Kinder]       → abu gelap (plural)
 *   [-|Laura]             → tanpa warna gender (mis. nama orang)
 *   [n|dem Kind|DAT]      → tambahkan |NOM, |AKK, atau |DAT untuk badge kasus
 *   **dem**               → huruf tebal + garis bawah (bagian yang berubah)
 *   {n}                   → akhiran oranye, mis. [pl|den Kinder{n}]
 *   *Wem?*                → miring (kata Jerman di dalam penjelasan)
 *   ==und==               → sorotan oranye (mis. kata penghubung)
 *
 * KALIMAT CONTOH ditulis sebagai { de: 'kalimat Jerman', id: 'terjemahan' }.
 * Audio dibuat otomatis dari kalimat Jerman (teks dalam kurung tidak dibaca).
 * Kalau perlu bacaan lain, tambahkan  ucapan: 'teks yang dibaca'.
 *
 * PENTING: setiap teks diapit tanda kutip tunggal '...'. Kalau di dalam teks
 * ada tanda kutip tunggal, tulis \' (garis miring terbalik + kutip).
 * Setelah setiap } atau ] dalam daftar, jangan lupa koma.
 * ===================================================================== */

var DATA = {

  /* ---------------------------------------------------------------
   * Pengaturan umum
   * --------------------------------------------------------------- */
  pengaturan: {
    judul: 'Wer? Wen? Wem?',
    subjudul: 'Nominativ · Akkusativ · Dativ',
    kunciPenyimpanan: 'werWenWem.v1',   // nama tempat progress disimpan di browser
    kecepatanAudio: 0.9                 // 1 = normal, 0.8 = lebih pelan
  },

  /* ---------------------------------------------------------------
   * Gender (warna mengikuti buku)
   * --------------------------------------------------------------- */
  gender: {
    m:  { nama: 'maskulin', singkat: 'mask.',  artikel: 'der', contoh: '[m|der Mann]' },
    n:  { nama: 'neutral',  singkat: 'neutr.', artikel: 'das', contoh: '[n|das Kind]' },
    f:  { nama: 'feminin',  singkat: 'fem.',   artikel: 'die', contoh: '[f|die Frau]' },
    pl: { nama: 'plural',   singkat: 'plural', artikel: 'die', contoh: '[pl|die Kinder]',
          catatan: 'Di Dativ: [pl|den Kinder{n}]. Akhiran **-n** selalu oranye.' }
  },

  /* ---------------------------------------------------------------
   * Kasus = peran kata benda di dalam kalimat
   * --------------------------------------------------------------- */
  kasus: {
    nom: { kode: 'NOM', nama: 'Nominativ', tanya: 'Wer? / Was?', tanyaUtama: 'Wer?', ikon: '🙋',
           peran: 'si pelaku',
           jelas: 'Nominativ = **si pelaku** / jawaban dari pertanyaan *Wer?* (siapa?) atau *Was?* (apa?).' },
    akk: { kode: 'AKK', nama: 'Akkusativ', tanya: 'Wen? / Was?', tanyaUtama: 'Wen?', ikon: '🎯',
           peran: 'yang dikenai tindakan',
           jelas: 'Akkusativ = **yang dikenai tindakan** / jawaban dari pertanyaan *Wen?* (siapa?) atau *Was?* (apa?).' },
    dat: { kode: 'DAT', nama: 'Dativ', tanya: 'Wem?', tanyaUtama: 'Wem?', ikon: '🎁',
           peran: 'si penerima',
           jelas: 'Dativ = **si penerima** / jawaban dari pertanyaan *Wem?* (kepada siapa?).' }
  },

  /* ---------------------------------------------------------------
   * Tabel artikel lengkap (dipakai Perubahan Artikel, Baukasten, latihan)
   * '–' berarti: tanpa artikel
   * --------------------------------------------------------------- */
  artikel: {
    tentu: {      // bestimmter Artikel
      nom: { m: 'der', n: 'das', f: 'die', pl: 'die' },
      akk: { m: 'den', n: 'das', f: 'die', pl: 'die' },
      dat: { m: 'dem', n: 'dem', f: 'der', pl: 'den' }
    },
    taktentu: {   // unbestimmter Artikel
      nom: { m: 'ein',   n: 'ein',   f: 'eine',  pl: '–' },
      akk: { m: 'einen', n: 'ein',   f: 'eine',  pl: '–' },
      dat: { m: 'einem', n: 'einem', f: 'einer', pl: '–' }
    }
  },

  /* ---------------------------------------------------------------
   * Kamus kata benda A1
   *   g: m / n / f / pl     sg: tunggal     pl: jamak
   *   datPl: bentuk Dativ plural (biasanya + n; tetap sama bila sudah -n atau -s)
 *   artiPl: arti jamak (kalau tidak diisi: "para" + arti)
   *   jenis: 'orang' atau 'benda'
   * --------------------------------------------------------------- */
  kataBenda: [
    // orang
    { id: 'mann',     g: 'm', sg: 'Mann',     pl: 'Männer',      datPl: 'Männern',     arti: 'laki-laki',         ikon: '👨', jenis: 'orang' },
    { id: 'freund',   g: 'm', sg: 'Freund',   pl: 'Freunde',     datPl: 'Freunden',    arti: 'teman (laki-laki)', artiPl: 'teman-teman', ikon: '🧑', jenis: 'orang' },
    { id: 'lehrer',   g: 'm', sg: 'Lehrer',   pl: 'Lehrer',      datPl: 'Lehrern',     arti: 'guru (laki-laki)',  ikon: '👨‍🏫', jenis: 'orang' },
    { id: 'arzt',     g: 'm', sg: 'Arzt',     pl: 'Ärzte',       datPl: 'Ärzten',      arti: 'dokter (laki-laki)', ikon: '👨‍⚕️', jenis: 'orang' },
    { id: 'vater',    g: 'm', sg: 'Vater',    pl: 'Väter',       datPl: 'Vätern',      arti: 'ayah',              ikon: '👨', jenis: 'orang' },
    { id: 'bruder',   g: 'm', sg: 'Bruder',   pl: 'Brüder',      datPl: 'Brüdern',     arti: 'saudara laki-laki', ikon: '👦', jenis: 'orang' },
    { id: 'opa',      g: 'm', sg: 'Opa',      pl: 'Opas',        datPl: 'Opas',        arti: 'kakek',             ikon: '👴', jenis: 'orang' },
    { id: 'chef',     g: 'm', sg: 'Chef',     pl: 'Chefs',       datPl: 'Chefs',       arti: 'bos (laki-laki)',   ikon: '👔', jenis: 'orang' },
    { id: 'kind',     g: 'n', sg: 'Kind',     pl: 'Kinder',      datPl: 'Kindern',     arti: 'anak',              artiPl: 'anak-anak', ikon: '🧒', jenis: 'orang' },
    { id: 'maedchen', g: 'n', sg: 'Mädchen',  pl: 'Mädchen',     datPl: 'Mädchen',     arti: 'anak perempuan',    ikon: '👧', jenis: 'orang' },
    { id: 'baby',     g: 'n', sg: 'Baby',     pl: 'Babys',       datPl: 'Babys',       arti: 'bayi',              ikon: '👶', jenis: 'orang' },
    { id: 'frau',     g: 'f', sg: 'Frau',     pl: 'Frauen',      datPl: 'Frauen',      arti: 'perempuan',         ikon: '👩', jenis: 'orang' },
    { id: 'freundin', g: 'f', sg: 'Freundin', pl: 'Freundinnen', datPl: 'Freundinnen', arti: 'teman (perempuan)', ikon: '👩', jenis: 'orang' },
    { id: 'lehrerin', g: 'f', sg: 'Lehrerin', pl: 'Lehrerinnen', datPl: 'Lehrerinnen', arti: 'guru (perempuan)',  ikon: '👩‍🏫', jenis: 'orang' },
    { id: 'aerztin',  g: 'f', sg: 'Ärztin',   pl: 'Ärztinnen',   datPl: 'Ärztinnen',   arti: 'dokter (perempuan)', ikon: '👩‍⚕️', jenis: 'orang' },
    { id: 'mutter',   g: 'f', sg: 'Mutter',   pl: 'Mütter',      datPl: 'Müttern',     arti: 'ibu',               ikon: '👩', jenis: 'orang' },
    { id: 'oma',      g: 'f', sg: 'Oma',      pl: 'Omas',        datPl: 'Omas',        arti: 'nenek',             ikon: '👵', jenis: 'orang' },
    { id: 'chefin',   g: 'f', sg: 'Chefin',   pl: 'Chefinnen',   datPl: 'Chefinnen',   arti: 'bos (perempuan)',   ikon: '👩', jenis: 'orang' },
    { id: 'eltern',   g: 'pl',                pl: 'Eltern',      datPl: 'Eltern',      arti: 'orang tua',         artiPl: 'orang tua', ikon: '👫', ikonPl: '👫', jenis: 'orang' },
    // benda (untuk bagian-bagian berikutnya)
    { id: 'apfel',    g: 'm', sg: 'Apfel',    pl: 'Äpfel',       datPl: 'Äpfeln',      arti: 'apel',              ikon: '🍎', jenis: 'benda' },
    { id: 'ball',     g: 'm', sg: 'Ball',     pl: 'Bälle',       datPl: 'Bällen',      arti: 'bola',              ikon: '⚽', jenis: 'benda' },
    { id: 'kuchen',   g: 'm', sg: 'Kuchen',   pl: 'Kuchen',      datPl: 'Kuchen',      arti: 'kue',               ikon: '🍰', jenis: 'benda' },
    { id: 'buch',     g: 'n', sg: 'Buch',     pl: 'Bücher',      datPl: 'Büchern',     arti: 'buku',              ikon: '📕', jenis: 'benda' },
    { id: 'geschenk', g: 'n', sg: 'Geschenk', pl: 'Geschenke',   datPl: 'Geschenken',  arti: 'hadiah',            ikon: '🎁', jenis: 'benda' },
    { id: 'taxi',     g: 'n', sg: 'Taxi',     pl: 'Taxis',       datPl: 'Taxis',       arti: 'taksi',             ikon: '🚕', jenis: 'benda' },
    { id: 'blume',    g: 'f', sg: 'Blume',    pl: 'Blumen',      datPl: 'Blumen',      arti: 'bunga',             ikon: '🌷', jenis: 'benda' },
    { id: 'tasche',   g: 'f', sg: 'Tasche',   pl: 'Taschen',     datPl: 'Taschen',     arti: 'tas',               ikon: '👜', jenis: 'benda' }
  ],

  /* ---------------------------------------------------------------
   * Menu: urutan bagian. siap: true = sudah bisa dipakai.
   * rencana = isi halaman "Segera hadir".
   * --------------------------------------------------------------- */
  menu: [
    { id: 'beranda',   ikon: '🏠', judul: 'Beranda', siap: true,
      ringkas: 'Pengantar Wer? Wen? Wem? dan peta belajar.' },
    { id: 'grammatik', ikon: '📖', judul: 'Gambar grammatik', siap: true,
      ringkas: 'Semua tabel dari buku (A–F). Klik baris untuk penjelasan dan audio.' },
    { id: 'tabel',     ikon: '🎛️', judul: 'Perubahan Artikel', siap: true,
      ringkas: 'Pilih gender dan kasus, lalu lihat artikelnya berubah.' },
    { id: 'adegan',    ikon: '🎭', judul: 'Wer gibt wem was?', siap: true,
      ringkas: 'Adegan bergambar: siapa memberi apa kepada siapa.' },
    { id: 'detektif',  ikon: '🔍', judul: 'Detektif Kasus', siap: true,
      ringkas: 'Klik kata benda, lalu tentukan: Wer, Wen, atau Wem?' },
    { id: 'baukasten', ikon: '🧱', judul: 'Satz-Baukasten', siap: true,
      ringkas: 'Susun kalimat sendiri; artikelnya berubah otomatis.' },
    { id: 'verben',    ikon: '🗂️', judul: 'Sortir kata kerja', siap: true,
      ringkas: 'Kata kerja ini perlu AKK, DAT, atau keduanya?' },
    { id: 'navigator', ikon: '🗺️', judul: 'Präpositionen-Navigator', siap: true,
      ringkas: 'Peta kota: Wohin? Wo? Woher?' },
    { id: 'latihan',   ikon: '✏️', judul: 'Latihan berlevel', siap: true,
      ringkas: 'Tiga level soal, dengan lencana di akhir level.' },
    { id: 'kelas',     ikon: '🏫', judul: 'Mode Kelas', siap: true,
      ringkas: 'Untuk guru: mode proyektor dan kuis 2 tim.' },
    { id: 'ringkasan', ikon: '🖨️', judul: 'Ringkasan cetak', siap: true,
      ringkas: 'Semua tabel dalam satu halaman untuk dicetak.' }
  ],

  /* ---------------------------------------------------------------
   * Bagian 1 — Beranda
   * --------------------------------------------------------------- */
  beranda: {
    judul: 'Wer? Wen? Wem?',
    sub: 'Belajar Nominativ, Akkusativ, dan Dativ dengan tiga pertanyaan kecil.',
    pengantar: 'Dalam bahasa Jerman, artikel bisa berubah: *der* bisa menjadi *den* atau *dem*. ' +
               'Artikel berubah karena **peran** kata benda di dalam kalimat. ' +
               'Untuk menemukan perannya, cukup bertanya: *Wer? Wen? Wem?*',
    jangkar: {
      kalimat: '[f|Die Mutter|NOM] gibt [n|dem Kind|DAT] [m|einen Apfel|AKK].',
      id: 'Ibu memberi anak itu sebuah apel.',
      ikon: ['👩', '🍎', '🧒'],
      peran: {
        nom: { tanya: 'Wer gibt dem Kind einen Apfel?', jawab: '[f|Die Mutter].',
               id: 'Siapa yang memberi? → **Ibu**. Dia si pelaku.' },
        akk: { tanya: 'Was gibt die Mutter dem Kind?', jawab: '[m|Einen Apfel].',
               id: 'Apa yang diberikan? → **sebuah apel**. Apel itu yang dikenai tindakan.' },
        dat: { tanya: 'Wem gibt die Mutter einen Apfel?', jawab: '[n|Dem Kind].',
               id: 'Kepada siapa? → **anak itu**. Dia si penerima.' }
      }
    }
  },

  /* ---------------------------------------------------------------
   * Bagian 2 — Gambar grammatik (isi halaman buku, poin A–F)
   *   kolom: judul kolom tabel; sempit: true = kolom kecil;
 *          pendek: judul singkat untuk layar HP; penuh: true = di HP tampil di baris sendiri
   *   baris: sel (isi tabel), g (gender, opsional), penjelasan (maks. 3 kalimat),
   *          kalimat (dibacakan), contoh (1–2 contoh tambahan)
   *   Animasi (opsional):
   *     posisi: ['posisi 0', 'posisi 1', 'verba (posisi 2)', 'sisa kalimat']
   *     morf:   ['m: der → dem']          → artikel berubah
   *     lebur:  ['zu + dem = zum']        → preposisi + artikel melebur
   * --------------------------------------------------------------- */
  grammatik: {
    gambar: 'grammatik.png',
    intro: 'Semua tabel dari halaman grammatik buku, dibuat ulang supaya bisa diklik. ' +
           'Klik satu baris untuk melihat penjelasan, mendengar pengucapan, dan contoh lain.',
    kartu: [

      /* ----- A ----- */
      { id: 'A', judul: 'Sätze verbinden: und, oder, aber', sub: 'Menggabungkan dua kalimat',
        intro: 'Dengan *und* (dan), *oder* (atau), dan *aber* (tetapi) kita menggabungkan dua kalimat. ' +
               'Kata ini berdiri di **posisi 0**, jadi urutan kalimat kedua tidak berubah.',
        kolom: [{ label: 'Satz 1' }, { label: 'Position 0', pendek: 'Pos. 0', sempit: true }, { label: 'Satz 2' }],
        baris: [
          { sel: ['Ich bin in Köln.', '+', 'Ich mache ein Praktikum.'],
            posisi: ['', 'Ich', 'mache', 'ein Praktikum.'],
            penjelasan: 'Ini dua kalimat biasa. Di kalimat kedua, *ich* ada di posisi 1 dan verba *mache* di posisi 2.',
            kalimat: [{ de: 'Ich bin in Köln.', id: 'Saya (sedang) di Köln.' },
                      { de: 'Ich mache ein Praktikum.', id: 'Saya magang.' }],
            contoh: [{ de: 'Ich wohne in Berlin. Ich lerne Deutsch.', id: 'Saya tinggal di Berlin. Saya belajar bahasa Jerman.' }] },
          { sel: ['Ich bin in Köln', '==und==', '(ich) mache ein Praktikum.'],
            posisi: ['und', '(ich)', 'mache', 'ein Praktikum.'],
            penjelasan: '*und* = dan. *und* berdiri di posisi 0, jadi verba tetap di posisi 2. ' +
                        'Subjeknya sama (*ich*), jadi boleh dihilangkan.',
            kalimat: [{ de: 'Ich bin in Köln und (ich) mache ein Praktikum.', id: 'Saya di Köln dan (saya) magang.' }],
            contoh: [{ de: 'Ich trinke Kaffee und (ich) esse ein Brötchen.', id: 'Saya minum kopi dan (saya) makan roti.' },
                     { de: 'Peter wohnt in Hamburg und Maria wohnt in München.',
                       id: 'Peter tinggal di Hamburg dan Maria tinggal di München. (Subjeknya beda, jadi tidak dihilangkan.)' }] },
          { sel: ['Ich telefoniere', '==oder==', '(ich) arbeite am Computer.'],
            posisi: ['oder', '(ich)', 'arbeite', 'am Computer.'],
            penjelasan: '*oder* = atau. Sama seperti *und*: posisi 0, verba tetap di posisi 2, ' +
                        'dan subjek yang sama boleh dihilangkan.',
            kalimat: [{ de: 'Ich telefoniere oder (ich) arbeite am Computer.', id: 'Saya menelepon atau (saya) bekerja di komputer.' }],
            contoh: [{ de: 'Ich koche oder (ich) bestelle eine Pizza.', id: 'Saya memasak atau (saya) memesan pizza.' },
                     { de: 'Wir fahren mit dem Bus oder (wir) gehen zu Fuß.', id: 'Kami naik bus atau (kami) jalan kaki.' }] },
          { sel: ['Die Firma ist klein,', '==aber==', 'sie hat viele Kunden.'],
            posisi: ['aber', 'sie', 'hat', 'viele Kunden.'],
            penjelasan: '*aber* = tetapi. Sebelum *aber* selalu ada **koma**. ' +
                        '*aber* juga di posisi 0: *sie* di posisi 1, *hat* di posisi 2.',
            kalimat: [{ de: 'Die Firma ist klein, aber sie hat viele Kunden.', id: 'Perusahaannya kecil, tetapi punya banyak pelanggan.' }],
            contoh: [{ de: 'Das Zimmer ist klein, aber es ist schön.', id: 'Kamarnya kecil, tetapi bagus.' },
                     { de: 'Ich habe Hunger, aber ich habe kein Geld.', id: 'Saya lapar, tetapi saya tidak punya uang.' }] }
        ],
        catatan: ['*und · oder · aber* = **posisi 0**. Urutan kata kalimat kedua tidak berubah.',
                  'Sebelum *aber* selalu ada koma. Sebelum *und* dan *oder* biasanya tanpa koma.']
      },

      /* ----- B ----- */
      { id: 'B', judul: 'Dativ: bestimmter und unbestimmter Artikel', sub: 'Artikel di Dativ',
        intro: 'Di Dativ, **semua** artikel berubah. Contoh di sini memakai *mit* (= dengan), yang selalu diikuti Dativ.',
        kolom: [{ label: 'Nominativ' }, { label: '', sempit: true }, { label: 'Dativ' }],
        baris: [
          { g: 'm', sel: ['[m|der/ein Freund]', '→', 'mit [m|**dem/einem** Freund]'],
            morf: ['m: der → dem', 'm: ein → einem'],
            penjelasan: 'Maskulin: *der* → *dem*, *ein* → *einem*. Kata bendanya (*Freund*) tidak berubah.',
            kalimat: [{ de: 'mit [m|**dem** Freund]', id: 'dengan teman itu' },
                      { de: 'mit [m|**einem** Freund]', id: 'dengan seorang teman' }],
            contoh: [{ de: 'Ich fahre mit [m|**dem** Bus].', id: 'Saya naik bus.' },
                     { de: 'Sie spricht mit [m|**einem** Lehrer].', id: 'Dia (perempuan) berbicara dengan seorang guru.' }] },
          { g: 'n', sel: ['[n|das/ein Taxi]', '→', 'mit [n|**dem/einem** Taxi]'],
            morf: ['n: das → dem', 'n: ein → einem'],
            penjelasan: 'Neutral: *das* → *dem*, *ein* → *einem*. Sama seperti maskulin!',
            kalimat: [{ de: 'mit [n|**dem** Taxi]', id: 'dengan taksi itu' },
                      { de: 'mit [n|**einem** Taxi]', id: 'dengan sebuah taksi' }],
            contoh: [{ de: 'Wir fahren mit [n|**dem** Auto].', id: 'Kami naik mobil.' },
                     { de: 'Ich spiele mit [n|**einem** Kind].', id: 'Saya bermain dengan seorang anak.' }] },
          { g: 'f', sel: ['[f|die/eine Freundin]', '→', 'mit [f|**der/einer** Freundin]'],
            morf: ['f: die → der', 'f: eine → einer'],
            penjelasan: 'Feminin: *die* → *der*, *eine* → *einer*. Hati-hati: *der* di sini bukan maskulin, tetapi feminin di Dativ!',
            kalimat: [{ de: 'mit [f|**der** Freundin]', id: 'dengan teman (perempuan) itu' },
                      { de: 'mit [f|**einer** Freundin]', id: 'dengan seorang teman (perempuan)' }],
            contoh: [{ de: 'Ich fahre mit [f|**der** U-Bahn].', id: 'Saya naik kereta bawah tanah.' },
                     { de: 'Er spricht mit [f|**einer** Frau].', id: 'Dia (laki-laki) berbicara dengan seorang perempuan.' }] },
          { g: 'pl', sel: ['[pl|die/– Mitarbeiter]', '→', 'mit [pl|**den**/– Mitarbeiter{n}]'],
            morf: ['pl: die → den', 'pl: Mitarbeiter → Mitarbeitern'],
            penjelasan: 'Plural: *die* → *den*, dan kata bendanya mendapat **-n**: *Mitarbeiter{n}*. ' +
                        'Tanpa artikel pun, *-n* tetap ada.',
            kalimat: [{ de: 'mit [pl|**den** Mitarbeiter{n}]', id: 'dengan para karyawan itu' },
                      { de: 'mit [pl|Mitarbeiter{n}]', id: 'dengan (beberapa) karyawan' }],
            contoh: [{ de: 'Ich spiele mit [pl|**den** Kinder{n}].', id: 'Saya bermain dengan anak-anak itu.' },
                     { de: 'Sie spricht mit [pl|**den** Frauen].',
                       id: 'Dia berbicara dengan para perempuan itu. (*Frauen* sudah berakhiran -n, jadi tidak ditambah lagi.)' }] }
        ],
        catatan: [{ de: 'Im Dativ Plural haben die meisten Nomen ein -n.', id: 'Di Dativ plural, kebanyakan kata benda mendapat -n.' },
                  'Kecuali kata benda yang sudah berakhiran **-n** atau **-s**: [pl|den Frauen], [pl|den Taxis].']
      },

      /* ----- C ----- */
      { id: 'C', judul: 'Präposition mit + Dativ', sub: 'mit selalu + Dativ',
        intro: '*mit* (= dengan, naik) **selalu** diikuti Dativ. Pertanyaannya: *Mit wem?* (dengan siapa?).',
        tumpuk: true,
        kolom: [{ label: 'Frage' }, { label: 'Antwort' }],
        baris: [
          { sel: ['Mit ==wem== fährt [-|Laura]?', 'Sie fährt mit [m|**einem** Freund] und [f|**einer** Freundin].'],
            morf: ['-: wer → wem', 'm: ein → einem', 'f: eine → einer'],
            penjelasan: '*wem* adalah bentuk Dativ dari *wer*. Jawabannya juga Dativ: *einem* Freund (maskulin), *einer* Freundin (feminin). ' +
                        'Perhatikan: *wer → wem*, *der → dem*, *ein → einem*: semuanya berakhiran **-m**.',
            kalimat: [{ de: 'Mit wem fährt Laura?', id: 'Dengan siapa Laura pergi?' },
                      { de: 'Sie fährt mit [m|**einem** Freund] und [f|**einer** Freundin].',
                        id: 'Dia pergi dengan seorang teman laki-laki dan seorang teman perempuan.' }],
            contoh: [{ de: 'Mit wem lernst du Deutsch? – Mit [f|**einer** Freundin].', id: 'Dengan siapa kamu belajar bahasa Jerman? – Dengan seorang teman (perempuan).' },
                     { de: 'Ich fahre mit [m|**dem** Bus] [f|**zur** Schule].', id: 'Saya naik bus ke sekolah.' }] }
        ],
        catatan: ['*mit* + Dativ, selalu. Tanya *Mit wem?* untuk orang.']
      },

      /* ----- D ----- */
      { id: 'D', judul: 'Ortsangaben: Präpositionen mit Dativ', sub: 'Menyatakan tempat',
        intro: 'Empat preposisi ini menjawab pertanyaan tempat: *Wohin?* (ke mana?), *Wo?* (di mana?), *Woher?* (dari mana?). ' +
               'Semuanya **selalu Dativ**.',
        kolom: [{ label: 'Frage', sempit: true }, { label: 'Präp.', sempit: true }, { label: 'Beispiel', penuh: true }],
        baris: [
          { sel: ['Wohin?', '==zu==', 'Sie geht [m|**zum** Chef] / [f|**zur** Bank].'],
            lebur: ['zu + dem = zum', 'zu + der = zur'],
            penjelasan: '*zu* = menuju ke (orang atau tempat). Menjawab pertanyaan *Wohin?* (ke mana?). ' +
                        'Biasanya disingkat: *zum* (maskulin/neutral), *zur* (feminin).',
            kalimat: [{ de: 'Sie geht [m|**zum** Chef].', id: 'Dia pergi ke bos.' },
                      { de: 'Sie geht [f|**zur** Bank].', id: 'Dia pergi ke bank.' }],
            contoh: [{ de: 'Ich gehe [m|**zum** Arzt].', id: 'Saya pergi ke dokter.' },
                     { de: 'Wir fahren [f|**zur** Oma].', id: 'Kami pergi ke (rumah) nenek.' }] },
          { sel: ['Wo?', '==bei==', 'Sie ist [m|**beim** Chef] / [f|**bei der** Chefin].'],
            lebur: ['bei + dem = beim'],
            penjelasan: '*bei* = berada di (tempat seseorang). Menjawab pertanyaan *Wo?* (di mana?). ' +
                        '*bei + dem* = *beim*, tetapi *bei der* tidak disingkat.',
            kalimat: [{ de: 'Sie ist [m|**beim** Chef].', id: 'Dia sedang di (ruang) bos.' },
                      { de: 'Sie ist [f|**bei der** Chefin].', id: 'Dia sedang di (ruang) bos perempuan.' }],
            contoh: [{ de: 'Ich bin [m|**beim** Arzt].', id: 'Saya sedang di dokter.' },
                     { de: 'Das Kind ist [f|**bei der** Oma].', id: 'Anak itu sedang di (rumah) nenek.' }] },
          { sel: ['Woher?', '==aus==', 'Er kommt [n|**aus dem** Haus] / [f|**aus der** Bank].'],
            penjelasan: '*aus* = keluar dari (dalam gedung, kota, atau negara). Menjawab pertanyaan *Woher?* (dari mana?). ' +
                        '*aus* tidak punya bentuk singkat.',
            kalimat: [{ de: 'Er kommt [n|**aus dem** Haus].', id: 'Dia keluar dari rumah.' },
                      { de: 'Er kommt [f|**aus der** Bank].', id: 'Dia keluar dari bank.' }],
            contoh: [{ de: 'Sie kommt [m|**aus dem** Supermarkt].', id: 'Dia keluar dari supermarket.' },
                     { de: 'Ich komme aus Indonesien.', id: 'Saya berasal dari Indonesia. (Nama negara biasanya tanpa artikel.)' }] },
          { sel: ['Woher?', '==von==', 'Sie kommt [m|**vom** Chef] / [f|**von der** Chefin].'],
            lebur: ['von + dem = vom'],
            penjelasan: '*von* = dari (seseorang atau tempat kegiatan). Juga menjawab *Woher?*. ' +
                        '*von + dem* = *vom*, tetapi *von der* tidak disingkat.',
            kalimat: [{ de: 'Sie kommt [m|**vom** Chef].', id: 'Dia datang dari (ruang) bos.' },
                      { de: 'Sie kommt [f|**von der** Chefin].', id: 'Dia datang dari (ruang) bos perempuan.' }],
            contoh: [{ de: 'Ich komme [m|**vom** Arzt].', id: 'Saya pulang dari dokter.' },
                     { de: 'Sie kommt [f|**von der** Arbeit].', id: 'Dia pulang dari kerja.' }] }
        ],
        catatan: ['*zu, bei, aus, von* (dan juga *mit*) **selalu Dativ**.',
                  '*Wohin?* → *zu*  ·  *Wo?* → *bei*  ·  *Woher?* → *aus* / *von*',
                  '*aus* = dari **dalam** sesuatu. *von* = dari orang atau dari suatu titik.']
      },

      /* ----- E ----- */
      { id: 'E', judul: 'Kurzformen', sub: 'Bentuk singkat',
        intro: 'Beberapa preposisi bergabung dengan artikel *dem* atau *der* menjadi satu kata pendek. ' +
               'Klik baris untuk melihat bagaimana keduanya melebur.',
        kolom: [{ label: 'Präp. + Artikel', sempit: true }, { label: 'Kurzform', sempit: true }, { label: 'Beispiel', penuh: true }],
        baris: [
          { sel: ['zu + der', '**zur**', 'Ich gehe [f|**zur** Bank].'],
            lebur: ['zu + der = zur'],
            penjelasan: '*zu* + *der* (feminin di Dativ) = *zur*. Dipakai untuk kata benda feminin: *die Bank* → *zur Bank*.',
            kalimat: [{ de: 'Ich gehe [f|**zur** Bank].', id: 'Saya pergi ke bank.' }],
            contoh: [{ de: 'Wir gehen [f|**zur** Schule].', id: 'Kami pergi ke sekolah.' },
                     { de: 'Ich fahre [f|**zur** Arbeit].', id: 'Saya berangkat ke tempat kerja.' }] },
          { sel: ['zu + dem', '**zum**', 'Ich gehe [m|**zum** Supermarkt].'],
            lebur: ['zu + dem = zum'],
            penjelasan: '*zu* + *dem* (maskulin atau neutral di Dativ) = *zum*: *der Supermarkt* → *zum Supermarkt*, *das Hotel* → *zum Hotel*.',
            kalimat: [{ de: 'Ich gehe [m|**zum** Supermarkt].', id: 'Saya pergi ke supermarket.' }],
            contoh: [{ de: 'Das Taxi fährt [n|**zum** Hotel].', id: 'Taksi itu pergi ke hotel.' },
                     { de: 'Er geht [m|**zum** Bahnhof].', id: 'Dia pergi ke stasiun.' }] },
          { sel: ['bei + dem', '**beim**', 'Ich bin [m|**beim** Arzt].'],
            lebur: ['bei + dem = beim'],
            penjelasan: '*bei* + *dem* = *beim*. Tetapi *bei der* (feminin) tidak disingkat: *bei der Ärztin*.',
            kalimat: [{ de: 'Ich bin [m|**beim** Arzt].', id: 'Saya sedang di dokter.' }],
            contoh: [{ de: 'Mama ist [m|**beim** Bäcker].', id: 'Mama sedang di toko roti.' },
                     { de: 'Ich bin [f|**bei der** Ärztin].', id: 'Saya sedang di dokter perempuan. (*bei der* tidak disingkat.)' }] },
          { sel: ['von + dem', '**vom**', 'Ich komme [m|**vom** Bahnhof].'],
            lebur: ['von + dem = vom'],
            penjelasan: '*von* + *dem* = *vom*. Tetapi *von der* (feminin) tidak disingkat: *von der Chefin*.',
            kalimat: [{ de: 'Ich komme [m|**vom** Bahnhof].', id: 'Saya datang dari stasiun.' }],
            contoh: [{ de: 'Das Geschenk ist [m|**vom** Opa].', id: 'Hadiah itu dari kakek.' },
                     { de: 'Ich komme [f|**von der** Schule].', id: 'Saya pulang dari sekolah.' }] }
        ],
        catatan: ['Tidak ada bentuk singkat untuk: *bei der*, *von der*, *aus dem*, *aus der*, dan plural *zu den*.',
                  'Satu lagi ada di F: *in + dem* = *im*.']
      },

      /* ----- F ----- */
      { id: 'F', judul: 'in + Dativ', sub: 'in untuk pertanyaan Wo?',
        intro: '*in* juga bisa memakai Dativ. Untuk A1 cukup ingat: pertanyaan *Wo?* (di mana?) → Dativ.',
        kolom: [{ label: 'Frage', sempit: true }, { label: 'Beispiel' }],
        baris: [
          { sel: ['Wo?', 'Er ist [n|**im** Haus].'],
            lebur: ['in + dem = im'],
            penjelasan: '*in* + *dem* = *im*. Untuk tempat maskulin dan neutral: *der Supermarkt* → *im Supermarkt*, *das Haus* → *im Haus*.',
            kalimat: [{ de: 'Er ist [n|**im** Haus].', id: 'Dia ada di dalam rumah.' }],
            contoh: [{ de: 'Ich bin [m|**im** Supermarkt].', id: 'Saya ada di supermarket.' },
                     { de: 'Wir sind [n|**im** Café].', id: 'Kami ada di kafe.' }] },
          { sel: ['Wo?', 'Er ist [f|**in der** Bank].'],
            penjelasan: 'Feminin: *in der*. Bentuk ini tidak disingkat: *die Bank* → *in der Bank*.',
            kalimat: [{ de: 'Er ist [f|**in der** Bank].', id: 'Dia ada di bank.' }],
            contoh: [{ de: 'Das Kind ist [f|**in der** Schule].', id: 'Anak itu ada di sekolah.' },
                     { de: 'Mama ist [f|**in der** Küche].', id: 'Mama ada di dapur.' }] }
        ],
        catatan: ['Untuk A1 cukup ingat: pertanyaan *Wo?* → pakai **Dativ**.']
      }
    ]
  },

  /* ---------------------------------------------------------------
   * Bagian 3 — Perubahan Artikel
   *   bingkai: kalimat untuk tiap kasus. %X% = tempat kata benda.
   *   sg = kalimat untuk tunggal, pl = kalimat untuk plural.
   *   pilihan: kata benda (id dari kataBenda) yang bisa dipilih per gender.
   *   Hanya orang, supaya pertanyaan Wer? Wen? Wem? selalu cocok.
   * --------------------------------------------------------------- */
  tabelHidup: {
    intro: 'Pilih gender, kasus, dan jenis artikel, lalu lihat artikel mana yang berubah dan mana yang tetap sama.',
    petunjukTabel: 'Ketuk satu kotak untuk memilihnya. Di setiap kotak, kata yang atas adalah artikel tentu (*der/das/die*), ' +
                   'kata yang bawah artikel tak tentu (*ein/eine*).',
    bingkai: {
      nom: { tanya: 'Wer ist da?',    tanyaId: 'Siapa yang ada di sana?',  sg: '%X% ist da.',   pl: '%X% sind da.' },
      akk: { tanya: 'Wen siehst du?', tanyaId: 'Siapa yang kamu lihat?',   sg: 'Ich sehe %X%.',  pl: 'Ich sehe %X%.' },
      dat: { tanya: 'Wem hilfst du?', tanyaId: 'Kamu membantu siapa?',     sg: 'Ich helfe %X%.', pl: 'Ich helfe %X%.' }
    },
    pilihan: {
      m:  ['mann', 'freund', 'lehrer', 'arzt'],
      n:  ['kind', 'maedchen', 'baby'],
      f:  ['frau', 'freundin', 'lehrerin', 'aerztin'],
      pl: ['kind', 'freund', 'mann', 'lehrer', 'frau', 'oma']
    },
    penjelasan: {
      'nom-m':  'Nominativ maskulin: *der* / *ein*. Ini bentuk dasar, seperti di kamus.',
      'nom-n':  'Nominativ neutral: *das* / *ein*. Ini bentuk dasar.',
      'nom-f':  'Nominativ feminin: *die* / *eine*. Ini bentuk dasar.',
      'nom-pl': 'Nominativ plural: *die* / tanpa artikel (–). Ini bentuk dasar.',
      'akk-m':  'Maskulin **berubah** di Akkusativ: *der* → *den*, *ein* → *einen*.',
      'akk-n':  'Neutral **tidak berubah** di Akkusativ: tetap *das* / *ein*.',
      'akk-f':  'Feminin **tidak berubah** di Akkusativ: tetap *die* / *eine*.',
      'akk-pl': 'Plural **tidak berubah** di Akkusativ: tetap *die* / –.',
      'dat-m':  'Di Dativ, maskulin berubah: *der* → *dem*, *ein* → *einem*.',
      'dat-n':  'Di Dativ, neutral berubah: *das* → *dem*, *ein* → *einem* (sama seperti maskulin).',
      'dat-f':  'Di Dativ, feminin berubah: *die* → *der*, *eine* → *einer*.',
      'dat-pl': 'Di Dativ, plural berubah: *die* → *den*, dan kata benda mendapat **-n**.'
    },
    // catatan khusus Dativ plural. %PL% = bentuk plural, %DAT% = bentuk Dativ plural
    datPl: {
      tambahN:  '*%PL%* → *%DAT%*: ditambah **-n**.',
      sudahN:   '*%PL%* sudah berakhiran -n, jadi **tidak** ditambah lagi.',
      akhiranS: '*%PL%* berakhiran -s, jadi **tidak** ditambah -n.'
    },
    pesanKunci: {
      akk: 'Di Akkusativ, **hanya maskulin yang berubah**: *der* → *den*, *ein* → *einen*.',
      dat: 'Di Dativ, **semua berubah**. Plural mendapat **-n** pada kata benda ' +
           '(kecuali yang sudah berakhiran -n atau -s: [pl|den Frauen], [pl|den Taxis]).'
    }
  },

  /* ---------------------------------------------------------------
   * Bagian 4 — Adegan "Wer gibt wem was?"
   *   kalimat: tandai si pelaku |NOM, si penerima |DAT, dan bendanya |AKK
   *   ikon / arti / tanya: untuk tiap kasus (nom, dat, akk)
   *   Bentuk dasar (Nominativ) dihitung otomatis dari kalimat.
   *   Untuk Dativ plural, tulis akhiran -n sebagai {n}: [pl|den Kinder{n}|DAT]
   * --------------------------------------------------------------- */
  adegan: {
    intro: 'Siapa memberi apa kepada siapa? Ketuk tokoh dan bendanya. ' +
           'Lihat badge kasusnya, dan bagaimana artikelnya berubah.',
    teks: {
      berubah: 'Bentuk dasar *%DASAR%* → di kalimat menjadi *%BENTUK%*.',
      tetap:   'Bentuk dasar *%DASAR%*, di kalimat **tidak berubah**.',
      panah:   'Panah: dari si pelaku ke si penerima.',
      lengkap: 'Lengkap! Si pelaku memberi, si penerima menerima. Dengarkan kalimatnya.'
    },
    daftar: [
      { judul: 'Beim Bäcker', latar: '🥖',
        kalimat: '[m|Der Bäcker|NOM] gibt [f|der Frau|DAT] [n|ein Brot|AKK].',
        id: 'Tukang roti memberi perempuan itu sebuah roti.',
        ikon: { nom: '👨‍🍳', dat: '👩', akk: '🍞' },
        arti: { nom: 'tukang roti', dat: 'perempuan', akk: 'roti' },
        tanya: { nom: 'Wer gibt der Frau ein Brot?', dat: 'Wem gibt der Bäcker ein Brot?', akk: 'Was gibt der Bäcker der Frau?' },
        catatan: '*der Frau*: di sini *der* adalah feminin di Dativ, bukan maskulin!' },
      { judul: 'Geburtstag', latar: '🎂',
        kalimat: '[f|Die Oma|NOM] schenkt [n|dem Kind|DAT] [m|einen Ball|AKK].',
        id: 'Nenek menghadiahkan sebuah bola kepada anak itu.',
        ikon: { nom: '👵', dat: '🧒', akk: '⚽' },
        arti: { nom: 'nenek', dat: 'anak', akk: 'bola' },
        tanya: { nom: 'Wer schenkt dem Kind einen Ball?', dat: 'Wem schenkt die Oma einen Ball?', akk: 'Was schenkt die Oma dem Kind?' },
        catatan: '*ein Ball* → *einen Ball*: maskulin berubah di Akkusativ.' },
      { judul: 'Im Café', latar: '☕',
        kalimat: '[m|Der Kellner|NOM] bringt [m|dem Mann|DAT] [m|einen Kaffee|AKK].',
        id: 'Pelayan membawakan secangkir kopi untuk laki-laki itu.',
        ikon: { nom: '🤵', dat: '👨', akk: '☕' },
        arti: { nom: 'pelayan', dat: 'laki-laki', akk: 'kopi' },
        tanya: { nom: 'Wer bringt dem Mann einen Kaffee?', dat: 'Wem bringt der Kellner einen Kaffee?', akk: 'Was bringt der Kellner dem Mann?' },
        catatan: 'Semuanya maskulin! Lihat tiga bentuknya: *der* (NOM), *dem* (DAT), *einen* (AKK).' },
      { judul: 'Im Büro', latar: '💼',
        kalimat: '[f|Die Chefin|NOM] zeigt [m|dem Mitarbeiter|DAT] [m|den Computer|AKK].',
        id: 'Bos (perempuan) menunjukkan komputer itu kepada karyawan.',
        ikon: { nom: '👩‍💼', dat: '🧑‍💻', akk: '💻' },
        arti: { nom: 'bos (perempuan)', dat: 'karyawan', akk: 'komputer' },
        tanya: { nom: 'Wer zeigt dem Mitarbeiter den Computer?', dat: 'Wem zeigt die Chefin den Computer?', akk: 'Was zeigt die Chefin dem Mitarbeiter?' },
        catatan: 'Dua maskulin: *dem Mitarbeiter* (DAT, si penerima) dan *den Computer* (AKK, yang ditunjukkan).' },
      { judul: 'Abendessen', latar: '🍕',
        kalimat: '[m|Der Vater|NOM] bringt [pl|den Kinder{n}|DAT] [f|die Pizza|AKK].',
        id: 'Ayah membawakan pizza untuk anak-anak.',
        ikon: { nom: '👨', dat: '🧒🧒', akk: '🍕' },
        arti: { nom: 'ayah', dat: 'anak-anak', akk: 'pizza' },
        tanya: { nom: 'Wer bringt den Kindern die Pizza?', dat: 'Wem bringt der Vater die Pizza?', akk: 'Was bringt der Vater den Kindern?' },
        catatan: 'Plural di Dativ: *den Kinder{n}*, ada akhiran **-n**!' },
      { judul: 'Muttertag', latar: '💐',
        kalimat: '[n|Das Mädchen|NOM] schenkt [f|der Mutter|DAT] [f|eine Blume|AKK].',
        id: 'Anak perempuan itu menghadiahkan setangkai bunga kepada ibu.',
        ikon: { nom: '👧', dat: '👩', akk: '🌷' },
        arti: { nom: 'anak perempuan', dat: 'ibu', akk: 'bunga' },
        tanya: { nom: 'Wer schenkt der Mutter eine Blume?', dat: 'Wem schenkt das Mädchen eine Blume?', akk: 'Was schenkt das Mädchen der Mutter?' },
        catatan: 'Feminin: *die Mutter* → *der Mutter* (DAT), tetapi *eine Blume* tetap sama (AKK).' }
    ]
  },

  /* ---------------------------------------------------------------
   * Bagian 5 — Detektif Kasus
   *   kalimat: setiap kata benda diberi tanda kasus (= kunci jawaban)
   *   tanya: pertanyaan yang menemukan kata benda itu (untuk umpan balik)
   *   catatan (opsional): ditampilkan di umpan balik kalimat itu
   *   peran (opsional): nama peran khusus untuk kalimat ini, mis. { dat: 'si pemilik' }
   *   Teks umpan balik: %TANYA% %JAWAB% %FRASE% %PERAN% %PERAN_PILIH% %ART% %GENDER% %KASUS% %KATA%
   * --------------------------------------------------------------- */
  detektif: {
    intro: 'Ketuk setiap kata benda yang berwarna, lalu pilih pertanyaannya: *Wer?*, *Wen?*, atau *Wem?* ' +
           'Artikelnya adalah petunjuk penting!',
    pilihan: { nom: 'Wer? / Was?', akk: 'Wen? / Was?', dat: 'Wem?' },
    teks: {
      benar:        '*%TANYA%* → *%JAWAB%*. Jadi *%FRASE%* = %PERAN%.',
      salah:        'Coba tanya: *%TANYA%* → *%JAWAB%*. Jadi *%FRASE%* = %PERAN%, bukan %PERAN_PILIH%.',
      artikelPasti: 'Petunjuk artikel: *%ART%* (%GENDER%) hanya dipakai di **%KASUS%**.',
      artikelGanda: 'Artikel *%ART%* (%GENDER%) bisa %KASUS%. Jadi perannya di kalimat yang menentukan.',
      tanpaArtikel: 'Tidak ada artikel, jadi perannya di kalimat yang menentukan.',
      akhiranN:     'Lihat juga akhiran **-n** pada *%KATA%*: tanda Dativ plural.',
      pilihKata:    'Ketuk kata benda yang berwarna dulu.',
      selesaiKalimat: 'Semua kata benda di kalimat ini sudah terpecahkan! 🔎',
      akhir:        'Kasus selesai! Kamu menjawab **%BENAR% dari %TOTAL%** kata benda dengan benar pada percobaan pertama.'
    },
    daftar: [
      { kalimat: '[m|Der Mann|NOM] kauft [m|einen Apfel|AKK].',
        id: 'Laki-laki itu membeli sebuah apel.',
        tanya: { nom: 'Wer kauft einen Apfel?', akk: 'Was kauft der Mann?' } },
      { kalimat: '[f|Die Frau|NOM] sucht [m|den Lehrer|AKK].',
        id: 'Perempuan itu mencari guru itu.',
        tanya: { nom: 'Wer sucht den Lehrer?', akk: 'Wen sucht die Frau?' } },
      { kalimat: '[n|Das Kind|NOM] hilft [f|der Oma|DAT].',
        id: 'Anak itu membantu nenek.',
        tanya: { nom: 'Wer hilft der Oma?', dat: 'Wem hilft das Kind?' },
        catatan: 'Awas jebakan: *der Oma* bukan maskulin. *der* di sini = feminin di Dativ.' },
      { kalimat: '[m|Der Vater|NOM] gibt [n|dem Baby|DAT] [f|die Milch|AKK].',
        id: 'Ayah memberi bayi itu susu.',
        tanya: { nom: 'Wer gibt dem Baby die Milch?', dat: 'Wem gibt der Vater die Milch?', akk: 'Was gibt der Vater dem Baby?' } },
      { kalimat: '[pl|Die Kinder|NOM] trinken [f|die Milch|AKK].',
        id: 'Anak-anak minum susu.',
        tanya: { nom: 'Wer trinkt die Milch?', akk: 'Was trinken die Kinder?' } },
      { kalimat: '[f|Die Lehrerin|NOM] zeigt [pl|den Kinder{n}|DAT] [n|ein Bild|AKK].',
        id: 'Ibu guru menunjukkan sebuah gambar kepada anak-anak.',
        tanya: { nom: 'Wer zeigt den Kindern ein Bild?', dat: 'Wem zeigt die Lehrerin ein Bild?', akk: 'Was zeigt die Lehrerin den Kindern?' } },
      { kalimat: 'Heute hilft [m|der Sohn|NOM] [m|dem Vater|DAT].',
        id: 'Hari ini anak laki-laki itu membantu ayah.',
        tanya: { nom: 'Wer hilft heute dem Vater?', dat: 'Wem hilft der Sohn heute?' },
        catatan: 'Si pelaku tidak selalu di depan! Setelah *Heute*, verba tetap di posisi 2, lalu si pelaku.' },
      { kalimat: '[f|Die Kellnerin|NOM] bringt [m|dem Gast|DAT] [m|einen Tee|AKK].',
        id: 'Pelayan (perempuan) membawakan secangkir teh untuk tamu itu.',
        tanya: { nom: 'Wer bringt dem Gast einen Tee?', dat: 'Wem bringt die Kellnerin einen Tee?', akk: 'Was bringt die Kellnerin dem Gast?' } },
      { kalimat: '[-|Laura|NOM] fährt mit [m|einem Freund|DAT] nach Berlin.',
        id: 'Laura pergi ke Berlin dengan seorang teman.',
        tanya: { nom: 'Wer fährt mit einem Freund nach Berlin?', dat: 'Mit wem fährt Laura nach Berlin?' },
        peran: { dat: 'teman perjalanan (setelah *mit*)' },
        catatan: 'Setelah *mit* selalu Dativ. Pertanyaannya: *Mit wem?*' },
      { kalimat: 'Am Sonntag besucht [f|die Tante|NOM] [f|die Familie|AKK].',
        id: 'Pada hari Minggu, bibi mengunjungi keluarga itu.',
        tanya: { nom: 'Wer besucht am Sonntag die Familie?', akk: 'Wen besucht die Tante am Sonntag?' },
        catatan: 'Dua kali *die*: artikelnya sama, jadi tanyakan siapa yang mengunjungi.' },
      { kalimat: '[n|Das Buch|NOM] gehört [f|der Lehrerin|DAT].',
        id: 'Buku itu milik ibu guru.',
        tanya: { nom: 'Was gehört der Lehrerin?', dat: 'Wem gehört das Buch?' },
        peran: { nom: 'benda yang dimiliki', dat: 'si pemilik' },
        catatan: 'Dengan *gehören*, *gefallen*, dan *schmecken*: bendanya Nominativ, orangnya Dativ.' },
      { kalimat: '[m|Der Kuchen|NOM] schmeckt [pl|den Gäste{n}|DAT].',
        id: 'Kue itu enak menurut para tamu.',
        tanya: { nom: 'Was schmeckt den Gästen?', dat: 'Wem schmeckt der Kuchen?' },
        peran: { nom: 'makanan yang dibicarakan', dat: 'yang merasakan' },
        catatan: 'Dengan *gehören*, *gefallen*, dan *schmecken*: bendanya Nominativ, orangnya Dativ.' },
      { kalimat: '[f|Die Jacke|NOM] gefällt [f|der Frau|DAT].',
        id: 'Perempuan itu suka jaket itu.',
        tanya: { nom: 'Was gefällt der Frau?', dat: 'Wem gefällt die Jacke?' },
        peran: { nom: 'benda yang disukai', dat: 'yang menyukai' },
        catatan: 'Dengan *gehören*, *gefallen*, dan *schmecken*: bendanya Nominativ, orangnya Dativ.' },
      { kalimat: '[m|Der Chef|NOM] dankt [f|der Kollegin|DAT].',
        id: 'Bos berterima kasih kepada rekan kerja (perempuan) itu.',
        tanya: { nom: 'Wer dankt der Kollegin?', dat: 'Wem dankt der Chef?' } }
    ]
  },

  /* ---------------------------------------------------------------
   * Bagian 6 — Satz-Baukasten
   *   orang / benda: id dari kataBenda. Tambahkan ':pl' untuk bentuk plural (mis. 'kind:pl').
   *   verben: kata kerja dengan si penerima (DAT) dan bendanya (AKK). sg = untuk pelaku tunggal, pl = untuk pelaku plural.
   *   terjemah: susunan arti dalam bahasa Indonesia (kira-kira).
   * --------------------------------------------------------------- */
  baukasten: {
    intro: 'Susun kalimatmu sendiri! Seret kartu ke kotak, atau ketuk kartu lalu ketuk kotaknya. ' +
           'Artikelnya berubah otomatis sesuai posisinya.',
    orang: ['mutter', 'vater', 'kind', 'oma', 'opa', 'lehrerin', 'freund', 'kind:pl', 'freund:pl'],
    benda: ['apfel', 'ball', 'buch', 'geschenk', 'blume', 'kuchen', 'tasche'],
    verben: [
      { inf: 'geben',    sg: 'gibt',    pl: 'geben',    arti: 'memberi' },
      { inf: 'schenken', sg: 'schenkt', pl: 'schenken', arti: 'menghadiahkan' },
      { inf: 'zeigen',   sg: 'zeigt',   pl: 'zeigen',   arti: 'menunjukkan' },
      { inf: 'bringen',  sg: 'bringt',  pl: 'bringen',  arti: 'membawakan' }
    ],
    slot: {
      nom: { tanya: 'Wer?', label: 'si pelaku',  kosong: 'Taruh orang di sini' },
      dat: { tanya: 'Wem?', label: 'si penerima', kosong: 'Taruh orang di sini' },
      akk: { tanya: 'Was?', label: 'bendanya', kosong: 'Taruh benda di sini' }
    },
    urutan: ['nom', 'dat', 'akk'],          // urutan dalam kalimat: pelaku – verba – penerima – benda
    terjemah: '%NOM% %VERB% %AKK% kepada %DAT%.',
    target: 5,                              // jumlah kalimat untuk progress penuh
    pesan: {
      mulai:      'Pilih kata kerja, lalu isi ketiga kotak.',
      dipilih:    '*%KATA%* dipilih. Sekarang ketuk kotak tujuannya.',
      pilihDulu:  'Pilih satu kartu dulu, lalu ketuk kotaknya.',
      bendaSalah: '%IKON% *%KATA%* adalah benda. Benda tidak bisa memberi atau menerima 😄 Taruh di kotak *Was?*.',
      orangSalah: '%IKON% *%KATA%* adalah orang. Kotak *Was?* untuk bendanya. Taruh di kotak *Wer?* atau *Wem?*.',
      ditaruh:    '*%DASAR%* → *%BENTUK%*. %JELAS%',
      tetap:      '*%DASAR%* tidak berubah. %JELAS%',
      kembali:    '*%KATA%* kembali ke kartu kata.',
      lengkap:    'Kalimat lengkap! Dengarkan, lalu coba ganti kartunya dan lihat artikelnya berubah.'
    }
  },

  /* ---------------------------------------------------------------
   * Bagian 7 — Sortir kata kerja (daftar dari SPEC)
   *   akk / dat / akkDat: kata kerja per kotak (= kunci jawaban)
   *   contoh: kalimat contoh yang ditampilkan di umpan balik
   *   Teks: %VERB% %ARTI% %KOTAK% %PILIH% %JELAS% %BENAR% %TOTAL%
   * --------------------------------------------------------------- */
  verben: {
    intro: 'Kata kerja menentukan kasusnya. Seret setiap kata kerja ke kotak yang benar, ' +
           'atau ketuk kata kerjanya lalu ketuk kotaknya.',
    kotak: {
      akk:    { label: 'AKK',       tanya: 'Wen? / Was?',  jelas: 'Kata kerja ini butuh **yang dikenai tindakan** (Akkusativ): *Wen?* atau *Was?*' },
      dat:    { label: 'DAT',       tanya: 'Wem?',         jelas: 'Kata kerja ini butuh **si penerima** (Dativ): *Wem?*' },
      akkDat: { label: 'AKK + DAT', tanya: 'Wem? + Was?',  jelas: 'Kata kerja ini biasanya punya **dua**: si penerima (Dativ) dan bendanya (Akkusativ).' }
    },
    teks: {
      benar:     '*%VERB%* (%ARTI%) masuk kotak **%KOTAK%**. %JELAS%',
      salah:     '*%VERB%* (%ARTI%) bukan %PILIH%, tetapi **%KOTAK%**. %JELAS%',
      pilihDulu: 'Pilih satu kata kerja dulu, lalu ketuk kotaknya.',
      dipilih:   '*%VERB%* dipilih. Sekarang ketuk kotaknya.',
      selesai:   'Semua kata kerja sudah tersortir! Kamu benar **%BENAR% dari %TOTAL%** pada percobaan pertama.'
    },
    akk: [
      { verb: 'haben',    arti: 'punya',
        contoh: { de: 'Ich habe [m|einen Bruder|AKK].', id: 'Saya punya seorang saudara laki-laki.' } },
      { verb: 'brauchen', arti: 'membutuhkan',
        contoh: { de: 'Wir brauchen [n|ein Taxi|AKK].', id: 'Kami membutuhkan sebuah taksi.' } },
      { verb: 'kaufen',   arti: 'membeli',
        contoh: { de: '[m|Der Mann|NOM] kauft [m|einen Apfel|AKK].', id: 'Laki-laki itu membeli sebuah apel.' } },
      { verb: 'sehen',    arti: 'melihat',
        contoh: { de: 'Ich sehe [m|den Bus|AKK].', id: 'Saya melihat bus itu.' } },
      { verb: 'möchten',  arti: 'ingin',
        contoh: { de: 'Ich möchte [m|einen Kaffee|AKK].', id: 'Saya ingin secangkir kopi.' } },
      { verb: 'suchen',   arti: 'mencari',
        contoh: { de: 'Sie sucht [m|den Schlüssel|AKK].', id: 'Dia mencari kunci itu.' } },
      { verb: 'essen',    arti: 'makan',
        contoh: { de: '[n|Das Kind|NOM] isst [m|einen Apfel|AKK].', id: 'Anak itu makan sebuah apel.' } },
      { verb: 'trinken',  arti: 'minum',
        contoh: { de: 'Wir trinken [m|einen Tee|AKK].', id: 'Kami minum secangkir teh.' } }
    ],
    dat: [
      { verb: 'helfen',   arti: 'membantu',
        contoh: { de: 'Ich helfe [f|der Oma|DAT].', id: 'Saya membantu nenek.' } },
      { verb: 'danken',   arti: 'berterima kasih',
        contoh: { de: 'Wir danken [m|dem Lehrer|DAT].', id: 'Kami berterima kasih kepada guru.' } },
      { verb: 'gefallen', arti: 'disukai',
        contoh: { de: '[n|Das Kleid|NOM] gefällt [f|der Frau|DAT].', id: 'Perempuan itu suka gaun itu.' } },
      { verb: 'gehören',  arti: 'milik',
        contoh: { de: '[n|Das Handy|NOM] gehört [m|dem Mann|DAT].', id: 'Ponsel itu milik laki-laki itu.' } },
      { verb: 'schmecken', arti: 'terasa enak',
        contoh: { de: '[f|Die Suppe|NOM] schmeckt [n|dem Kind|DAT].', id: 'Sup itu enak menurut anak itu.' } }
    ],
    akkDat: [
      { verb: 'geben',    arti: 'memberi',
        contoh: { de: '[f|Die Mutter|NOM] gibt [n|dem Kind|DAT] [m|einen Apfel|AKK].', id: 'Ibu memberi anak itu sebuah apel.' } },
      { verb: 'schenken', arti: 'menghadiahkan',
        contoh: { de: 'Ich schenke [f|der Freundin|DAT] [f|eine Blume|AKK].', id: 'Saya menghadiahkan setangkai bunga kepada teman (perempuan) itu.' } },
      { verb: 'zeigen',   arti: 'menunjukkan',
        contoh: { de: 'Ich zeige [m|dem Freund|DAT] [n|das Foto|AKK].', id: 'Saya menunjukkan foto itu kepada teman.' } },
      { verb: 'bringen',  arti: 'membawakan',
        contoh: { de: '[m|Der Kellner|NOM] bringt [m|dem Gast|DAT] [m|einen Kaffee|AKK].', id: 'Pelayan membawakan secangkir kopi untuk tamu itu.' } }
    ]
  },

  /* ---------------------------------------------------------------
   * Bagian 8 — Präpositionen-Navigator
   *   tempat: jenis 'gedung' atau 'orang'; x/y = posisi di peta (persen)
   *   prep: tanya (wohin/wo/woher) dan untuk (semua/gedung/orang)
   *   → preposisi yang benar dihitung dari pertanyaan + jenis tempat.
   *   pilihan: preposisi yang ditampilkan untuk tiap pertanyaan
   * --------------------------------------------------------------- */
  navigator: {
    intro: 'Laura jalan-jalan di kota. Pilih tempat, pilih pertanyaannya, lalu pilih preposisinya. ' +
           'Kalimatnya terbentuk sendiri, lengkap dengan Kurzform.',
    tokoh: { nama: 'Laura', ikon: '👩' },
    tempat: [
      { id: 'bank',       kata: 'Bank',       g: 'f', jenis: 'gedung', ikon: '🏦', arti: 'bank',        x: 20, y: 20 },
      { id: 'chef',       kata: 'Chef',       g: 'm', jenis: 'orang',  ikon: '👔', arti: 'bos',         x: 80, y: 20 },
      { id: 'supermarkt', kata: 'Supermarkt', g: 'm', jenis: 'gedung', ikon: '🛒', arti: 'supermarket', x: 50, y: 45 },
      { id: 'haus',       kata: 'Haus',       g: 'n', jenis: 'gedung', ikon: '🏠', arti: 'rumah itu',   x: 18, y: 70 },
      { id: 'arzt',       kata: 'Arzt',       g: 'm', jenis: 'orang',  ikon: '🩺', arti: 'dokter',      x: 82, y: 70 }
    ],
    tanya: {
      wohin: { label: 'Wohin?', arti: 'ke mana?',   ikon: '➡️', kalimat: 'Laura geht %X%.' },
      wo:    { label: 'Wo?',    arti: 'di mana?',   ikon: '📍', kalimat: 'Laura ist %X%.' },
      woher: { label: 'Woher?', arti: 'dari mana?', ikon: '⬅️', kalimat: 'Laura kommt %X%.' }
    },
    // situasi dalam bahasa Indonesia: membuat jawabannya jelas (di DALAM gedung, di TEMPAT seseorang)
    situasi: {
      wohin: { gedung: 'Laura pergi ke %ARTI%.',           orang: 'Laura pergi ke %ARTI%.' },
      wo:    { gedung: 'Laura ada di dalam %ARTI%.',       orang: 'Laura ada di tempat %ARTI%.' },
      woher: { gedung: 'Laura keluar dari dalam %ARTI%.',  orang: 'Laura datang dari tempat %ARTI%.' }
    },
    prep: {
      zu:  { tanya: 'wohin', untuk: 'semua',  arti: 'menuju ke (orang atau tempat)' },
      bei: { tanya: 'wo',    untuk: 'orang',  arti: 'berada di tempat seseorang' },
      in:  { tanya: 'wo',    untuk: 'gedung', arti: 'berada di dalam gedung' },
      aus: { tanya: 'woher', untuk: 'gedung', arti: 'keluar dari dalam gedung, kota, atau negara' },
      von: { tanya: 'woher', untuk: 'orang',  arti: 'datang dari seseorang' }
    },
    pilihan: {
      wohin: ['zu', 'bei', 'aus', 'von'],
      wo:    ['zu', 'bei', 'in', 'aus', 'von'],
      woher: ['zu', 'bei', 'in', 'aus', 'von']
    },
    kurzform: { 'zu dem': 'zum', 'zu der': 'zur', 'bei dem': 'beim', 'von dem': 'vom', 'in dem': 'im' },
    jenis: { gedung: 'gedung', orang: 'orang' },
    teks: {
      pilihTempat: 'Ketuk satu tempat di peta.',
      pilihTanya:  'Pilih pertanyaannya: *Wohin?*, *Wo?*, atau *Woher?*',
      pilihPrep:   'Preposisi mana yang cocok?',
      benar:       '*%PREP%* = %ARTI%.',
      kurz:        '*%PREP% + %ART%* = *%HASIL%*.',
      tanpaKurz:   '*%PREP% %ART%* tidak disingkat.',
      salahTanya:  '*%PILIH%* menjawab *%TANYA_PILIH%* (%ARTI_TANYA%), bukan *%TANYA%*.',
      salahJenis:  '*%PILIH%* dipakai untuk %UNTUK_PILIH%. *%TEMPAT%* adalah %JENIS%, jadi pakai *%PREP%*.',
      wohin:       '*zu* selalu diikuti Dativ, jadi untuk *Wohin?* di sini kita pakai *zu*. ' +
                   '(*in* juga bisa menjawab *Wohin?*, tetapi dengan Akkusativ, misalnya *in die Bank*. Itu materi berikutnya.)',
      catatanHaus: '*zum Haus* = ke rumah itu. Untuk "pulang ke rumah" orang Jerman bilang *nach Hause*.'
    }
  },

  /* ---------------------------------------------------------------
   * Bagian 9 — Latihan berlevel (minimal 15 soal per level)
   *   ___ = tempat kosong. Tulis di dalam tanda warna supaya jawabannya ikut berwarna:
   *   'Ich sehe [m|___ Mann].'
   *   Level 1 (pilih):  soal, pilihan, jawaban, alasan, id (terjemahan)
   *   Level 2 (isi):    soal, petunjuk (di dalam kurung), jawaban, terima (jawaban lain yang juga benar, opsional),
   *                     panjang (bentuk tanpa Kurzform, dianggap belum tepat), alasan, id
   *   Level 3 (dialog): tema, dialog [{ s: pembicara, de: kalimat }], pilihan, jawaban, alasan, id
   *   Lencana: berdasarkan persentase jawaban benar di akhir level.
   * --------------------------------------------------------------- */
  latihan: {
    intro: 'Tiga level latihan dari mudah ke sulit. Kumpulkan lencana di akhir setiap level!',
    lencana: [
      { min: 90, ikon: '🏆', nama: 'Meister', teks: 'Luar biasa! Kamu sudah menguasai level ini.' },
      { min: 70, ikon: '🥈', nama: 'Profi',   teks: 'Bagus sekali! Tinggal sedikit lagi.' },
      { min: 50, ikon: '🥉', nama: 'Gut',     teks: 'Sudah bagus. Ulangi sekali lagi supaya makin yakin.' },
      { min: 0,  ikon: '🌱', nama: 'Start',   teks: 'Terus berlatih, kamu pasti bisa! Baca alasannya pelan-pelan.' }
    ],
    teks: {
      jawabanBenar: 'Jawaban yang benar: *%JAWAB%*.',
      panjang:      'Hampir! Bentuknya benar, tetapi di sini harus pakai Kurzform: *%JAWAB%*.',
      kosong:       'Tulis jawabanmu dulu.',
      akhir:        'Kamu menjawab **%BENAR% dari %TOTAL%** soal dengan benar (%PERSEN%%).'
    },

    level1: {
      judul: 'Level 1', sub: 'Pilihan ganda artikel', ikon: '🟢', jenis: 'pilih',
      petunjuk: 'Pilih artikel yang benar.',
      soal: [
        { soal: 'Ich sehe [m|___ Mann].', pilihan: ['der', 'den', 'dem'], jawaban: 'den',
          id: 'Saya melihat laki-laki itu.',
          alasan: '*sehen* + Akkusativ (*Wen sehe ich?*). Maskulin di Akkusativ: *der* → *den*.' },
        { soal: '[f|___ Frau] kauft einen Apfel.', pilihan: ['Die', 'Der', 'Den'], jawaban: 'Die',
          id: 'Perempuan itu membeli sebuah apel.',
          alasan: '*Wer kauft?* → si pelaku = Nominativ. Feminin di Nominativ: *die*.' },
        { soal: 'Ich helfe [n|___ Kind].', pilihan: ['das', 'dem', 'den'], jawaban: 'dem',
          id: 'Saya membantu anak itu.',
          alasan: '*helfen* + Dativ (*Wem helfe ich?*). Neutral di Dativ: *das* → *dem*.' },
        { soal: 'Wir danken [f|___ Lehrerin].', pilihan: ['die', 'der', 'den'], jawaban: 'der',
          id: 'Kami berterima kasih kepada ibu guru.',
          alasan: '*danken* + Dativ (*Wem?*). Feminin di Dativ: *die* → *der*.' },
        { soal: 'Er hat [m|___ Bruder].', pilihan: ['ein', 'einen', 'einem'], jawaban: 'einen',
          id: 'Dia punya seorang saudara laki-laki.',
          alasan: '*haben* + Akkusativ. Maskulin di Akkusativ: *ein* → *einen*.' },
        { soal: 'Das Buch gehört [pl|___ Kinder{n}].', pilihan: ['die', 'den', 'der'], jawaban: 'den',
          id: 'Buku itu milik anak-anak.',
          alasan: '*gehören* + Dativ (*Wem gehört das Buch?*). Plural di Dativ: *die* → *den*, dan kata bendanya + *-n*.' },
        { soal: 'Ich trinke [m|___ Tee].', pilihan: ['ein', 'einen', 'einem'], jawaban: 'einen',
          id: 'Saya minum secangkir teh.',
          alasan: '*trinken* + Akkusativ (*Was trinke ich?*). Maskulin: *ein* → *einen*.' },
        { soal: 'Sie fährt mit [m|___ Bus].', pilihan: ['der', 'den', 'dem'], jawaban: 'dem',
          id: 'Dia naik bus.',
          alasan: 'Setelah *mit* selalu Dativ. Maskulin di Dativ: *der* → *dem*.' },
        { soal: '[n|___ Kind] spielt Fußball.', pilihan: ['Das', 'Dem', 'Den'], jawaban: 'Das',
          id: 'Anak itu bermain sepak bola.',
          alasan: '*Wer spielt?* → si pelaku = Nominativ. Neutral di Nominativ: *das*.' },
        { soal: 'Ich gebe [f|___ Oma] eine Blume.', pilihan: ['die', 'der', 'den'], jawaban: 'der',
          id: 'Saya memberi nenek setangkai bunga.',
          alasan: '*Wem gebe ich die Blume?* → si penerima = Dativ. Feminin di Dativ: *die* → *der*.' },
        { soal: 'Wir suchen [n|___ Hotel].', pilihan: ['ein', 'einen', 'einem'], jawaban: 'ein',
          id: 'Kami mencari sebuah hotel.',
          alasan: '*suchen* + Akkusativ. Neutral tidak berubah di Akkusativ: tetap *ein*.' },
        { soal: 'Er braucht [f|___ Tasche].', pilihan: ['eine', 'einer', 'einen'], jawaban: 'eine',
          id: 'Dia membutuhkan sebuah tas.',
          alasan: '*brauchen* + Akkusativ. Feminin tidak berubah di Akkusativ: tetap *eine*.' },
        { soal: 'Ich spreche mit [f|___ Freundin].', pilihan: ['eine', 'einer', 'einem'], jawaban: 'einer',
          id: 'Saya berbicara dengan seorang teman (perempuan).',
          alasan: 'Setelah *mit* selalu Dativ. Feminin di Dativ: *eine* → *einer*.' },
        { soal: 'Die Jacke gefällt [m|___ Mann].', pilihan: ['der', 'den', 'dem'], jawaban: 'dem',
          id: 'Laki-laki itu suka jaket itu.',
          alasan: '*gefallen* + Dativ (*Wem gefällt die Jacke?*). Maskulin di Dativ: *der* → *dem*.' },
        { soal: 'Der Lehrer zeigt [pl|___ Schüler{n}] ein Bild.', pilihan: ['die', 'den', 'der'], jawaban: 'den',
          id: 'Guru menunjukkan sebuah gambar kepada para murid.',
          alasan: '*Wem zeigt der Lehrer ein Bild?* → si penerima = Dativ. Plural di Dativ: *den* + *-n*.' },
        { soal: '[pl|___ Kinder] essen Pizza.', pilihan: ['Die', 'Den', 'Der'], jawaban: 'Die',
          id: 'Anak-anak makan pizza.',
          alasan: '*Wer isst Pizza?* → si pelaku = Nominativ. Plural di Nominativ: *die*.' }
      ]
    },

    level2: {
      judul: 'Level 2', sub: 'Isian: artikel, Kurzformen, und/oder/aber', ikon: '🟡', jenis: 'isi',
      petunjuk: 'Tulis jawabannya. Untuk preposisi: tulis preposisi + artikel, dan pakai Kurzform kalau ada (mis. *zum*).',
      soal: [
        { soal: 'Ich gehe [m|___ Arzt].', petunjuk: 'zu', jawaban: 'zum', panjang: 'zu dem',
          id: 'Saya pergi ke dokter.',
          alasan: '*Wohin?* → *zu* + Dativ. *zu + dem* (maskulin) = *zum*.' },
        { soal: 'Wir gehen [f|___ Schule].', petunjuk: 'zu', jawaban: 'zur', panjang: 'zu der',
          id: 'Kami pergi ke sekolah.',
          alasan: '*zu + der* (feminin, Dativ) = *zur*.' },
        { soal: 'Ich bin [m|___ Bäcker].', petunjuk: 'bei', jawaban: 'beim', panjang: 'bei dem',
          id: 'Saya sedang di toko roti.',
          alasan: '*Wo?* + orang → *bei*. *bei + dem* = *beim*.' },
        { soal: 'Sie kommt [m|___ Chef].', petunjuk: 'von', jawaban: 'vom', panjang: 'von dem',
          id: 'Dia datang dari (ruang) bos.',
          alasan: '*Woher?* + orang → *von*. *von + dem* = *vom*.' },
        { soal: 'Er ist [m|___ Supermarkt].', petunjuk: 'in', jawaban: 'im', panjang: 'in dem',
          id: 'Dia ada di supermarket.',
          alasan: '*Wo?* → *in* + Dativ. *in + dem* = *im*.' },
        { soal: 'Das Kind ist [f|___ Oma].', petunjuk: 'bei', jawaban: 'bei der',
          id: 'Anak itu sedang di (rumah) nenek.',
          alasan: 'Feminin di Dativ: *der*. *bei der* tidak disingkat.' },
        { soal: 'Ich komme [f|___ Arbeit].', petunjuk: 'von', jawaban: 'von der',
          id: 'Saya pulang dari kerja.',
          alasan: 'Feminin di Dativ: *der*. *von der* tidak disingkat.' },
        { soal: 'Er kommt [n|___ Haus].', petunjuk: 'aus', jawaban: 'aus dem',
          id: 'Dia keluar dari rumah.',
          alasan: '*aus* + Dativ: *das* → *dem*. *aus dem* tidak punya bentuk singkat.' },
        { soal: 'Sie ist [f|___ Bank].', petunjuk: 'in', jawaban: 'in der',
          id: 'Dia ada di bank.',
          alasan: '*Wo?* → *in* + Dativ. Feminin: *in der* (tidak disingkat).' },
        { soal: 'Ich helfe [m|___ Mann].', petunjuk: 'der', jawaban: 'dem',
          id: 'Saya membantu laki-laki itu.',
          alasan: '*helfen* + Dativ. Maskulin di Dativ: *der* → *dem*.' },
        { soal: 'Wir spielen mit [pl|___ Kinder{n}].', petunjuk: 'die', jawaban: 'den',
          id: 'Kami bermain dengan anak-anak itu.',
          alasan: 'Setelah *mit* selalu Dativ. Plural di Dativ: *die* → *den* (dan *Kinder* → *Kinder{n}*).' },
        { soal: 'Ich gebe [f|___ Frau] einen Kaffee.', petunjuk: 'die', jawaban: 'der',
          id: 'Saya memberi perempuan itu secangkir kopi.',
          alasan: '*Wem gebe ich den Kaffee?* → Dativ. Feminin di Dativ: *die* → *der*.' },
        { soal: 'Ich trinke Kaffee ___ esse ein Brötchen.', petunjuk: 'und / oder / aber', jawaban: 'und',
          id: 'Saya minum kopi dan makan roti.',
          alasan: '*und* = dan. Subjeknya sama (*ich*), jadi boleh dihilangkan setelah *und*.' },
        { soal: 'Ich koche ___ ich bestelle eine Pizza.', petunjuk: 'und / oder / aber', jawaban: 'oder',
          id: 'Saya memasak atau saya memesan pizza.',
          alasan: '*oder* = atau. Setelah *oder*, verba tetap di posisi 2: *ich bestelle*.' },
        { soal: 'Das Zimmer ist klein, ___ es ist schön.', petunjuk: 'und / oder / aber', jawaban: 'aber',
          id: 'Kamarnya kecil, tetapi bagus.',
          alasan: '*aber* = tetapi. Sebelum *aber* selalu ada koma.' },
        { soal: 'Ich lerne Deutsch ___ meine Schwester lernt Englisch.', petunjuk: 'und / oder / aber', jawaban: 'und',
          id: 'Saya belajar bahasa Jerman dan adik perempuan saya belajar bahasa Inggris.',
          alasan: '*und* = dan. Subjeknya berbeda, jadi kalimat kedua tetap lengkap: *meine Schwester lernt*.' }
      ]
    },

    level3: {
      judul: 'Level 3', sub: 'Mini-dialog: Einkaufen, Familie, Geburtstag, Büro', ikon: '🔴', jenis: 'dialog',
      petunjuk: 'Baca dialognya, lalu pilih jawaban yang cocok.',
      soal: [
        { tema: 'Einkaufen', dialog: [
            { s: 'Verkäufer', de: 'Guten Tag! Was möchten Sie?' },
            { s: 'Kundin', de: 'Ich möchte [m|___ Kuchen], bitte.' } ],
          pilihan: ['einen', 'einem', 'ein'], jawaban: 'einen',
          id: 'Penjual: Selamat siang! Anda mau apa? – Pembeli: Saya mau sebuah kue.',
          alasan: '*möchten* + Akkusativ (*Was möchten Sie?*). Maskulin: *ein* → *einen*.' },
        { tema: 'Einkaufen', dialog: [
            { s: 'Tom', de: 'Wo kaufst du Brot?' },
            { s: 'Lisa', de: '[m|___ Bäcker]. Das Brot ist dort sehr gut.' } ],
          pilihan: ['Beim', 'Zum', 'Vom'], jawaban: 'Beim',
          id: 'Tom: Di mana kamu beli roti? – Lisa: Di toko roti. Rotinya enak sekali di sana.',
          alasan: '*Wo?* + orang (tukang roti) → *bei*. *bei + dem* = *beim*. (*zum* menjawab *Wohin?*, *vom* menjawab *Woher?*)' },
        { tema: 'Einkaufen', dialog: [
            { s: 'Mama', de: 'Woher kommst du?' },
            { s: 'Mia', de: 'Ich komme [m|___ Supermarkt].' } ],
          pilihan: ['aus dem', 'zum', 'im'], jawaban: 'aus dem',
          id: 'Mama: Kamu dari mana? – Mia: Saya dari (dalam) supermarket.',
          alasan: '*Woher?* + gedung → *aus* + Dativ: *aus dem Supermarkt*. (*zum* = Wohin?, *im* = Wo?)' },
        { tema: 'Einkaufen', dialog: [
            { s: 'Papa', de: 'Wem gibst du das Geld?' },
            { s: 'Mia', de: '[f|___ Verkäuferin].' } ],
          pilihan: ['Der', 'Die', 'Den'], jawaban: 'Der',
          id: 'Papa: Kamu memberi uangnya kepada siapa? – Mia: Kepada penjual (perempuan) itu.',
          alasan: '*Wem?* → si penerima = Dativ. Feminin di Dativ: *die* → *der*.' },
        { tema: 'Familie', dialog: [
            { s: 'Lisa', de: 'Was machst du am Sonntag?' },
            { s: 'Tom', de: 'Ich helfe [m|___ Opa] im Garten.' } ],
          pilihan: ['dem', 'den', 'der'], jawaban: 'dem',
          id: 'Lisa: Kamu melakukan apa hari Minggu? – Tom: Saya membantu kakek di kebun.',
          alasan: '*helfen* + Dativ (*Wem helfe ich?*). Maskulin di Dativ: *dem*.' },
        { tema: 'Familie', dialog: [
            { s: 'Mia', de: 'Wo ist Mama?' },
            { s: 'Papa', de: 'Sie ist [f|___ Küche].' } ],
          pilihan: ['in der', 'im', 'zur'], jawaban: 'in der',
          id: 'Mia: Mama di mana? – Papa: Dia di dapur.',
          alasan: '*Wo?* → *in* + Dativ. *die Küche* feminin → *in der Küche*. (*im* hanya untuk maskulin/neutral, *zur* menjawab *Wohin?*)' },
        { tema: 'Familie', dialog: [
            { s: 'Tom', de: 'Wem gehört das Fahrrad?' },
            { s: 'Mama', de: 'Es gehört [n|___ Kind].' } ],
          pilihan: ['dem', 'das', 'den'], jawaban: 'dem',
          id: 'Tom: Sepeda itu milik siapa? – Mama: Milik anak itu.',
          alasan: '*gehören* + Dativ (*Wem gehört das Fahrrad?*). Neutral di Dativ: *dem*.' },
        { tema: 'Familie', dialog: [
            { s: 'Papa', de: 'Wohin geht ihr?' },
            { s: 'Mia', de: 'Wir gehen [f|___ Oma].' } ],
          pilihan: ['zur', 'zum', 'bei der'], jawaban: 'zur',
          id: 'Papa: Kalian mau ke mana? – Mia: Kami pergi ke (rumah) nenek.',
          alasan: '*Wohin?* → *zu*. *die Oma* feminin: *zu + der* = *zur*. (*bei der* menjawab *Wo?*)' },
        { tema: 'Geburtstag', dialog: [
            { s: 'Lisa', de: 'Was schenkst du der Mutter?' },
            { s: 'Tom', de: 'Ich schenke der Mutter [f|___ Blume].' } ],
          pilihan: ['eine', 'einer', 'einen'], jawaban: 'eine',
          id: 'Lisa: Kamu menghadiahkan apa kepada ibu? – Tom: Saya menghadiahkan setangkai bunga kepada ibu.',
          alasan: '*Was schenke ich?* → bendanya = Akkusativ. Feminin tidak berubah: *eine Blume*.' },
        { tema: 'Geburtstag', dialog: [
            { s: 'Mia', de: 'Wer bringt den Kuchen?' },
            { s: 'Papa', de: '[f|___ Oma] bringt den Kuchen.' } ],
          pilihan: ['Die', 'Der', 'Den'], jawaban: 'Die',
          id: 'Mia: Siapa yang membawa kuenya? – Papa: Nenek yang membawa kuenya.',
          alasan: '*Wer bringt?* → si pelaku = Nominativ. Feminin di Nominativ: *die*.' },
        { tema: 'Geburtstag', dialog: [
            { s: 'Tom', de: 'Kommst du [f|___ Party]?' },
            { s: 'Lisa', de: 'Ja, gern!' } ],
          pilihan: ['zur', 'zum', 'zu'], jawaban: 'zur',
          id: 'Tom: Kamu datang ke pesta? – Lisa: Ya, dengan senang hati!',
          alasan: '*Wohin?* → *zu* + Dativ. *die Party* feminin: *zu + der* = *zur*.' },
        { tema: 'Geburtstag', dialog: [
            { s: 'Mama', de: 'Mit wem feierst du?' },
            { s: 'Mia', de: 'Mit [pl|___ Freunde{n}] aus der Schule.' } ],
          pilihan: ['den', 'die', 'der'], jawaban: 'den',
          id: 'Mama: Kamu merayakan dengan siapa? – Mia: Dengan teman-teman dari sekolah.',
          alasan: 'Setelah *mit* selalu Dativ. Plural di Dativ: *den Freunde{n}*.' },
        { tema: 'Büro', dialog: [
            { s: 'Herr Wolf', de: 'Wo ist Frau Klein?' },
            { s: 'Kollegin', de: 'Sie ist [m|___ Chef].' } ],
          pilihan: ['beim', 'zum', 'im'], jawaban: 'beim',
          id: 'Pak Wolf: Bu Klein di mana? – Rekan kerja: Dia sedang di (ruang) bos.',
          alasan: '*Wo?* + orang → *bei*. *bei + dem* = *beim*. (*zum* menjawab *Wohin?*)' },
        { tema: 'Büro', dialog: [
            { s: 'Chefin', de: 'Wem zeigen Sie den Computer?' },
            { s: 'Herr Wolf', de: 'Ich zeige [f|___ Kollegin] den Computer.' } ],
          pilihan: ['der', 'die', 'den'], jawaban: 'der',
          id: 'Bos: Anda menunjukkan komputer itu kepada siapa? – Pak Wolf: Saya menunjukkannya kepada rekan kerja (perempuan).',
          alasan: '*Wem?* → si penerima = Dativ. Feminin di Dativ: *die* → *der*.' },
        { tema: 'Büro', dialog: [
            { s: 'Frau Klein', de: 'Woher kommst du gerade?' },
            { s: 'Herr Wolf', de: '[f|___ Chefin].' } ],
          pilihan: ['Von der', 'Vom', 'Aus der'], jawaban: 'Von der',
          id: 'Bu Klein: Kamu baru datang dari mana? – Pak Wolf: Dari (ruang) bos.',
          alasan: '*Woher?* + orang → *von*. *die Chefin* feminin: *von der* (tidak disingkat). (*aus* untuk keluar dari dalam gedung)' },
        { tema: 'Büro', dialog: [
            { s: 'Kollegin', de: 'Was braucht Herr Wolf?' },
            { s: 'Chefin', de: 'Er braucht [m|___ Computer].' } ],
          pilihan: ['einen', 'einem', 'ein'], jawaban: 'einen',
          id: 'Rekan kerja: Pak Wolf butuh apa? – Bos: Dia butuh sebuah komputer.',
          alasan: '*brauchen* + Akkusativ (*Was braucht er?*). Maskulin: *ein* → *einen*.' }
      ]
    }
  },


  /* ---------------------------------------------------------------
   * Bagian 10 — Mode Kelas (untuk guru)
   *   Soal kuis tim diambil acak dari: soal di bawah ini + soal Latihan berlevel (sumber).
   *   Soal di bawah: tentukan kasus frasa yang disorot ==...==. jawaban: 'NOM', 'AKK', atau 'DAT'.
   * --------------------------------------------------------------- */
  kuisTim: {
    intro: 'Untuk guru: tampilkan website di proyektor dan mainkan kuis dua tim.',
    proyektor: 'Huruf lebih besar, kontras tinggi, menu samping dan hiasan disembunyikan. ' +
               'Bisa juga dinyalakan dengan tombol 📽 di kanan atas atau huruf **P** di keyboard.',
    timBawaan: ['Tim A', 'Tim B'],
    pilihanJumlah: [10, 15, 20],
    jumlahBawaan: 10,
    sumber: ['level1', 'level2', 'level3'],
    teks: {
      cara:      'Bacakan soalnya. Tim yang mendapat giliran menjawab. Tekan *Tunjukkan jawaban*, lalu beri poin.',
      giliran:   'Giliran: %TIM%',
      tanyaKasus: 'Kasus apa frasa yang disorot?',
      pintasan:  'Pintasan keyboard: Spasi = tunjukkan jawaban · 1 / 2 = poin untuk tim · 0 = tanpa poin',
      menang:    '%TIM% menang!',
      seri:      'Seri! Kedua tim hebat.',
      lanjutkan: 'Ada kuis yang belum selesai.'
    },
    soal: [
      { soal: 'Die Mutter gibt ==[n|dem Kind]== einen Apfel.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'DAT',
        alasan: '*Wem gibt die Mutter einen Apfel?* → *dem Kind* = si penerima (Dativ).' },
      { soal: '==[m|Der Mann]== kauft einen Apfel.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'NOM',
        alasan: '*Wer kauft einen Apfel?* → *der Mann* = si pelaku (Nominativ).' },
      { soal: 'Ich sehe ==[m|den Bus]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'AKK',
        alasan: '*Was sehe ich?* → *den Bus* = yang dikenai tindakan (Akkusativ). Maskulin: *den*.' },
      { soal: 'Das Buch gehört ==[f|der Lehrerin]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'DAT',
        alasan: '*Wem gehört das Buch?* → *der Lehrerin* (Dativ). *der* di sini = feminin di Dativ.' },
      { soal: '==[pl|Die Kinder]== spielen im Garten.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'NOM',
        alasan: '*Wer spielt im Garten?* → *die Kinder* = si pelaku (Nominativ).' },
      { soal: 'Wir besuchen ==[f|die Oma]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'AKK',
        alasan: '*Wen besuchen wir?* → *die Oma* (Akkusativ). Si pelakunya *wir*.' },
      { soal: 'Er hilft ==[m|dem Freund]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'DAT',
        alasan: '*helfen* + Dativ: *Wem hilft er?* → *dem Freund*.' },
      { soal: 'Sie trinkt ==[m|einen Kaffee]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'AKK',
        alasan: '*Was trinkt sie?* → *einen Kaffee* (Akkusativ). Maskulin: *einen*.' },
      { soal: 'Am Montag kommt ==[m|der Arzt]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'NOM',
        alasan: '*Wer kommt am Montag?* → *der Arzt* = si pelaku. Si pelaku tidak selalu di depan!' },
      { soal: 'Ich fahre mit ==[pl|den Kinder{n}]== nach Hause.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'DAT',
        alasan: 'Setelah *mit* selalu Dativ: *den Kinder{n}* (plural + *-n*).' },
      { soal: 'Das Handy ist ==[n|im Auto]==.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'DAT',
        alasan: '*Wo?* → *in* + Dativ. *in + dem* = *im*.' },
      { soal: '==[n|Das Geschenk]== gefällt dem Kind.', pilihan: ['NOM', 'AKK', 'DAT'], jawaban: 'NOM',
        alasan: '*Was gefällt dem Kind?* → *das Geschenk* (Nominativ). Dengan *gefallen*, orangnya Dativ: *dem Kind*.' }
    ]
  },

  /* ---------------------------------------------------------------
   * Bagian 11 — Ringkasan cetak
   *   Isi tabel diambil otomatis dari bagian lain di file ini.
   * --------------------------------------------------------------- */
  ringkasan: {
    intro: 'Semua tabel dalam satu halaman. Tekan tombol *Cetak*, lalu pilih printer atau *Simpan sebagai PDF*.',
    judul: 'Nominativ · Akkusativ · Dativ: ringkasan A1',
    judulBlok: {
      kasus: 'Wer? Wen? Wem?',
      artikel: 'Tabel artikel',
      verben: 'Kata kerja + kasus',
      ort: 'Wohin? Wo? Woher?'
    },
    ort: [
      { tanya: 'Wohin?', arti: 'ke mana?',   orang: '[m|**zum** Arzt] · [f|**zur** Chefin]',     gedung: '[f|**zur** Bank] · [m|**zum** Supermarkt]' },
      { tanya: 'Wo?',    arti: 'di mana?',   orang: '[m|**beim** Arzt] · [f|**bei der** Chefin]', gedung: '[f|**in der** Bank] · [n|**im** Haus]' },
      { tanya: 'Woher?', arti: 'dari mana?', orang: '[m|**vom** Arzt] · [f|**von der** Chefin]',  gedung: '[f|**aus der** Bank] · [n|**aus dem** Haus]' }
    ]
  }
};

# Wer? Wen? Wem? — Nominativ, Akkusativ, Dativ (A1)

Website interaktif untuk belajar kasus **Nominativ, Akkusativ, dan Dativ** dalam bahasa Jerman,
untuk siswa Indonesia level A1. Bisa dipakai siswa belajar sendiri di HP, dan bisa ditampilkan di proyektor saat kelas.

## Cara membuka

1. Buka folder `wer-wen-wem`.
2. Klik dua kali file **`index.html`**. Website terbuka di browser.

- Tidak perlu instal apa pun dan tidak perlu internet. Internet hanya dipakai untuk huruf (font); tanpa internet, browser memakai huruf bawaan.
- Browser yang disarankan: **Chrome** atau **Edge** terbaru (di laptop dan HP). Di sana suara pengucapan bahasa Jerman paling lengkap.
- Tombol 🔊 membacakan kalimat dengan suara bahasa Jerman (`de-DE`) dari browser. Kalau tidak ada suara, coba Chrome/Edge, atau pasang suara bahasa Jerman di pengaturan HP/Windows.

## Isi website

| No | Bagian | Isi |
|---|---|---|
| 1 | Beranda | Pengantar *Wer? Wen? Wem?*, kode warna, dan peta belajar dengan progress tiap bagian |
| 2 | Gambar grammatik | Semua tabel halaman buku (A–F). Klik baris → penjelasan, audio, contoh lain |
| 3 | Perubahan Artikel | Pilih gender, kasus, der/ein → artikel berubah dengan animasi |
| 4 | Wer gibt wem was? | 6 adegan bergambar: badge kasus dan panah dari pelaku ke penerima |
| 5 | Detektif Kasus | Ketuk kata benda, pilih *Wer? / Wen? / Wem?*, umpan balik dengan alasan |
| 6 | Satz-Baukasten | Susun kalimat sendiri; artikel berubah otomatis |
| 7 | Sortir kata kerja | Kata kerja ke kotak AKK / DAT / AKK + DAT |
| 8 | Präpositionen-Navigator | Peta kota: *Wohin? Wo? Woher?* → preposisi → kalimat dengan Kurzform |
| 9 | Latihan berlevel | 3 level × 16 soal, dengan lencana di akhir level |
| 10 | Mode Kelas | Mode proyektor, layar penuh, dan kuis 2 tim |
| 11 | Ringkasan cetak | Semua tabel dalam satu halaman A4 |

**Kode warna:** maskulin = biru, neutral = hijau, feminin = merah, plural = abu gelap, akhiran **-n** = oranye.
Kasus selalu ditandai dengan label **NOM / AKK / DAT** (bukan warna).

Semua bagian bisa dipakai dengan **ketuk/klik**. Seret (drag) dengan mouse juga bisa di Satz-Baukasten dan Sortir kata kerja.

## Di kelas (Mode Proyektor dan kuis tim)

- **Mode Proyektor**: tombol 📽️ di kanan atas, atau tekan huruf **P**. Huruf jadi besar, kontras tinggi, menu samping disembunyikan.
- **Layar penuh**: tombol ⛶ di halaman *Mode Kelas* (atau tombol **F11**).
- **Kuis tim** (halaman *Mode Kelas*): isi nama dua tim, pilih jumlah soal, lalu *Mulai kuis*.
  Bacakan soalnya → *Tunjukkan jawaban* → beri poin. Pintasan keyboard: **Spasi** = tunjukkan jawaban,
  **1 / 2** = poin untuk tim 1 / tim 2, **0** = tanpa poin. Skor tetap tersimpan walaupun halaman dimuat ulang.
- **Ringkasan cetak**: buka bagian 11, tekan *Cetak ringkasan*, lalu pilih printer atau *Simpan sebagai PDF*.

## Progress siswa

Progress (baris yang dibuka, soal yang benar, lencana) disimpan **di browser masing-masing siswa** (localStorage).
Tidak ada akun dan tidak ada data yang dikirim ke internet. Kalau browser tidak mengizinkan penyimpanan
(misalnya mode privat), website tetap jalan, hanya progress hilang saat halaman ditutup.
Untuk menghapus progress: tombol *Hapus progress di perangkat ini* di bagian bawah Beranda.

## Gambar asli dari buku

Taruh file **`grammatik.png`** di folder ini (di sebelah `index.html`). Tombol *Lihat gambar asli dari buku*
di bagian 2 akan menampilkannya. Tanpa file itu, tombol tersebut menampilkan pesan "Gambarnya belum ada".

## Cara mengubah atau menambah soal

Semua kalimat, penjelasan, dan soal ada di **satu file: `js/data.js`**. Bagian lain tidak perlu diubah.

1. Buka `js/data.js` dengan editor teks (misalnya **Notepad** atau **Visual Studio Code**).
2. Cari bagiannya (tekan **Ctrl + F**), misalnya `level1:` untuk Latihan Level 1.
3. Salin satu soal yang sudah ada, tempel di bawahnya, lalu ubah isinya.
4. Simpan file, lalu muat ulang website di browser (**F5**).

### Contoh: menambah soal Level 1 (pilihan ganda)

```js
{ soal: 'Ich kaufe [m|___ Apfel].', pilihan: ['der', 'den', 'dem'], jawaban: 'den',
  id: 'Saya membeli apel itu.',
  alasan: '*kaufen* + Akkusativ (*Was kaufe ich?*). Maskulin: *der* → *den*.' },
```

### Contoh: soal Level 2 (isian)

```js
{ soal: 'Wir gehen [m|___ Arzt].', petunjuk: 'zu', jawaban: 'zum', panjang: 'zu dem',
  id: 'Kami pergi ke dokter.',
  alasan: '*zu + dem* = *zum*.' },
```
`petunjuk` = kata di dalam kurung. `panjang` (boleh dikosongkan) = bentuk tanpa Kurzform; kalau siswa menulis itu,
muncul pesan "Hampir! … pakai Kurzform".

### Contoh: soal Level 3 (mini-dialog)

```js
{ tema: 'Büro', dialog: [
    { s: 'Chefin', de: 'Wo ist Herr Wolf?' },
    { s: 'Kollegin', de: 'Er ist [m|___ Arzt].' } ],
  pilihan: ['beim', 'zum', 'vom'], jawaban: 'beim',
  id: 'Bos: Pak Wolf di mana? – Rekan kerja: Dia sedang di dokter.',
  alasan: '*Wo?* + orang → *bei*. *bei + dem* = *beim*.' },
```

### Tanda warna di dalam kalimat

| Tulis | Hasil |
|---|---|
| `[m\|der Mann]` | biru (maskulin) · `[n\|…]` hijau · `[f\|…]` merah · `[pl\|…]` abu |
| `[n\|dem Kind\|DAT]` | ditambah badge kasus DAT (juga `\|NOM`, `\|AKK`) |
| `**dem**` | huruf tebal (bagian yang berubah) |
| `{n}` | akhiran oranye, misalnya `[pl\|den Kinder{n}]` |
| `*Wem?*` | huruf miring (kata Jerman di dalam penjelasan) |
| `___` | tempat kosong di soal (taruh di dalam tanda warna: `[m\|___ Mann]`) |

### Hal yang perlu diperhatikan

- Setiap teks diapit tanda kutip tunggal `'...'`. Kalau di dalam teks ada tanda kutip tunggal, tulis `\'`.
- Setelah setiap `}` atau `]` di dalam daftar, jangan lupa **koma**.
- Pastikan setiap soal hanya punya **satu** jawaban yang benar (misalnya jangan memberi pilihan `den` dan `einen` sekaligus).
- Kalau setelah diubah sebuah halaman menampilkan **"Ups, ada yang salah"** atau website kosong, biasanya ada koma
  atau tanda kutip yang hilang. Bandingkan dengan soal lain di sekitarnya.
- Simpan dulu salinan `data.js` sebelum mengubah banyak hal.

## Upload ke GitHub Pages (supaya siswa bisa membuka lewat link)

1. Masuk ke [github.com](https://github.com) (buat akun gratis kalau belum punya).
2. Klik **+** (kanan atas) → **New repository**. Beri nama, misalnya `wer-wen-wem`, pilih **Public**, klik **Create repository**.
3. Di halaman repository, klik **uploading an existing file** (atau **Add file → Upload files**).
4. Seret **semua isi folder** `wer-wen-wem` (file `index.html`, folder `css`, folder `js`, `README.md`, dan `grammatik.png` kalau ada)
   ke halaman itu, lalu klik **Commit changes**.
5. Buka **Settings → Pages**. Di *Build and deployment*, pilih **Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
6. Tunggu 1–2 menit. Alamat website muncul di halaman yang sama, misalnya `https://namaanda.github.io/wer-wen-wem/`.
   Bagikan link itu ke siswa.

Kalau nanti `data.js` diubah: upload lagi file `js/data.js` ke folder `js` di repository (Add file → Upload files),
lalu tunggu 1–2 menit.

## Isi folder

```
wer-wen-wem/
├─ index.html        halaman utama
├─ README.md         petunjuk ini
├─ SPEC.md           spesifikasi lengkap
├─ CEK-KALIMAT.md    daftar semua kalimat Jerman dan soal yang sudah diperiksa
├─ css/              tampilan (dasar.css, bagian.css, cetak.css)
└─ js/
   ├─ data.js        SEMUA konten — file yang boleh Anda ubah
   ├─ inti.js, app.js
   └─ bagian/        satu file untuk tiap bagian
```

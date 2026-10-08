# Tugas
Buat website interaktif untuk belajar kasus Nominativ, Akkusativ, dan Dativ dalam bahasa Jerman, untuk siswa Indonesia level A1. Saya guru bahasa Jerman. Website ini dipakai siswa belajar sendiri dan juga ditampilkan di proyektor saat kelas.

Sebelum menulis kode, tunjukkan rencana struktur file dan daftar halaman/bagian, lalu tunggu persetujuan saya.

# Teknis
- HTML, CSS, dan JavaScript murni (vanilla), tanpa framework dan tanpa build step. Cukup buka `index.html` di browser, dan bisa di-host di GitHub Pages.
- Bisa berjalan offline, kecuali font.
- Responsif: nyaman di HP siswa dan di layar proyektor.
- Semua konten (kalimat, soal, penjelasan) disimpan dalam satu file data, misalnya `data.js`, supaya saya bisa menambah atau mengubah soal tanpa menyentuh logika.
- Progress siswa disimpan di localStorage (bungkus dengan try/catch). Website harus tetap berjalan kalau localStorage tidak tersedia.
- Audio pengucapan memakai Web Speech API (`lang = "de-DE"`): tombol speaker kecil di setiap kalimat contoh.
- File `grammatik.png` ada di folder proyek. Tampilkan sebagai "Lihat gambar asli dari buku", tetapi semua tabel dibuat ulang dalam HTML yang interaktif, bukan hanya gambar.

# Bahasa & gaya penjelasan
- Penjelasan dalam bahasa Indonesia sehari-hari yang sangat sederhana. Maksimal 2–3 kalimat per penjelasan, selalu diikuti contoh.
- Istilah tata bahasa Jerman (Nominativ, Akkusativ, Dativ, Artikel, Präposition) tetap dipakai, tetapi selalu dijelaskan dengan kata sederhana. Contoh: "Dativ = si penerima / jawaban dari pertanyaan *Wem?*".
- Hindari istilah berat seperti "objek tidak langsung".
- Nada ramah dan menyemangati. Umpan balik untuk jawaban salah selalu menjelaskan *mengapa*, bukan hanya "Salah".

# Sistem warna (wajib konsisten di seluruh website)
Ikuti warna buku untuk gender:
- maskulin = biru, neutral = hijau, feminin = merah, plural = hitam/abu gelap dengan akhiran **-n** berwarna oranye
- Aksen judul/kotak: oranye (seperti di buku)

Kasus ditandai dengan **badge/label** (bukan warna teks, supaya tidak bentrok dengan warna gender): `NOM`, `AKK`, `DAT`. Jangan pernah mengandalkan warna saja, selalu sertakan label teks juga.

# Konsep inti: "Wer? Wen? Wem?"
- Nominativ → *Wer? / Was?* → si **pelaku** (Der Mann kauft ...)
- Akkusativ → *Wen? / Was?* → yang **dikenai** tindakan (... einen Apfel)
- Dativ → *Wem?* → si **penerima** (... dem Kind)
- Contoh jangkar yang dipakai berulang: *Die Mutter gibt dem Kind einen Apfel.*

# Tabel artikel lengkap (harus akurat)
|        | maskulin    | neutral   | feminin     | plural          |
|--------|-------------|-----------|-------------|-----------------|
| Nom    | der / ein   | das / ein | die / eine  | die / –         |
| Akk    | den / einen | das / ein | die / eine  | die / –         |
| Dat    | dem / einem | dem / einem | der / einer | den / – + **-n** |

Pesan kunci untuk A1:
1. Di Akkusativ, **hanya maskulin yang berubah** (der → den, ein → einen).
2. Di Dativ, semua berubah. Plural mendapat **-n** pada kata benda (kecuali kata benda yang sudah berakhiran -n atau -s: den Frauen, den Taxis).

# Isi gambar dari buku (wajib dijelaskan semua)

**A. Sätze verbinden: und, oder, aber**
| Satz 1 | | | Satz 2 |
|---|---|---|---|
| Ich bin in Köln. | + | | Ich mache ein Praktikum. |
| Ich bin in Köln | **und** | | (ich) mache ein Praktikum. |
| Ich telefoniere | **oder** | | (ich) arbeite am Computer. |
| Die Firma ist klein, | **aber** | | sie hat viele Kunden. |

Penjelasan sederhana: und/oder/aber berada di "posisi 0", sehingga urutan kalimat kedua **tidak berubah** (verba tetap di posisi 2). Setelah *und* dan *oder*, subjek yang sama boleh dihilangkan. Sebelum *aber* ada koma.

**B. Dativ: bestimmter und unbestimmter Artikel**
- der/ein Freund → mit **dem/einem** Freund (biru)
- das/ein Taxi → mit **dem/einem** Taxi (hijau)
- die/eine Freundin → mit **der/einer** Freundin (merah)
- die/– Mitarbeiter → mit **den/–** Mitarbeiter**n** (-n oranye)
- Catatan: Im Dativ Plural haben die meisten Nomen ein -n.

**C. Präposition mit + Dativ**
- Mit **wem** fährt Laura? → Sie fährt mit **einem** Freund und **einer** Freundin.

**D. Ortsangaben: Präpositionen mit Dativ**
| Frage | Präp. | Beispiel |
|---|---|---|
| Wohin? | zu | Sie geht **zum** Chef / **zur** Bank. |
| Wo? | bei | Sie ist **beim** Chef / **bei der** Chefin. |
| Woher? | aus | Er kommt **aus dem** Haus / **aus der** Bank. |
| Woher? | von | Sie kommt **vom** Chef / **von der** Chefin. |

Penjelasan sederhana: zu = menuju (ke orang/tempat), bei = berada di (tempat seseorang), aus = keluar dari (dalam bangunan/kota/negara), von = dari (orang atau titik tertentu). Semuanya **selalu Dativ**.

**E. Kurzformen**
zu + der → zur, zu + dem → zum, bei + dem → beim, von + dem → vom

**F. in + Dativ**
- Wo? → Er ist **im** Haus. / Er ist **in der** Bank. (in + dem → im)
- Untuk A1 cukup: kalau pertanyaannya *Wo?*, gunakan Dativ.

# Bagian-bagian website
1. **Beranda**: pengantar singkat "Wer? Wen? Wem?" dan peta menu dengan progress tiap bagian.
2. **Gambar grammatik**: semua bagian A–F sebagai kartu/tabel interaktif. Klik baris → muncul penjelasan sederhana, audio, dan 1–2 contoh tambahan. Artikel yang berubah diberi animasi singkat.
3. **Tabel artikel hidup**: pilih gender (tombol berwarna) dan kasus, lalu artikel berubah dengan animasi. Sorot pesan kunci "hanya maskulin yang berubah di Akkusativ".
4. **Adegan "Wer gibt wem was?"**: ilustrasi sederhana dari SVG/emoji, bukan gambar berhak cipta. Klik tokoh/benda → muncul badge kasus dan panah dari pelaku ke penerima. Minimal 4 adegan.
5. **Detektif Kasus**: kalimat pendek, siswa mengklik setiap kata benda dan memilih Wer/Wen/Wem. Umpan balik langsung dengan alasan.
6. **Satz-Baukasten**: drag & drop (dengan alternatif klik untuk HP). Saat kata benda dipindah ke posisi subjek/objek/penerima, artikelnya berubah otomatis.
7. **Sortir kata kerja**: seret kata kerja ke kotak AKK / DAT / AKK + DAT.
   - AKK: haben, brauchen, kaufen, sehen, möchten, suchen, essen, trinken
   - DAT: helfen, danken, gefallen, gehören, schmecken
   - AKK + DAT: geben, schenken, zeigen, bringen
8. **Präpositionen-Navigator**: peta kota sederhana (Bank, Chef, Haus, Supermarkt, Arzt). Siswa memilih pertanyaan Wohin/Wo/Woher → memilih preposisi yang benar → kalimat terbentuk dengan Kurzform yang tepat.
9. **Latihan berlevel** (minimal 15 soal per level, dari `data.js`):
   - Level 1: pilihan ganda artikel
   - Level 2: Lückentext (isian), termasuk Kurzformen dan und/oder/aber
   - Level 3: mini-dialog sehari-hari (Einkaufen, Familie, Geburtstag, Büro)
   - Progress bar dan lencana kecil di akhir level
10. **Mode Kelas (untuk guru)**:
    - Tombol "Mode Proyektor": huruf besar, kontras tinggi, tanpa elemen yang mengganggu
    - Kuis tim: 2 tim, skor besar di layar, soal acak, tombol "Tunjukkan jawaban"
11. **Ringkasan cetak**: satu halaman berisi semua tabel, rapi saat di-print (CSS `@media print`).

# Kosakata
Gunakan hanya kosakata A1 yang umum (Familie, Essen, Stadt, Büro, Freizeit). Hindari kata yang jarang.

# Pemeriksaan akhir (wajib dilakukan)
1. Periksa ulang **semua** kalimat Jerman: artikel, akhiran Dativ Plural, Kurzformen, dan urutan kata. Buat daftar semua kalimat dan tandai yang sudah diverifikasi.
2. Pastikan setiap soal hanya punya satu jawaban yang benar.
3. Uji di lebar layar HP (375px) dan desktop. Tidak boleh ada scroll horizontal.
4. Pastikan semua interaksi bisa dipakai dengan klik/tap, tidak hanya drag.
5. Buat `README.md` singkat dalam bahasa Indonesia: cara membuka website, cara menambah soal di `data.js`, dan cara upload ke GitHub Pages.

---

# Rencana tahap (disepakati 2026-10-08)

- **Tahap 1** (selesai lebih dulu): struktur file, sistem warna, tipografi, navigasi, struktur `data.js` untuk semua bagian,
  Bagian 1 (Beranda), Bagian 2 (Gambar grammatik A–F), Bagian 3 (Tabel artikel hidup). Bagian lain tampil "Segera hadir".
  Tombol Mode Proyektor sudah dipasang di header sejak tahap 1.
- Tahap berikutnya: Bagian 4–11, lalu README dan pemeriksaan akhir.

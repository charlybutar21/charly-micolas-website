# 📖 Developer Guide & Architecture

Selamat datang di panduan *developer* untuk Charly Micolas Portfolio! Dokumen ini ditulis khusus agar siapapun (termasuk kamu di masa depan) bisa dengan mudah memahami cara kerja kode ini, memodifikasi konten, dan menambahkan fitur baru.

---

## 🏗️ 1. Arsitektur Kode (Dari Mana Mulai Membaca?)

Proyek ini dibangun menggunakan **Next.js 15** dengan pendekatan **App Router**. Semua kode utama yang mengatur tampilan *website* berada di dalam folder `app/`.

Jika kamu ingin mulai membaca dan memahami alur kode, ikuti urutan ini:

1. **`app/layout.tsx`**  
   Ini adalah "kerangka utama" dari seluruh website. Di sinilah tag `<html>`, `<body>`, dan font utama diatur.
2. **`app/page.tsx`**  
   Ini adalah halaman beranda (*Homepage*). Kamu akan melihat bagaimana komponen-komponen seperti `Hero`, `Experience`, `Education`, dan `Skills` dipanggil dan disusun dari atas ke bawah.
3. **`app/components/`**  
   Setelah melihat `page.tsx`, kamu bisa masuk ke folder ini untuk melihat bagaimana masing-masing bagian (misal: `Experience.tsx`) dirakit menggunakan HTML dan dihubungkan dengan datanya.

---

## 📂 2. Struktur Folder (*Folder Structure*)

Proyek ini menerapkan prinsip **Clean Architecture**, di mana Tampilan (UI), Data, dan Gaya (Style) dipisahkan secara rapi agar mudah dikelola (*scalable*).

```text
portfolio/
├── app/
│   ├── components/      # Kumpulan komponen UI (Hero, Experience, dll)
│   ├── data/            # Tempat SEMUA teks konten / CV disimpan
│   ├── styles/          # File CSS (Vanilla CSS Modules)
│   ├── types/           # Definisi tipe data (TypeScript Interfaces)
│   ├── layout.tsx       # Kerangka HTML utama
│   └── page.tsx         # Halaman utama (Homepage)
├── public/              # Tempat menaruh gambar, logo, favicon
├── .github/workflows/   # Skrip CI/CD untuk otomatis deploy ke cPanel
└── next.config.ts       # Pengaturan Next.js (termasuk mode Static Export)
```

---

## 📝 3. Cara Mengubah Konten (Teks, Pengalaman, dll)

**Kabar Baik:** Kamu **TIDAK PERLU** menyentuh kode HTML/React jika hanya ingin mengubah teks, menambah pengalaman kerja, atau menambah *skill* baru!

Semua data telah diisolasi. Langkah-langkahnya:
1. Buka file **`app/data/index.ts`**.
2. Di sana kamu akan melihat struktur data JSON/TypeScript yang sangat mudah dibaca.
3. Cukup ubah teksnya, atau tambahkan *item* baru ke dalam barisan (*array*) yang ada.
4. Simpan, dan *website* akan otomatis merender data barumu dengan desain yang sudah ada.

---

## 🎨 4. Cara Mengubah Desain & Fitur

Jika kamu ingin mengubah tata letak (HTML) atau desain (CSS), berikut alurnya:

### A. Mengubah Tata Letak (UI)
Misal kamu ingin mengubah bagian "Experience":
1. Buka `app/components/Experience.tsx`.
2. Ubah struktur tag HTML di sana. Data akan disuntikkan secara otomatis melalui *props*.

### B. Mengubah Warna / Desain
Proyek ini **TIDAK** menggunakan Tailwind. Kita menggunakan murni **CSS Modules** agar performanya maksimal dan *class name*-nya bersih.
1. Buka folder `app/styles/`.
2. Cari file CSS yang sesuai dengan komponennya (misal: `Experience.module.css`).
3. Di dalam file komponen (`Experience.tsx`), class CSS dipanggil seperti ini: `className={styles.container}`.

### C. Membuat Komponen/Fitur Baru
1. Buat file CSS baru di `app/styles/FiturBaru.module.css`.
2. Buat file React baru di `app/components/FiturBaru.tsx`.
3. Panggil data dari `app/data/index.ts` (jika komponenmu butuh data).
4. *Import* dan pasang komponen tersebut di `app/page.tsx`.

---

## 🚀 5. Proses Deployment

Jangan lupa, proyek ini sudah dilengkapi dengan **CI/CD Otomatis**.
Setiap kali kamu selesai mengubah kode, menambah data, atau mengubah CSS, kamu hanya perlu menjalankan 3 perintah ini di terminal:

```bash
git add .
git commit -m "Update fitur X"
git push origin main
```

Begitu perintah terakhir dijalankan, GitHub akan otomatis melakukan *build* dan mengirimkan *website* terbarumu ke `charlymicolas.com`!

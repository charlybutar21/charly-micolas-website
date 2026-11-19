# Penyimpanan portofolio di Cloudflare D1

Buka /stock, masukkan kunci pemilik sebagai password, lalu pilih **Masuk**. Portofolio terbuka otomatis dan sesi berlaku delapan jam. Klik **Keluar** untuk mengunci halaman di browser tersebut. Simpan password di password manager. Setelah status **Tersimpan di database** muncul, posisi dan asumsi valuasi bisa dibuka dari perangkat lain menggunakan kunci yang sama. Jika perangkat lain sudah menyimpan perubahan lebih dulu, unduh backup lalu muat ulang sebelum menggabungkan perubahan.

Untuk memindahkan posisi dari backup JSON, pilih **Impor / tempel tabel** dan periksa pratinjau sebelum menerapkan perubahan. Backup JSON dan akses lokal juga tersedia.

## Konfigurasi pemilik situs

1. Buat D1 database di akun Cloudflare yang memiliki Pages project `charly-micolas-website`. Buat database preview terpisah agar pengujian tidak menyentuh data produksi.
2. Pada konsol SQL masing-masing database jalankan isi [migrasi awal](../migrations/0001_stock.sql).
3. Pada Pages project, Settings → Bindings, tambahkan D1 binding bernama `STOCK_DB` untuk production dan preview ke database masing-masing.
4. Pada Variables and Secrets, simpan secret `STOCK_OWNER_KEY` dengan nilai acak minimal 32 karakter dari password manager. Gunakan kunci berbeda untuk preview dan production. Jangan masukkan nilai kunci ke repository, chat, atau URL.
5. Deploy ulang setelah binding dan secret disimpan. Buka /stock, hubungkan database, simpan posisi, lalu verifikasi dari browser lain dengan kunci yang sama.

Secret ini memberikan akses baca dan tulis seluruh portofolio pada satu environment. Rotasi kunci melalui Cloudflare bila perlu. [Dokumentasi binding D1 di Pages](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases)


# Panduan portofolio saham

Buka `/stock` langsung pada perangkat tempat portofolio disimpan. Untuk pindah perangkat, pilih **Unduh backup**, buka **Impor / tempel tabel** pada perangkat tujuan, lalu pilih file JSON. Periksa pratinjau sebelum menerapkan perubahan. Simpan backup sebelum menghapus data browser.

## Memasukkan posisi

| Kolom | Isi |
| --- | --- |
| Kode saham | Kode emiten seperti BBCA |
| Jumlah lot | Lot bulat yang dimiliki. Satu lot berisi 100 lembar |
| Average beli | Harga perolehan rata-rata per lembar. Tandai apakah harga sudah mencakup fee beli |
| Harga terakhir | Harga per lembar dari sekuritas pada tanggal yang Anda masukkan |

Untuk beberapa posisi sekaligus, salin empat kolom tersebut dari Excel atau Sheets. Gunakan angka seperti `9.650,50`. Average untuk impor tabel sudah harus mencakup fee beli. Masukkan setiap kode sekali. Tanggal harga tabel berlaku untuk seluruh baris dalam impor tersebut.

## Menghitung harga wajar

Pilih satu metode sesuai asumsi riset Anda. PER mengalikan EPS TTM dengan PER acuan. PBV mengalikan BVPS dengan PBV acuan. Dividend yield membagi DPS tahunan berulang dengan target yield dalam desimal. Pilih manual jika Anda sudah mempunyai estimasi per lembar. Cantumkan sumber, periode laporan, dan alasan memilih acuan, lalu pilih **Simpan asumsi valuasi**.

Misalnya, nilai wajar Rp1.000 dan harga terakhir Rp800 memberi MOS 20% terhadap nilai wajar dan upside 25% terhadap harga terakhir. Jika target MOS Anda 25%, harga batas belinya Rp750. Seluruh angka contoh ini bersifat ilustratif.

## Menghitung tambahan posisi

Pilih anggaran, lot tambahan, atau target average. Anggaran memperhitungkan fee beli dan dibulatkan ke bawah ke lot utuh. Periksa dana terpakai, average baru, estimasi impas jual, bobot posisi, dan P/L jika harga turun lagi 10%. Setelah pembelian di sekuritas benar-benar terjadi, masukkan harga serta lot aktual dan pilih **Catat pembelian ke portofolio**.

Nilai pasar, P/L, dan status target mengikuti harga manual terakhir. Biaya transaksi mengikuti pengaturan Anda. Impas jual merupakan estimasi dengan pembulatan fraksi. Portofolio menghitung posisi saham terbuka dan belum mencakup kas, dividen yang sudah diterima, atau laba/rugi transaksi yang sudah ditutup.

## Data versi sebelumnya

Posisi tersimpan dan backup versi 1 dapat dibaca menggunakan database browser yang sama. Jika tanggal harga lama tidak diketahui, perbarui harga dan tanggalnya. Valuasi awal data lama menggunakan PER. Pilih kembali model yang sesuai bila sebelumnya Anda memakai gabungan beberapa model. Browser baru dimulai dengan portofolio kosong.

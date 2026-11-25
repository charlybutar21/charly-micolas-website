import type { WritingPost } from '../types';

export const writingPosts: WritingPost[] = [
  {
    slug: 'a-practical-guide-to-system-design',
    title: 'A practical guide to system design',
    excerpt:
      'A step-by-step, beginner-friendly handbook on core system design concepts, explained with everyday analogies, practical production examples, and clear architectural trade-offs.',
    publishedOn: '15 Nov 2026',
    readingTime: '18 min read',
    status: 'Published',
    body: [
      'Waktu pertama kali belajar coding, fokus utama kita biasanya sederhana: yang penting fiturnya jalan di laptop. Pengguna klik tombol, backend menyimpan data ke database, lalu tampilan layar berubah. Cara ini aman-aman saja kalau penggunanya cuma 10 orang. Masalah baru muncul ketika 100.000 orang menekan tombol yang sama di detik yang sama saat promo flash sale.',
      'System design adalah cara kita merancang software supaya tetap cepat, akurat, dan tidak tumbang meskipun jumlah pengguna, volume data, dan tim engineering terus bertambah. Kamu tidak perlu menghafal banyak istilah keren untuk paham system design. Cukup pahami beberapa komponen dasarnya beserta konsekuensi atau trade-off dari setiap pilihan.',
    ],
    sections: [
      {
        id: 'what-is-system-design-and-scaling',
        eyebrow: '01 · Core Foundation',
        title:
          'Apa Itu System Design & Cara Sistem Berkembang (Vertical vs. Horizontal Scaling)',
        paragraphs: [
          'System design adalah proses menentukan arsitektur, komponen, API, dan alur data sebuah aplikasi supaya bisa memenuhi target bisnis (misalnya "jangan sampai ada data pembayaran yang terselip") sekaligus target teknis (misalnya "waktu respons di bawah 200 milidetik").',
          'Bayangkan kamu baru merilis toko online. Di hari pertama, aplikasi web dan database kamu ditaruh bersama di satu server seharga $10 per bulan. Begitu tokomu makin ramai, CPU dan RAM di server tunggal itu mulai penuh. Di titik ini, ada dua cara untuk meningkatkan kapasitas sistem:',
          '1. Vertical Scaling (Scale Up): Meng-upgrade server tunggal tadi ke mesin yang lebih besar dengan core CPU dan RAM lebih banyak. Ini langkah paling praktis karena kamu tidak perlu mengubah kode sama sekali. Tapi setiap mesin punya batas maksimal hardware, dan kalau satu server ini mati, seluruh tokomu ikut mati.',
          '2. Horizontal Scaling (Scale Out): Alih-alih membeli satu komputer super mahal, kamu menjalankan 5, 10, atau 50 server standar secara berdampingan. Kalau satu server mati, server lainnya langsung mengambil alih trafik tanpa membuat aplikasi down.',
        ],
        analogy: {
          title: 'Analogi Pemula: Dapur Restoran',
          text: 'Coding itu ibarat keahlian memasak satu piring makanan yang enak. System design adalah cara menata seluruh dapur restoran supaya 20 koki bisa memasak 500 porsi per jam tanpa saling tabrakan, kehabisan bahan, atau berhenti beroperasi gara-gara satu kompor rusak. Vertical scaling ibarat menyewa satu koki super cepat, sedangkan horizontal scaling ibarat mempekerjakan 10 koki yang memasak secara paralel.',
        },
        example: {
          title: 'Aturan Praktis: Pastikan Backend Server Bersifat Stateless',
          description:
            'Agar horizontal scaling bisa berjalan mulus, server backend kamu wajib bersifat stateless. Artinya, tidak boleh ada server yang menyimpan data sesi login pengguna hanya di dalam RAM lokalnya sendiri.',
          steps: [
            'Praktik buruk (Stateful): User A login lewat Server 1, lalu Server 1 menyimpan data sesi login tersebut di memori lokalnya. Saat request berikutnya dari User A diarahkan ke Server 2, Server 2 tidak mengenali User A dan memaksanya login ulang.',
            'Praktik baik (Stateless): Server 1 dan Server 2 sama sekali tidak menyimpan data sesi di RAM lokal. Sebagai gantinya, token sesi disimpan di penyimpanan bersama seperti Redis, atau diverifikasi lewat JWT dan HttpOnly cookie.',
            'Hasilnya: Server mana pun bisa melayani request dari siapa saja kapan pun. Kamu juga bebas menambah atau mengurangi jumlah server secara otomatis (Auto-Scaling) saat trafik sedang melonjak.',
          ],
        },
        callout:
          'Catatan Arsitek: Mulailah dari yang sederhana. Pakai vertical scaling di hari pertama tidak masalah, tapi biasakan menulis kode backend yang stateless sejak awal supaya sistemmu siap di-scale secara horizontal kapan saja.',
      },
      {
        id: 'networking-dns-tcp-udp-load-balancer',
        eyebrow: '02 · Networking & Traffic Routing',
        title:
          'Perjalanan Request Menuju Server: DNS, TCP vs. UDP & Load Balancer',
        paragraphs: [
          'Apa yang sebenarnya terjadi dalam 100 milidetik setelah seseorang mengetik alamat website kamu di browser? Pertama, browser bertanya ke DNS (Domain Name System), yang berfungsi seperti buku kontak internet, untuk menerjemahkan nama domain seperti charlymicolas.com menjadi alamat IP server seperti 104.21.45.12.',
          'Selanjutnya, perangkat pengguna membuka koneksi di Layer 4 (Transport Layer) menggunakan protokol TCP atau UDP. TCP bekerja dengan hati-hati dan mengutamakan keandalan: ia melakukan 3-way handshake, memastikan setiap paket data datang berurutan, dan otomatis meminta kirim ulang kalau ada paket yang hilang di jalan. Sebaliknya, UDP dirancang murni untuk kecepatan: paket langsung ditembakkan tanpa jabat tangan dan tanpa pengiriman ulang.',
          'Terakhir, request sampai di Load Balancer (atau Reverse Proxy seperti NGINX dan Cloudflare) yang berjaga di depan kumpulan server backend. Layaknya petugas pengatur lalu lintas, Load Balancer meneruskan request tersebut ke salah satu server yang sedang sehat.',
        ],
        analogy: {
          title: 'Analogi Pemula: Kurir Dokumen Resmi vs. Telepon Video Langsung',
          text: 'TCP itu mirip mengirim dokumen kontrak lewat kurir tercatat: setiap halaman diberi nomor urut, dan kalau halaman 3 terselip, penerima akan meminta halaman 3 dikirim ulang sebelum lanjut membaca. UDP itu mirip ngobrol lewat video call: kalau gambarnya sempat patah selama 0,1 detik, kamu tentu tidak mau videonya berhenti lalu memutar ulang kalimat 2 detik yang lalu. Kamu ingin obrolannya tetap jalan secara real-time.',
        },
        table: {
          caption: 'Perbandingan Praktis: Memilih Antara TCP dan UDP',
          headers: ['Aspek', 'TCP (Andal & Akurat)', 'UDP (Sangat Cepat)'],
          rows: [
            [
              'Pembukaan Koneksi',
              'Wajib melakukan 3-way handshake sebelum kirim data',
              'Tanpa koneksi awal, data langsung dikirim',
            ],
            [
              'Pengiriman & Urutan',
              'Dijamin sampai dan berurutan (paket hilang dikirim ulang)',
              'Tidak ada jaminan (paket yang hilang diabaikan)',
            ],
            [
              'Kecepatan & Overhead',
              'Latensi sedikit lebih tinggi karena ada pengecekan keamanan data',
              'Latensi paling rendah dengan beban overhead minimal',
            ],
            [
              'Contoh Penggunaan Nyata',
              'REST API, halaman web HTTPS, transaksi pembayaran, query database, email',
              'Video call Zoom/WhatsApp, game online multiplayer, live streaming, pencarian DNS',
            ],
          ],
        },
        highlights: [
          {
            label: 'Layer 4 vs. Layer 7 Load Balancer',
            detail:
              'Load Balancer Layer 4 hanya melihat alamat IP dan nomor port (TCP/UDP), sehingga prosesnya sangat cepat. Load Balancer Layer 7 membuka isi HTTP request sehingga bisa mengarahkan trafik lebih pintar berdasarkan URL path (misalnya mengarahkan /api/payments ke Payment Service dan /images ke Media Service).',
          },
          {
            label: 'Algoritma Load Balancing & Health Check',
            detail:
              'Gunakan algoritma Round Robin kalau semua server punya spesifikasi setara dan beban tiap request relatif ringan. Gunakan Least Connections kalau ada sebagian request yang butuh waktu proses jauh lebih lama. Jangan lupa aktifkan Health Check (/healthz) supaya Load Balancer otomatis berhenti mengirim trafik ke server yang sedang mati.',
          },
        ],
      },
      {
        id: 'caching-and-cdn-in-practice',
        eyebrow: '03 · Speed & Low Latency',
        title: 'Caching (Redis) & CDN: Membuat Sistem Lambat Jadi 1.000x Lebih Cepat',
        paragraphs: [
          'Bagian paling lambat dari hampir setiap request web adalah proses membaca data dari disk database. Membaca data dari RAM (penyimpanan in-memory seperti Redis atau Memcached) hanya butuh sekitar 100 nanodetik, sedangkan membaca dari SSD database butuh sekitar 100 mikrodetik. Artinya, membaca dari RAM kurang lebih 1.000 kali lebih cepat dibanding membaca dari disk.',
          'Cache menyimpan hasil query database yang berat atau perhitungan yang sering diminta di dalam RAM, jadi aplikasi tidak perlu bolak-balik membebani database untuk mengambil data yang sama. Sementara itu, CDN (Content Delivery Network seperti Cloudflare atau AWS CloudFront) menyimpan file statis (gambar, CSS, JS, video) di server-server edge yang tersebar di berbagai kota agar lokasinya dekat dengan pengguna.',
        ],
        analogy: {
          title: 'Analogi Pemula: Laci Meja Kerja vs. Arsip Perpustakaan Kota',
          text: 'Database utama itu ibarat perpustakaan besar di ujung kota: koleksinya lengkap, tapi butuh 30 menit perjalanan ke sana. Redis Cache ibarat laci kecil di meja kerjamu tempat menyimpan 5 buku catatan yang kamu buka setiap jam. Sedangkan CDN ibarat menaruh salinan buku terlaris di kios-kios dekat perumahan warga supaya pembaca tidak perlu jauh-jauh datang ke perpustakaan pusat.',
        },
        example: {
          title: 'Pola Praktis Langkah demi Langkah: Cache-Aside (Lazy Loading)',
          description:
            'Cache-Aside adalah pola caching yang paling sering dipakai di sistem backend. Berikut alur kerja API saat menangani request seperti GET /products/101:',
          steps: [
            '1. Cek Cache lebih dulu: Backend menanyakan key "product:101" ke Redis.',
            '2. Cache Hit (Jalur Cepat): Kalau "product:101" ada di Redis, langsung kembalikan data JSON-nya dalam waktu sekitar 1 ms tanpa menyentuh database sama sekali.',
            '3. Cache Miss (Jalur Lambat): Kalau datanya belum ada di Redis, ambil dari PostgreSQL lewat query SELECT * FROM products WHERE id = 101.',
            '4. Simpan ke Cache dengan TTL: Simpan hasil dari database tadi ke Redis lengkap dengan batas waktu kedaluwarsa (misalnya TTL = 300 detik), lalu kirim hasilnya ke pengguna.',
            '5. Hapus Cache saat Data Berubah (Cache Invalidation): Setiap kali admin mengubah data Produk 101 (PUT /products/101), perbarui data di PostgreSQL lebih dulu, lalu segera hapus key "product:101" dari Redis supaya pengguna tidak melihat harga lama.',
          ],
          code: `// Practical Cache-Aside flow in pseudocode
async function getProduct(productId: string) {
  const cacheKey = \`product:\${productId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // 1. Cache Hit (~1ms)

  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]); // 2. Cache Miss
  await redis.set(cacheKey, JSON.stringify(product), { EX: 300 }); // 3. Save with 5-min TTL
  return product;
}`,
        },
        callout:
          'Catatan Arsitek: Gunakan prinsip Pareto 80/20. Biasanya 80% trafik pembacaan data hanya mengakses 20% data terpopuler (seperti daftar produk promo hari ini atau artikel yang sedang ramai). Menyimpan 20% data tersebut di Redis sudah cukup untuk memangkas beban database hingga 80%.',
      },
      {
        id: 'databases-sql-nosql-indexing-n-plus-one',
        eyebrow: '04 · Data Storage & Query Performance',
        title:
          'Database: SQL vs. NoSQL, B-Tree Indexing & Mengatasi Masalah N+1 Query',
        paragraphs: [
          'Bagaimana cara memilih antara Relational Database (SQL seperti PostgreSQL atau MySQL) dan Non-Relational Database (NoSQL seperti MongoDB, Redis, atau Cassandra)? Engineer berpengalaman tidak pernah memilih database karena ikut-ikutan tren. Mereka memilih berdasarkan relasi antar-data, kebutuhan konsistensi, serta pola baca dan tulis aplikasinya.',
          'Database SQL menyimpan data terstruktur di dalam tabel dengan skema yang ketat dan menjamin transaksi ACID (Atomicity, Consistency, Isolation, Durability). Saat pengguna mentransfer Rp100.000 dari Rekening A ke Rekening B, prinsip ACID memastikan saldo kedua rekening berhasil diperbarui bersamaan, atau dibatalkan seluruhnya kalau server tiba-tiba mati di tengah jalan.',
          'Database NoSQL mengorbankan fitur JOIN antar-tabel yang rumit demi mendapatkan skema yang fleksibel dan kecepatan tulis skala besar. Di dunia nyata, sistem berskala besar biasanya memakai kombinasi keduanya: PostgreSQL untuk data pengguna, pesanan, dan pembayaran, dipadukan dengan Redis untuk caching serta Cassandra atau MongoDB untuk menampung log aktivitas berjumlah besar.',
        ],
        table: {
          caption: 'Panduan Praktis: Database Mana yang Sebaiknya Kamu Pilih?',
          headers: ['Jenis Database', 'Paling Cocok Untuk', 'Contoh Populer'],
          rows: [
            [
              'Relational (SQL)',
              'Saldo keuangan, transaksi pesanan, stok barang, akun pengguna, transaksi ACID ketat',
              'PostgreSQL, MySQL',
            ],
            [
              'Key-Value (NoSQL)',
              'Caching super cepat (sub-milidetik), sesi login, penghitung rate limit, leaderboard',
              'Redis, Memcached, DynamoDB',
            ],
            [
              'Document (NoSQL)',
              'Katalog produk dengan atribut beragam, artikel CMS, profil JSON yang fleksibel',
              'MongoDB, Firestore',
            ],
            [
              'Wide-Column (NoSQL)',
              'Miliaran pesan chat dengan beban tulis tinggi, telemetri IoT, riwayat aktivitas',
              'Apache Cassandra, ScyllaDB',
            ],
            [
              'Search Engine',
              'Pencarian teks lengkap (full-text search), autocomplete tahan salah ketik, filter log',
              'Elasticsearch, OpenSearch, Meilisearch',
            ],
          ],
        },
        example: {
          title: 'Dua Jebakan Database yang Wajib Dikuasai Setiap Engineer',
          description:
            'Sebelum buru-buru menyewa server database yang lebih mahal, periksa dua biang kerok utama yang paling sering membuat API produksi melambat, yaitu index yang belum dipasang dan masalah N+1 Query:',
          steps: [
            '1. Lupa Memasang Index Database (Full Table Scan): Tanpa index pada kolom users(email), query WHERE email = "charly@example.com" akan memaksa database memeriksa seluruh 10 juta baris satu per satu dari atas ke bawah. Menambahkan B-Tree Index itu ibarat membuat daftar indeks abjad di halaman belakang buku cetak, sehingga database bisa langsung melompat ke baris yang dicari dalam waktu O(log N). Konsekuensinya: Index membuat query SELECT jauh lebih cepat, tapi sedikit memperlambat proses INSERT dan UPDATE karena struktur pohon index-nya ikut diperbarui.',
            '2. Masalah N+1 Query: Bayangkan kamu mengambil 50 artikel blog (1 query), lalu di dalam perulangan for-loop kamu menjalankan query tambahan untuk mengambil nama penulis dari masing-masing artikel (50 query lagi). Totalnya ada 51 kali bolak-balik ke database hanya untuk merender satu halaman! Solusinya, gunakan SQL JOIN atau ambil sekaligus dengan klausa WHERE author_id IN (...) supaya database cukup bekerja dalam 1 atau 2 query saja.',
          ],
          code: `-- ❌ BAD: N+1 Query Problem (1 query + 50 queries inside a loop = 51 queries)
SELECT * FROM articles LIMIT 50;
-- Inside loop for each article:
SELECT name FROM users WHERE id = 101;
SELECT name FROM users WHERE id = 102; -- ...repeated 50 times!

-- ✅ GOOD: Single Eager-Loaded Query (Only 1 query total)
SELECT a.id, a.title, u.name AS author_name
FROM articles a
JOIN users u ON a.author_id = u.id
LIMIT 50;`,
        },
      },
      {
        id: 'scaling-databases-replication-sharding-cap',
        eyebrow: '05 · Distributed Data at Scale',
        title:
          'Skalabilitas Database: Replikasi, Sharding & Penjelasan Sederhana Teorema CAP',
        paragraphs: [
          'Apa yang harus dilakukan kalau query sudah dioptimasi dan index sudah terpasang rapi, tapi satu server PostgreSQL masih kewalahan melayani jutaan pengguna? Skalabilitas lapisan database biasanya dilakukan dalam dua tahap: pertama melalui Replikasi (ketika trafik didominasi pembacaan data), lalu Sharding (ketika beban penulisan data atau kapasitas penyimpanan sudah tidak muat lagi di satu mesin).',
          'Pada pola Master-Slave (Primary-Replica) Replication, semua operasi tulis (INSERT, UPDATE, DELETE) diarahkan ke satu node Primary. Node Primary kemudian menyalin perubahan data tersebut ke beberapa Read Replica yang bertugas melayani semua query baca (SELECT). Kalau node Primary mati, salah satu Read Replica bisa diangkat menjadi Primary baru.',
          'Pada Database Sharding (Horizontal Partitioning), kamu memecah satu tabel raksasa berisi 500 juta baris menjadi beberapa bagian lebih kecil (disebut shard) yang disimpan di server database terpisah. Misalnya, Shard 1 menyimpan pengguna dengan ID 1 sampai 10 juta, Shard 2 menyimpan ID 10 juta sampai 20 juta, atau datanya disebar merata menggunakan algoritma Consistent Hashing.',
        ],
        analogy: {
          title:
            'Analogi Pemula: Teorema CAP (Consistency vs. Availability)',
          text: 'Bayangkan kamu dan pasanganmu punya rekening bank bersama dengan saldo Rp1.000.000, lalu ada dua mesin ATM di dua kota berbeda. Tiba-tiba, kabel jaringan antar-kota tersebut putus (terjadi Network Partition). Saat kamu menarik Rp1.000.000 di ATM 1 dan di saat bersamaan pasanganmu menarik Rp1.000.000 di ATM 2, pihak bank hanya punya dua pilihan: 1) Consistency (CP): Membekukan transaksi sementara dan menolak penarikan sampai kabel jaringan tersambung lagi, supaya saldo Rp1.000.000 tidak bisa ditarik menjadi Rp2.000.000. 2) Availability (AP): Tetap mengeluarkan uang agar nasabah tidak kecewa, lalu membereskan selisih saldonya belakangan setelah jaringan kembali normal.',
        },
        highlights: [
          {
            label: 'Waspadai Replication Lag',
            detail:
              'Saat replikasi berjalan secara asynchronous, butuh jeda sekitar 50 sampai 200 ms bagi data baru di Primary untuk muncul di Read Replica. Kalau pengguna baru saja memperbarui profilnya lalu langsung me-refresh halaman, arahkan pembacaan data profil miliknya sendiri langsung ke Primary (pola Read-Your-Own-Writes) supaya ia tidak mengira perubahan datanya gagal tersimpan.',
          },
          {
            label: 'Mengapa Consistent Hashing Penting untuk Sharding',
            detail:
              'Kalau kamu membagi shard memakai rumus modulo biasa (user_id % 4 server) lalu suatu hari menambah server ke-5 (user_id % 5), hampir 80% lokasi data akan berubah dan harus dipindahkan serentak! Consistent Hashing menata server di atas cincin virtual sehingga penambahan server baru hanya perlu memindahkan sekitar 1/N bagian data saja.',
          },
        ],
        callout:
          'Catatan Arsitek: Sharding membuat proses JOIN lintas server dan transaksi database menjadi jauh lebih rumit. Pastikan kamu sudah memaksimalkan Indexing, optimasi query, Redis Caching, dan Read Replica sebelum memutuskan melakukan sharding.',
      },
      {
        id: 'asynchronous-messaging-queues-pubsub-microservices',
        eyebrow: '06 · Asynchronous Architecture',
        title:
          'Message Queue, Pub/Sub & Memisahkan Proses Lambat dari Request Pengguna',
        paragraphs: [
          'Salah satu kesalahan paling umum di pengembangan backend adalah mengerjakan proses yang lambat sambil membiarkan pengguna menunggu respons HTTP. Kalau pengguna menekan tombol "Bayar Sekarang", lalu server secara berurutan memotong saldo kartu, membuat file PDF invoice, mengirim email konfirmasi, dan memberi tahu sistem gudang sebelum mengembalikan HTTP 200, pengguna harus menatap layar loading selama 8 detik. Lebih parah lagi, kalau server email sedang gangguan, seluruh proses pembayaran ikut gagal!',
          'Sistem modern mengakalinya dengan menjaga jalur HTTP utama tetap singkat (cukup validasi pesanan dan simpan ke database dalam 50 ms), lalu melempar sisa pekerjaan lainnya ke belakang layar menggunakan komunikasi asynchronous.',
          'Ada dua pola pengiriman pesan utama yang wajib kamu pahami: Message Queue (Point-to-Point, seperti RabbitMQ atau AWS SQS) di mana satu tugas diambil dan dikerjakan oleh tepat satu worker, serta Publish-Subscribe atau Event Streaming (seperti Apache Kafka atau Google Pub/Sub) di mana satu event disiarkan ke banyak service independen sekaligus.',
        ],
        analogy: {
          title: 'Analogi Pemula: Kasir Kedai Kopi vs. Antrean Barista',
          text: 'Di sistem synchronous, kasir menerima uangmu, lalu berjalan sendiri ke mesin espresso, memanaskan susu, dan meracik kopi selama 4 menit sementara 20 pelanggan lain mengantre dengan kesal di belakangmu. Di sistem Message Queue yang asynchronous, kasir cukup memproses pembayaranmu dalam 10 detik, menyerahkan struk, lalu menaruh gelas pesananmu di meja antrean barista. Para barista di belakang (Workers) mengambil gelas dari antrean satu per satu, sementara kasir bisa langsung melayani pelanggan berikutnya.',
        },
        example: {
          title: 'Arsitektur Checkout Praktis: Kombinasi Queue & Pub/Sub Fanout',
          description:
            'Berikut cara backend e-commerce menangani event OrderPaid secara rapi tanpa membuat antar-service saling bergantung:',
          steps: [
            '1. Respons HTTP Cepat: Order Service mencatat pembayaran di PostgreSQL dan mengirim satu event "OrderPaid" ke message broker, lalu langsung mengembalikan respons HTTP 200 OK ke layar pengguna.',
            '2. Eksekusi Paralel (Pub/Sub Fanout): Empat service terpisah mendengarkan event "OrderPaid" dan bekerja secara paralel. Notification Service mengirim email struk pembayaran, Warehouse Service menyiapkan pengiriman barang, Loyalty Service menambahkan poin hadiah, dan Analytics Service memperbarui laporan pendapatan harian.',
            '3. Retry Aman & Dead-Letter Queue (DLQ): Kalau penyedia layanan email sedang gangguan sesaat, Notification Service akan mencoba ulang dengan jeda Exponential Backoff (tunggu 2 detik, 4 detik, lalu 8 detik). Kalau setelah 5 kali percobaan masih gagal, pesan dipindahkan ke Dead-Letter Queue (DLQ) supaya tim engineer bisa memeriksa dan memprosesnya kembali tanpa menghambat pengiriman email pengguna lain.',
          ],
        },
        highlights: [
          {
            label: 'RabbitMQ / SQS vs. Apache Kafka',
            detail:
              'RabbitMQ dan AWS SQS adalah antrean tugas tradisional: begitu worker selesai mengerjakan satu pesan, pesan tersebut langsung dihapus dari antrean. Apache Kafka adalah catatan event (append-only event log) yang disimpan di disk: data event tetap tersimpan selama berhari-hari atau berminggu-minggu, sehingga service baru bisa memutar ulang riwayat event dari awal.',
          },
          {
            label: 'Monolith vs. Modular Monolith vs. Microservices',
            detail:
              'Jangan memulai proyek baru langsung dengan 15 microservices karena waktu timmu akan habis untuk mengurus latensi jaringan, debugging lintas server, dan rumitnya deployment. Mulailah dengan Clean Modular Monolith (modul-modul bisnis dipisah rapi di dalam satu aplikasi yang mudah di-deploy), lalu pisahkan menjadi microservice hanya untuk bagian yang benar-benar butuh di-scale secara terpisah.',
          },
        ],
      },
      {
        id: 'resiliency-rate-limiting-circuit-breaker-idempotency',
        eyebrow: '07 · Production Resiliency & Safety',
        title:
          'Rate Limiting, Circuit Breaker & Idempotency: Melindungi Sistem Produksi',
        paragraphs: [
          'Di lingkungan produksi, hal-hal di luar dugaan cepat atau lambat pasti terjadi: pengguna HP dengan sinyal 4G yang putus-nyambung akan menekan tombol "Bayar" tiga kali berturut-turut, API pihak ketiga tiba-tiba macet selama 30 detik, atau bot berbahaya membombardir endpoint login kamu.',
          'Supaya tahan menghadapi kondisi dunia nyata, sistem backend mengandalkan tiga pola pertahanan utama: Rate Limiting di pintu masuk, Circuit Breaker di antara komunikasi antar-service, dan Idempotency pada setiap API yang mengubah data.',
        ],
        example: {
          title: 'Bagaimana Idempotency Mencegah Pelanggan Tertagih Dua Kali',
          description:
            'Bayangkan seorang pelanggan menekan tombol "Bayar $50". Server kamu berhasil memotong saldonya, tapi tepat saat respons sukses sedang dikirim balik ke HP pelanggan, koneksi Wi-Fi mereka terputus. Aplikasi di HP otomatis mencoba kirim ulang request POST /payments. Tanpa idempotency, saldo pelanggan akan terpotong dua kali menjadi $100! Berikut cara Idempotency-Key mencegah masalah ini dalam 4 langkah:',
          steps: [
            '1. Client Membuat Key Unik: Saat pengguna membuka halaman checkout, aplikasi membuat sebuah UUID unik (misalnya Idempotency-Key: "order_991_attempt_1") dan menyertakannya di header HTTP request.',
            '2. Server Memeriksa Key Lebih Dulu: Sebelum memotong saldo, backend mengecek Redis atau database: "Apakah kita sudah pernah menerima Idempotency-Key order_991_attempt_1 sebelumnya?"',
            '3. Request Pertama (Proses & Simpan): Kalau key tersebut baru pertama kali masuk, server mengunci key itu, memproses pembayaran $50, menyimpan hasil JSON struk pembayaran di bawah key tersebut, lalu mengembalikannya ke pengguna.',
            '4. Percobaan Ulang yang Duplikat (Kembalikan Struk Tersimpan): Saat HP pengguna mengirim ulang request 2 detik kemudian dengan Idempotency-Key yang sama persis, server melihat transaksi itu sudah selesai dan cukup mengembalikan struk yang sudah tersimpan tanpa memotong saldo lagi.',
          ],
          code: `POST /api/v1/payments HTTP/1.1
Host: api.example.com
Idempotency-Key: 8f14e45f-ceea-467f-a8f1-44c09e09112a
Content-Type: application/json

{ "orderId": "ORD-991", "amount": 50000 }`,
        },
        highlights: [
          {
            label: 'Rate Limiting (Algoritma Token Bucket)',
            detail:
              'Bayangkan sebuah ember yang menampung maksimal 60 koin dan otomatis terisi ulang 1 koin setiap detik. Setiap request API dari pengguna akan mengambil 1 koin dari ember miliknya. Kalau ada bot yang mengirim 1.000 request dalam satu detik, koin di ember langsung habis dan server segera menolak sisa request-nya dengan status HTTP 429 Too Many Requests.',
          },
          {
            label: 'Circuit Breaker (Closed → Open → Half-Open)',
            detail:
              'Cara kerjanya mirip sekring listrik di rumah. Dalam kondisi normal (Closed), request lewat seperti biasa. Kalau service tujuan mengalami gagal lebih dari 50%, sekring otomatis turun ke posisi Open dan langsung menolak request selama 30 detik agar thread server kamu tidak ikut macet menunggu. Setelah jeda selesai, posisinya masuk ke Half-Open untuk meloloskan beberapa request percobaan guna mengecek apakah service tujuan sudah pulih.',
          },
        ],
        callout:
          'Catatan Arsitek: Setiap endpoint POST, PUT, atau PATCH yang memindahkan uang, membuat pesanan, atau mengirim notifikasi wajib menggunakan Idempotency-Key, serta menerapkan batas timeout yang tegas dan Circuit Breaker saat memanggil service lain.',
      },
      {
        id: 'realtime-and-location-systems',
        eyebrow: '08 · Real-Time & Location Search',
        title:
          'WebSockets, Server-Sent Events (SSE) & Cara Aplikasi Ojek Online Mencari Driver Terdekat',
        paragraphs: [
          'HTTP standar bekerja dengan pola tanya-jawab: server baru bicara kalau browser bertanya lebih dulu. Pola ini cocok untuk membuka halaman web biasa, tapi sangat tidak efisien untuk aplikasi chat seperti WhatsApp, pergerakan harga saham real-time, streaming teks AI, atau melacak posisi driver Gojek dan Uber di peta.',
          'Untuk mendorong data secara real-time tanpa memaksa browser bertanya "Ada pesan baru belum?" setiap detik (Short Polling), kita bisa memilih antara Long Polling, Server-Sent Events (SSE), atau WebSockets.',
        ],
        table: {
          caption: 'Perbandingan Praktis: Protokol Komunikasi Real-Time',
          headers: ['Protokol', 'Arah Komunikasi', 'Penggunaan Paling Tepat'],
          rows: [
            [
              'Long Polling',
              'Client mengirim request → Server menahan koneksi tetap terbuka sampai ada data baru',
              'Cadangan notifikasi sederhana ketika koneksi WebSocket terblokir',
            ],
            [
              'Server-Sent Events (SSE)',
              'Satu Arah (Server → Client lewat jalur HTTP standar)',
              'Streaming jawaban teks AI (gaya ChatGPT), skor pertandingan langsung, harga saham, umpan status',
            ],
            [
              'WebSockets',
              'Dua Arah Penuh / Full-Duplex (Koneksi TCP persisten Client ↔ Server)',
              'Chat WhatsApp/Telegram, game multiplayer, kolaborasi dokumen, pertukaran koordinat GPS driver',
            ],
          ],
        },
        example: {
          title:
            'Bagaimana Gojek, Grab & Uber Menemukan Driver dalam Radius 1 km di Bawah 10 ms (Geohashing & Quadtrees)',
          description:
            'Kalau kamu punya 1 juta driver aktif lalu menjalankan query SELECT * FROM drivers WHERE lat BETWEEN X1 AND X2 AND lng BETWEEN Y1 AND Y2, database biasa akan langsung kewalahan karena B-Tree index tidak bisa mencari dua dimensi koordinat (latitude sekaligus longitude) secara efisien.',
          steps: [
            '1. Geohashing (Mengubah Koordinat 2D Jadi String 1D): Geohashing membagi peta dunia menjadi kotak-kotak grid lalu mengubah pasangan koordinat (Latitude, Longitude) menjadi kode teks pendek seperti "qqguw4". Dua orang yang berdiri di jalan yang sama akan memiliki awalan kode 6 karakter yang sama ("qqguw4").',
            '2. Pencarian Awalan Instan: Mencari seluruh driver dalam radius sekitar 1 km berubah menjadi pencarian awalan teks yang sangat ringan menggunakan index di Redis (GEORADIUS / GEOSEARCH) atau SQL (WHERE geohash LIKE "qqguw4%").',
            '3. Quadtree untuk Kota Padat: Di dalam memori, struktur data Quadtree secara dinamis membelah area padat (seperti pusat kota Jakarta saat jam pulang kantor) menjadi 4 kotak kecil, sementara area lautan atau hutan yang sepi tetap dibiarkan sebagai satu kotak besar sehingga sangat hemat memori.',
          ],
        },
      },
      {
        id: 'seven-step-framework-and-cheatsheet',
        eyebrow: '09 · Interview & Architecture Playbook',
        title:
          '7 Langkah Kerangka Kerja System Design & Cheat Sheet Referensi Cepat',
        paragraphs: [
          'Baik saat kamu sedang merancang microservice baru di kantor maupun saat menghadapi sesi System Design Interview berdurasi 45 menit (seperti "Rancang Bitly", "Rancang WhatsApp", atau "Rancang Netflix"), jangan pernah langsung menggambar kotak-kotak database. Ikuti kerangka 7 langkah yang terstruktur supaya rancanganmu selalu berangkat dari kebutuhan nyata.',
        ],
        example: {
          title:
            'Panduan 7 Langkah (Dengan Contoh Cepat URL Shortener / Bitly)',
          steps: [
            'Langkah 1: Pastikan Kebutuhan Sistem (3 sampai 5 menit): Tanyakan fitur apa saja yang perlu dibuat (Functional: memperpendek URL panjang menjadi kode 7 karakter dan melakukan redirect) serta target skala sistemnya (Non-Functional: rasio baca dibanding tulis 100:1, latensi redirect di bawah 20 ms, dan uptime 99,99%).',
            'Langkah 2: Hitung Estimasi Kasar Kapasitas (5 menit): Gunakan patokan praktis 1 hari = 100.000 detik. Kalau pengguna membuat 100 juta URL per bulan, itu sekitar 40 proses tulis per detik. Dengan rasio baca 100:1, berarti ada 4.000 proses redirect per detik, sehingga kita jelas membutuhkan Redis cache untuk menyimpan link populer.',
            'Langkah 3: Rancang Model Data & Penyimpanan (5 menit): Buat skema tabel yang ringkas dan jelas, misalnya urls(id, short_code VARCHAR(7) UNIQUE INDEX, original_url, created_at, expires_at), lalu pilih database seperti PostgreSQL atau DynamoDB.',
            'Langkah 4: Tentukan Kontrak API (5 menit): Tulis spesifikasi endpoint yang bersih, contohnya POST /api/v1/urls (menerima longUrl, mengembalikan shortUrl) dan GET /{shortCode} (mengembalikan HTTP 301 atau 302 redirect ke Location: originalUrl).',
            'Langkah 5: Gambar Arsitektur Tingkat Tinggi (10 menit): Gambarkan alur data dari ujung ke ujung: Client → CDN/Cloudflare → Load Balancer → Stateless URL Service → Redis Cache (aturan 80/20) → Database + Read Replicas.',
            'Langkah 6: Bedah Masalah Teknis Tersulit (10 menit): Jelaskan cara menghasilkan kode unik 7 karakter tanpa bentrok (collision) menggunakan Distributed 64-bit ID Generator (seperti Twitter Snowflake) yang dikonversi ke Base62 ([0-9, a-z, A-Z] → 62^7 = 3,5 triliun kombinasi link unik).',
            'Langkah 7: Identifikasi Bottleneck & Titik Rawan Gagal (5 menit): Tambahkan Rate Limiting untuk menahan bot spam, pasang Load Balancer active-active agar tidak ada Single Point of Failure (SPOF), dan atur strategi TTL pada Redis cache.',
          ],
        },
        table: {
          caption: 'Cheat Sheet Arsitek: Masalah → Pilihan Teknologi yang Tepat',
          headers: [
            'Kebutuhan / Masalah Sistem',
            'Solusi & Teknologi yang Direkomendasikan',
          ],
          rows: [
            [
              'Pencatatan saldo keuangan, pesanan, akun pengguna (butuh ACID ketat)',
              'Relational Database → PostgreSQL / MySQL',
            ],
            [
              'Caching cepat, penyimpanan sesi login, rate limiting, leaderboard',
              'In-Memory Key-Value Store → Redis',
            ],
            [
              'Miliaran pesan chat atau log aktivitas dengan beban tulis sangat tinggi',
              'Wide-Column NoSQL → Apache Cassandra / ScyllaDB',
            ],
            [
              'Pencarian teks lengkap (full-text search), filter katalog & autocomplete',
              'Inverted-Index Search Engine → Elasticsearch / OpenSearch',
            ],
            [
              'Penyimpanan foto, video, file PDF, dan backup statis',
              'Object Storage + Edge CDN → Amazon S3 + Cloudflare',
            ],
            [
              'Memindahkan tugas latar belakang yang lambat (kirim email, buat PDF, webhook)',
              'Point-to-Point Message Queue → RabbitMQ / Amazon SQS',
            ],
            [
              'Streaming event berkapasitas tinggi & distribusi data ke banyak service',
              'Distributed Event Log → Apache Kafka / Google Pub/Sub',
            ],
            [
              'Komunikasi internal yang cepat antar-microservice',
              'Binary RPC di atas HTTP/2 → gRPC (Protocol Buffers)',
            ],
            [
              'Chat real-time dua arah atau game online langsung',
              'Koneksi TCP Full-Duplex Persisten → WebSockets',
            ],
            [
              'Mencari driver atau restoran terdekat dalam radius 1 km',
              'Spatial Index → Geohash (Redis Geo) / In-Memory Quadtree',
            ],
          ],
        },
        callout:
          'Rumus Cepat Hitung Kapasitas di Kepala: 1 hari = 86.400 detik, bulatkan saja menjadi 100.000 detik (10^5). Jadi 1 juta request/hari sekitar 12 RPS; 10 juta/hari sekitar 120 RPS; 100 juta/hari sekitar 1.200 RPS; dan 1 miliar/hari sekitar 12.000 RPS.',
      },
    ],
    externalResource: {
      label: 'Read the Complete Open-Source System Design Handbook on GitHub',
      url: 'https://github.com/charlybutar21/system-design',
      note: 'Ingin belajar lebih dalam? Artikel ini dirangkum dari repositori open-source System Design bahasa Indonesia yang saya tulis. Kamu bisa langsung membuka repositori GitHub tersebut untuk membaca peta belajar lengkap, diagram arsitektur, dan studi kasus interview dari awal sampai akhir:',
      highlights: [
        '6 Modul Lengkap yang membahas Jaringan, Database, Arsitektur Terdistribusi, Resiliency, Keamanan, dan Perhitungan Kapasitas',
        '5 Studi Kasus End-to-End: URL Shortener (Bitly), WhatsApp Chat, Twitter/X Newsfeed, Netflix Video Streaming, dan Layanan Ride-Hailing (Uber/Gojek)',
        '30+ Diagram Arsitektur Visual (.excalidraw) & Cheat Sheet Persiapan Interview',
      ],
    },
  },
];

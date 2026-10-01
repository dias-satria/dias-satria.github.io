var LV = ['Konsep', 'Validasi Awal', 'Berkembang', 'Operasional', 'Siap Komersial'];
var DIMS = [
  { code: 'D1', name: 'Problem–Market Fit', q: 'Apakah inovasi Anda mampu menyelesaikan masalah nyata yang dihadapi petani atau pelaku usaha pertanian?', d: [
    'Belum ada validasi lapangan. Masalah pertanian yang dimaksud masih berasal dari asumsi.',
    'Telah dilakukan wawancara dengan 1–5 petani dan menemukan adanya masalah.',
    'Telah dilakukan wawancara dengan 5+ petani, mengonfirmasi masalah, dan meminta pendapat mereka tentang produk.',
    'Melakukan uji coba produk pada minimum 3 lokasi atau kelompok tani.',
    'Petani bersedia untuk membeli produk.'] },
  { code: 'D2', name: 'Kelayakan Segmen Target', q: 'Apakah solusi Anda terjangkau dan mudah diterapkan oleh segmen target Anda?', d: [
    'Belum ada penetapan harga dan belum ada analisis daya beli target.',
    'Telah ada estimasi harga awal, tapi belum dikaitkan dengan pendapatan target.',
    'Telah ada diskusi tentang willingness-to-pay dan harga telah ditetapkan, namun belum ada alternatif model pembayaran.',
    'Harga dan model pembayaran telah ditentukan, serta diujicobakan ke 5+ pengguna target.',
    'Harga dan model pembayaran telah diterapkan, dan sudah ada pengguna target yang bertransaksi.'] },
  { code: 'D3', name: 'Unit Ekonomi', q: 'Sejauh mana manfaat ekonomi atau ROI dari inovasi Anda telah dibuktikan?', d: [
    'Klaim manfaat masih berupa fitur teknis (IoT, AI, sensor); belum ada data manfaat.',
    'Klaim manfaat divalidasi dari literatur, tapi belum ada uji coba lapang.',
    'Uji coba lapang dilakukan, namun belum ada objek kontrol.',
    'Ada bukti dampak positif di 1–5 pengguna/lokasi dengan perbandingan sebelum-sesudah. ROI dapat dihitung.',
    'Bukti dampak positif di 5+ pengguna/lokasi, terdokumentasi, dan ROI dapat dijelaskan ke pengguna dengan kalimat sederhana.'] },
  { code: 'D4', name: 'Kelayakan Adopsi', q: 'Apakah inovasi Anda dapat diterapkan dalam kegiatan sehari-hari pengguna tanpa perubahan besar pada cara kerja mereka?', d: [
    'Belum ada analisis alur kerja pengguna. Semua dirancang dari perspektif inovator.',
    'Analisis alur kerja pengguna sudah ada, tapi belum diuji secara lapang.',
    'Analisis alur kerja ada dan telah diuji lapang pada 1–5 pengguna.',
    'Pengguna bisa mengoperasikan produk secara mandiri setelah 1–2 kali pelatihan.',
    'Pengguna telah mengadopsi inovasi secara sukarela, aktif, dan konsisten. Adoption rate >70%.'] },
  { code: 'D5', name: 'Kelayakan Model Bisnis', q: 'Siapa pelanggan yang membayar inovasi Anda, bagaimana mekanisme pembayarannya, dan apakah model tersebut layak dijalankan?', d: [
    'Model bisnis belum ditentukan. Belum ada pemisahan antara User dan Payer.',
    'Ada rencana revenue stream, tetapi belum jelas siapa pengambil keputusan pembelian.',
    'Payer konkret telah teridentifikasi. Ada percakapan awal, namun belum ada komitmen.',
    '1–3 payer sudah membayar (meski harga pilot). Model berjalan reguler (>1 kali).',
    'Multiple payer aktif membayar harga komersial penuh. Revenue stream dapat diprediksi.'] },
  { code: 'D6', name: 'Kejelasan Proposisi Nilai', q: 'Apakah manfaat inovasi Anda memberikan nilai yang lebih besar dibandingkan biaya adopsinya dalam satu siklus pemakaian?', d: [
    'Belum ada perhitungan biaya per pengguna; manfaat vs biaya belum diketahui.',
    'Ada estimasi manfaat vs biaya, tapi belum dari data nyata lapangan.',
    'Ada perhitungan awal accounting profit (hasil − biaya) dari 1–5 pengguna.',
    'Perhitungan accounting profit dari 5+ pengguna, data dari >2 siklus.',
    'Data 10+ pengguna menunjukkan economic profit yang positif & konsisten selama >2 siklus.'] },
  { code: 'D7', name: 'Kesiapan Saluran Distribusi', q: 'Apakah Anda telah memiliki mitra atau saluran distribusi yang menjangkau target Anda secara efektif?', d: [
    'Belum ada rencana distribusi. Pengguna diasumsikan akan datang sendiri.',
    'Ada daftar calon saluran distribusi, tetapi belum ada pertemuan atau diskusi awal.',
    'Ada diskusi awal dengan 1–2 saluran distribusi yang menunjukkan minat, tetapi belum ada komitmen.',
    '1 saluran distribusi telah aktif menyalurkan produk. Ada kesepakatan informal/MoU.',
    '2+ saluran distribusi aktif menyalurkan produk, dengan kesepakatan formal.'] },
  { code: 'D8', name: 'Kesiapan Kemitraan Ekosistem', q: 'Sejauh mana mitra strategis yang diperlukan untuk mendukung pengembangan dan komersialisasi inovasi telah terlibat?', d: [
    'Belum ada identifikasi mitra. Fokus 100% pada teknologi.',
    'Ada daftar mitra potensial, tapi belum ada kontak aktif.',
    'Ada pertemuan awal dengan 2–3 mitra. Ada minat, belum ada komitmen formal.',
    '1–2 mitra berkontribusi nyata: akses pengguna, data, atau validasi teknis.',
    'Jaringan mitra aktif (minimal 3 dari: universitas/lembaga riset, koperasi/komunitas, integrator, lembaga keuangan, pemerintah daerah).'] },
  { code: 'D9', name: 'Kapasitas Tim Eksekusi', q: 'Apakah tim Anda mempunyai kemampuan teknis, lapangan, dan komersial?', d: [
    'Tim hanya terdiri dari 1 orang tanpa keahlian khusus.',
    'Tim terdiri dari 2–3 orang, namun belum mewakili ketiga aspek: teknis, lapangan, komersial.',
    'Tim mewakili ketiga aspek keahlian, tapi ada anggota yang merangkap tugas.',
    'Tim mewakili ketiga aspek keahlian dan tidak ada yang merangkap tugas.',
    'Tim mempunyai rekam jejak baik dan sudah menyelesaikan siklus validasi.'] },
  { code: 'D10', name: 'Kesiapan Strategi Data', q: 'Apakah telah ada rencana yang jelas untuk mengumpulkan, menggunakan, dan melindungi data?', d: [
    'Tidak ada rencana pengumpulan data. Data dianggap by-product, bukan aset.',
    'Ada rencana pengumpulan data, tetapi belum diimplementasikan. Belum ada sistem penyimpanan.',
    'Data pilot telah dikumpulkan di spreadsheet. Ada kesadaran privasi, namun belum ada kebijakan.',
    'Telah ada sistem penyimpanan terstruktur. Data dipakai untuk perbaikan produk berkala.',
    'Kebijakan data formal tersedia & dipahami pengguna. Data dipakai untuk produk, bukti, dan mitra.'] }
];
var LEVELS = [
  { min: 10, max: 20, name: 'Eksplorasi', act: 'Validasi masalah & temukan payer sebelum mengembangkan produk.' },
  { min: 21, max: 30, name: 'Pembangunan', act: 'Iterasi produk, bangun mitra. Prioritaskan dimensi dengan skor ≤2.' },
  { min: 31, max: 40, name: 'Akselerasi', act: 'Siap pilot formal. Rancang scaling & formalkan kemitraan.' },
  { min: 41, max: 45, name: 'Komersialisasi', act: 'Optimalkan unit economics & perluas saluran distribusi.' },
  { min: 46, max: 50, name: 'Siap Scale', act: 'Bukti kuat. Fokus retensi, jaringan, dan diversifikasi pasar.' }
];

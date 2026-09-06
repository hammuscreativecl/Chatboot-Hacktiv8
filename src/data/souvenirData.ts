import { PackagingOption, SouvenirItem, StoreConfig } from '../types';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Kencana Souvenir & Craft',
  tagline: 'Spesialis Souvenir Pernikahan, Kantor & Event Berkualitas',
  whatsappNumber: '6281234567890',
  city: 'Yogyakarta & Melayani Kirim Seluruh Indonesia',
  minOrderPolicy: 'Minimal order 50 pcs (beberapa item 30 pcs)',
  dpPercent: 50,
  guaranteePolicy: 'Garansi 100% ganti baru jika ada barang cacat atau rusak saat pengiriman.',
  operatingHours: 'Senin - Sabtu: 08.00 - 21.00 WIB (Chatbot AI 24 Jam)',
  promoText: 'Diskon 5% untuk order ≥ 200 pcs, Diskon 10% untuk order ≥ 500 pcs. Gratis Thank You Card!'
};

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: 'plastik-pita',
    name: 'Plastik OPP + Pita Satin & Thank You Tag',
    extraPrice: 0,
    description: 'Kemasan standar rapi, ekonomis, sudah termasuk pita warna pilihan dan kartu ucapan.'
  },
  {
    id: 'box-kraft',
    name: 'Box Kraft Rustic + Tali Goni & Dried Flower',
    extraPrice: 2000,
    description: 'Nuansa alam estetik rustic dengan tali rami dan aksen bunga kering manis.'
  },
  {
    id: 'mika-eksklusif',
    name: 'Mika Transparan Tebal + Pita Emas',
    extraPrice: 2500,
    description: 'Tampilan premium mengkilap, produk terlihat jelas dan sangat mewah.'
  },
  {
    id: 'tile-emas',
    name: 'Kantung Tile Jaring Warna Emas / Silver',
    extraPrice: 1500,
    description: 'Kantung serut kain tile berkilau, praktis dan elegan untuk pesta.'
  },
  {
    id: 'hardbox-gift',
    name: 'Exclusive Hardbox Full Colour + Emboss Logo',
    extraPrice: 7500,
    description: 'Khusus souvenir VIP / Corporate event dengan logo hot print emas/perak.'
  }
];

export const SOUVENIR_PRODUCTS: SouvenirItem[] = [
  {
    id: 'souv-1',
    name: 'Tumbler Stainless LED Suhu Custom Grafir',
    category: 'pernikahan',
    price: 28000,
    minOrder: 50,
    leadTimeDays: 7,
    description: 'Tumbler termos tahan panas/dingin 12 jam dengan display suhu digital. Custom grafir laser nama mempelai atau logo perusahaan.',
    material: 'Stainless Steel SUS 304 Food Grade',
    popular: true,
    badge: 'Terlaris Pernikahan',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    dimensions: '500ml, Tinggi 22.5cm x Diameter 6.5cm',
    includes: ['Grafir laser 1 sisi nama/logo', 'Baterai sensor suhu tahan 500 hari', 'Pilihan warna hitam/putih/navy/gold']
  },
  {
    id: 'souv-2',
    name: 'Pouch Kanvas Premium Sablon Gold / Sablon Minimalis',
    category: 'pernikahan',
    price: 9500,
    minOrder: 100,
    leadTimeDays: 8,
    description: 'Pouch serbaguna bahan kanvas tebal dengan resleting YKK awet. Cocok untuk makeup, perlengkapan mandi, atau alat tulis.',
    material: 'Kanvas Twill Grade A + Zipper Vintage',
    popular: true,
    badge: 'Favorit Hemat',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
    dimensions: '20cm x 13cm x 4cm',
    includes: ['Sablon 1 warna (Gold/Silver/Hitam)', 'Free design font nama', 'Packaging plastik + pita']
  },
  {
    id: 'souv-3',
    name: 'Lilin Aromaterapi Scented Candle Glass Jar',
    category: 'pernikahan',
    price: 12500,
    minOrder: 50,
    leadTimeDays: 7,
    description: 'Lilin wangi alami berbahan 100% soy wax ramah lingkungan. Aroma menenangkan Lavender, Vanilla, Jasmine, atau Sandalwood.',
    material: 'Natural Soy Wax + Botol Kaca Amber + Tutup Kayu',
    popular: true,
    badge: 'Estetik Rustic',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
    dimensions: '60ml, Tinggi 6cm x Diameter 5cm',
    includes: ['Custom stiker label kraft/vinyl', 'Wangi tahan 15 jam pembakaran', 'Thanks card custom']
  },
  {
    id: 'souv-4',
    name: 'Cutlery Set Kayu Mahoni (Sendok + Garpu + Sumpit)',
    category: 'pernikahan',
    price: 8500,
    minOrder: 100,
    leadTimeDays: 7,
    description: 'Set alat makan ramah lingkungan halus dan food grade. Dikemas dalam pouch blacu tali serut atau mika cantik.',
    material: 'Kayu Mahoni Asli Food Grade (Beeswax Polish)',
    popular: false,
    badge: 'Eco-Friendly',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Panjang sendok/garpu 18cm, sumpit 20cm',
    includes: ['Grafir inisial di gagang sendok', 'Pouch blacu serut', 'Kartu ucapan terima kasih']
  },
  {
    id: 'souv-5',
    name: 'Cermin Lipat Kayu Grafir Laser Estetik',
    category: 'pernikahan',
    price: 7000,
    minOrder: 100,
    leadTimeDays: 6,
    description: 'Cermin saku elegan dengan cover kayu alami. Praktis dibawa di dalam tas dan sangat fungsional untuk tamu undangan.',
    material: 'Kayu MDF Lapis Jati + Cermin Kaca Bening',
    popular: false,
    badge: 'Best Budget',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Diameter 7cm, Tebal 0.8cm',
    includes: ['Grafir laser nama & tanggal', 'Plastik seal rapi + pita', 'Thanks card']
  },
  {
    id: 'souv-6',
    name: 'Cardholder Kulit Sintetis Vintage Emboss / Grafir',
    category: 'corporate',
    price: 15000,
    minOrder: 50,
    leadTimeDays: 9,
    description: 'Dompet kartu 6 slot + slot uang tunai. Jahitan rapi, bahan kulit sintetis premium tebal tidak mudah mengelupas.',
    material: 'PU Leather Vintage Grade Super',
    popular: true,
    badge: 'Corporate Favorit',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    dimensions: '10.5cm x 8cm',
    includes: ['Emboss logo atau grafir nama', 'Packaging box kraft cokelat', 'Pilihan warna Cokelat Tua, Tan, Hitam']
  },
  {
    id: 'souv-7',
    name: 'Agenda Kulit Hardcover + Pen Logam Exclusive',
    category: 'corporate',
    price: 35000,
    minOrder: 30,
    leadTimeDays: 10,
    description: 'Buku catatan agenda kantor premium dengan magnet lock dan slot pulpen. Sangat berkelas untuk seminar & souvenir instansi.',
    material: 'Cover Faux Leather + Kertas Bookpaper 80gsm 100 lembar',
    popular: false,
    badge: 'Executive VIP',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Ukuran A5 (14.8cm x 21cm)',
    includes: ['Hot print emas/deboss logo', 'Ballpoint metal laser nama', 'Box gift eksklusif']
  },
  {
    id: 'souv-8',
    name: 'Flashdisk Kayu Putar 16GB + Laser Box Kayu',
    category: 'seminar',
    price: 39000,
    minOrder: 30,
    leadTimeDays: 8,
    description: 'USB Flashdisk original chipset berkecepatan tinggi dengan casing kayu maple natural dan box penyimpanan kayu ukir.',
    material: 'Kayu Maple Alami + USB 3.0 Real Capacity',
    popular: false,
    badge: 'Seminar Tech',
    image: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Flashdisk 6cm x 2cm, Box 8cm x 5cm',
    includes: ['Grafir laser pada flashdisk & tutup box', 'Garansi chipset 1 tahun', 'Packing bubble aman']
  },
  {
    id: 'souv-9',
    name: 'Tote Bag Blacu Sablon Full Colour 30x40cm',
    category: 'seminar',
    price: 13500,
    minOrder: 50,
    leadTimeDays: 7,
    description: 'Tote bag kain blacu tebal berserat rapat dengan tali webing kuat. Muat laptop 14 inch, map seminar, dan dokumen.',
    material: 'Kain Blacu Super Grade A',
    popular: true,
    badge: 'Seminar Kit Populer',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
    dimensions: '30cm x 40cm, Tali 60cm',
    includes: ['Sablon cetak DTF full colour A4', 'Jahitan double obras kuat', 'Kemasan plastik per pcs']
  },
  {
    id: 'souv-10',
    name: 'Mug Keramik Coating Putih Custom Sublimasi High-Res',
    category: 'ulang-tahun',
    price: 14500,
    minOrder: 50,
    leadTimeDays: 7,
    description: 'Mug keramik SNI putih mengkilap dengan cetakan foto/desain karakter tahan cuci dan tidak mudah pudar.',
    material: 'Keramik SNI Food Grade (Aman Microwave)',
    popular: true,
    badge: 'Mug Cantik',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Volume 11oz (325ml), Tinggi 9.5cm',
    includes: ['Cetak full colour keliling', 'Free box mika / box putih bergambar', 'Thanks card']
  },
  {
    id: 'souv-11',
    name: 'Handuk Bordir Microfiber 30x30cm Pita & Bunga',
    category: 'ulang-tahun',
    price: 11000,
    minOrder: 50,
    leadTimeDays: 6,
    description: 'Handuk lembut berdaya serap tinggi dibentuk menyerupai roll cake atau diikat pita manis. Banyak pilihan warna pastel.',
    material: 'Microfiber Coral Fleece Lembut & Cepat Kering',
    popular: false,
    badge: 'Imut & Lucu',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=80',
    dimensions: 'Ukuran terbuka 30cm x 30cm',
    includes: ['Bordir nama 1 baris', 'Hiasan pita + bunga artificial', 'Kemasan mika tabung/box']
  },
  {
    id: 'souv-12',
    name: 'Gantungan Kunci Kulit Custom Grafir / Emboss',
    category: 'corporate',
    price: 5000,
    minOrder: 100,
    leadTimeDays: 5,
    description: 'Gantungan kunci kulit sintetis dengan ring logam anti karat. Ringkas, awet, dan sangat ramah kantong.',
    material: 'Kulit Sintetis + Ring Besi Nikel Tebal',
    popular: false,
    badge: 'Super Hemat',
    image: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=500&auto=format&fit=crop&q=80',
    dimensions: '9cm x 2.2cm',
    includes: ['Laser nama / logo 1 sisi', 'Ring gantungan tebal', 'Plastik kemasan']
  }
];

export const FREQUENT_QUESTIONS = [
  'Apa itu GEMINI API?',
  'Berapa minimal order (MOQ) dan berapa lama pengerjaannya?',
  'Bisa rekomendasi souvenir pernikahan budget di bawah Rp 10.000 / pcs?',
  'Apakah bisa custom nama pengantin, tanggal acara, & logo instansi?',
  'Bagaimana sistem pembayarannya dan apakah bisa kirim ke luar kota?',
];

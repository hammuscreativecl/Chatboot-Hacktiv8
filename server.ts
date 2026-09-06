import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const GEMINI_MODEL = 'gemini-2.5-flash';

// Middleware according to Hacktiv8 specification (Slides 1, 4, 19)
app.use(cors());
app.use(express.json());

// Initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Souvenir CS Chatbot',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Chat endpoint (Conforms to Hacktiv8 REST API spec & app features)
app.post('/api/chat', async (req, res) => {
  try {
    const { conversation, message, history = [], storeConfig, selectedProduct, catalogSummary } = req.body;

    // Validate input as specified in Slide 5 & Slide 13
    if (conversation !== undefined) {
      if (!Array.isArray(conversation)) {
        throw new Error('Messages must be an array!');
      }
      if (conversation.length === 0) {
        throw new Error('Conversation array cannot be empty!');
      }
    } else if (!message || typeof message !== 'string') {
      throw new Error('Pesan (message) atau conversation wajib diisi!');
    }

    const ai = getAiClient();

    // System instruction (Combining Hacktiv8 "Jawab hanya menggunakan bahasa Indonesia." with CS and General AI capabilities)
    const systemPrompt = `Jawab hanya menggunakan bahasa Indonesia.
Anda adalah asisten AI cerdas berbasis Google Gemini 2.5 Flash yang terintegrasi via REST API Express (Modul Hacktiv8 AI API Integration).
Anda melayani dua fungsi utama:
1. Jika pengguna bertanya tentang Gemini API, REST API, Express JS, prompt engineering, atau materi Hacktiv8, berikan penjelasan teknis yang akurat, mudah dipahami, dan terstruktur.
2. Jika pengguna bertanya seputar konsultasi produk souvenir, harga, pesanan, wedding, seminar kantor, atau toko "${storeConfig?.storeName || 'Kencana Souvenir & Craft'}", gunakan identitas CS Kencana yang ramah dan gunakan data profil toko berikut:

Profil Toko & Ketentuan:
- Tagline: ${storeConfig?.tagline || 'Spesialis Souvenir Pernikahan, Kantor & Event Berkualitas'}
- Lokasi & Pengiriman: ${storeConfig?.city || 'Yogyakarta, melayani kirim ke seluruh Indonesia'}
- Minimal Pemesanan (MOQ): ${storeConfig?.minOrderPolicy || 'Rata-rata 50-100 pcs per item tergantung jenis produk'}
- Diskon Grosir: Diskon 5% untuk order ≥ 200 pcs, Diskon 10% untuk order ≥ 500 pcs. Free Thank You Card & Pita!
- Estimasi Pengerjaan: Rata-rata 6-10 hari kerja. Melayani pesanan kilat jika slot tersedia.
- Katalog Produk:
${catalogSummary || `1. Tumbler Stainless LED Suhu Custom Grafir (Rp 28.000, MOQ 50 pcs)
2. Pouch Kanvas Premium Sablon Gold (Rp 9.500, MOQ 100 pcs)
3. Lilin Aromaterapi Scented Glass Jar (Rp 12.500, MOQ 50 pcs)
4. Cutlery Set Kayu Mahoni (Rp 8.500, MOQ 100 pcs)
5. Cermin Lipat Kayu Grafir Laser (Rp 7.000, MOQ 100 pcs)
6. Cardholder Kulit Sintetis Vintage (Rp 15.000, MOQ 50 pcs)
7. Agenda Kulit Hardcover + Pen Exclusive (Rp 35.000, MOQ 30 pcs)
8. Flashdisk Kayu Putar 16GB (Rp 39.000, MOQ 30 pcs)
9. Tote Bag Blacu Sablon Full Colour (Rp 13.500, MOQ 50 pcs)
10. Mug Keramik Sublimasi SNI (Rp 14.500, MOQ 50 pcs)
11. Handuk Bordir Microfiber Pita (Rp 11.000, MOQ 50 pcs)
12. Gantungan Kunci Kulit Custom Grafir (Rp 5.000, MOQ 100 pcs)`}
${selectedProduct ? `Catatan: Saat ini customer sedang melihat produk spesifik: "${selectedProduct.name}" (Rp ${selectedProduct.price.toLocaleString('id-ID')}).` : ''}

Panduan Gaya Bicara:
- Gunakan bahasa Indonesia yang santun, ramah, dan solutif.
- Susun jawaban dengan rapi menggunakan bullet points agar nyaman dibaca.`;

    let replyText = '';

    if (ai) {
      try {
        // Format conversation into Gemini parts as specified in Slide 5:
        // const contents = conversation.map(({ role, text }) => ({ role, parts: [{ text }] }))
        let formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(conversation)) {
          formattedContents = conversation.map((msg: any) => {
            const role = (msg.role === 'model' || msg.role === 'assistant') ? 'model' : 'user';
            const textContent = typeof msg.text === 'string' ? msg.text : (msg.content || '');
            return {
              role: role as 'user' | 'model',
              parts: [{ text: textContent }],
            };
          });
        } else {
          // Fallback if client passed message + history
          const recentHistory = history.slice(-8);
          for (const item of recentHistory) {
            const role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
            formattedContents.push({
              role: role as 'user' | 'model',
              parts: [{ text: item.content || item.text || '' }],
            });
          }
          formattedContents.push({
            role: 'user',
            parts: [{ text: message }],
          });
        }

        // Call Gemini API with GEMINI_MODEL ("gemini-2.5-flash") as specified in Hacktiv8 slides
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: formattedContents,
          config: {
            temperature: 0.9,
            systemInstruction: systemPrompt,
          },
        });

        replyText = response.text || '';
      } catch (geminiError: any) {
        console.error('Gemini API execution error (model ' + GEMINI_MODEL + '):', geminiError);
        // If specific model error occurs, try fallback or fallback generator
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message || (conversation && conversation[conversation.length - 1]?.text) || 'Halo' }] }],
            config: {
              temperature: 0.9,
              systemInstruction: systemPrompt,
            },
          });
          replyText = fallbackResponse.text || '';
        } catch (innerError) {
          console.error('Gemini fallback attempt error:', innerError);
        }
      }
    }

    // Contextual fallback response if Gemini returns empty or API key missing
    if (!replyText) {
      const userPrompt = message || (conversation && conversation[conversation.length - 1]?.text) || '';
      replyText = generateFallbackCSResponse(userPrompt, selectedProduct, storeConfig);
    }

    // Return response adhering strictly to Slide 5 & 13 { result: response.text }
    // Also include 'reply' for backward compatibility
    res.status(200).json({
      result: replyText,
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error('Chat endpoint error:', e);
    // Slide 5 error response: res.status(500).json({ error: e.message })
    res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
});

// Fallback response engine tailored for Indonesian Souvenir Customer Service & Hacktiv8 Gemini queries
function generateFallbackCSResponse(msg: string, selectedProduct: any, storeConfig: any): string {
  const lower = msg.toLowerCase();
  const storeName = storeConfig?.storeName || 'Kencana Souvenir & Craft';

  if (lower.includes('gemini') || lower.includes('api') || lower.includes('hacktiv8') || lower.includes('rest')) {
    return `**Gemini API** adalah application programming interface resmi dari Google yang memungkinkan developer mengakses model AI canggih seperti **gemini-2.5-flash** secara programatik.

Dalam modul Hacktiv8 (AI API Integration):
1. **Model**: Menggunakan \`gemini-2.5-flash\` dengan temperature 0.9.
2. **REST API**: Backend Express mengekspos endpoint \`POST /api/chat\` yang menerima payload \`{ conversation: [{ role, text }] }\`.
3. **Format Response**: Mengembalikan objek JSON \`{ result: response.text }\` dengan HTTP status 200 OK.
4. **Client Interface**: Form chat interaktif dengan penanganan loading state *"Gemini is thinking..."*.

Ada hal spesifik tentang implementasi REST API atau Gemini yang ingin Anda diskusikan?`;
  }

  if (selectedProduct && (lower.includes('ini') || lower.includes('produk') || lower.includes('harga') || lower.includes('pesan'))) {
    return `Halo Kak! Senang sekali Kakak tertarik dengan **${selectedProduct.name}** ✨

Berikut ringkasan informasinya:
- **Harga Unit**: Rp ${selectedProduct.price.toLocaleString('id-ID')} / pcs
- **Minimal Pemesanan (MOQ)**: ${selectedProduct.minOrder} pcs
- **Estimasi Pengerjaan**: ${selectedProduct.leadTimeDays} - 10 hari kerja
- **Bahan**: ${selectedProduct.material}
- **Sudah Termasuk**: Free custom nama / grafir laser & thank you card!

Kakak berencana pesan untuk acara apa dan berapa banyak estimasi jumlah tamunya? Kami bisa bantu buatkan simulasi total biayanya lho Kak 😊`;
  }

  if (lower.includes('budget') || lower.includes('murah') || lower.includes('10rb') || lower.includes('10.000') || lower.includes('rekomendasi')) {
    return `Halo Kak! Tentu, kami punya beberapa rekomendasi souvenir terlaris dengan budget hemat dan tetap berkesan mewah di bawah Rp 10.000/pcs:

1. **Gantungan Kunci Kulit Custom Grafir** (Rp 5.000 / pcs) - Sangat hemat, awet, dan minimalis.
2. **Cermin Lipat Kayu Grafir Laser** (Rp 7.000 / pcs) - Estetik rustic, disukai para tamu wanita.
3. **Cutlery Set Kayu Mahoni** (Rp 8.500 / pcs) - Eco-friendly, bermanfaat tinggi untuk sehari-hari.
4. **Pouch Kanvas Premium Sablon** (Rp 9.500 / pcs) - Fungsional, muat make up / gadget.

Semua harga sudah termasuk custom grafir / sablon nama & kemasan rapi ya Kak. Ada produk yang paling cocok dengan selera Kakak?`;
  }

  if (lower.includes('minimal') || lower.includes('moq') || lower.includes('berapa')) {
    return `Halo Kak! Untuk minimal pemesanan (MOQ) di ${storeName}:

- Rata-rata produk souvenir: **50 pcs** hingga **100 pcs** (seperti Pouch, Mug, Cutlery Set).
- Untuk produk premium seminar (Agenda Kulit, Flashdisk Kayu): minimal hanya **30 pcs**.

Jika Kakak memesan dalam jumlah besar:
✨ **Diskon 5%** untuk pemesanan ≥ 200 pcs
✨ **Diskon 10%** untuk pemesanan ≥ 500 pcs
✨ **Free Desain Mock Up** & Kartu Ucapan custom tanpa biaya tambahan!

Kira-kira Kakak butuh souvenir untuk berapa pcs tamu undangan?`;
  }

  if (lower.includes('kirim') || lower.includes('ongkir') || lower.includes('luar kota') || lower.includes('ekspedisi')) {
    return `Halo Kak! Betul sekali, kami melayani pengiriman ke **seluruh wilayah Indonesia** 🇮🇩

Kami bekerja sama dengan ekspedisi cargo terpercaya (JNE Trucking/JTR, Indah Logistik Cargo, Dakota Cargo, Baraka Express) sehingga ongkir jauh lebih hemat untuk paket souvenir yang bervolume/berbobot besar.

Setiap paket dipacking dengan:
- Lapisan bubble wrap tebal
- Kardus dobel gelombang
- Opsi packing kayu untuk barang pecah belah (Mug / Jar Lilin Kaca)
- **Garansi 100% Ganti Baru** jika ada barang yang rusak/pecah di jalan.

Pengiriman rencananya ditujukan ke kota/kecamatan mana Kak? Kami bisa bantu cek estimasi ongkirnya!`;
  }

  if (lower.includes('bayar') || lower.includes('dp') || lower.includes('cara pesan') || lower.includes('alur')) {
    return `Halo Kak! Alur pemesanan di ${storeName} sangat mudah & aman:

1. **Konsultasi & Pilih Produk**: Tentukan produk souvenir, jumlah pcs, dan jenis packaging.
2. **Desain Mockup Gratis**: Kirimkan nama mempelai, tanggal acara, atau logo perusahaan. Desainer kami akan buatkan preview digital hingga disetujui (ACC).
3. **Pembayaran DP 50%**: Pembayaran awal untuk mengunci slot produksi dan proses pengerjaan.
4. **Proses Produksi**: Waktu pengerjaan sekitar 7-10 hari kerja (kami infokan progresnya secara berkala).
5. **Quality Control & Packing**: Kami fotokan hasil jadi souvenir sebelum dikirim.
6. **Pelunasan & Pengiriman**: Pelunasan sisa 50% + ongkir saat pesanan siap meluncur ke alamat Kakak.

Apakah desain nama atau logonya sudah siap dikonsultasikan Kak?`;
  }

  if (lower.includes('sampel') || lower.includes('sample') || lower.includes('contoh')) {
    return `Halo Kak! Bisa banget Kak 😊 Kami sangat memahami Kakak ingin melihat kualitas bahan, kerapian sablon/grafir secara langsung sebelum order masal.

Kami menyediakan opsi **Pemesanan Paket Sampel Fisik**:
- Kakak bisa memesan 1-2 pcs sampel produk yang diminati.
- Sampel dikirimkan dalam 1-2 hari via ekspedisi reguler.
- Biaya sampel ini nantinya dapat dipotongkan ke total tagihan saat Kakak fix melakukan pemesanan masal!

Silakan hubungi admin kami via WhatsApp untuk request sampel ya Kak!`;
  }

  return `Halo Kak! Terima kasih sudah menghubungi CS ${storeName} 🙏

Ada yang bisa kami bantu seputar kebutuhan souvenir Kakak? Kami siap membantu konsultasi:
1. **Rekomendasi Produk & Katalog Terlaris** (Tumbler, Pouch, Lilin Aromaterapi, Cutlery Set, dll)
2. **Penyesuaian dengan Budget Acara** (Mulai Rp 5.000-an / pcs)
3. **Cek Minimal Order (MOQ) & Waktu Pengerjaan**
4. **Hitung Simulasi Total Biaya & Diskon Grosir**
5. **Request Custom Desain & Sampel Fisik**

Boleh ceritakan souvenirnya untuk acara apa dan perkiraan tanggal acaranya kapan Kak?`;
}

// Serve public folder and vanilla frontend as specified in Slide 10 & 19
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.get('/vanilla', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'vanilla.html'));
});

// Start Server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Souvenir CS Chatbot server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

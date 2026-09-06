import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuotationModal } from './components/QuotationModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { DEFAULT_STORE_CONFIG, SOUVENIR_PRODUCTS } from './data/souvenirData';
import { ChatMessage, QuotationSummary, SouvenirItem, StoreConfig } from './types';

export default function App() {
  // Store settings state with localStorage persistence
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('souvenir_store_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load store config:', e);
    }
    return DEFAULT_STORE_CONFIG;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'chat' | 'catalog' | 'quotation'>('chat');

  // Modals state
  const [detailProduct, setDetailProduct] = useState<SouvenirItem | null>(null);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quotationInitialProduct, setQuotationInitialProduct] = useState<SouvenirItem | null>(null);

  // Active product context in chat
  const [activeProductContext, setActiveProductContext] = useState<SouvenirItem | null>(null);

  // Initial welcome message from CS Mbak Kencana
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Halo Kak! Selamat datang di **${storeConfig.storeName}** 🙏✨

Saya **Mbak Kencana**, Customer Service (CS) yang siap membantu Kakak menemukan souvenir terbaik untuk acara istimewa Kakak:
• **Pernikahan (Wedding)**: Tumbler Suhu LED, Pouch Kanvas, Lilin Aromaterapi, Cutlery Kayu, Cermin Lipat.
• **Kantor & Corporate**: Cardholder Kulit, Agenda Hardcover + Pen Logam, Flashdisk Kayu, Totebag Blacu.
• **Ulang Tahun & Event**: Mug Keramik SNI, Handuk Bordir, Gantungan Kunci Kulit.

Semua produk kami sudah termasuk **Free Desain Custom Nama / Logo & Thank You Card** lho Kak! 🎁

Ada yang bisa kami bantu? Boleh beri tahu kami rencana jumlah tamu, budget yang diinginkan, atau jenis souvenir yang sedang Kakak cari?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Save store config changes to localStorage
  const handleSaveConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    try {
      localStorage.setItem('souvenir_store_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  };

  // Send message to CS Chatbot
  const handleSendMessage = async (
    text: string,
    attachedProduct?: SouvenirItem,
    quotationData?: QuotationSummary
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeStr,
      attachedProduct: attachedProduct || activeProductContext || undefined,
      quotationData,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build catalog summary for the AI prompt
      const catalogSummary = SOUVENIR_PRODUCTS.map(
        (p, idx) =>
          `${idx + 1}. ${p.name} (Harga: Rp ${p.price.toLocaleString('id-ID')}, Min. ${p.minOrder} pcs, Kategori: ${p.category}) - ${p.description}`
      ).join('\n');

      // Build conversation array conforming to Hacktiv8 Slide 5, 7, 13
      const conversationPayload = [
        ...messages.slice(-8).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.content,
        })),
        { role: 'user', text },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: conversationPayload,
          message: text,
          history: messages.slice(-8),
          storeConfig,
          selectedProduct: attachedProduct || activeProductContext,
          catalogSummary,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // Check for property 'result' (Hacktiv8 Slide 15 & 18) with fallback to 'reply'
      const replyContent = (data && (data.result || data.reply)) || 'Sorry, no response received.';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      // Conforming to Hacktiv8 Slide 13 & 18 fallback message while retaining CS helpfulness
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Halo Kak! Maaf respon server mengalami sedikit kendala (Failed to get response from server). CS kami siap membantu Kakak secara manual via WhatsApp resmi kami di nomor **${storeConfig.whatsappNumber}** ya Kak! 😊`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to chat and ask about a product
  const handleAskAboutProduct = (product: SouvenirItem) => {
    setActiveProductContext(product);
    setActiveTab('chat');
    handleSendMessage(
      `Halo CS, saya tertarik dengan produk "${product.name}" (Rp ${product.price.toLocaleString(
        'id-ID'
      )} / pcs). Boleh info detail minimal order, pilihan kemasan, dan estimasi waktu pembuatannya?`,
      product
    );
  };

  // Open quotation calculator for a product
  const handleSimulateProduct = (product: SouvenirItem) => {
    setQuotationInitialProduct(product);
    setIsQuotationOpen(true);
  };

  // Handle quotation submission from calculator to chat
  const handleSendQuotationToChat = (quotation: QuotationSummary, product: SouvenirItem) => {
    setActiveTab('chat');
    setActiveProductContext(product);
    const text = `Halo CS, saya sudah melakukan simulasi pemesanan untuk:
• Produk: ${quotation.productName}
• Jumlah: ${quotation.quantity} pcs
• Kemasan: ${quotation.packagingName}
• Total Estimasi: Rp ${quotation.totalPrice.toLocaleString('id-ID')}

Apakah untuk pesanan ini antrian produksinya masih tersedia untuk bulan depan?`;

    handleSendMessage(text, product, quotation);
  };

  // Clear chat history
  const handleClearChat = () => {
    if (window.confirm('Apakah Kakak ingin memulai percakapan baru dengan CS?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Halo Kak! Percakapan baru telah dimulai. Ada yang bisa kami bantu seputar pesanan souvenir Kakak hari ini? 😊`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setActiveProductContext(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-900">
      {/* Header Navigation */}
      <Header
        storeConfig={storeConfig}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'quotation') {
            setIsQuotationOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6">
        {activeTab === 'chat' && (
          <div className="w-full">
            <ChatView
              messages={messages}
              isLoading={isLoading}
              storeConfig={storeConfig}
              activeProductContext={activeProductContext}
              onClearProductContext={() => setActiveProductContext(null)}
              onSendMessage={(text) => handleSendMessage(text)}
              onClearChat={handleClearChat}
              onOpenProductDetail={(prod) => setDetailProduct(prod)}
              onOpenQuotationForProduct={handleSimulateProduct}
            />
          </div>
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            onSelectProduct={(prod) => setDetailProduct(prod)}
            onAskCS={handleAskAboutProduct}
            onSimulate={handleSimulateProduct}
          />
        )}
      </main>

      {/* Modals */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAskCS={handleAskAboutProduct}
        onSimulate={handleSimulateProduct}
      />

      <QuotationModal
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)}
        storeConfig={storeConfig}
        initialProduct={quotationInitialProduct}
        onSendToChat={handleSendQuotationToChat}
      />

      <StoreSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={storeConfig}
        onSave={handleSaveConfig}
      />
    </div>
  );
}

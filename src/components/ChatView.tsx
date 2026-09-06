import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  User,
  CheckCheck,
  Phone,
} from 'lucide-react';
import { ChatMessage, SouvenirItem, StoreConfig } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  storeConfig: StoreConfig;
  activeProductContext: SouvenirItem | null;
  onClearProductContext: () => void;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onOpenProductDetail: (product: SouvenirItem) => void;
  onOpenQuotationForProduct: (product: SouvenirItem) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  storeConfig,
  activeProductContext,
  onClearProductContext,
  onSendMessage,
  onClearChat,
  onOpenProductDetail,
  onOpenQuotationForProduct,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const msg = inputMessage;
    setInputMessage('');
    onSendMessage(msg);
  };

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  // Markdown-like text formatter for clean bullet points and bolding
  const formatContent = (content: string, isUser: boolean) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className={`font-semibold ${isUser ? 'text-white' : 'text-gray-900'}`}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
            <span className={`font-bold shrink-0 ${isUser ? 'text-emerald-200' : 'text-emerald-600'}`}>•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-0.5">
            <span>{formattedParts}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-0.5">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[76vh] sm:h-[82vh] overflow-hidden">
      {/* Chat Top Bar */}
      <div className="px-5 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          title="Bersihkan Percakapan"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Active Product Context Banner */}
      {activeProductContext && (
        <div className="bg-emerald-50/60 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-gray-600 truncate">
              Fokus Diskusi:{' '}
              <strong className="text-gray-900">{activeProductContext.name}</strong> (Rp{' '}
              {activeProductContext.price.toLocaleString('id-ID')})
            </span>
          </div>
          <button
            onClick={onClearProductContext}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline shrink-0"
          >
            Lepas Fokus
          </button>
        </div>
      )}

      {/* Message Stream (Chat Box adhering to Hacktiv8 ID selector) */}
      <div id="chat-box" className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#F8F9FA]/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`message ${isUser ? 'user' : 'bot'} flex gap-3 max-w-[85%] sm:max-w-[80%] ${
                isUser ? 'self-end flex-row-reverse ml-auto' : 'mr-auto'
              }`}
            >
              {!isUser ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex-shrink-0 flex items-center justify-center text-xs font-medium mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white border border-gray-100 rounded-tl-none text-gray-700'
                }`}
              >
                {/* Quotation Summary Card if present */}
                {msg.quotationData && (
                  <div className="mb-3 bg-gray-50 text-gray-800 rounded-xl p-3.5 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="font-semibold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Rincian Pesanan
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Est. {msg.quotationData.estimatedDays} Hari Kerja
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Produk:</span>
                        <span className="font-medium text-gray-900">{msg.quotationData.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Jumlah:</span>
                        <span className="font-semibold">{msg.quotationData.quantity} pcs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Kemasan:</span>
                        <span className="font-medium text-gray-700">
                          {msg.quotationData.packagingName}
                        </span>
                      </div>
                      {msg.quotationData.discountPercent > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Diskon Grosir ({msg.quotationData.discountPercent}%):</span>
                          <span>- Rp {msg.quotationData.discountAmount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200/60 pt-1.5 flex justify-between items-baseline font-bold text-sm text-gray-900">
                        <span>Total Biaya:</span>
                        <span className="text-emerald-600 text-base">
                          Rp {msg.quotationData.totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/60">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Halo CS ${storeConfig.storeName}, saya ingin pesan souvenir:\n- Produk: ${msg.quotationData.productName}\n- Jumlah: ${msg.quotationData.quantity} pcs\n- Kemasan: ${msg.quotationData.packagingName}\n- Total Estimasi: Rp ${msg.quotationData.totalPrice.toLocaleString('id-ID')}\nMohon info slot produksi & format pengiriman desain nama/logo ya!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Lanjut Pesan ke WhatsApp CS
                      </a>
                    </div>
                  </div>
                )}

                {/* Attached Product Card if present */}
                {msg.attachedProduct && (
                  <div className="mb-3 bg-gray-50 text-gray-800 rounded-xl overflow-hidden border border-gray-100 flex items-center gap-3 p-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={msg.attachedProduct.image}
                        alt={msg.attachedProduct.name}
                        className="h-full w-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate text-gray-900">
                        {msg.attachedProduct.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Harga: Rp {msg.attachedProduct.price.toLocaleString('id-ID')}{' '}
                        <span className="text-[10px] text-gray-400">
                          (Min. {msg.attachedProduct.minOrder} pcs)
                        </span>
                      </p>
                      <div className="flex gap-3 mt-1.5">
                        <button
                          onClick={() => onOpenProductDetail(msg.attachedProduct!)}
                          className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 underline"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Text Content */}
                <div className="space-y-1">{formatContent(msg.content, isUser)}</div>

                {/* Timestamp */}
                <span
                  className={`text-[10px] mt-2 block ${
                    isUser ? 'text-emerald-100 text-right' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator with exact Hacktiv8 text "Gemini is thinking..." */}
        {isLoading && (
          <div className="message bot flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-xs text-xs text-gray-600 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="font-medium text-emerald-700">Gemini is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Form (Adhering to Hacktiv8 IDs: chat-form, user-input, send-button) */}
      <footer className="p-4 sm:p-5 bg-white border-t border-gray-100">
        <form id="chat-form" onSubmit={handleSend} className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              id="user-input"
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan apa saja kepada Gemini 2.5 Flash..."
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
            />
          </div>
          <button
            id="send-button"
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 disabled:opacity-40 font-medium text-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </footer>
    </div>
  );
};

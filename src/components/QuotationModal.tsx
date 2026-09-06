import React, { useState } from 'react';
import { X, Calculator, ArrowRight, MessageSquare, Phone, CheckCircle, Gift, Sparkles } from 'lucide-react';
import { PACKAGING_OPTIONS, SOUVENIR_PRODUCTS } from '../data/souvenirData';
import { QuotationSummary, SouvenirItem, StoreConfig } from '../types';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeConfig: StoreConfig;
  initialProduct?: SouvenirItem | null;
  onSendToChat: (quotation: QuotationSummary, product: SouvenirItem) => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  storeConfig,
  initialProduct,
  onSendToChat,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct ? initialProduct.id : SOUVENIR_PRODUCTS[0].id
  );
  const [quantity, setQuantity] = useState<number>(100);
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>(PACKAGING_OPTIONS[0].id);

  if (!isOpen) return null;

  const currentProduct = SOUVENIR_PRODUCTS.find((p) => p.id === selectedProductId) || SOUVENIR_PRODUCTS[0];
  const currentPackaging = PACKAGING_OPTIONS.find((p) => p.id === selectedPackagingId) || PACKAGING_OPTIONS[0];

  // Calculation rules
  const unitPrice = currentProduct.price;
  const packagingPrice = currentPackaging.extraPrice;
  const basePricePerItem = unitPrice + packagingPrice;
  const subtotal = basePricePerItem * quantity;

  // Bulk discount
  let discountPercent = 0;
  if (quantity >= 500) {
    discountPercent = 10;
  } else if (quantity >= 200) {
    discountPercent = 5;
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalPrice = subtotal - discountAmount;
  const dpAmount = Math.round((totalPrice * storeConfig.dpPercent) / 100);

  const quotationSummary: QuotationSummary = {
    productName: currentProduct.name,
    quantity,
    unitPrice,
    packagingName: currentPackaging.name,
    packagingPrice,
    discountPercent,
    subtotal,
    discountAmount,
    totalPrice,
    estimatedDays: currentProduct.leadTimeDays + (quantity > 300 ? 3 : 0),
  };

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');
  const waText = `Halo CS ${storeConfig.storeName}, saya ingin pesan souvenir dengan rincian berikut:
- Produk: ${currentProduct.name}
- Jumlah: ${quantity} pcs
- Kemasan: ${currentPackaging.name}
- Total Estimasi: Rp ${totalPrice.toLocaleString('id-ID')} (DP ${storeConfig.dpPercent}%: Rp ${dpAmount.toLocaleString('id-ID')})

Mohon info ketersediaan slot antrian produksi & prosedur pengiriman desain mock up. Terima kasih!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Simulasi Biaya & Estimasi Pesanan
              </h3>
              <p className="text-xs text-gray-400">Hitung perkiraan total pesanan secara transparan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Step 1: Choose Product */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              1. Pilih Produk Souvenir
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const prod = SOUVENIR_PRODUCTS.find((p) => p.id === e.target.value);
                if (prod && quantity < prod.minOrder) {
                  setQuantity(prod.minOrder);
                }
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              {SOUVENIR_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} — Rp {prod.price.toLocaleString('id-ID')} (Min. {prod.minOrder} pcs)
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Quantity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                2. Jumlah Pesanan (Pcs)
              </label>
              <span className="text-xs text-emerald-700 font-medium">
                Minimal order: {currentProduct.minOrder} pcs
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={currentProduct.minOrder}
                step={10}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5 shrink-0">
                {[50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      quantity === preset
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Badge */}
            {discountPercent > 0 ? (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Selamat! Anda mendapatkan <strong>Diskon Grosir {discountPercent}%</strong></span>
              </div>
            ) : (
              <p className="mt-1.5 text-[11px] text-gray-400">
                💡 Pesan ≥ 200 pcs hemat 5%, pesan ≥ 500 pcs hemat 10%.
              </p>
            )}
          </div>

          {/* Step 3: Packaging */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              3. Pilihan Packaging & Kemasan
            </label>
            <div className="space-y-2">
              {PACKAGING_OPTIONS.map((pack) => {
                const isSelected = selectedPackagingId === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackagingId(pack.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 block">
                          {pack.name}
                        </span>
                        <span className="text-[11px] text-gray-400 block">
                          {pack.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold shrink-0 text-emerald-700">
                      {pack.extraPrice === 0 ? 'Gratis' : `+Rp ${pack.extraPrice.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculation Summary Card */}
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-sm">
            <div className="flex justify-between text-xs sm:text-sm text-gray-400">
              <span>Produk ({quantity} pcs x Rp {unitPrice.toLocaleString('id-ID')}):</span>
              <span className="text-gray-200">Rp {(unitPrice * quantity).toLocaleString('id-ID')}</span>
            </div>
            {packagingPrice > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                <span>Kemasan (+Rp {packagingPrice.toLocaleString('id-ID')} x {quantity}):</span>
                <span className="text-gray-200">Rp {(packagingPrice * quantity).toLocaleString('id-ID')}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-emerald-400 font-semibold">
                <span>Diskon Grosir ({discountPercent}%):</span>
                <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="border-t border-gray-800 pt-2.5 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block">Total Estimasi Biaya</span>
                <span className="text-xs text-emerald-300 font-medium">
                  DP {storeConfig.dpPercent}%: Rp {dpAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                onSendToChat(quotationSummary, currentProduct);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-medium text-sm rounded-xl transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Tanya ke Chatbot CS
            </button>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              <Phone className="w-4 h-4" />
              Pesan Langsung via WA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

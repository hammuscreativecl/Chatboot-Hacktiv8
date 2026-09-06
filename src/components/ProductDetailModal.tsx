import React from 'react';
import { X, Check, Clock, PackageCheck, MessageCircle, Calculator, ShieldCheck } from 'lucide-react';
import { SouvenirItem } from '../types';

interface ProductDetailModalProps {
  product: SouvenirItem | null;
  onClose: () => void;
  onAskCS: (product: SouvenirItem) => void;
  onSimulate: (product: SouvenirItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAskCS,
  onSimulate,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">
        {/* Header */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 sm:h-72 object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {product.badge && (
            <span className="absolute bottom-4 left-4 bg-emerald-600 text-white font-medium text-xs px-3 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
                Kategori: {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                {product.name}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">Harga Mulai</span>
              <span className="text-2xl font-bold text-emerald-600">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-gray-400 block">/ pcs</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {/* Quick Details Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block">Minimal Order</span>
              <span className="font-semibold text-gray-800 text-sm flex items-center gap-1.5 mt-0.5">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                {product.minOrder} pcs
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block">Waktu Pengerjaan</span>
              <span className="font-semibold text-gray-800 text-sm flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                ± {product.leadTimeDays} Hari Kerja
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
              <span className="text-xs text-gray-400 block">Garansi Kualitas</span>
              <span className="font-semibold text-gray-800 text-sm flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Ganti Baru
              </span>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/70 text-sm space-y-2">
            <div>
              <span className="font-semibold text-gray-800">Bahan Material: </span>
              <span className="text-gray-700">{product.material}</span>
            </div>
            {product.dimensions && (
              <div>
                <span className="font-semibold text-gray-800">Dimensi / Ukuran: </span>
                <span className="text-gray-700">{product.dimensions}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-800 block mb-1">Sudah Termasuk (Free):</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-gray-700">
                {product.includes.map((inc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3">
            <button
              onClick={() => {
                onAskCS(product);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya CS Mengenai Produk Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

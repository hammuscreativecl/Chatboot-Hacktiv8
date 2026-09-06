import React, { useState } from 'react';
import { X, Save, RotateCcw, Building2, Phone, MapPin, Clock, ShieldCheck, Tag } from 'lucide-react';
import { StoreConfig } from '../types';
import { DEFAULT_STORE_CONFIG } from '../data/souvenirData';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onSave: (newConfig: StoreConfig) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [form, setForm] = useState<StoreConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    setForm(DEFAULT_STORE_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Pengaturan Profil Toko & CS
              </h3>
              <p className="text-xs text-gray-400">Sesuaikan informasi bisnis yang digunakan oleh Chatbot CS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nama Brand / Toko Souvenir
            </label>
            <input
              type="text"
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Nomor WhatsApp CS (Internasional/Awalan 62)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Persentase DP Awal (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.dpPercent}
                onChange={(e) => setForm({ ...form, dpPercent: parseInt(e.target.value) || 50 })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Lokasi Toko & Area Layanan
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Jam Operasional CS Manual
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={form.operatingHours}
                onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Kebijakan Garansi & Kualitas
            </label>
            <textarea
              rows={2}
              value={form.guaranteePolicy}
              onChange={(e) => setForm({ ...form, guaranteePolicy: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Teks Promo / Banner Atas
            </label>
            <input
              type="text"
              value={form.promoText}
              onChange={(e) => setForm({ ...form, promoText: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-gray-800 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-xl transition-colors border border-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

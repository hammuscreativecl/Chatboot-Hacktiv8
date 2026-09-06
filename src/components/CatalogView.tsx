import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageCircle, Calculator, Eye, Sparkles, Check } from 'lucide-react';
import { SOUVENIR_PRODUCTS } from '../data/souvenirData';
import { SouvenirCategory, SouvenirItem } from '../types';

interface CatalogViewProps {
  onSelectProduct: (product: SouvenirItem) => void;
  onAskCS: (product: SouvenirItem) => void;
  onSimulate: (product: SouvenirItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectProduct,
  onAskCS,
  onSimulate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SouvenirCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(45000);

  const categories: { id: SouvenirCategory; label: string }[] = [
    { id: 'semua', label: 'Semua Produk' },
    { id: 'pernikahan', label: 'Pernikahan (Wedding)' },
    { id: 'corporate', label: 'Kantor & Corporate' },
    { id: 'seminar', label: 'Seminar & Event' },
    { id: 'ulang-tahun', label: 'Ulang Tahun & Souvenir Unik' },
  ];

  const filteredProducts = useMemo(() => {
    return SOUVENIR_PRODUCTS.filter((prod) => {
      const matchCategory = selectedCategory === 'semua' || prod.category === selectedCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = prod.price <= maxPrice;

      return matchCategory && matchSearch && matchPrice;
    });
  }, [selectedCategory, searchQuery, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama souvenir (contoh: tumbler, pouch, lilin, mug)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Budget Filter */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shrink-0">
            <span className="text-xs font-medium text-gray-500">Maks. Budget:</span>
            <input
              type="range"
              min="5000"
              max="45000"
              step="2500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-24 sm:w-32 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-emerald-700 min-w-16">
              Rp {maxPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs">
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Lihat Detail Produk"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="uppercase tracking-wider font-semibold text-emerald-700">
                    {product.category}
                  </span>
                  <span>Min. {product.minOrder} pcs</span>
                </div>

                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">Harga mulai</span>
                  <span className="text-base font-bold text-emerald-600">
                    Rp {product.price.toLocaleString('id-ID')}
                    <span className="text-xs text-gray-400 font-normal"> / pcs</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => onAskCS(product)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                Tanya CS
              </button>
              <button
                onClick={() => onSelectProduct(product)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Tidak ada produk souvenir yang cocok dengan kriteria pencarian.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('semua');
              setMaxPrice(45000);
            }}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 shadow-sm"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

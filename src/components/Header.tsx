import React from 'react';
import { Gift, Settings } from 'lucide-react';
import { StoreConfig } from '../types';

interface HeaderProps {
  storeConfig: StoreConfig;
  activeTab: 'chat' | 'catalog' | 'quotation';
  setActiveTab: (tab: 'chat' | 'catalog' | 'quotation') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeConfig,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs font-bold text-lg">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight">
                {storeConfig.storeName}
              </h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all"
              title="Pengaturan Profil Toko & CS"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Zap } from 'lucide-react';
import Modal from '../ui/Modal';
import { PRICING_PLANS } from '../../data/constants';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleTopUp: (amount: number) => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, handleTopUp }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Credits" size="sm">
      <div className="p-6">
          <div className="text-center mb-8">
              <div className="w-16 h-16 bg-atelier-clay rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-atelier-charcoal" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Power Up</h3>
              <p className="text-gray-600 font-medium text-sm">Credits never expire. Purchase more to keep creating.</p>
          </div>

          <div className="space-y-3">
              <button onClick={() => handleTopUp(PRICING_PLANS.TOP_UP.STARTER.CREDITS)} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-atelier-orange hover:bg-orange-50 transition-all group">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs group-hover:bg-white">{PRICING_PLANS.TOP_UP.STARTER.CREDITS}</div>
                      <span className="font-bold text-atelier-charcoal">Starter Pack</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-gray-800">{PRICING_PLANS.TOP_UP.STARTER.PRICE}</span>
              </button>
              <button onClick={() => handleTopUp(PRICING_PLANS.TOP_UP.PRO.CREDITS)} className="w-full flex items-center justify-between p-4 border-2 border-atelier-charcoal rounded-xl bg-atelier-charcoal text-white shadow-lg transform scale-105">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs text-white">{PRICING_PLANS.TOP_UP.PRO.CREDITS}</div>
                      <span className="font-bold">Pro Pack</span>
                  </div>
                  <span className="font-mono text-sm font-bold">{PRICING_PLANS.TOP_UP.PRO.PRICE}</span>
              </button>
              <button onClick={() => handleTopUp(PRICING_PLANS.TOP_UP.EMPIRE.CREDITS)} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-atelier-orange hover:bg-orange-50 transition-all group">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs group-hover:bg-white">{PRICING_PLANS.TOP_UP.EMPIRE.CREDITS}</div>
                      <span className="font-bold text-atelier-charcoal">Empire Pack</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-gray-800">{PRICING_PLANS.TOP_UP.EMPIRE.PRICE}</span>
              </button>
          </div>
          
          <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Secured by Paystack</p>
          </div>
      </div>
    </Modal>
  );
};

export default TopUpModal;
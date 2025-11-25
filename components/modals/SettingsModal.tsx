import React, { useRef } from 'react';
import { Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import Modal from '../ui/Modal';
import { BrandProfile } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandProfile;
  setBrand: React.Dispatch<React.SetStateAction<BrandProfile>>;
  handleSave: () => void;
  handleDeleteAccount: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, brand, setBrand, handleSave, handleDeleteAccount }) => {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  
  // Local state handling for logo upload within the modal
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrand(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBrandTone = () => {
      setBrand(prev => ({ ...prev, applyBrandTone: !prev.applyBrandTone }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Studio Settings">
      <div className="p-6 space-y-8">
          {/* Brand Identity */}
          <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b pb-2">Brand Identity</h3>
              <div className="grid gap-6">
                  <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden relative group cursor-pointer border border-gray-200">
                           {brand.logoUrl ? (
                               <img src={brand.logoUrl} className="w-full h-full object-cover" />
                           ) : (
                               <span className="text-2xl font-bold text-gray-300">{brand.name.substring(0,2)}</span>
                           )}
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Upload className="w-6 h-6 text-white" />
                           </div>
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
                       </div>
                       <div className="flex-1">
                           <label className="block text-xs font-bold text-atelier-charcoal mb-1">Brand Name</label>
                           <input 
                            value={brand.name}
                            onChange={e => setBrand({...brand, name: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-atelier-charcoal transition-colors font-medium text-gray-800"
                           />
                       </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-atelier-charcoal mb-1">Industry</label>
                       <input 
                            value={brand.industry}
                            onChange={e => setBrand({...brand, industry: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-atelier-charcoal transition-colors font-medium text-gray-800"
                       />
                  </div>
                  <div>
                       <label className="block text-xs font-bold text-atelier-charcoal mb-1">Brand Tone</label>
                       <input 
                            value={brand.tone}
                            onChange={e => setBrand({...brand, tone: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-atelier-charcoal transition-colors font-medium text-gray-800"
                       />
                  </div>

                  {/* Auto Apply Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                          <span className="block text-sm font-bold text-atelier-charcoal">Auto-Apply Brand Tone</span>
                          <span className="text-xs text-gray-500 font-medium">Automatically allow AI to assume your brand context for all generations.</span>
                      </div>
                      <button 
                        onClick={toggleBrandTone}
                        className={`transition-colors ${brand.applyBrandTone ? 'text-atelier-orange' : 'text-gray-400'}`}
                      >
                          {brand.applyBrandTone ? <ToggleRight className="w-10 h-10 fill-current" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                  </div>
              </div>
          </section>

          {/* Danger Zone */}
          <section className="pt-8 border-t border-gray-100">
               <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-4">Danger Zone</h3>
               
               {!deleteConfirm ? (
                   <button onClick={() => setDeleteConfirm(true)} className="text-sm text-red-500 hover:text-red-700 font-bold underline underline-offset-4">
                       Delete Account
                   </button>
               ) : (
                   <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                       <p className="text-sm text-red-800 mb-4 font-bold">Permanently delete your account and all associated data?</p>
                       <div className="flex gap-4">
                           <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Yes, Delete Account</button>
                           <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 bg-white text-gray-700 text-xs font-bold rounded border border-gray-200 hover:bg-gray-50">Cancel</button>
                       </div>
                   </div>
               )}
          </section>

          <div className="pt-4 flex justify-end gap-3">
              <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-atelier-charcoal">Cancel</button>
              <button onClick={handleSave} className="px-6 py-3 bg-atelier-charcoal text-white font-bold rounded-lg hover:bg-atelier-orange transition-colors">Save Changes</button>
          </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
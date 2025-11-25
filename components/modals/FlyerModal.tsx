
import * as React from 'react';
import { useRef } from 'react';
import { Image as ImageIcon, Ticket, PaintBucket, Upload, Plus, X, Wand2, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import SelectionCard from '../ui/SelectionCard';
import { FLYER_TYPES, FLYER_STYLES } from '../../data/constants';

interface FlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateState: any;
  setTemplateState: React.Dispatch<React.SetStateAction<any>>;
  templateSelections: any;
  setTemplateSelections: React.Dispatch<React.SetStateAction<any>>;
  executeTemplate: () => void;
  handleTemplateProductsSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTemplateSingleFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: any) => void;
  removeTemplateProduct: (index: number) => void;
}

const FlyerModal: React.FC<FlyerModalProps> = ({
  isOpen, onClose, templateState, setTemplateState, templateSelections, setTemplateSelections,
  executeTemplate, handleTemplateProductsSelect, handleTemplateSingleFileSelect, removeTemplateProduct
}) => {
  const templateProductInputRef = useRef<HTMLInputElement>(null);

  const footer = (
    <button 
      onClick={executeTemplate}
      className="w-full py-4 rounded-xl bg-atelier-charcoal text-white font-bold text-sm uppercase tracking-widest hover:bg-atelier-orange transition-colors flex items-center justify-center gap-2 shadow-lg"
    >
        Done <Check className="w-4 h-4" />
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Marketing Flyer" footer={footer}>
      <div className="flex flex-col gap-8 p-4 md:p-6">
          
          {/* ASSETS */}
          <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-6 h-6 rounded-full bg-atelier-orange/10 flex items-center justify-center">
                      <ImageIcon className="w-3 h-3 text-atelier-orange" />
                  </div>
                  <h3 className="text-sm font-bold text-atelier-charcoal">Assets</h3>
                  <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full uppercase">Optional</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  {/* Products */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 block mb-2">Products</span>
                    <div className="flex flex-wrap gap-2">
                        {templateState.products.map((p: any, i: number) => (
                            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={p.preview} className="w-full h-full object-cover" />
                                <button onClick={() => removeTemplateProduct(i)} className="absolute top-0 right-0 p-0.5 bg-white text-red-500 rounded-bl-md shadow-sm">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => templateProductInputRef.current?.click()}
                            className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-atelier-orange text-gray-400 hover:text-atelier-orange transition-colors bg-white"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <input type="file" ref={templateProductInputRef} onChange={handleTemplateProductsSelect} className="hidden" multiple accept="image/*" />
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 block mb-2">Logo</span>
                    <div className="flex">
                        {templateState.flyerLogo ? (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white">
                                <img src={templateState.flyerLogo.preview} className="w-full h-full object-contain p-1" />
                                <button onClick={() => setTemplateState((prev: any) => ({ ...prev, flyerLogo: null }))} className="absolute top-0 right-0 p-0.5 bg-white text-red-500 rounded-bl-md shadow-sm">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => (document.querySelector('#flyer-logo-input') as HTMLInputElement)?.click()}
                                className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-atelier-orange text-gray-400 hover:text-atelier-orange transition-colors bg-white"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                        )}
                        <input id="flyer-logo-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleTemplateSingleFileSelect(e, 'flyerLogo')} />
                    </div>
                  </div>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* PURPOSE */}
          <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                  <Ticket className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">Flyer Purpose</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {FLYER_TYPES.map(t => (
                      <SelectionCard 
                        key={t.id}
                        {...t}
                        selected={templateSelections.type === t.id}
                        onClick={() => setTemplateSelections((prev: any) => ({ ...prev, type: t.id }))}
                        compact
                      />
                  ))}
              </div>
          </div>

          {/* STYLE */}
          <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <PaintBucket className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">Art Style</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
                       <input 
                        type="checkbox" 
                        id="surprise-flyer" 
                        checked={templateSelections.surprise || false}
                        onChange={(e) => setTemplateSelections((prev: any) => ({ ...prev, surprise: e.target.checked, style: null }))}
                        className="accent-atelier-orange w-3.5 h-3.5"
                       />
                       <label htmlFor="surprise-flyer" className="text-[10px] font-bold text-atelier-orange cursor-pointer uppercase">Surprise Me</label>
                  </div>
              </div>
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 transition-opacity ${templateSelections.surprise ? 'opacity-50 pointer-events-none' : ''}`}>
                  {FLYER_STYLES.map(s => (
                      <SelectionCard 
                        key={s.id}
                        {...s}
                        selected={templateSelections.style === s.id}
                        onClick={() => setTemplateSelections((prev: any) => ({ ...prev, style: s.id }))}
                        compact
                      />
                  ))}
              </div>
          </div>
      </div>
    </Modal>
  );
};

export default FlyerModal;

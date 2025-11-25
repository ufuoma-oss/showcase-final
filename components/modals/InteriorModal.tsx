
import * as React from 'react';
import { useRef } from 'react';
import { Home, PaintBucket, Upload, Plus, X, Wand2, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import SelectionCard from '../ui/SelectionCard';
import { INTERIOR_STYLES } from '../../data/constants';

interface InteriorModalProps {
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

const InteriorModal: React.FC<InteriorModalProps> = ({
  isOpen, onClose, templateState, setTemplateState, templateSelections, setTemplateSelections,
  executeTemplate, handleTemplateProductsSelect, handleTemplateSingleFileSelect, removeTemplateProduct
}) => {
  const templateProductInputRef = useRef<HTMLInputElement>(null);

  const footer = (
    <button 
      onClick={executeTemplate}
      className="w-full py-4 rounded-xl bg-atelier-charcoal text-white font-bold text-sm uppercase tracking-widest hover:bg-atelier-blue transition-colors flex items-center justify-center gap-2 shadow-lg"
    >
        Done <Check className="w-4 h-4" />
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Interior Design" footer={footer}>
      <div className="flex flex-col gap-8 p-4 md:p-6">
          
          {/* CURRENT SPACE (Required for redesign) */}
          <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-6 h-6 rounded-full bg-atelier-blue/10 flex items-center justify-center">
                      <Home className="w-3 h-3 text-atelier-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-atelier-charcoal">The Space</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Space */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col">
                      <label className="text-xs font-bold text-gray-500 block mb-2">Upload Room (Base)</label>
                      <div className="flex-1 min-h-[120px]">
                          {templateState.customBg ? (
                               <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                                  <img src={templateState.customBg.preview} className="w-full h-full object-cover" />
                                  <button onClick={() => setTemplateState((prev: any) => ({ ...prev, customBg: null }))} className="absolute top-1 right-1 p-1 bg-white text-red-500 rounded-full shadow-sm hover:bg-gray-50">
                                      <X className="w-4 h-4" />
                                  </button>
                               </div>
                          ) : (
                              <button 
                                  onClick={() => (document.querySelector('#interior-base-input') as HTMLInputElement)?.click()}
                                  className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-atelier-blue text-gray-400 hover:text-atelier-blue transition-colors bg-white"
                              >
                                 <Upload className="w-6 h-6 mb-2" />
                                 <span className="text-[10px] font-bold uppercase">Tap to Upload</span>
                              </button>
                          )}
                          <input id="interior-base-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleTemplateSingleFileSelect(e, 'customBg')} />
                      </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <label className="text-xs font-bold text-gray-500 block mb-2">Add Items (Optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {templateState.products.map((p: any, i: number) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group bg-white">
                                <img src={p.preview} className="w-full h-full object-cover" />
                                <button onClick={() => removeTemplateProduct(i)} className="absolute top-0 right-0 p-0.5 bg-white text-red-500 rounded-bl-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => templateProductInputRef.current?.click()}
                            className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-atelier-blue text-gray-400 hover:text-atelier-blue transition-colors bg-white"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <input type="file" ref={templateProductInputRef} onChange={handleTemplateProductsSelect} className="hidden" multiple accept="image/*" />
                    </div>
                  </div>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* STYLE */}
          <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <PaintBucket className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">Design Style</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
                       <input 
                        type="checkbox" 
                        id="surprise-interior" 
                        checked={templateSelections.surprise || false}
                        onChange={(e) => setTemplateSelections((prev: any) => ({ ...prev, surprise: e.target.checked, style: null }))}
                        className="accent-atelier-orange w-3.5 h-3.5"
                       />
                       <label htmlFor="surprise-interior" className="text-[10px] font-bold text-atelier-orange cursor-pointer uppercase">Surprise Me</label>
                  </div>
              </div>
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 transition-opacity ${templateSelections.surprise ? 'opacity-50 pointer-events-none' : ''}`}>
                  {INTERIOR_STYLES.map(s => (
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

export default InteriorModal;

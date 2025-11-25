
import * as React from 'react';
import { useRef } from 'react';
import { ShoppingBag, Layers, Plus, X, ArrowRight, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import SelectionCard from '../ui/SelectionCard';
import { PRODUCT_PLACEMENTS } from '../../data/constants';

interface ProductModalProps {
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

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen, onClose, templateState, setTemplateState, templateSelections, setTemplateSelections,
  executeTemplate, handleTemplateProductsSelect, handleTemplateSingleFileSelect, removeTemplateProduct
}) => {
  const templateProductInputRef = useRef<HTMLInputElement>(null);

  const footer = (
    <button 
      onClick={executeTemplate}
      disabled={templateState.products.length === 0}
      className="w-full py-4 rounded-xl bg-atelier-charcoal text-white font-bold text-sm uppercase tracking-widest hover:bg-atelier-blue transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
    >
        Done <Check className="w-4 h-4" />
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Showcase" footer={footer}>
      <div className="flex flex-col gap-8 p-4 md:p-6">
          
          <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-6 h-6 rounded-full bg-atelier-blue/10 flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3 text-atelier-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-atelier-charcoal">Your Products</h3>
                  <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full uppercase">Required</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap custom-scrollbar">
                   <button 
                    onClick={() => templateProductInputRef.current?.click()}
                    className="w-20 h-24 md:w-24 md:h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-atelier-blue hover:bg-atelier-blue/5 transition-all text-gray-400 hover:text-atelier-blue"
                   >
                       <Plus className="w-6 h-6 mb-1" />
                       <span className="text-[10px] font-bold uppercase">Add</span>
                   </button>
                   <input type="file" ref={templateProductInputRef} onChange={handleTemplateProductsSelect} className="hidden" multiple accept="image/*" />

                   {templateState.products.map((p: any, i: number) => (
                      <div key={i} className="relative w-20 h-24 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                         <img src={p.preview} className="w-full h-full object-cover" />
                         <button onClick={() => removeTemplateProduct(i)} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-white">
                             <X className="w-3 h-3" />
                         </button>
                      </div>
                   ))}
              </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">Placement & Scene</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {PRODUCT_PLACEMENTS.map(p => (
                      <SelectionCard 
                        key={p.id}
                        {...p}
                        selected={templateSelections.placement === p.id}
                        onClick={() => setTemplateSelections((prev: any) => ({ ...prev, placement: p.id }))}
                        compact
                      />
                  ))}
              </div>

              {templateSelections.placement === 'custom' && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 animate-fade-up">
                      <div className="flex items-center justify-between gap-4">
                          <p className="text-xs text-gray-600 font-medium">Upload background</p>
                          <div className="flex-shrink-0">
                              {templateState.customBg ? (
                                  <div className="relative h-12 w-12">
                                      <img src={templateState.customBg.preview} className="w-full h-full object-cover rounded-md shadow-sm" />
                                      <button onClick={() => setTemplateState((prev: any) => ({ ...prev, customBg: null }))} className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md border border-gray-100"><X className="w-3 h-3" /></button>
                                  </div>
                              ) : (
                                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50" onClick={() => (document.querySelector('#custom-bg-input-prod') as HTMLInputElement)?.click()}>Upload</button>
                              )}
                              <input id="custom-bg-input-prod" type="file" className="hidden" accept="image/*" onChange={(e) => handleTemplateSingleFileSelect(e, 'customBg')} />
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </Modal>
  );
};

export default ProductModal;

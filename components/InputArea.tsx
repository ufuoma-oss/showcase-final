import React, { useRef } from 'react';
import { Plus, X, ArrowUp, Square } from 'lucide-react';

interface InputAreaProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  selectedFiles: any[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSend: () => void;
  onStop: () => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  input, setInput, selectedFiles, onFileSelect, onRemoveFile, onSend, onStop, isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        onSend(); 
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="bg-atelier-cream border-t border-atelier-charcoal/10 p-2 md:p-6 flex-shrink-0 z-20">
        <div className="max-w-4xl mx-auto">
            {selectedFiles.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 custom-scrollbar">
                    {selectedFiles.map((file, i) => (
                        <div key={i} className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 group">
                            <img src={file.preview} className="w-full h-full object-cover border border-gray-200 rounded-md" />
                            <button onClick={() => onRemoveFile(i)} className="absolute -top-1 -right-1 bg-white text-atelier-charcoal border border-gray-200 rounded-full p-0.5 shadow-md">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white border border-atelier-charcoal/10 p-1 md:p-2 shadow-lg flex items-end gap-2 rounded-xl focus-within:ring-1 focus-within:ring-atelier-charcoal transition-all">
                <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" multiple accept="image/*" />
                
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isLoading}
                  className="p-3 text-gray-500 hover:text-atelier-orange transition-colors flex-shrink-0 disabled:opacity-50"
                >
                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); adjustTextareaHeight(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe to edit or generate"
                    className="flex-1 bg-transparent py-3 md:py-4 resize-none focus:outline-none text-sm md:text-lg text-atelier-charcoal placeholder:text-gray-400 font-sans font-medium max-h-[120px]"
                    rows={1}
                    style={{ minHeight: '44px' }}
                    disabled={isLoading}
                />
                
                {isLoading ? (
                  <button 
                      onClick={onStop}
                      className="p-3 md:p-4 bg-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Stop Generation"
                  >
                      <Square className="w-5 h-5 fill-current" />
                  </button>
                ) : (
                  <button 
                      onClick={() => onSend()}
                      disabled={!input.trim() && selectedFiles.length === 0}
                      className="p-3 md:p-4 bg-atelier-charcoal text-white rounded-lg hover:bg-atelier-orange transition-colors disabled:opacity-20 flex-shrink-0"
                  >
                      <ArrowUp className="w-5 h-5" />
                  </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default InputArea;
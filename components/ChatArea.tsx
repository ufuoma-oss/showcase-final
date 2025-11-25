
import React, { useRef, useEffect } from 'react';
import { ArrowUp, Shirt, ShoppingBag, Megaphone, Armchair, Download, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { ChatMessage, MessageRole } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onTemplateSelect: (template: 'FASHION' | 'PRODUCT' | 'FLYER' | 'INTERIOR') => void;
  onImageClick: (url: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, onTemplateSelect, onImageClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const handleDownload = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    try {
        const link = document.createElement('a');
        link.download = `showcaxe-${Date.now()}.png`;
        
        // Handle Data URIs (Generated Images) - Convert to Blob for stability
        if (url.startsWith('data:')) {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } else {
            // Handle Blob URIs (Uploaded Images) or URLs
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (err) {
        console.error("Download failed:", err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-12 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center animate-fade-up max-w-2xl mx-auto text-center px-4 pb-20">
                <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-full shadow-lg border border-atelier-charcoal/5">
                   <Logo size="md" showText={false} />
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-atelier-charcoal mb-4">
                    Start Creating.
                </h2>
                <p className="text-base md:text-xl text-gray-700 font-medium mb-8 md:mb-12">
                    Select a template or enter your own request
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                    {/* Fashion */}
                    <button 
                      onClick={() => onTemplateSelect('FASHION')}
                      className="group bg-white p-5 md:p-6 border border-atelier-charcoal/10 hover:border-atelier-orange hover:bg-orange-50/30 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center md:block gap-4 md:gap-0 rounded-2xl"
                    >
                            <div className="flex items-center justify-between mb-0 md:mb-3">
                              <div className="w-10 h-10 rounded-full bg-atelier-orange/10 flex items-center justify-center group-hover:bg-atelier-orange group-hover:text-white transition-colors">
                                  <Shirt className="w-5 h-5 text-atelier-orange group-hover:text-white" />
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-atelier-orange hidden md:block" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-atelier-charcoal block mb-1">Fashion Photoshoot</span>
                              <span className="text-[11px] md:text-xs text-gray-500 font-medium leading-tight block">African models, luxury locations & 4K shots.</span>
                            </div>
                    </button>

                    {/* Product */}
                    <button 
                      onClick={() => onTemplateSelect('PRODUCT')}
                      className="group bg-white p-5 md:p-6 border border-atelier-charcoal/10 hover:border-atelier-blue hover:bg-blue-50/30 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center md:block gap-4 md:gap-0 rounded-2xl"
                    >
                            <div className="flex items-center justify-between mb-0 md:mb-3">
                              <div className="w-10 h-10 rounded-full bg-atelier-blue/10 flex items-center justify-center group-hover:bg-atelier-blue group-hover:text-white transition-colors">
                                  <ShoppingBag className="w-5 h-5 text-atelier-blue group-hover:text-white" />
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-atelier-blue hidden md:block" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-atelier-charcoal block mb-1">Product Photography</span>
                              <span className="text-[11px] md:text-xs text-gray-500 font-medium leading-tight block">Pro lighting, influencer hands & studio props.</span>
                            </div>
                    </button>

                    {/* Flyer */}
                    <button 
                      onClick={() => onTemplateSelect('FLYER')}
                      className="group bg-white p-5 md:p-6 border border-atelier-charcoal/10 hover:border-atelier-charcoal hover:bg-gray-50 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center md:block gap-4 md:gap-0 rounded-2xl"
                    >
                            <div className="flex items-center justify-between mb-0 md:mb-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-atelier-charcoal group-hover:text-white transition-colors">
                                  <Megaphone className="w-5 h-5 text-gray-600 group-hover:text-white" />
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-atelier-charcoal hidden md:block" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-atelier-charcoal block mb-1">Marketing Material</span>
                              <span className="text-[11px] md:text-xs text-gray-500 font-medium leading-tight block">Instagram posts, flyers & stories in seconds.</span>
                            </div>
                    </button>

                     {/* Interior */}
                     <button 
                      onClick={() => onTemplateSelect('INTERIOR')}
                      className="group bg-white p-5 md:p-6 border border-atelier-charcoal/10 hover:border-atelier-orange hover:bg-orange-50/30 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center md:block gap-4 md:gap-0 rounded-2xl"
                    >
                            <div className="flex items-center justify-between mb-0 md:mb-3">
                              <div className="w-10 h-10 rounded-full bg-atelier-orange/10 flex items-center justify-center group-hover:bg-atelier-orange group-hover:text-white transition-colors">
                                  <Armchair className="w-5 h-5 text-atelier-orange group-hover:text-white" />
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-atelier-orange hidden md:block" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-atelier-charcoal block mb-1">Home Staging</span>
                              <span className="text-[11px] md:text-xs text-gray-500 font-medium leading-tight block">Furnish empty spaces & redesign interiors.</span>
                            </div>
                    </button>
                </div>
            </div>
        ) : (
            messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                    <div className={`max-w-[90%] md:max-w-[800px] w-full flex flex-col ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                                {msg.attachments.map((att, i) => (
                                    <div key={i} className="group relative overflow-hidden shadow-xl bg-white rounded-lg">
                                        <img 
                                          src={att.url} 
                                          className={`w-full h-auto object-cover ${msg.role !== MessageRole.USER ? 'cursor-zoom-in' : ''}`}
                                          onClick={() => msg.role !== MessageRole.USER && onImageClick(att.url)}
                                        />
                                        
                                        {att.url && msg.role !== MessageRole.USER && (
                                          <button 
                                              onClick={(e) => handleDownload(e, att.url)}
                                              className="absolute bottom-4 right-4 bg-white/90 text-atelier-charcoal p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-atelier-orange hover:text-white"
                                              title="Download Image"
                                          >
                                              <Download className="w-5 h-5" />
                                          </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {msg.text && (!msg.attachments || msg.attachments.length === 0 || msg.role === MessageRole.USER) && (
                            <div className={`
                              text-sm md:text-base leading-relaxed p-4 md:p-6 shadow-sm font-medium
                              ${msg.role === MessageRole.USER 
                                  ? 'bg-atelier-charcoal text-white rounded-2xl rounded-tr-sm px-5 py-3 text-base' 
                                  : 'bg-white text-atelier-charcoal border border-atelier-charcoal/5 rounded-2xl rounded-tl-sm'}
                            `}>
                                {msg.text}
                            </div>
                        )}
                    </div>
                </div>
            ))
        )}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white px-4 py-3 md:px-6 md:py-4 rounded-full border border-atelier-charcoal/10 flex items-center gap-3 shadow-sm">
                    <div className="animate-spin">
                      <Logo size="sm" showText={false} />
                    </div>
                    <span className="text-sm font-bold text-atelier-charcoal">
                       Processing your request...
                    </span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default ChatArea;

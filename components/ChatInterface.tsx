
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Menu, Zap, Plus } from 'lucide-react';
import { BrandProfile, ChatMessage, MessageRole, ImageAspectRatio, ImageResolution, MediaType } from '../types';
import { fileToGenerativePart, generateProductImage, editProductImage } from '../services/geminiService';
import { COST_IMAGE_GEN, INITIAL_FREE_CREDITS, FASHION_MODELS, FASHION_LOCATIONS, PRODUCT_PLACEMENTS, FLYER_TYPES, FLYER_STYLES, INTERIOR_STYLES, PRICING_PLANS } from '../data/constants';

// UI Components
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import InputArea from './InputArea';
import Logo from './Logo';

// Modals
import FashionModal from './modals/FashionModal';
import ProductModal from './modals/ProductModal';
import FlyerModal from './modals/FlyerModal';
import InteriorModal from './modals/InteriorModal';
import TopUpModal from './modals/TopUpModal';
import SubscriptionModal from './modals/SubscriptionModal';
import SettingsModal from './modals/SettingsModal';
import ImagePreviewModal from './modals/ImagePreviewModal';

interface ChatInterfaceProps {
  brand: BrandProfile;
  onSignOut: () => void;
  onUpdateBrand: (brand: BrandProfile) => void;
}

interface ChatSession {
    id: string;
    title: string;
    date: number;
    messages: ChatMessage[];
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ brand, onSignOut, onUpdateBrand }) => {
  // --- CORE STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; type: 'image' }[]>([]);
  
  // --- UI STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>(Date.now().toString());
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
      try { return JSON.parse(localStorage.getItem('showcaxe_sessions') || '[]'); } catch { return []; }
  });
  
  // --- MODAL STATE ---
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'FASHION' | 'PRODUCT' | 'FLYER' | 'INTERIOR' | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // --- TEMPLATE STATE (Shared across modals) ---
  const [templateState, setTemplateState] = useState<{
    products: { file: File, preview: string }[];
    customModel: { file: File, preview: string } | null;
    customBg: { file: File, preview: string } | null;
    flyerLogo: { file: File, preview: string } | null;
  }>({ products: [], customModel: null, customBg: null, flyerLogo: null });
  
  const [templateSelections, setTemplateSelections] = useState<any>({});

  // --- ECONOMY STATE ---
  const [credits, setCredits] = useState(() => {
      const stored = localStorage.getItem('showcaxe_credits');
      return stored ? parseInt(stored, 10) : INITIAL_FREE_CREDITS;
  });
  const [isSubscribed, setIsSubscribed] = useState(() => {
      return localStorage.getItem('showcaxe_is_subscribed') === 'true';
  });

  const [tempBrand, setTempBrand] = useState<BrandProfile>(brand);
  const [isProcessing, setIsProcessing] = useState(false); 
  const stopGeneration = useRef(false);

  // --- EFFECTS ---

  useEffect(() => {
      if (window.innerWidth >= 768) {
          setIsSidebarOpen(true);
      }
  }, []);

  useEffect(() => {
    if (showSettings) {
      setTempBrand(brand);
    }
  }, [showSettings, brand]);

  useEffect(() => { 
      localStorage.setItem('showcaxe_credits', credits.toString());
      localStorage.setItem('showcaxe_is_subscribed', isSubscribed.toString());
  }, [credits, isSubscribed]);
  
  // --- SESSION MANAGEMENT ---
  const saveSessionsToStorage = (currentSessions: ChatSession[]) => {
      try {
        localStorage.setItem('showcaxe_sessions', JSON.stringify(currentSessions));
      } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            let trimmedSessions = currentSessions.slice(0, 3);
            trimmedSessions = trimmedSessions.map(s => {
                const isCurrent = s.id === activeSessionId;
                return {
                    ...s,
                    messages: s.messages.map(m => ({
                        ...m,
                        attachments: m.attachments?.map(a => ({ 
                            ...a, 
                            data: isCurrent ? a.data : '' 
                        })) 
                    }))
                };
            });
            try {
                localStorage.setItem('showcaxe_sessions', JSON.stringify(trimmedSessions));
            } catch (err2) {
                 localStorage.removeItem('showcaxe_sessions');
            }
        }
      }
  };

  useEffect(() => { 
      saveSessionsToStorage(sessions);
  }, [sessions, activeSessionId]);

  const handleNewChat = () => {
      const newId = Date.now().toString();
      setActiveSessionId(newId);
      setMessages([]);
      setInput('');
      setSelectedFiles([]);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
      setActiveSessionId(session.id);
      setMessages(session.messages);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const newSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(newSessions);
    if (sessionId === activeSessionId) {
        newSessions.length > 0 ? handleLoadSession(newSessions[0]) : handleNewChat();
    }
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    onSignOut();
  };

  // --- FILE HANDLING ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .filter((file: any) => file.type.startsWith('image/'))
        .map((file: any) => ({
          file: file as File,
          preview: URL.createObjectURL(file),
          type: 'image' as const
        }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- TEMPLATE HANDLERS ---
  const handleTemplateProductsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles = Array.from(e.target.files)
            .filter((file: any) => file.type.startsWith('image/'))
            .map((file: any) => ({
              file: file as File,
              preview: URL.createObjectURL(file)
            }));
          setTemplateState(prev => ({ ...prev, products: [...prev.products, ...newFiles] }));
      }
  };

  const removeTemplateProduct = (index: number) => {
      setTemplateState(prev => ({ 
          ...prev, 
          products: prev.products.filter((_, i) => i !== index) 
      }));
  };

  const handleTemplateSingleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'customModel' | 'customBg' | 'flyerLogo') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setTemplateState(prev => ({ 
              ...prev, 
              [type]: { file, preview: URL.createObjectURL(file) } 
          }));
      }
  };

  // --- BILLING HANDLERS ---
  const handleSubscribe = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setCredits(prev => prev + PRICING_PLANS.SUBSCRIPTION.CREDITS);
          setIsSubscribed(true);
          setIsProcessing(false);
          setShowSubscriptionModal(false);
      }, 2000);
  };

  const handleCancelSubscription = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsSubscribed(false);
          setIsProcessing(false);
          setShowSubscriptionModal(false);
      }, 1500);
  };

  const handleTopUp = (amount: number) => {
      setIsProcessing(true);
      setTimeout(() => {
          setCredits(prev => prev + amount);
          setIsProcessing(false);
          setShowTopUpModal(false);
      }, 1500);
  };

  const handleOpenTopUp = () => {
    if (!isSubscribed) {
        setShowSubscriptionModal(true);
    } else {
        setShowTopUpModal(true);
    }
  };

  const handleSaveSettings = () => {
    onUpdateBrand(tempBrand);
    setShowSettings(false);
  };

  const ensureApiKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.hasSelectedApiKey) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey && aistudio.openSelectKey) await aistudio.openSelectKey();
    }
  };
  
  const handleStop = () => {
      stopGeneration.current = true;
      setIsLoading(false);
      setCredits(prev => prev + COST_IMAGE_GEN); // Refund credits
  };

  // --- CORE LOGIC ---
  const handleSend = async (overrideInput?: string, overrideFiles?: typeof selectedFiles) => {
    stopGeneration.current = false;
    const textToProcess = overrideInput || input;
    const filesToProcess = overrideFiles || selectedFiles;
    
    if ((!textToProcess.trim() && filesToProcess.length === 0) || isLoading) return;
    
    const lowerInput = textToProcess.toLowerCase();
    const hasUserUpload = filesToProcess.length > 0;
    const lastAiImageMsg = [...messages].reverse().find(m => m.role === MessageRole.MODEL && m.attachments?.length);
    const lastAiImageContext = lastAiImageMsg?.attachments?.[0];
    const isNewGenRequest = lowerInput.match(/(generate|create|new|make|draw|render|start over|brand new)/);

    let mode = 'GENERATE'; 
    if (hasUserUpload) {
        mode = 'GENERATE_WITH_REF'; 
    } else if (lastAiImageContext && !isNewGenRequest) {
        mode = 'EDIT';
    } else {
        mode = 'GENERATE';
    }

    const cost = COST_IMAGE_GEN; 
    
    if (credits < cost) {
        handleOpenTopUp();
        return;
    }

    setCredits(prev => prev - cost);
    await ensureApiKey();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: textToProcess,
      timestamp: Date.now(),
      attachments: filesToProcess.length > 0 ? filesToProcess.map(f => ({
        type: MediaType.IMAGE,
        url: f.preview,
        data: '', 
        mimeType: f.file.type
      })) : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideInput) setInput('');
    if (!overrideFiles) setSelectedFiles([]);
    
    setIsLoading(true);
    setActiveTemplate(null); 
    
    try {
      let attachmentDataList: { data: string; mimeType: string }[] = [];
      
      for (const fileObj of filesToProcess) {
          if (stopGeneration.current) break;
          const processed = await fileToGenerativePart(fileObj.file);
          attachmentDataList.push(processed);
      }
      
      let result = { image: null as string | null, feedback: null as string | null };
      let responseText = '';

      if (!stopGeneration.current) {
          if (mode === 'EDIT' && lastAiImageContext && lastAiImageContext.data) {
              const base64Data = lastAiImageContext.data;
              result = await editProductImage(
                  base64Data, 
                  lastAiImageContext.mimeType || 'image/png', 
                  textToProcess, 
                  ImageAspectRatio.PORTRAIT
              );
          } else {
              result = await generateProductImage(
                  textToProcess, 
                  ImageAspectRatio.PORTRAIT, 
                  ImageResolution.R2K, 
                  attachmentDataList.length > 0 ? attachmentDataList : undefined,
                  brand
              );
          }
      }

      if (stopGeneration.current) return;

      if (!result.image) {
           responseText = result.feedback || "Studio Command Failed. Please refine visual description.";
           setCredits(prev => prev + cost); // Refund
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText, 
        timestamp: Date.now(),
        attachments: result.image ? [{
            type: MediaType.IMAGE,
            url: result.image,
            data: result.image.split(',')[1], 
            mimeType: 'image/png'
        }] : undefined
      };
      
      setMessages(prev => [...prev, modelMsg]);

      setSessions(prev => {
          const exists = prev.find(s => s.id === activeSessionId);
          if (exists) {
              return prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMsg, modelMsg], date: Date.now(), title: userMsg.text.substring(0, 30) || "Studio Edit" } : s);
          } else {
              return [{ id: activeSessionId, title: userMsg.text.substring(0, 30) || "New Project", date: Date.now(), messages: [userMsg, modelMsg] }, ...prev];
          }
      });

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.MODEL,
        text: "Command execution failed. System reset.",
        timestamp: Date.now()
      }]);
      setCredits(prev => prev + cost);
    } finally {
      setIsLoading(false);
      stopGeneration.current = false;
    }
  };

  const executeTemplate = () => {
      let files: any[] = [];
      let command = "";
      
      // SMART PROMPT GENERATION
      // The goal is to create a prompt that looks like a natural, professional request.
      
      if (activeTemplate === 'FASHION') {
          if (templateState.products.length === 0) return;
          files = [...templateState.products.map(p => ({ file: p.file, preview: p.preview, type: 'image' }))];
          
          const modelId = templateSelections.model || 'nigerian-f';
          const locId = templateSelections.location || 'studio';
          
          const model = FASHION_MODELS.find(m => m.id === modelId);
          const loc = FASHION_LOCATIONS.find(l => l.id === locId);
          
          let modelDesc = model?.label || "Female Model";
          if (modelId === 'nigerian-f') modelDesc = "a stunning African female model";
          if (modelId === 'nigerian-m') modelDesc = "a sharp African male model";
          if (modelId === 'ghost') modelDesc = "an invisible ghost mannequin";
          if (modelId === 'black-ghost') modelDesc = "a black matte stealth mannequin";

          let locDesc = loc?.label || "Studio";
          if (locId === 'luxury') locDesc = "a high-end luxury penthouse";
          if (locId === 'street') locDesc = "a vibrant urban street";
          if (locId === 'runway') locDesc = "a professional fashion runway";
          
          command = `Generate a high-fashion editorial shot of the attached outfit worn by ${modelDesc}. Set the scene in ${locDesc} with professional lighting.`;

          if (modelId === 'custom-model' && templateState.customModel) {
              command = `Fashion photoshoot. Dress the person in the provided MODEL REFERENCE image with the attached clothing item. Keep the model's pose and features exactly as shown.`;
              files.push({ file: templateState.customModel.file, preview: templateState.customModel.preview, type: 'image' });
          }

          if (locId === 'custom' && templateState.customBg) {
               command += ` Use the provided BACKGROUND image as the location. Blend realistically.`;
               files.push({ file: templateState.customBg.file, preview: templateState.customBg.preview, type: 'image' });
          }
      } 
      else if (activeTemplate === 'PRODUCT') {
          if (templateState.products.length === 0) return;
          files = [...templateState.products.map(p => ({ file: p.file, preview: p.preview, type: 'image' }))];

          const placementId = templateSelections.placement || 'podium';
          const placement = PRODUCT_PLACEMENTS.find(p => p.id === placementId);
          
          let placeDesc = placement?.label || "a podium";
          if (placementId === 'studio-pro') placeDesc = "a professional studio infinity curve";
          if (placementId === 'marble') placeDesc = "a polished luxury marble surface";
          if (placementId === 'water') placeDesc = "a surface with fresh water ripples";
          if (placementId === 'nature') placeDesc = "a natural setting with organic elements";
          
          if (placementId === 'influencer') {
               command = `Create a lifestyle influencer shot. A famous African influencer holding the attached product naturally in their hands. High-end social media aesthetic, shallow depth of field.`;
          } else {
              command = `Create a premium 4K commercial product photography shot. Place the attached product on ${placeDesc}. Use cinematic lighting to highlight textures.`;
          }
          
          if (placementId === 'custom' && templateState.customBg) {
               command = `Commercial Product Photography. composite the attached product into the provided BACKGROUND image. Match the lighting and perspective perfectly.`;
               files.push({ file: templateState.customBg.file, preview: templateState.customBg.preview, type: 'image' });
          }
      }
      else if (activeTemplate === 'FLYER') {
          const typeId = templateSelections.type || 'promo';
          const styleId = templateSelections.style;
          const isSurprise = templateSelections.surprise;
          
          const type = FLYER_TYPES.find(t => t.id === typeId);
          const style = FLYER_STYLES.find(s => s.id === styleId);

          if (templateState.products.length > 0) {
             files = [...files, ...templateState.products.map(p => ({ file: p.file, preview: p.preview, type: 'image' }))];
          }

          if (templateState.flyerLogo) {
             files.push({ file: templateState.flyerLogo.file, preview: templateState.flyerLogo.preview, type: 'image' });
          }

          // Smart Prompt Construction for Flyers
          if (isSurprise) {
              const creativeDirectives = [
                  "bold, high-energy visuals and massive typography",
                  "a sleek, dark mode aesthetic with neon accents",
                  "an elegant, minimalist layout with plenty of whitespace",
                  "a vibrant, colorful pop-art inspired design"
              ];
              const randomDir = creativeDirectives[Math.floor(Math.random() * creativeDirectives.length)];
              command = `Design a ${type?.label || 'Marketing'} flyer that pops. Use ${randomDir}. Make it look like a global brand campaign.`;
          } else {
              command = `Design a professional ${style?.label || 'Modern'} ${type?.label || 'Marketing'} flyer. Focus on clean layout, ${styleId === 'bold' ? 'strong typography' : 'elegant aesthetics'}, and clear messaging.`;
          }

          if (templateState.products.length > 0) command += ` Feature the attached product image(s) prominently.`;
          if (templateState.flyerLogo) command += ` Include the attached Brand Logo.`;
          
          command += " Full bleed digital design, ready for print.";
      }
      else if (activeTemplate === 'INTERIOR') {
          // IMPORTANT: If customBg (Room Base) exists, it MUST be the first attachment
          // This tells the model it is the 'Reference Space'
          if (templateState.customBg) {
              files.push({ file: templateState.customBg.file, preview: templateState.customBg.preview, type: 'image' });
          }
          if (templateState.products.length > 0) {
             files = [...files, ...templateState.products.map(p => ({ file: p.file, preview: p.preview, type: 'image' }))];
          }

          const styleId = templateSelections.style || 'modern-luxury';
          const isSurprise = templateSelections.surprise;
          const style = INTERIOR_STYLES.find(s => s.id === styleId);

          // Smart Interior Prompt
          let vibe = style?.label || "Modern";
          if (isSurprise) {
              const vibes = ["Scandinavian Minimalist", "Industrial Loft", "Afro-Bohemian", "Ultra-Modern Luxury", "Warm Contemporary"];
              vibe = vibes[Math.floor(Math.random() * vibes.length)];
          }

          if (templateState.customBg) {
              // User uploaded a room
              // STRICT PRESERVATION PROMPT:
              command = `Decorate this exact room in a ${vibe} style. Maintain the exact architectural structure (walls, floor, windows) without changing them. Only add furniture and decor.`;
              
              if (templateState.products.length > 0) {
                  command = `Stage this exact room by placing the attached items into it. Keep the room structure exactly as is, do not transform the room itself.`;
              }
          } else {
              // No room uploaded (Create from scratch)
              command = `Create a photorealistic ${vibe} interior space.`;
               if (templateState.products.length > 0) {
                  command += ` Stage the room with the attached furniture items as the focal point.`;
              } else {
                  command += ` Fully furnished and decorated with impeccable taste.`;
              }
          }
      }
      
      setInput(command);
      setSelectedFiles(files.map(f => ({ file: f.file, preview: f.preview, type: 'image' })));
      setActiveTemplate(null);
      setTemplateState({ products: [], customModel: null, customBg: null, flyerLogo: null });
      setTemplateSelections({});
  };

  return (
    <div className="flex h-[100dvh] bg-atelier-cream text-atelier-charcoal font-sans overflow-hidden">
        
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-atelier-charcoal/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      {/* --- SIDEBAR --- */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onLoadSession={handleLoadSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        brand={brand}
        onSignOut={onSignOut}
        onOpenBilling={() => setShowSubscriptionModal(true)}
        onOpenSettings={() => setShowSettings(true)}
        isSubscribed={isSubscribed}
      />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-atelier-cream">
          
          <header className="h-14 md:h-16 border-b border-atelier-charcoal/10 flex items-center px-4 md:px-6 justify-between bg-white/50 backdrop-blur-sm z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 hover:bg-gray-100 transition-colors">
                       <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-display font-bold text-atelier-charcoal truncate max-w-[150px] hidden md:block">
                      Studio Interface
                  </span>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                  <div 
                    onClick={handleOpenTopUp}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all border border-atelier-charcoal/10 bg-white hover:border-atelier-orange"
                    title="Top Up Credits"
                  >
                      <div className="p-1 rounded-full bg-atelier-clay text-atelier-charcoal">
                         <Zap className="w-3 h-3 fill-current" />
                      </div>
                      <span className="text-sm font-bold font-mono text-atelier-charcoal">
                          {formatNumber(credits)}
                      </span>
                  </div>

                  <button 
                    onClick={handleNewChat}
                    className="flex items-center gap-2 bg-atelier-charcoal text-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-atelier-orange transition-colors"
                  >
                      <Plus className="w-4 h-4" />
                      <span className="hidden md:inline">New</span>
                  </button>
              </div>
          </header>

          <ChatArea 
            messages={messages}
            isLoading={isLoading}
            onTemplateSelect={setActiveTemplate}
            onImageClick={setPreviewImage}
          />

          <InputArea 
            input={input}
            setInput={setInput}
            selectedFiles={selectedFiles}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            onSend={() => handleSend()}
            onStop={handleStop}
            isLoading={isLoading}
          />
      </main>

      {/* --- MODALS --- */}
      
      <FashionModal 
        isOpen={activeTemplate === 'FASHION'} 
        onClose={() => setActiveTemplate(null)}
        templateState={templateState}
        setTemplateState={setTemplateState}
        templateSelections={templateSelections}
        setTemplateSelections={setTemplateSelections}
        executeTemplate={executeTemplate}
        handleTemplateProductsSelect={handleTemplateProductsSelect}
        handleTemplateSingleFileSelect={handleTemplateSingleFileSelect}
        removeTemplateProduct={removeTemplateProduct}
      />

      <ProductModal 
        isOpen={activeTemplate === 'PRODUCT'} 
        onClose={() => setActiveTemplate(null)}
        templateState={templateState}
        setTemplateState={setTemplateState}
        templateSelections={templateSelections}
        setTemplateSelections={setTemplateSelections}
        executeTemplate={executeTemplate}
        handleTemplateProductsSelect={handleTemplateProductsSelect}
        handleTemplateSingleFileSelect={handleTemplateSingleFileSelect}
        removeTemplateProduct={removeTemplateProduct}
      />

      <FlyerModal 
        isOpen={activeTemplate === 'FLYER'} 
        onClose={() => setActiveTemplate(null)}
        templateState={templateState}
        setTemplateState={setTemplateState}
        templateSelections={templateSelections}
        setTemplateSelections={setTemplateSelections}
        executeTemplate={executeTemplate}
        handleTemplateProductsSelect={handleTemplateProductsSelect}
        handleTemplateSingleFileSelect={handleTemplateSingleFileSelect}
        removeTemplateProduct={removeTemplateProduct}
      />

      <InteriorModal 
        isOpen={activeTemplate === 'INTERIOR'} 
        onClose={() => setActiveTemplate(null)}
        templateState={templateState}
        setTemplateState={setTemplateState}
        templateSelections={templateSelections}
        setTemplateSelections={setTemplateSelections}
        executeTemplate={executeTemplate}
        handleTemplateProductsSelect={handleTemplateProductsSelect}
        handleTemplateSingleFileSelect={handleTemplateSingleFileSelect}
        removeTemplateProduct={removeTemplateProduct}
      />

      <TopUpModal 
        isOpen={showTopUpModal} 
        onClose={() => setShowTopUpModal(false)} 
        handleTopUp={handleTopUp} 
      />

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
        handleSubscribe={handleSubscribe}
        handleCancelSubscription={handleCancelSubscription} 
        isProcessing={isProcessing} 
        isSubscribed={isSubscribed}
      />

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        brand={tempBrand}
        setBrand={setTempBrand}
        handleSave={handleSaveSettings}
        handleDeleteAccount={handleDeleteAccount}
      />

      <ImagePreviewModal 
        imageSrc={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />

    </div>
  );
};

export default ChatInterface;

import React from 'react';
import { Plus, Trash2, Settings, CreditCard, LogOut, ChevronLeft } from 'lucide-react';
import Logo from './Logo';
import { BrandProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: any[];
  activeSessionId: string;
  onLoadSession: (session: any) => void;
  onNewChat: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  brand: BrandProfile;
  onSignOut: () => void;
  onOpenBilling: () => void;
  onOpenSettings: () => void;
  isSubscribed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, onClose, sessions, activeSessionId, onLoadSession, onNewChat, onDeleteSession,
  brand, onSignOut, onOpenBilling, onOpenSettings, isSubscribed
}) => {
  return (
      <aside className={`
          fixed md:relative inset-y-0 left-0 z-30
          ${isOpen ? 'translate-x-0 w-[80%] md:w-80' : '-translate-x-full md:translate-x-0 md:w-0'} 
          bg-white border-r border-atelier-charcoal/10 transition-all duration-300 ease-in-out
          flex flex-col shadow-2xl md:shadow-none
      `}>
          <div className="p-6 md:p-8 flex items-center justify-between">
              <Logo size="sm" showText={true} />
              <button className="md:hidden p-2" onClick={onClose}>
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
          </div>
          
          <div className="px-6 pb-6">
              <button 
                onClick={onNewChat}
                className="w-full py-4 bg-atelier-charcoal text-white hover:bg-atelier-orange transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                  <Plus className="w-4 h-4" /> New Project
              </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
              <div className="px-4 py-2 text-[10px] font-mono font-extrabold uppercase text-gray-600 tracking-widest">Recent</div>
              {sessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => onLoadSession(session)}
                    className={`group relative px-4 py-3 cursor-pointer transition-all border-l-2 flex justify-between items-center ${activeSessionId === session.id ? 'border-atelier-orange bg-atelier-cream' : 'border-transparent hover:bg-gray-50'}`}
                  >
                      <p className={`text-sm font-bold truncate max-w-[160px] ${activeSessionId === session.id ? 'text-atelier-charcoal' : 'text-gray-700'}`}>
                          {session.title || "Untitled Project"}
                      </p>
                      
                      <button 
                        onClick={(e) => onDeleteSession(e, session.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 z-20 flex-shrink-0"
                        title="Delete Chat"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
              ))}
          </div>

          <div className="p-6 border-t border-atelier-charcoal/10 bg-gray-50 space-y-4">
              <div className="flex flex-col gap-2">
                   <button 
                    onClick={onOpenBilling}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-md w-full transition-colors ${isSubscribed ? 'bg-atelier-orange/10 text-atelier-orange border border-atelier-orange/20' : 'text-atelier-charcoal hover:bg-gray-100'}`}
                   >
                       <CreditCard className={`w-4 h-4 ${isSubscribed ? 'text-atelier-orange' : 'text-gray-500'}`} />
                       <div className="flex flex-col items-start">
                           <span className="leading-none">{isSubscribed ? 'Pro Plan Active' : 'Billing & Plan'}</span>
                           {isSubscribed && <span className="text-[10px] opacity-70 font-medium mt-1">Manage Subscription</span>}
                       </div>
                   </button>

                   <button 
                    onClick={onOpenSettings} 
                    className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-atelier-charcoal hover:bg-gray-100 rounded-md w-full transition-colors"
                   >
                       <Settings className="w-4 h-4 text-gray-500" />
                       Settings
                   </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                   <div className="flex items-center gap-3">
                       {brand.logoUrl ? (
                          <img src={brand.logoUrl} className="w-8 h-8 rounded-full object-cover border border-atelier-charcoal/10" alt="Brand" />
                       ) : (
                          <div className="w-8 h-8 bg-atelier-charcoal text-white flex items-center justify-center font-bold font-display rounded-full text-xs">
                              {brand.name.substring(0, 2).toUpperCase()}
                          </div>
                       )}
                       <div className="flex flex-col">
                           <span className="text-xs md:text-sm font-bold truncate max-w-[100px] text-atelier-charcoal">{brand.name}</span>
                           <span className="text-[10px] text-gray-600 font-mono font-bold">
                               Studio Account
                           </span>
                       </div>
                   </div>
                   
                   <button onClick={onSignOut} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full">
                      <LogOut className="w-4 h-4" />
                   </button>
              </div>
          </div>
      </aside>
  );
};

export default Sidebar;
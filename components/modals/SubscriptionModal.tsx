import React from 'react';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { PRICING_PLANS } from '../../data/constants';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubscribe: () => void;
  handleCancelSubscription: () => void;
  isProcessing: boolean;
  isSubscribed: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, onClose, handleSubscribe, handleCancelSubscription, isProcessing, isSubscribed 
}) => {
  const formattedCredits = new Intl.NumberFormat('en-US').format(PRICING_PLANS.SUBSCRIPTION.CREDITS);

  if (isSubscribed) {
      return (
          <Modal isOpen={isOpen} onClose={onClose} title="My Subscription" size="md">
              <div className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">Active Subscription</h2>
                  <p className="text-gray-600 font-medium mb-8">You are currently subscribed to the Pro Studio Plan.</p>

                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left">
                       <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-atelier-charcoal">Pro Studio Plan</span>
                           <span className="font-mono text-sm font-bold">{PRICING_PLANS.SUBSCRIPTION.PRICE}/mo</span>
                       </div>
                       <div className="text-xs text-gray-500 font-bold mb-4">Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                       <div className="flex gap-2 text-xs font-bold text-gray-600">
                           <span className="bg-white border px-2 py-1 rounded">{formattedCredits} Credits/mo</span>
                       </div>
                  </div>

                  <button 
                      onClick={handleCancelSubscription}
                      disabled={isProcessing}
                      className="text-red-500 text-sm font-bold hover:bg-red-50 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                      {isProcessing ? 'Processing...' : 'Cancel Subscription'}
                  </button>
              </div>
          </Modal>
      )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Membership" size="md">
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
           <h2 className="text-3xl font-display font-bold mb-2">Unlock Full Access</h2>
           <p className="text-gray-600 font-medium max-w-md mb-8 leading-relaxed">
               One simple plan. Everything you need to run your creative studio.
           </p>

           <div className="w-full bg-white border-2 border-atelier-charcoal rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 bg-atelier-orange text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">
                   Most Popular
               </div>
               
               <div className="text-center mb-6">
                   <h3 className="text-lg font-bold uppercase tracking-widest text-gray-500 mb-2">Pro Studio Plan</h3>
                   <div className="flex items-center justify-center gap-1">
                       <span className="text-5xl font-display font-bold text-atelier-charcoal">{PRICING_PLANS.SUBSCRIPTION.PRICE}</span>
                       <span className="text-gray-400 font-bold mt-4">/mo</span>
                   </div>
               </div>
               
               <div className="h-px bg-gray-100 w-full mb-6"></div>

               <ul className="space-y-4 text-left max-w-xs mx-auto">
                   <li className="flex items-center gap-3 text-base font-bold text-atelier-charcoal">
                       <div className="w-6 h-6 rounded-full bg-atelier-green/10 flex items-center justify-center text-atelier-charcoal">
                           <Zap className="w-4 h-4 fill-atelier-orange text-atelier-orange" />
                       </div>
                       {formattedCredits} Credits
                   </li>
                   <li className="flex items-center gap-3 text-base font-bold text-atelier-charcoal">
                       <div className="w-6 h-6 rounded-full bg-atelier-blue/10 flex items-center justify-center">
                           <Sparkles className="w-4 h-4 text-atelier-blue" />
                       </div>
                       4K Generations
                   </li>
               </ul>
           </div>

           <button 
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full md:w-auto px-12 py-4 bg-atelier-charcoal text-white font-bold uppercase tracking-widest hover:bg-atelier-orange transition-colors flex items-center justify-center gap-2 shadow-lg"
           >
               {isProcessing ? 'Processing...' : 'SUBSCRIBE NOW'}
           </button>
           
           <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
               Secured by Paystack. Cancel anytime.
           </p>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
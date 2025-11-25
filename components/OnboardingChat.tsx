
import * as React from 'react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandProfile } from '../types';
import Logo from './Logo';

interface OnboardingChatProps {
  onComplete: (profile: BrandProfile) => void;
}

const OnboardingChat: React.FC<OnboardingChatProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onComplete({
        name: 'My Brand',
        industry: 'General',
        tone: 'Professional',
        description: 'Brand Store',
        applyBrandTone: false // Default to off
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-atelier-cream text-atelier-charcoal font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Abstract Background Element */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-atelier-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-atelier-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-atelier-charcoal/10 p-12 shadow-2xl relative z-10 animate-fade-up">
        
        <div className="flex flex-col items-center mb-12">
            <Logo size="lg" showText={false} />
            <h1 className="mt-8 text-4xl font-display font-bold tracking-tight text-center">
                Access
            </h1>
        </div>
        
        <div className="space-y-6">
             <button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full h-14 bg-atelier-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-atelier-orange transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isLoading ? 'Verifying...' : 'Sign in with Google'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 font-medium leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-atelier-charcoal">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-atelier-charcoal">Privacy Policy</a>.
            </p>
        </div>

      </div>
    </div>
  );
};

export default OnboardingChat;

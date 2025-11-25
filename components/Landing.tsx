
import * as React from 'react';
import { ArrowRight, ArrowUpRight, Circle, Square, Triangle } from 'lucide-react';
import Logo from './Logo';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const marqueeItems = [
    "Fashion Photography",
    "Product Photoshoot",
    "Flyer Marketing",
    "Realistic African AI Models",
    "AI Generated Visuals",
    "Chat To Edit",
    "Home Staging",
    "Sales Ads",
    "Promo Ads"
  ];

  return (
    <div className="min-h-screen bg-atelier-cream text-atelier-charcoal font-sans overflow-x-hidden selection:bg-atelier-orange selection:text-white">
      
      {/* Navigation - Minimalist Border Bottom */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-atelier-cream/90 backdrop-blur-sm border-b border-atelier-charcoal/10 px-6 py-4 flex justify-between items-center">
        <Logo size="md" />
        <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-6 font-sans text-sm font-bold tracking-wide">
                <a href="#" className="hover:text-atelier-orange transition-colors">How it Works</a>
                <a href="#" className="hover:text-atelier-orange transition-colors">Examples</a>
                <a href="#" className="hover:text-atelier-orange transition-colors">Pricing</a>
            </div>
            <button 
                onClick={onGetStarted}
                className="bg-atelier-charcoal text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-atelier-orange transition-colors rounded-none"
            >
                Start For Free
            </button>
        </div>
      </nav>

      {/* Hero Section - Asymmetrical Split */}
      <section className="pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-8 animate-fade-up">
                <div className="flex items-center gap-4">
                    <span className="w-12 h-[1px] bg-atelier-orange"></span>
                    <span className="text-atelier-orange font-mono text-xs font-bold uppercase tracking-widest">Your AI Creative Studio</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] font-display font-bold tracking-tight text-atelier-charcoal">
                    Make Your <br/>
                    <span className="italic font-light text-atelier-blue">Brand Pop</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-atelier-charcoal max-w-xl font-medium leading-relaxed">
                    Transform your outfits, products, or designs into stunning 4K photoshoots and digital marketing visuals instantly
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                        onClick={onGetStarted}
                        className="group flex items-center gap-4 bg-atelier-orange text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-atelier-charcoal transition-all"
                    >
                        Try It Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex items-center gap-4 border border-atelier-charcoal text-atelier-charcoal px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-atelier-clay transition-all">
                        See Examples
                    </button>
                </div>
            </div>

            {/* Visual - Geometric Mask */}
            <div className="lg:col-span-5 relative h-[600px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-atelier-blue rounded-t-[300px] translate-x-4 translate-y-4"></div>
                <div className="absolute inset-0 overflow-hidden rounded-t-[300px] border border-atelier-charcoal">
                    <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" 
                        alt="Editorial Fashion" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-10 -left-10 bg-atelier-cream border border-atelier-charcoal p-6 max-w-xs shadow-lg hidden md:block">
                    <p className="font-display font-bold text-xl mb-2">"Pure Magic"</p>
                    <p className="font-mono text-xs text-gray-600 font-bold uppercase">
                        Shot on a phone. Fixed by AI. Ready to post.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Marquee - Clean Typography */}
      <div className="border-y border-atelier-charcoal overflow-hidden py-6 bg-white relative z-10">
        <div className="flex animate-marquee whitespace-nowrap w-max" style={{ willChange: 'transform' }}>
            {/* Duplicated for seamless loop (0% to -50%) */}
            {[...marqueeItems, ...marqueeItems].map((text, index) => (
                <div key={index} className="flex items-center gap-6 mx-12">
                    <span className="text-4xl font-display font-bold text-atelier-charcoal tracking-tight">{text}</span>
                    
                    {/* Strategic Separators */}
                    {index % 3 === 0 && <Circle className="w-3 h-3 fill-atelier-orange text-atelier-orange" />}
                    {index % 3 === 1 && <Square className="w-3 h-3 fill-atelier-blue text-atelier-blue" />}
                    {index % 3 === 2 && <Triangle className="w-3 h-3 fill-atelier-charcoal text-atelier-charcoal" />}
                </div>
            ))}
        </div>
      </div>

      {/* Grid Features */}
      <section className="py-32 px-6 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-atelier-charcoal/20">
              
              {/* Card 1 */}
              <div className="border-r border-b border-atelier-charcoal/20 p-12 hover:bg-white transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-atelier-clay mb-8 flex items-center justify-center rounded-full group-hover:bg-atelier-orange transition-colors">
                      <Square className="w-5 h-5 text-atelier-charcoal group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Instant<br/>Photoshoot</h3>
                  <p className="text-gray-800 font-medium leading-relaxed mb-8">
                      Upload your product or outfit, choose a style, or describe your idea, and get a 4K studio quality photo instantly. Professional lighting, realistic locations, and African AI models with natural skin tones and expressions. Chat to make changes.
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest border-b border-atelier-charcoal pb-1 group-hover:text-atelier-orange group-hover:border-atelier-orange transition-colors">Try Photoshoot</span>
              </div>

              {/* Card 2 */}
              <div className="border-r border-b border-atelier-charcoal/20 p-12 hover:bg-white transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-atelier-clay mb-8 flex items-center justify-center rounded-full group-hover:bg-atelier-blue transition-colors">
                      <Circle className="w-5 h-5 text-atelier-charcoal group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Home<br/>Staging</h3>
                  <p className="text-gray-800 font-medium leading-relaxed mb-8">
                      Upload your space, add items/furnitures or describe your idea. Choose the vibe, or let AI surprise you, and get a decorated room instantly. Chat to refine for the perfect look.
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest border-b border-atelier-charcoal pb-1 group-hover:text-atelier-blue group-hover:border-atelier-blue transition-colors">Try Staging</span>
              </div>

              {/* Card 3 */}
              <div className="border-r border-b border-atelier-charcoal/20 p-12 hover:bg-white transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-atelier-clay mb-8 flex items-center justify-center rounded-full group-hover:bg-atelier-charcoal transition-colors">
                      <Triangle className="w-5 h-5 text-atelier-charcoal group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Marketing<br/>Material</h3>
                  <p className="text-gray-800 font-medium leading-relaxed mb-8">
                      Need an Instagram post, flyer, or Story? Generate them instantly. AI remembers your branding, keeping everything consistent, beautiful, and ready to post.
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest border-b border-atelier-charcoal pb-1 group-hover:text-atelier-charcoal group-hover:border-atelier-charcoal transition-colors">Create Campaign</span>
              </div>

          </div>
      </section>

      {/* Showcase Gallery */}
      <section className="bg-atelier-charcoal text-atelier-cream py-32 px-6">
          <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                  <h2 className="text-6xl md:text-8xl font-display font-bold">Look At<br/>These</h2>
                  <p className="max-w-md text-gray-400 mt-8 md:mt-0 font-medium">
                      Real business owners used our app to make these. They look expensive and were generated in seconds.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
                  ].map((src, i) => (
                      <div key={i} className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
                          <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowUpRight className="w-12 h-12 text-white drop-shadow-lg" />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center bg-atelier-cream">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-12 text-atelier-charcoal">
              Ready to <br/>
              Stand <span className="text-atelier-orange italic">Out?</span>
          </h2>
          <button 
            onClick={onGetStarted}
            className="bg-atelier-charcoal text-white px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-atelier-blue transition-colors shadow-xl"
        >
            Start Creating Now
        </button>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-white border-t border-atelier-charcoal/10 py-12 px-6">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <Logo size="sm" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
                  Made with ❤️ for Africa commerce
              </div>
          </div>
      </footer>

    </div>
  );
};

export default Landing;

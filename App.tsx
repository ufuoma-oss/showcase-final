
import React, { useState } from 'react';
import Landing from './components/Landing';
import OnboardingChat from './components/OnboardingChat';
import ChatInterface from './components/ChatInterface';
import { BrandProfile } from './types';

enum AppState {
  LANDING,
  ONBOARDING,
  DASHBOARD
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [brand, setBrand] = useState<BrandProfile | null>(null);

  const handleGetStarted = () => {
    setAppState(AppState.ONBOARDING);
  };

  const handleOnboardingComplete = (profile: BrandProfile) => {
    setBrand(profile);
    setAppState(AppState.DASHBOARD);
  };

  const handleSignOut = () => {
    setBrand(null);
    setAppState(AppState.LANDING);
  };

  return (
    <>
      {appState === AppState.LANDING && (
        <Landing onGetStarted={handleGetStarted} />
      )}

      {appState === AppState.ONBOARDING && (
        <OnboardingChat onComplete={handleOnboardingComplete} />
      )}

      {appState === AppState.DASHBOARD && brand && (
        <ChatInterface 
          brand={brand} 
          onUpdateBrand={setBrand}
          onSignOut={handleSignOut} 
        />
      )}
    </>
  );
};

export default App;

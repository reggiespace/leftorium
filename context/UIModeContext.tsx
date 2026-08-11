import React, { createContext, useContext, useState } from 'react';

// The site's two running jokes: a Righty/Lefty toggle (defaults to the
// comfortable Lefty layout — flipping to Righty rearranges everything and
// nags you) and a footer link that mirrors the whole page. Neither
// persists anywhere; it's per-visit, like the original DC prototype.

interface UIModeContextValue {
  righty: boolean;
  toggleRighty: () => void;
  mirror: boolean;
  toggleMirror: () => void;
}

const UIModeContext = createContext<UIModeContextValue | undefined>(undefined);

export const UIModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [righty, setRighty] = useState(false);
  const [mirror, setMirror] = useState(false);

  const value: UIModeContextValue = {
    righty,
    toggleRighty: () => setRighty((r) => !r),
    mirror,
    toggleMirror: () => setMirror((m) => !m),
  };

  return (
    <UIModeContext.Provider value={value}>
      <div
        dir={righty ? 'rtl' : 'ltr'}
        style={{
          minHeight: '100vh',
          transition: 'filter .25s ease, transform .4s ease',
          transform: mirror ? 'scaleX(-1)' : undefined,
          filter: righty ? 'blur(.28px) contrast(.96)' : undefined,
        }}
      >
        {children}
      </div>
    </UIModeContext.Provider>
  );
};

export const useUIMode = (): UIModeContextValue => {
  const ctx = useContext(UIModeContext);
  if (!ctx) throw new Error('useUIMode must be used within UIModeProvider');
  return ctx;
};

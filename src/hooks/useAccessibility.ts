import { useState, useEffect, useCallback } from 'react';

export type TextScale = 'normal' | 'large' | 'xlarge';

export function useAccessibility() {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('planguard_a11y_contrast') === 'high';
  });

  const [textScale, setTextScale] = useState<TextScale>(() => {
    return (localStorage.getItem('planguard_a11y_textscale') as TextScale) || 'normal';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('planguard_a11y_motion') === 'reduced';
  });

  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('planguard_a11y_contrast', highContrast ? 'high' : 'normal');
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('planguard_a11y_textscale', textScale);
    document.documentElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    document.documentElement.classList.add(`text-scale-${textScale}`);
  }, [textScale]);

  useEffect(() => {
    localStorage.setItem('planguard_a11y_motion', reducedMotion ? 'reduced' : 'normal');
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const announce = useCallback((message: string) => {
    setLiveAnnouncement(message);
    // clear after 4 seconds
    setTimeout(() => {
      setLiveAnnouncement('');
    }, 4000);
  }, []);

  return {
    highContrast,
    setHighContrast,
    textScale,
    setTextScale,
    reducedMotion,
    setReducedMotion,
    liveAnnouncement,
    announce,
  };
}

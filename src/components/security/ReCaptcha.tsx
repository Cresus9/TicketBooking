import React, { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function ReCaptcha({ onVerify, onError }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      window.onRecaptchaLoad = () => {
        if (containerRef.current) {
          window.grecaptcha.render(containerRef.current, {
            sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
            callback: onVerify,
            'error-callback': onError
          });
        }
      };
      
      script.onload = window.onRecaptchaLoad;
      document.head.appendChild(script);
    } else if (containerRef.current) {
      window.grecaptcha.render(containerRef.current, {
        sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
        callback: onVerify,
        'error-callback': onError
      });
    }

    return () => {
      // Cleanup
      if (window.grecaptcha && window.grecaptcha.reset) {
        window.grecaptcha.reset();
      }
    };
  }, [onVerify, onError]);

  return <div ref={containerRef} className="mt-4" />;
}
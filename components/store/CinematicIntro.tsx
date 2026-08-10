'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SCENE_DURATION = 2000; // ms per scene

export default function CinematicIntro() {
  const [show, setShow] = useState(false);
  const [scene, setScene] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 2. Persistent storage check
    const isCompleted = localStorage.getItem('introCompleted') === 'true';

    if (isCompleted || prefersReducedMotion) {
      setShow(false);
      return;
    }

    // Set show state to true and block page scroll
    setShow(true);
    document.documentElement.classList.add('intro-active');

    // Scene Timeline Controller
    const timer1 = setTimeout(() => setScene(2), SCENE_DURATION);
    const timer2 = setTimeout(() => setScene(3), SCENE_DURATION * 2);
    const timer3 = setTimeout(() => setScene(4), SCENE_DURATION * 3.5);
    const timer4 = setTimeout(() => setScene(5), SCENE_DURATION * 4.5);
    
    // Trigger fade-out transition before final removal
    const timer5 = setTimeout(() => {
      setFadeOut(true);
    }, SCENE_DURATION * 5.2);

    // Complete the intro and restore scroll
    const timer6 = setTimeout(() => {
      handleComplete();
    }, SCENE_DURATION * 5.7);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      localStorage.setItem('introCompleted', 'true');
      document.documentElement.classList.remove('intro-active');
      setShow(false);
      
      // Clean up browser history so back navigation is protected
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 500);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-stone-950 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-out-expo ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic styles injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html.intro-active, html.intro-active body {
              overflow: hidden !important;
              height: 100% !important;
              position: fixed !important;
              width: 100% !important;
            }
            
            .ease-out-expo {
              transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            @keyframes kenburns {
              0% { transform: scale(1.05) translate(0, 0); }
              100% { transform: scale(1.15) translate(-1%, -1%); }
            }
            
            .animate-kenburns {
              animation: kenburns 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate;
            }

            @keyframes shimmer-line {
              0% { transform: scaleX(0); opacity: 0; }
              50% { transform: scaleX(1); opacity: 0.8; }
              100% { transform: scaleX(0); opacity: 0; }
            }

            .animate-shimmer-line {
              animation: shimmer-line 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
            }
          `
        }}
      />

      {/* Subtle Skip Control */}
      <button
        onClick={handleComplete}
        className="absolute top-6 right-6 z-50 px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all select-none"
      >
        Skip Intro &rarr;
      </button>

      {/* Warm Ambient Backdrop Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/15 via-transparent to-transparent pointer-events-none" />

      {/* SCENE 1: ARRIVAL */}
      {scene === 1 && (
        <div className="text-center px-4 animate-fade-in space-y-4">
          <p className="font-display italic text-lg sm:text-xl text-stone-300 tracking-wide">
            A culinary journey begins...
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto animate-shimmer-line" />
        </div>
      )}

      {/* SCENE 2: BRAND REVEAL */}
      {scene === 2 && (
        <div className="text-center px-4 space-y-6 max-w-sm animate-fade-in">
          <div className="relative w-28 h-28 mx-auto filter drop-shadow-[0_4px_12px_rgba(212,150,26,0.25)] animate-scale-in">
            <Image
              src="/logo.png"
              alt="Foody Cloud Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-4xl font-black text-white tracking-tight">
              Foody Cloud
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500 font-bold">
              Homely Taste, Every Time
            </p>
          </div>
        </div>
      )}

      {/* SCENE 3: FOOD REVEAL (Ken Burns slides) */}
      {scene === 3 && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 animate-kenburns">
            <Image
              src="https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=80"
              alt="Special Thali close-up"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-20 text-center px-4 max-w-lg space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
              Our Food philosophy
            </h2>
            <p className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
              Pure vegetarian meals crafted with absolute care.
            </p>
          </div>
        </div>
      )}

      {/* SCENE 4: HERITAGE & EXPERIENCE */}
      {scene === 4 && (
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 animate-kenburns" style={{ animationDelay: '1s' }}>
            <Image
              src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80"
              alt="Paneer paratha close-up"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-20 text-center px-4 max-w-lg space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
              Fresh Daily
            </h2>
            <p className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
              Prepared in small batches to ensure that authentic homely taste.
            </p>
          </div>
        </div>
      )}

      {/* SCENE 5: FINAL MOTTO & TRANSITION CLIMAX */}
      {scene === 5 && (
        <div className="text-center px-4 space-y-8 animate-fade-in">
          <div className="relative w-20 h-20 mx-auto filter drop-shadow-[0_2px_8px_rgba(212,150,26,0.15)]">
            <Image
              src="/logo.png"
              alt="Foody Cloud Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Welcome to Foody Cloud
            </h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              Sit back and enjoy the warmth of homemade goodness.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

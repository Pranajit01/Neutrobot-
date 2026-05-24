import React, { useEffect, useRef } from 'react';

// Helper for random colors
const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;
    let autoMoveInterval: any = null;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // We use the specific build from the CDN as it contains the exact effect requested
        // Using native dynamic import which works in modern browsers
        // @ts-ignore
        const module = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#DB4A2B", "#F8A348", "#FF89A9"],
            lights: {
              intensity: 150,
              colors: ["#DB4A2B", "#F8A348", "#FF89A9", "#1E1E1E"]
            }
          }
        });

        tubesRef.current = app;

        // Detect if user is on mobile/touch device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
          || ('ontouchstart' in window) 
          || (navigator.maxTouchPoints > 0);

        if (isMobile) {
          let angle = 0;
          autoMoveInterval = setInterval(() => {
            if (!canvasRef.current) return;
            angle += 0.012; // slow, natural speed
            
            // Calculate a smooth Lissajous curve path for the tubes to follow
            const x = window.innerWidth / 2 + Math.sin(angle * 0.7) * (window.innerWidth * 0.35);
            const y = window.innerHeight / 2 + Math.cos(angle * 1.1) * (window.innerHeight * 0.35);
            
            const eventConfig = {
              clientX: x,
              clientY: y,
              bubbles: true
            };
            
            const pEvent = new PointerEvent('pointermove', eventConfig);
            const mEvent = new MouseEvent('mousemove', eventConfig);
            
            // Dispatch events to trigger the library's movement listeners
            canvasRef.current.dispatchEvent(pEvent);
            window.dispatchEvent(pEvent);
            canvasRef.current.dispatchEvent(mEvent);
            window.dispatchEvent(mEvent);
          }, 32); // 30 FPS update rate
        }

        const handleResize = () => {
          // Typically handled by library.
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (autoMoveInterval) {
            clearInterval(autoMoveInterval);
          }
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    try {
      tubesRef.current.tubes.setColors(colors);
      tubesRef.current.tubes.setLightsColors(lightsColors);
    } catch (err) {
      console.warn("Failed to set random colors on tubes:", err);
    }
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden bg-transparent ${className || ''}`}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block opacity-30 mix-blend-multiply pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;

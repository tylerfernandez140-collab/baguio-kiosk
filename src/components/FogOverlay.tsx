import { useKiosk } from '@/context/KioskContext';

const FogOverlay = () => {
  const { theme } = useKiosk();
  const isDark = theme === 'night';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Fog layer 1 - bottom heavy */}
      <div
        className="fog-layer-1 absolute bottom-0 left-0 w-[120%] h-[40%]"
        style={{
          background: isDark
            ? 'linear-gradient(to top, hsl(220 20% 10% / 0.6), transparent)'
            : 'linear-gradient(to top, hsl(200 30% 95% / 0.5), transparent)',
          filter: 'blur(30px)',
        }}
      />
      {/* Fog layer 2 - mid section */}
      <div
        className="fog-layer-2 absolute bottom-[10%] left-[-5%] w-[110%] h-[30%]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, hsl(220 15% 15% / 0.4), transparent)'
            : 'radial-gradient(ellipse at center, hsl(200 40% 92% / 0.4), transparent)',
          filter: 'blur(25px)',
        }}
      />
      {/* Fog layer 3 - subtle wisp */}
      <div
        className="fog-layer-3 absolute bottom-[20%] right-[-5%] w-[80%] h-[25%]"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, hsl(200 30% 20% / 0.3), transparent)'
            : 'radial-gradient(ellipse at center, hsl(200 50% 90% / 0.35), transparent)',
          filter: 'blur(35px)',
        }}
      />
    </div>
  );
};

export default FogOverlay;

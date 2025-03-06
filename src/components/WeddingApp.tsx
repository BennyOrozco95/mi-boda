import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Play, Pause, Settings } from 'lucide-react';
import Image from 'next/image';

// Definir interfaces
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  contrast: string;
  accent: string;
}

interface ColorThemeContextType {
  colors: ColorTheme;
  updateColor: (colorKey: keyof ColorTheme, value: string) => void;
  isColorPanelOpen: boolean;
  toggleColorPanel: () => void;
}

// Estilos globales para animaciones
const GlobalStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes flipDown {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(-90deg); }
      }
      
      @keyframes flipUp {
        0% { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
      }
      
      @keyframes pulse {
        0% { opacity: 0; }
        50% { opacity: 0.3; }
        100% { opacity: 0; }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes shine {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255,255,255,0.5); }
        50% { box-shadow: 0 0 20px rgba(255,255,255,0.8); }
        100% { box-shadow: 0 0 5px rgba(255,255,255,0.5); }
      }
      
      @keyframes countUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes countDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
      }
      
      @keyframes fadeInUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `}</style>
  );
};

// Crear contexto para los colores
const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

// Componente proveedor del tema de colores
const ColorThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [colors, setColors] = useState<ColorTheme>({
    primary: '#a85d31',      // Principal - botones, encabezados, elementos destacados
    secondary: '#e0c9b8',    // Secundario - fondos de secciones, detalles sutiles
    background: '#f5f0ed',   // Fondo - aspecto limpio y elegante
    contrast: '#4a2c1d',     // Contraste - textos, bordes
    accent: '#d97b4a',       // Acento - llamadas a la acción, íconos
  });

  // Esta variable la mantenemos para la funcionalidad interna,
  // pero nunca se mostrará el panel
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);

  // Establecer variables CSS para colores
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-background', colors.background);
    document.documentElement.style.setProperty('--color-contrast', colors.contrast);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    
    // También actualizar clases específicas de Tailwind dinamicamente
    document.documentElement.style.setProperty('--stone-500', colors.primary);
    document.documentElement.style.setProperty('--stone-400', colors.accent);
    document.documentElement.style.setProperty('--stone-600', colors.contrast);
    document.documentElement.style.setProperty('--stone-700', colors.contrast);
    document.documentElement.style.setProperty('--stone-100', colors.secondary);
    document.documentElement.style.setProperty('--white', colors.background);
  }, [colors]);

  // Actualizar un color individual
  const updateColor = (colorKey: keyof ColorTheme, value: string) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  // Alternar panel de colores (no se usará en la interfaz)
  const toggleColorPanel = () => {
    setIsColorPanelOpen(prev => !prev);
  };

  return (
    <ColorThemeContext.Provider value={{ colors, updateColor, isColorPanelOpen, toggleColorPanel }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema de colores
const useColorTheme = (): ColorThemeContextType => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};

// Componente de dígito animado para el contador
// Componente del reloj elegante para el contador
const ClockDigit: React.FC<{value: number, label: string}> = ({ value, label }) => {
  const [prevValue, setPrevValue] = useState(value);
  const { colors } = useColorTheme();
  
  useEffect(() => {
    if (prevValue !== value) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  // Asegurar que el valor tenga dos dígitos
  const formattedValue = value < 10 ? `0${value}` : `${value}`;
  const formattedPrevValue = prevValue < 10 ? `0${prevValue}` : `${prevValue}`;
  
  // Separar los dígitos para animarlos individualmente
  const digits = formattedValue.split('');
  const prevDigits = formattedPrevValue.split('');
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="flex overflow-hidden rounded-lg" 
        style={{ 
          background: `linear-gradient(145deg, ${colors.contrast}80, ${colors.contrast}60)`,
          boxShadow: `0 4px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.15)`,
        }}
      >
        {digits.map((digit, i) => (
          <div key={i} className="relative w-6 sm:w-9 md:w-12 lg:w-16 overflow-hidden">
            <div 
              className="w-full h-12 sm:h-16 md:h-20 lg:h-24 flex items-center justify-center"
              style={{ 
                background: digit !== prevDigits[i] 
                  ? `linear-gradient(to bottom, ${colors.primary}40, ${colors.contrast}60)` 
                  : `linear-gradient(to bottom, ${colors.contrast}70, ${colors.contrast}50)`,
                transition: 'background 1s ease-out'
              }}
            >
              <div 
                className={`text-lg sm:text-2xl md:text-4xl lg:text-5xl font-light transition-all duration-700 ease-in-out ${
                  digit !== prevDigits[i] ? 'transform -translate-y-1 scale-110' : ''
                }`}
                style={{ 
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.5)',
                }}
              >
                {digit}
              </div>
            </div>
            {/* Línea decorativa del dígito */}
            <div 
              className="absolute bottom-0 left-0 w-full h-1"
              style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}
            ></div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs sm:text-sm uppercase tracking-widest font-medium" style={{ 
        color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)'
      }}>
        {label}
      </div>
    </div>
  );
}

// Componente principal de la aplicación
const WeddingApp: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 26,
    hours: 18,
    minutes: 25,
    seconds: 44
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const { colors } = useColorTheme();

  // Countdown Timer Setup
  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const weddingDate: number = new Date('2025-05-17T13:30:00').getTime();
      const now: number = new Date().getTime();
      const difference: number = weddingDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Audio player setup - only plays when button is clicked
  useEffect(() => {
    if (audioRef.current) {
      // Set initial volume
      audioRef.current.volume = 0.2;
      
      // Add progress tracking
      const updateProgress = () => {
        if (audioRef.current) {
          const duration = audioRef.current.duration;
          const currentTime = audioRef.current.currentTime;
          if (duration > 0) {
            setAudioProgress((currentTime / duration) * 100);
          }
        }
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-serif" style={{ color: colors.contrast, backgroundColor: colors.background }}>
      {/* Hero Section */}
      <section className="relative w-full" style={{ height: "calc(70vh - 0px)" }}>
        <div className="relative w-full h-full">
          <Image
            src="/images/IMG_3349.jpg"
            alt="Wedding background"
            fill
            priority
            quality={100}
            className="object-cover"
            objectPosition="center center"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(to bottom, ${colors.contrast}40, ${colors.contrast}60)`,
          }}></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-3 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 md:mb-12 font-light"
              style={{ textShadow: `0 2px 4px ${colors.contrast}80` }}>
            PAOLA<span className="font-light">&</span>RUBEN
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.2em] sm:tracking-[0.3em] mb-8 sm:mb-12 md:mb-16"
             style={{ textShadow: `0 1px 2px ${colors.contrast}80` }}>
            SAVE THE DATE
          </p>
          
          {/* Contador elegante y animado */}
          <div className="relative">
            {/* Decoración en forma de línea elegante */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-px" style={{ 
              background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` 
            }}></div>
            
            {/* Contador elegante y animado - diseño mejorado */}
            <div className="relative">
              {/* Decoración en forma de línea elegante */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-px" style={{ 
                background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` 
              }}></div>
              
              <div className="flex flex-row justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-lg mx-auto">
                <ClockDigit value={timeLeft.days} label="DÍAS" />
                <ClockDigit value={timeLeft.hours} label="HORAS" />
                <ClockDigit value={timeLeft.minutes} label="MIN" />
                <ClockDigit value={timeLeft.seconds} label="SEG" />
              </div>
              
              {/* Decoración en forma de línea elegante */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-px" style={{ 
                background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` 
              }}></div>
            </div>
            
            {/* Decoración en forma de línea elegante */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-px" style={{ 
              background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` 
            }}></div>
          </div>
        </div>
      </section>

      {/* Quote Section with Audio Player */}
      <section className="py-10 sm:py-12 md:py-16" style={{ backgroundColor: colors.background }}>
      <h2 className="text-lg sm:text-xl md:text-2xl italic text-center mb-8 sm:mb-12 md:mb-16" style={{ color: colors.primary }}>Nos complace invitarles a celebrar nuestra union</h2>

        <div className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-center px-4 sm:px-6">
          <div className="italic text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed" style={{ color: colors.contrast }}>
            "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, 
            quieres que el resto de tu vida <span className="font-semibold">empiece lo antes posible</span>"
          </div>
          
          {/* Subtle Audio Player */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <audio ref={audioRef} loop>
              <source src="/music/fonseca.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlayPause} 
                className="p-2 transition-colors"
                aria-label={isPlaying ? "Pause music" : "Play music"}
                style={{ color: colors.accent }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              
              <div className="w-16 sm:w-24 md:w-36 h-0.5 relative" style={{ backgroundColor: colors.secondary }}>
                <div 
                  className="absolute top-0 left-0 h-full" 
                  style={{ width: `${audioProgress}%`, backgroundColor: colors.accent }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image section */}
      <section className="w-full">
        <div className="relative w-full" style={{ height: "400px" }}>
          <Image
            src="/images/IMG_3314.jpg"
            alt="Couple walking"
            fill
            quality={100}
            className="object-cover"
            objectPosition="50% 30%" 
            sizes="100vw"
            unoptimized
          />
        </div>
      </section>

      {/* Date Display in Elegant Typography */}
<section className="py-8 sm:py-10 md:py-12 text-center relative overflow-hidden" style={{ backgroundColor: colors.background }}>
  {/* Elemento decorativo (línea vertical) - ajustado para móviles */}
  <div 
    className="absolute h-16 sm:h-20 md:h-24 w-px left-1/2 transform -translate-x-1/2" 
    style={{ backgroundColor: colors.primary, opacity: 0.3 }}
  ></div>
  
  <div className="container mx-auto px-3 sm:px-4">
    <div className="relative max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      {/* Etiqueta de evento - ajustada para móviles */}
      <div className="mb-2 sm:mb-3 md:mb-4">
        <span 
          className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 text-xs tracking-widest uppercase"
          style={{ color: colors.primary }}
        >

        </span>
      </div>
      
      {/* Contenedor principal de la fecha - optimizado para móviles */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 md:space-x-6">
        {/* Día - tamaño ajustado para móviles */}
        <div className="relative mb-1 sm:mb-0">
          <span 
            className="block text-6xl sm:text-7xl md:text-8xl font-light leading-none"
            style={{ color: colors.primary }}
          >
            17
          </span>
          <div 
            className="absolute -bottom-1 left-0 w-full h-0.5"
            style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}
          ></div>
        </div>
        
        {/* Mes y Año - tamaños optimizados para móviles */}
        <div className="text-center">
          <span 
            className="block text-3xl sm:text-4xl md:text-5xl font-light tracking-wide uppercase"
            style={{ color: colors.primary }}
          >
            Mayo
          </span>
          <span 
            className="block text-2xl sm:text-3xl md:text-4xl font-light mt-0.5"
            style={{ color: colors.primary }}
          >
            2025
          </span>
        </div>
      </div>
      
      {/* Elementos decorativos ajustados para ser más responsivos */}
      <div className="absolute -z-10 w-full h-full max-w-xs max-h-xs rounded-full opacity-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
           style={{ backgroundColor: colors.primary }}></div>
           
      {/* Elementos adicionales para mejorar la apariencia en móviles */}
      <div className="mt-3 sm:mt-4 md:mt-6 mx-auto w-16 sm:w-24 md:w-32 h-px" 
           style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}></div>
    </div>
  </div>
</section>

      {/* Family Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl md:text-2xl italic text-center mb-8 sm:mb-12 md:mb-16" style={{ color: colors.primary }}>Con la bendición de</h2>
        
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide text-center" style={{ color: colors.contrast }}>Padres de la Novia:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>✞ María Mercedes Rodríguez Rodríguez ✞</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Ramiro Rodríguez Ramírez</p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide text-center" style={{ color: colors.contrast }}>Padres del Novio:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Soledad Orozco Garay</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Ruben De Santiago Carrillo</p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section style={{ backgroundColor: colors.background }}>
        <div className="grid grid-cols-3 gap-px">
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3336.jpg"
              alt="Couple photo"
              fill
              quality={100}
              unoptimized
              className="object-cover"
              objectPosition="center 25%"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 33vw"
            />
          </div>
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3360.jpg"
              alt="Bouquet"
              fill
              quality={100}
              unoptimized
              className="object-cover"
              objectPosition="center 40%"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 33vw"
            />
          </div>
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3304.jpg"
              alt="Couple walking"
              fill
              quality={100}
              unoptimized
              className="object-cover"
              objectPosition="60% center"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 33vw"
            />
          </div>
        </div>
      </section>

      {/* Drinking Toast Photo */}
      <section style={{ backgroundColor: colors.background }}>
        <div className="relative w-full" style={{ height: "500px" }}>
          <Image
            src="/images/IMG_3289.jpg"
            alt="Couple toasting"
            fill
            quality={100}
            unoptimized
            className="object-cover"
            objectPosition="center 35%" 
            sizes="100vw"
          />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
            <div className="text-center md:w-5/12">
              <h3 className="text-xl sm:text-2xl italic mb-4 font-light" style={{ color: colors.primary }}>Ceremonia</h3>
              <p className="text-sm sm:text-base font-medium mb-2" style={{ color: colors.contrast }}>Parroquia De San Judas Tadeo</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Calle Reforma #2</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Centro</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: colors.contrast }}>Villanueva, Zacatecas</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-4" style={{ color: colors.contrast }}>01:30 p.m.</p>
              <a 
                href="https://maps.app.goo.gl/dqZjPfS7LEXVtmvn7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-1.5 border rounded-full text-[10px] sm:text-xs tracking-wide transition-colors"
                style={{ 
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary,
                  color: 'white'
                }}
              >
                CÓMO LLEGAR
              </a>
            </div>
            
            <div className="hidden md:flex justify-center items-center md:w-2/12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
                <div className="w-10 h-10" style={{ backgroundColor: colors.primary, opacity: 0.2 }}></div>
              </div>
            </div>
            
            <div className="text-center md:w-5/12">
              <h3 className="text-xl sm:text-2xl italic mb-4 font-light" style={{ color: colors.primary }}>Recepción</h3>
              <p className="text-sm sm:text-base font-medium mb-2" style={{ color: colors.contrast }}>Hacienda la Encarnación</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Conocida Hacienda</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: colors.contrast }}>Villanueva, Zacatecas</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-4" style={{ color: colors.contrast }}>03:30 p.m.</p>
              <a 
                href="https://maps.app.goo.gl/9GVXjwCCJxQf5rhM9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-1.5 border rounded-full text-[10px] sm:text-xs tracking-wide transition-colors"
                style={{ 
                  backgroundColor: colors.primary, 
                  borderColor: colors.primary,
                  color: 'white'
                }}
              >
                CÓMO LLEGAR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Baptism Special Section */}
<section className="py-10 sm:py-12 px-4" style={{ 
  background: `linear-gradient(to right, ${colors.background} 0%, ${colors.secondary}40 50%, ${colors.background} 100%)` 
}}>
  <div className="max-w-md sm:max-w-lg mx-auto text-center relative">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 opacity-10" style={{ color: colors.primary }}>✝️</div>
    <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-10" style={{ color: colors.primary }}>✝️</div>
    
    {/* Decorative line */}
    <div className="w-32 h-px mx-auto mb-6" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}></div>
    
    <h2 className="text-lg sm:text-xl italic font-light mb-4" style={{ color: colors.primary }}>
      También celebraremos el Bautizo de
    </h2>
    
    <div className="my-4 text-2xl sm:text-3xl md:text-4xl font-light" style={{ color: colors.primary }}>
      Lua Madelayn Mendoza Rodríguez
      <br />
      & 
      <br />
      Laia Marlen Mendoza Rodríguez
    </div>
    
    <p className="text-xs sm:text-sm max-w-xs mx-auto mb-4" style={{ color: colors.contrast }}>
      Nos sentimos honrados de compartir este sacramento especial con ustedes durante nuestra celebración
    </p>
    
    {/* Decorative small icons */}
    <div className="flex justify-center gap-6 my-4">
      <div style={{ color: colors.accent }}></div>
      <div style={{ color: colors.accent }}>🕊️</div>
      <div style={{ color: colors.accent }}></div>
    </div>
    
    {/* Decorative line */}
    <div className="w-32 h-px mx-auto mt-6" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}></div>
  </div>
</section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-2xl sm:text-3xl italic text-center mb-12 sm:mb-14 font-light" style={{ color: colors.primary }}>Minuto a Minuto</h2>
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              01:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/bible.png" alt="Bautizo" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Bautizo Lua & Laia</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              01:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/ceremonia.png" alt="Ceremonia" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Ceremonia Religiosa</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              03:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/civil.png" alt="Boda Civil" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Boda Civil</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              04:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/food.png" alt="Comida" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Comida</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              06:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/photos.png" alt="Fotos" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Fotos - Brindis</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              07:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/danced.png" alt="Baile" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Todos A La Pista</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              09:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/ramo.png" alt="Liga y Ramo" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Liga Y Ramo</div>
          </div>

          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              12:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              <img src="/images/hotel.png" alt="Fin del Evento" className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Fin Del Evento</div>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: colors.background }}>
        <h2 className="text-lg sm:text-xl italic text-center mb-3 sm:mb-4 font-light" style={{ color: colors.primary }}>Regalos</h2>
        <p className="text-center text-[10px] sm:text-xs mb-8 sm:mb-12" style={{ color: colors.contrast }}>
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-10 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <div className="font-bold text-lg" style={{ color: colors.primary }}>Amazon</div>
            </div>
            <a 
              href="https://amzn.to/3Fhxze7"
              rel="noopener noreferrer"
              className="inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs transition-colors"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              IR AL SITIO
            </a>
          </div>
        </div>
      </section>

      {/* Gift Envelope Section */}
      <section className="py-6 sm:py-8 px-4 text-center" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col items-center justify-center mb-2 sm:mb-3">
          <div className="text-2xl" style={{ color: colors.accent }}>✉️</div>
        </div>
        <h3 className="text-xs sm:text-sm uppercase tracking-wide mb-2" style={{ color: colors.contrast }}>LLUVIA DE SOBRES</h3>
        <p className="text-[10px] sm:text-xs max-w-xs sm:max-w-md mx-auto" style={{ color: colors.contrast }}>
          Es la tradición de regalar dinero en efectivo a los novios dentro de un sobre el día del evento.
        </p>
      </section>

      {/* Newspaper Section */}
      <section className="py-8 sm:py-10" style={{ backgroundColor: colors.background }}>
        <div className="relative w-full mx-auto max-w-2xl" style={{ height: "350px" }}>
          <Image
            src="/images/IMG_3281.jpg" 
            alt="Wedding Newspaper"
            fill
            quality={100}
            unoptimized
            className="object-contain"
            objectPosition="center center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 sm:py-12 px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-base sm:text-lg uppercase tracking-wide mb-4 sm:mb-6 text-justify" style={{ color: colors.primary }}>
            NUESTRO EQUIPO DE ORGANIZACION SE ESTARÁ COMUNICANDO CON USTEDES DESDE EL SIGUIENTE NUMERO 4941188352 LOS DIAS 21, 22 Y 23 DE ABRIL PARA CONFIRMAR SU ASISTENCIA
          </h2>
        </div>
      </section>

      {/* Hotel Options */}
      <section className="py-10 sm:py-12 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl italic text-center mb-8 sm:mb-10 font-light" style={{ color: colors.primary }}>Sugerencia De Hospedaje</h2>
        
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3" style={{ color: colors.contrast }}>Hacienda La Encarnación</h3>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Conocida Hacienda</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Villanueva, Zacatecas</p>
            <p className="text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.contrast }}>Contacto: 499 100 0003</p>
            <a 
              href="https://maps.app.goo.gl/9GVXjwCCJxQf5rhM9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-3 sm:px-4 py-1.5 border rounded-full text-[10px] sm:text-xs transition-colors"
              style={{ 
                backgroundColor: colors.background, 
                borderColor: colors.primary,
                color: colors.contrast 
              }}
            >
              CÓMO LLEGAR
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 text-center text-[10px] sm:text-xs" style={{ backgroundColor: colors.background, color: colors.contrast }}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mb-4 sm:mb-6 transition-colors"
          style={{ color: colors.primary }}
        >
          <div className="flex flex-col items-center">
            <div className="transform rotate-180 text-base sm:text-lg">▼</div>
            <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-xs mt-1">BACK TO TOP</p>
          </div>
        </button>
      </footer>
    </div>
  );
};

// Componente principal
const App: React.FC = () => {
  return (
    <ColorThemeProvider>
      <GlobalStyles />
      <WeddingApp />
    </ColorThemeProvider>
  );
};

export default App;
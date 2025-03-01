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
const AnimatedDigit: React.FC<{value: number, label: string}> = ({ value, label }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const { colors } = useColorTheme();
  
  useEffect(() => {
    if (prevValue !== value) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 500); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div 
      className="relative overflow-hidden rounded-md h-full"
      style={{ 
        backgroundColor: `${colors.contrast}15`,
        boxShadow: `0 4px 6px ${colors.contrast}10, 0 1px 3px ${colors.contrast}08`,
        backdropFilter: "blur(4px)"
      }}
    >
      <div className="py-2 flex flex-col items-center justify-center h-full">
        <div className="relative h-10 overflow-hidden flex justify-center w-full">
          {/* Número actual */}
          <div 
            className={`absolute w-full text-center text-sm sm:text-base md:text-xl lg:text-2xl font-light transition-transform duration-500 ${isFlipping ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'}`}
            style={{ color: 'white' }}
          >
            {prevValue}
          </div>
          
          {/* Nuevo número */}
          <div 
            className={`absolute w-full text-center text-sm sm:text-base md:text-xl lg:text-2xl font-light transition-transform duration-500 ${isFlipping ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'}`}
            style={{ color: 'white' }}
          >
            {value}
          </div>
        </div>
        
        <div 
          className="text-[7px] sm:text-[8px] text-center font-medium w-full"
          style={{ color: 'white' }}
        >
          {label}
        </div>
      </div>
      
      {/* Línea decorativa */}
      <div 
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: `linear-gradient(to bottom, ${colors.primary}, transparent)` }}
      ></div>
    </div>
  );
};

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
            
            {/* Contador elegante y animado - versión con 4 columnas garantizadas */}
            <div className="flex flex-row justify-between gap-1 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <div className="w-1/4">
                <AnimatedDigit value={timeLeft.days} label="DÍAS" />
              </div>
              <div className="w-1/4">
                <AnimatedDigit value={timeLeft.hours} label="HORAS" />
              </div>
              <div className="w-1/4">
                <AnimatedDigit value={timeLeft.minutes} label="MIN" />
              </div>
              <div className="w-1/4">
                <AnimatedDigit value={timeLeft.seconds} label="SEG" />
              </div>
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
        <div className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-center px-4 sm:px-6">
          <div className="italic text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed" style={{ color: colors.contrast }}>
            "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, 
            quieres que el resto de tu vida <span className="font-semibold">empiece lo antes posible</span>"
          </div>
          
          {/* Subtle Audio Player */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <audio ref={audioRef} loop>
              <source src="/music/love-song.mp3" type="audio/mpeg" />
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
            src="/images/IMG_3360.jpg"
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
      <section className="py-12 sm:py-16 text-center" style={{ backgroundColor: colors.background }}>
        <div className="text-3xl sm:text-4xl md:text-5xl font-light" style={{ color: colors.primary }}>24</div>
        <div className="text-3xl sm:text-4xl md:text-5xl font-light" style={{ color: colors.primary }}>Mar</div>
        <div className="text-lg sm:text-xl md:text-2xl font-light mt-2" style={{ color: colors.accent }}>2025</div>
      </section>

      {/* Family Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl md:text-2xl italic text-center mb-8 sm:mb-12 md:mb-16" style={{ color: colors.primary }}>En compañía de</h2>
        
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide text-center" style={{ color: colors.contrast }}>Padres de la Novia:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Mónica Elizabeth Rodríguez López</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Humberto Sandoval García</p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide text-center" style={{ color: colors.contrast }}>Padres del Novio:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Esther Fernández Del Real</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Pedro Ezequiel Montero Carbajal</p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide text-center" style={{ color: colors.contrast }}>Y Nuestros Padrinos:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>Mario Rodríguez Sandoval</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-center" style={{ color: colors.contrast }}>María Stephane Oviedo Silva</p>
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
              src="/images/IMG_3314.jpg"
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
              <p className="text-sm sm:text-base font-medium mb-2" style={{ color: colors.contrast }}>SAN PABLO LAS FUENTES</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Calle San Antonio 105</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Las Fuentes</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: colors.contrast }}>Zapopan, Jalisco</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-4" style={{ color: colors.contrast }}>06:00 p.m.</p>
              <a 
                href="https://maps.app.goo.gl/MxYkNpTJQKgQZk4o6" 
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
              <p className="text-sm sm:text-base font-medium mb-2" style={{ color: colors.contrast }}>VERDE MADERA EVENTOS</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Av. Adolfo López Mateos Sur 8040</p>
              <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: colors.contrast }}>Las Fuentes, 45070</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-1" style={{ color: colors.contrast }}>Zapopan, Jal.</p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-4" style={{ color: colors.contrast }}>08:00 p.m.</p>
              <a 
                href="https://maps.app.goo.gl/vWHBCGS3wEgqB3JV7" 
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

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-2xl sm:text-3xl italic text-center mb-12 sm:mb-14 font-light" style={{ color: colors.primary }}>Minuto a Minuto</h2>
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              06:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🏛️
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Ceremonia Religiosa</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              08:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🥂
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Coctel de Bienvenida</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              08:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🎵
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Evento Social</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              09:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🍽️
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Cena a 3 tiempos</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              10:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              ❤️
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Primer Baile</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              10:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              💃
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Se abre pista</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              11:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🥃
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Ronda de shots</div>
          </div>
        </div>
      </section>

      {/* Additional Timeline Items */}
      <section className="py-8 sm:py-10 px-4" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              12:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              ✨
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Luces & Fuegos</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              02:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              🌮
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Cena de madrugada</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-xs sm:text-sm md:text-base w-24 text-right font-medium" style={{ color: colors.primary }}>
              03:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center" style={{ color: colors.accent }}>
              👋
            </div>
            <div className="text-sm sm:text-base md:text-lg font-medium" style={{ color: colors.contrast }}>Fin del Evento</div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section style={{ backgroundColor: colors.background }}>
        <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/images/IMG_3286.jpg"
              alt="Cathedral view"
              fill
              quality={100}
              unoptimized
              className="object-cover"
              objectPosition="40% 30%"
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-3xl sm:text-4xl font-light">K<span className="text-xl sm:text-2xl">&</span>A</span>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <button className="text-white" aria-label="Play video">
                <Play size={14} />
              </button>
              <div className="w-12 sm:w-16 h-0.5 bg-white/40"></div>
              <span className="text-white text-[10px]">00:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-8 sm:py-10 px-4 text-center" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl italic mb-3 sm:mb-4 font-light" style={{ color: colors.primary }}>Dress Code</h2>
        <p className="text-sm sm:text-base tracking-[0.25em] sm:tracking-[0.3em]" style={{ color: colors.contrast }}>RIGUROSO FORMAL</p>
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
              <div className="font-bold text-lg" style={{ color: colors.primary }}>Liverpool</div>
            </div>
            <p className="text-[10px] sm:text-xs mb-2 sm:mb-3" style={{ color: colors.contrast }}>Evento: 02960421</p>
            <a 
              href="https://www.liverpool.com.mx/tienda/home" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs transition-colors"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              IR AL SITIO
            </a>
          </div>
          
          <div className="text-center">
            <div className="h-10 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <div className="font-bold text-lg" style={{ color: colors.primary }}>BBVA</div>
            </div>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Sofía Sandoval Rodríguez</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Cuenta: 47986421</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Clabe: 012320005339129</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Tarjeta: 5370 0990 4412 3123</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <div className="font-bold text-lg" style={{ color: colors.primary }}>Amazon</div>
            </div>
            <a 
              href="https://www.amazon.com.mx/" 
              target="_blank" 
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

      {/* No Kids Section */}
      <section className="py-8 sm:py-12 px-4 text-center" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl italic mb-4 sm:mb-6 font-light" style={{ color: colors.primary }}>¡Te agradecemos!</h2>
        <p className="max-w-xs sm:max-w-md mx-auto text-[10px] sm:text-xs mb-4 sm:mb-6" style={{ color: colors.contrast }}>
          Adoramos a sus pequeños, pero creemos que necesitan una noche libre.
          <br />
          Solo adultos por favor.
        </p>
        <div className="flex justify-center">
          <div className="text-2xl" style={{ color: colors.accent }}>👨‍👩‍</div>
        </div>
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
      <section className="py-10 sm:py-12 px-4 text-center" style={{ backgroundColor: colors.background }}>
        <h2 className="text-base sm:text-lg uppercase tracking-wide mb-4 sm:mb-6" style={{ color: colors.primary }}>
          CONTACTA A
          <br />
          ALEXA & MARCO
        </h2>
        <p className="mb-4 sm:mb-6 text-[10px] sm:text-xs" style={{ color: colors.contrast }}>
          Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
        </p>
        <div className="max-w-xs mx-auto">
          <div 
            className="w-32 h-32 mx-auto mb-6 sm:mb-8 border-2 flex items-center justify-center" 
            style={{ borderColor: colors.primary, backgroundColor: colors.secondary }}
          >
            <span style={{ color: colors.primary }}>QR Code</span>
          </div>
          <div className="space-y-3">
            <a 
              href="https://wa.me/523334567890?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-colors"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              CONFIRMAR ASISTENCIA
            </a>
            <a 
              href="https://wa.me/523334567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs transition-colors"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              ENVIAR MENSAJE
            </a>
          </div>
        </div>
      </section>

      {/* Hotel Options */}
      <section className="py-10 sm:py-12 px-4" style={{ backgroundColor: colors.secondary }}>
        <h2 className="text-lg sm:text-xl italic text-center mb-8 sm:mb-10 font-light" style={{ color: colors.primary }}>Hospedaje</h2>
        
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3" style={{ color: colors.contrast }}>CITY EXPRESS PLUS</h3>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Av. Adolfo López Mateos Sur 1450</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Colonia las Villas</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Palomar, Jal.</p>
            <p className="text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.contrast }}>Contacto: 33 8000 0770</p>
            <a 
              href="https://maps.app.goo.gl/Fwi59pjqWAPPjHxz8" 
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
          
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3" style={{ color: colors.contrast }}>HOLIDAY INN EXPRESS</h3>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Av. Camino al tesoro 8650</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Paisajes del Tesoro</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Guadalajara, Jal.</p>
            <p className="text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.contrast }}>Contacto: 33 3864 1234</p>
            <a 
              href="https://maps.app.goo.gl/RHsfBVUWdvAMYyFu7" 
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

      {/* Additional Hotel Options */}
      <section className="py-10 sm:py-12 px-4" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3" style={{ color: colors.contrast }}>RAMADA ENCORE GUADALAJARA</h3>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Av. Adolfo López Mateos Sur 6730</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>La Guadalupana</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Palomar, Jal.</p>
            <p className="text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.contrast }}>Contacto: 33 8964 8000</p>
            <a 
              href="https://maps.app.goo.gl/ukqVYHn1mpTPnz6t9" 
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
          
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3" style={{ color: colors.contrast }}>MICROTEL INN & SUITES</h3>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Av. Adolfo López Mateos Sur 1701, P3</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>La Guadalupana</p>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.contrast }}>Guadalajara, Jal.</p>
            <p className="text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.contrast }}>Contacto: 33 4077 0303</p>
            <a 
              href="https://maps.app.goo.gl/jvmdAkuAU3kR8tPT9" 
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

      {/* Social Media Hashtag */}
      <section className="py-10 sm:py-12 px-4 text-center" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-center space-x-3">
          <div style={{ color: colors.accent }}>
            📷
          </div>
          <div>
            <p className="text-[10px] sm:text-xs" style={{ color: colors.accent }}>Nuestro Hashtag Oficial</p>
            <p className="text-base sm:text-lg font-light" style={{ color: colors.primary }}>#AlexayMarco</p>
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
        <p>© 2025 by My Wed Day. | www.mywedday.mx</p>
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
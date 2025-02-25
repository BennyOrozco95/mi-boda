import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

  // Countdown Timer Setup
  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const weddingDate: number = new Date('2025-03-24T18:00:00').getTime();
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
    <div className="flex flex-col min-h-screen font-serif text-stone-700 bg-white">
      {/* Hero Section */}
      <section className="relative w-full" style={{ height: "calc(100vh - 0px)" }}>
        <div className="relative w-full h-full">
          <Image
            src="/images/IMG_3281.jpg"
            alt="Wedding background"
            fill
            priority
            className="object-cover"
            objectPosition="center center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-3 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 md:mb-12 font-light">
            ALEXA<span className="font-light">&</span>MARCO
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.2em] sm:tracking-[0.3em] mb-8 sm:mb-12 md:mb-16">SAVE THE DATE</p>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-5 max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg w-full text-center">
            <div className="bg-black/30 backdrop-blur-sm py-2 sm:py-3 md:py-4 px-1 md:px-2">
              <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light">{timeLeft.days}</div>
              <div className="text-[8px] sm:text-xs tracking-widest sm:tracking-[0.2em] mt-1">DÍAS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-2 sm:py-3 md:py-4 px-1 md:px-2">
              <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light">{timeLeft.hours}</div>
              <div className="text-[8px] sm:text-xs tracking-widest sm:tracking-[0.2em] mt-1">HORAS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-2 sm:py-3 md:py-4 px-1 md:px-2">
              <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light">{timeLeft.minutes}</div>
              <div className="text-[8px] sm:text-xs tracking-widest sm:tracking-[0.2em] mt-1">MINUTOS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-2 sm:py-3 md:py-4 px-1 md:px-2">
              <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light">{timeLeft.seconds}</div>
              <div className="text-[8px] sm:text-xs tracking-widest sm:tracking-[0.2em] mt-1">SEGUNDOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section with Audio Player */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-center px-4 sm:px-6">
          <div className="italic text-xs sm:text-sm md:text-base lg:text-lg text-stone-600 leading-relaxed">
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
                className="text-stone-400 hover:text-stone-600 transition-colors p-2"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              
              <div className="w-16 sm:w-24 md:w-36 h-0.5 bg-stone-200 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-stone-400" 
                  style={{ width: `${audioProgress}%` }}
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
            src="/images/IMG_3286.jpg"
            alt="Couple walking"
            fill
            className="object-cover"
            objectPosition="50% 30%" 
            sizes="100vw"
          />
        </div>
      </section>

      {/* Date Display in Elegant Typography */}
      <section className="py-12 sm:py-16 bg-white text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl text-stone-500 font-light">24</div>
        <div className="text-3xl sm:text-4xl md:text-5xl text-stone-500 font-light">Mar</div>
        <div className="text-lg sm:text-xl md:text-2xl text-stone-400 font-light mt-2">2025</div>
      </section>

      {/* Family Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 bg-stone-100 text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl text-stone-500 italic mb-8 sm:mb-12 md:mb-16">En compañía de</h2>
        
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide">Padres de la Novia:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Mónica Elizabeth Rodríguez López</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Humberto Sandoval García</p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide">Padres del Novio:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Esther Fernández Del Real</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Pedro Ezequiel Montero Carbajal</p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide">Y Nuestros Padrinos:</h3>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Mario Rodríguez Sandoval</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">María Stephane Oviedo Silva</p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-white">
        <div className="grid grid-cols-3 gap-px">
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3289.jpg"
              alt="Couple photo"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3304.jpg"
              alt="Bouquet"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square sm:h-40 md:h-52 lg:h-64">
            <Image
              src="/images/IMG_3314.jpg"
              alt="Couple walking"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Drinking Toast Photo */}
      <section className="bg-white">
        <div className="relative w-full" style={{ height: "500px" }}>
          <Image
            src="/images/IMG_3336.jpg"
            alt="Couple toasting"
            fill
            className="object-cover"
            objectPosition="center 35%" 
            sizes="100vw"
          />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
            <div className="text-center md:w-5/12">
              <h3 className="text-xl sm:text-2xl italic text-stone-500 mb-4 font-light">Ceremonia</h3>
              <p className="text-sm sm:text-base font-medium mb-2">SAN PABLO LAS FUENTES</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Calle San Antonio 105</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Las Fuentes</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600 mb-1">Zapopan, Jalisco</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600 mb-4">06:00 p.m.</p>
              <button className="px-4 py-1.5 bg-stone-100 border border-stone-200 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs tracking-wide">
                CÓMO LLEGAR
              </button>
            </div>
            
            <div className="hidden md:flex justify-center items-center md:w-2/12">
              <Image
                src="/images/geometric-divider.png"
                alt="Geometric divider"
                width={60}
                height={60}
              />
            </div>
            
            <div className="text-center md:w-5/12">
              <h3 className="text-xl sm:text-2xl italic text-stone-500 mb-4 font-light">Recepción</h3>
              <p className="text-sm sm:text-base font-medium mb-2">VERDE MADERA EVENTOS</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Av. Adolfo López Mateos Sur 8040</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600">Las Fuentes, 45070</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600 mb-1">Zapopan, Jal.</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-stone-600 mb-4">08:00 p.m.</p>
              <button className="px-4 py-1.5 bg-stone-100 border border-stone-200 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs tracking-wide">
                CÓMO LLEGAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 px-4 bg-stone-100">
        <h2 className="text-2xl sm:text-3xl italic text-center text-stone-500 mb-12 sm:mb-14 font-light">Minuto a Minuto</h2>
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              06:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/church-icon.png" alt="Church" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Ceremonia Religiosa</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              08:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/cocktail-icon.png" alt="Cocktail" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Coctel de Bienvenida</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              08:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/music-icon.png" alt="Music" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Evento Social</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              09:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/dinner-icon.png" alt="Dinner" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Cena a 3 tiempos</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              10:00 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/heart-icon.png" alt="Heart" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Primer Baile</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              10:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/dance-icon.png" alt="Dance" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Se abre pista</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              11:30 p.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/party-icon.png" alt="Party" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Ronda de shots</div>
          </div>
        </div>
      </section>

      {/* Additional Timeline Items */}
      <section className="py-8 sm:py-10 px-4 bg-stone-100">
        <div className="max-w-xs sm:max-w-md mx-auto space-y-8 sm:space-y-10">
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              12:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/light-icon.png" alt="Light" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Luces & Fuegos</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              02:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/food-icon.png" alt="Food" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Cena de madrugada</div>
          </div>
          
          <div className="flex items-center">
            <div className="text-stone-500 text-xs sm:text-sm md:text-base w-24 text-right font-medium">
              03:00 a.m.
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-4 flex items-center justify-center">
              <Image src="/images/end-icon.png" alt="End" width={24} height={24} />
            </div>
            <div className="text-sm sm:text-base md:text-lg text-stone-700 font-medium">Fin del Evento</div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-white">
        <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/images/IMG_3349.jpg"
              alt="Cathedral view"
              fill
              className="object-cover"
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
      <section className="py-8 sm:py-10 px-4 bg-stone-100 text-center">
        <h2 className="text-lg sm:text-xl italic text-stone-500 mb-3 sm:mb-4 font-light">Dress Code</h2>
        <p className="text-sm sm:text-base tracking-[0.25em] sm:tracking-[0.3em] text-stone-600">RIGUROSO FORMAL</p>
      </section>

      {/* Registry Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <h2 className="text-lg sm:text-xl italic text-center text-stone-500 mb-3 sm:mb-4 font-light">Regalos</h2>
        <p className="text-center text-stone-600 text-[10px] sm:text-xs mb-8 sm:mb-12">
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <Image
              src="/images/liverpool-logo.png"
              alt="Liverpool"
              width={100}
              height={35}
              className="mx-auto mb-3 sm:mb-4"
            />
            <p className="text-[10px] sm:text-xs text-stone-600 mb-2 sm:mb-3">Evento: 02960421</p>
            <a 
              href="https://www.liverpool.com.mx/tienda/home" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-2 sm:px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs transition-colors"
            >
              IR AL SITIO
            </a>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/bbva-logo.png"
              alt="BBVA"
              width={100}
              height={35}
              className="mx-auto mb-3 sm:mb-4"
            />
            <p className="text-[10px] sm:text-xs text-stone-600">Sofía Sandoval Rodríguez</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Cuenta: 47986421</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Clabe: 012320005339129</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Tarjeta: 5370 0990 4412 3123</p>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={100}
              height={35}
              className="mx-auto mb-3 sm:mb-4"
            />
            <a 
              href="https://www.amazon.com.mx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-2 sm:px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs transition-colors"
            >
              IR AL SITIO
            </a>
          </div>
        </div>
      </section>

      {/* Gift Envelope Section */}
      <section className="py-6 sm:py-8 px-4 bg-white text-center">
        <div className="flex flex-col items-center justify-center mb-2 sm:mb-3">
          <Image
            src="/images/envelope-icon.png" 
            alt="Envelope"
            width={30}
            height={30}
          />
        </div>
        <h3 className="text-xs sm:text-sm uppercase tracking-wide text-stone-600 mb-2">LLUVIA DE SOBRES</h3>
        <p className="text-[10px] sm:text-xs text-stone-500 max-w-xs sm:max-w-md mx-auto">
          Es la tradición de regalar dinero en efectivo a los novios dentro de un sobre el día del evento.
        </p>
      </section>

      {/* No Kids Section */}
      <section className="py-8 sm:py-12 px-4 bg-stone-100 text-center">
        <h2 className="text-lg sm:text-xl italic text-stone-500 mb-4 sm:mb-6 font-light">¡Te agradecemos!</h2>
        <p className="max-w-xs sm:max-w-md mx-auto text-stone-600 text-[10px] sm:text-xs mb-4 sm:mb-6">
          Adoramos a sus pequeños, pero creemos que necesitan una noche libre.
          <br />
          Solo adultos por favor.
        </p>
        <div className="flex justify-center">
          <Image
            src="/images/no-kids-icons.png" 
            alt="No Kids"
            width={50}
            height={25}
          />
        </div>
      </section>

      {/* Newspaper Section */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="relative w-full mx-auto max-w-2xl" style={{ height: "350px" }}>
          <Image
            src="/images/IMG_3360.jpg" 
            alt="Wedding Newspaper"
            fill
            className="object-contain"
            objectPosition="center center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 sm:py-12 px-4 bg-white text-center">
        <h2 className="text-base sm:text-lg uppercase tracking-wide text-stone-500 mb-4 sm:mb-6">
          CONTACTA A
          <br />
          ALEXA & MARCO
        </h2>
        <p className="mb-4 sm:mb-6 text-stone-600 text-[10px] sm:text-xs">
          Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
        </p>
        <div className="max-w-xs mx-auto">
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={120}
            height={120}
            className="mx-auto mb-6 sm:mb-8"
          />
          <div className="space-y-3">
            <button className="w-full px-3 sm:px-4 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs">
              CONFIRMAR ASISTENCIA
            </button>
            <button className="w-full px-3 sm:px-4 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-[10px] sm:text-xs">
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </section>

      {/* Hotel Options */}
      <section className="py-10 sm:py-12 px-4 bg-stone-100">
        <h2 className="text-lg sm:text-xl italic text-center text-stone-500 mb-8 sm:mb-10 font-light">Hospedaje</h2>
        
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3">CITY EXPRESS PLUS</h3>
            <p className="text-[10px] sm:text-xs text-stone-600">Av. Adolfo López Mateos Sur 1450</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Colonia las Villas</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Palomar, Jal.</p>
            <p className="text-[10px] sm:text-xs text-stone-600 mb-3 sm:mb-4">Contacto: 33 8000 0770</p>
            <button className="px-3 sm:px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-full text-[10px] sm:text-xs">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3">HOLIDAY INN EXPRESS</h3>
            <p className="text-[10px] sm:text-xs text-stone-600">Av. Camino al tesoro 8650</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Paisajes del Tesoro</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Guadalajara, Jal.</p>
            <p className="text-[10px] sm:text-xs text-stone-600 mb-3 sm:mb-4">Contacto: 33 3864 1234</p>
            <button className="px-3 sm:px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-full text-[10px] sm:text-xs">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Additional Hotel Options */}
      <section className="py-10 sm:py-12 px-4 bg-stone-100">
        <div className="max-w-xs sm:max-w-md md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3">RAMADA ENCORE GUADALAJARA</h3>
            <p className="text-[10px] sm:text-xs text-stone-600">Av. Adolfo López Mateos Sur 6730</p>
            <p className="text-[10px] sm:text-xs text-stone-600">La Guadalupana</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Palomar, Jal.</p>
            <p className="text-[10px] sm:text-xs text-stone-600 mb-3 sm:mb-4">Contacto: 33 8964 8000</p>
            <button className="px-3 sm:px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-full text-[10px] sm:text-xs">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-sm sm:text-base tracking-wide mb-2 sm:mb-3">MICROTEL INN & SUITES</h3>
            <p className="text-[10px] sm:text-xs text-stone-600">Av. Adolfo López Mateos Sur 1701, P3</p>
            <p className="text-[10px] sm:text-xs text-stone-600">La Guadalupana</p>
            <p className="text-[10px] sm:text-xs text-stone-600">Guadalajara, Jal.</p>
            <p className="text-[10px] sm:text-xs text-stone-600 mb-3 sm:mb-4">Contacto: 33 4077 0303</p>
            <button className="px-3 sm:px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-full text-[10px] sm:text-xs">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Hashtag */}
      <section className="py-10 sm:py-12 px-4 bg-white text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="text-stone-300">
            <Image
              src="/images/instagram-icon.png"
              alt="Instagram"
              width={28}
              height={28}
            />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-stone-400">Nuestro Hashtag Oficial</p>
            <p className="text-base sm:text-lg text-stone-500 font-light">#AlexayMarco</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 text-center text-stone-400 text-[10px] sm:text-xs bg-gray-50">
        <button className="mb-4 sm:mb-6 hover:text-stone-500 transition-colors">
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

export default WeddingApp;
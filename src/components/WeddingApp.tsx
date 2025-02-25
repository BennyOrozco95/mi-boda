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
    days: 27,
    hours: 18,
    minutes: 11,
    seconds: 22
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Countdown Timer Setup - Updated for March 24, 2025
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

  // Audio controls
  useEffect(() => {
    const tryAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log('Autoplay was prevented', error);
        });
      }
    };
    
    const handleFirstInteraction = () => {
      tryAutoplay();
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
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
      {/* Hero Section with Stone Wall Background */}
      <section className="relative h-screen">
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-background.jpg"
            alt="Wedding background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl tracking-[0.3em] mb-12 font-light">
            ALEXA<span className="font-light">&</span>MARCO
          </h1>
          <p className="text-lg md:text-xl tracking-[0.3em] mb-20">SAVE THE DATE</p>
          
          <div className="grid grid-cols-4 gap-6 max-w-xl w-full text-center">
            <div className="bg-black/30 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.days}</div>
              <div className="text-xs tracking-[0.2em] mt-1">DÍAS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.hours}</div>
              <div className="text-xs tracking-[0.2em] mt-1">HORAS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.minutes}</div>
              <div className="text-xs tracking-[0.2em] mt-1">MINUTOS</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.seconds}</div>
              <div className="text-xs tracking-[0.2em] mt-1">SEGUNDOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section with Audio Player */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto text-center px-6">
          <div className="italic text-lg text-stone-600 leading-relaxed">
            "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, 
            quieres que el resto de tu vida <span className="font-semibold">empiece lo antes posible</span>"
          </div>
          
          {/* Subtle Audio Player */}
          <div className="mt-10 flex justify-center">
            <audio ref={audioRef} loop>
              <source src="/music/love-song.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlayPause} 
                className="text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <div className="w-36 h-0.5 bg-stone-200 relative">
                <div className="absolute top-0 left-0 h-full bg-stone-400" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Date Display in Large Elegant Typography */}
      <section className="py-16 bg-white text-center">
        <div className="text-5xl text-stone-600 font-light">24</div>
        <div className="text-5xl text-stone-600 font-light">Mar</div>
        <div className="text-2xl text-stone-400 font-light mt-2">2025</div>
      </section>

      {/* Family Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl text-stone-500 italic mb-16">En compañía de</h2>
        
        <div className="max-w-lg mx-auto space-y-12">
          <div>
            <h3 className="text-lg mb-4 tracking-wide">Padres de la Novia:</h3>
            <p className="text-sm text-stone-600">Mónica Elizabeth Rodríguez López</p>
            <p className="text-sm text-stone-600">Humberto Sandoval García</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-4 tracking-wide">Padres del Novio:</h3>
            <p className="text-sm text-stone-600">Esther Fernández Del Real</p>
            <p className="text-sm text-stone-600">Pedro Ezequiel Montero Carbajal</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-4 tracking-wide">Y Nuestros Padrinos:</h3>
            <p className="text-sm text-stone-600">Mario Rodríguez Sandoval</p>
            <p className="text-sm text-stone-600">María Stephane Oviedo Silva</p>
          </div>
        </div>
      </section>

      {/* Pre-wedding photos - 3 images section */}
      <section className="py-8 bg-white">
        <div className="grid grid-cols-3 gap-1">
          <div className="relative h-64">
            <Image
              src="/images/couple-photo-1.jpg"
              alt="Couple photo"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64">
            <Image
              src="/images/bouquet-photo.jpg"
              alt="Bouquet"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64">
            <Image
              src="/images/couple-photo-2.jpg"
              alt="Couple walking"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="text-center">
            <h3 className="text-2xl italic text-stone-500 mb-6">Ceremonia</h3>
            <p className="text-lg font-medium mb-3">SAN PABLO LAS FUENTES</p>
            <p className="text-sm text-stone-600">Calle San Antonio 105</p>
            <p className="text-sm text-stone-600">Las Fuentes</p>
            <p className="text-sm text-stone-600 mb-4">Zapopan, Jalisco</p>
            <p className="text-sm text-stone-600 mb-6">06:00 p.m.</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em] transition-all duration-300">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl italic text-stone-500 mb-6">Recepción</h3>
            <p className="text-lg font-medium mb-3">VERDE MADERA EVENTOS</p>
            <p className="text-sm text-stone-600">Av. Adolfo López Mateos Sur 8040</p>
            <p className="text-sm text-stone-600">Las Fuentes, 45070</p>
            <p className="text-sm text-stone-600 mb-4">Zapopan, Jal.</p>
            <p className="text-sm text-stone-600 mb-6">08:00 p.m.</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em] transition-all duration-300">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white">
        <h2 className="text-2xl italic text-center text-stone-500 mb-16">Minuto a Minuto</h2>
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              06:00 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/church-icon.png" alt="Church" width={20} height={20} />
            </div>
            <div className="text-stone-600">Ceremonia Religiosa</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              08:00 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/cocktail-icon.png" alt="Cocktail" width={20} height={20} />
            </div>
            <div className="text-stone-600">Coctel de Bienvenida</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              08:30 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/music-icon.png" alt="Music" width={20} height={20} />
            </div>
            <div className="text-stone-600">Evento Social</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              09:00 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/dinner-icon.png" alt="Dinner" width={20} height={20} />
            </div>
            <div className="text-stone-600">Cena a 3 tiempos</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              10:00 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/heart-icon.png" alt="Heart" width={20} height={20} />
            </div>
            <div className="text-stone-600">Primer Baile</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              10:30 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/dance-icon.png" alt="Dance" width={20} height={20} />
            </div>
            <div className="text-stone-600">Se abre pista</div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-stone-400 text-sm w-20 text-right">
              11:30 p.m.
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/images/party-icon.png" alt="Party" width={20} height={20} />
            </div>
            <div className="text-stone-600">Ronda de shots</div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl italic text-stone-500 mb-6">Dress Code</h2>
        <p className="text-lg tracking-[0.3em] text-stone-600">RIGUROSO FORMAL</p>
      </section>

      {/* Registry Section */}
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-2xl italic text-center text-stone-500 mb-6">Regalos</h2>
        <p className="text-center text-stone-600 text-sm mb-16">
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Image
              src="/images/liverpool-logo.png"
              alt="Liverpool"
              width={120}
              height={40}
              className="mx-auto mb-6"
            />
            <p className="text-xs text-stone-600 mb-4">Evento: 02960421</p>
            <button className="px-4 py-1 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-wide">
              IR AL SITIO
            </button>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/bbva-logo.png"
              alt="BBVA"
              width={120}
              height={40}
              className="mx-auto mb-6"
            />
            <p className="text-xs text-stone-600">Sofía Sandoval Rodríguez</p>
            <p className="text-xs text-stone-600">Cuenta: 47986421</p>
            <p className="text-xs text-stone-600">Clabe: 012320005339129</p>
            <p className="text-xs text-stone-600">Tarjeta: 5370 0990 4412 3123</p>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={120}
              height={40}
              className="mx-auto mb-6"
            />
            <button className="px-4 py-1 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-wide">
              IR AL SITIO
            </button>
          </div>
        </div>
      </section>

      {/* Gift Envelope Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-xl uppercase tracking-wide text-stone-500 mb-6">LLUVIA DE SOBRES</h2>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Es la tradición de regalar dinero en efectivo a los novios dentro de un sobre el día del evento.
        </p>
        <div className="mt-6">
          <Image
            src="/images/envelope-icon.png" 
            alt="Envelope"
            width={40}
            height={40}
            className="mx-auto"
          />
        </div>
      </section>

      {/* No Kids Section */}
      <section className="py-16 px-4 bg-gray-50 text-center">
        <h2 className="text-2xl italic text-stone-500 mb-8">¡Te agradecemos!</h2>
        <p className="max-w-md mx-auto text-stone-600 text-sm mb-8">
          Adoramos a sus pequeños, pero creemos que necesitan una noche libre.
          <br />
          Solo adultos por favor.
        </p>
        <div className="flex justify-center">
          <Image
            src="/images/no-kids-icons.png" 
            alt="No Kids"
            width={60}
            height={30}
          />
        </div>
      </section>

      {/* Newspaper Section */}
      <section className="py-16 bg-white flex justify-center">
        <div className="relative h-64 w-full max-w-2xl">
          <Image
            src="/images/newspaper.jpg" 
            alt="Wedding Newspaper"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-2xl italic text-stone-500 mb-12">
          CONTACTA A
          <br />
          ALEXA & MARCO
        </h2>
        <p className="mb-10 text-stone-600 text-sm">
          Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
        </p>
        <div className="max-w-xs mx-auto">
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={160}
            height={160}
            className="mx-auto mb-10"
          />
          <div className="space-y-4">
            <button className="w-full px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              CONFIRMAR ASISTENCIA
            </button>
            <button className="w-full px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </section>

      {/* Hotel Options */}
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-2xl italic text-center text-stone-500 mb-16">Hospedaje</h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="text-center">
            <h3 className="text-lg tracking-wide mb-4">CITY EXPRESS PLUS</h3>
            <p className="text-sm text-stone-600">Av. Adolfo López Mateos Sur 1450</p>
            <p className="text-sm text-stone-600">Colonia las Villas</p>
            <p className="text-sm text-stone-600">Palomar, Jal.</p>
            <p className="text-sm text-stone-600 mb-6">Contacto: 33 8000 0770</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg tracking-wide mb-4">HOLIDAY INN EXPRESS</h3>
            <p className="text-sm text-stone-600">Av. Camino al tesoro 8650</p>
            <p className="text-sm text-stone-600">Paisajes del Tesoro</p>
            <p className="text-sm text-stone-600">Guadalajara, Jal.</p>
            <p className="text-sm text-stone-600 mb-6">Contacto: 33 3864 1234</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Additional Hotel Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="text-center">
            <h3 className="text-lg tracking-wide mb-4">RAMADA ENCORE GUADALAJARA</h3>
            <p className="text-sm text-stone-600">Av. Adolfo López Mateos Sur 6730</p>
            <p className="text-sm text-stone-600">La Guadalupana</p>
            <p className="text-sm text-stone-600">Palomar, Jal.</p>
            <p className="text-sm text-stone-600 mb-6">Contacto: 33 8964 8000</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg tracking-wide mb-4">MICROTEL INN & SUITES</h3>
            <p className="text-sm text-stone-600">Av. Adolfo López Mateos Sur 1701, P3</p>
            <p className="text-sm text-stone-600">La Guadalupana</p>
            <p className="text-sm text-stone-600">Guadalajara, Jal.</p>
            <p className="text-sm text-stone-600 mb-6">Contacto: 33 4077 0303</p>
            <button className="px-6 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-sm text-xs tracking-[0.2em]">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Hashtag */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="flex items-center justify-center space-x-4">
          <Image
            src="/images/instagram-icon.png"
            alt="Instagram"
            width={36}
            height={36}
            className="opacity-60"
          />
          <div>
            <p className="text-sm text-stone-400">Nuestro Hashtag Oficial</p>
            <p className="text-xl text-stone-600">#AlexayMarco</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 text-center text-stone-400 text-xs bg-gray-50">
        <button className="mb-6 hover:text-stone-500 transition-colors">
          <div className="flex flex-col items-center">
            <div className="transform rotate-180 text-lg">▼</div>
            <p className="uppercase tracking-[0.3em] text-xs mt-1">Back to top</p>
          </div>
        </button>
        <p>© 2025 by My Wed Day. | www.mywedday.mx</p>
      </footer>
    </div>
  );
};

export default WeddingApp;
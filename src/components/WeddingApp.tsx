import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WeddingApp: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

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
        audioRef.current.muted = true;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
            }
          }, 1000);
        }).catch(error => {
          console.log('Autoplay was prevented', error);
        });
      }
    };
    tryAutoplay();
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

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-serif text-stone-700">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-background.jpg"
            alt="Wedding background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl tracking-widest mb-8 font-light">
            ALEXA<span className="font-light">&</span>MARCO
          </h1>
          <p className="text-lg md:text-xl tracking-widest mb-16">SAVE THE DATE</p>
          
          <div className="grid grid-cols-4 gap-4 max-w-xl w-full text-center">
            <div className="bg-stone-800/40 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.days}</div>
              <div className="text-xs tracking-wider mt-1">DÍAS</div>
            </div>
            <div className="bg-stone-800/40 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.hours}</div>
              <div className="text-xs tracking-wider mt-1">HORAS</div>
            </div>
            <div className="bg-stone-800/40 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.minutes}</div>
              <div className="text-xs tracking-wider mt-1">MINUTOS</div>
            </div>
            <div className="bg-stone-800/40 backdrop-blur-sm py-4 px-2">
              <div className="text-3xl md:text-4xl font-light">{timeLeft.seconds}</div>
              <div className="text-xs tracking-wider mt-1">SEGUNDOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="italic text-lg text-stone-600 leading-relaxed">
            "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, 
            quieres que el resto de tu vida <span className="font-semibold">empiece lo antes posible</span>"
          </div>
          
          {/* Player controls styled as in PDF */}
          <div className="mt-8">
            <audio ref={audioRef} loop>
              <source src="/music/love-song.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex justify-center items-center space-x-2">
              <button 
                onClick={togglePlayPause} 
                className="text-stone-500 hover:text-stone-800"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <div className="w-32 h-1 bg-stone-300 relative">
                <div className="absolute top-0 left-0 h-full bg-stone-500" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Date Display - 24 Mar 2025 */}
      <section className="py-20 bg-stone-50 text-center">
        <div className="text-5xl text-stone-600 font-light">24</div>
        <div className="text-5xl text-stone-600 font-light">Mar</div>
        <div className="text-2xl text-stone-600 font-light mt-2">2025</div>
      </section>

      {/* Family Section */}
      <section className="py-16 px-4 bg-stone-100 text-center">
        <h2 className="text-2xl text-stone-600 italic mb-12">En compañía de</h2>
        
        <div className="max-w-2xl mx-auto space-y-12">
          <div>
            <h3 className="text-lg mb-4">Padres de la Novia:</h3>
            <p>Mónica Elizabeth Rodríguez López</p>
            <p>Humberto Sandoval García</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Padres del Novio:</h3>
            <p>Esther Fernández Del Real</p>
            <p>Pedro Ezequiel Montero Carbajal</p>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Y Nuestros Padrinos:</h3>
            <p>Mario Rodríguez Sandoval</p>
            <p>María Stephane Oviedo Silva</p>
          </div>
        </div>
      </section>

      {/* Pre-wedding photos - 3 images section */}
      <section className="py-12 bg-stone-50">
        <div className="grid grid-cols-3 gap-2">
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
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center">
            <h3 className="text-2xl italic text-stone-600 mb-6">Ceremonia</h3>
            <p className="text-lg font-semibold mb-2">SAN PABLO LAS FUENTES</p>
            <p>Calle San Antonio 105</p>
            <p>Las Fuentes</p>
            <p className="mb-4">Zapopan, Jalisco</p>
            <p className="mb-4">06:00 p.m.</p>
            <button className="px-6 py-2 border border-stone-300 hover:bg-stone-200 rounded-full text-sm tracking-wider transition-all duration-300">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="flex justify-center">
            <div className="w-24 h-24 relative">
              <Image
                src="/images/geometric-divider.png" 
                alt="Divider"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center md:col-start-2">
            <h3 className="text-2xl italic text-stone-600 mb-6">Recepción</h3>
            <p className="text-lg font-semibold mb-2">VERDE MADERA EVENTOS</p>
            <p>Av. Adolfo López Mateos Sur 8040</p>
            <p>Las Fuentes, 45070</p>
            <p className="mb-4">Zapopan, Jal.</p>
            <p className="mb-4">08:00 p.m.</p>
            <button className="px-6 py-2 border border-stone-300 hover:bg-stone-200 rounded-full text-sm tracking-wider transition-all duration-300">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-stone-50">
        <h2 className="text-2xl italic text-center text-stone-600 mb-12">Minuto a Minuto</h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/church-icon.png" alt="Church" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">06:00 p.m.</div>
            </div>
            <div className="text-stone-700">Ceremonia Religiosa</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/cocktail-icon.png" alt="Cocktail" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">08:00 p.m.</div>
            </div>
            <div className="text-stone-700">Coctel de Bienvenida</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/music-icon.png" alt="Music" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">08:30 p.m.</div>
            </div>
            <div className="text-stone-700">Evento Social</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/dinner-icon.png" alt="Dinner" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">09:00 p.m.</div>
            </div>
            <div className="text-stone-700">Cena a 3 tiempos</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/heart-icon.png" alt="Heart" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">10:00 p.m.</div>
            </div>
            <div className="text-stone-700">Primer Baile</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/dance-icon.png" alt="Dance" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">10:30 p.m.</div>
            </div>
            <div className="text-stone-700">Se abre pista</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Image src="/images/party-icon.png" alt="Party" width={24} height={24} />
              </div>
              <div className="text-sm text-stone-500">11:30 p.m.</div>
            </div>
            <div className="text-stone-700">Ronda de shots</div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-12 px-4 bg-stone-50 text-center">
        <h2 className="text-2xl italic text-stone-600 mb-4">Dress Code</h2>
        <p className="text-xl tracking-widest text-stone-700">RIGUROSO FORMAL</p>
      </section>

      {/* Registry Section */}
      <section className="py-16 px-4 bg-stone-50">
        <h2 className="text-2xl italic text-center text-stone-600 mb-6">Regalos</h2>
        <p className="text-center text-stone-600 mb-12">
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Image
              src="/images/liverpool-logo.png"
              alt="Liverpool"
              width={140}
              height={50}
              className="mx-auto mb-4"
            />
            <p className="text-sm mb-4">Evento: 02960421</p>
            <button className="px-4 py-1 border border-stone-300 rounded-full text-xs">
              IR AL SITIO
            </button>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/bbva-logo.png"
              alt="BBVA"
              width={140}
              height={50}
              className="mx-auto mb-4"
            />
            <p className="text-sm">Sofía Sandoval Rodríguez</p>
            <p className="text-sm">Cuenta: 47986421</p>
            <p className="text-xs">Clabe: 0123200053349129</p>
            <p className="text-xs">Tarjeta: 5370 0990 4412 3123</p>
          </div>
          
          <div className="text-center">
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={140}
              height={50}
              className="mx-auto mb-4"
            />
            <button className="px-4 py-1 border border-stone-300 rounded-full text-xs">
              IR AL SITIO
            </button>
          </div>
        </div>
      </section>

      {/* Gift Envelope Section */}
      <section className="py-12 px-4 bg-stone-50 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <Image
              src="/images/envelope-icon.png" 
              alt="Envelope"
              width={50}
              height={50}
              className="mx-auto"
            />
          </div>
          <h3 className="text-lg mb-2">LLUVIA DE SOBRES</h3>
          <p className="text-sm text-stone-600">
            Es la tradición de regalar dinero en efectivo a los novios dentro de un sobre el día del evento.
          </p>
        </div>
      </section>

      {/* No Kids Section */}
      <section className="py-12 px-4 bg-stone-100 text-center">
        <h2 className="text-2xl italic text-stone-600 mb-6">¡Te agradecemos!</h2>
        <p className="max-w-md mx-auto text-stone-600">
          Adoramos a sus pequeños, pero creemos que necesitan una noche libre.
          <br />
          Solo adultos por favor.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/images/no-kids-icons.png" 
            alt="No Kids"
            width={80}
            height={40}
          />
        </div>
      </section>

      {/* Newspaper Section */}
      <section className="py-8 bg-stone-50 flex justify-center">
        <div className="relative h-72 w-full max-w-2xl">
          <Image
            src="/images/newspaper.jpg" 
            alt="Wedding Newspaper"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-stone-50 text-center">
        <h2 className="text-2xl italic text-stone-600 mb-8">CONTACTA A<br />ALEXA & MARCO</h2>
        <p className="mb-8 text-stone-600">
          Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
        </p>
        <div className="max-w-xs mx-auto">
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={180}
            height={180}
            className="mx-auto mb-8"
          />
          <div className="space-y-4">
            <button className="w-full px-6 py-2 border border-stone-300 rounded-full text-sm">
              CONFIRMAR ASISTENCIA
            </button>
            <button className="w-full px-6 py-2 border border-stone-300 rounded-full text-sm">
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </section>

      {/* Hotel Options */}
      <section className="py-16 px-4 bg-stone-100">
        <h2 className="text-2xl italic text-center text-stone-600 mb-12">Hospedaje</h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h3 className="text-lg mb-4">CITY EXPRESS PLUS</h3>
            <p>Av. Adolfo López Mateos Sur 1450</p>
            <p>Colonia las Villas</p>
            <p>Palomar, Jal.</p>
            <p className="mb-4">Contacto: 33 8000 0770</p>
            <button className="px-6 py-2 border border-stone-300 rounded-full text-xs">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg mb-4">HOLIDAY INN EXPRESS</h3>
            <p>Av. Camino al tesoro 8650</p>
            <p>Paisajes del Tesoro</p>
            <p>Guadalajara, Jal.</p>
            <p className="mb-4">Contacto: 33 3864 1234</p>
            <button className="px-6 py-2 border border-stone-300 rounded-full text-xs">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Additional Hotel Options */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h3 className="text-lg mb-4">RAMADA ENCORE GUADALAJARA</h3>
            <p>Av. Adolfo López Mateos Sur 6730</p>
            <p>La Guadalupana</p>
            <p>Palomar, Jal.</p>
            <p className="mb-4">Contacto: 33 8964 8000</p>
            <button className="px-6 py-2 border border-stone-300 rounded-full text-xs">
              CÓMO LLEGAR
            </button>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg mb-4">MICROTEL INN & SUITES</h3>
            <p>Av. Adolfo López Mateos Sur 1701, P3</p>
            <p>La Guadalupana</p>
            <p>Guadalajara, Jal.</p>
            <p className="mb-4">Contacto: 33 4077 0303</p>
            <button className="px-6 py-2 border border-stone-300 rounded-full text-xs">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Hashtag */}
      <section className="py-12 px-4 bg-stone-50 text-center">
        <div className="flex items-center justify-center space-x-4">
          <Image
            src="/images/instagram-icon.png"
            alt="Instagram"
            width={50}
            height={50}
          />
          <div>
            <p className="text-sm text-stone-500">Nuestro Hashtag Oficial</p>
            <p className="text-xl text-stone-600">#AlexayMarco</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-stone-400 text-xs bg-stone-100">
        <button className="mb-4">
          <div className="flex flex-col items-center">
            <div className="transform rotate-180">▼</div>
            <p className="uppercase tracking-widest">Back to top</p>
          </div>
        </button>
        <p>© 2025 by My Wed Day. | www.mywedday.mx</p>
      </footer>
    </div>
  );
};

export default WeddingApp;
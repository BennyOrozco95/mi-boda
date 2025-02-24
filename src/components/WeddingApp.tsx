import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-serif">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center"
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-background.jpg"
            alt="Wedding hero background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-white w-full max-w-4xl mx-auto px-4">
          <h1 className="text-7xl mb-16 tracking-wider">ALEXA & MARCO</h1>
          <p className="text-xl mb-12 tracking-widest">S A V E&nbsp;&nbsp;&nbsp;T H E&nbsp;&nbsp;&nbsp;D A T E</p>
          <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-light">{timeLeft.days}</div>
              <div className="text-sm tracking-wider mt-2">Días</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light">{timeLeft.hours}</div>
              <div className="text-sm tracking-wider mt-2">Horas</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light">{timeLeft.minutes}</div>
              <div className="text-sm tracking-wider mt-2">Minutos</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light">{timeLeft.seconds}</div>
              <div className="text-sm tracking-wider mt-2">Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4 text-center bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-stone-600 leading-relaxed italic">
            &ldquo;Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, quieres que el resto de tu vida empiece lo antes posible&rdquo;
          </p>
        </div>
      </section>

      {/* Registry Section */}
      <section className="py-24 px-4 bg-white">
        <h2 className="text-3xl text-center italic mb-6">Regalos</h2>
        <p className="text-center text-stone-600 mb-16">
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-12">
          <div className="text-center">
            <div className="relative w-[180px] h-[60px] mx-auto mb-4">
              <Image
                src="/images/liverpool-logo.png"
                alt="Liverpool"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-stone-600">Evento: 02960421</p>
            <button className="mt-4 px-6 py-2 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition">
              IR AL SITIO
            </button>
          </div>
          <div className="text-center">
            <div className="relative w-[180px] h-[60px] mx-auto mb-4">
              <Image
                src="/images/bbva-logo.png"
                alt="BBVA"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="text-sm text-stone-600">
              <p>Cuenta: 402960421</p>
              <p>Clabe: 012320005339129</p>
            </div>
          </div>
          <div className="text-center">
            <div className="relative w-[180px] h-[60px] mx-auto mb-4">
              <Image
                src="/images/amazon-logo.png"
                alt="Amazon"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <button className="mt-4 px-6 py-2 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition">
              IR AL SITIO
            </button>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 px-4 bg-white">
        <h2 className="text-3xl text-center italic mb-16">Contacta a ALEXA & MARCO</h2>
        <div className="max-w-md mx-auto text-center">
          <p className="text-stone-600 mb-8">
            Envía un mensaje por Whatsapp escaneando el código o en el botón &lsquo;Enviar Mensaje&rsquo;
          </p>
          <div className="relative w-[200px] h-[200px] mx-auto mb-8">
            <Image
              src="/images/qr-code.png"
              alt="QR Code"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-stone-100 rounded-full hover:bg-stone-200 transition">
              CONFIRMAR ASISTENCIA
            </button>
            <button className="w-full px-6 py-3 bg-stone-100 rounded-full hover:bg-stone-200 transition">
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-stone-400 bg-white text-sm">
        <p>&copy; 2025 by My Wed Day. | www.mywedday.mx</p>
      </footer>
    </div>
  );
};

export default WeddingApp;
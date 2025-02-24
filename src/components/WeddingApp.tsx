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
      <section className="relative h-screen">
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-background.jpg"
            alt="Wedding background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-7xl tracking-[0.3em] mb-8">ALEXA & MARCO</h1>
          <p className="text-xl tracking-[0.5em] mb-16">SAVE THE DATE</p>
          <div className="grid grid-cols-4 gap-8 max-w-2xl text-center bg-black/30 p-8 backdrop-blur-sm">
            <div>
              <div className="text-5xl font-light mb-2">{timeLeft.days}</div>
              <div className="text-sm tracking-[0.2em]">Días</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-2">{timeLeft.hours}</div>
              <div className="text-sm tracking-[0.2em]">Horas</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-2">{timeLeft.minutes}</div>
              <div className="text-sm tracking-[0.2em]">Minutos</div>
            </div>
            <div>
              <div className="text-5xl font-light mb-2">{timeLeft.seconds}</div>
              <div className="text-sm tracking-[0.2em]">Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4 bg-stone-50 text-center">
        <p className="text-xl text-stone-600 leading-relaxed italic max-w-3xl mx-auto">
          "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, quieres que el resto de tu vida empiece lo antes posible"
        </p>
      </section>

      {/* Parents Section */}
      <section className="py-24 px-4 bg-white text-center">
        <h2 className="text-2xl mb-12 italic">En compañía de</h2>
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

      {/* Venues Section */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
          <div className="text-center">
            <h3 className="text-2xl italic mb-6">Ceremonia</h3>
            <p className="text-lg mb-2">SAN PABLO LAS FUENTES</p>
            <p>Calle San Antonio 105</p>
            <p>Las Fuentes</p>
            <p>Zapopan, Jalisco</p>
            <p className="mt-4">06:00 p.m.</p>
            <button className="mt-6 px-6 py-2 bg-stone-200 rounded-full text-sm">
              CÓMO LLEGAR
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-2xl italic mb-6">Recepción</h3>
            <p className="text-lg mb-2">VERDE MADERA EVENTOS</p>
            <p>Av. Adolfo López Mateos Sur 8040</p>
            <p>Las Fuentes, 45070</p>
            <p>Zapopan, Jal.</p>
            <p className="mt-4">08:00 p.m.</p>
            <button className="mt-6 px-6 py-2 bg-stone-200 rounded-full text-sm">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 bg-white">
        <h2 className="text-2xl italic text-center mb-16">Minuto a Minuto</h2>
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-lg">06:00 p.m.</span>
            <span>Ceremonia Religiosa</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">08:00 p.m.</span>
            <span>Coctel de Bienvenida</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">08:30 p.m.</span>
            <span>Evento Social</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">09:00 p.m.</span>
            <span>Cena a 3 tiempos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">10:00 p.m.</span>
            <span>Primer Baile</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">10:30 p.m.</span>
            <span>Se abre pista</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg">03:00 a.m.</span>
            <span>Fin del Evento</span>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section className="py-24 px-4 bg-stone-50">
        <h2 className="text-2xl italic text-center mb-6">Regalos</h2>
        <p className="text-center text-stone-600 mb-16">
          ¡El regalo es opcional, lo más importante para nosotros, es tu compañía!
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Image
              src="/images/liverpool-logo.png"
              alt="Liverpool"
              width={180}
              height={60}
              className="mx-auto mb-4"
            />
            <p className="text-sm mb-4">Evento: 02960421</p>
            <button className="px-6 py-2 bg-stone-200 rounded-full text-sm">
              IR AL SITIO
            </button>
          </div>
          <div className="text-center">
            <Image
              src="/images/bbva-logo.png"
              alt="BBVA"
              width={180}
              height={60}
              className="mx-auto mb-4"
            />
            <div className="text-sm">
              <p>Cuenta: 402960421</p>
              <p>Clabe: 012320005339129</p>
            </div>
          </div>
          <div className="text-center">
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={180}
              height={60}
              className="mx-auto mb-4"
            />
            <button className="px-6 py-2 bg-stone-200 rounded-full text-sm">
              IR AL SITIO
            </button>
          </div>
        </div>
      </section>

      {/* Hotel Section */}
      <section className="py-24 px-4 bg-white">
        <h2 className="text-2xl italic text-center mb-16">Hospedaje</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
          <div className="text-center">
            <h3 className="text-lg mb-4">CITY EXPRESS PLUS</h3>
            <p>Av. Adolfo López Mateos Sur 1450</p>
            <p>Colonia las Villas</p>
            <p>Palomar, Jal.</p>
            <p className="mb-4">Contacto: 33 8000 0770</p>
            <button className="px-6 py-2 bg-stone-200 rounded-full text-sm">
              CÓMO LLEGAR
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-lg mb-4">HOLIDAY INN EXPRESS</h3>
            <p>Av. Camino al tesoro 8650</p>
            <p>Paisajes del Tesoro</p>
            <p>Guadalajara, Jal.</p>
            <p className="mb-4">Contacto: 33 3864 1234</p>
            <button className="px-6 py-2 bg-stone-200 rounded-full text-sm">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-16 px-4 bg-stone-50 text-center">
        <h2 className="text-2xl italic mb-4">Dress Code</h2>
        <p className="text-xl tracking-[0.3em]">RIGUROSO FORMAL</p>
      </section>

      {/* Kids Note Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl italic mb-6">¡Te agradecemos!</h2>
        <p className="max-w-md mx-auto">
          Adoramos a sus pequeños, pero creemos que necesitan una noche libre.
          <br />
          Solo adultos por favor.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-stone-50 text-center">
        <h2 className="text-2xl italic mb-8">CONTACTA A ALEXA & MARCO</h2>
        <p className="mb-8">
          Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
        </p>
        <div className="max-w-xs mx-auto">
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={200}
            height={200}
            className="mx-auto mb-8"
          />
          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-stone-200 rounded-full text-sm">
              CONFIRMAR ASISTENCIA
            </button>
            <button className="w-full px-6 py-3 bg-stone-200 rounded-full text-sm">
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-xl mb-4">Nuestro Hashtag Oficial</h2>
        <p className="text-2xl text-stone-600">#AlexayMarco</p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-stone-400 text-sm bg-white">
        <p>© 2025 by My Wed Day. | www.mywedday.mx</p>
      </footer>
    </div>
  );
};

export default WeddingApp;
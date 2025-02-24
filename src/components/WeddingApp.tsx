import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const WeddingApp = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 27,
    hours: 19,
    minutes: 52,
    seconds: 33
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date('2025-03-24T18:00:00');
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-serif">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/api/placeholder/1920/1080')",
          backgroundPosition: 'center 25%'
        }}
      >
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
            "Cuando te das cuenta de que deseas pasar el resto de tu vida con alguien, quieres que el resto de tu vida empiece lo antes posible"
          </p>
        </div>
      </section>

      {/* Date Section */}
      <section className="py-24 text-center bg-white">
        <h2 className="text-6xl text-stone-800">24</h2>
        <p className="text-3xl text-stone-600 mt-4">Mar</p>
        <p className="text-3xl text-stone-600">2025</p>
      </section>

      {/* Parents Section */}
      <section className="py-24 px-4 bg-stone-50 text-center">
        <h2 className="text-3xl mb-12 italic">En compañía de</h2>
        <div className="max-w-2xl mx-auto space-y-12">
          <div>
            <h3 className="text-lg mb-4">Padres de la Novia:</h3>
            <p className="text-stone-600">Monica Elizabeth Rodriguez Lopez</p>
            <p className="text-stone-600">Humberto Sandoval Garcia</p>
          </div>
          <div>
            <h3 className="text-lg mb-4">Padres del Novio:</h3>
            <p className="text-stone-600">Esther Fernandez Del Real</p>
            <p className="text-stone-600">Pedro Ezequiel Montero Carbajal</p>
          </div>
          <div>
            <h3 className="text-lg mb-4">Y Nuestros Padrinos:</h3>
            <p className="text-stone-600">Mario Rodriguez Sandoval</p>
            <p className="text-stone-600">Maria Stephane Oviedo Silva</p>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="text-center">
            <h3 className="text-2xl italic mb-6">Ceremonia</h3>
            <div className="space-y-2 text-stone-600">
              <p className="font-semibold">SAN PABLO LAS FUENTES</p>
              <p>Calle San Antonio 105</p>
              <p>Las Fuentes</p>
              <p>Zapopan, Jalisco</p>
              <p className="font-semibold mt-4">06:00 p.m.</p>
            </div>
            <button className="mt-8 px-8 py-2 border border-stone-300 text-stone-600 rounded-full hover:bg-stone-50 transition">
              CÓMO LLEGAR
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-2xl italic mb-6">Recepción</h3>
            <div className="space-y-2 text-stone-600">
              <p className="font-semibold">VERDE MADERA EVENTOS</p>
              <p>Av. Adolfo López Mateos Sur 6040</p>
              <p>Las Fuentes, 45070</p>
              <p>Zapopan, Jal.</p>
              <p className="font-semibold mt-4">08:00 p.m.</p>
            </div>
            <button className="mt-8 px-8 py-2 border border-stone-300 text-stone-600 rounded-full hover:bg-stone-50 transition">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 bg-stone-50">
        <h2 className="text-3xl text-center italic mb-16">Minuto a Minuto</h2>
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-6">
            <span className="text-stone-400">06:00 p.m.</span>
            <span className="text-stone-600">Ceremonia Religiosa</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">08:00 p.m.</span>
            <span className="text-stone-600">Coctel de Bienvenida</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">08:30 p.m.</span>
            <span className="text-stone-600">Evento Social</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">09:00 p.m.</span>
            <span className="text-stone-600">Cena a 3 tiempos</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">10:00 p.m.</span>
            <span className="text-stone-600">Primer Baile</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">10:30 p.m.</span>
            <span className="text-stone-600">Se abre pista</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">03:00 a.m.</span>
            <span className="text-stone-600">Fin del Evento</span>
          </div>
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
            <img src="/api/placeholder/180/60" alt="Liverpool" className="mx-auto mb-4" />
            <p className="text-sm text-stone-600">Evento: 02960421</p>
            <button className="mt-4 px-6 py-2 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition">
              IR AL SITIO
            </button>
          </div>
          <div className="text-center">
            <img src="/api/placeholder/180/60" alt="BBVA" className="mx-auto mb-4" />
            <div className="text-sm text-stone-600">
              <p>Cuenta: 402960421</p>
              <p>Clabe: 012320005339129</p>
            </div>
          </div>
          <div className="text-center">
            <img src="/api/placeholder/180/60" alt="Amazon" className="mx-auto mb-4" />
            <button className="mt-4 px-6 py-2 bg-stone-100 rounded-full text-sm hover:bg-stone-200 transition">
              IR AL SITIO
            </button>
          </div>
        </div>
        <div className="mt-16 text-center">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl mb-2">LLUVIA DE SOBRES</h3>
          <p className="text-stone-600">
            Es la tradición de regalar dinero en efectivo a los novios dentro de un sobre el día del evento.
          </p>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-24 px-4 bg-stone-50">
        <h2 className="text-3xl text-center italic mb-16">Hospedaje</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <h3 className="text-xl mb-4">CITY EXPRESS PLUS</h3>
            <div className="text-stone-600 space-y-1">
              <p>Av. Adolfo Lopez Mateos Sur 1430</p>
              <p>Colonia las Villas</p>
              <p>Palomar, Jal.</p>
              <p>Contacto: 33 8000 0770</p>
            </div>
            <button className="mt-6 px-6 py-2 border border-stone-300 rounded-full hover:bg-white transition">
              CÓMO LLEGAR
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-xl mb-4">HOLIDAY INN EXPRESS</h3>
            <div className="text-stone-600 space-y-1">
              <p>Av. Camino al teso 8650</p>
              <p>Paisajes del Tesoro</p>
              <p>Guadalajara, Jal.</p>
              <p>Contacto: 33 3864 1234</p>
            </div>
            <button className="mt-6 px-6 py-2 border border-stone-300 rounded-full hover:bg-white transition">
              CÓMO LLEGAR
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-white">
        <h2 className="text-3xl text-center italic mb-16">Contacta a ALEXA & MARCO</h2>
        <div className="max-w-md mx-auto text-center">
          <p className="text-stone-600 mb-8">
            Envía un mensaje por Whatsapp escaneando el código o en el botón 'Enviar Mensaje'
          </p>
          <img src="/api/placeholder/200/200" alt="QR Code" className="mx-auto mb-8" />
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

      {/* Instagram Section */}
      <section className="py-12 px-4 bg-stone-50 text-center">
        <img src="/api/placeholder/40/40" alt="Instagram" className="mx-auto mb-4" />
        <p className="text-xl text-stone-600">Nuestro Hashtag Oficial</p>
        <p className="text-2xl text-stone-800 mt-2">#AlexayMarco</p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-stone-400 bg-white text-sm">
        <p>© 2025 by My Wed Day. | www.mywedday.mx</p>
      </footer>
    </div>
  );
};

export default WeddingApp;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiCheckCircle, FiLock, FiGlobe, FiStar } from 'react-icons/fi';
import luxuryImg from "../assets/luxury.png";
import smartImg from "../assets/smart.png";
import limitedImg from "../assets/limited.png";
import heritageImg from "../assets/heritage.png";
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-gray-800 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gray-800 rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-700 rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

        <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
          <div className="text-2xl font-extrabold tracking-widest text-white uppercase">WATCH<span className="text-gray-500">VAULT</span></div>
          <button onClick={() => navigate('/home')} className="text-sm font-semibold text-white hover:text-gray-400 transition-colors tracking-widest uppercase">
            Enter Vault
          </button>
        </nav>

        <div className="relative z-10 text-center max-w-4xl mx-auto mt-16">
          <span className="block text-xs md:text-sm tracking-[0.3em] uppercase text-gray-400 mb-6 origin-bottom animate-fade-in-up">The pinnacle of horology</span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Timeless Precision.<br />
            <span className="text-gray-500">Modern Luxury.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            An exclusive platform for discovering, sourcing, and acquiring the world's most premium and elusive timepieces.
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-base font-bold text-black bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <span className="relative z-10 flex items-center gap-2">Get Started <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="py-32 px-4 relative z-10 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm tracking-[0.2em] font-bold text-gray-500 uppercase mb-4">Our Heritage</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tigher">Craftsmanship without compromise.</h3>
            <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
              WatchVault was founded on a singular principle: to connect discerning collectors with masterpieces of mechanical engineering. We believe that a watch is more than a tool for measuring time—it is a legacy, a work of art, and a testament to human ingenuity.
            </p>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              Every timepiece on our platform undergoes rigorous authentication by our master horologists, ensuring provenance and absolute integrity.
            </p>
          </div>
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">

  {/* ⭐ HERITAGE IMAGE */}
  <img
    src={heritageImg}
    alt="WatchVault Heritage"
    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>

</div>
        </div>
      </section>

      {/* 3. Why Choose WatchVault */}
      <section className="py-32 px-4 bg-zinc-950 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm tracking-[0.2em] font-bold text-gray-500 uppercase mb-4">The Standard</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white">Why Collectors Trust Us</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FiCheckCircle />, title: 'Verified Vendors', desc: 'Access an elite network of vetted and authorized dealers globally.' },
              { icon: <FiShield />, title: 'Authentic Timepieces', desc: 'Rigorous multi-point inspection guarantees 100% authenticity.' },
              { icon: <FiLock />, title: 'Secure Transactions', desc: 'Bank-grade encryption and escrow services protect your capital.' },
              { icon: <FiGlobe />, title: 'Worldwide Shipping', desc: 'Fully insured, expedited white-glove delivery to your door.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-black border border-gray-800 hover:border-gray-600 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white mb-6 text-xl group-hover:bg-white group-hover:text-black transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* 4. Collections Preview */}
<section className="py-32 px-4 bg-black">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-sm tracking-[0.2em] font-bold text-gray-500 uppercase mb-4">
        Curations
      </h2>
      <h3 className="text-3xl md:text-5xl font-bold text-white">
        Explore The Vault
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] md:h-[500px]">
      {[
        { name: "Luxury Collection", img: luxuryImg },
        { name: "Smart Watches", img: smartImg },
        { name: "Limited Edition", img: limitedImg },
      ].map((col, idx) => (
        <div
          key={idx}
          onClick={() => navigate("/home")}
          className="relative rounded-2xl overflow-hidden cursor-pointer group border border-gray-800 hover:border-gray-500 transition-all duration-500 flex items-end p-8"
        >
          {/* ⭐ IMAGE BACKGROUND */}
          <img
            src={col.img}
            alt={col.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {/* TEXT */}
          <div className="relative z-10 w-full flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h4 className="text-2xl font-bold text-white">{col.name}</h4>
            <FiArrowRight className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* 5. Statistics */}
      <section className="py-24 border-y border-gray-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
           <div className="pt-8 md:pt-0">
              <div className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">10k+</div>
              <div className="text-sm tracking-widest text-gray-500 uppercase font-bold">Watches Sold</div>
           </div>
           <div className="pt-8 md:pt-0">
              <div className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">500+</div>
              <div className="text-sm tracking-widest text-gray-500 uppercase font-bold">Trusted Vendors</div>
           </div>
           <div className="pt-8 md:pt-0 flex flex-col items-center justify-center">
              <div className="flex text-white mb-3 text-3xl gap-1">
                 <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
              </div>
              <div className="text-sm tracking-widest text-gray-500 uppercase font-bold">4.8 Average Rating</div>
           </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-32 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm tracking-[0.2em] font-bold text-gray-500 uppercase mb-4">Reputation</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white">Words From Our Clients</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { quote: "The sourcing process was entirely transparent. The Daytona arrived exactly as described, complete with all original documentation.", name: "Arthur C.", title: "Private Collector" },
               { quote: "WatchVault is the only platform I trust for pieces above $50k. Their verification process gives me absolute peace of mind.", name: "Elena R.", title: "Enthusiast" },
               { quote: "Exceptional white-glove service from start to finish. Finding my grail watch took months, but they made it happen seamlessly.", name: "James D.", title: "Investor" }
             ].map((test, idx) => (
               <div key={idx} className="p-8 rounded-2xl bg-zinc-950 border border-gray-800">
                 <div className="flex text-gray-600 mb-6 gap-1"><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /></div>
                 <p className="text-lg text-gray-300 font-light italic mb-8 leading-relaxed">"{test.quote}"</p>
                 <div>
                    <p className="text-white font-bold">{test.name}</p>
                    <p className="text-sm text-gray-500">{test.title}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden bg-white text-black text-center">
         <div className="absolute inset-0 bg-gray-100 opacity-50 mix-blend-multiply"></div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">Start Your Collection Today.</h2>
            <p className="text-xl text-gray-600 mb-12 font-light">Join the most exclusive horological community in the world.</p>
            <button 
              onClick={() => navigate('/home')}
              className="group inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all hover:scale-105"
            >
              Enter The Vault <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 px-4 border-t border-gray-900 bg-black text-center">
         <div className="text-2xl font-extrabold tracking-widest text-white uppercase mb-4">WATCH<span className="text-gray-600">VAULT</span></div>
         <p className="text-sm text-gray-500 font-light max-w-md mx-auto mb-8">
           The premier destination for luxury timepieces. Buy, sell, and trade with absolute confidence.
         </p>
         <div className="flex justify-center gap-6 text-sm text-gray-600 font-medium">
            <button onClick={() => navigate('/home')} className="hover:text-white transition-colors">Home</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Privacy</button>
         </div>
         <p className="mt-12 text-xs text-gray-700">© 2026 WatchVault Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

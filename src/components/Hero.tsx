import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#E4E3E0]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-black text-white rounded-full">
            Golf for Good
          </span>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-black uppercase">
            Play Golf.<br />
            <span className="italic font-serif normal-case tracking-normal">Win Big.</span><br />
            Give Back.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 font-medium">
            The modern subscription platform for golfers who want to track performance, 
            win monthly prizes, and support charities with every swing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-black text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Club
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/charities"
              className="px-8 py-4 border-2 border-black text-black rounded-full font-bold text-lg hover:bg-black hover:text-white transition-all"
            >
              Explore Charities
            </Link>
          </div>
        </motion.div>

        {/* Stats/Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {[
            { icon: Target, title: "Track Performance", desc: "Log your Stableford scores and see your progress over time." },
            { icon: Trophy, title: "Monthly Draws", desc: "Participate in exclusive prize pools with huge monthly jackpots." },
            { icon: Heart, title: "Charity First", desc: "10% of every subscription goes directly to a charity of your choice." }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/50 backdrop-blur-sm border border-black/10 rounded-3xl text-left hover:border-black transition-colors group">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-gray-600 font-medium leading-snug">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Search, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function Charities() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const { data, error } = await supabase
        .from('charities')
        .select('*')
        .order('is_featured', { ascending: false });

      if (error) throw error;
      setCharities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#E4E3E0]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black tracking-tighter uppercase mb-4"
          >
            Our Partners
          </motion.h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Choose the cause you want to support. 10% of your subscription 
            goes directly to these incredible organizations.
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search charities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl font-bold text-lg shadow-sm focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          <button className="px-8 py-4 bg-white rounded-2xl font-bold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all">
            <Filter className="w-5 h-5" />
            All Categories
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-white/50 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities.map((charity) => (
              <motion.div
                key={charity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={charity.logo_url || `https://picsum.photos/seed/${charity.name}/800/600`} 
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {charity.is_featured && (
                    <div className="absolute top-4 right-4 px-4 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">{charity.name}</h3>
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  
                  <p className="text-gray-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                    {charity.description}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group">
                      Select Charity
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a 
                      href={charity.website_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-black transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredCharities.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl font-bold text-gray-400 italic">No charities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

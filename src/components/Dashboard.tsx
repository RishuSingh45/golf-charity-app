import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import ScoreEntry from './ScoreEntry';
import { CreditCard, Heart, Trophy, Settings, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*, charities(*)')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#E4E3E0]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#E4E3E0]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black tracking-tighter uppercase mb-2"
          >
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Golfer'}
          </motion.h1>
          <p className="text-gray-500 font-medium">Manage your subscription, track scores, and see your impact.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ScoreEntry />
            
            {/* Draw Participation Card */}
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">Upcoming Draw</h2>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Entered</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-4xl font-black tracking-tighter italic font-serif mb-2">$25,000.00</h3>
                  <p className="text-gray-500 font-medium">Estimated Jackpot for April 2026</p>
                </div>
                <div className="w-full md:w-auto">
                  <button className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    View Draw Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Subscription Card */}
            <div className="bg-black text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard className="w-32 h-32 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">Subscription Status</span>
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-6">
                  {profile?.subscription_status === 'active' ? 'Premium Member' : 'Inactive'}
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Plan</span>
                    <span className="font-bold uppercase tracking-tight">{profile?.subscription_tier || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Renewal Date</span>
                    <span className="font-bold">May 01, 2026</span>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    const response = await fetch('/api/create-checkout-session', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        priceId: 'price_placeholder', // Replace with your actual Stripe Price ID
                        userId: user?.id 
                      }),
                    });
                    const { url } = await response.json();
                    if (url) window.location.href = url;
                  }}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95"
                >
                  {profile?.subscription_status === 'active' ? 'Manage Subscription' : 'Subscribe Now'}
                </button>
              </div>
            </div>

            {/* Charity Card */}
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Your Charity</h2>
              </div>

              {profile?.charities ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5">
                      <img src={profile.charities.logo_url} alt={profile.charities.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight">{profile.charities.name}</h4>
                      <a href={profile.charities.website_url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-black flex items-center gap-1 mt-1">
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contribution</span>
                      <span className="font-bold text-black">{profile.charity_contribution_percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black rounded-full" 
                        style={{ width: `${profile.charity_contribution_percent}%` }}
                      />
                    </div>
                  </div>

                  <button 
  onClick={() => alert("Draw details coming soon")}
  className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-2xl font-bold"
>                    Change Charity
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 italic mb-6">No charity selected yet.</p>
                  <button 
  onClick={() => navigate("/charities")}
  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
>
  Select a Charity
</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

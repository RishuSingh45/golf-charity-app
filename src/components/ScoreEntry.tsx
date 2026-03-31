import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Target, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function ScoreEntry() {
  const [scores, setScores] = useState<any[]>([]);
  const [newScore, setNewScore] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setScores(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(newScore);
    
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      setError("Score must be between 1 and 45 (Stableford)");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('scores')
        .insert([{ user_id: user.id, score: scoreVal, date }]);

      if (error) throw error;

      setNewScore('');
      fetchScores();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Recent Scores</h2>
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stableford Format</span>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Score (1-45)</label>
          <input
            type="number"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            placeholder="36"
            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Score
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl" />)}
          </div>
        ) : scores.length > 0 ? (
          scores.map((score) => (
            <div key={score.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl group hover:bg-black hover:text-white transition-all cursor-default">
              <div className="flex items-center gap-6">
                <div className="text-3xl font-black tracking-tighter italic font-serif">{score.score}</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Played On</span>
                  <span className="font-bold">{format(new Date(score.date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 font-medium italic">
            No scores recorded yet. Time to hit the course!
          </div>
        )}
      </div>
      
      <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Only your latest 5 scores are kept for draw eligibility
      </p>
    </div>
  );
}

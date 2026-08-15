import { useState, useEffect } from 'react';
import axios from 'axios';

// ⚠️ REPLACE WITH YOUR EXACT RENDER BACKEND URL (NO TRAILING SLASH)
const API_BASE = 'https://football-api-backend.onrender.com';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedBets, setSelectedBets] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_BASE}/api/matches`);
      if (Array.isArray(res.data)) {
        setMatches(res.data);
      } else {
    setErrorMsg('Backend returned no matches. Check your ODDS_API_KEY in Render.');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setErrorMsg(`Connection error: ${err.message || 'Server unresponsive'}`);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectOdd = (matchId, selection, oddValue) => {
    if (!oddValue || oddValue === '-') return;
    setSelectedBets(prev => {
      const key = `${matchId}`;
      if (prev[key]?.selection === selection) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: { matchId, selection, oddValue } };
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-gray-100 font-sans pb-20">
      {/* Header Bar */}
      <header className="bg-[#131d38] border-b border-gray-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-emerald-400">BET</span>
          <span className="text-2xl font-black text-white">PREDICTOR</span>
          <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">AI v2.0</span>
        </div>
        <button 
          onClick={fetchMatches}
          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold"
        >
          {Object.keys(selectedBets).length} Selected (Refresh)
        </button>
      </header>

      <main className="max-w-xl mx-auto p-3">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-emerald-900 border border-purple-500/30 rounded-xl p-4 mb-4 shadow-xl">
          <p className="text-xs font-black uppercase tracking-widest text-purple-300">AI Neural Engine Active</p>
          <h2 className="text-lg font-bold text-white">Calculated Probabilities & AI Value Picks</h2>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl text-center mb-4 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#131d38] rounded-xl p-4 animate-pulse h-36"></div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-[#131d38] rounded-xl border border-gray-800">
            No active upcoming matches right now.
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const selected = selectedBets[match.id];
              const ai = match?.aiPrediction || {};
              const probs = ai?.probabilities || { home: 33, draw: 34, away: 33 };
              const odds = match?.odds || { home: '-', draw: '-', away: '-' };
              
              const matchDate = match?.commence_time 
                ? new Date(match.commence_time).toLocaleString('en-NG', {
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Upcoming';

              return (
                <div key={match.id} className="bg-[#131d38] border border-gray-800 rounded-xl p-4 shadow-md relative overflow-hidden">
                  
                  {/* Top Header */}
                  <div className="flex justify-between items-center text-[11px] text-gray-400 mb-3 pb-2 border-b border-gray-800">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider">{match?.sport_title || 'Soccer'}</span>
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 font-medium">{matchDate}</span>
                  </div>

                  {/* Teams Header */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between items-center font-bold text-sm">
                      <span className="text-gray-100">{match?.home_team || 'Home'}</span>
                      <span className="text-xs text-purple-300 font-normal">{probs.home}%</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-sm">
                      <span className="text-gray-100">{match?.away_team || 'Away'}</span>
                      <span className="text-xs text-purple-300 font-normal">{probs.away}%</span>
                    </div>
                  </div>

                  {/* AI Prediction Box */}
                  <div className="bg-[#0b1329] border border-purple-500/30 rounded-lg p-2.5 mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider block">AI Pick</span>
                      <span className="text-xs font-bold text-white">{ai?.pickLabel || 'Analysis'} ({ai?.pick || '-'})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block">Confidence</span>
                      <span className={`text-xs font-black ${ai?.rating === 'HIGH' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {ai?.confidence || '50%'} [{ai?.rating || 'MED'}]
                      </span>
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden flex mb-3">
                    <div style={{ width: `${probs.home}%` }} className="bg-emerald-500"></div>
                    <div style={{ width: `${probs.draw}%` }} className="bg-yellow-500"></div>
                    <div style={{ width: `${probs.away}%` }} className="bg-purple-500"></div>
                  </div>

                  {/* 1X2 Odds Buttons Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Home Odds */}
                    <button
                      onClick={() => handleSelectOdd(match.id, '1', odds.home)}
                      className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold transition ${
                        selected?.selection === '1'
                          ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300'
                          : ai?.pick === '1'
                          ? 'bg-purple-900/40 border border-purple-500 text-purple-200'
                          : 'bg-[#0b1329] hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <span className="text-gray-400">1</span>
                      <span className="text-emerald-400 font-bold">{odds.home}</span>
                    </button>

                    {/* Draw Odds */}
                    <button
                      onClick={() => handleSelectOdd(match.id, 'X', odds.draw)}
                      className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold transition ${
                        selected?.selection === 'X'
                          ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300'
                          : ai?.pick === 'X'
                          ? 'bg-purple-900/40 border border-purple-500 text-purple-200'
                          : 'bg-[#0b1329] hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <span className="text-gray-400">X</span>
                      <span className="text-emerald-400 font-bold">{odds.draw}</span>
                    </button>

                    {/* Away Odds */}
                    <button
                      onClick={() => handleSelectOdd(match.id, '2', odds.away)}
                      className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold transition ${
                        selected?.selection === '2'
                          ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300'
                          : ai?.pick === '2'
                          ? 'bg-purple-900/40 border border-purple-500 text-purple-200'
                          : 'bg-[#0b1329] hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <span className="text-gray-400">2</span>
                      <span className="text-emerald-400 font-bold">{odds.away}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

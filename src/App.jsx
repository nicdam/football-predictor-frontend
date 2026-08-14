import React, { useState, useEffect } from 'react';

export default function HybridPredictor() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);

  // NOTE: If you deploy to Render, change 'http://localhost:5000' to your Render URL.
const API_BASE = 'https://football-api-backend-e84s.onrender.com';
  useEffect(() => {
    fetch(`${API_BASE}/api/livescores`)
      .then(res => res.json())
      .then(data => {
        setLiveMatches(data);
        setLoading(false);
      });
  }, []);

  const handleGetAnalytics = async (fixtureId) => {
    setFetchingData(true);
    const res = await fetch(`${API_BASE}/api/hybrid-prediction/${fixtureId}`);
    const data = await res.json();
    setAnalytics(data);
    setFetchingData(false);
  };

  if (loading) return <div className="text-green-400 text-center p-10 font-bold uppercase tracking-widest">Booting Satellite Links...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Matches */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-black text-green-400 mb-6 uppercase tracking-widest">Global Live Feed</h1>
          <div className="space-y-3 max-h-[85vh] overflow-y-auto pr-2">
            {liveMatches.length === 0 ? <p className="text-gray-500">No active matches.</p> : liveMatches.map((match) => (
              <div 
                key={match.fixture.id} 
                onClick={() => handleGetAnalytics(match.fixture.id)}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-green-500 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] cursor-pointer transition-all flex flex-col"
              >
                <div className="text-xs text-gray-500 mb-2">{match.league.name} • {match.fixture.status.elapsed}'</div>
                <div className="flex justify-between items-center font-bold">
                  <span className="truncate w-1/3">{match.teams.home.name}</span>
                  <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-lg">
                    {match.goals.home} - {match.goals.away}
                  </span>
                  <span className="truncate w-1/3 text-right">{match.teams.away.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dual-Engine Analytics */}
        <div className="lg:col-span-2">
          {fetchingData ? (
            <div className="h-full flex items-center justify-center text-green-400 font-bold animate-pulse">
              Crunching Data Matrix...
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Engine 1: Global AI (API-Football) */}
              <div className="bg-gray-900 p-6 rounded-3xl border-t-4 border-t-purple-500 border border-gray-800">
                <h2 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  Pre-Match Global AI
                </h2>
                
                <h3 className="text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                  {analytics.apiAI.winner} Win
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Home ({analytics.apiAI.percent.home})</span>
                    <span className="text-gray-400">Away ({analytics.apiAI.percent.away})</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-purple-500" style={{ width: analytics.apiAI.percent.home }}></div>
                    <div className="h-full bg-gray-600" style={{ width: analytics.apiAI.percent.draw }}></div>
                    <div className="h-full bg-indigo-500" style={{ width: analytics.apiAI.percent.away }}></div>
                  </div>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">AI Verdict</p>
                  <p className="text-sm font-medium text-purple-300">{analytics.apiAI.advice}</p>
                </div>
              </div>

              {/* Engine 2: Custom Algorithm (Live + H2H) */}
              <div className="bg-gray-900 p-6 rounded-3xl border-t-4 border-t-green-500 border border-gray-800">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Custom Engine
                  </h2>
                  <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">Live + H2H</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  {analytics.customLiveEngine.matchMomentum}
                </h3>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex justify-between text-sm mb-2 font-bold">
                      <span className="text-gray-400">Calculated Home Threat</span>
                      <span className="text-green-400">{analytics.customLiveEngine.homeWinProb}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                      <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${analytics.customLiveEngine.homeWinProb}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2 font-bold">
                      <span className="text-gray-400">Calculated Away Threat</span>
                      <span className="text-emerald-600">{analytics.customLiveEngine.awayWinProb}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                      <div className="h-full bg-emerald-600 transition-all duration-1000" style={{ width: `${analytics.customLiveEngine.awayWinProb}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Historical Data Breakdown */}
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Context ({analytics.customLiveEngine.h2hData.matchesPlayed} H2H Matches)</p>
                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <p className="text-gray-400 mb-1">Home Win Rate</p>
                      <p className="font-bold text-green-300">{analytics.customLiveEngine.h2hData.homeH2HWinRate}%</p>
                    </div>
                    <div className="w-px bg-gray-800 mx-4"></div>
                    <div className="text-center">
                      <p className="text-gray-400 mb-1">Away Win Rate</p>
                      <p className="font-bold text-emerald-500">{analytics.customLiveEngine.h2hData.awayH2HWinRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-600 p-10 border border-dashed border-gray-800 rounded-3xl">
              <p className="font-medium uppercase tracking-widest">Select a live match</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

// ⚠️ REPLACE THIS WITH YOUR EXACT RENDER BACKEND URL (NO SLASH AT THE END)
const API_BASE = [https://football-api-backend-e84s.onrender.com](https://football-api-backend-e84s.onrender.com) ' ;

export default function App() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const fetchMatches = async (tab) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const endpoint = tab === 'live' ? '/api/fixtures/live' : '/api/fixtures/upcoming';
      const response = await axios.get(`${API_BASE}${endpoint}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setErrorMsg(`Failed to connect to backend: ${error.message}`);
    }
    setLoading(false);
  };

  const getOddValue = (oddsArray, type) => {
    if (!oddsArray) return '-';
    const odd = oddsArray.find(o => o.value === type);
    return odd ? odd.odd : '-';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-emerald-400">BetPredictor</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-md font-bold text-sm ${activeTab === 'upcoming' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
          >
            UPCOMING GAMES
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-2 rounded-md font-bold text-sm ${activeTab === 'live' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
          >
            LIVE NOW
          </button>
        </div>

        {/* Status Messages */}
        {loading ? (
          <div className="text-center text-emerald-400 mt-10 animate-pulse">
            Connecting to server...
          </div>
        ) : errorMsg ? (
          <div className="text-center text-red-400 mt-10 p-4 bg-red-900/20 rounded-lg border border-red-800">
            {errorMsg}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No matches found.</div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.fixture.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <span>{match.league.name}</span>
                  <span>{new Date(match.fixture.date).toLocaleString('en-NG', { weekday: 'short', hour: '2-digit', minute:'2-digit' })}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4 font-bold">
                  <div className="flex-1 truncate">{match.teams.home.name}</div>
                  <div className="px-3 text-emerald-400 text-lg">v</div>
                  <div className="flex-1 text-right truncate">{match.teams.away.name}</div>
                </div>

                {/* Betting Odds Interface */}
                {activeTab === 'upcoming' && (
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-gray-700 hover:bg-emerald-600 rounded p-2 flex flex-col items-center justify-center transition">
                      <span className="text-xs text-gray-400 mb-1">1 (Home)</span>
                      <span className="font-bold">{getOddValue(match.odds, 'Home')}</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-emerald-600 rounded p-2 flex flex-col items-center justify-center transition">
                      <span className="text-xs text-gray-400 mb-1">X (Draw)</span>
                      <span className="font-bold">{getOddValue(match.odds, 'Draw')}</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-emerald-600 rounded p-2 flex flex-col items-center justify-center transition">
                      <span className="text-xs text-gray-400 mb-1">2 (Away)</span>
                      <span className="font-bold">{getOddValue(match.odds, 'Away')}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

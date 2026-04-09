import React, { useState, useEffect } from 'react';
import { Settings, Users, LogOut, Code, Play, Plus, Hourglass, Menu, Trophy, ShoppingBag, User as UserIcon, X, Gamepad2, Volume2, Wifi } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Mock Client (Use actual values in production)
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

type Player = { id: string; name: string; avatar: string; isHost?: boolean };

const INITIAL_PLAYERS: Player[] = [
  { id: '1', name: 'Vortex_One', avatar: 'https://i.pravatar.cc/150?u=1', isHost: true },
  { id: '2', name: 'NeoSpark', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'GlitchMage', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'lobby' | 'settings'>('lobby');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayersCount, setActivePlayersCount] = useState(342); // Mock active global players
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Game Configuration State
  const [gameConfig, setGameConfig] = useState({
    animeUniverse: 'naruto',
    turnTimer: 15,
    maxRounds: 5
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} activePlayers={activePlayersCount} />;

  return (
    <div className="min-h-screen text-on-surface bg-background bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,#0e0e13_100%)] font-body selection:bg-primary/30">
      
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-high/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(211,148,255,0.4)]">
             <Gamepad2 className="w-5 h-5 text-surface-container-lowest" />
          </div>
          <div className="text-xl md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-600 tracking-tight">
            Electric Nocturne
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#00f4fe]" />
            <span className="text-xs font-bold tracking-wider text-secondary">{activePlayersCount} ONLINE</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
            className="text-slate-400 hover:bg-white/5 hover:text-purple-300 transition-all duration-300 p-2 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 p-2 rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pt-24 pb-32 px-6 flex justify-center min-h-screen relative overflow-hidden">
        
        {/* Decorative Grid SVG Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="w-full max-w-6xl relative z-10 flex gap-8">
          
          {/* Main Lobby View */}
          <main className="flex-1 flex flex-col items-center">
            
            {/* Lobby Code */}
            <section className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.3em] text-on-surface-variant uppercase mb-4 opacity-70">Lobby Access Code</p>
              <div className="inline-flex items-center gap-4 bg-surface-container-high/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-primary/20 shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:border-primary/40 transition-colors group cursor-pointer">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface group-hover:text-primary transition-colors">XT9-S4P</h1>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Code className="w-6 h-6" />
                </div>
              </div>
            </section>

            {/* Players Grid */}
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {players.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-3 group relative">
                  <div className={`relative ${p.isHost ? 'w-24 h-24 rounded-full p-1 bg-gradient-to-br from-secondary via-tertiary to-primary animate-spin-slow' : 'w-24 h-24 rounded-full p-1 border-2 border-secondary/50 group-hover:border-secondary transition-all'}`}>
                    <div className="w-full h-full rounded-full bg-surface-container p-1 relative overflow-hidden">
                      <img src={p.avatar} alt={p.name} className={`w-full h-full rounded-full object-cover ${p.isHost ? '[animation:spin_8s_linear_infinite_reverse]' : ''}`} />
                    </div>
                  </div>
                  {p.isHost && (
                    <div className="absolute top-[85px] bg-secondary text-on-secondary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter z-10 shadow-lg">Host</div>
                  )}
                  <span className="font-bold text-on-surface group-hover:text-secondary transition-colors mt-2">{p.name}</span>
                </div>
              ))}

              {/* Empty Slots */}
              {[...Array(5 - players.length)].map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center gap-3 group cursor-pointer mt-1">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center hover:border-secondary/40 hover:bg-white/5 transition-all">
                    <Plus className="w-8 h-8 text-outline-variant/60 group-hover:text-secondary/60" />
                  </div>
                  <span className="text-xs font-bold text-outline-variant uppercase tracking-widest mt-1">Invite</span>
                </div>
              ))}
            </div>

            {/* Host Action */}
            <div className="w-full max-w-xs px-4">
              <button className="w-full group relative overflow-hidden rounded-full p-[2px] focus:outline-none transition-transform active:scale-95 shadow-[0_0_30px_rgba(211,148,255,0.3)] hover:shadow-[0_0_40px_rgba(211,148,255,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-tertiary to-secondary animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                <div className="relative bg-surface rounded-full py-4 px-8 flex items-center justify-center gap-3 group-hover:bg-transparent transition-colors">
                  <span className="text-xl font-black uppercase tracking-[0.2em] group-hover:text-on-primary">Start Duel</span>
                  <Play className="w-6 h-6 text-primary group-hover:text-on-primary fill-current" />
                </div>
              </button>
              <p className="mt-4 text-center text-xs text-on-surface-variant font-medium">Waiting for players to ready up...</p>
            </div>
            
          </main>

          {/* Settings Sidebar (Desktop / Responsive Panel) */}
          {isSettingsOpen && (
            <aside className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-surface-container-high/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-40 p-6 overflow-y-auto animate-in slide-in-from-right">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-primary">Lobby Config</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Universe Engine</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['naruto', 'onepiece', 'bleach'].map(universe => (
                      <button 
                        key={universe}
                        onClick={() => setGameConfig({...gameConfig, animeUniverse: universe})}
                        className={`px-4 py-3 rounded-xl border text-left font-bold capitalize transition-all ${gameConfig.animeUniverse === universe ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(211,148,255,0.2)]' : 'bg-surface border-white/5 text-slate-400 hover:bg-white/5'}`}
                      >
                        {universe === 'naruto' ? 'Ninja Way (Naruto)' : universe === 'onepiece' ? 'Grand Line (One Piece)' : 'Soul Society (Bleach)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Turn Timer</label>
                  <div className="flex items-center gap-4 bg-surface px-4 py-3 rounded-xl border border-white/5">
                     <Hourglass className="w-4 h-4 text-secondary"/>
                     <input 
                      type="range" 
                      min="5" max="30" step="5" 
                      value={gameConfig.turnTimer}
                      onChange={(e) => setGameConfig({...gameConfig, turnTimer: parseInt(e.target.value)})}
                      className="flex-1 accent-primary" 
                    />
                     <span className="font-bold text-sm w-8 text-right">{gameConfig.turnTimer}s</span>
                  </div>
                </div>

                <button className="w-full mt-8 bg-secondary/10 border border-secondary/20 text-secondary py-3 rounded-xl font-bold hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 shadow-[0_0_15px_rgba(0,244,254,0.1)] hover:shadow-[0_0_20px_rgba(0,244,254,0.4)]">
                  Save Setup
                </button>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-safe bg-surface-container-high/90 backdrop-blur-xl border-t border-white/5 z-50 rounded-t-3xl">
        <NavItem icon={<Gamepad2/>} label="Lobby" active />
        <NavItem icon={<Trophy/>} label="Ranks" />
        <NavItem icon={<ShoppingBag/>} label="Shop" />
        <NavItem icon={<UserIcon/>} label="Profile" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 ${active ? 'text-primary' : 'text-slate-500 hover:text-purple-300'}`}>
      <div className={`mb-1 ${active ? 'shadow-[0_0_15px_rgba(211,148,255,0.4)] bg-primary/20 p-2 rounded-xl' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
    </div>
  );
}

// Authentication Screen Component
function AuthScreen({ onLogin, activePlayers }: { onLogin: (e: React.FormEvent) => void, activePlayers: number }) {
  const [isSignUP, setIsSignUP] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(circle_at_50%_0%,#2a1a3e_0%,#0e0e13_60%)] flex items-center justify-center p-6 relative overflow-hidden font-body">
      
      {/* Animated background elements */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(211,148,255,0.3)] mb-6 transform rotate-3 hover:rotate-0 transition-transform">
            <Gamepad2 className="w-8 h-8 text-white stroke-[1.5]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2">
            Electric Nocturne
          </h1>
          <p className="text-slate-400 font-medium">Anime Tactics Card Engine</p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
            <span className="text-sm font-bold text-slate-300">{activePlayers.toLocaleString()} Connectors Online</span>
          </div>
        </div>

        <form onSubmit={onLogin} className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isSignUP ? 'Create Protocol' : 'Access Grid'}
          </h2>

          <div className="space-y-4 mb-8">
            {isSignUP && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Alias (Username)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. Kakashi_Reader"
                />
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Network ID (Email)</label>
              <input 
                type="email" 
                required
                className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="ninja@hiddenleaf.co"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Encryption Key (Password)</label>
              <input 
                type="password" 
                required
                className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary-dim transition-colors shadow-[0_0_20px_rgba(211,148,255,0.4)]"
          >
            {isSignUP ? 'Initialize' : 'Enter Lobby'}
          </button>

          <p className="text-center mt-6 text-sm text-slate-400 font-medium">
            {isSignUP ? "Already registered?" : "Don't have an access code?"}{' '}
            <button 
              type="button" 
              onClick={() => setIsSignUP(!isSignUP)}
              className="text-secondary font-bold hover:underline"
            >
              {isSignUP ? 'Login Database' : 'Sign Up Database'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

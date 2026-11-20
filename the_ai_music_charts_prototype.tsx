import React, { useState, useMemo } from 'react';
import {
  Headphones,
  Plus,
  Coffee,
  ExternalLink,
  Search,
  Flag,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Server,
  ShieldCheck,
  X,
  Check,
  Wand2,
  SlidersHorizontal,
  Info,
  Award,
  Layers,
  Heart,
  Terminal
} from 'lucide-react';

// Initial realistic AI-generated track dataset (metadata + outbound links only)
const INITIAL_TRACKS = [
  {
    id: 'trk-1',
    title: 'Neon Protocol (Overdrive Mix)',
    artist: 'KAIROS_SYNTH',
    album: 'Mainframe Dreams EP',
    genre: 'Cyberpunk',
    aiTool: 'Suno',
    platform: 'Suno',
    url: 'https://suno.com/song/neon-protocol-demo',
    avgRating: 9.4,
    voteCount: 342,
    hoursAgo: 14,
    trend: 'up',
    artSeed: 1,
    promptSnippet: 'dark cyberpunk industrial bassline, 132 bpm, analog synth arpeggios, distorted vocoder'
  },
  {
    id: 'trk-2',
    title: 'Euphoria at 175 BPM',
    artist: 'DJ_NeuralNet',
    album: 'Rave Telemetry Vol. 2',
    genre: 'Happy Hardcore',
    aiTool: 'Udio',
    platform: 'YouTube',
    url: 'https://youtube.com/watch?v=euphoria175ai',
    avgRating: 9.1,
    voteCount: 289,
    hoursAgo: 26,
    trend: 'up',
    artSeed: 2,
    promptSnippet: 'uk happy hardcore, pitched female vocal chops, soaring supersaw lead, euphoric piano break'
  },
  {
    id: 'trk-3',
    title: 'Rain Over Neo-Cardiff',
    artist: 'Taff_LoFi_Bot',
    album: 'Midnight Raindrops',
    genre: 'Lo-Fi',
    aiTool: 'Stable Audio',
    platform: 'SoundCloud',
    url: 'https://soundcloud.com/taff-lofi/rain-over-neo-cardiff',
    avgRating: 8.8,
    voteCount: 415,
    hoursAgo: 72,
    trend: 'same',
    artSeed: 3,
    promptSnippet: 'chillhop dusty vinyl crackle, rhodes electric piano, soft rain ambiance, warm tape saturation'
  },
  {
    id: 'trk-4',
    title: 'Chrome Horizon 1988',
    artist: 'VectorWave',
    album: 'Outrun Sunset',
    genre: 'Synthwave',
    aiTool: 'Suno',
    platform: 'Bandcamp',
    url: 'https://vectorwave.bandcamp.com/track/chrome-horizon-1988',
    avgRating: 8.9,
    voteCount: 512,
    hoursAgo: 190,
    trend: 'up',
    artSeed: 4,
    promptSnippet: '80s retro synthwave, gated reverb snare, nostalgic analog brass, midnight highway drive'
  },
  {
    id: 'trk-5',
    title: 'Sub-Zero Amen Break',
    artist: 'LiquidTensor',
    album: 'Jungle Algorithms',
    genre: 'Drum & Bass',
    aiTool: 'Udio',
    platform: 'YouTube',
    url: 'https://youtube.com/watch?v=subzeroamen',
    avgRating: 8.6,
    voteCount: 198,
    hoursAgo: 9,
    trend: 'up',
    artSeed: 5,
    promptSnippet: 'atmospheric liquid drum and bass, chopped amen break, deep reese bass, ethereal pads'
  },
  {
    id: 'trk-6',
    title: 'Solaris Awakening',
    artist: 'AetherOrchestra',
    album: 'Dune & Dust OST',
    genre: 'Cinematic',
    aiTool: 'ElevenLabs',
    platform: 'Spotify',
    url: 'https://open.spotify.com/track/solaris-awakening-ai',
    avgRating: 9.2,
    voteCount: 630,
    hoursAgo: 420,
    trend: 'down',
    artSeed: 6,
    promptSnippet: 'epic sci-fi hybrid orchestral score, colossal brass swells, taiko drums, haunting solo cello'
  },
  {
    id: 'trk-7',
    title: 'Ghost in the Latent Space',
    artist: 'NullPointer',
    album: 'Single',
    genre: 'Cyberpunk',
    aiTool: 'Riffusion',
    platform: 'SoundCloud',
    url: 'https://soundcloud.com/nullpointer/ghost-latent-space',
    avgRating: 8.2,
    voteCount: 124,
    hoursAgo: 4,
    trend: 'up',
    artSeed: 7,
    promptSnippet: 'glitchy breakcore meets acid techno, 303 squelch, metallic percussion, dark cyber atmosphere'
  },
  {
    id: 'trk-8',
    title: 'Starlight Laserbeam',
    artist: 'HyperPixel',
    album: 'Candy Rave 2099',
    genre: 'Happy Hardcore',
    aiTool: 'Suno',
    platform: 'Suno',
    url: 'https://suno.com/song/starlight-laserbeam',
    avgRating: 8.5,
    voteCount: 276,
    hoursAgo: 110,
    trend: 'down',
    artSeed: 8,
    promptSnippet: 'bouncy makina and happy hardcore fusion, bright arpeggiators, energetic kickdrum, festival anthem'
  },
  {
    id: 'trk-9',
    title: 'Velvet Cassette',
    artist: 'AnalogGhost',
    album: 'Sleepless Study',
    genre: 'Lo-Fi',
    aiTool: 'Udio',
    platform: 'YouTube',
    url: 'https://youtube.com/watch?v=velvetcassette',
    avgRating: 8.7,
    voteCount: 890,
    hoursAgo: 1450,
    trend: 'same',
    artSeed: 9,
    promptSnippet: 'jazzy lofi hip hop, upright double bass, brushed snare, late night coffee shop vibes'
  }
];

const GENRES = ['All', 'Cyberpunk', 'Happy Hardcore', 'Synthwave', 'Lo-Fi', 'Drum & Bass', 'Cinematic'];
const AI_TOOLS = ['All', 'Suno', 'Udio', 'Stable Audio', 'ElevenLabs', 'Riffusion'];
const PLATFORMS = ['Suno', 'Udio', 'YouTube', 'SoundCloud', 'Bandcamp', 'Spotify'];

// Procedural geometric cover art component so zero external images are needed
const TrackArt = ({ seed, size = 'md' }) => {
  const palettes = [
    ['#00F5FF', '#FF007F', '#1A1A2E'],
    ['#FF007F', '#7928CA', '#0F0F1A'],
    ['#00F5FF', '#00B894', '#0D1B2A'],
    ['#FF007F', '#FF8C00', '#161122'],
    ['#00F5FF', '#3B82F6', '#0B132B'],
    ['#E0AAFF', '#FF007F', '#10002B'],
    ['#00F5FF', '#FCEE09', '#12121A'],
    ['#FF2A85', '#00F5FF', '#18122B'],
    ['#38BDF8', '#F43F5E', '#0F172A']
  ];
  const [c1, c2, bg] = palettes[(seed - 1) % palettes.length];
  const dim = size === 'lg' ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-14 h-14 sm:w-16 sm:h-16';

  return (
    <div
      className={`${dim} relative shrink-0 overflow-hidden border border-white/20 select-none`}
      style={{ backgroundColor: bg }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={bg} />
        <circle
          cx={25 + ((seed * 17) % 50)}
          cy={25 + ((seed * 23) % 50)}
          r={22 + (seed % 18)}
          fill={`url(#grad-${seed})`}
        />
        <polygon
          points={`0,${100 - (seed * 9) % 40} 100,${20 + (seed * 13) % 50} 100,100 0,100`}
          fill={c1}
          fillOpacity="0.22"
        />
        <line
          x1="0"
          y1={(seed * 19) % 100}
          x2="100"
          y2={100 - ((seed * 19) % 100)}
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          fill="none"
          stroke={c2}
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray={seed % 2 === 0 ? '4 2' : 'none'}
        />
      </svg>
    </div>
  );
};

export default function App() {
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [timeframe, setTimeframe] = useState('weekly'); // weekly | monthly | yearly | latest
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedTool, setSelectedTool] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState(['trk-1']);
  const [userVotes, setUserVotes] = useState({}); // { trackId: score }

  // Interactive UI states
  const [activeRatingId, setActiveRatingId] = useState(null);
  const [pendingScore, setPendingScore] = useState(9);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [reportTrack, setReportTrack] = useState(null);
  const [outboundPreview, setOutboundPreview] = useState(null);
  const [showArchDrawer, setShowArchDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Submit form state
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Cyberpunk',
    aiTool: 'Suno',
    platform: 'Suno',
    url: '',
    promptSnippet: ''
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Time-decay & chart ranking algorithm matching README specification
  const rankedTracks = useMemo(() => {
    const filtered = tracks.filter((t) => {
      const matchesGenre = selectedGenre === 'All' || t.genre === selectedGenre;
      const matchesTool = selectedTool === 'All' || t.aiTool === selectedTool;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album && t.album.toLowerCase().includes(q));
      return matchesGenre && matchesTool && matchesSearch;
    });

    const getChartScore = (track) => {
      if (timeframe === 'latest') {
        return -track.hoursAgo;
      }
      // Gravity constants: higher for weekly to boost fresh hits, lower for yearly
      const gravityMap = {
        weekly: 0.42,
        monthly: 0.18,
        yearly: 0.04
      };
      const G = gravityMap[timeframe] ?? 0.3;
      const engagement = track.avgRating * Math.log10(track.voteCount + 1);
      const decay = Math.pow(track.hoursAgo + 2, G);
      return engagement / decay;
    };

    return [...filtered].sort((a, b) => getChartScore(b) - getChartScore(a));
  }, [tracks, timeframe, selectedGenre, selectedTool, searchQuery]);

  const heroTrack = rankedTracks[0] || tracks[0];

  // Handle user 1-10 rating submission
  const handleRateTrack = (trackId, score) => {
    const prevUserVote = userVotes[trackId];

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id !== trackId) return t;
        let newCount = t.voteCount;
        let totalPoints = t.avgRating * t.voteCount;

        if (prevUserVote !== undefined) {
          totalPoints = totalPoints - prevUserVote + score;
        } else {
          newCount += 1;
          totalPoints += score;
        }

        const updatedAvg = Number((totalPoints / newCount).toFixed(1));
        return {
          ...t,
          avgRating: updatedAvg,
          voteCount: newCount,
          trend: score >= t.avgRating ? 'up' : t.trend
        };
      })
    );

    setUserVotes((prev) => ({ ...prev, [trackId]: score }));
    setActiveRatingId(null);
    triggerToast(`Rated ${score}/10 — Live chart rankings updated!`);
  };

  // Toggle saved/bookmarked track
  const toggleSave = (trackId) => {
    setSavedIds((prev) => {
      const exists = prev.includes(trackId);
      triggerToast(exists ? 'Removed from saved tracks' : 'Saved to your local crate');
      return exists ? prev.filter((id) => id !== trackId) : [...prev, trackId];
    });
  };

  // Simulate OpenGraph auto-fetch from pasted URL
  const handleSimulateAutoFetch = () => {
    const urlLower = newTrack.url.toLowerCase();
    let detectedPlatform = 'YouTube';
    let detectedTool = 'Suno';

    if (urlLower.includes('suno')) {
      detectedPlatform = 'Suno';
      detectedTool = 'Suno';
    } else if (urlLower.includes('udio')) {
      detectedPlatform = 'Udio';
      detectedTool = 'Udio';
    } else if (urlLower.includes('soundcloud')) {
      detectedPlatform = 'SoundCloud';
      detectedTool = 'Stable Audio';
    } else if (urlLower.includes('bandcamp')) {
      detectedPlatform = 'Bandcamp';
      detectedTool = 'Udio';
    } else if (urlLower.includes('spotify')) {
      detectedPlatform = 'Spotify';
      detectedTool = 'Suno';
    }

    setNewTrack((prev) => ({
      ...prev,
      title: prev.title || 'Binary Sunset Over Severn',
      artist: prev.artist || 'Cymru_Synth_AI',
      album: prev.album || 'Neural Horizons',
      platform: detectedPlatform,
      aiTool: detectedTool,
      url: prev.url || 'https://suno.com/song/binary-sunset-severn',
      promptSnippet:
        prev.promptSnippet || 'melodic synthwave, atmospheric pads, crisp 80s drum machine, 118 bpm'
    }));

    triggerToast('OpenGraph metadata auto-filled from URL');
  };

  // Submit new track to feed
  const handleCreateTrack = (e) => {
    e.preventDefault();
    if (!newTrack.title.trim() || !newTrack.artist.trim() || !newTrack.url.trim()) return;

    const created = {
      id: `trk-${Date.now()}`,
      title: newTrack.title.trim(),
      artist: newTrack.artist.trim(),
      album: newTrack.album.trim() || 'Single',
      genre: newTrack.genre,
      aiTool: newTrack.aiTool,
      platform: newTrack.platform,
      url: newTrack.url.startsWith('http') ? newTrack.url.trim() : `https://${newTrack.url.trim()}`,
      avgRating: 9.0,
      voteCount: 1,
      hoursAgo: 0,
      trend: 'up',
      artSeed: tracks.length + 1,
      promptSnippet: newTrack.promptSnippet.trim()
    };

    setTracks((prev) => [created, ...prev]);
    setTimeframe('latest');
    setSelectedGenre('All');
    setSelectedTool('All');
    setIsSubmitOpen(false);
    setNewTrack({
      title: '',
      artist: '',
      album: '',
      genre: 'Cyberpunk',
      aiTool: 'Suno',
      platform: 'Suno',
      url: '',
      promptSnippet: ''
    });
    triggerToast(`"${created.title}" indexed to The AI Music Charts!`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 font-sans selection:bg-[#00F5FF] selection:text-[#0A0A0F] flex flex-col">
      {/* Subtle Top Architectural Status Bar */}
      <div className="bg-[#12121A] border-b border-white/10 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#00F5FF] animate-pulse" />
          <span>DISCOVERY LAYER ONLY • 0.00 MB AUDIO STORED • OUTBOUND LINKS</span>
        </div>
        <button
          onClick={() => setShowArchDrawer(!showArchDrawer)}
          className="text-[#00F5FF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Terminal className="w-3 h-3" />
          <span>{showArchDrawer ? 'Hide Dev Spec' : 'Zero-Cost MVP Architecture'}</span>
        </button>
      </div>

      {/* Collapsible Dev Architecture Banner */}
      {showArchDrawer && (
        <div className="bg-[#101018] border-b-2 border-[#00F5FF] px-4 py-5">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-[#0A0A0F] border border-white/15">
              <div className="text-[#00F5FF] font-bold mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> 1. ZERO HOSTING OVERHEAD
              </div>
              <p className="text-slate-400 leading-relaxed">
                Stores only track metadata, cover seeds, and external URLs (Suno, Udio, YouTube).
                Eliminates S3 audio storage & streaming bandwidth bills.
              </p>
            </div>
            <div className="p-3.5 bg-[#0A0A0F] border border-white/15">
              <div className="text-[#FF007F] font-bold mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> 2. SUPABASE + NEXT.JS STACK
              </div>
              <p className="text-slate-400 leading-relaxed">
                Runs on free-tier PostgreSQL + OAuth (`tracks` & `votes` tables) with gravity
                time-decay ranking across Weekly, Monthly & Yearly views.
              </p>
            </div>
            <div className="p-3.5 bg-[#0A0A0F] border border-white/15">
              <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 3. DMCA SAFE-HARBOR READY
              </div>
              <p className="text-slate-400 leading-relaxed">
                Every card features instant dead-link/DMCA reporting and directs traffic straight to
                the original platform & creator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md border-b-2 border-white/15">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#12121A] border-2 border-[#00F5FF] shadow-[3px_3px_0px_#FF007F] flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#00F5FF]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase flex items-center gap-2">
                <span>The AI Music Charts</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/50">
                  BETA
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Community-ranked index for generative audio
              </p>
            </div>
          </div>

          {/* Header Actions: Support + Submit Track */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-3 py-2 bg-[#12121A] hover:bg-white/5 text-slate-200 border border-white/25 hover:border-[#FF007F] text-xs sm:text-sm font-mono flex items-center gap-2 transition-all cursor-pointer"
              title="Help keep server costs at £0"
            >
              <Coffee className="w-4 h-4 text-[#FF007F]" />
              <span className="hidden xs:inline">Support</span>
            </button>

            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-4 py-2 bg-[#00F5FF] hover:bg-[#33F7FF] text-[#0A0A0F] font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-[#00F5FF] shadow-[3px_3px_0px_#FF007F] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Submit Track</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 flex-1 space-y-8">
        {/* Hero #1 Trending Track Spotlight */}
        {heroTrack && (
          <section className="relative bg-[#12121A] border-2 border-white/20 p-5 sm:p-6 shadow-[6px_6px_0px_#00F5FF]/20 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
                <div className="relative">
                  <TrackArt seed={heroTrack.artSeed} size="lg" />
                  <div className="absolute -top-2.5 -left-2.5 bg-[#FF007F] text-white font-mono font-black text-xs px-2.5 py-1 border border-white shadow-[2px_2px_0px_#0A0A0F] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>#1 {timeframe.toUpperCase()}</span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 font-bold">
                      {heroTrack.aiTool}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 text-slate-300 border border-white/15">
                      {heroTrack.genre}
                    </span>
                    <span className="px-2 py-0.5 bg-[#FF007F]/15 text-[#FF007F] border border-[#FF007F]/40">
                      Hosted on {heroTrack.platform}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
                      {heroTrack.title}
                    </h2>
                    <p className="text-sm font-mono text-slate-300 mt-0.5">
                      by <span className="text-[#00F5FF] font-semibold">{heroTrack.artist}</span>
                      {heroTrack.album && (
                        <span className="text-slate-500"> • Album: {heroTrack.album}</span>
                      )}
                    </p>
                  </div>

                  {heroTrack.promptSnippet && (
                    <div className="bg-[#0A0A0F] border-l-2 border-[#FF007F] px-3 py-1.5 text-xs font-mono text-slate-400 max-w-2xl">
                      <span className="text-slate-500 select-none">PROMPT // </span>
                      {heroTrack.promptSnippet}
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Score & Outbound Link CTA */}
              <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                <div className="text-left md:text-right font-mono">
                  <div className="text-[11px] uppercase tracking-widest text-slate-400">
                    Community Score
                  </div>
                  <div className="flex items-baseline md:justify-end gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#00F5FF]">
                      {heroTrack.avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500">/10</span>
                  </div>
                  <div className="text-xs text-slate-400">{heroTrack.voteCount} ratings</div>
                </div>

                <button
                  onClick={() => setOutboundPreview(heroTrack)}
                  className="px-4 py-2.5 bg-white hover:bg-[#00F5FF] text-[#0A0A0F] font-mono font-bold text-xs uppercase tracking-wider border-2 border-white hover:border-[#00F5FF] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Open Original Track</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Chart Timeframe Tabs + Filter Controls */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/15 pb-4">
            {/* Timeframe Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'weekly', label: 'Weekly Chart' },
                { id: 'monthly', label: 'Monthly Chart' },
                { id: 'yearly', label: 'Yearly Chart' },
                { id: 'latest', label: 'Latest Submissions' }
              ].map((tab) => {
                const active = timeframe === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTimeframe(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#00F5FF] text-[#0A0A0F] border-[#00F5FF] shadow-[3px_3px_0px_#FF007F]'
                        : 'bg-[#12121A] text-slate-300 border-white/15 hover:border-white/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search track, artist, album..."
                className="w-full bg-[#12121A] border border-white/20 focus:border-[#00F5FF] pl-9 pr-3 py-2 text-xs sm:text-sm font-mono text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Genre & AI Generator Tool Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            {/* Genres */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-slate-500 flex items-center gap-1 mr-1 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" /> GENRE:
              </span>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-2.5 py-1 border shrink-0 transition-colors cursor-pointer ${
                    selectedGenre === genre
                      ? 'bg-[#FF007F] text-white border-[#FF007F] font-bold'
                      : 'bg-[#12121A] text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* AI Generator Tool Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-slate-500 flex items-center gap-1 mr-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#00F5FF]" /> AI TOOL:
              </span>
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool}
                  onClick={() => setSelectedTool(tool)}
                  className={`px-2.5 py-1 border shrink-0 transition-colors cursor-pointer ${
                    selectedTool === tool
                      ? 'bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF] font-bold'
                      : 'bg-[#12121A] text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Ranked Chart Leaderboard */}
        <section className="space-y-3">
          {rankedTracks.length === 0 ? (
            <div className="bg-[#12121A] border border-white/15 p-10 text-center space-y-3">
              <p className="font-mono text-slate-400 text-sm">
                No tracks match your current filter combination.
              </p>
              <button
                onClick={() => {
                  setSelectedGenre('All');
                  setSelectedTool('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#00F5FF] text-[#0A0A0F] font-mono font-bold text-xs uppercase cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            rankedTracks.map((track, idx) => {
              const rank = idx + 1;
              const isSaved = savedIds.includes(track.id);
              const userScore = userVotes[track.id];
              const isRatingOpen = activeRatingId === track.id;

              return (
                <div
                  key={track.id}
                  className={`group bg-[#12121A] border transition-all p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    rank === 1
                      ? 'border-[#00F5FF]/60 shadow-[0_0_20px_rgba(0,245,255,0.07)]'
                      : 'border-white/15 hover:border-[#00F5FF]/50'
                  }`}
                >
                  {/* Left: Rank + Art + Metadata */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                    {/* Rank Number & Trend */}
                    <div className="w-10 sm:w-12 text-center shrink-0 font-mono">
                      <div
                        className={`text-lg sm:text-xl font-black ${
                          rank === 1
                            ? 'text-[#00F5FF]'
                            : rank === 2
                            ? 'text-[#FF007F]'
                            : rank === 3
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        #{rank}
                      </div>
                      <div className="flex items-center justify-center mt-0.5">
                        {track.trend === 'up' && (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {track.trend === 'down' && (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        {track.trend === 'same' && <Minus className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                    </div>

                    {/* Procedural Cover Art */}
                    <TrackArt seed={track.artSeed} size="md" />

                    {/* Track Title, Artist, Album & Badges */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors truncate">
                          {track.title}
                        </h3>
                      </div>

                      <div className="text-xs font-mono text-slate-400 truncate">
                        <span className="text-slate-200 font-semibold">{track.artist}</span>
                        {track.album && <span> • {track.album}</span>}
                        <span className="text-slate-500">
                          {' '}
                          • {track.hoursAgo === 0 ? 'Just now' : `${track.hoursAgo}h ago`}
                        </span>
                      </div>

                      {/* Metadata Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                        <span className="px-2 py-0.5 bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30">
                          {track.aiTool}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10">
                          {track.genre}
                        </span>
                        <span className="px-2 py-0.5 bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/30">
                          @{track.platform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score Display, Interactive 1-10 Rating, Outbound Link & Quick Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                    {/* Average Score Pill */}
                    <div className="font-mono text-left sm:text-right mr-1">
                      <div className="flex items-baseline sm:justify-end gap-0.5">
                        <span className="text-xl font-black text-white">
                          {track.avgRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">/10</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{track.voteCount} votes</div>
                    </div>

                    {/* Interactive 1-10 Rating Button / Popover */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          if (isRatingOpen) {
                            setActiveRatingId(null);
                          } else {
                            setPendingScore(userScore ?? 9);
                            setActiveRatingId(track.id);
                          }
                        }}
                        className={`px-3 py-2 font-mono text-xs font-bold border transition-all cursor-pointer ${
                          userScore !== undefined
                            ? 'bg-[#FF007F]/20 text-[#FF007F] border-[#FF007F]'
                            : 'bg-[#0A0A0F] hover:bg-white/5 text-slate-200 border-white/25 hover:border-[#00F5FF]'
                        }`}
                      >
                        {userScore !== undefined ? `Your Vote: ${userScore}/10` : 'Rate 1–10'}
                      </button>

                      {/* 1-10 Rating Selector Popover */}
                      {isRatingOpen && (
                        <div className="absolute right-0 bottom-full mb-2 z-20 w-64 bg-[#0A0A0F] border-2 border-[#00F5FF] shadow-[4px_4px_0px_#FF007F] p-3 space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-300 font-bold">SELECT SCORE</span>
                            <span className="text-[#00F5FF] font-black text-sm">
                              {pendingScore} / 10
                            </span>
                          </div>

                          <div className="grid grid-cols-5 gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <button
                                key={num}
                                onClick={() => setPendingScore(num)}
                                className={`py-1.5 text-xs font-mono font-bold border cursor-pointer ${
                                  pendingScore === num
                                    ? 'bg-[#00F5FF] text-[#0A0A0F] border-[#00F5FF]'
                                    : 'bg-[#12121A] text-slate-300 border-white/15 hover:border-white/40'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleRateTrack(track.id, pendingScore)}
                              className="flex-1 py-1.5 bg-[#FF007F] hover:bg-[#ff1a8c] text-white font-mono font-bold text-xs uppercase cursor-pointer"
                            >
                              Submit Rating
                            </button>
                            <button
                              onClick={() => setActiveRatingId(null)}
                              className="px-2 py-1.5 bg-white/10 text-slate-300 text-xs font-mono cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outbound Listen Link */}
                    <button
                      onClick={() => setOutboundPreview(track)}
                      className="px-3.5 py-2 bg-[#00F5FF]/15 hover:bg-[#00F5FF] text-[#00F5FF] hover:text-[#0A0A0F] border border-[#00F5FF] font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Listen on {track.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark & Flag Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleSave(track.id)}
                        className={`p-2 border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-[#00F5FF]/15 border-[#00F5FF] text-[#00F5FF]'
                            : 'bg-[#0A0A0F] border-white/15 text-slate-400 hover:text-white'
                        }`}
                        title="Save Track"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setReportTrack(track)}
                        className="p-2 bg-[#0A0A0F] border border-white/15 text-slate-500 hover:text-rose-400 hover:border-rose-400/50 transition-colors cursor-pointer"
                        title="Report Dead Link or DMCA Issue"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/15 bg-[#12121A] mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-white font-bold">🎧 THE AI MUSIC CHARTS</span>
            <span>•</span>
            <span>Zero Audio Hosted</span>
            <span>•</span>
            <span>Metadata & Outbound Links Only</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowArchDrawer(!showArchDrawer)}
              className="hover:text-[#00F5FF] transition-colors cursor-pointer"
            >
              Architecture Spec
            </button>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="hover:text-[#FF007F] transition-colors cursor-pointer"
            >
              Keep Costs £0 (Donate)
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Submit Track Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121A] border-2 border-[#00F5FF] shadow-[8px_8px_0px_#FF007F] w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Submit AI Track Link
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  No audio uploads. Index metadata & external URL only.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrack} className="space-y-3.5 text-xs font-mono">
              {/* Outbound URL + Simulated OpenGraph Scraper */}
              <div>
                <label className="block text-slate-300 mb-1 font-bold">
                  EXTERNAL TRACK URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newTrack.url}
                    onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
                    placeholder="https://suno.com/song/... or youtube.com/..."
                    className="flex-1 bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateAutoFetch}
                    className="px-3 py-2 bg-[#FF007F]/20 hover:bg-[#FF007F] text-[#FF007F] hover:text-white border border-[#FF007F] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Simulate OpenGraph metadata extraction"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto-Fill</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">TRACK NAME *</label>
                  <input
                    type="text"
                    required
                    value={newTrack.title}
                    onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                    placeholder="e.g. Cybernetic Dawn"
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    CREATOR / ARTIST ALIAS *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTrack.artist}
                    onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                    placeholder="e.g. SynthArchitect"
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    ALBUM / EP (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={newTrack.album}
                    onChange={(e) => setNewTrack({ ...newTrack, album: e.target.value })}
                    placeholder="Single"
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">HOSTING PLATFORM</label>
                  <select
                    value={newTrack.platform}
                    onChange={(e) => setNewTrack({ ...newTrack, platform: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">GENRE</label>
                  <select
                    value={newTrack.genre}
                    onChange={(e) => setNewTrack({ ...newTrack, genre: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  >
                    {GENRES.filter((g) => g !== 'All').map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">AI GENERATOR TOOL</label>
                  <select
                    value={newTrack.aiTool}
                    onChange={(e) => setNewTrack({ ...newTrack, aiTool: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                  >
                    {AI_TOOLS.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">
                  PROMPT / STYLE TAGS (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={newTrack.promptSnippet}
                  onChange={(e) => setNewTrack({ ...newTrack, promptSnippet: e.target.value })}
                  placeholder="e.g. 140 bpm darksynth, heavy analog bass, atmospheric pads"
                  className="w-full bg-[#0A0A0F] border border-white/25 focus:border-[#00F5FF] px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 border border-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00F5FF] text-[#0A0A0F] font-bold uppercase tracking-wider border-2 border-[#00F5FF] shadow-[3px_3px_0px_#FF007F] cursor-pointer"
                >
                  Index Track Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Ko-fi / Buy Me a Coffee Support Modal */}
      {isDonateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121A] border-2 border-[#FF007F] shadow-[8px_8px_0px_#00F5FF] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#FF007F]" />
                <h3 className="text-lg font-black uppercase text-white">Keep The Charts Free</h3>
              </div>
              <button
                onClick={() => setIsDonateOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Because we store <span className="text-[#00F5FF]">zero audio files</span> and only
              index metadata links, our monthly database & domain costs stay ultra-low. Community
              tips cover 100% of hosting so there are never intrusive ads or paywalls.
            </p>

            <div className="grid grid-cols-3 gap-2.5 font-mono">
              {['£3', '£5', '£10'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setIsDonateOpen(false);
                    triggerToast(`Thank you! Simulated ${amt} Ko-fi tip received ❤️`);
                  }}
                  className="py-3 bg-[#0A0A0F] hover:bg-[#FF007F] text-white border border-white/25 hover:border-[#FF007F] font-bold text-sm transition-colors cursor-pointer"
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="bg-[#0A0A0F] border border-white/10 p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Server Goal: £12 / month</span>
              <span className="text-emerald-400 font-bold">85% Funded</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Outbound Link Preview Modal (Keeps devs in prototype while showing redirect) */}
      {outboundPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121A] border-2 border-[#00F5FF] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/40">
                OUTBOUND REDIRECT
              </span>
              <button
                onClick={() => setOutboundPreview(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">{outboundPreview.title}</h4>
              <p className="text-xs font-mono text-slate-400">
                By {outboundPreview.artist} • Hosted on {outboundPreview.platform}
              </p>
            </div>

            <div className="bg-[#0A0A0F] border border-white/15 p-3 font-mono text-xs text-[#00F5FF] break-all">
              {outboundPreview.url}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The AI Music Charts does not stream audio directly. Clicking below sends listeners to
              the creator’s official upload on <strong className="text-white">{outboundPreview.platform}</strong> so they get full plays and credit.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setOutboundPreview(null)}
                className="px-4 py-2 border border-white/20 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Stay on Charts
              </button>
              <a
                href={outboundPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOutboundPreview(null)}
                className="px-4 py-2 bg-[#00F5FF] text-[#0A0A0F] font-mono font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <span>Continue to {outboundPreview.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Report Dead Link / DMCA Safe-Harbor Modal */}
      {reportTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121A] border-2 border-rose-500 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black uppercase text-rose-400 flex items-center gap-2">
                <Flag className="w-4 h-4" /> Report / Takedown Notice
              </h3>
              <button
                onClick={() => setReportTrack(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300">
              Flagging: <span className="text-white font-bold">{reportTrack.title}</span>
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                'Dead / 404 External Link',
                'Not AI-Generated Music',
                'DMCA / Voice Impersonation Takedown',
                'Spam or Duplicate Entry'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setReportTrack(null);
                    triggerToast(`Report logged ("${reason}") for moderator review.`);
                  }}
                  className="w-full text-left px-3 py-2.5 bg-[#0A0A0F] hover:bg-rose-500/20 border border-white/15 hover:border-rose-500 text-slate-200 transition-colors cursor-pointer"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A0A0F] border-2 border-[#00F5FF] shadow-[4px_4px_0px_#FF007F] px-4 py-3 flex items-center gap-2.5 text-xs font-mono text-white">
          <Check className="w-4 h-4 text-[#00F5FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
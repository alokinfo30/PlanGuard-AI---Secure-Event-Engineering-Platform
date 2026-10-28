import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Cake, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Palette, 
  Utensils, 
  Smile, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Bot,
  Layers,
  ChevronDown,
  ChevronUp,
  BookmarkPlus
} from 'lucide-react';
import { 
  AssistantPlanResult, 
  ColorSwatch, 
  SignatureItem, 
  GuestExperience, 
  DecorConcept,
  EventCategory,
  Milestone,
  VendorChecklistItem
} from '../../types';

interface GenAIAssistantModuleProps {
  activeTenant: string;
  onPlanApplied?: (plan: AssistantPlanResult) => void;
  onNavigateToTab?: (tab: string) => void;
}

interface PresetInspiration {
  id: string;
  category: 'Wedding' | 'Birthday' | 'Community';
  title: string;
  tagline: string;
  budget: number;
  guests: number;
  vibe: string;
  location: string;
  notes: string;
  badge: string;
}

const PRESET_INSPIRATIONS: PresetInspiration[] = [
  {
    id: 'pre-wedding-1',
    category: 'Wedding',
    title: 'Botanical Glasshouse Wedding Gala',
    tagline: 'An Organic Symphony of Light and Floral Romance',
    budget: 45000,
    guests: 120,
    vibe: 'Sunlit conservatory, eucalyptus greenery, acoustic string quartet, farm-to-table tasting',
    location: 'Meadowood Glasshouse, Sonoma Valley, CA',
    notes: 'Require vegan-friendly plated alternatives and late-night firepit s\'mores.',
    badge: '💍 Wedding Favorite'
  },
  {
    id: 'pre-bday-1',
    category: 'Birthday',
    title: 'Marcus 30th Cyberpunk Rooftop Bash',
    tagline: 'Level 30 Unlocked: Synthwave Nights Above the Skyline',
    budget: 12000,
    guests: 60,
    vibe: 'Neon magenta & cyan glow, pro house DJ, 360 slow-mo video booth, craft smoked mixology',
    location: 'Cloud 9 Skyline Rooftop, Downtown Austin, TX',
    notes: 'Include late-night street taco cart and custom geode amethsyt birthday cake.',
    badge: '🎂 Milestone 30th'
  },
  {
    id: 'pre-comm-1',
    category: 'Community',
    title: 'Greenwood Valley Spring Solstice & Charity Fest',
    tagline: 'Connecting Neighbors, Celebrating Earth, Supporting Local Families',
    budget: 28000,
    guests: 800,
    vibe: 'Open-air municipal park, artisan craft market, 6 gourmet food trucks, solar-powered stage',
    location: 'Greenwood Memorial Park & Promenade, Seattle, WA',
    notes: 'City street closure permits required, volunteer marshal check-in, ADA ramps.',
    badge: '🏘️ Community Festival'
  },
  {
    id: 'pre-wedding-2',
    category: 'Wedding',
    title: 'Rustic Boho Vineyard Sunset Nuptials',
    tagline: 'Warm Terracotta, Barrel Cellar Intimacy, and Starlit Toasts',
    budget: 32000,
    guests: 85,
    vibe: 'Pampas grass, warm amber lighting, acoustic singer-songwriter, barrel-aged wine pairing',
    location: 'Sunridge Vineyard Estate, Paso Robles, CA',
    notes: 'Outdoor ceremony at golden hour followed by seated dinner in the barrel room.',
    badge: '💍 Boho Romance'
  },
  {
    id: 'pre-bday-2',
    category: 'Birthday',
    title: 'Sweet 16 Retro Roller Disco & Glow Rave',
    tagline: 'Neon Wheels, 80s Synth Hits, and Mocktail Slushie Bar',
    budget: 7500,
    guests: 50,
    vibe: 'Private roller rink rental, blacklight glow sticks, custom roller skates, retro photo prints',
    location: 'Starlight Roller Pavilion, Chicago, IL',
    notes: 'Non-alcoholic craft slushies, giant sprinkle sheet cake, pizza buffet.',
    badge: '🎂 Sweet 16'
  },
  {
    id: 'pre-comm-2',
    category: 'Community',
    title: 'Neighborhood Food Truck Rally & 5K Charity Dash',
    tagline: 'Run for the Parks: Fitness, Flavor, and Live Local Bands',
    budget: 18000,
    guests: 500,
    vibe: 'Morning 5K community run followed by 8 gourmet food trucks and kids lawn games',
    location: 'Riverside Linear Greenway, Austin, TX',
    notes: 'City police escort, water refill hydrants, finish line timing arch.',
    badge: '🏘️ 5K & Food Rally'
  }
];

export const GenAIAssistantModule: React.FC<GenAIAssistantModuleProps> = ({
  activeTenant,
  onPlanApplied,
  onNavigateToTab
}) => {
  // Category Mode: Wedding | Birthday | Community | Custom
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Wedding' | 'Birthday' | 'Community'>('All');
  
  // Form State
  const [eventType, setEventType] = useState<'Wedding' | 'Birthday' | 'Community'>('Wedding');
  const [eventTitle, setEventTitle] = useState('Alice & David Botanical Wedding Gala');
  const [targetDate, setTargetDate] = useState('2027-06-20');
  const [budgetTotal, setBudgetTotal] = useState<string>('45000');
  const [guestCount, setGuestCount] = useState<string>('120');
  const [vibe, setVibe] = useState('Sunlit conservatory, eucalyptus greenery, acoustic string quartet, farm-to-table tasting');
  const [location, setLocation] = useState('Meadowood Glasshouse, Sonoma Valley, CA');
  const [specialPreferences, setSpecialPreferences] = useState('Plated dinner with vegan options, signature botanical cocktails, audio guestbook');

  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<AssistantPlanResult | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Assistant Chat Consultant State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am your PlanGuard GenAI Event Planning Assistant. Ask me anything about wedding vendor timelines, birthday themes, permit applications, or budget trade-offs.',
      time: 'Just now'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'ideas' | 'budget' | 'timeline' | 'vendors'>('ideas');

  // Load Preset
  const handleLoadPreset = (preset: PresetInspiration) => {
    setEventType(preset.category);
    setEventTitle(preset.title);
    setBudgetTotal(preset.budget.toString());
    setGuestCount(preset.guests.toString());
    setVibe(preset.vibe);
    setLocation(preset.location);
    setSpecialPreferences(preset.notes);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Generate Master Plan
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setSaveSuccessMsg(null);

    const budgetNum = Number(budgetTotal);
    const guestsNum = Number(guestCount);

    if (isNaN(budgetNum) || budgetNum <= 0) {
      setGenerationError('Please enter a valid positive budget number.');
      setIsGenerating(false);
      return;
    }
    if (isNaN(guestsNum) || guestsNum <= 0) {
      setGenerationError('Guest count must be at least 1 person.');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/assistant/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({
          eventType,
          eventTitle,
          targetDate,
          budgetTotal: budgetNum,
          guestCount: guestsNum,
          vibe,
          location,
          specialPreferences,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan.');
      }

      setPlanResult(data.plan);
      setActivePlanTab('ideas');
    } catch (err: any) {
      setGenerationError(err.message || 'Error communicating with Gemini 3.8 Flash gateway.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Click Apply to Active Plan
  const handleApplyToActivePlan = async () => {
    if (!planResult) return;
    try {
      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({ plan: planResult }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveSuccessMsg('Master Plan applied and synchronized across Financials, Timeline, and Vendor Checklist!');
        if (onPlanApplied) {
          onPlanApplied(planResult);
        }
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      setGenerationError('Failed to save plan to tenant database.');
    }
  };

  // Copy Hex Code
  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Send Assistant Chat Question
  const handleSendChat = async () => {
    if (!chatMessage.trim() || isChatLoading) return;
    const userText = chatMessage.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory(prev => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({
          message: userText,
          eventType,
          currentBudget: budgetTotal,
          guestCount,
          location,
        }),
      });
      const data = await res.json();
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatHistory(prev => [
        ...prev, 
        { 
          sender: 'assistant', 
          text: data.reply || 'Here is the strategic advice for your event.', 
          time: replyTime 
        }
      ]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Security gateway communication error. Please try again shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filteredPresets = selectedCategory === 'All' 
    ? PRESET_INSPIRATIONS 
    : PRESET_INSPIRATIONS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>PlanCraft GenAI Assistant &middot; Powered by Gemini 3.8 Flash</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Intelligent Event Assistant for <br className="hidden sm:inline"/>
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Weddings, Birthdays & Community Festivals
            </span>
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Generate complete personalized master strategies in seconds: moodboard palettes, signature food & drink menus, interactive guest journeys, deterministic budget allocations, backward timeline milestones, and vendor checklists.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              10% Guaranteed Math Contingency
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Structural Prompt Isolation
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Calendar className="w-3.5 h-3.5" />
              Gregorian Backward Timeline
            </span>
          </div>
        </div>
      </section>

      {/* Preset Inspiration Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Curated Event Inspiration Presets
            </h2>
            <p className="text-xs text-slate-400">
              Select a pre-configured theme to instantly populate the AI strategy generator:
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
            {(['All', 'Wedding', 'Birthday', 'Community'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'Wedding' && '💍 '}
                {cat === 'Birthday' && '🎂 '}
                {cat === 'Community' && '🏘️ '}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map(preset => (
            <div
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="group cursor-pointer rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 p-4 transition-all duration-200 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {preset.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${preset.budget.toLocaleString()}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  &ldquo;{preset.tagline}&rdquo;
                </p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {preset.vibe}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {preset.guests} Guests
                </span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Load Preset <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Generator Form */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            Customize Your Event Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gemini 3.8 Flash will synthesize your vision into an end-to-end plan with decoupled mathematical guarantees.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setEventType('Wedding')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              eventType === 'Wedding'
                ? 'bg-rose-950/40 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-bold">💍 Wedding</span>
            <span className="text-[10px] text-slate-400">Ceremony & Reception</span>
          </button>

          <button
            type="button"
            onClick={() => setEventType('Birthday')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              eventType === 'Birthday'
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cake className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold">🎂 Birthday Bash</span>
            <span className="text-[10px] text-slate-400">Milestones & Themes</span>
          </button>

          <button
            type="button"
            onClick={() => setEventType('Community')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              eventType === 'Community'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">🏘️ Community Event</span>
            <span className="text-[10px] text-slate-400">Festivals, Markets & 5Ks</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Event Title / Couple / Honoree
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g., Sarah & Michael Wedding Gala"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Total Budget (USD $)
            </label>
            <input
              type="number"
              value={budgetTotal}
              onChange={(e) => setBudgetTotal(e.target.value)}
              placeholder="45000"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Estimated Guest Count
            </label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="120"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Geographic Location / Target City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Sonoma Valley, CA or Austin, TX"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Atmosphere & Vibe Description
            </label>
            <textarea
              rows={2}
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. Elegant garden party with candlelight, string quartet, and warm natural tones."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Special Preferences & Notes
            </label>
            <textarea
              rows={2}
              value={specialPreferences}
              onChange={(e) => setSpecialPreferences(e.target.value)}
              placeholder="e.g. Vegetarian catering, audio guestbook, pet-friendly, street closure permit needed."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
            />
          </div>
        </div>

        {/* Error Alert */}
        {generationError && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generationError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Per-guest baseline estimation: <span className="text-white font-mono font-bold">${(Number(budgetTotal) > 0 && Number(guestCount) > 0) ? Math.round(Number(budgetTotal) / Number(guestCount)) : 0}</span> / attendee
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGeneratePlan}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Synthesizing Master Strategy...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Generate AI Master Strategy
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generated Master Strategy View */}
      {planResult && (
        <section className="space-y-6 animate-fadeIn">
          
          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('financials')}
                  className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                >
                  View Financials
                </button>
              )}
            </div>
          )}

          {/* Master Plan Header Banner */}
          <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                    {planResult.eventType} Master Plan
                  </span>
                  <span className="text-xs text-slate-400">
                    Target: <strong className="text-slate-200">{planResult.targetDate}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {planResult.eventTitle}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300 italic mt-0.5 font-medium">
                  &ldquo;{planResult.personalizedIdeas.tagline}&rdquo;
                </p>
                <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {planResult.personalizedIdeas.conceptOverview}
                </p>
              </div>

              {/* Apply Plan Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <button
                  onClick={handleApplyToActivePlan}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide uppercase transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  1-Click Apply to Active Plan
                </button>
                <div className="text-[11px] text-center text-slate-400">
                  Syncs budget, timeline &amp; checklist
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Budget</span>
                <p className="text-base font-extrabold text-emerald-400 font-mono">
                  ${planResult.budgetTotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Guest Count</span>
                <p className="text-base font-extrabold text-white font-mono">
                  {planResult.guestCount} Guests
                </p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cost Per Attendee</span>
                <p className="text-base font-extrabold text-cyan-300 font-mono">
                  ${planResult.perAttendeeCost}
                </p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Deterministic 10% Reserve</span>
                <p className="text-base font-extrabold text-amber-300 font-mono">
                  ${planResult.contingencyReserve.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Personalized Ideas | Budget | Timeline | Vendor Checklist */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActivePlanTab('ideas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activePlanTab === 'ideas'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Palette className="w-4 h-4 text-rose-300" />
              Personalized Creative Studio
            </button>

            <button
              onClick={() => setActivePlanTab('budget')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activePlanTab === 'budget'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Automated Budget Breakdown ({planResult.categories.length})
            </button>

            <button
              onClick={() => setActivePlanTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activePlanTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              Backwards Milestones ({planResult.milestones.length})
            </button>

            <button
              onClick={() => setActivePlanTab('vendors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activePlanTab === 'vendors'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Vendor Checklist &amp; Tasks ({planResult.vendorChecklist.length})
            </button>
          </div>

          {/* TAB 1: Personalized Creative Studio */}
          {activePlanTab === 'ideas' && (
            <div className="space-y-6">
              
              {/* 1. Curated Color Palette */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    Bespoke Moodboard Color Palette
                  </h3>
                  <span className="text-[11px] text-slate-400">Click any swatch to copy HEX</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {planResult.personalizedIdeas.colorPalette.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyHex(color.hex)}
                      className="cursor-pointer group rounded-xl bg-slate-950 p-3 border border-slate-800 hover:border-slate-600 transition"
                    >
                      <div
                        className="w-full h-16 rounded-lg mb-2 shadow-inner border border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {copiedHex === color.hex ? (
                          <span className="px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {color.name}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300">
                        {color.hex}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {color.usage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Signature Food & Drink Concept */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  Signature Culinary &amp; Mixology Highlights
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {planResult.personalizedIdeas.signatureFoodDrinks.map((item, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">
                          {item.item}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Signature Guest Experiences & Activities */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  Signature Guest Journeys &amp; Interactive Moments
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {planResult.personalizedIdeas.guestExperiences.map((exp, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {exp.phase}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-2">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Decor & Atmosphere Concepts */}
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  Decor &amp; Atmosphere Architectural Styling
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planResult.personalizedIdeas.decorConcepts.map((decor, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                        {decor.area}
                      </div>
                      <p className="text-xs text-white mt-1.5 font-medium leading-relaxed">
                        {decor.concept}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Procurement / DIY Tip:</strong> {decor.diyOrRentalTip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Automated Budget Breakdown */}
          {activePlanTab === 'budget' && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Decoupled Mathematical Budget Model
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated with pure deterministic floating-point logic + mandatory 10% contingency reserve.
                  </p>
                </div>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('financials')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    Open Full Financial Visualizer <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {planResult.categories.map((cat, idx) => {
                  const isContingency = cat.name.includes('Contingency');
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        isContingency
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {cat.name}
                          </span>
                          {isContingency && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Math Guard
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-slate-400">{cat.percentage}%</span>
                          <span className="font-extrabold text-emerald-400">${cat.allocated.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Progress visualizer */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full my-2 overflow-hidden">
                        <div
                          className={`h-full ${isContingency ? 'bg-amber-400' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, cat.percentage * 2.5)}%` }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
                        <span>{cat.note}</span>
                        {cat.costSavingTip && (
                          <span className="text-cyan-300 font-medium">Tip: {cat.costSavingTip}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Backwards Milestones */}
          {activePlanTab === 'timeline' && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    Backwards Gregorian Milestones
                  </h3>
                  <p className="text-xs text-slate-400">
                    Engineered backwards from target date {planResult.targetDate} with assigned specialized agents.
                  </p>
                </div>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('timeline')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    Open Drag &amp; Drop Timeline <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative border-l-2 border-indigo-500/30 ml-3 pl-4 space-y-4">
                {planResult.milestones.map((m, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{m.title}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            m.priority === 'high' ? 'bg-red-950/60 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {m.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>Agent: <strong className="text-indigo-300">{m.assignedAgent}</strong></span>
                          <span>&middot;</span>
                          <span>Due: <strong className="text-white font-mono">{m.dueDate}</strong></span>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-500/20 shrink-0">
                        T - {m.daysBefore} Days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Vendor Procurement Checklist */}
          {activePlanTab === 'vendors' && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Vendor Procurement Checklist &amp; Deliverables
                  </h3>
                  <p className="text-xs text-slate-400">
                    Deliverable timelines, estimated contract weights, and execution deadlines.
                  </p>
                </div>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('checklist')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    Open Interactive Task Board <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {planResult.vendorChecklist.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {chk.task}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-500/30">
                            {chk.category}
                          </span>
                          <span>Deadline: <strong className="text-white font-mono">{chk.dueDate}</strong></span>
                          <span>({chk.deadlineWeeksBefore} weeks out)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-emerald-400 font-mono">
                        ~${chk.estimatedCost.toLocaleString()}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {chk.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* Interactive AI Planning Consultant (Chat Drawer) */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                PlanGuard Creative &amp; Tactical Consultant
              </h3>
              <p className="text-[11px] text-slate-400">
                Ask targeted questions about your wedding, birthday, or community festival.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Gemini 3.8 Flash Active
          </span>
        </div>

        {/* Chat Messages */}
        <div className="h-56 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {item.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {item.sender === 'user' ? 'You' : 'Assistant'} &middot; {item.time}
              </span>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
              <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              PlanGuard Assistant is formulating recommendation...
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder="e.g. How can I reduce floral costs without sacrificing reception aesthetics?"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white"
          />
          <button
            type="button"
            disabled={isChatLoading || !chatMessage.trim()}
            onClick={handleSendChat}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <span className="text-slate-500">Suggested queries:</span>
          <button
            onClick={() => setChatMessage('What contract clauses should I insist on with wedding caterers?')}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            &ldquo;Caterer contract clauses&rdquo;
          </button>
          <button
            onClick={() => setChatMessage('Give me 3 unique 30th birthday cocktail names with ingredients')}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            &ldquo;30th birthday signature cocktails&rdquo;
          </button>
          <button
            onClick={() => setChatMessage('What municipal city permits are mandatory for a 500-person park event?')}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            &ldquo;City park permits checklist&rdquo;
          </button>
        </div>
      </section>

    </div>
  );
};

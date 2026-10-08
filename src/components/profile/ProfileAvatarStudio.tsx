import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarViewer } from '../3d/AvatarViewer';
import {
  GenderType,
  HairStyle,
  ClothingStyle,
  GlassesStyle,
  AccessoryStyle,
  AvatarConfig,
} from '../../types';
import {
  UserCheck,
  Sparkles,
  Save,
  Check,
  Palette,
  Glasses,
  Shirt,
  Scissors,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SKIN_TONES = [
  { label: 'Fair', hex: '#F9D5BA' },
  { label: 'Warm Beige', hex: '#E0AC69' },
  { label: 'Olive', hex: '#C68642' },
  { label: 'Bronze', hex: '#8D5524' },
  { label: 'Deep Brown', hex: '#523318' },
];

const HAIR_COLORS = [
  { label: 'Obsidian Black', hex: '#1A1A1A' },
  { label: 'Espresso Brown', hex: '#4A2E18' },
  { label: 'Honey Blonde', hex: '#D4AF37' },
  { label: 'Electric Blue', hex: '#00F0FF' },
  { label: 'Violet Neon', hex: '#A855F7' },
  { label: 'Platinum Silver', hex: '#E2E8F0' },
];

const CLOTHING_COLORS = [
  { label: 'Cyber Cyan', hex: '#00F0FF' },
  { label: 'Royal Purple', hex: '#8B5CF6' },
  { label: 'Stealth Slate', hex: '#1E293B' },
  { label: 'Crimson Rose', hex: '#F43F5E' },
  { label: 'Emerald Mint', hex: '#10B981' },
];

export const ProfileAvatarStudio: React.FC = () => {
  const { state, updateProfile, updateAvatar } = useApp();

  const [activeTab, setActiveTab] = useState<'avatar' | 'academic'>('avatar');

  // Local draft avatar state
  const [avatarDraft, setAvatarDraft] = useState<AvatarConfig>(state.user.avatar);

  // Local user metadata state
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [targetRole, setTargetRole] = useState(state.user.targetRole);
  const [targetCompanyType, setTargetCompanyType] = useState(state.user.targetCompanyType);
  const [graduationYear, setGraduationYear] = useState(state.user.graduationYear);
  const [college, setCollege] = useState(state.user.college);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveAll = () => {
    updateAvatar(avatarDraft);
    updateProfile({
      name,
      email,
      targetRole,
      targetCompanyType,
      graduationYear,
      college,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-wider font-mono">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Candidate Identity & 3D Avatar System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            3D Avatar & Profile Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Customize your live 3D candidate avatar that represents you across the Dashboard, AI Mentor, and Mock Interview panels.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          type="button"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 transition flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save Profile & Avatar'}</span>
        </button>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('avatar')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'avatar'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          3D Animated Avatar Customizer
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Career Preferences & College Details
        </button>
      </div>

      {/* SECTION 1: 3D AVATAR STUDIO */}
      {activeTab === 'avatar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Live Viewport */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
              Real-time 3D Character View
            </div>

            <div className="w-full flex items-center justify-center py-4 bg-slate-950/60 rounded-3xl border border-slate-850">
              <AvatarViewer customConfig={avatarDraft} size="xl" interactive={true} />
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-300 font-semibold">{name}</span>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Blinking · Breathing · Cursor Interactive Head Tracking
              </p>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            {/* 1. Gender */}
            <div>
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2">
                Avatar Base Morphology
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as GenderType[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setAvatarDraft((prev) => ({ ...prev, gender: g }))}
                    type="button"
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                      avatarDraft.gender === g
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g} Avatar
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Skin Tone */}
            <div>
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                Skin Tone
              </label>
              <div className="flex flex-wrap gap-2.5">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.hex}
                    onClick={() => setAvatarDraft((prev) => ({ ...prev, skinTone: tone.hex }))}
                    type="button"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition cursor-pointer ${
                      avatarDraft.skinTone === tone.hex
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/40"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span>{tone.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hairstyle & Hair Color */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-purple-400" />
                Hairstyle & Color
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['fade', 'buzz', 'tousled', 'waves', 'bob', 'slick'] as HairStyle[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setAvatarDraft((prev) => ({ ...prev, hairStyle: h }))}
                    type="button"
                    className={`py-2 px-3 rounded-xl text-xs capitalize border transition cursor-pointer ${
                      avatarDraft.hairStyle === h
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {HAIR_COLORS.map((hc) => (
                  <button
                    key={hc.hex}
                    onClick={() => setAvatarDraft((prev) => ({ ...prev, hairColor: hc.hex }))}
                    type="button"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition cursor-pointer ${
                      avatarDraft.hairColor === hc.hex
                        ? 'border-purple-400 bg-purple-950/30 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/50"
                      style={{ backgroundColor: hc.hex }}
                    />
                    <span>{hc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Clothing Style & Color */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block flex items-center gap-2">
                <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                Clothing Style & Accent
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['cyber-hoodie', 'tech-blazer', 'minimal-tee', 'neon-track', 'formal-suit'] as ClothingStyle[]).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setAvatarDraft((prev) => ({ ...prev, clothingStyle: c }))}
                      type="button"
                      className={`py-2 px-3 rounded-xl text-xs capitalize border transition cursor-pointer truncate ${
                        avatarDraft.clothingStyle === c
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.replace('-', ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {CLOTHING_COLORS.map((cc) => (
                  <button
                    key={cc.hex}
                    onClick={() => setAvatarDraft((prev) => ({ ...prev, clothingColor: cc.hex }))}
                    type="button"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition cursor-pointer ${
                      avatarDraft.clothingColor === cc.hex
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/50"
                      style={{ backgroundColor: cc.hex }}
                    />
                    <span>{cc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Glasses & Accessories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2 flex items-center gap-2">
                  <Glasses className="w-3.5 h-3.5 text-amber-400" />
                  Eyewear
                </label>
                <div className="space-y-1.5">
                  {(['none', 'tech-frames', 'round-wire', 'ar-visor'] as GlassesStyle[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setAvatarDraft((prev) => ({ ...prev, glasses: g }))}
                      type="button"
                      className={`w-full py-1.5 px-3 rounded-xl text-left text-xs capitalize border transition cursor-pointer ${
                        avatarDraft.glasses === g
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block mb-2 flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  Cyber Accessories
                </label>
                <div className="space-y-1.5">
                  {(['none', 'headphones', 'neural-pin'] as AccessoryStyle[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatarDraft((prev) => ({ ...prev, accessory: a }))}
                      type="button"
                      className={`w-full py-1.5 px-3 rounded-xl text-left text-xs capitalize border transition cursor-pointer ${
                        avatarDraft.accessory === a
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {a.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACADEMIC & CAREER METADATA */}
      {activeTab === 'academic' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Placement Academic Credentials</h2>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Full Stack AI Engineer">Full Stack AI Engineer</option>
                <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
                <option value="Embedded Systems & IoT Engineer">Embedded Systems & IoT Engineer</option>
                <option value="Data Scientist & ML Engineer">Data Scientist & ML Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Target Company Category
              </label>
              <select
                value={targetCompanyType}
                onChange={(e) => setTargetCompanyType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Product Tier-1 / Tech Giant">Product Tier-1 / Tech Giant</option>
                <option value="High Growth AI Startup">High Growth AI Startup</option>
                <option value="Enterprise SaaS">Enterprise SaaS</option>
                <option value="Semiconductor / Hardware Tech">Semiconductor / Hardware Tech</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Institution / College
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Institute of Technology"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveAll}
              type="button"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
            >
              Save Academic Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

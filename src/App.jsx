import { useState, useEffect } from 'react';
import { Users, Lock, Unlock, Eye, Settings, Play, Sparkles, Clock, AlertCircle, CheckCircle, ChevronRight, LogOut, UserCircle, Plus, Minus } from 'lucide-react';

// --- 1. Mock Database Initialization (Local Storage Sync) ---
console.log('[SYSTEM] บังคับใช้ระบบฐานข้อมูลจำลอง (Mock) เพื่อแก้ปัญหา Permissions');

const db = {}; 
const auth = {};
const appId = globalThis.__app_id || 'edtech-code-reveal-liquid';
const assetUrl = (fileName) => `${import.meta.env.BASE_URL}${fileName}`;
const LOGO_URL = assetUrl('logo.jpg'); // 📌 ใส่ชื่อไฟล์หรือลิงก์โลโก้ของงานที่นี่! (ไฟล์ต้องอยู่ในโฟลเดอร์ public)

// Mock Auth API
const signInAnonymously = async () => ({ user: { uid: 'anon' } });
const onAuthStateChanged = (auth, cb) => {
  setTimeout(() => cb({ uid: 'mock-user' }), 100);
  return () => {};
};

// Mock Firestore API
const doc = (db, ...path) => path.join('/');

const getDoc = async (docRef) => {
  const data = localStorage.getItem(docRef);
  return { exists: () => !!data, data: () => JSON.parse(data) };
};

const setDoc = async (docRef, data) => {
  localStorage.setItem(docRef, JSON.stringify(data));
  window.dispatchEvent(new Event('mock-db-update'));
};

const updateDoc = async (docRef, updates) => {
  const current = JSON.parse(localStorage.getItem(docRef)) || {};
  Object.keys(updates).forEach(key => {
    const parts = key.split('.');
    let temp = current;
    for(let i = 0; i < parts.length - 1; i++) {
      if (!temp[parts[i]]) temp[parts[i]] = {};
      temp = temp[parts[i]];
    }
    temp[parts[parts.length - 1]] = updates[key];
  });
  localStorage.setItem(docRef, JSON.stringify(current));
  window.dispatchEvent(new Event('mock-db-update')); 
};

const onSnapshot = (docRef, callback) => {
  const trigger = () => {
    const data = localStorage.getItem(docRef);
    if (data) callback({ exists: () => true, data: () => JSON.parse(data) });
  };
  trigger(); 
  window.addEventListener('storage', trigger); 
  window.addEventListener('mock-db-update', trigger); 
  return () => {
    window.removeEventListener('storage', trigger);
    window.removeEventListener('mock-db-update', trigger);
  };
};

// --- 2. Mock Data & Constants ---
const TOTAL_PLAYERS = 10;
const SENIORS = [
  { id: 's1', name: 'นายณัฐดนัย ปันวงศ์ (กีต้าร์)', username: '6842407327@student.chula.ac.th', password: '0627151412', profile: 'https://photos.app.goo.gl/WNEh7tCrSRJLuqib6', avatar: assetUrl('Untitled-2-01.png') },
  { id: 's2', name: 'นายญาณพัฒน์ คิดถูก (นายบ้านดอน)', username: '6842405027@student.chula.ac.th', password: '0840587405', profile: 'https://photos.app.goo.gl/jFhw89ce5KwmiE6q8', avatar: assetUrl('Untitled-2-02.png') },
  { id: 's3', name: 'นางสาวพรปวีณ์ ศรุติกิตติเสถียร (แบม)', username: '6842413027@student.chula.ac.th', password: '0887113366', profile: 'https://photos.app.goo.gl/LFLYuojtoUCDRxts6', avatar: assetUrl('Untitled-2-03.png') },
  { id: 's4', name: 'นางสาวภัคจิรา โพธิพันธ์ (ไนซ์)', username: '6842415327@student.chula.ac.th', password: '0994385669', profile: 'https://photos.app.goo.gl/VPibsbEeLMV7rbfL7', avatar: assetUrl('Untitled-2-04.png') },
  { id: 's5', name: 'นางสาวนิรชา พันธ์ชอบ (มิ้น)', username: '6842410127@student.chula.ac.th', password: '0926932208', profile: 'https://photos.app.goo.gl/JZERyWbFSwNqhkSaA', avatar: assetUrl('Untitled-2-05.png') },
  { id: 's6', name: 'นายกตตน์ เจนการ (เอลฟ์)', username: '6842401527@student.chula.ac.th', password: '0926750774', profile: 'https://photos.app.goo.gl/UVcCE1FZJLLRGRwD7', avatar: assetUrl('Untitled-2-06.png') },
  { id: 's7', name: 'นางสาววรนัน ตระกูลทับทิมดี (โยเกิร์ต)', username: '6842417627@student.chula.ac.th', password: '0823100758', profile: 'https://photos.app.goo.gl/eXnRkE1wsXjTTFmNA', avatar: assetUrl('Untitled-2-07.png') },
  { id: 's8', name: 'นายกรภัทร เพราะสายเมือง (ภัทร)', username: '6842402127@student.chula.ac.th', password: '6842402127', profile: 'https://photos.app.goo.gl/ndsJzCUf8HRwtF5MA', avatar: assetUrl('Untitled-2-08.png') },
  { id: 's9', name: 'นายณภัทร รัตนบุรี (ไวท์)', username: '6842406727@student.chula.ac.th', password: '0807154239', profile: 'https://photos.app.goo.gl/y6P2RzytvqfGFDDBA', avatar: assetUrl('Untitled-2-09.png') },
  { id: 's10', name: 'นายพงศกร สาระพันธ์ (โอห์ม)', username: '6842412427@student.chula.ac.th', password: '0886591142', profile: 'https://photos.app.goo.gl/AaE5755EYT1pM7uU7', avatar: assetUrl('Untitled-2-10.png') }
];

const JUNIORS = Array.from({ length: TOTAL_PLAYERS }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return { 
    id: `j${i + 1}`, 
    name: `Teddy Chula 18 (น้อง ${num})`, 
    username: `Teddy Chula ${num}`, 
    password: `TDC${num}` 
  };
});

const DEFAULT_HINT_COUNT = 3;
const HINT_PLACEHOLDER_PREFIX = 'รอพี่รหัสมากรอกคำใบ้ที่';

const createHintPlaceholder = (hintNumber) => `${HINT_PLACEHOLDER_PREFIX} ${hintNumber}...`;

const createDefaultHintDate = (hintIndex, referenceDate = new Date()) => {
  const offsets = [0, 1, 7];
  const offset = offsets[hintIndex] ?? offsets[offsets.length - 1] + (hintIndex - offsets.length + 1);
  const nextDate = new Date(referenceDate);
  nextDate.setDate(referenceDate.getDate() + offset);
  return nextDate.toISOString();
};

const createNextHintDate = (existingSchedule = []) => {
  const lastDateString = [...existingSchedule].reverse().find(Boolean);
  if (lastDateString) {
    const lastDate = new Date(lastDateString);
    if (!Number.isNaN(lastDate.getTime())) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      return nextDate.toISOString();
    }
  }

  return createDefaultHintDate(existingSchedule.length);
};

const createDefaultHintSchedule = (count = DEFAULT_HINT_COUNT) => Array.from({ length: count }, (_, index) => createDefaultHintDate(index));

const createDefaultHints = (count = DEFAULT_HINT_COUNT) => Array.from({ length: count }, (_, index) => createHintPlaceholder(index + 1));

const getLegacyHintEntries = (card = {}) => Object.keys(card)
  .filter((key) => /^hint\d+$/.test(key))
  .sort((left, right) => Number(left.replace('hint', '')) - Number(right.replace('hint', '')))
  .map((key) => card[key]);

const getLegacyHintSchedule = (rawSchedule) => {
  if (Array.isArray(rawSchedule)) return rawSchedule.filter(Boolean);

  if (rawSchedule && typeof rawSchedule === 'object') {
    return Object.keys(rawSchedule)
      .filter((key) => /^hint\d+$/.test(key))
      .sort((left, right) => Number(left.replace('hint', '')) - Number(right.replace('hint', '')))
      .map((key) => rawSchedule[key])
      .filter(Boolean);
  }

  return [];
};

const getLegacyHintCount = (cards = {}) => Object.values(cards).reduce((maxCount, card) => {
  const count = Array.isArray(card?.hints)
    ? card.hints.length
    : Object.keys(card || {}).filter((key) => /^hint\d+$/.test(key)).length;
  return Math.max(maxCount, count);
}, 0);

const normalizeHintArray = (card = {}, hintCount = DEFAULT_HINT_COUNT) => {
  const sourceHints = Array.isArray(card.hints) ? card.hints : getLegacyHintEntries(card);

  return Array.from({ length: hintCount }, (_, index) => {
    const hint = sourceHints[index];
    return typeof hint === 'string' && hint.trim() ? hint : createHintPlaceholder(index + 1);
  });
};

const normalizeHintSchedule = (rawSchedule, hintCount = DEFAULT_HINT_COUNT) => {
  const sourceSchedule = getLegacyHintSchedule(rawSchedule);

  return Array.from({ length: hintCount }, (_, index) => {
    const dateValue = sourceSchedule[index];
    return dateValue || createDefaultHintDate(index);
  });
};

const toDateTimeLocalValue = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const formatHintDateLabel = (dateStr) => {
  if (!dateStr) return 'ยังไม่กำหนด';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'ยังไม่กำหนด';
  return date.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const normalizeGameState = (rawState = {}) => {
  const rawHintSchedule = rawState.hintSchedule ?? rawState.dates;
  const hintCount = Math.max(
    DEFAULT_HINT_COUNT,
    getLegacyHintSchedule(rawHintSchedule).length,
    getLegacyHintCount(rawState.cards || {})
  );

  const cards = Object.fromEntries(
    Object.entries(rawState.cards || {}).map(([cardId, card]) => {
      const normalizedCard = { ...card, hints: normalizeHintArray(card, hintCount) };
      for (let index = 1; index <= hintCount; index += 1) {
        delete normalizedCard[`hint${index}`];
      }
      return [cardId, normalizedCard];
    })
  );

  return {
    ...rawState,
    hintSchedule: normalizeHintSchedule(rawHintSchedule, hintCount),
    cards,
  };
};

const getInitialState = () => {
  const cards = {};
  for (let i = 1; i <= TOTAL_PLAYERS; i++) {
    cards[`card_${i}`] = {
      id: `card_${i}`, seniorId: `s${i}`, juniorId: null,
      hints: createDefaultHints(),
    };
  }
  return {
    isSetupComplete: false, 
    isDrawOpen: false,
    juniorsOnline: [],
    juniorsInfo: {}, 
    hintSchedule: createDefaultHintSchedule(),
    cards
  };
};

// --- 3. Main Application Component ---
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (error) { console.error(error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    const initDoc = async () => {
      const snap = await getDoc(docRef);
      if (!snap.exists()) await setDoc(docRef, getInitialState());
    };
    initDoc();
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setGameState(normalizeGameState(docSnap.data()));
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = (role, id, name, nickname = '') => {
    setRoleData({ role, id, name, nickname });
    if (role === 'junior' && gameState) {
      const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
      const updatedOnline = [...new Set([...(gameState.juniorsOnline || []), id])];
      updateDoc(docRef, { 
        juniorsOnline: updatedOnline,
        [`juniorsInfo.${id}`]: nickname || name
      });
    }
  };

  const handleLogout = () => {
    if (roleData?.role === 'junior' && gameState) {
       const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
       const updatedOnline = (gameState.juniorsOnline || []).filter(uid => uid !== roleData.id);
       updateDoc(docRef, { juniorsOnline: updatedOnline });
    }
    setRoleData(null);
    setShowLanding(true);
  };

  if (loading || !gameState) return <div className="flex h-screen items-center justify-center bg-black text-white font-sans text-xl"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans relative selection:bg-white/30 selection:text-white" style={{ overflowX: 'hidden' }}>
      
      {/* Liquid Glass Background Animations */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* iOS Style Glass Navbar */}
        {roleData && !showLanding && (
          <nav className="fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 animate-slide-down">
            <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2">
                {/* 📌 Navbar Logo Slot */}
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20 overflow-hidden relative">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover z-10" onError={(e) => { e.target.onerror = null; e.target.style.opacity = 0; }} />
                  <Sparkles className="w-4 h-4 text-white absolute z-0" />
                </div>
                <span className="font-bold tracking-wider text-white hidden sm:block">EdTech<span className="opacity-50 font-normal">Reveal</span></span>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/5 text-xs flex items-center gap-2 font-medium">
                  <div className={`w-2 h-2 rounded-full ${roleData.role === 'admin' ? 'bg-red-400' : roleData.role === 'senior' ? 'bg-blue-400' : 'bg-green-400'} shadow-[0_0_8px_currentColor] animate-pulse`}></div>
                  {roleData.nickname || roleData.name.split(' ')[0]}
                </div>
                <button onClick={handleLogout} className="min-h-touch min-w-touch w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-md border border-white/10 text-white/70 hover:text-white group">
                  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </nav>
        )}

        <main className={`flex-1 flex flex-col ${!showLanding && roleData ? 'pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full' : ''}`}>
          {showLanding ? (
            <LandingPage onEnter={() => setShowLanding(false)} />
          ) : !roleData ? (
            <LoginScreen onLogin={handleLogin} onBack={() => setShowLanding(true)} />
          ) : roleData.role === 'admin' ? (
            <AdminDashboard gameState={gameState} appId={appId} />
          ) : roleData.role === 'senior' ? (
            <SeniorDashboard gameState={gameState} appId={appId} seniorId={roleData.id} />
          ) : (
            <JuniorDashboard gameState={gameState} appId={appId} juniorId={roleData.id} />
          )}
        </main>
      </div>
    </div>
  );
}

// --- LANDING PAGE (Liquid UI + Teddy Chula 19 Showcase) ---
function LandingPage({ onEnter }) {
  const [scrollY, setScrollY] = useState(0);
  const gradients = [
    'linear-gradient(135deg, #fdcb6e, #e17055)',
    'linear-gradient(135deg, #00c6ff, #0072ff)',
    'linear-gradient(135deg, #f12711, #f5af19)',
    'linear-gradient(135deg, #8A2387, #E94057)',
    'linear-gradient(135deg, #11998e, #38ef7d)',
    'linear-gradient(135deg, #b92b27, #1565C0)',
    'linear-gradient(135deg, #ee0979, #ff6a00)',
    'linear-gradient(135deg, #654ea3, #eaafc8)',
    'linear-gradient(135deg, #009FFF, #ec2F4B)',
    'linear-gradient(135deg, #F09819, #EDDE5D)',
  ];

  return (
    <div
      onScroll={(e) => {
        const node = e.currentTarget;
        const maxScroll = Math.max(1, node.scrollHeight - node.clientHeight);
        setScrollY(node.scrollTop / maxScroll);
      }}
      className="flex flex-col items-center pt-16 pb-16 w-full relative z-10 overflow-y-auto overflow-x-hidden h-screen scrollbar-hide"
    >
       
       {/* 1. TOP SECTION: Teddy Chula 19 Senior Showcase */}
       <div className="w-full max-w-[1400px] mb-24 px-4 flex flex-col items-center">
          <div className="text-center mb-10 animate-fade-down flex flex-col items-center">
            
            {/* 📌 Main Logo Slot on Landing Page */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden mb-6 animate-float relative group cursor-pointer hover:bg-white/20 transition-colors duration-500">
               <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <img src={LOGO_URL} alt="Main Logo" className="w-full h-full object-cover z-10" onError={(e) => { e.target.onerror = null; e.target.style.opacity = 0; }} />
               <Sparkles className="w-8 h-8 text-white/50 absolute z-0" />
            </div>

            <h2 className="text-sm md:text-base font-bold tracking-[0.2em] text-purple-400 uppercase mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>Welcome to</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Chulalongkorn University
            </h1>
          </div>

          {/* Unified 1x10 Row: all seniors in one line */}
          <div className="w-full pb-10 px-1 sm:px-2 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="mx-auto flex min-w-[1220px] w-max items-end justify-center -space-x-5 sm:-space-x-6 md:-space-x-7">
             {SENIORS.map((senior, idx) => {
                const nickname = senior.name.match(/\((.*?)\)/)?.[1] || senior.name.split(' ')[0];
                const fullName = senior.name.replace(/\s*\(.*?\)\s*/g, '');
                const cardFloat = Math.sin((scrollY * 9) + (idx * 0.25)) * 3;
                
                return (
                  <div
                    key={senior.id}
                    className="group perspective-1000 animate-fade-in opacity-0 w-[124px] sm:w-[138px] md:w-[152px] lg:w-[168px] xl:w-[176px] hover:z-40"
                    style={{
                      animationDelay: `${0.3 + (idx * 0.06)}s`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div
                      className="relative w-full aspect-[9/16] transition-all duration-500 transform-style-3d group-hover:scale-[1.16] group-hover:-translate-y-3"
                      style={{ transform: `translateY(${cardFloat}px)` }}
                    >
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-white/10"></div>
                      <div className="absolute top-2 right-2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/25 backdrop-blur-xl border border-white/35 shadow-[0_0_20px_rgba(255,255,255,0.22)] overflow-hidden p-1 sm:p-1.5">
                        <img
                          src={LOGO_URL}
                          alt="Event logo"
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => { e.target.onerror = null; e.target.style.opacity = 0; }}
                        />
                      </div>
                      <div className="relative w-full h-full flex items-end justify-center">
                        <img 
                          src={senior.avatar} 
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=random&color=fff&size=256&bold=true`; }}
                          className="w-full h-full object-contain object-bottom relative z-10 transition-transform duration-500 drop-shadow-[0_0_22px_rgba(255,255,255,0.20)]"
                          alt={nickname}
                        />
                      </div>
                      <div className="text-center w-[92%] z-20 absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/14 border border-white/30 rounded-2xl px-2 sm:px-3 py-2 backdrop-blur-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 transition-all duration-300 pointer-events-none">
                        <span 
                          className="text-base sm:text-lg md:text-xl font-black block mb-0.5 drop-shadow-md"
                          style={{ background: gradients[idx % gradients.length], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                          {nickname}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider block truncate w-full">
                          {fullName}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
       </div>

       {/* 2. HERO SECTION: Liquid Card & Canva */}
       <div className="w-full max-w-5xl flex flex-col items-center gap-10 relative z-10 px-4">
          <div className="text-center space-y-4 max-w-2xl mx-auto opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 mb-2 shadow-lg hover:bg-white/20 transition-colors cursor-pointer">
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">EdTech Chula</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Teddy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 animate-pulse">Chula 19</span>
            </h1>
            <p className="text-base md:text-xl text-white/60 font-medium">
              ระบบการจับสายรหัส ที่เลิศที่สุดในศตวรรษ 
            </p>
          </div>

          <div className="w-full relative rounded-[2rem] overflow-hidden p-2 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 animate-scale-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <div className="w-full relative rounded-[1.5rem] overflow-hidden bg-black group" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
              <iframe 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                src="https://www.canva.com/design/DAHK0-QhrE4/G9SY9F6TLw0ek1HRdQCZMA/view?embed" 
                allowFullScreen="allowfullscreen" 
                allow="fullscreen"
                title="EdTech Presentation"
              />
            </div>
          </div>

          <button 
            onClick={onEnter}
            className="mt-4 mb-20 px-10 py-4 bg-white/90 backdrop-blur-xl text-black font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group opacity-0 animate-slide-up min-h-touch"
            style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
          >
            เข้าสู่ระบบ
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
       </div>
    </div>
  );
}

// --- LOGIN SCREEN (Liquid Glass Form) ---
function LoginScreen({ onLogin, onBack }) {
  const [loginMode, setLoginMode] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); 
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (loginMode === 'admin') {
      if (username === 'admin' && password === 'admin') {
        onLogin('admin', 'admin', 'Admin (ผู้ดูแลระบบ)');
      } else { setError('ข้อมูลไม่ถูกต้อง'); }
    } else if (loginMode === 'senior') {
      const senior = SENIORS.find(s => s.username === username && s.password === password);
      if (senior) { onLogin('senior', senior.id, senior.name); } 
      else { setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); }
    } else if (loginMode === 'junior') {
      const junior = JUNIORS.find(j => j.username === username && j.password === password);
      if (junior) { 
        if(!nickname.trim()) { setError('กรุณากรอกชื่อเล่นของคุณ'); return; }
        onLogin('junior', junior.id, junior.name, nickname.trim()); 
      } 
      else { setError('Username หรือ Password ไม่ถูกต้อง'); }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full min-h-[80vh]">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] animate-shine pointer-events-none"></div>

        {!loginMode ? (
          <div className="animate-fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 text-white/50 hover:text-white transition group flex items-center gap-1 min-h-touch px-2 py-2 rounded-lg hover:bg-white/10">
               <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"/> กลับ
            </button>
            <div className="text-center mb-10 pt-4">
              <h1 className="text-3xl font-bold mb-2 text-white animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0 }}>เข้าสู่ระบบ</h1>
              <p className="text-white/50 text-sm animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>เลือกระดับเพื่อเข้าถึง Liquid Widget</p>
            </div>

            <div className="flex flex-col gap-4">
              {[{ id: 'admin', icon: <Settings/>, title: 'Admin', desc: 'สำหรับผู้ดูแลระบบ', color: 'text-red-400' },
                { id: 'senior', icon: <Users/>, title: 'พี่รหัส', desc: 'เข้าสู่ระบบเพื่อเขียนคำใบ้', color: 'text-blue-400' },
                { id: 'junior', icon: <Sparkles/>, title: 'น้องรหัสสุดน่ารัก', desc: 'เข้าสู่ระบบเพื่อสุ่มไพ่รหัส', color: 'text-green-400' }
              ].map((btn, idx) => (
                <button key={btn.id} onClick={() => setLoginMode(btn.id)} className="opacity-0 animate-slide-up p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 transition-all hover:pl-6 group hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] min-h-touch" style={{ animationDelay: `${0.3 + (idx * 0.1)}s`, animationFillMode: 'forwards' }}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 flex items-center justify-center shadow-inner relative overflow-hidden flex-shrink-0">
                     <div className="absolute inset-0 bg-white/5 group-hover:bg-white/20 transition-colors"></div>
                     <div className={`relative z-10 ${btn.color} group-hover:scale-110 transition-transform`}>{btn.icon}</div>
                  </div>
                  <div className="text-left"><h3 className="font-bold text-sm sm:text-base">{btn.title}</h3><p className="text-xs text-white/50">{btn.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in pt-4">
            <button onClick={() => { setLoginMode(null); setError(''); setUsername(''); setPassword(''); setNickname(''); }} className="text-sm text-white/50 mb-6 hover:text-white transition flex items-center gap-1 group min-h-touch px-2 py-2">
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"/> เปลี่ยนบัญชี
            </button>
            <h2 className="text-3xl font-bold mb-2 text-white animate-slide-up">
              {loginMode === 'admin' ? 'Admin' : loginMode === 'senior' ? 'พี่รหัส' : 'น้องรหัส'}
            </h2>
            <p className="text-white/50 mb-8 text-sm animate-slide-up">
              {loginMode === 'senior' ? 'เข้าสู่ระบบด้วยอีเมลนิสิต @student.chula.ac.th' : loginMode === 'junior' ? 'ป้อน Username, Password และชื่อเล่นของคุณ' : 'จัดการระบบสลากรหัสออนไลน์'}
            </p>
            
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl text-sm flex items-center gap-2 backdrop-blur-md animate-shake">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              
              <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <input 
                  type="text" value={username} onChange={e => setUsername(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-white/40 focus:bg-black/60 transition-all backdrop-blur-md placeholder:text-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  placeholder={loginMode === 'junior' ? 'เช่น Teddy Chula 01' : 'Username'} required 
                />
              </div>
              <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-white/40 focus:bg-black/60 transition-all backdrop-blur-md placeholder:text-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  placeholder="Password" required 
                />
              </div>

              {loginMode === 'junior' && (
                <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                  <input 
                    type="text" value={nickname} onChange={e => setNickname(e.target.value)} 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-white/40 focus:bg-black/60 transition-all backdrop-blur-md placeholder:text-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    placeholder="ชื่อเล่นของคุณ (โชว์ตอนสุ่มไพ่)" required 
                  />
                </div>
              )}
              
              <button type="submit" className="opacity-0 animate-slide-up w-full bg-white text-black font-bold py-4 px-6 rounded-2xl mt-4 transition-all hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 min-h-touch" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD (iOS Widget Style) ---
function AdminDashboard({ gameState, appId }) {
  const [activeTab, setActiveTab] = useState('live');
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editingHints, setEditingHints] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hintSchedule = gameState.hintSchedule?.length ? gameState.hintSchedule : createDefaultHintSchedule();
  const hintCount = hintSchedule.length || DEFAULT_HINT_COUNT;
  
  const onlineCount = gameState.juniorsOnline?.length || 0;
  const isReadyToDraw = onlineCount === TOTAL_PLAYERS;
  const isAdminDrawReleased = Boolean(gameState.isDrawOpen);
  const isDrawStageOpen = isReadyToDraw || isAdminDrawReleased;
  const drawnCards = Object.values(gameState.cards).filter(c => c.juniorId !== null).length;

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDateChange = (index, value) => {
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    const updatedSchedule = [...hintSchedule];
    const parsedDate = value ? new Date(value) : null;
    updatedSchedule[index] = parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : createDefaultHintDate(index);
    updateDoc(docRef, { hintSchedule: updatedSchedule });
    flashSaved();
  };

  const confirmResetAction = () => {
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    setDoc(docRef, getInitialState());
    setConfirmReset(false);
  };

  const handleOpenDrawStage = () => {
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    updateDoc(docRef, { isDrawOpen: true });
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setEditingHints(Array.isArray(card.hints) ? [...card.hints] : normalizeHintArray(card, hintCount));
  };

  const handleSaveHints = async () => {
    if (!editingCard) return;
    setSaving(true);
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    try {
      const normalizedHints = normalizeHintArray({ hints: editingHints }, hintCount);
      await updateDoc(docRef, {
        [`cards.${editingCard.id}.hints`]: normalizedHints
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setEditingCard(null);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleClearHint = async (hintIndex) => {
    if (!editingCard) return;
    setSaving(true);
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    try {
      const updatedHints = [...editingHints];
      updatedHints[hintIndex] = createHintPlaceholder(hintIndex + 1);
      await updateDoc(docRef, {
        [`cards.${editingCard.id}.hints`]: updatedHints
      });
      setEditingHints(updatedHints);
      flashSaved();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleAddHintRound = async () => {
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    const updatedSchedule = [...hintSchedule, createNextHintDate(hintSchedule)];
    const updatedCards = Object.fromEntries(
      Object.entries(gameState.cards).map(([cardId, card]) => {
        const currentHints = normalizeHintArray(card, hintCount);
        return [cardId, { ...card, hints: [...currentHints, createHintPlaceholder(updatedSchedule.length)] }];
      })
    );

    try {
      await updateDoc(docRef, {
        hintSchedule: updatedSchedule,
        cards: updatedCards
      });
      setEditingCard(null);
      setEditingHints([]);
      flashSaved();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveHintRound = async (hintIndex) => {
    if (hintSchedule.length <= 1) return;

    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    const updatedSchedule = hintSchedule.filter((_, index) => index !== hintIndex);
    const updatedCards = Object.fromEntries(
      Object.entries(gameState.cards).map(([cardId, card]) => {
        const currentHints = normalizeHintArray(card, hintSchedule.length);
        return [cardId, { ...card, hints: currentHints.filter((_, index) => index !== hintIndex) }];
      })
    );

    try {
      await updateDoc(docRef, {
        hintSchedule: updatedSchedule,
        cards: updatedCards
      });
      setEditingCard(null);
      setEditingHints([]);
      flashSaved();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-center w-full animate-slide-down">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-full flex gap-1 shadow-2xl overflow-x-auto w-full max-w-lg">
          {[
            { id: 'live', label: 'Live Stage', icon: <Play className="w-4 h-4"/> },
            { id: 'hints', label: 'ตรวจสอบ', icon: <Eye className="w-4 h-4"/> },
            { id: 'settings', label: 'ตั้งค่า', icon: <Settings className="w-4 h-4"/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex-1 flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-6 py-3 sm:py-2.5 rounded-full text-sm font-semibold transition-all duration-300 min-h-touch ${activeTab === tab.id ? 'bg-white text-black shadow-md scale-105' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in w-full flex flex-col items-center">
        {activeTab === 'live' ? (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-center mb-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] w-full max-w-3xl shadow-xl animate-scale-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight transition-all">
                {drawnCards === TOTAL_PLAYERS ? "เปิดไพ่ครบทุกคนแล้ว" : isDrawStageOpen ? "สมรภูมิสลักไพ่" : "รอผู้เข้าร่วม"}
              </h2>
              <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                <div className={`w-2.5 h-2.5 rounded-full ${isDrawStageOpen ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'} animate-pulse`}></div>
                <span className="text-sm font-bold text-white/80">{onlineCount} / {TOTAL_PLAYERS} ออนไลน์</span>
              </div>

              {isAdminDrawReleased && !isReadyToDraw && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-500/15 px-3 py-1.5 rounded-full border border-green-400/30 text-green-200 text-xs font-bold animate-fade-in">
                  <Play className="w-3.5 h-3.5" />
                  แอดมินเปิดสมรภูมิแล้ว (ก่อนครบ 10 คน)
                </div>
              )}
              
              {!isDrawStageOpen && drawnCards < TOTAL_PLAYERS && (
                <div className="mt-6 animate-fade-in">
                  <button
                    onClick={handleOpenDrawStage}
                    className="px-6 py-4 sm:py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.3)] min-h-touch w-full sm:w-auto"
                  >
                    เปิดสมรภูมิสุ่มไพ่ก่อนครบ 10 คน
                  </button>
                </div>
              )}

              {isDrawStageOpen && drawnCards < TOTAL_PLAYERS && (
                <div className="mt-8 max-w-xs mx-auto animate-fade-in">
                   <div className="flex justify-between text-xs text-white/50 font-bold mb-2 px-1"><span>เปิดไพ่แล้ว</span><span>{drawnCards}/{TOTAL_PLAYERS}</span></div>
                   <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${(drawnCards / TOTAL_PLAYERS) * 100}%` }}>
                         <div className="absolute inset-0 bg-white/50 animate-[shine_2s_infinite]"></div>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {!isDrawStageOpen ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-4xl">
                {JUNIORS.map((j, idx) => {
                  const isOnline = gameState.juniorsOnline?.includes(j.id);
                  const displayName = isOnline && gameState.juniorsInfo?.[j.id] ? gameState.juniorsInfo[j.id] : j.name;
                  return (
                    <div key={j.id} className={`opacity-0 animate-scale-in p-5 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 transition-all duration-500 backdrop-blur-xl border ${isOnline ? 'bg-white/10 border-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.1)] transform hover:-translate-y-1' : 'bg-black/20 border-white/5 opacity-50'}`} style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner transition-colors duration-500 ${isOnline ? 'bg-white/20 scale-110' : 'bg-black/50'}`}>
                         {isOnline ? <Users className="text-white w-6 h-6 animate-pulse"/> : <Clock className="text-white/30 w-6 h-6"/>}
                      </div>
                      <span className={`text-sm font-semibold text-center transition-colors duration-500 ${isOnline ? 'text-white' : 'text-white/40'}`}>{displayName}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-5xl">
                {Object.values(gameState.cards).map((card, idx) => {
                  const juniorName = gameState.juniorsInfo?.[card.juniorId] || JUNIORS.find(j => j.id === card.juniorId)?.name;
                  const juniorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(juniorName || 'Junior')}&background=f3f4f6&color=111827&size=128&bold=true`;
                  return (
                    <div key={card.id} className="relative aspect-[2/3.2] perspective-1000 group opacity-0 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}>
                      <div className={`w-full h-full transition-all duration-1000 transform-style-3d ${card.juniorId ? 'rotate-y-180' : 'animate-float'} `} style={{ animationDelay: `${idx * 0.05}s` }}>
                        
                        <div className="absolute inset-0 backface-hidden bg-white/5 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                            <Sparkles className="w-8 h-8 text-white/40 animate-pulse" />
                          </div>
                        </div>

                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white/90 backdrop-blur-3xl rounded-[1.5rem] border border-white/20 flex flex-col items-center justify-center p-5 text-center shadow-[0_20px_50px_rgba(255,255,255,0.15)] overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                          
                          <img 
                            src={juniorAvatar}
                            className="w-16 h-16 rounded-full border border-black/10 mb-3 shadow-lg z-10 object-cover"
                            alt="junior avatar"
                          />
                          <h3 className="font-bold text-lg text-black leading-tight z-10">{juniorName || 'ยังไม่มีผู้เลือก'}</h3>
                          
                          <div className="w-full mt-4 bg-black/5 rounded-xl p-3 border border-black/5 z-10">
                            <p className="text-[10px] text-black/50 font-bold uppercase tracking-wider mb-1">ผู้เลือกไพ่ (รุ่นน้อง)</p>
                            <p className="text-xs text-black font-semibold truncate">{juniorName || 'ยังไม่มีผู้เลือก'}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'hints' ? (
          <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-5xl mx-auto w-full shadow-2xl animate-scale-in">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">สถานะคำใบ้และการจับคู่</h3>
              <p className="text-white/50">ตรวจสอบการกรอกข้อมูลของพี่รหัส และน้องที่สุ่มได้ (แสดงเฉพาะ Admin)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SENIORS.map((senior, idx) => {
                 const card = Object.values(gameState.cards).find(c => c.seniorId === senior.id);
                 if (!card) return null;
                 const cardHints = Array.isArray(card.hints) ? card.hints : normalizeHintArray(card, hintCount);
                 const allDone = cardHints.every((hint, hintIndex) => {
                   return Boolean(hint && hint.trim() && hint !== createHintPlaceholder(hintIndex + 1));
                 });
                 const pairedJunior = card.juniorId ? (gameState.juniorsInfo?.[card.juniorId] || "ได้การ์ดแล้ว") : "ยังไม่มีคนสุ่ม";

                 return (
                   <div key={senior.id} className="opacity-0 animate-slide-up p-6 rounded-[1.5rem] bg-black/20 backdrop-blur-md border border-white/10 flex flex-col gap-4 relative overflow-hidden group hover:bg-black/30 transition-colors" style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}>
                     <div className="flex justify-between items-start">
                       <div className="flex items-center gap-4">
                         <img 
                           src={senior.avatar} 
                           onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(senior.name.match(/\((.*?)\)/)?.[1] || senior.name)}&background=fff&color=000&size=128`; }}
                           alt="profile" 
                           className="w-12 h-12 rounded-full shadow-md object-cover group-hover:scale-110 transition-transform" 
                         />
                         <div>
                           <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">{senior.name}</h4>
                           <p className="text-xs text-purple-300 mt-1 flex items-center gap-1 font-semibold">
                             น้องที่ได้ไพ่: {card.juniorId ? <span className="text-white bg-white/20 px-2 py-0.5 rounded-full">{pairedJunior}</span> : <span className="text-white/40">{pairedJunior}</span>}
                           </p>
                         </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${allDone ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 text-white/60'}`}>
                          {allDone ? <CheckCircle className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                          {allDone ? 'ครบถ้วน' : 'ขาดข้อมูล'}
                       </div>
                     </div>
                     
                     <div className="space-y-2 mt-2">
                        {cardHints.map((hint, i) => (
                          <div key={i} className="flex gap-3 text-sm items-start">
                            <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors ${hint && hint.trim() && hint !== createHintPlaceholder(i + 1) ? 'bg-white/20 text-white' : 'bg-black/40 text-white/30'}`}>{i + 1}</span>
                            <span className={`line-clamp-1 transition-colors ${hint && hint.trim() && hint !== createHintPlaceholder(i + 1) ? 'text-white/80' : 'text-white/30 italic'}`}>{hint}</span>
                          </div>
                        ))}
                     </div>

                     <button 
                       onClick={() => handleEditCard(card)}
                       className="w-full mt-4 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition-all font-semibold"
                     >
                       แก้ไขคำใบ้
                     </button>
                   </div>
                 );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-xl mx-auto w-full shadow-2xl animate-scale-in">
            <h3 className="text-3xl font-bold mb-8 text-white">ตั้งค่าเวลา</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <p className="text-white/50 text-sm">จัดการจำนวนรอบคำใบ้และกำหนดเวลาเปิดของแต่ละรอบ</p>
              <button
                onClick={handleAddHintRound}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all min-h-touch"
              >
                <Plus className="w-4 h-4" /> เพิ่มรอบคำใบ้
              </button>
            </div>
            <div className="space-y-5">
               {hintSchedule.map((dateStr, idx) => {
                 const localDateStr = toDateTimeLocalValue(dateStr);
                 return (
                   <div key={idx} className="opacity-0 animate-slide-up bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col gap-3 hover:bg-black/30 transition-colors" style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}>
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-semibold text-white/60">เวลาเปิดคำใบ้รอบที่ {idx + 1}</label>
                        <button
                          onClick={() => handleRemoveHintRound(idx)}
                          disabled={hintSchedule.length <= 1}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" /> ลบรอบ
                        </button>
                      </div>
                      <input
                        type="datetime-local"
                        value={localDateStr}
                        onChange={(e) => handleDateChange(idx, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30 font-medium focus:bg-white/10 transition-colors"
                      />
                   </div>
                 )
               })}
               
               <div className="mt-8 pt-8 border-t border-white/10 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                 {confirmReset ? (
                   <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/30 flex flex-col gap-4 backdrop-blur-md animate-scale-in">
                     <p className="text-white font-bold text-center text-sm">รีเซ็ตข้อมูลทั้งหมดจริงหรือไม่?</p>
                     <div className="flex gap-3 flex-col sm:flex-row">
                       <button onClick={confirmResetAction} className="flex-1 min-h-touch bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-bold transition text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]">ยืนยัน</button>
                       <button onClick={() => setConfirmReset(false)} className="flex-1 min-h-touch bg-white/10 hover:bg-white/20 py-3 px-4 rounded-xl transition text-sm font-bold">ยกเลิก</button>
                     </div>
                   </div>
                 ) : (
                   <button onClick={() => setConfirmReset(true)} className="w-full min-h-touch bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-white/60 font-bold py-4 px-6 rounded-2xl transition-all border border-white/5 text-sm">
                     รีเซ็ตระบบเริ่มต้นใหม่
                   </button>
                 )}
               </div>
            </div>
          </div>
        )}

        {editingCard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">แก้ไขคำใบ้</h3>
                <button 
                  onClick={() => setEditingCard(null)}
                  className="text-white/60 hover:text-white transition text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const senior = SENIORS.find((item) => item.id === editingCard.seniorId);
                if (!senior) return null;
                const cardHints = Array.isArray(editingHints) ? editingHints : normalizeHintArray(editingCard, hintCount);

                return (
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                      <img 
                        src={senior.avatar}
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(senior.name.match(/\((.*?)\)/)?.[1] || senior.name)}&background=fff&color=000&size=128`; }}
                        alt="profile"
                        className="w-16 h-16 rounded-full shadow-md object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-white">{senior.name}</h4>
                        <p className="text-sm text-white/50">แก้ไขข้อมูลคำใบ้</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {cardHints.map((hintText, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center gap-3">
                            <label className="text-sm font-semibold text-white/80">คำใบ้รอบที่ {index + 1}</label>
                            <button 
                              onClick={() => handleClearHint(index)}
                              disabled={saving}
                              className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/30 transition disabled:opacity-50"
                            >
                              ล้าง
                            </button>
                          </div>
                          <textarea 
                            value={hintText}
                            onChange={(e) => setEditingHints((prev) => {
                              const nextHints = [...prev];
                              nextHints[index] = e.target.value;
                              return nextHints;
                            })}
                            className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-3 min-h-[80px] outline-none focus:border-white/30 focus:bg-black/40 transition-all text-white placeholder:text-white/20 resize-none"
                            placeholder={`พิมพ์คำใบ้รอบที่ ${index + 1}...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setEditingCard(null)}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSaveHints}
                  disabled={saving}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition flex justify-center items-center gap-2 min-h-touch ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'}`}
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : saved ? (
                    <>
                      <CheckCircle className="w-5 h-5"/> บันทึกสำเร็จ
                    </>
                  ) : (
                    'บันทึกข้อมูล'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SENIOR DASHBOARD (Liquid Widget) ---
function SeniorDashboard({ gameState, appId, seniorId }) {
  const [hintDrafts, setHintDrafts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const myCard = Object.values(gameState.cards).find(c => c.seniorId === seniorId);
  const hintSchedule = gameState.hintSchedule?.length ? gameState.hintSchedule : createDefaultHintSchedule();
  const hintCount = hintSchedule.length || myCard?.hints?.length || DEFAULT_HINT_COUNT;
  const currentHints = myCard ? (Array.isArray(myCard.hints) ? myCard.hints : normalizeHintArray(myCard, hintCount)) : [];
  const hints = myCard ? (hintDrafts.length === currentHints.length ? hintDrafts : currentHints) : [];

  const setHintValue = (index, value) => {
    setHintDrafts((prev) => {
      const nextHints = [...prev];
      nextHints[index] = value;
      return nextHints;
    });
  };

  const handleSave = async () => {
    if (!myCard) return;
    setSaving(true);
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    try {
      const normalizedHints = normalizeHintArray({ hints }, hintCount);
      await updateDoc(docRef, { [`cards.${myCard.id}.hints`]: normalizedHints });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (!myCard) return <div>หาการ์ดไม่พบ</div>;

  const pairedJuniorName = myCard.juniorId ? (gameState.juniorsInfo?.[myCard.juniorId] || JUNIORS.find(j => j.id === myCard.juniorId)?.name) : null;

  return (
    <div className="max-w-xl mx-auto w-full animate-scale-in">
      <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h2 className="text-3xl font-bold mb-2 text-white relative z-10 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0 }}>การ์ดคำใบ้</h2>
        <p className="text-white/50 mb-6 text-sm relative z-10 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>เตรียมข้อมูลสำหรับน้องรหัส</p>

        {pairedJuniorName && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-md flex items-center gap-4 relative z-10 animate-scale-in">
             <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-inner">
                <Users className="w-6 h-6 text-green-400 animate-pulse" />
             </div>
             <div>
                <p className="text-[10px] text-green-400/80 font-bold uppercase tracking-widest mb-0.5">จับคู่สำเร็จ! น้องรหัสของคุณคือ</p>
                <p className="text-lg text-white font-bold">{pairedJuniorName}</p>
             </div>
          </div>
        )}

        <div className="space-y-5 relative z-10">
          {hints.map((hintText, idx) => {
             const hintDateStr = hintSchedule[idx];
             const hintDate = formatHintDateLabel(hintDateStr);

             return (
               <div key={idx} className="flex flex-col gap-2 opacity-0 animate-slide-up" style={{ animationDelay: `${0.3 + (idx * 0.1)}s`, animationFillMode: 'forwards' }}>
                  <label className="font-semibold flex items-center justify-between text-white/80 text-sm pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{idx + 1}</div>
                      รอบที่ {idx + 1}
                    </div>
                    <span className="text-[10px] text-white/50 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
                      เปิด: {hintDate}
                    </span>
                  </label>
                  <textarea 
                    value={hintText} onChange={(e) => setHintValue(idx, e.target.value)}
                    className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-h-[100px] outline-none focus:border-white/30 focus:bg-black/40 transition-all text-white placeholder:text-white/20 resize-none shadow-inner focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    placeholder={`แตะเพื่อพิมพ์คำใบ้รอบที่ ${idx + 1}...`}
                  />
               </div>
             );
          })}

          <button 
            onClick={handleSave} disabled={saving}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all mt-4 opacity-0 animate-slide-up min-h-touch ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-95'} flex justify-center items-center gap-2`}
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            {saving ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : saved ? <><CheckCircle className="w-5 h-5 animate-scale-in"/> บันทึกสำเร็จ</> : 'บันทึกข้อมูล'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- JUNIOR DASHBOARD (Liquid Experience) ---
function JuniorDashboard({ gameState, appId, juniorId }) {
  const [errorMsg, setErrorMsg] = useState('');
  const onlineCount = gameState.juniorsOnline?.length || 0;
  const isReadyToDraw = onlineCount === TOTAL_PLAYERS;
  const isAdminDrawReleased = Boolean(gameState.isDrawOpen);
  const canDrawCards = isReadyToDraw || isAdminDrawReleased;
  const myDrawnCard = Object.values(gameState.cards).find(c => c.juniorId === juniorId);
  const myHints = myDrawnCard?.hints || [];
  const hintSchedule = gameState.hintSchedule?.length ? gameState.hintSchedule : createDefaultHintSchedule();

  const handleDrawCard = async (cardId) => {
    if (myDrawnCard) return;
    if (gameState.cards[cardId].juniorId !== null) {
      setErrorMsg("ไพ่ใบนี้มีเจ้าของแล้ว"); setTimeout(() => setErrorMsg(''), 3000); return;
    }
    const docRef = doc(db, 'artifacts', appId, 'data', 'gameState');
    try { await updateDoc(docRef, { [`cards.${cardId}.juniorId`]: juniorId }); } 
    catch (error) { console.error(error); setErrorMsg("เกิดข้อผิดพลาด"); setTimeout(() => setErrorMsg(''), 3000); }
  };

  const isHintUnlocked = (hintDateStr) => {
    if (!hintDateStr) return false;
    const hintDate = new Date(hintDateStr);
    if (Number.isNaN(hintDate.getTime())) return false;
    return new Date().getTime() >= hintDate.getTime();
  };

  if (myDrawnCard) {
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-md animate-slide-down">คุณได้รับไพ่แล้ว</h2>
        <p className="text-white/50 mb-10 text-sm animate-slide-down" style={{ animationDelay: '0.1s' }}>ติดตามคำใบ้เพื่อค้นหาพี่รหัสของคุณ</p>

        <div className="w-full flex flex-col md:flex-row gap-6 items-start">
          
          {/* Secret Glass Card Widget */}
          <div className="w-full md:w-1/3 aspect-[2/3] bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 flex flex-col items-center justify-center p-6 text-center shrink-0 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-scale-in hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-shadow">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="w-24 h-24 rounded-full bg-black/40 border-4 border-white/20 flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.2)] z-10 backdrop-blur-md group hover:border-white/40 transition-colors">
                <UserCircle className="w-12 h-12 text-white/60 group-hover:scale-110 transition-transform" />
             </div>
             
             <h3 className="text-xl font-bold text-white z-10 tracking-wide uppercase">พี่รหัสปริศนา</h3>
             <p className="text-xs text-white/40 mt-1 font-mono z-10">รอการเฉลยสายรหัส</p>
             
             <div className="mt-8 px-6 py-2.5 bg-black/20 text-white/50 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2 z-10 animate-pulse-slow">
               <Lock className="w-3.5 h-3.5"/> ข้อมูลถูกปกปิดไว้
             </div>
          </div>

          {/* Hint Widgets (Stack) */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
             {myHints.map((hintText, idx) => {
               const hintDateStr = hintSchedule[idx];
               const unlocked = hintDateStr ? isHintUnlocked(hintDateStr) : false;
               const hintDate = formatHintDateLabel(hintDateStr);
               
               return (
                 <div key={idx} className={`opacity-0 animate-slide-up p-6 rounded-[2rem] relative overflow-hidden transition-all duration-500 backdrop-blur-2xl border ${unlocked ? 'bg-white/10 border-white/20 shadow-lg hover:bg-white/15' : 'bg-black/20 border-white/5 opacity-70'}`} style={{ animationDelay: `${0.2 + (idx * 0.1)}s`, animationFillMode: 'forwards' }}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`font-semibold flex items-center gap-2 text-sm transition-colors ${unlocked ? 'text-white' : 'text-white/40'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${unlocked ? 'bg-white/20' : 'bg-black/50'}`}>
                          {unlocked ? <Unlock className="w-3 h-3 animate-scale-in"/> : <Lock className="w-3 h-3"/>}
                        </div>
                        คำใบ้ที่ {idx + 1}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">{hintDate}</span>
                    </div>

                    <div className="relative">
                      {unlocked ? (
                        <p className="text-lg text-white/90 leading-relaxed font-medium animate-fade-in">{hintText}</p>
                      ) : (
                        <div className="flex items-center gap-3 py-2">
                           <Lock className="text-white/20 w-5 h-5"/>
                           <p className="text-sm text-white/30 font-medium">รอการปลดล็อก</p>
                        </div>
                      )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    );
  }

  // STAGE 2: Drawing Room
  if (canDrawCards) {
    return (
      <div className="flex flex-col items-center pt-4 w-full relative">
        {errorMsg && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-black px-6 py-2 rounded-full font-bold shadow-[0_10px_30px_rgba(255,255,255,0.3)] z-50 flex items-center gap-2 text-sm animate-shake">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}
        <h2 className="text-4xl font-black mb-2 text-white animate-slide-down">เลือกไพ่ของคุณ</h2>
        <p className="text-white/50 mb-10 text-sm animate-slide-down" style={{ animationDelay: '0.1s' }}>แตะที่การ์ดเพื่อรับสายรหัส</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 w-full max-w-5xl">
          {Object.values(gameState.cards).map((card, idx) => {
            const isTaken = card.juniorId !== null;
            const juniorName = isTaken ? gameState.juniorsInfo?.[card.juniorId] : '';

            return (
              <div 
                key={card.id} onClick={() => !isTaken && handleDrawCard(card.id)}
                className="relative aspect-[2/3.2] perspective-1000 cursor-pointer group opacity-0 animate-scale-in"
                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className={`w-full h-full transition-all duration-700 transform-style-3d ${isTaken ? 'rotate-y-180 scale-95 opacity-50' : 'hover:scale-105 hover:-translate-y-2 active:scale-95 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]'}`}>
                  
                  {/* Front (Glass Available) */}
                  <div className="absolute inset-0 backface-hidden bg-white/10 backdrop-blur-2xl rounded-[1.5rem] border border-white/30 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] group-hover:bg-white/20 group-hover:border-white/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 text-white/80 animate-pulse-slow" />
                    </div>
                  </div>

                  {/* Back (Taken) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black/50 backdrop-blur-md rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center p-4 text-center shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-black/80 flex items-center justify-center mb-3"><Lock className="text-white/40 w-4 h-4" /></div>
                    <p className="text-xs text-white/50 mb-1">เลือกโดย</p>
                    <p className="text-sm text-white font-bold tracking-wide line-clamp-2">{juniorName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // STAGE 1: Waiting Room
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
      <div className="bg-white/10 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] flex flex-col items-center relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden">
        {/* Shine */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-6 relative shadow-inner">
          <div className="absolute inset-0 border border-white/30 rounded-full animate-ping opacity-20"></div>
          <Users className="w-8 h-8 text-white/80" />
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-white">ห้องพักคอย</h2>
        <p className="text-white/50 text-center text-sm mb-8 leading-relaxed">
          รอแอดมินเปิดระบบสุ่มไพ่<br/>หรือรอผู้เข้าร่วมให้ครบ
        </p>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-5xl font-black text-white tracking-tighter">
            {onlineCount} <span className="text-2xl text-white/30 font-medium">/ {TOTAL_PLAYERS}</span>
          </div>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden shadow-inner relative">
             <div className="h-full bg-white transition-all duration-1000 ease-out rounded-full relative overflow-hidden" style={{ width: `${(onlineCount / TOTAL_PLAYERS) * 100}%` }}>
                 <div className="absolute inset-0 bg-white/50 animate-[shine_2s_infinite]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Background Blobs */
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 10s infinite alternate ease-in-out; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }

  /* Floating Elements */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }

  /* Basic Fade In */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  /* Slide Animations */
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes fade-down {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-down { animation: fade-down 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

  /* Scale Animations */
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  /* Effects */
  @keyframes shine {
    from { left: -100%; }
    to { left: 200%; }
  }
  .animate-shine { animation: shine 3s infinite linear; }

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.95); }
  }
  .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
  }
  .animate-shake { animation: shake 0.4s ease-in-out; }
`;
document.head.appendChild(style);

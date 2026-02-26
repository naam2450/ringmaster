
import React, { useState, useEffect } from 'react';
import { PortalItem } from './types';
import { CollageItem } from './components/CollageItem';
import { EditorModal } from './components/EditorModal';
import { AdminLogin } from './components/AdminLogin';
import { generateCircusImage } from './services/geminiService';
import { db, isFirebaseConfigured } from './services/firebase';
import { collection, doc, setDoc, onSnapshot, query } from "firebase/firestore";
import confetti from 'canvas-confetti';

const INITIAL_ITEMS: PortalItem[] = [
  {
    id: '1',
    title: 'MYSTERY TENT',
    prompt: 'A 3D CARTOON RED AND WHITE CIRCUS TENT AT NIGHT, GLOWING WINDOWS, STARS IN SKY',
    url: 'https://www.google.com/search?q=circus+history',
    imageUrl: 'https://picsum.photos/seed/circus1/600/600',
    rotation: -8,
    zIndex: 10
  },
  {
    id: '2',
    title: 'SNACK BAR',
    prompt: 'A 3D CARTOON GIANT POPCORN BUCKET AND A GIANT SODA WITH A STRAW, VIBRANT GLOSSY FINISH',
    url: 'https://www.google.com/search?q=circus+snacks',
    imageUrl: 'https://picsum.photos/seed/circus2/600/600',
    rotation: 5,
    zIndex: 20
  },
  {
    id: '3',
    title: 'FORTUNE TELLER',
    prompt: 'A 3D CARTOON CRYSTAL BALL ON A PURPLE VELVET TABLE, MYSTICAL SMOKE, GOLD COINS',
    url: 'https://www.google.com/search?q=tarot+cards',
    imageUrl: 'https://picsum.photos/seed/circus3/600/600',
    rotation: -3,
    zIndex: 15
  },
  {
    id: '4',
    title: 'LION HOOP',
    prompt: 'A 3D CARTOON CUTE LION JUMPING THROUGH A RING OF FIRE, CINEMATIC LIGHTING',
    url: 'https://www.google.com/search?q=circus+animals',
    imageUrl: 'https://picsum.photos/seed/circus4/600/600',
    rotation: 10,
    zIndex: 5
  }
];

const playTada = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'); 
  audio.volume = 0.2;
  audio.play().catch(() => {});
};

const App: React.FC = () => {
  const [items, setItems] = useState<PortalItem[]>(INITIAL_ITEMS);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('circus-admin') === 'true';
  });
  const [showLogin, setShowLogin] = useState(false);
  const [editingItem, setEditingItem] = useState<PortalItem | null>(null);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (db && isFirebaseConfigured) {
      const q = query(collection(db, "portal-items"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const fetchedItems: PortalItem[] = [];
          querySnapshot.forEach((doc) => {
            fetchedItems.push(doc.data() as PortalItem);
          });
          setItems(fetchedItems.sort((a, b) => a.id.localeCompare(b.id)));
          setFirebaseError(null);
        } else {
          INITIAL_ITEMS.forEach(async (item) => {
            try {
              await setDoc(doc(db!, "portal-items", item.id), item);
            } catch (e) {
              console.warn("FAILED TO INIT CLOUD ITEMS:", e);
            }
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("FIRESTORE SYNC ERROR:", error);
        setFirebaseError("CLOUD DATABASE DISCONNECTED. USING LOCAL STORAGE.");
        loadFromLocalStorage();
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      if (!isFirebaseConfigured) {
        setFirebaseError("FIREBASE IS NOT CONFIGURED. DATA IS SAVED LOCALLY ONLY.");
      }
      loadFromLocalStorage();
      setLoading(false);
    }
  }, []);

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('circus-portal-items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  };

  const handleLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'admin2450') {
      setIsAdmin(true);
      sessionStorage.setItem('circus-admin', 'true');
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#facc15', '#ff0000']
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('circus-admin');
  };

  const syncItem = async (item: PortalItem) => {
    const currentItems = [...items];
    const newItems = currentItems.map(i => i.id === item.id ? item : i);
    setItems(newItems);
    localStorage.setItem('circus-portal-items', JSON.stringify(newItems));

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "portal-items", item.id), item);
      } catch (error) {
        console.error("FIREBASE SYNC ERROR:", error);
        setFirebaseError("UPDATE FAILED TO REACH THE CLOUD. SAVED LOCALLY.");
      }
    }
  };

  const handleSaveItem = async (updatedItem: PortalItem) => {
    await syncItem(updatedItem);
    playTada();
  };

  const handleGenerateImage = async (id: string) => {
    const itemToGen = items.find(i => i.id === id);
    if (!itemToGen) return;

    setGeneratingIds(prev => new Set(prev).add(id));
    
    try {
      const newImageUrl = await generateCircusImage(itemToGen.prompt);
      const updatedItem = { ...itemToGen, imageUrl: newImageUrl };
      
      await syncItem(updatedItem);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#facc15', '#ffffff', '#8b5cf6']
      });
      playTada();
    } catch (error) {
      console.error(error);
      alert("MAGIC FAILED. CHECK YOUR API KEY OR CONNECTION.");
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d001a] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-yellow-400 text-6xl mb-4"></i>
          <h2 className="font-circus text-2xl text-yellow-500 animate-pulse uppercase">PREPARING THE SHOW...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-[radial-gradient(circle_at_center,_#2c003e_0%,_#0d001a_100%)]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {isAdmin && firebaseError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-orange-600/90 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl border border-orange-400 animate-pulse flex items-center gap-3 uppercase">
          <i className="fas fa-cloud-bolt"></i>
          {firebaseError}
        </div>
      )}

      <header className="z-10 text-center mb-8 mt-12 px-6 w-full max-w-7xl mx-auto">
        <div className="inline-block relative">
          <h1 className="font-circus text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-yellow-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] animate-float tracking-tighter uppercase leading-[0.85] break-words">
            THE RINGMASTERS
          </h1>
          {isAdmin && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-green-600 text-white font-bangers px-4 py-1 rounded-full shadow-lg text-lg border-2 border-green-400 animate-pulse whitespace-nowrap z-30 uppercase">
              <i className="fas fa-crown mr-2"></i> ADMIN RINGMASTER
            </div>
          )}
        </div>
        <p className="font-bangers text-xl sm:text-2xl md:text-3xl text-red-500 mt-6 md:mt-10 uppercase tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-md leading-tight max-w-[90vw] mx-auto">
          LET THE SHOW BEGIN<br className="hidden sm:block" />
          <span className="sm:mt-2 block">MEET THE ARRANGERS OF OUR CIRCUS SPECTACLES</span>
        </p>
      </header>

      <main className="z-10 w-full max-w-6xl py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-center items-center">
              <CollageItem 
                item={item} 
                onEdit={setEditingItem}
                isGenerating={generatingIds.has(item.id)}
                isAdmin={isAdmin}
              />
            </div>
          ))}
        </div>
      </main>

      <div className="z-10 mt-8 mb-12 flex flex-col items-center gap-4">
        {isAdmin && (
          <button 
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-600 text-white font-circus text-xl px-8 py-3 rounded-full shadow-[0_4px_0_#4a0000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 uppercase"
          >
            <i className="fas fa-door-open"></i>
            LEAVE RINGMASTER MODE
          </button>
        )}
      </div>

      <footer className="z-10 pb-8 text-center flex flex-col items-center gap-4">
        <p className="text-yellow-600/40 font-bold uppercase tracking-widest text-sm">
          <i className="fas fa-star mr-2"></i> THE RINGMASTERS <i className="fas fa-star ml-2"></i>
        </p>
        {!isAdmin && (
          <button 
            onClick={() => setShowLogin(true)}
            className="text-xs text-yellow-600/20 hover:text-yellow-600/60 transition-colors uppercase tracking-[0.3em] font-bold"
          >
            RINGMASTERS ENTRANCE
          </button>
        )}
      </footer>

      <AdminLogin 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />

      {editingItem && (
        <EditorModal 
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
          onGenerate={handleGenerateImage}
          isGenerating={generatingIds.has(editingItem.id)}
        />
      )}
    </div>
  );
};

export default App;

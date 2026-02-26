
import React, { useState } from 'react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(user, pass)) {
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#4a0000] border-4 border-yellow-500 rounded-3xl w-full max-w-sm p-8 shadow-[0_0_100px_rgba(234,179,8,0.4)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-500"></div>
        
        <h2 className="font-circus text-4xl text-yellow-400 mb-8 text-center uppercase tracking-widest drop-shadow-lg">
          RINGMASTERS ENTRANCE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-yellow-200 font-bangers text-xl mb-2 ml-1 uppercase">RINGMASTER NAME</label>
            <input 
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-[#2a0000] border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all font-bold uppercase"
              placeholder="USERNAME"
            />
          </div>

          <div>
            <label className="block text-yellow-200 font-bangers text-xl mb-2 ml-1 uppercase">MAGIC PASSKEY</label>
            <input 
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-[#2a0000] border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-all font-bold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 font-bold text-center animate-bounce uppercase">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              INVALID CREDENTIALS!
            </p>
          )}

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-circus text-2xl py-4 rounded-2xl transition-all shadow-[0_6px_0_#8b4513] active:translate-y-1 active:shadow-none uppercase"
            >
              ENTER THE RING
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-yellow-600 hover:text-yellow-400 font-bold text-sm uppercase tracking-widest transition-colors mt-2"
            >
              GO BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


import React from 'react';
import { PortalItem } from '../types';

interface CollageItemProps {
  item: PortalItem;
  onEdit: (item: PortalItem) => void;
  isGenerating: boolean;
  isAdmin: boolean;
}

const playHoverSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Whistle/Pop
  audio.volume = 0.1;
  audio.play().catch(() => {});
};

export const CollageItem: React.FC<CollageItemProps> = ({ item, onEdit, isGenerating, isAdmin }) => {
  return (
    <div 
      className="relative group transition-all duration-500 ease-out perspective-1000"
      style={{ 
        transform: `rotate(${item.rotation}deg)`,
        zIndex: item.zIndex
      }}
      onMouseEnter={playHoverSound}
    >
      <div className="relative p-3 bg-white shadow-2xl rounded-sm transform group-hover:scale-110 group-hover:-translate-y-4 group-hover:rotate-0 transition-all duration-300 hover-jiggle border-4 border-yellow-400">
        {isAdmin && (
          <div className="absolute top-2 right-2 z-20">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onEdit(item);
              }}
              className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 border-2 border-yellow-200"
              title="Edit Portal Slot"
            >
              <i className="fas fa-magic"></i>
            </button>
          </div>
        )}

        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block overflow-hidden rounded-sm relative aspect-square bg-[#1a0026]"
        >
          {isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-yellow-400 p-4 text-center">
              <i className="fas fa-wand-sparkles fa-spin text-4xl mb-2"></i>
              <span className="font-bangers text-sm">Painting Magic...</span>
            </div>
          ) : (
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-110"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
             <span className="font-circus text-2xl text-yellow-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
               {item.title}
             </span>
          </div>
        </a>
      </div>
      {/* 3D Drop Shadow Effect */}
      <div className="absolute -inset-2 bg-black/40 blur-xl -z-10 rounded-full scale-90 group-hover:scale-110 transition-transform"></div>
    </div>
  );
};


import React, { useState, useRef } from 'react';
import { PortalItem } from '../types';

interface EditorModalProps {
  item: PortalItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: PortalItem) => void;
  onGenerate: (id: string) => void;
  isGenerating: boolean;
}

export const EditorModal: React.FC<EditorModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onSave, 
  onGenerate,
  isGenerating 
}) => {
  const [formData, setFormData] = useState<PortalItem>(item);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#2c003e] border-4 border-yellow-500 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        <h2 className="font-circus text-3xl text-yellow-400 mb-6 text-center uppercase tracking-widest">
          EDIT PORTAL SLOT
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-yellow-200 font-bold mb-1 ml-1 text-sm uppercase">TITLE</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
              className="w-full bg-[#1a0026] border-2 border-yellow-600/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none transition-colors uppercase"
              placeholder="E.G. THE BIG TENT"
            />
          </div>

          <div>
            <label className="block text-yellow-200 font-bold mb-1 ml-1 text-sm uppercase">PROMPT</label>
            <textarea 
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value.toUpperCase() })}
              className="w-full bg-[#1a0026] border-2 border-yellow-600/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none transition-colors h-24 resize-none uppercase"
              placeholder="DESCRIBE THE MAGIC..."
            />
          </div>

          <div>
            <label className="block text-yellow-200 font-bold mb-1 ml-1 text-sm uppercase">URL</label>
            <input 
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-[#1a0026] border-2 border-yellow-600/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="HTTPS://..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => onGenerate(formData.id)}
              disabled={isGenerating}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white font-circus py-3 rounded-xl shadow-[0_4px_0_#4a0000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
            >
              {isGenerating ? (
                <i className="fas fa-magic animate-spin"></i>
              ) : (
                <i className="fas fa-wand-sparkles"></i>
              )}
              {isGenerating ? 'MAGIC...' : 'GENERATE'}
            </button>

            <button 
              onClick={() => onSave(formData)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-[#2c003e] font-circus py-3 rounded-xl shadow-[0_4px_0_#854d0e] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
            >
              <i className="fas fa-save"></i>
              SAVE
            </button>
          </div>

          <button 
            onClick={onClose}
            className="w-full text-yellow-600/50 hover:text-yellow-500 font-bold text-xs uppercase tracking-widest mt-4 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

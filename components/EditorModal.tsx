
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
            <label className="block text-yellow-200 font-
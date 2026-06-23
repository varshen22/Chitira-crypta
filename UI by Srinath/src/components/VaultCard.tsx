import { Share2, Image as ImageIcon, Images, Pen, Trash2 } from 'lucide-react';
import { VaultEntry } from '../types';

interface VaultCardProps {
  vault: VaultEntry;
  onEdit: (vault: VaultEntry) => void;
  onDelete: (id: string) => void;
}

export function VaultCard({ vault, onEdit, onDelete }: VaultCardProps) {
  return (
    <div className="vault-card relative h-64 rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${vault.imageUrl || ''}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-headline-md text-headline-md">{vault.name}</h3>
        <p className="font-body-sm text-body-sm opacity-90">Last Updated: {vault.lastUpdated}</p>
      </div>

      {/* Overlay Actions */}
      <div className="overlay-actions absolute inset-0 bg-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
        
        {/* Export Dropdown */}
        <div className="relative group/dropdown">
          <button 
            className="p-3 bg-white text-primary rounded-full hover:bg-primary-fixed transition-colors shadow-lg flex items-center justify-center" 
            title="Export Options"
          >
            <Share2 size={24} />
          </button>
          
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-outline-variant overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 min-w-[140px]">
            <button 
              className="w-full px-4 py-2 text-left text-body-sm hover:bg-surface-container transition-colors flex items-center gap-2"
              onClick={() => alert('Exporting as PNG...')}
            >
              <ImageIcon size={18} /> PNG
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-body-sm hover:bg-surface-container transition-colors flex items-center gap-2"
              onClick={() => alert('Exporting as JPEG...')}
            >
              <Images size={18} /> JPEG
            </button>
          </div>
        </div>

        {/* Edit Button */}
        <button 
          className="p-3 bg-white text-primary rounded-full hover:bg-primary-fixed transition-colors shadow-lg" 
          title="Edit"
          onClick={() => onEdit(vault)}
        >
          <Pen size={24} />
        </button>

        {/* Delete Button */}
        <button 
          className="p-3 bg-white text-error rounded-full hover:bg-error-container transition-colors shadow-lg" 
          title="Delete"
          onClick={() => {
            if(window.confirm('Are you sure you want to delete this vault?')) {
              onDelete(vault.id);
            }
          }}
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
}

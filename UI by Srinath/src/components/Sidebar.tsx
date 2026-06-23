import { User, HelpCircle, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <nav className="absolute left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-headline-md text-primary">Menu</h2>
          <button 
            className="text-on-surface-variant hover:text-primary transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 py-4">
          <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-surface-container transition-colors text-on-surface">
            <User size={24} />
            <span className="font-body-md">My Profile</span>
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-surface-container transition-colors text-on-surface">
            <HelpCircle size={24} />
            <span className="font-body-md">Help</span>
          </button>
        </div>
        
        <div className="p-4 border-t border-outline-variant">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 w-full px-4 py-3 text-error hover:bg-error-container rounded-lg transition-colors"
          >
            <LogOut size={24} />
            <span className="font-body-md font-bold">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

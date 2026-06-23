import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-gutter h-16 w-full fixed top-0 z-40 bg-surface-container-lowest dark:bg-surface-container-low border-b border-outline-variant dark:border-outline">
      <div 
        className="cursor-pointer active:scale-95 text-primary" 
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </div>
      <h1 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
        Chitra Crypta
      </h1>
      <div className="cursor-pointer active:scale-95 text-primary">
        <X size={24} />
      </div>
    </header>
  );
}

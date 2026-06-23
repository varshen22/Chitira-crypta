import { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { VaultGrid } from '../components/VaultGrid';
import { VaultForm } from '../components/VaultForm';
import { VaultEntry } from '../types';

// Mock initial data
const MOCK_VAULTS: VaultEntry[] = [
  {
    id: '1',
    name: 'Primary Patient Vault',
    lastUpdated: 'Oct 24, 2023',
    bloodGroup: 'A+',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Uz987LIfNKhwGHpMLlCEYddpgK12JZIPtUiGSg4I7J7md0xLmss5FzbDDNuFgsxLGpv9hn9dEMQprYLJIPpmQDOPe83zSprqypWHkF0ulFXf7kBa8b3iUh7T_JL17kHoY2PCw1VUeDLnaOAS6UDisjHMFpZBgK__i_IN2KSooaYdAdgyl1HABjWFeaGlTjEczk5jD3UiayWca1JFP0TI4B6bC3d67DxLcKk4v7-1rBZFZQ4LPzST8BXKLWzGTuPd4ES9DubVTPk',
  }
];

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vaults, setVaults] = useState<VaultEntry[]>(MOCK_VAULTS);
  
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedVault, setSelectedVault] = useState<VaultEntry | undefined>(undefined);

  const formRef = useRef<HTMLDivElement>(null);

  const handleAddNew = () => {
    setSelectedVault(undefined);
    setMode('add');
    scrollToForm();
  };

  const handleEdit = (vault: VaultEntry) => {
    setSelectedVault(vault);
    setMode('edit');
    scrollToForm();
  };

  const handleDelete = (id: string) => {
    setVaults(prev => prev.filter(v => v.id !== id));
    if (selectedVault?.id === id) {
      handleCancelForm();
    }
  };

  const handleCancelForm = () => {
    setMode('list');
    setSelectedVault(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveForm = (data: Partial<VaultEntry>) => {
    if (mode === 'edit' && selectedVault) {
      setVaults(prev => 
        prev.map(v => v.id === selectedVault.id ? { ...v, ...data, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) } : v)
      );
    } else {
      const newVault: VaultEntry = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'New Patient Vault',
        bloodGroup: data.bloodGroup,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}),
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Uz987LIfNKhwGHpMLlCEYddpgK12JZIPtUiGSg4I7J7md0xLmss5FzbDDNuFgsxLGpv9hn9dEMQprYLJIPpmQDOPe83zSprqypWHkF0ulFXf7kBa8b3iUh7T_JL17kHoY2PCw1VUeDLnaOAS6UDisjHMFpZBgK__i_IN2KSooaYdAdgyl1HABjWFeaGlTjEczk5jD3UiayWca1JFP0TI4B6bC3d67DxLcKk4v7-1rBZFZQ4LPzST8BXKLWzGTuPd4ES9DubVTPk' // Using default image for demo
      };
      setVaults(prev => [...prev, newVault]);
    }
    handleCancelForm();
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="page-dashboard min-h-screen font-body text-on-surface">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-24 pb-12 px-4 md:px-12 max-w-[1280px] mx-auto">
        <VaultGrid 
          vaults={vaults}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {mode !== 'list' && (
          <div ref={formRef}>
            <VaultForm 
              mode={mode}
              initialData={selectedVault}
              onCancel={handleCancelForm}
              onSave={handleSaveForm}
            />
          </div>
        )}
      </main>
    </div>
  );
}

import { Plus } from 'lucide-react';
import { VaultEntry } from '../types';
import { VaultCard } from './VaultCard';

interface VaultGridProps {
  vaults: VaultEntry[];
  onAddNew: () => void;
  onEdit: (vault: VaultEntry) => void;
  onDelete: (id: string) => void;
}

export function VaultGrid({ vaults, onAddNew, onEdit, onDelete }: VaultGridProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="font-headline-lg text-headline-lg text-on-tertiary-container">
          Stored Vaults
        </h2>
        <span className="font-label-caps text-label-caps text-primary px-3 py-1 bg-primary-fixed rounded-full">
          SECURE ENCRYPTION ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Data Button */}
        <button 
          onClick={onAddNew}
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-outline-variant rounded-xl bg-white hover:bg-surface-container transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform shadow-md">
            <Plus size={32} />
          </div>
          <span className="mt-4 font-headline-md text-headline-md text-primary">
            Add New Data
          </span>
        </button>

        {/* Render Vault Cards */}
        {vaults.map((vault) => (
          <VaultCard 
            key={vault.id} 
            vault={vault} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </section>
  );
}

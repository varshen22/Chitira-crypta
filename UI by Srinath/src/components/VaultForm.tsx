import { useState, useEffect } from 'react';
import { 
  Camera, Upload, User, Stethoscope, Phone, Siren, UserPlus, 
  IdCard, Lock, ShieldCheck, Loader2, CheckCircle2 
} from 'lucide-react';
import { VaultEntry } from '../types';

interface VaultFormProps {
  mode: 'add' | 'edit';
  initialData?: VaultEntry;
  onCancel: () => void;
  onSave: (data: Partial<VaultEntry>) => void;
}

export function VaultForm({ mode, initialData, onCancel, onSave }: VaultFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bloodGroup: initialData?.bloodGroup || 'A+',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        bloodGroup: initialData.bloodGroup || 'A+'
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate encryption and save
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      setTimeout(() => {
        onSave(formData);
      }, 1500);
    }, 2000);
  };

  return (
    <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant">
        <h2 className="font-headline-lg text-headline-lg text-on-tertiary-container">
          {mode === 'edit' ? 'Edit Vault Entry' : 'Add New Vault Entry'}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Complete all fields to ensure comprehensive medical safety protocols.
        </p>
      </div>

      <form className="p-8 space-y-10" onSubmit={handleSubmit}>
        
        {/* Patient Image / Clinical Document */}
        <div className="pb-10 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-6 flex items-center gap-2">
            <Camera size={24} />
            Patient Image / Clinical Document
          </h3>
          <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <p className="font-headline-md text-headline-md text-primary mb-1">Browse Files</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Supported formats: PNG, JPEG (Max 5MB)</p>
            <input type="file" accept="image/jpeg, image/png" className="hidden" />
          </label>
        </div>

        {/* Personal Information */}
        <div className="pb-10 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-6 flex items-center gap-2">
            <User size={24} />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">NAME</label>
              <input 
                type="text" 
                name="patient_name" 
                placeholder="Full legal name" 
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                value={formData.name}
                onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">BLOOD GROUP</label>
              <select 
                name="blood_group" 
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                value={formData.bloodGroup}
                onChange={(e) => setFormData(p => ({...p, bloodGroup: e.target.value}))}
              >
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">DATE OF BIRTH</label>
              <input type="date" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">AGE</label>
              <input type="number" placeholder="Years" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
            </div>
            <div className="lg:col-span-3">
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">GENDER</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="text-primary focus:ring-primary w-4 h-4" />
                  <span className="font-body-md">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="text-primary focus:ring-primary w-4 h-4" />
                  <span className="font-body-md">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="text-primary focus:ring-primary w-4 h-4" />
                  <span className="font-body-md">Other</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="pb-10 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-6 flex items-center gap-2">
            <Stethoscope size={24} />
            Medical Infos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">MEDICAL CONDITIONS</label>
              <textarea rows={3} placeholder="List existing chronic conditions..." className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-none" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">MEDICAL ALLERGY</label>
              <textarea rows={3} placeholder="Medications, food, or environmental..." className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-none" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">CURRENT MEDICATIONS</label>
              <textarea rows={3} placeholder="Dosage and frequency..." className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-none" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">SURGERY OR OPERATIONS</label>
              <textarea rows={3} placeholder="Dates and procedures..." className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-none" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="pb-10 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-6 flex items-center gap-2">
            <Phone size={24} />
            Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">PHONE NUMBER</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">ADDRESS</label>
              <input type="text" placeholder="Street, City, Zip Code" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="pb-10 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md text-on-tertiary-container flex items-center gap-2">
              <Siren size={24} />
              Emergency Contacts
            </h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Up to 5 contacts</span>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-surface-container rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">PERSON NAME</label>
                <input type="text" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">GENDER</label>
                <select className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">RELATIONSHIP</label>
                <select className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface">
                  <option>Husband/Wife</option>
                  <option>Boyfriend/Girlfriend</option>
                  <option>Father/Mother</option>
                  <option>Brother/Sister</option>
                  <option>Friend</option>
                  <option>Acquaintance</option>
                </select>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">PHONE NUMBER</label>
                <input type="tel" className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" />
              </div>
            </div>
            
            <button type="button" className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-primary font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
              <UserPlus size={20} />
              Add Another Emergency Contact
            </button>
          </div>
        </div>

        {/* Identity */}
        <div className="pb-10 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-tertiary-container mb-6 flex items-center gap-2">
            <IdCard size={24} />
            Identity Verification
          </h3>
          <div className="max-w-md">
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">AADHAR NUMBER</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="XXXX - XXXX - XXXX" 
                className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" 
              />
              <Lock size={20} className="absolute left-3 top-2.5 text-outline" />
            </div>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Encrypted at rest. HIPAA and GDPR Compliant.</p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container transition-colors"
          >
            Discard Draft
          </button>
          <button 
            type="submit" 
            disabled={isSaving || isSaved}
            className={`px-8 py-3 font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              isSaved 
                ? 'bg-tertiary-container text-on-tertiary-container' 
                : 'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95'
            } ${(isSaving || isSaved) ? 'opacity-90' : ''}`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={24} />
                Vault Secured
              </>
            ) : isSaving ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <ShieldCheck size={24} />
                Save to Encrypted Vault
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

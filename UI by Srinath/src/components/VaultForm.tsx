import { useState, useEffect } from 'react';
import { 
  Camera, Upload, User, Stethoscope, Phone, Siren, UserPlus, 
  IdCard, Lock, ShieldCheck, Loader2, CheckCircle2, Calendar, Trash2
} from 'lucide-react';
import { VaultEntry } from '../types';
import { COUNTRY_CODES } from '../constants/countryCodes';

interface VaultFormProps {
  mode: 'add' | 'edit';
  initialData?: VaultEntry;
  onCancel: () => void;
  onSave: (data: Partial<VaultEntry>) => void;
}

export function VaultForm({ mode, initialData, onCancel, onSave }: VaultFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bloodGroup: initialData?.bloodGroup || 'A+',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    phoneCode: '+91',
    phone: '',
    address: '',
    aadhar: '',
    emergencyContacts: [
      { name: '', gender: 'Male', relationship: 'Husband/Wife', phoneCode: '+91', phoneNumber: '' }
    ]
  });

  const [phoneError, setPhoneError] = useState(false);
  const [aadharError, setAadharError] = useState(false);
  const [emergencyPhoneErrors, setEmergencyPhoneErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.name,
        bloodGroup: initialData.bloodGroup || 'A+'
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please upload a patient image/document first!");
      return;
    }

    setIsSaving(true);
    
    const apiFormData = new FormData();
    apiFormData.append('image', selectedFile);
    apiFormData.append('passphrase', 'taravusecret'); // Default hackathon test key

    try {
      const response = await fetch('http://localhost:5000/api/decode', {
        method: 'POST',
        body: apiFormData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSaved(true);
        console.log("Decrypted Data from Python:", result.data);
        
        // Pass the decrypted data back up to the parent component
        setTimeout(() => {
          onSave(result.data);
        }, 1500);
      } else {
        alert("Extraction failed: " + result.error);
        setIsSaving(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to the Python backend. Make sure it is running on port 5000!");
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
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
          <label 
            className={`flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-outline-variant rounded-xl transition-colors cursor-pointer group relative overflow-hidden ${imagePreview ? 'bg-surface-container' : 'p-8 bg-surface-container-low hover:bg-surface-container'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-lg">
                {/* Blurred Background to fill blank space */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                  style={{ backgroundImage: `url(${imagePreview})` }}
                />
                {/* Actual Image fully visible */}
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="relative z-10 w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-sm" 
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
                    <Upload size={24} />
                  </div>
                  <p className="text-white font-bold text-sm tracking-wide">Change Image</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <p className="font-headline-md text-headline-md text-primary mb-1">Browse Files or Drag & Drop</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Supported formats: PNG, JPEG (Max 5MB)</p>
              </>
            )}
            <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleImageChange} />
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
              <div className="flex gap-2 relative items-center w-full">
                <input 
                  type="number" placeholder="DD" min="1" max="31" 
                  value={formData.dobDay} onChange={(e) => setFormData(p => ({...p, dobDay: e.target.value}))}
                  className="w-16 px-2 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
                <input 
                  type="number" placeholder="MM" min="1" max="12" 
                  value={formData.dobMonth} onChange={(e) => setFormData(p => ({...p, dobMonth: e.target.value}))}
                  className="w-16 px-2 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
                <input 
                  type="number" placeholder="YYYY" min="1900" max="2026" 
                  value={formData.dobYear} onChange={(e) => setFormData(p => ({...p, dobYear: e.target.value}))}
                  className="flex-1 px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                />
                <div className="relative w-10 h-10 flex items-center justify-center bg-surface-container-low border border-outline-variant rounded-lg shrink-0 overflow-hidden group hover:bg-surface-container transition-colors cursor-pointer">
                  <Calendar size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  <input 
                    type="date" 
                    value={(formData.dobYear.length === 4 && formData.dobMonth && formData.dobDay) ? `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}` : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setFormData(p => ({ ...p, dobYear: '', dobMonth: '', dobDay: '' }));
                        return;
                      }
                      const [y, m, d] = e.target.value.split('-');
                      setFormData(p => ({ ...p, dobYear: y, dobMonth: parseInt(m, 10).toString(), dobDay: parseInt(d, 10).toString() }));
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
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
              <div className="flex w-full bg-white border border-outline-variant rounded-lg focus-within:ring-2 focus-within:ring-primary overflow-hidden">
                <input 
                  list="country-codes" 
                  value={formData.phoneCode}
                  onChange={(e) => setFormData(p => ({ ...p, phoneCode: e.target.value }))}
                  placeholder="+code"
                  className="w-24 px-3 py-2 bg-surface-container-low border-r border-outline-variant outline-none text-sm"
                />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => {
                    if (/[^0-9]/.test(e.target.value)) {
                      setPhoneError(true);
                      setTimeout(() => setPhoneError(false), 3000);
                    }
                    setFormData(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, '') }));
                  }}
                  placeholder="00000 00000" 
                  className="flex-1 px-4 py-2 focus:outline-none text-on-surface" 
                />
              </div>
              {phoneError && <p className="text-error text-xs mt-1 animate-in fade-in">Please enter only digits</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">ADDRESS</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                placeholder="Street, City, Zip Code" 
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" 
              />
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
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="p-6 bg-surface-container rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative group">
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({ ...p, emergencyContacts: p.emergencyContacts.filter((_, i) => i !== index) }))}
                    className="absolute top-3 right-3 p-1.5 bg-error/10 text-error rounded-md hover:bg-error/20 transition-colors"
                    title="Remove Contact"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <div className={index > 0 ? "lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2" : "lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">PERSON NAME</label>
                    <input 
                      type="text" 
                      value={contact.name}
                      onChange={(e) => setFormData(p => {
                        const newContacts = [...p.emergencyContacts];
                        newContacts[index].name = e.target.value;
                        return { ...p, emergencyContacts: newContacts };
                      })}
                      className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">GENDER</label>
                    <select 
                      value={contact.gender}
                      onChange={(e) => setFormData(p => {
                        const newContacts = [...p.emergencyContacts];
                        newContacts[index].gender = e.target.value;
                        return { ...p, emergencyContacts: newContacts };
                      })}
                      className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                    >
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2">RELATIONSHIP</label>
                    <select 
                      value={contact.relationship}
                      onChange={(e) => setFormData(p => {
                        const newContacts = [...p.emergencyContacts];
                        newContacts[index].relationship = e.target.value;
                        return { ...p, emergencyContacts: newContacts };
                      })}
                      className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                    >
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
                    <div className="flex w-full bg-white border border-outline-variant rounded-lg focus-within:ring-2 focus-within:ring-primary overflow-hidden">
                      <input 
                        list="country-codes" 
                        value={contact.phoneCode}
                        onChange={(e) => setFormData(p => {
                          const newContacts = [...p.emergencyContacts];
                          newContacts[index].phoneCode = e.target.value;
                          return { ...p, emergencyContacts: newContacts };
                        })}
                        placeholder="+code"
                        className="w-24 px-3 py-2 bg-surface-container-low border-r border-outline-variant outline-none text-sm"
                      />
                      <input 
                        type="tel" 
                        value={contact.phoneNumber}
                        onChange={(e) => {
                          if (/[^0-9]/.test(e.target.value)) {
                            setEmergencyPhoneErrors(errs => ({ ...errs, [index]: true }));
                            setTimeout(() => setEmergencyPhoneErrors(errs => ({ ...errs, [index]: false })), 3000);
                          }
                          setFormData(p => {
                            const newContacts = [...p.emergencyContacts];
                            newContacts[index].phoneNumber = e.target.value.replace(/[^0-9]/g, '');
                            return { ...p, emergencyContacts: newContacts };
                          });
                        }}
                        placeholder="00000 00000" 
                        className="flex-1 px-4 py-2 focus:outline-none text-on-surface" 
                      />
                    </div>
                    {emergencyPhoneErrors[index] && <p className="text-error text-xs mt-1 absolute animate-in fade-in">Please enter only digits</p>}
                  </div>
                </div>
              </div>
            ))}
            
            {formData.emergencyContacts.length < 5 && (
              <button 
                type="button" 
                onClick={() => setFormData(p => ({
                  ...p,
                  emergencyContacts: [
                    ...p.emergencyContacts,
                    { name: '', gender: 'Male', relationship: 'Husband/Wife', phoneCode: '+91', phoneNumber: '' }
                  ]
                }))}
                className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-primary font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                Add Another Emergency Contact
              </button>
            )}
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
                value={formData.aadhar}
                onChange={(e) => {
                  if (/[^0-9]/.test(e.target.value)) {
                    setAadharError(true);
                    setTimeout(() => setAadharError(false), 3000);
                  }
                  setFormData(p => ({ ...p, aadhar: e.target.value.replace(/[^0-9]/g, '') }));
                }}
                maxLength={12}
                placeholder="XXXX XXXX XXXX" 
                className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface text-lg tracking-widest" 
              />
              <Lock size={22} className="absolute left-4 top-3.5 text-outline" />
            </div>
            {aadharError && <p className="text-error text-xs mt-1 animate-in fade-in">Please enter only digits</p>}
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">Encrypted at rest. HIPAA and GDPR Compliant.</p>
          </div>
        </div>

        {/* Country Codes Datalist */}
        <datalist id="country-codes">
          {COUNTRY_CODES.map(c => <option key={c.name} value={c.code}>{c.name}</option>)}
        </datalist>

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
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck size={24} />
                Extract / Save
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

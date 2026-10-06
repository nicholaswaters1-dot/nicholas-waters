import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { EmergencyCallContact } from '../../types';
import {
  AlertTriangle,
  Phone,
  PhoneCall,
  MapPin,
  X,
  Plus,
  ShieldAlert,
  CheckCircle2,
  User,
  HeartPulse,
} from 'lucide-react';

interface SosHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName?: string;
  currentGpsCoords?: string;
}

export const SosHelpModal: React.FC<SosHelpModalProps> = ({
  isOpen,
  onClose,
  currentLocationName = 'Hampstead Heath West Woods (NW3)',
  currentGpsCoords = '51.5606° N, 0.1631° W',
}) => {
  const {
    emergencyContacts,
    activeEmergencyContactId,
    setActiveEmergencyContactId,
    addEmergencyContact,
    triggerSosEmergencyCall,
    showToast,
  } = useMarketplace();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('Family Co-Parent');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const selectedContact =
    emergencyContacts.find((c) => c.id === activeEmergencyContactId) || emergencyContacts[0];

  const handleAddNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Please provide name and phone number', 'warning');
      return;
    }
    addEmergencyContact({
      name: newName.trim(),
      relationship: newRelationship,
      phone: newPhone.trim(),
      isDefault: false,
      notifyOnLiveWalk: true,
    });
    setIsAddingNew(false);
    setNewName('');
    setNewPhone('');
  };

  const handleTriggerSos = () => {
    triggerSosEmergencyCall(selectedContact, `${currentLocationName} (${currentGpsCoords})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-red-200 overflow-hidden transform transition-all">
        {/* Header Warning */}
        <div className="p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Emergency Call for Help (SOS)
              </h3>
              <p className="text-xs text-rose-100">Live Walk Emergency Assist & GPS Dispatch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Live Location Alert Card */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-950">Your Live GPS Coordinates:</span>
              <p className="text-red-900 mt-0.5 font-mono text-[11px]">
                {currentLocationName} · {currentGpsCoords}
              </p>
              <p className="text-[10px] text-red-700 mt-1">
                Your emergency contact will receive an automated high-priority SMS containing this location link.
              </p>
            </div>
          </div>

          {/* Select Contact to Call */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Select Who to Call for Help:
              </label>
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNew ? 'Cancel' : 'Add New Contact'}</span>
              </button>
            </div>

            {/* Add New Contact Form */}
            {isAddingNew && (
              <form
                onSubmit={handleAddNewContact}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7700 900000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    placeholder="e.g. Neighbor, Family, Dog Walker"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
                >
                  Save Emergency Contact
                </button>
              </form>
            )}

            {/* List of Available Contacts */}
            <div className="space-y-2">
              {emergencyContacts.map((contact) => {
                const isSelected = contact.id === activeEmergencyContactId;
                return (
                  <div
                    key={contact.id}
                    onClick={() => setActiveEmergencyContactId(contact.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {contact.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {contact.relationship} · <span className="font-mono">{contact.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Select</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call Trigger Action */}
          <div className="pt-2">
            <button
              onClick={handleTriggerSos}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Call {selectedContact?.name.split(' ')[0] || 'Emergency'} Now</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          In severe life-threatening situations, also dial 999 immediately.
        </div>
      </div>
    </div>
  );
};

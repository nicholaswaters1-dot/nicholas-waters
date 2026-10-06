import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShelterStaffMember } from '../../types';
import {
  Users,
  ChevronDown,
  UserCheck,
  Plus,
  X,
  Clock,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export const ShelterStaffSwitcher: React.FC = () => {
  const {
    shelterStaff,
    activeShelterStaff,
    switchShelterStaff,
    addShelterStaff,
    activeShelter,
    showToast,
  } = useMarketplace();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStaffForLogin, setSelectedStaffForLogin] = useState<ShelterStaffMember | null>(null);
  const [loginPinInput, setLoginPinInput] = useState('2480');

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<ShelterStaffMember['role']>('Kennel Manager');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+44 20 7946 0999');
  const [newShift, setNewShift] = useState('09:00 - 17:30 (Day Shift)');
  const [newPin, setNewPin] = useState('4412');

  const handleStaffLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForLogin) return;
    switchShelterStaff(selectedStaffForLogin.id);
    setSelectedStaffForLogin(null);
    setIsOpen(false);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Please provide staff name and work email', 'warning');
      return;
    }

    addShelterStaff({
      shelterId: activeShelter.id,
      name: newName.trim(),
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      email: newEmail.trim(),
      phone: newPhone.trim(),
      shiftToday: newShift.trim(),
      staffPinCode: newPin.trim() || '1234',
      permissions: ['Post & Upload Dogs', 'Activate / Deactivate Adoption', 'Log Daily Updates'],
    });

    setIsAdding(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="relative inline-block text-left">
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-300 shadow-2xs text-xs font-semibold text-slate-800 transition-all min-h-[42px]"
        title="Switch or sign in to shelter staff account"
      >
        <img
          src={activeShelterStaff.avatar}
          alt={activeShelterStaff.name}
          className="w-6 h-6 rounded-full object-cover border border-emerald-600"
        />
        <div className="text-left">
          <span className="font-bold text-slate-900 block leading-tight">
            {activeShelterStaff.name.split(' ')[0]} · {activeShelterStaff.role}
          </span>
          <span className="text-[10px] text-emerald-700 block leading-none mt-0.5">
            {activeShelterStaff.email}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Multi-User Shelter Staff Login ({shelterStaff.length})</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Each shelter team member has individual login credentials to post new dogs, activate/deactivate adopted dogs, and log daily updates.
          </p>

          {/* PIN / Credential Verification Prompt when switching staff */}
          {selectedStaffForLogin ? (
            <form
              onSubmit={handleStaffLoginSubmit}
              className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-800" />
                  <span className="font-bold text-emerald-950">
                    Sign In: {selectedStaffForLogin.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStaffForLogin(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Staff Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={selectedStaffForLogin.email}
                  className="w-full px-2.5 py-1.5 bg-white/80 border border-slate-200 rounded-lg text-slate-700 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  4-Digit Staff Security PIN / Passcode
                </label>
                <input
                  type="password"
                  required
                  value={loginPinInput}
                  onChange={(e) => setLoginPinInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900 font-bold tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-lg shadow-xs"
              >
                Verify Credentials & Switch Account
              </button>
            </form>
          ) : (
            /* Staff List */
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {shelterStaff.map((staff) => {
                const isActive = staff.id === activeShelterStaff.id;
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setIsOpen(false);
                      } else {
                        setSelectedStaffForLogin(staff);
                        setLoginPinInput(staff.staffPinCode || '2480');
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">{staff.name}</span>
                          {isActive && (
                            <span className="text-[10px] text-emerald-800 font-extrabold">
                              · Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium">
                          {staff.role} · {staff.email}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{staff.shiftToday}</span>
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#0f5132] shrink-0">
                        Sign In →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Add Staff Account Form */}
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Create New Staff Login Account</span>
            </button>
          ) : (
            <form
              onSubmit={handleAddStaff}
              className="p-3 bg-slate-50 rounded-xl space-y-2.5 border border-slate-200 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">New Staff Login Credentials</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                required
                placeholder="Staff Full Name (e.g. Chloe Evans)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
              />

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
              >
                <option value="Shelter Director">Shelter Director</option>
                <option value="Kennel Manager">Kennel Manager</option>
                <option value="Adoption Coordinator">Adoption Coordinator</option>
                <option value="Vet Nurse / Medical Lead">Vet Nurse / Medical Lead</option>
                <option value="Volunteer Lead">Volunteer Lead</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  placeholder="Work Login Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
                />
                <input
                  type="text"
                  required
                  placeholder="4-Digit Login PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <input
                type="text"
                placeholder="Shift Hours (e.g. 08:30 - 17:00)"
                value={newShift}
                onChange={(e) => setNewShift(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
              />

              <button
                type="submit"
                className="w-full py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-lg shadow-2xs"
              >
                Create Staff Account & Credentials
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

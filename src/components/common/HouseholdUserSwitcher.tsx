import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { HouseholdMember } from '../../types';
import {
  Users,
  Radio,
  ChevronDown,
  UserCheck,
  Plus,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';

export const HouseholdUserSwitcher: React.FC = () => {
  const {
    householdMembers,
    activeHouseholdMember,
    switchHouseholdMember,
    addHouseholdMember,
    setOwnerTab,
    showToast,
  } = useMarketplace();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<HouseholdMember['role']>('Co-Parent');
  const [newEmail, setNewEmail] = useState('');

  // Find if another household member is currently on a live walk!
  const walkingMember = householdMembers.find(
    (m) => m.isCurrentlyWalking && m.id !== activeHouseholdMember.id
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Please enter name and email', 'warning');
      return;
    }
    addHouseholdMember({
      name: newName.trim(),
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      email: newEmail.trim(),
      phone: '+44 7700 900333',
    });
    setIsAdding(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="relative inline-block text-left">
      {/* Switcher Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs text-xs font-semibold text-slate-800 transition-all"
        title="Switch family member / household account"
      >
        <img
          src={activeHouseholdMember.avatar}
          alt={activeHouseholdMember.name}
          className="w-5 h-5 rounded-full object-cover border border-emerald-500"
        />
        <span>
          {activeHouseholdMember.name.split(' ')[0]} ({activeHouseholdMember.role})
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Walking Alert Notification Bubble */}
      {walkingMember && (
        <button
          onClick={() => {
            setOwnerTab('live-walk');
            showToast(`Viewing ${walkingMember.name}'s active live walk!`);
          }}
          className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all animate-pulse"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
          <span>{walkingMember.role} is out walking! View Live</span>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pet Owner Household</span>
            </span>
            <span className="text-[10px] text-slate-400">Multi-User Sync</span>
          </div>

          {/* Members List */}
          <div className="space-y-1.5">
            {householdMembers.map((member) => {
              const isCurrent = member.id === activeHouseholdMember.id;
              return (
                <div
                  key={member.id}
                  onClick={() => {
                    switchHouseholdMember(member.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-emerald-50 border border-emerald-300 font-bold text-emerald-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs">{member.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {member.role} {member.isCurrentlyWalking && '· 🚶 Out on Walk'}
                      </div>
                    </div>
                  </div>

                  {member.isCurrentlyWalking ? (
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 text-emerald-700 animate-pulse" />
                      Live Walk
                    </span>
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full bg-[#0f5132] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Add Co-Parent / Family Member Form */}
          {isAdding ? (
            <form onSubmit={handleAddMember} className="p-2.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200">
              <div className="font-bold text-slate-800 text-[11px]">Invite Family Member:</div>
              <input
                type="text"
                placeholder="Name (e.g. Emma Harrison)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
              />
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as HouseholdMember['role'])}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                >
                  <option value="Mum">Mum</option>
                  <option value="Dad">Dad</option>
                  <option value="Co-Parent">Co-Parent</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Dog Sitter">Dog Sitter</option>
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-1 text-slate-500 hover:text-slate-800 text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1 bg-[#0f5132] text-white font-bold rounded-lg text-[11px]"
                >
                  Add Member
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-1.5 text-xs text-emerald-800 font-bold hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1 border border-dashed border-emerald-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Family Co-Parent</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

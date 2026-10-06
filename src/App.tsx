import React, { useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { GOOGLE_MAPS_API_KEY } from './services/googleMapsConfig';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { Logo } from './components/common/Logo';
import { UserCustomHomeHub } from './components/common/UserCustomHomeHub';
import { UniversalProfileEditorModal } from './components/common/UniversalProfileEditorModal';
import { MarketplaceDiscovery } from './components/owner/MarketplaceDiscovery';
import { BusterProfileCareGuide } from './components/owner/BusterProfileCareGuide';
import { LiveWalkAndChat } from './components/owner/LiveWalkAndChat';
import { BookingsList } from './components/owner/BookingsList';
import { BookingCheckoutModal } from './components/owner/BookingCheckoutModal';
import { LocalDirectoryAdvertisers } from './components/directory/LocalDirectoryAdvertisers';
import { PawMatesCommunity } from './components/owner/PawMatesCommunity';
import { PetTrainingAndGames } from './components/owner/PetTrainingAndGames';
import { KennelDiscoveryOwnerView } from './components/kennel/KennelDiscoveryOwnerView';
import { ComplaintsSubmissionView } from './components/complaints/ComplaintsSubmissionView';
import { PackConnectHub } from './components/walker/PackConnectHub';
import { WalkerCalendarView } from './components/walker/WalkerCalendarView';
import { WalkerServicesPricing } from './components/walker/WalkerServicesPricing';
import { CredentialDbsAudit } from './components/walker/CredentialDbsAudit';
import { DbsVerificationUpload } from './components/walker/DbsVerificationUpload';
import { SubscriptionPlans } from './components/walker/SubscriptionPlans';
import { KennelPortal } from './components/kennel/KennelPortal';
import { ShelterPortal } from './components/shelter/ShelterPortal';
import { AdminMobileCommandCenter } from './components/admin/AdminMobileCommandCenter';
import { PlatformOverviewKpis } from './components/admin/PlatformOverviewKpis';
import { MarketplaceOverview } from './components/admin/MarketplaceOverview';
import { ComplianceQueue } from './components/admin/ComplianceQueue';
import { IncidentResolution } from './components/admin/IncidentResolution';
import { CommissionEngine } from './components/admin/CommissionEngine';
import { LocalAdvertisersAdmin } from './components/admin/LocalAdvertisersAdmin';
import { ComplaintsResolutionAdmin } from './components/admin/ComplaintsResolutionAdmin';
import { LanguagePickerModal } from './components/common/LanguagePickerModal';
import { LegalAndComplianceModal } from './components/legal/LegalAndComplianceModal';
import { AboutUsModal } from './components/about/AboutUsModal';
import { PawsAiAssistantModal } from './components/ai/PawsAiAssistantModal';
import { ShareWalkModal } from './components/common/ShareWalkModal';
import { PolicySignUpAgreementModal } from './components/common/PolicySignUpAgreementModal';
import { HowToUseAppModal } from './components/common/HowToUseAppModal';
import { OfflineConnectivityBanner } from './components/common/OfflineConnectivityBanner';
import { ContactUsModal } from './components/common/ContactUsModal';
import { Scale, Info, Globe2, Mail, Play } from 'lucide-react';

const MainContent: React.FC = () => {
  const { persona, isAuthorizedAdmin, ownerTab, walkerTab, kennelTab, shelterTab, adminTab } =
    useMarketplace();

  // Always scroll to top of page whenever any user switches persona or selects a new menu tab
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [persona, ownerTab, walkerTab, kennelTab, shelterTab, adminTab]);

  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-24 overflow-x-hidden">
      {/* Pet Owner Experience */}
      {(persona === 'owner' || (persona === 'admin' && !isAuthorizedAdmin)) && (
        <>
          {ownerTab === 'home' && <UserCustomHomeHub />}
          {ownerTab === 'discover' && <MarketplaceDiscovery />}
          {ownerTab === 'my-dogs' && <BusterProfileCareGuide />}
          {ownerTab === 'live-walk' && <LiveWalkAndChat />}
          {ownerTab === 'bookings' && <BookingsList />}
          {ownerTab === 'directory' && <LocalDirectoryAdvertisers />}
          {ownerTab === 'pawmates' && <PawMatesCommunity />}
          {(ownerTab === 'training' || ownerTab === 'training-games') && <PetTrainingAndGames />}
          {ownerTab === 'shelters' && <ShelterPortal />}
          {ownerTab === 'kennels' && <KennelDiscoveryOwnerView />}
          {ownerTab === 'complaints' && <ComplaintsSubmissionView />}
        </>
      )}

      {/* Dog Walker / Provider Experience */}
      {persona === 'walker' && (
        <>
          {walkerTab === 'home' && <UserCustomHomeHub />}
          {walkerTab === 'pack-hub' && <PackConnectHub />}
          {walkerTab === 'calendar' && <WalkerCalendarView />}
          {walkerTab === 'services-pricing' && <WalkerServicesPricing />}
          {walkerTab === 'credentials' && <CredentialDbsAudit />}
          {walkerTab === 'verify-upload' && <DbsVerificationUpload />}
          {walkerTab === 'subscriptions' && <SubscriptionPlans />}
        </>
      )}

      {/* Dog Kennels & Overnight Boarding Host Experience */}
      {persona === 'kennel' && (
        <>
          {kennelTab === 'home' ? <UserCustomHomeHub /> : <KennelPortal />}
        </>
      )}

      {/* Dog Shelter & Rescue Centre Portal (Multi-Staff & Public Rehoming) */}
      {persona === 'shelter' && (
        <>
          {shelterTab === 'home' ? <UserCustomHomeHub /> : <ShelterPortal />}
        </>
      )}

      {/* Platform Admin & Safety Operations (Restricted Exclusively to Sole Owner nicholaswaters1@gmail.com) */}
      {persona === 'admin' && isAuthorizedAdmin && (
        <>
          {adminTab === 'mobile-command' && <AdminMobileCommandCenter />}
          {adminTab === 'kpis' && <PlatformOverviewKpis />}
          {adminTab === 'operations' && <MarketplaceOverview />}
          {adminTab === 'compliance' && <ComplianceQueue />}
          {adminTab === 'incidents' && <IncidentResolution />}
          {adminTab === 'financials' && <CommissionEngine />}
          {adminTab === 'advertisers' && <LocalAdvertisersAdmin />}
          {adminTab === 'complaints' && <ComplaintsResolutionAdmin />}
        </>
      )}
    </main>
  );
};

const AppShell: React.FC = () => {
  const {
    setAiAssistantOpen,
    setAboutModalOpen,
    setLegalModalOpen,
    setLanguageModalOpen,
    setMobileDrawerOpen,
    setHowToUseModalOpen,
  } = useMarketplace();

  const [footerContactOpen, setFooterContactOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-50 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-900 font-sans relative">
      <OfflineConnectivityBanner />
      <Navbar />

      <div className="flex-1 w-full overflow-x-hidden">
        <MainContent />
      </div>

      {/* Permanent Bottom Navigation Bar with Home Button */}
      <MobileBottomNav onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

      {/* Floating Pawsy AI Assistant Quick Action */}
      <div className="fixed bottom-20 right-3 sm:right-6 z-30">
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0f5132] hover:bg-[#0c3e29] text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 border border-emerald-600/40 group cursor-pointer"
          title="Ask Pawsy - AI Canine Assistant"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs group-hover:rotate-12 transition-transform">
            🐾
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-tight leading-none text-white">Ask Pawsy</div>
            <div className="text-[10px] text-emerald-200 leading-none mt-1">Canine AI Assistant</div>
          </div>
        </button>
      </div>

      {/* Global Modals & Notifications */}
      <BookingCheckoutModal />
      <UniversalProfileEditorModal />
      <ToastContainer />
      <LanguagePickerModal />
      <LegalAndComplianceModal />
      <AboutUsModal />
      <PawsAiAssistantModal />
      <ShareWalkModal />
      <PolicySignUpAgreementModal />
      <HowToUseAppModal />
      <ContactUsModal
        isOpen={footerContactOpen}
        onClose={() => setFooterContactOpen(false)}
      />

      {/* Clean, Branded Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-10 pb-24 text-xs text-slate-500 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo variant="compact" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                £5M Public Liability Insurance
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Canine CPR & First Aid Protocol
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Local Dog-Friendly Venues & Vets Network
              </span>
            </div>

            <div className="text-slate-400 text-[11px]">
              © 2026 My Paws Walks. All rights reserved. Independent Marketplace Platform — My Paws Walks accepts no liability, responsibility, or claims for independent third-party pet services.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setAboutModalOpen(true)}
                className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>About Us & Mission</span>
              </button>

              <button
                onClick={() => setFooterContactOpen(true)}
                className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Contact Us — Mypawswalksdirect@gmail.com"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>Contact Us (Mypawswalksdirect@gmail.com)</span>
              </button>

              <button
                onClick={() => setHowToUseModalOpen(true)}
                className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 text-emerald-700" />
                <span>How to Use the App Video</span>
              </button>

              <button
                onClick={() => setLegalModalOpen(true)}
                className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>UK Legal Policies & Disclaimers</span>
              </button>

              <button
                onClick={() => setLanguageModalOpen(true)}
                className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1"
              >
                <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Language / Iaith (Cymraeg 🏴󠁧󠁢󠁷󠁬󠁳󠁿)</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              Operated in England & Wales · No Platform Liability / Claims Accepted · Google Play & App Store Ready
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'places']}>
        <AppShell />
      </APIProvider>
    </MarketplaceProvider>
  );
}

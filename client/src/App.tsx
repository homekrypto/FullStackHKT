import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { AppProvider } from "@/contexts/AppContext";
import AuthGuard from "@/components/auth-guard";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AIAssistant from "@/components/ai-assistant";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Home from "@/pages/home";
import HowItWorks from "@/pages/how-it-works";
import BuyHKT from "@/pages/buy-hkt";
import Dashboard from "@/pages/dashboard";
import OurMission from "@/pages/our-mission";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Profile from "@/pages/profile";
import EmailVerified from "@/pages/email-verified-simple";
import EmailVerification from "@/pages/EmailVerification";
import TermsAndConditions from "@/pages/terms-and-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import Whitepaper from "@/pages/whitepaper";
import FAQ from "@/pages/faq";
import WorkWithUs from "@/pages/work-with-us";
import Contact from "@/pages/contact";
import ForDevelopers from "@/pages/for-developers";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import PilotPropertyShowcase from "@/pages/pilot-property-showcase";
import Properties from "@/pages/properties";
import PropertiesWithRealData from "@/pages/PropertiesWithRealData";
import PropertyDetails from "@/pages/property-details";
import SecondaryMarket from "@/pages/secondary-market";
import Sitemap from "@/pages/sitemap";
import JobApplication from "@/pages/job-application";
import VerifyEmail from "@/pages/verify-email";
import EmailVerificationSuccess from "@/pages/email-verification-success";
import CrossChainWallets from "@/pages/cross-chain-wallets";
import RegisterAsAgent from "@/pages/register-as-agent";
import InvestmentGrowthProjection from "@/pages/investment-growth-projection";
import InvestmentSimulation from "@/pages/InvestmentSimulation";
import JoinWaitlist from "@/pages/join-waitlist";
import AgentRegistration from "@/pages/AgentRegistration";
import Agents from "@/pages/Agents";
import AdminAgentManagement from "@/pages/AdminAgentManagement";
import AdminUserManagement from "@/pages/AdminUserManagement";
import DownloadPage from "@/pages/download";
import SimpleBookingPage from "@/pages/SimpleBookingPage";
import AgentPage from "@/pages/AgentPage";
import EnhancedBookingPage from "@/pages/EnhancedBookingPage";
import AdminPanel from "@/pages/AdminPanel";
import TestAdmin from "@/pages/TestAdmin";
import PropertyManagement from "@/pages/PropertyManagement";
import Governance from "@/pages/governance";
import MainnetTesting from "@/pages/MainnetTesting";
import NotFound from "@/pages/not-found";

function Router() {
  useScrollToTop();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/our-mission" component={OurMission} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/homekrypto-whitepaper" component={Whitepaper} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/frequently-asked-questions" component={FAQ} />
      <Route path="/faq" component={FAQ} />
      <Route path="/work-with-us" component={WorkWithUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/for-developers" component={ForDevelopers} />
      <Route path="/pilot-property-showcase" component={PilotPropertyShowcase} />
      <Route path="/properties" component={PropertiesWithRealData} />
      <Route path="/properties-static" component={Properties} />
      <Route path="/property-details/:id" component={PropertyDetails} />
      <Route path="/booking/:propertyId?" component={EnhancedBookingPage} />
      <Route path="/secondary-market" component={SecondaryMarket} />
      <Route path="/sitemap" component={Sitemap} />
      <Route path="/job-application/:position?" component={JobApplication} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/cross-chain-wallets" component={CrossChainWallets} />
      <Route path="/register-as-agent" component={RegisterAsAgent} />
      <Route path="/investment-growth-projection" component={InvestmentGrowthProjection} />
      <Route path="/investment-simulation" component={InvestmentSimulation} />
      <Route path="/join-waitlist" component={JoinWaitlist} />
      <Route path="/agent-registration" component={AgentRegistration} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/:country/:slug" component={AgentPage} />
      <Route path="/agents/:slug" component={AgentPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-email" component={EmailVerified} />
      <Route path="/email-verification" component={EmailVerification} />
      <Route path="/email-verification-success" component={EmailVerificationSuccess} />
      <Route path="/buy-hkt" component={BuyHKT} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/governance" component={Governance} />
      <Route path="/mainnet-testing" component={MainnetTesting} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin/agents" component={AdminAgentManagement} />
      <Route path="/admin/users" component={AdminUserManagement} />
      <Route path="/admin/properties" component={PropertyManagement} />
      <Route path="/test-admin" component={TestAdmin} />
      <Route path="/download" component={DownloadPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const aiAssistant = useAIAssistant();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <TooltipProvider>
            <AuthGuard>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Navigation />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </div>
              <AIAssistant 
                isOpen={aiAssistant.isOpen}
                onToggle={aiAssistant.toggle}
                currentPage={aiAssistant.currentPage}
              />
              <Toaster />
            </AuthGuard>
          </TooltipProvider>
        </AppProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;

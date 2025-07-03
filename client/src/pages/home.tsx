import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, TrendingUp, Shield, Globe, UserPlus } from 'lucide-react';
import { useLocation } from 'wouter';
import SEO from '@/components/SEO';
import InteractiveHomepage from '@/components/InteractiveHomepage';

export default function Home() {
  const [, setLocation] = useLocation();
  const [showPlatformSelector, setShowPlatformSelector] = useState(true);

  if (!showPlatformSelector) {
    return <InteractiveHomepage />;
  }

  return (
    <>
      <SEO 
        title="Home Krypto Platform - Investment & Agent Management"
        description="Complete real estate platform combining crypto investment opportunities with professional agent management and networking tools."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Home Krypto Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your gateway to both crypto-powered real estate investment and professional agent management
            </p>
          </div>

          {/* Platform Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* HKT Investment Platform */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group" 
                  onClick={() => setShowPlatformSelector(false)}>
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">HKT Investment Platform</CardTitle>
                <CardDescription className="text-gray-300">
                  Invest in tokenized real estate through cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Blockchain-secured investments</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span>Global property portfolio</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building className="w-5 h-5 text-purple-400" />
                    <span>Fractional ownership from $100</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Explore Investment Platform
                </Button>
              </CardContent>
            </Card>

            {/* Agent Management System */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => setLocation('/agents')}>
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Agent Management System</CardTitle>
                <CardDescription className="text-gray-300">
                  Professional networking and agent directory platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <UserPlus className="w-5 h-5 text-green-400" />
                    <span>Agent registration & approval</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building className="w-5 h-5 text-blue-400" />
                    <span>Professional directory</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span>Country-based organization</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  View Agent Directory
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Navigation */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setLocation('/admin/agents')}>
              Admin Panel
            </Button>
            <Button variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setLocation('/register-as-agent')}>
              Register as Agent
            </Button>
            <Button variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setLocation('/dashboard')}>
              Dashboard
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-gray-400 text-sm mt-8 max-w-2xl mx-auto">
            This platform combines innovative crypto-based real estate investment with comprehensive 
            agent management tools, serving both investors and real estate professionals.
          </p>
        </div>
      </div>
    </>
  );
}
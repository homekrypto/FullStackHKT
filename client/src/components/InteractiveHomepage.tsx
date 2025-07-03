import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Building, Coins, Shield, TrendingUp, Globe, Users, Calculator } from "lucide-react";
import SEO from "@/components/SEO";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const InteractiveHomepage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [investmentDuration, setInvestmentDuration] = useState(36);
  const [hktPrice] = useState(0.10);
  const [propertyValue] = useState(200000);
  const [sharesPerProperty] = useState(52);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.fromTo(".hero-text", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
      );

      // Feature cards animation
      gsap.fromTo(".hero-feature", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2, delay: 0.8 }
      );

      // Section animations
      gsap.fromTo(".section-content", 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".section-content",
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const calculateTokens = () => {
    const totalInvestment = monthlyInvestment * investmentDuration;
    const tokens = totalInvestment / hktPrice;
    const sharePrice = propertyValue / sharesPerProperty;
    const tokensPerShare = sharePrice / hktPrice;
    const shares = tokens / tokensPerShare;
    return { totalInvestment, tokens, shares: Math.floor(shares * 100) / 100 };
  };

  const calc = calculateTokens();

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      <SEO 
        title="HKT - Revolutionizing Real Estate Investment"
        description="Invest in premium real estate through blockchain technology. Start with just $100 and own shares in luxury properties worldwide."
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">HKT</span>
              </div>
              <span className="text-white font-semibold text-lg">Home Krypto</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800" onClick={() => window.location.href = '/agents'}>
                Agents
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                Login
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-medium">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="hero-text">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              INVESTING IN REAL ESTATE
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              VIA CRYPTO
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-300">
              NEW WAY TO REAL PROFITS
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Own fractions of premium real estate properties through blockchain technology. 
              Start with just $100 and build your global property portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-medium">
                Start Investing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800" onClick={() => window.location.href = '/agents'}>
                View Agents Directory
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Also featuring comprehensive real estate agent management system
            </p>
          </div>
        </div>
      </section>

      {/* Property Share Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto section-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Property Share Calculator
            </h2>
            <p className="text-lg text-gray-400">
              Calculate how many HKT tokens you need to own property shares
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-500" />
                Investment Calculator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Based on $200,000 property value, 52 shares per property, HKT at $0.10
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="monthly" className="text-white">Monthly Investment ($)</Label>
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-white">Duration (months)</Label>
                    <Select value={investmentDuration.toString()} onValueChange={(value) => setInvestmentDuration(Number(value))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Your Investment Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Investment:</span>
                        <span className="text-orange-500 font-medium">${calc.totalInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">HKT Tokens:</span>
                        <span className="text-orange-500 font-medium">{calc.tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Property Shares:</span>
                        <span className="text-orange-500 font-medium">{calc.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Weekly Ownership:</span>
                        <span className="text-orange-500 font-medium">{calc.shares} weeks/year</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real Estate Investment Reimagined */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto section-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Real Estate Investment Reimagined
            </h2>
            <p className="text-lg text-gray-400">
              Traditional vs. HKT Investment Approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Traditional Real Estate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span>High minimum investment ($50,000+)</span>
                </div>
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span>Complex paperwork and legal processes</span>
                </div>
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span>Limited liquidity and slow transactions</span>
                </div>
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span>Geographic limitations</span>
                </div>
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-2xl">❌</span>
                  <span>High maintenance costs</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">HKT Investment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span>Start with just $100</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span>Instant blockchain transactions</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span>24/7 trading and high liquidity</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span>Global property access</span>
                </div>
                <div className="flex items-center gap-3 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span>No maintenance hassles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Introducing HKT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto section-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Introducing HKT Token
            </h2>
            <p className="text-lg text-gray-400">
              The future of real estate investment is here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hero-feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white">Blockchain Secured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Every transaction is secured by blockchain technology, ensuring transparency and immutability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hero-feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white">Fractional Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Own fractions of premium properties worldwide without the traditional barriers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hero-feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white">Smart Appreciation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Benefit from both property value appreciation and token price growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* One Token. Infinite Possibilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto section-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              One Token. Infinite Possibilities.
            </h2>
            <p className="text-lg text-gray-400">
              HKT opens doors to global real estate investment opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Buy HKT Tokens</h3>
                  <p className="text-gray-400">Purchase HKT tokens starting from $100 through our secure platform.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Choose Properties</h3>
                  <p className="text-gray-400">Select from our curated portfolio of premium global properties.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Earn Returns</h3>
                  <p className="text-gray-400">Receive rental income and benefit from property appreciation.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Current HKT Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Token Price:</span>
                  <span className="text-orange-500 font-bold">$0.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Properties Available:</span>
                  <span className="text-orange-500 font-bold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Value Locked:</span>
                  <span className="text-orange-500 font-bold">$3.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Investors:</span>
                  <span className="text-orange-500 font-bold">1,200+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center section-content">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of investors who are already building wealth through HKT
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-medium">
              Start Investing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Download Whitepaper
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveHomepage;
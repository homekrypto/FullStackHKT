import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Coins, Shield, TrendingUp, Globe, Users } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const InteractiveHomepage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple hero fade-in animation on page load
      gsap.fromTo(".hero-text", 
        { 
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2
        }
      );

      // Hero feature cards staggered animation
      gsap.fromTo(".hero-feature", 
        { 
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          delay: 0.8
        }
      );

      // Section 1 - HKT Token Introduction (slide from left)
      gsap.fromTo(".section-1-content", 
        { 
          x: "-100%", 
          opacity: 0 
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-1",
            start: "top 80%",
            end: "top 30%",
            scrub: 1
          }
        }
      );

      // Section 2 - Crypto Property Investment (slide from right)
      gsap.fromTo(".section-2-content", 
        { 
          x: "100%", 
          opacity: 0 
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-2",
            start: "top 80%",
            end: "top 30%",
            scrub: 1
          }
        }
      );

      // Section 3 - Fractional Ownership (scale and fade)
      gsap.fromTo(".section-3-content", 
        { 
          scale: 0.6, 
          opacity: 0,
          rotationY: 30
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-3",
            start: "top 80%",
            end: "top 30%",
            scrub: 1
          }
        }
      );

      // Features Section - Staggered animations
      gsap.fromTo(".feature-item", 
        { 
          y: 100, 
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            end: "top 40%",
            scrub: 1
          }
        }
      );

      // Floating animation for elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 -z-10" />
      
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="hero-text space-y-8 max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              INVESTING IN REAL ESTATE
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                VIA CRYPTO - NEW WAY
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                TO REAL PROFITS
              </span>
            </h1>
            
            {/* Supporting Text */}
            <p className="text-xl md:text-2xl text-white/80 font-light max-w-4xl mx-auto leading-relaxed">
              Why wait for "someday" when you can start building your property portfolio{" "}
              <span className="text-white font-semibold">right now?</span>{" "}
              HKT makes premium real estate accessible to everyone.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="hero-feature flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">Live Properties Available</span>
              </div>
              <div className="hero-feature flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white text-sm">Blockchain Secured</span>
              </div>
              <div className="hero-feature flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white text-sm">Start from $100</span>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start Investing Now
              </Button>
              <Button variant="outline" size="lg" className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 px-8 py-4 text-lg">
                Learn More →
              </Button>
            </div>
            
            {/* Three Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="hero-feature p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Start Small</h3>
                <p className="text-gray-300 text-sm">Begin with amounts that fit your budget</p>
              </div>
              
              <div className="hero-feature p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Own Globally</h3>
                <p className="text-gray-300 text-sm">Access premium properties worldwide</p>
              </div>
              
              <div className="hero-feature p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Stay Secure</h3>
                <p className="text-gray-300 text-sm">Blockchain technology ensures transparency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Share Calculator Section */}
      <section className="min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Calculator Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm mb-6">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-medium">Property Share Calculator</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Calculate how to acquire 1 week of property ownership through HKT tokens
              </h2>
            </div>

            {/* Calculator Interface */}
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              {/* Input Fields */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Property Value ($)</label>
                  <input 
                    type="text" 
                    value="200,000" 
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Accumulation Period (months)</label>
                  <input 
                    type="text" 
                    value="12" 
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-2">Value per Share (1 Week)</div>
                  <div className="text-blue-400 text-3xl font-bold">$3846,15</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-2">Monthly HKT Purchase</div>
                  <div className="text-green-400 text-3xl font-bold">3205 HKT</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-2">Total HKT Tokens Needed</div>
                  <div className="text-green-400 text-3xl font-bold">38 461,5 HKT</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-slate-400 text-sm mb-2">Monthly USD Investment</div>
                  <div className="text-green-400 text-3xl font-bold">$320,51</div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
                <h3 className="text-white text-lg font-semibold mb-4">12-Month Investment Plan Summary</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Property Value:</span>
                      <span className="text-white font-medium">$200 000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current HKT Price:</span>
                      <span className="text-white font-medium">$0,10</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Shares:</span>
                      <span className="text-white font-medium">52 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Investment:</span>
                      <span className="text-white font-medium">$3846,15</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center text-slate-400 text-sm">
                  * Calculations assume stable HKT price of $0.10. Actual token price may fluctuate.<br />
                  This calculator is for illustrative purposes only and does not constitute financial advice.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Investment Reimagined Section */}
      <section ref={section1Ref} className="section-1 min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="section-1-content max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Real Estate Investment
                <br />
                <span className="text-gray-400 font-light">Reimagined</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We believe everyone deserves access to premium real estate opportunities.
                <br />
                That's why we created HKT.
              </p>
            </div>

            {/* Two Column Comparison */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* The Old Way */}
              <div className="space-y-8">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                  THE OLD WAY
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
                  Why real estate felt{" "}
                  <span className="text-red-400">out of reach</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Massive Capital Requirements</h4>
                        <p className="text-gray-400 text-sm">Need $50K+ down payments just to start</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Geographic Limitations</h4>
                        <p className="text-gray-400 text-sm">Stuck with local markets only</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Complex Processes</h4>
                        <p className="text-gray-400 text-sm">Months of paperwork and legal hurdles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* The HKT Way */}
              <div className="space-y-8">
                <div className="text-xs font-medium text-green-400 uppercase tracking-wide mb-4">
                  THE HKT WAY
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-8">
                  How we make it{" "}
                  <span className="text-green-400">accessible</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Start with $100</h4>
                        <p className="text-gray-400 text-sm">Fractional ownership makes it affordable</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Global Portfolio</h4>
                        <p className="text-gray-400 text-sm">Premium properties in top destinations</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">One-Click Investment</h4>
                        <p className="text-gray-400 text-sm">Digital-first, blockchain-secured</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing HKT Section */}
      <section ref={section2Ref} className="section-2 min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="section-2-content max-w-6xl mx-auto text-center">
            {/* Header */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-8">
                <span className="text-white font-medium">Introducing HKT</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-light text-white mb-8 leading-tight">
                The Token That
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent font-medium">
                  Unlocks Everything
                </span>
              </h2>
              
              <p className="text-2xl md:text-3xl text-gray-300 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
                HKT isn't just a token. It's your key to a world where premium real estate 
                is no longer reserved for the wealthy few.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Blockchain Secured</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every transaction is transparent, immutable, and secured by 
                  cutting-edge blockchain technology.
                </p>
              </div>

              <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mb-6 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Instant Liquidity</h3>
                <p className="text-gray-400 leading-relaxed">
                  Trade your property shares instantly, without the typical 3-6 
                  month real estate transaction cycles.
                </p>
              </div>

              <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl mb-6 flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Global Access</h3>
                <p className="text-gray-400 leading-relaxed">
                  Own pieces of premium properties from Punta Cana to Miami, all from 
                  your smartphone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One Token. Infinite Possibilities Section */}
      <section ref={section3Ref} className="section-3 min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="section-3-content max-w-6xl mx-auto text-center">
            {/* Header */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-8">
                <span className="text-white font-medium">Powered by HKT</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-light text-white mb-8 leading-tight">
                One Token.
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                  Infinite Possibilities.
                </span>
              </h2>
              
              <p className="text-2xl md:text-3xl text-gray-300 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
                HKT isn't just another cryptocurrency. It's your passport to a world
                <br />
                where <span className="text-white font-semibold">every property is within reach</span>.
              </p>
            </div>

            {/* Two Feature Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 text-left">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Verified Ownership</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every HKT token represents verified ownership in real properties, secured by blockchain technology 
                  that can't be faked or manipulated.
                </p>
              </div>

              <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 text-left">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Trade Instantly</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sell your property shares in seconds, not months. HKT transforms real estate from the most illiquid 
                  asset to the most liquid.
                </p>
              </div>
            </div>

            {/* Discover HKT Button */}
            <div className="text-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                Discover HKT →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Home Krypto Section */}
      <section ref={featuresRef} className="features-section min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                Why Choose Home Krypto? The Advantages of HKT.
              </h2>
            </div>

            {/* Four Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="feature-item p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Affordable Start</h3>
                <p className="text-gray-400 text-sm">Invest with what you can afford...</p>
              </div>

              <div className="feature-item p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Simplified Process</h3>
                <p className="text-gray-400 text-sm">Our goal is a clear, straightforward way...</p>
              </div>

              <div className="feature-item p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Access (Our Vision)</h3>
                <p className="text-gray-400 text-sm">Explore diverse property opportunities...</p>
              </div>

              <div className="feature-item p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Transparent</h3>
                <p className="text-gray-400 text-sm">Your ownership is planned to be recorded securely...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Future Starts Today Section */}
      <section className="min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-7xl font-light text-white leading-tight">
              Your Future
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Starts Today
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Stop waiting for "someday." Stop watching from the sidelines.
              <br />
              <span className="text-white font-semibold">Your property portfolio begins now.</span>
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">Properties Available Now</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white text-sm">100% Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-white text-sm">Start from $100</span>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-6 text-xl">
                Start Investing
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl">
                Join Waitlist
              </Button>
            </div>
            
            <p className="text-gray-400 text-sm mt-8 max-w-3xl mx-auto">
              Join thousands who are already building their real estate portfolios the smart way. Early access available 
              for waitlist members.
            </p>
          </div>
        </div>
      </section>

      {/* Property Investment Destination Section */}
      <section className="min-h-screen flex items-center relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 rounded-full mb-8">
                <span className="text-white font-medium">Live Properties</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                Your Next
                <br />
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-medium">
                  Investment Destination
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Don't just dream about owning that perfect vacation home.{" "}
                <span className="text-white font-semibold">Start today.</span>
              </p>
            </div>

            {/* Property Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cap Cana Property */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Marvelous Cap Cana Condo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Marvelous Cap Cana Condo (Our Pilot Focus)</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Luxury 2-Bed/2-Bath condo in Ciudad Las Canas. High rental demand (80-85% occupancy) 
                    in a prime Dominican Republic tourist hub.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-white text-sm">Investment Options (Illustrative):</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-400 text-xs">Own a "Week-Share":</span>
                        <div className="text-green-400 font-semibold">~$3,750 USD (approx. 37,500 HKT @ $0.10)</div>
                        <div className="text-gray-300 text-xs">Your annual getaway + rental income.</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">Start Investing Monthly with HKT:</span>
                        <div className="text-green-400 font-semibold">From ~$100 - $200 USD / month</div>
                        <div className="text-gray-300 text-xs">Accumulate HKT for your share.</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    View Property Details →
                  </Button>
                </div>
              </div>

              {/* Miami Property */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 overflow-hidden">
                <div className="aspect-video bg-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 font-semibold">PHOTO</div>
                    <div className="text-gray-400 font-semibold">COMING SOON</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Vibrant Miami Condo (Coming Soon!)</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Status: Under planning with developers. Experience the allure of Miami, Florida! 
                    This upcoming HKT opportunity targets properties ideal for the dynamic 
                    short-term rental market, aiming for 90-95% rental occupancy.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-white text-sm">Anticipated Investment Options:</h4>
                    <div>
                      <span className="text-gray-400 text-xs">Own a Full Share (Conceptual):</span>
                      <div className="text-blue-400 font-semibold">~$3,846 USD (Based on $200K value / 52 shares)</div>
                      <div className="text-gray-300 text-xs">Invest in Miami's thriving property scene.</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-600 text-slate-400" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>

              {/* Madrid Property */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 overflow-hidden">
                <div className="aspect-video bg-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 font-semibold">PHOTO</div>
                    <div className="text-gray-400 font-semibold">COMING SOON</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Chic Madrid Residence (Coming Soon!)</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Status: Under planning with European developers. An elegant 
                    residence planned for a sought-after Madrid neighborhood, targeting 90-95% rental occupancy.
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-white text-sm">Anticipated Investment Options:</h4>
                    <div>
                      <span className="text-gray-400 text-xs">Own a Full Share (Conceptual):</span>
                      <div className="text-purple-400 font-semibold">~$3,846 USD (Based on $200K value / 52 shares)</div>
                      <div className="text-gray-300 text-xs">Invest in Spain's vibrant capital lifestyle.</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-600 text-slate-400" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center mt-16">
              <h3 className="text-3xl md:text-4xl font-light text-white mb-8">
                The Future of Real Estate
                <br />
                <span className="text-green-400 font-semibold">Starts Now</span>
              </h3>
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
                Cap Cana is just the beginning. Miami, Madrid, and beyond—we're building a global 
                portfolio that puts premium real estate within everyone's reach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4">
                  Explore Properties
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4">
                  Join Waitlist →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveHomepage;
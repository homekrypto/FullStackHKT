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
      // Hero Section Animation - Text scaling and movement
      gsap.fromTo(".hero-main-text", 
        { 
          scale: 0.8, 
          opacity: 0.7,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top center",
            end: "bottom center",
            scrub: 1
          }
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

      // Background parallax effect
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

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
      {/* Parallax Background */}
      <div className="parallax-bg fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 -z-10" />
      
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 text-center">
          <div ref={heroTextRef} className="hero-main-text space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              HKT
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-white/90 max-w-4xl mx-auto">
              Investing in Real Estate Via Crypto
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 font-light max-w-3xl mx-auto">
              The Future of Property Investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg floating-element">
                Start Investing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 - HKT Token Introduction */}
      <section ref={section1Ref} className="section-1 min-h-screen flex items-center relative">
        <div className="container mx-auto px-4">
          <div className="section-1-content grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Revolutionary
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tokenized Real Estate
                </span>
              </h3>
              <p className="text-xl text-blue-200 leading-relaxed">
                HKT tokens represent fractional ownership in premium real estate properties. 
                Invest in global properties with cryptocurrency, starting from just $100.
              </p>
              <div className="flex items-center gap-6">
                <div className="floating-element">
                  <Coins className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">$0.10</p>
                  <p className="text-blue-300">Per HKT Token</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="floating-element">
                <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <Building className="w-24 h-24 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Crypto Property Investment */}
      <section ref={section2Ref} className="section-2 min-h-screen flex items-center relative">
        <div className="container mx-auto px-4">
          <div className="section-2-content grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="floating-element">
                <div className="w-full h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-white/60" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Global Properties
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Accessible to Everyone
                </span>
              </h3>
              <p className="text-xl text-purple-200 leading-relaxed">
                Access premium real estate markets worldwide. From luxury villas in Cap Cana 
                to modern apartments in Miami and Madrid. All tokenized for easy investment.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">200+</p>
                  <p className="text-purple-300">Properties</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">15</p>
                  <p className="text-purple-300">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Fractional Ownership */}
      <section ref={section3Ref} className="section-3 min-h-screen flex items-center relative">
        <div className="container mx-auto px-4 text-center">
          <div className="section-3-content space-y-12">
            <h3 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Fractional Ownership
              </span>
              <span className="block text-3xl md:text-4xl font-light text-white/80 mt-4">
                Made Simple
              </span>
            </h3>
            <p className="text-xl text-green-200 leading-relaxed max-w-4xl mx-auto">
              Own a piece of premium real estate without the traditional barriers. 
              Buy shares, earn rental income, and trade your ownership stakes on our platform.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="floating-element space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white">Instant Liquidity</h4>
                <p className="text-green-200">Trade your property shares anytime on our marketplace</p>
              </div>
              <div className="floating-element space-y-4" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white">Secure Ownership</h4>
                <p className="text-blue-200">Blockchain-verified ownership certificates</p>
              </div>
              <div className="floating-element space-y-4" style={{ animationDelay: '1s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white">Community Driven</h4>
                <p className="text-purple-200">Join thousands of global property investors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section min-h-screen flex items-center relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                HKT Platform
              </span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                description: "Smart contracts ensure transparent and secure property transactions"
              },
              {
                icon: TrendingUp,
                title: "High Returns",
                description: "Average 15% annual returns on tokenized real estate investments"
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Invest in properties worldwide from your digital wallet"
              },
              {
                icon: Coins,
                title: "Low Entry Barrier",
                description: "Start investing with as little as $100 in HKT tokens"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-item p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 text-center space-y-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="floating-element">
                  <feature.icon className="w-12 h-12 text-blue-400 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                <p className="text-blue-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Investment Journey?
              </span>
            </h3>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of investors who are already building wealth through tokenized real estate. 
              Start with just $100 and watch your portfolio grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-12 py-6 text-xl floating-element">
                Start Investing Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl">
                View Properties
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveHomepage;
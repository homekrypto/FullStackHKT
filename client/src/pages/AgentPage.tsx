import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Award, 
  Calendar,
  Languages,
  Building,
  Coins,
  TrendingUp,
  Shield,
  ArrowRight
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

interface AgentPage {
  id: number;
  agentId: number;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  pageContent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  agent: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    licenseNumber: string;
    licenseState: string;
    city: string;
    state: string;
    country: string;
    website?: string;
    linkedIn?: string;
    bio: string;
    specializations: string[];
    yearsExperience: number;
    languagesSpoken: string[];
    profileImage?: string;
    referralLink: string;
    status: string;
    isApproved: boolean;
    totalSales: string;
    totalCommission: string;
  };
}

async function fetchAgentPage(slug: string): Promise<AgentPage> {
  const response = await fetch(`/api/agent-page/${slug}`);
  if (!response.ok) {
    throw new Error('Agent page not found');
  }
  return response.json();
}

export default function AgentPage() {
  const { slug, country } = useParams() as { slug: string; country?: string };
  
  // Handle both /agents/:slug and /agents/:country/:slug
  const fullSlug = country ? `${country}/${slug}` : slug;
  
  const { data: agentPage, isLoading, error } = useQuery({
    queryKey: [`/api/agent-page/${fullSlug}`],
    queryFn: () => fetchAgentPage(fullSlug),
    enabled: !!fullSlug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !agentPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Agent Not Found</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">The agent page you're looking for doesn't exist.</p>
            <Button asChild>
              <a href="/agents">View All Agents</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { agent } = agentPage;

  const cryptoServices = [
    {
      icon: Coins,
      title: "Cryptocurrency Property Investment",
      description: "Expert guidance on investing in real estate using Bitcoin, Ethereum, and HKT tokens"
    },
    {
      icon: TrendingUp,
      title: "HKT Token Portfolio Management",
      description: "Strategic management of your HomeKrypto token investments and property shares"
    },
    {
      icon: Shield,
      title: "Secure Blockchain Transactions",
      description: "Safe and transparent property transactions using smart contracts and escrow"
    },
    {
      icon: Building,
      title: "Fractional Real Estate Ownership",
      description: "Access premium properties through tokenized fractional ownership starting at $100"
    }
  ];

  return (
    <>
      <Helmet>
        <title>{agentPage.seoTitle}</title>
        <meta name="description" content={agentPage.seoDescription} />
        <meta name="keywords" content={agentPage.seoKeywords} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={agentPage.seoTitle} />
        <meta property="og:description" content={agentPage.seoDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://homekrypto.com/agents/${slug}`} />
        <meta property="og:image" content={agent.profileImage || "https://homekrypto.com/og-agent-default.jpg"} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={agentPage.seoTitle} />
        <meta name="twitter:description" content={agentPage.seoDescription} />
        <meta name="twitter:image" content={agent.profileImage || "https://homekrypto.com/og-agent-default.jpg"} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": `${agent.firstName} ${agent.lastName}`,
            "givenName": agent.firstName,
            "familyName": agent.lastName,
            "email": agent.email,
            "telephone": agent.phone,
            "url": `https://homekrypto.com/agents/${slug}`,
            "image": agent.profileImage || "https://homekrypto.com/og-agent-default.jpg",
            "jobTitle": "Crypto & Real Estate Investment Expert",
            "worksFor": {
              "@type": "Organization",
              "name": agent.company,
              "url": agent.website
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": agent.city,
              "addressRegion": agent.state,
              "addressCountry": agent.country
            },
            "sameAs": [
              agent.website,
              agent.linkedIn
            ].filter(Boolean),
            "description": agent.bio,
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Real Estate License",
              "recognizedBy": {
                "@type": "State",
                "name": agent.licenseState
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className="relative">
                    {agent.profileImage ? (
                      <img 
                        src={agent.profileImage} 
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {agent.firstName[0]}{agent.lastName[0]}
                      </div>
                    )}
                    <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600">
                      Verified Agent
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {agent.firstName} {agent.lastName}
                    </CardTitle>
                    <CardDescription className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                      Crypto & Real Estate Investment Expert
                    </CardDescription>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                      {agent.company}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {agent.specializations?.map((spec) => (
                      <Badge key={spec} variant="secondary" className="px-3 py-1">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              
              {/* Contact Information */}
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${agent.email}`} className="text-blue-600 hover:underline">
                      {agent.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${agent.phone}`} className="text-blue-600 hover:underline">
                      {agent.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {agent.city}, {agent.state}
                    </span>
                  </div>
                  {agent.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a href={agent.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  {agent.linkedIn && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-4 w-4 text-gray-500" />
                      <a href={agent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <Button className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact {agent.firstName}
                  </Button>
                </CardContent>
              </Card>

              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Professional Credentials */}
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      Professional Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">License Number</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{agent.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">License State</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{agent.licenseState}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Years of Experience</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{agent.yearsExperience} years</p>
                      </div>
                      {agent.languagesSpoken?.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Languages Spoken</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {agent.languagesSpoken.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* About */}
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
                  <CardHeader>
                    <CardTitle>About {agent.firstName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {agent.bio || `${agent.firstName} ${agent.lastName} is a professional real estate agent specializing in cryptocurrency-based property investments through the HomeKrypto platform.`}
                    </p>
                  </CardContent>
                </Card>

                {/* Crypto Real Estate Services */}
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
                  <CardHeader>
                    <CardTitle>Crypto Real Estate Investment Services</CardTitle>
                    <CardDescription>
                      Partner with {agent.firstName} to invest in premium real estate using cryptocurrency through the HomeKrypto platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {cryptoServices.map((service, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <service.icon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {service.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ready to Invest?</h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Contact {agent.firstName} directly or visit HomeKrypto.com to start your crypto real estate investment journey today.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild>
                          <a href={`mailto:${agent.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact {agent.firstName}
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="https://homekrypto.com">
                            Visit HomeKrypto
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
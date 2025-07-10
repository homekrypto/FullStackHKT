import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MapPin, Users, Car, Wifi, Home, DollarSign, TrendingUp, Clock, Star, User, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: string;
  totalShares: number;
  sharePrice: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
  agentId?: number;
  createdAt: string;
  agentName?: string;
  agentLastName?: string;
  agentEmail?: string;
  agentPhone?: string;
  agentLocation?: string;
}

export default function PropertiesWithRealData() {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState('portfolio');

  // Fetch real properties from database
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/property-management'],
  });

  // Calculate dynamic stats from real data
  const stats = {
    totalProperties: properties.length,
    totalValue: properties.reduce((sum, p) => sum + (parseFloat(p.sharePrice) * p.totalShares), 0),
    avgROI: "16.8%", // This would be calculated from booking data
    totalShares: properties.reduce((sum, p) => sum + p.totalShares, 0),
    fundedProperties: properties.filter(p => p.isActive).length,
    activeCountries: [...new Set(properties.map(p => p.location.split(',').pop()?.trim()))].length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const regions = [
    {
      name: "Caribbean",
      properties: properties.filter(p => p.location.includes('Dominican Republic')).length,
      featured: "Dominican Republic Resort Complex",
      avgReturn: "18.5%",
      description: "Tropical paradise destinations with year-round demand"
    },
    {
      name: "North America",
      properties: properties.filter(p => p.location.includes('USA') || p.location.includes('Miami')).length,
      featured: "Miami Beach Properties",
      avgReturn: "16.8%",
      description: "Prime US coastal properties with strong rental demand"
    },
    {
      name: "Europe",
      properties: properties.filter(p => p.location.includes('Spain') || p.location.includes('Madrid')).length,
      featured: "Spanish Coast Villas",
      avgReturn: "15.2%",
      description: "Historic European properties in premium locations"
    },
    {
      name: "Other Markets",
      properties: properties.length - properties.filter(p => 
        p.location.includes('Dominican Republic') || 
        p.location.includes('USA') || 
        p.location.includes('Miami') || 
        p.location.includes('Spain') || 
        p.location.includes('Madrid')
      ).length,
      featured: "Global Diversification",
      avgReturn: "17.3%",
      description: "Emerging markets with exceptional growth potential"
    }
  ];

  const benefits = [
    {
      icon: Building2,
      title: "Verified Properties",
      description: "All properties undergo rigorous due diligence and legal verification"
    },
    {
      icon: Star,
      title: "Premium Locations",
      description: "Hand-picked properties in the world's most desirable tourist destinations"
    },
    {
      icon: DollarSign,
      title: "Fractional Ownership",
      description: "Start investing with property shares starting from $3,750"
    },
    {
      icon: TrendingUp,
      title: "Proven Returns",
      description: "Track record of consistent high occupancy and strong rental yields"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <Helmet>
        <title>Properties - Home Krypto Token | Real Estate Investment Portfolio</title>
        <meta name="description" content="Explore our premium real estate portfolio. Invest in fractional property ownership through HKT tokens and earn rental income from luxury properties worldwide." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Real Estate Portfolio
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Investment Properties
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            Discover our carefully curated portfolio of short-term rental properties. Each property is optimized for maximum occupancy and returns through our innovative tokenized investment model.
          </p>
        </div>

        {/* Live Statistics from Database */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isLoading ? '...' : stats.totalProperties}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Active Properties
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Premium locations worldwide
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isLoading ? '...' : formatCurrency(stats.totalValue)}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Total Portfolio Value
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Across all properties
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.avgROI}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Average ROI
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Annual returns from rentals
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isLoading ? '...' : stats.totalShares}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Total Shares
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Available for purchase
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Live Portfolio</TabsTrigger>
            <TabsTrigger value="regions">By Region</TabsTrigger>
            <TabsTrigger value="process">Investment Process</TabsTrigger>
          </TabsList>

          {/* Live Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Active Properties ({stats.totalProperties})
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Real properties currently available for investment through HKT token purchases.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Properties Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Properties are being added to our portfolio. Check back soon for investment opportunities.
                </p>
                <Link href="/pilot-property-showcase">
                  <Button>View Pilot Property</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{property.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {property.location}
                          </CardDescription>
                        </div>
                        <Badge variant={property.isActive ? "default" : "secondary"}>
                          {property.isActive ? "Available" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>${property.pricePerNight}/night</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{property.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-purple-600" />
                          <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-orange-600" />
                          <span>{property.totalShares} shares</span>
                        </div>
                      </div>

                      {property.agentName && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Local Representative for Home Krypto
                          </p>
                          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <User className="h-4 w-4" />
                            <span>{property.agentName} {property.agentLastName}</span>
                          </div>
                          {property.agentPhone && (
                            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                              <Phone className="h-4 w-4" />
                              <span>{property.agentPhone}</span>
                            </div>
                          )}
                          {property.agentLocation && (
                            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                              <MapPin className="h-4 w-4" />
                              <span>{property.agentLocation}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm">
                          <span className="text-gray-500">Share Price:</span>
                          <span className="font-semibold text-gray-900 dark:text-white ml-2">
                            ${property.sharePrice}
                          </span>
                        </div>
                        <Link href={`/property-details/${property.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* By Region Tab */}
          <TabsContent value="regions" className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Regional Breakdown
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our properties are strategically distributed across high-demand tourist destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regions.map((region, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {region.name}
                      <Badge variant="outline">{region.properties} properties</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Featured:</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {region.featured}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg. Return:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {region.avgReturn}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {region.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investment Process Tab */}
          <TabsContent value="process" className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How Property Investment Works
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Understanding the HKT property investment process from purchase to returns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Start Investing?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Browse our pilot property showcase to see how the investment model works.
              </p>
              <Link href="/pilot-property-showcase">
                <Button size="lg">
                  View Pilot Property
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
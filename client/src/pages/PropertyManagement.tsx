import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, Edit, Trash2, Eye, DollarSign, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminRoute from '@/components/admin-route';

const propertySchema = z.object({
  id: z.string().min(1, 'Property ID is required'),
  name: z.string().min(1, 'Property name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  pricePerNight: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  totalShares: z.number().min(1).max(52, 'Total shares must be between 1-52'),
  sharePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid share price format'),
  maxGuests: z.number().min(1, 'Must allow at least 1 guest'),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
  bathrooms: z.number().min(1, 'Must have at least 1 bathroom'),
  amenities: z.string().optional(),
  images: z.string().optional(),
  isActive: z.boolean().default(true),
  agentId: z.number().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

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

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
}

export default function PropertyManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: '',
      name: '',
      location: '',
      description: '',
      pricePerNight: '',
      totalShares: 52,
      sharePrice: '',
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      amenities: '',
      images: '',
      isActive: true,
      agentId: undefined,
    },
  });

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/property-management'],
  });

  // Fetch approved agents for dropdown
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['/api/property-management/agents/approved'],
  });

  // Create property mutation
  const createProperty = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const propertyData = {
        ...data,
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()) : [],
        images: data.images ? data.images.split(',').map(i => i.trim()) : [],
      };
      
      const response = await fetch('/api/property-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create property');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/property-management'] });
      setIsCreateDialogOpen(false);
      setEditingProperty(null);
      form.reset();
      toast({
        title: 'Property Created',
        description: 'Property has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      if (!editingProperty) throw new Error('No property selected for editing');
      
      const propertyData = {
        ...data,
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()) : [],
        images: data.images ? data.images.split(',').map(i => i.trim()) : [],
      };
      
      const response = await fetch(`/api/property-management/${editingProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update property');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/property-management'] });
      setIsCreateDialogOpen(false);
      setEditingProperty(null);
      form.reset();
      toast({
        title: 'Property Updated',
        description: 'Property has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  // Delete property mutation
  const deleteProperty = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/property-management/${propertyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete property');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/property-management'] });
      toast({
        title: 'Property Deleted',
        description: 'Property has been deactivated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  const handleCreateProperty = () => {
    setEditingProperty(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    form.reset({
      id: property.id,
      name: property.name,
      location: property.location,
      description: property.description,
      pricePerNight: property.pricePerNight,
      totalShares: property.totalShares,
      sharePrice: property.sharePrice,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      amenities: property.amenities.join(', '),
      images: property.images.join(', '),
      isActive: property.isActive,
      agentId: property.agentId,
    });
    setIsCreateDialogOpen(true);
  };

  const onSubmit = (data: PropertyFormData) => {
    if (editingProperty) {
      updateProperty.mutate(data);
    } else {
      createProperty.mutate(data);
    }
  };

  return (
    <AdminRoute>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Property Management
            </h1>
            <p className="text-muted-foreground">
              Manage your real estate portfolio and property listings
            </p>
          </div>
          <Button onClick={handleCreateProperty} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Property
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first property to start managing your real estate portfolio.
              </p>
              <Button onClick={handleCreateProperty}>
                <Plus className="h-4 w-4 mr-2" />
                Create Property
              </Button>
            </div>
          ) : (
            properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {property.location}
                      </CardDescription>
                    </div>
                    <Badge variant={property.isActive ? 'default' : 'secondary'}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${property.pricePerNight}/night</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{property.maxGuests} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Shares:</span>
                        <span className="font-medium">{property.totalShares}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Share Price:</span>
                        <span className="font-medium">${property.sharePrice}</span>
                      </div>
                      {property.agentName && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Agent:</span>
                          <span className="font-medium text-xs">
                            {property.agentName} {property.agentLastName}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProperty.mutate(property.id)}
                        className="flex-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Property Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Edit Property' : 'Create New Property'}
              </DialogTitle>
              <DialogDescription>
                {editingProperty 
                  ? 'Update property details and settings.'
                  : 'Add a new property to your portfolio.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Property ID</Label>
                  <Input
                    id="id"
                    {...form.register('id')}
                    disabled={!!editingProperty}
                    placeholder="unique-property-id"
                  />
                  {form.formState.errors.id && (
                    <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Luxury Villa"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="Cap Cana, Dominican Republic"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Stunning oceanfront villa with private pool..."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerNight">Price per Night (USD)</Label>
                  <Input
                    id="pricePerNight"
                    {...form.register('pricePerNight')}
                    placeholder="450.00"
                  />
                  {form.formState.errors.pricePerNight && (
                    <p className="text-sm text-destructive">{form.formState.errors.pricePerNight.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sharePrice">Share Price (USD)</Label>
                  <Input
                    id="sharePrice"
                    {...form.register('sharePrice')}
                    placeholder="3750.00"
                  />
                  {form.formState.errors.sharePrice && (
                    <p className="text-sm text-destructive">{form.formState.errors.sharePrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalShares">Total Shares</Label>
                  <Input
                    id="totalShares"
                    type="number"
                    {...form.register('totalShares', { valueAsNumber: true })}
                    placeholder="52"
                  />
                  {form.formState.errors.totalShares && (
                    <p className="text-sm text-destructive">{form.formState.errors.totalShares.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Max Guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    {...form.register('maxGuests', { valueAsNumber: true })}
                    placeholder="8"
                  />
                  {form.formState.errors.maxGuests && (
                    <p className="text-sm text-destructive">{form.formState.errors.maxGuests.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    {...form.register('bedrooms', { valueAsNumber: true })}
                    placeholder="4"
                  />
                  {form.formState.errors.bedrooms && (
                    <p className="text-sm text-destructive">{form.formState.errors.bedrooms.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...form.register('bathrooms', { valueAsNumber: true })}
                    placeholder="3"
                  />
                  {form.formState.errors.bathrooms && (
                    <p className="text-sm text-destructive">{form.formState.errors.bathrooms.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  {...form.register('amenities')}
                  placeholder="Pool, Beach Access, WiFi, Kitchen, Parking"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input
                  id="images"
                  {...form.register('images')}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentId">Assign Agent (Optional)</Label>
                <Select
                  value={form.watch('agentId')?.toString() || ''}
                  onValueChange={(value) => {
                    form.setValue('agentId', value ? parseInt(value) : undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No agent assigned</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.firstName} {agent.lastName} - {agent.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Agent will be displayed as "Local Representative for Home Krypto"
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Property</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProperty.isPending || updateProperty.isPending}
                  className="flex-1"
                >
                  {createProperty.isPending || updateProperty.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminRoute>
  );
}
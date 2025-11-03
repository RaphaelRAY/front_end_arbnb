'use client';

import type { PredictionInput } from '@/lib/schemas';
import {
  Activity, Bath, BedDouble, Briefcase, Building, Calendar, Clock, Globe, Hash, Home, Image as ImageIcon, Lightbulb, Loader2, MapPin, Percent, ShieldCheck, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';

interface PredictionFormProps {
  neighbourhoods: string[];
  propertyTypes: string[];
  form: any;
  onSubmit: (data: PredictionInput) => void;
  isSubmitting: boolean;
}


const formFields: { name: keyof Omit<PredictionInput, 'api_url' |'room_type' | 'host_response_time' | 'host_has_profile_pic' | 'host_identity_verified' | 'has_availability' | 'neighbourhood_cleansed' | 'property_type'>; label: string; icon: React.ElementType; placeholder: string; type?: string }[] = [
  { name: 'latitude', label: 'Latitude', icon: MapPin, placeholder: 'e.g., -22.9697', type: 'number' },
  { name: 'longitude', label: 'Longitude', icon: MapPin, placeholder: 'e.g., -43.1869', type: 'number' },
  { name: 'accommodates', label: 'Accommodates', icon: Users, placeholder: 'e.g., 4', type: 'number' },
  { name: 'bathrooms', label: 'Bathrooms', icon: Bath, placeholder: 'e.g., 2', type: 'number' },
  { name: 'bedrooms', label: 'Bedrooms', icon: BedDouble, placeholder: 'e-g., 3', type: 'number' },
  { name: 'beds', label: 'Beds', icon: BedDouble, placeholder: 'e.g., 3', type: 'number' },
  { name: 'host_response_rate', label: 'Host Response Rate', icon: Percent, placeholder: '0-100', type: 'number' },
  { name: 'host_acceptance_rate', label: 'Host Acceptance Rate', icon: Percent, placeholder: '0-100', type: 'number' },
  { name: 'host_listings_count', label: 'Host Listings', icon: Hash, placeholder: 'e.g., 1', type: 'number' },
  { name: 'host_total_listings_count', label: 'Host Total Listings', icon: Hash, placeholder: 'e.g., 1', type: 'number' },
  { name: 'minimum_nights', label: 'Minimum Nights', icon: Calendar, placeholder: 'e.g., 1', type: 'number' },
  { name: 'maximum_nights', label: 'Maximum Nights', icon: Calendar, placeholder: 'e.g., 30', type: 'number' },
  { name: 'minimum_minimum_nights', label: 'Min Minimum Nights', icon: Calendar, placeholder: 'e.g., 1', type: 'number' },
  { name: 'maximum_minimum_nights', label: 'Max Minimum Nights', icon: Calendar, placeholder: 'e.g., 1', type: 'number' },
  { name: 'minimum_maximum_nights', label: 'Min Maximum Nights', icon: Calendar, placeholder: 'e.g., 365', type: 'number' },
  { name: 'maximum_maximum_nights', label: 'Max Maximum Nights', icon: Calendar, placeholder: 'e.g., 365', type: 'number' },
  { name: 'minimum_nights_avg_ntm', label: 'Min Nights Avg', icon: Calendar, placeholder: 'e.g., 2.5', type: 'number' },
  { name: 'maximum_nights_avg_ntm', label: 'Max Nights Avg', icon: Calendar, placeholder: 'e.g., 120.3', type: 'number' },
  { name: 'host_days_active', label: 'Host Days Active', icon: Activity, placeholder: 'e.g., 730', type: 'number' },
  { name: 'amenities_count', label: 'Amenities Count', icon: Briefcase, placeholder: 'e.g., 15', type: 'number' },
];

export function PredictionForm({ 
    neighbourhoods, 
    propertyTypes,
    form,
    onSubmit,
    isSubmitting,
  }: PredictionFormProps) {
  
  const roomTypes = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'];
  const responseTimes = ['within an hour', 'within a few hours', 'within a day', 'a few days or more'];
  
  return (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Listing Features</CardTitle>
            <CardDescription>Fill in the details of the property to get a prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="api_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4" />API Endpoint</FormLabel>
                       <FormControl>
                          <Input placeholder="Enter API URL" {...field} />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="room_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Home className="mr-2 h-4 w-4" />Room Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomTypes.map(rt => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="host_response_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4" />Host Response Time</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select response time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {responseTimes.map(hrt => <SelectItem key={hrt} value={hrt}>{hrt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="neighbourhood_cleansed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4" />Neighbourhood</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a neighbourhood" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {neighbourhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="property_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4" />Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formFields.map(({ name, label, icon: Icon, placeholder, type }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof PredictionInput}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Icon className="mr-2 h-4 w-4" />{label}</FormLabel>
                          <FormControl>
                            <Input placeholder={placeholder} type={type || 'text'} {...field} onChange={e => field.onChange(type === 'number' ? e.target.valueAsNumber || 0 : e.target.value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                   <FormField
                    control={form.control}
                    name="host_has_profile_pic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className='flex items-center'><ImageIcon className="mr-2 h-4 w-4" />Has Profile Pic?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 't'}
                            onCheckedChange={(checked) => field.onChange(checked ? 't' : 'f')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="host_identity_verified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className='flex items-center'><ShieldCheck className="mr-2 h-4 w-4" />Identity Verified?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 't'}
                            onCheckedChange={(checked) => field.onChange(checked ? 't' : 'f')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="has_availability"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className='flex items-center'><Calendar className="mr-2 h-4 w-4" />Has Availability?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 't'}
                            onCheckedChange={(checked) => field.onChange(checked ? 't' : 'f')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6">
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Lightbulb className="mr-2 h-6 w-6" />}
                  Predict Price Class
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
  );
}

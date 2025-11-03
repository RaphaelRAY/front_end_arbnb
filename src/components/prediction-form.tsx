'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { predictionSchema, type PredictionInput } from '@/lib/schemas';
import { predictPriceClass, type ActionState } from '@/lib/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictionResults } from './prediction-results';
import {
  BedDouble, Bath, Users, Home, Clock, Hash, Map, MapPin, Loader2, Lightbulb, Image as ImageIcon, ShieldCheck, Calendar, Activity, Building, Briefcase, Percent, Globe
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface PredictionFormProps {
  roomTypes: string[];
  responseTimes: string[];
  neighbourhoods: string[];
  propertyTypes: string[];
}

const apiUrls = [
  { label: 'Local (Python)', value: 'http://127.0.0.1:8000' },
  { label: 'Cloud Run (Production)', value: 'https://your-cloud-run-url.a.run.app' },
];

const formFields: { name: keyof Omit<PredictionInput, 'api_url' |'room_type' | 'host_response_time' | 'host_has_profile_pic' | 'host_identity_verified' | 'has_availability' | 'neighbourhood_cleansed' | 'property_type'>; label: string; icon: React.ElementType; placeholder: string; type?: string }[] = [
  { name: 'latitude', label: 'Latitude', icon: MapPin, placeholder: 'e.g., 40.7128' },
  { name: 'longitude', label: 'Longitude', icon: MapPin, placeholder: 'e.g., -74.0060' },
  { name: 'accommodates', label: 'Accommodates', icon: Users, placeholder: 'e.g., 4', type: 'number' },
  { name: 'bathrooms', label: 'Bathrooms', icon: Bath, placeholder: 'e.g., 2', type: 'number' },
  { name: 'bedrooms', label: 'Bedrooms', icon: BedDouble, placeholder: 'e.g., 3', type: 'number' },
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full text-lg py-6">
      {pending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Lightbulb className="mr-2 h-6 w-6" />}
      Predict Price Class
    </Button>
  );
}

export function PredictionForm({ roomTypes, responseTimes, neighbourhoods, propertyTypes }: PredictionFormProps) {
  const { toast } = useToast();

  const initialState: ActionState = { message: null, result: null, errors: null };
  const [state, formAction] = useFormState(predictPriceClass, initialState);

  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      api_url: apiUrls[0].value,
      latitude: 40.7128,
      longitude: -74.0060,
      room_type: roomTypes[0] || '',
      accommodates: 2,
      bathrooms: 1,
      bedrooms: 1,
      beds: 1,
      host_response_time: responseTimes[0] || '',
      host_response_rate: 100,
      host_acceptance_rate: 100,
      host_listings_count: 1,
      host_total_listings_count: 1,
      host_has_profile_pic: 't',
      host_identity_verified: 't',
      minimum_nights: 1,
      maximum_nights: 1125,
      minimum_minimum_nights: 1,
      maximum_minimum_nights: 1,
      minimum_maximum_nights: 1125,
      maximum_maximum_nights: 1125,
      minimum_nights_avg_ntm: 1.0,
      maximum_nights_avg_ntm: 1125.0,
      has_availability: 't',
      host_days_active: 365,
      amenities_count: 20,
      neighbourhood_cleansed: neighbourhoods[0] || 'Midtown',
      property_type: propertyTypes[0] || 'Entire apartment',
    },
  });

  useEffect(() => {
    if (state.message && !state.result) {
      toast({
        variant: "destructive",
        title: "Prediction Error",
        description: state.message,
      });
    }
  }, [state.message, state.result, toast]);

  useEffect(() => {
    // Clear previous errors
    form.clearErrors();
    if (state.errors) {
      Object.entries(state.errors).forEach(([field, errors]) => {
        if (errors) {
          form.setError(field as keyof PredictionInput, {
            type: 'server',
            message: errors.join(', '),
          });
        }
      });
    }
  }, [state.errors, form]);
  
  return (
    <div className="grid md:grid-cols-2 md:gap-8 lg:gap-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Listing Features</CardTitle>
          <CardDescription>Fill in the details of the property to get a prediction.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              action={formAction}
              className="space-y-6"
              noValidate
            >
              <FormField
                control={form.control}
                name="api_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4" />API Endpoint</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select API URL" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {apiUrls.map(url => <SelectItem key={url.value} value={url.value}>{url.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel className="flex items-center"><Map className="mr-2 h-4 w-4" />Neighbourhood</FormLabel>
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
                          <Input placeholder={placeholder} type={type || 'text'} {...field} />
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
              
              <SubmitButton />

            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-8 md:mt-0">
         <PredictionResults result={state.result} />
      </div>
    </div>
  );
}

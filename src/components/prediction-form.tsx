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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictionResults } from './prediction-results';
import {
  BedDouble, Bath, Users, Home, Clock, Hash, MessageSquare, Star, Map, Wallet, MapPin, Loader2, Lightbulb
} from 'lucide-react';

interface PredictionFormProps {
  roomTypes: string[];
  responseTimes: string[];
}

const formFields: { name: keyof PredictionInput; label: string; icon: React.ElementType; placeholder: string; type?: string }[] = [
  { name: 'latitude', label: 'Latitude', icon: MapPin, placeholder: 'e.g., 40.7128' },
  { name: 'longitude', label: 'Longitude', icon: MapPin, placeholder: 'e.g., -74.0060' },
  { name: 'accommodates', label: 'Accommodates', icon: Users, placeholder: 'e.g., 4', type: 'number' },
  { name: 'bathrooms', label: 'Bathrooms', icon: Bath, placeholder: 'e.g., 2', type: 'number' },
  { name: 'bedrooms', label: 'Bedrooms', icon: BedDouble, placeholder: 'e.g., 3', type: 'number' },
  { name: 'beds', label: 'Beds', icon: BedDouble, placeholder: 'e.g., 3', type: 'number' },
  { name: 'host_listings_count', label: 'Host Listings', icon: Hash, placeholder: 'e.g., 1', type: 'number' },
  { name: 'number_of_reviews', label: 'Number of Reviews', icon: MessageSquare, placeholder: 'e.g., 50', type: 'number' },
  { name: 'review_scores_rating', label: 'Overall Rating', icon: Star, placeholder: '0-100', type: 'number' },
  { name: 'review_scores_accuracy', label: 'Accuracy Score', icon: Star, placeholder: '0-10', type: 'number' },
  { name: 'review_scores_cleanliness', label: 'Cleanliness Score', icon: Star, placeholder: '0-10', type: 'number' },
  { name: 'review_scores_checkin', label: 'Check-in Score', icon: Star, placeholder: '0-10', type: 'number' },
  { name: 'review_scores_communication', label: 'Communication Score', icon: Star, placeholder: '0-10', type: 'number' },
  { name: 'review_scores_location', label: 'Location Score', icon: Map, placeholder: '0-10', type: 'number' },
  { name: 'review_scores_value', label: 'Value Score', icon: Wallet, placeholder: '0-10', type: 'number' },
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

export function PredictionForm({ roomTypes, responseTimes }: PredictionFormProps) {
  const { toast } = useToast();

  const initialState: ActionState = { message: null, result: null, errors: null };
  const [state, formAction] = useFormState(predictPriceClass, initialState);

  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      latitude: 40.7128,
      longitude: -74.0060,
      room_type: roomTypes[0] || '',
      accommodates: 2,
      bathrooms: 1,
      bedrooms: 1,
      beds: 1,
      host_response_time: responseTimes[0] || '',
      host_listings_count: 1,
      number_of_reviews: 10,
      review_scores_rating: 95,
      review_scores_accuracy: 10,
      review_scores_cleanliness: 10,
      review_scores_checkin: 10,
      review_scores_communication: 10,
      review_scores_location: 10,
      review_scores_value: 10,
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
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formFields.map(({ name, label, icon: Icon, placeholder, type }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
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

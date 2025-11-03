'use client';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit } from 'lucide-react';
import { PredictionFormWrapper } from '@/app/prediction-form-wrapper';
import { neighbourhoods } from '@/lib/neighbourhoods';
import { propertyTypes } from '@/lib/property-types';
import { predictionSchema, type PredictionInput, apiPredictionSchema } from '@/lib/schemas';
import type { ApiPredictionResponse, PredictionResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const roomTypes = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'];
  const responseTimes = ['within an hour', 'within a few hours', 'within a day', 'a few days or more'];

  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      api_url: 'http://127.0.0.1:8000',
      room_type: roomTypes[0],
      accommodates: 2,
      bathrooms: 1,
      bedrooms: 1,
      beds: 1,
      host_response_time: responseTimes[0],
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
      neighbourhood_cleansed: neighbourhoods[0] || 'Copacabana',
      property_type: propertyTypes[0] || 'Entire apartment',
    },
  });

  const onSubmit = async (data: PredictionInput) => {
    setIsSubmitting(true);
    setPredictionResult(null);
    form.clearErrors();

    // The schema already transforms the data, but the API expects lat/long
    // For now, let's add some default coordinates since the map is gone.
    const dataWithCoords = {
      ...data,
      latitude: -22.9068,
      longitude: -43.1729,
    };

    const validatedApiData = apiPredictionSchema.safeParse(dataWithCoords);

    if (!validatedApiData.success) {
      console.error("API validation failed", validatedApiData.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }
    
    const { api_url, ...predictionData } = validatedApiData.data;

    try {
      const response = await fetch(`${api_url}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        let errorMessage = `An API error occurred: ${response.status} ${response.statusText}`;
        try {
            const errorBody = await response.json();
            if (response.status === 422 && errorBody.detail) {
              const firstError = errorBody.detail?.[0];
               if (firstError) {
                 errorMessage = `Validation Error: ${firstError.loc.join(' -> ')} - ${firstError.msg}`;
               } else {
                 errorMessage = 'Unknown validation error occurred.'
               }
            } else if (errorBody.detail) {
               errorMessage = `API Error: ${errorBody.detail}`;
            } else {
              errorMessage = `API Error: ${JSON.stringify(errorBody)}`;
            }
        } catch (e) {
          // Ignore if error body parsing fails
        }

        toast({
            variant: "destructive",
            title: "Prediction Failed",
            description: errorMessage,
        });
        
        setIsSubmitting(false);
        return;
      }
      
      const apiResult: ApiPredictionResponse = await response.json();
      
      const transformedResult: PredictionResponse = {
        classe_prevista: apiResult.resultado.classe_prevista,
        confianca: apiResult.resultado.confianca,
        probabilidades: Object.entries(apiResult.resultado.probabilidades).reduce((acc, [key, value]) => {
          acc[key as keyof PredictionResponse['probabilidades']] = parseFloat(value) / 100;
          return acc;
        }, {} as PredictionResponse['probabilidades']),
        explicacao_LIME: apiResult.resultado.explicacao_LIME,
      };

      setPredictionResult(transformedResult);

    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
             errorMessage = `Could not connect to the API at ${api_url}. Please ensure the API server is running and accessible, and that CORS is enabled.`;
        } else {
             errorMessage = `A network error occurred: ${error.message}`;
        }
      }
       toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          AirBnB Insights
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80">
          Enter your listing's details below to predict its price category.
        </p>
      </div>
      
      <FormProvider {...form}>
        <PredictionFormWrapper
          neighbourhoods={neighbourhoods}
          propertyTypes={propertyTypes}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          predictionResult={predictionResult}
        />
      </FormProvider>
    </main>
  );
}

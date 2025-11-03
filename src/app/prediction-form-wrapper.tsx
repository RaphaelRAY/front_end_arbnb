'use client';

import dynamic from 'next/dynamic';
import type { PredictionInput } from '@/lib/schemas';
import type { PredictionResponse } from '@/lib/types';
import { PredictionForm } from '@/components/prediction-form';
import { PredictionResults } from '@/components/prediction-results';

const InteractiveMap = dynamic(() => import('@/components/interactive-map').then(mod => mod.InteractiveMap), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted rounded-lg animate-pulse" />
});

interface PredictionFormWrapperProps {
  neighbourhoods: string[];
  propertyTypes: string[];
  form: any;
  onSubmit: (data: PredictionInput) => void;
  isSubmitting: boolean;
  predictionResult: PredictionResponse | null;
}

export function PredictionFormWrapper({
  neighbourhoods,
  propertyTypes,
  form,
  onSubmit,
  isSubmitting,
  predictionResult
}: PredictionFormWrapperProps) {
  
  return (
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <PredictionForm 
          neighbourhoods={neighbourhoods}
          propertyTypes={propertyTypes}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <div className="space-y-8">
            <div className="sticky top-8">
                 <InteractiveMap />
            </div>
            <PredictionResults result={predictionResult} />
        </div>
      </div>
  );
}

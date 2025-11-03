'use client';

import type { PredictionInput } from '@/lib/schemas';
import type { PredictionResponse } from '@/lib/types';
import { PredictionForm } from '@/components/prediction-form';
import { PredictionResults } from '@/components/prediction-results';

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
      <div className="grid max-w-7xl mx-auto lg:grid-cols-2 lg:gap-12 space-y-8 lg:space-y-0">
        <PredictionForm 
          neighbourhoods={neighbourhoods}
          propertyTypes={propertyTypes}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <div className="lg:sticky top-8 self-start">
          <PredictionResults result={predictionResult} />
        </div>
      </div>
  );
}

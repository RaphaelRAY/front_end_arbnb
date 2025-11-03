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
      <div className="max-w-4xl mx-auto space-y-8">
        <PredictionForm 
          neighbourhoods={neighbourhoods}
          propertyTypes={propertyTypes}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <PredictionResults result={predictionResult} />
      </div>
  );
}

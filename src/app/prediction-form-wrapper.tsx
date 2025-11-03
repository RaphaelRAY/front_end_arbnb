'use client';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import type { PredictionInput } from '@/lib/schemas';
import type { PredictionResponse } from '@/lib/types';
import { PredictionForm } from '@/components/prediction-form';
import { PredictionResults } from '@/components/prediction-results';
import { Skeleton } from '@/components/ui/skeleton';
import { neighbourhoods } from '@/lib/neighbourhoods';
import { propertyTypes } from '@/lib/property-types';

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-md" />,
});

interface PredictionFormWrapperProps {
  onSubmit: (data: PredictionInput) => void;
  isSubmitting: boolean;
  predictionResult: PredictionResponse | null;
}

export function PredictionFormWrapper({
  onSubmit,
  isSubmitting,
  predictionResult
}: PredictionFormWrapperProps) {
  const form = useFormContext<PredictionInput>();

  return (
    <div className="grid max-w-7xl mx-auto lg:grid-cols-2 lg:gap-12 space-y-8 lg:space-y-0">
        <PredictionForm 
          neighbourhoods={neighbourhoods}
          propertyTypes={propertyTypes}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <div className="space-y-8">
            <div className="lg:sticky top-8 space-y-8">
                 <InteractiveMap />
                 <PredictionResults result={predictionResult} />
            </div>
        </div>
      </div>
  );
}

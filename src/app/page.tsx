import { PredictionForm } from '@/components/prediction-form';
import { BrainCircuit } from 'lucide-react';
import { neighbourhoods } from '@/lib/neighbourhoods';
import { propertyTypes } from '@/lib/property-types';

export default async function Home() {
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
          Enter your listing's details below or click on the map to predict its price category.
        </p>
      </div>
      
      <PredictionForm
        neighbourhoods={neighbourhoods}
        propertyTypes={propertyTypes}
      />
    </main>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { PredictionResponse, LIMEExplanationItem } from '@/lib/types';
import { Lightbulb, TrendingUp, TrendingDown, Target, HelpCircle, Building, MapPin, User, Settings } from 'lucide-react';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PredictionResultsProps {
  result: PredictionResponse | null;
}

const PriceBadge = ({ level }: { level: string }) => {
  const colors: {[key: string]: string} = {
    baixo: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    medio: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
    luxo: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100',
  }

  return <Badge className={`text-lg capitalize px-4 py-1 border-2 ${colors[level] || colors['medio']}`}>{level}</Badge>
}

const getGroupIcon = (group: string) => {
  switch (group) {
    case 'Localizacao': return <MapPin className="h-4 w-4 text-muted-foreground" />;
    case 'Tamanho': return <Building className="h-4 w-4 text-muted-foreground" />;
    case 'Host': return <User className="h-4 w-4 text-muted-foreground" />;
    case 'Tipo': return <Settings className="h-4 w-4 text-muted-foreground" />;
    default: return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

const LIMEExplanation = ({ item }: { item: LIMEExplanationItem }) => {
  const isPositive = item.impacto > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex items-center gap-3 w-full">
        {getGroupIcon(item.grupo)}
        <span className="text-sm font-medium text-foreground/90 flex-1">{item.rotulo}</span>
        <div className={`flex items-center gap-1 font-semibold text-xs ${color}`}>
          <Icon className="h-4 w-4 shrink-0" />
          <span>{item.direcao}</span>
        </div>
      </div>
    </li>
  );
}

export function PredictionResults({ result }: PredictionResultsProps) {
  return (
    <Card className="shadow-lg sticky top-8 min-h-[500px] flex flex-col justify-center">
        {result && result.classe_prevista ? (
          <TooltipProvider>
            <div
              key="results"
              className="w-full animate-in fade-in-0 zoom-in-95 duration-500"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Lightbulb className="text-accent" />
                  Prediction Analysis
                </CardTitle>
                <CardDescription>Here's the breakdown of your listing's price class.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-muted/50 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Predicted Price Class</p>
                    <PriceBadge level={result.classe_prevista} />
                  </div>
                   {result.confianca && (
                     <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Confidence</p>
                        <p className="font-bold text-2xl text-primary flex items-center justify-center gap-2">
                          <Target className="h-6 w-6"/>
                          {result.confianca}
                        </p>
                     </div>
                   )}
                </div>
                
                {result.probabilidades && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Class Probabilities</h3>
                    <div className="space-y-3">
                      {Object.entries(result.probabilidades).sort((a,b) => b[1] - a[1]).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium capitalize">{key}</span>
                            <span className="text-sm font-semibold text-primary">{(value * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={value * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {result.explicacao_LIME && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-lg font-semibold">Key Price Factors</h3>
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md cursor-help">
                              Coverage: {result.explicacao_LIME.cobertura_pct}%
                           </span>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p className="max-w-xs text-sm">
                             This explanation covers {result.explicacao_LIME.cobertura_pct}% of the factors contributing to this specific prediction.
                           </p>
                         </TooltipContent>
                       </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      These features had the biggest impact on the prediction, powered by LIME.
                    </p>
                    <ul className="divide-y divide-border -mt-2">
                      {result.explicacao_LIME.itens.map((item, i) => <LIMEExplanation key={i} item={item} />)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </div>
          </TooltipProvider>
        ) : (
          <div
            key="placeholder"
            className="flex flex-col items-center justify-center h-full text-center p-8"
          >
            <div className="mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
              <Lightbulb className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold font-headline">Awaiting Your Input</h3>
            <p className="mt-2 text-muted-foreground">
              Fill out the form to see the AI-powered price prediction for your property.
            </p>
          </div>
        )}
    </Card>
  );
}

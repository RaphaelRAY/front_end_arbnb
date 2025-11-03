'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { LIMEExplanation, PredictionResponse } from '@/lib/types';
import {
  Building,
  Code,
  HelpCircle,
  Lightbulb,
  MapPin,
  Settings,
  Target,
  User,
} from 'lucide-react';

interface PredictionResultsProps {
  result: PredictionResponse | null;
}

const PriceBadge = ({ level }: { level: string }) => {
  const colors: { [key: string]: string } = {
    baixo:
      'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
    medio:
      'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
    luxo: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700',
  };

  return (
    <Badge
      className={`text-lg capitalize px-4 py-1 border-2 ${
        colors[level] || colors['medio']
      }`}
    >
      {level}
    </Badge>
  );
};

const getGroupIcon = (group: string) => {
  switch (group) {
    case 'Localizacao':
      return <MapPin className="h-5 w-5 text-muted-foreground" />;
    case 'Tamanho':
      return <Building className="h-5 w-5 text-muted-foreground" />;
    case 'Host':
      return <User className="h-5 w-5 text-muted-foreground" />;
    case 'Tipo':
      return <Settings className="h-5 w-5 text-muted-foreground" />;
    default:
      return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
  }
};

const LIMEExplanationDisplay = ({
  explanation,
}: {
  explanation: LIMEExplanation;
}) => {
  const groupedItems = explanation.itens.reduce((acc, item) => {
    (acc[item.grupo] = acc[item.grupo] || []).push(item);
    return acc;
  }, {} as { [key: string]: typeof explanation.itens });

  const maxImpact = Math.max(...explanation.itens.map((i) => Math.abs(i.impacto)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
          <span>Favorece a classe prevista</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
          <span>Contraria a classe prevista</span>
        </div>
      </div>
      <Accordion type="multiple" className="w-full" defaultValue={Object.keys(groupedItems)}>
        {Object.entries(groupedItems).map(([group, items]) => (
          <AccordionItem value={group} key={group}>
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center gap-3">
                {getGroupIcon(group)}
                {group}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4 pt-2">
                {items.map((item, i) => {
                  const isPositive = item.impacto > 0;
                  const barWidth = (Math.abs(item.impacto) / maxImpact) * 100;
                  const valueDisplay =
                    typeof item.valor === 'boolean'
                      ? item.valor
                        ? 'Sim'
                        : 'Não'
                      : typeof item.valor === 'number'
                      ? item.valor.toFixed(2)
                      : item.valor;
                  return (
                    <li key={i} className="flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground/90">
                          {item.rotulo}
                        </span>
                        <span className="font-mono text-xs font-semibold">
                          {valueDisplay}
                          {item.valor_referencia && (
                            <span className="text-muted-foreground">
                              {' '}
                              (ref: {item.valor_referencia})
                            </span>
                          )}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Progress
                              value={barWidth}
                              indicatorClassName={
                                isPositive ? 'bg-green-500' : 'bg-red-500'
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Impacto: {item.impacto.toFixed(4)} ({item.direcao})
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

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
              <CardTitle className="text-2xl font-headline flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-accent" />
                  Análise da Predição
                </div>
                {result.explicacao_LIME && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Code className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Raw LIME Explanation</AlertDialogTitle>
                        <AlertDialogDescription>
                          The raw JSON output from the LIME explanation model is displayed below.
                        </AlertDialogDescription>
                         <pre className="mt-2 max-h-[400px] overflow-auto rounded-md bg-muted p-4 text-xs text-muted-foreground">
                          {JSON.stringify(result.explicacao_LIME, null, 2)}
                        </pre>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Fechar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardTitle>
              <CardDescription>
                Esta é a análise da categoria de preço da sua listagem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Categoria de Preço Prevista
                  </p>
                  <PriceBadge level={result.classe_prevista} />
                </div>
                {result.confianca && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Confiança
                    </p>
                    <p className="font-bold text-2xl text-primary flex items-center justify-center gap-2">
                      <Target className="h-6 w-6" />
                      {result.confianca}
                    </p>
                  </div>
                )}
              </div>

              {result.probabilidades && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Probabilidades por Classe
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(result.probabilidades)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium capitalize">
                              {key}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {(value * 100).toFixed(1)}%
                            </span>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Fatores Chave de Preço
                    </h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md cursor-help">
                          Cobertura: {result.explicacao_LIME.cobertura_pct}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">
                          Estes fatores explicam{' '}
                          {result.explicacao_LIME.cobertura_pct}% da
                          contribuição total para esta predição específica.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <LIMEExplanationDisplay explanation={result.explicacao_LIME} />
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
          <h3 className="text-xl font-semibold font-headline">
            A Aguardar os seus Dados
          </h3>
          <p className="mt-2 text-muted-foreground">
            Preencha o formulário para ver a predição de preço gerada por IA.
          </p>
        </div>
      )}
    </Card>
  );
}

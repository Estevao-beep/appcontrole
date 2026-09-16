import React, { useState } from 'react';
import { BestPracticeSuggestion } from '../types/logistics';
import { 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CalendarClock, 
  LayoutGrid, 
  FileCheck2, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface SmartAdvisoryProps {
  suggestions: BestPracticeSuggestion[];
  onToggleImplemented: (id: string) => void;
  onApplyPresetScenario: (scenario: 'pico_congestionado' | 'otimizado') => void;
}

export const SmartAdvisory: React.FC<SmartAdvisoryProps> = ({
  suggestions,
  onToggleImplemented,
  onApplyPresetScenario,
}) => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      const q = aiQuestion.toLowerCase();
      if (q.includes('carreta') || q.includes('pico') || q.includes('11h') || q.includes('espera')) {
        setAiAnswer(
          `**Parecer do Arquiteto Logístico:**\n\n` +
          `Para conter a chegada de múltiplas carretas sem travar a portaria:\n` +
          `1. **Alocação Imediata:** Direcione 2 carretas para as Docas 01 e 04 (com rampa niveladora pesada).\n` +
          `2. **Conversão Temporária:** Desloque 1 carreta para a Doca 05 (Expedição Geral) temporariamente em modo misto de descarga rápida.\n` +
          `3. **Bolsão Buffer:** Mantenha a 4ª carreta no Bolsão de Espera com o motorista avisado por SMS/WhatsApp quando a Doca 02 for desocupada (previsão em 22 min).\n` +
          `4. **Conferência Cega:** Mobilize 2 conferentes adicionais na Doca 01 para reduzir o tempo de descarga de 80 min para 45 min.`
        );
      } else if (q.includes('doca 08') || q.includes('manutenção')) {
        setAiAnswer(
          `**Recomendação Técnica:** A Doca 08 está com atuador pneumático avariado. ` +
          `Sugerimos remanejar a equipe de expedição para a Doca 07 com cross-docking ágil e acionar o chamado SLA urgente #4089. ` +
          `Isso previne o efeito cascata nas saídas das 17h.`
        );
      } else {
        setAiAnswer(
          `**Análise Preditiva do Pátio:**\n` +
          `Com base no histórico dos últimos 14 dias, o gargalo das 09h ocorre principalmente pela falta de sincronização entre o horário de emissão de NF dos fornecedores e o início do turno. ` +
          `A implementação de janelas de 30 minutos (Time Slot Management) com pré-check de NF digital reduz o tempo de permanência no portão em 34%.`
        );
      }
    }, 800);
  };

  const getCategoryIcon = (category: BestPracticeSuggestion['category']) => {
    switch (category) {
      case 'Agendamento':
        return <CalendarClock className="w-4 h-4 text-amber-400" />;
      case 'Layout & Alocação':
        return <LayoutGrid className="w-4 h-4 text-sky-400" />;
      case 'Processo Documental':
        return <FileCheck2 className="w-4 h-4 text-emerald-400" />;
      case 'Gestão de Gargalo':
        return <Zap className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Motor de Otimização & Sugestões de Boas Práticas Logísticas
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recomendações prescritivas baseadas na análise de gargalos das 14 docas e do fluxo de entrada/saída de veículos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onApplyPresetScenario('otimizado')}
            className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Simular Todas as Boas Práticas Ativas</span>
          </button>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            id={`suggestion-card-${sug.id}`}
            className={`bg-slate-900 border ${
              sug.implemented
                ? 'border-emerald-500/40 bg-slate-900/60'
                : 'border-slate-800 hover:border-slate-700'
            } rounded-xl p-5 flex flex-col justify-between space-y-4 transition`}
          >
            <div className="space-y-3">
              {/* Header with Category and Impact */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  {getCategoryIcon(sug.category)}
                  <span>{sug.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sug.impact === 'Crítico'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : sug.impact === 'Alto'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    Impacto {sug.impact}
                  </span>
                  {sug.implemented && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Aplicado
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white tracking-tight">{sug.title}</h3>

              {/* Expected Metric Target */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 font-medium">Meta de Ganho: </span>
                  <span className="font-bold text-emerald-400">{sug.metricTarget}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300 block mb-0.5">Diagnóstico do Gargalo:</strong>
                <p className="leading-relaxed">{sug.diagnosis}</p>
              </div>

              {/* Actionable Plan */}
              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <strong className="text-amber-400 block mb-1">Plano de Ação Proposto:</strong>
                <p className="leading-relaxed">{sug.actionablePlan}</p>
              </div>
            </div>

            {/* Toggle Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Status de Operação:</span>
              <button
                onClick={() => onToggleImplemented(sug.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  sug.implemented
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                }`}
              >
                {sug.implemented ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Otimização Implementada</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{sug.suggestedActionLabel || 'Implementar Otimização'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Logistics Advisor Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Consultor de Inteligência Operacional (IA para Gestão de Docas)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Simule consultas dinâmicas de contingência para operadores e coordenadores de tráfego.
        </p>

        <form onSubmit={handleAskAI} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Como evitar fila com 4 carretas de descarga chegando entre 11h e 12h?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-white px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiQuestion.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              {isAiLoading ? 'Analisando...' : 'Consultar'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preset query chips */}
          <div className="flex flex-wrap gap-1.5 items-center text-[11px] text-slate-400">
            <span>Sugestões rápidas:</span>
            <button
              type="button"
              onClick={() => setAiQuestion('Como remanejar operações da Doca 08 em manutenção preventiva?')}
              className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
            >
              Doca 08 em Manutenção
            </button>
            <button
              type="button"
              onClick={() => setAiQuestion('Como desafogar o pico de 9 carretas no bolsão de espera às 09h?')}
              className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
            >
              Pico de 9 carretas às 09h
            </button>
          </div>
        </form>

        {aiAnswer && (
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-xs text-slate-200 space-y-2 whitespace-pre-line animate-in fade-in">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnóstico Acionável de Engenharia Logística:
            </div>
            <p className="leading-relaxed">{aiAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

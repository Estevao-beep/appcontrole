import React, { useState } from 'react';
import { HOURLY_CONGESTION_DATA } from '../data/initialData';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export const AnalyticsKPIs: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes'>('hoje');

  // Multipliers based on period
  const multiplier = selectedPeriod === 'hoje' ? 1 : selectedPeriod === 'semana' ? 6 : 24;

  return (
    <div className="space-y-6">
      {/* Header and Period Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Cockpit de Indicadores de Desempenho & Gargalos (KPIs)
          </h2>
          <p className="text-xs text-slate-400">
            Métricas de fluxo contínuo, tempo de permanência e diagnóstico de capacidade das 14 docas
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {(['hoje', 'semana', 'mes'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer capitalize ${
                selectedPeriod === period
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period === 'hoje' ? 'Visão Hoje' : period === 'semana' ? 'Últimos 7 Dias' : 'Mês Vigente'}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Critical Logistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Taxa de Utilização de Docas */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Taxa de Utilização (DUR)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">78.4%</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Faixa Ótima (Benchmark: 70-85%)
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Horas operadas / 14 docas × horas do turno
          </div>
        </div>

        {/* KPI 2: Tempo Médio de Permanência (Dwell Time) */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Permanência (Dwell Time)</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-sky-300">54 min</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              -8 min vs semana anterior
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Portaria de entrada à saída final (Gate-to-Gate)
          </div>
        </div>

        {/* KPI 3: Taxa de Rotatividade (Turnover) */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Taxa de Rotatividade</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-emerald-400">
              {(3.9).toFixed(1)} <span className="text-sm font-normal text-slate-400">veíc/doca/dia</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              Meta: &ge; 4.0 veíc/doca
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            {Math.round(52 * multiplier)} atendimentos no período
          </div>
        </div>

        {/* KPI 4: Pico de Congestionamento */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Pico de Gargalo</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-rose-400">08:00 - 10:00</div>
            <div className="text-[11px] text-rose-300 font-semibold mt-0.5">
              Até 9 veículos em fila de espera
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Concentração de carretas de terceiros
          </div>
        </div>

        {/* KPI 5: Eficiência & Acurácia de SLA */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Cumprimento de SLA</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-amber-400">83.6%</div>
            <div className="text-[11px] text-amber-300 font-medium mt-0.5">
              16.4% com desvio operacional
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Operações concluídas dentro do tempo limite
          </div>
        </div>
      </div>

      {/* Hourly Congestion Chart & Dwell Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Congestion by Hour Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Curva de Congestionamento & Fila Horária</h3>
              <p className="text-xs text-slate-400">
                Distribuição de veículos em espera vs docas ocupadas ao longo do dia
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Fila Espera (Pátio)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 rounded bg-sky-500 inline-block" /> Docas Ocupadas (Max 14)
              </span>
            </div>
          </div>

          {/* Visual Chart Bars */}
          <div className="pt-4 space-y-2">
            <div className="grid grid-cols-14 gap-1.5 items-end h-48 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              {HOURLY_CONGESTION_DATA.map((cp) => {
                const waitingHeight = (cp.vehiclesWaiting / 10) * 100;
                const dockHeight = (cp.docksOccupied / 14) * 100;
                const isPeak = cp.severity === 'critico';

                return (
                  <div key={cp.hour} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute bottom-full mb-2 bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap z-20">
                      <div className="font-bold text-amber-400">{cp.hour}</div>
                      <div>Em espera: {cp.vehiclesWaiting} veíc.</div>
                      <div>Docas ativas: {cp.docksOccupied}/14</div>
                      <div>Dwell time: {cp.avgDwellMinutes} min</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      {/* Waiting bar */}
                      <div
                        className={`w-2.5 rounded-t transition-all ${
                          isPeak ? 'bg-rose-500 animate-pulse' : 'bg-rose-400/80'
                        }`}
                        style={{ height: `${Math.max(8, waitingHeight)}%` }}
                        title={`${cp.vehiclesWaiting} veículos em espera`}
                      />
                      {/* Docks bar */}
                      <div
                        className="w-2.5 rounded-t bg-sky-500 transition-all"
                        style={{ height: `${dockHeight}%` }}
                        title={`${cp.docksOccupied} docas ocupadas`}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1.5">{cp.hour.split(':')[0]}h</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Picos Críticos: 08h-10h (Recebimento) e 14h-15h (Expedição)
              </span>
              <span className="text-slate-400 font-mono">Total de movimentações previstas hoje: 58 veículos</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Dock Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              Saturação por Perfil de Doca
            </h3>
            <p className="text-xs text-slate-400">Identificação de assimetria de carga</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Recebimento Pesado */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Docas 01-04 (Receb. Pesado)</span>
                <span className="font-bold text-rose-400">92% Utilização</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="text-[10px] text-rose-400/90 block">⚠️ Ponto nevrálgico: carretas aguardam doca livre.</span>
            </div>

            {/* Expedição Geral */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Docas 05-08 (Expedição Geral)</span>
                <span className="font-bold text-sky-400">74% Utilização</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '74%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block">Doca 08 em manutenção reduz capacidade.</span>
            </div>

            {/* Cross-docking */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Docas 09-12 (Cross-Docking)</span>
                <span className="font-bold text-emerald-400">54% Utilização</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '54%' }} />
              </div>
              <span className="text-[10px] text-emerald-400 block">✓ Oportunidade: converter em docas flexíveis.</span>
            </div>

            {/* Refrigerada */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Docas 13-14 (Câmara Fria)</span>
                <span className="font-bold text-cyan-400">60% Utilização</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block">Fluxo controlado com janelas dedicadas.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Turno / Shift Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Eficiência Operacional Comparativa por Turno
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Turno Operacional</th>
                <th className="px-4 py-2.5">Horário</th>
                <th className="px-4 py-2.5">Veículos Atendidos</th>
                <th className="px-4 py-2.5">Tempo Médio em Doca</th>
                <th className="px-4 py-2.5">Tempo Médio no Pátio</th>
                <th className="px-4 py-2.5">Taxa de Ocupação</th>
                <th className="px-4 py-2.5">Diagnóstico Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-bold text-white">Turno 1 (Manhã)</td>
                <td className="px-4 py-3 font-mono text-slate-400">06:00 - 14:00</td>
                <td className="px-4 py-3 font-bold text-slate-200">32 veículos</td>
                <td className="px-4 py-3 font-mono text-slate-200">62 min</td>
                <td className="px-4 py-3 font-mono text-rose-400 font-bold">42 min (Alto)</td>
                <td className="px-4 py-3 font-bold text-rose-400">88.5%</td>
                <td className="px-4 py-3 text-rose-300 font-medium">Congestionamento severo no recebimento às 09h</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-bold text-white">Turno 2 (Tarde)</td>
                <td className="px-4 py-3 font-mono text-slate-400">14:00 - 22:00</td>
                <td className="px-4 py-3 font-bold text-slate-200">22 veículos</td>
                <td className="px-4 py-3 font-mono text-slate-200">46 min</td>
                <td className="px-4 py-3 font-mono text-emerald-400">18 min</td>
                <td className="px-4 py-3 font-bold text-sky-400">67.2%</td>
                <td className="px-4 py-3 text-emerald-400 font-medium">Fluxo estável de expedição de rotas</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-bold text-white">Turno 3 (Noturno)</td>
                <td className="px-4 py-3 font-mono text-slate-400">22:00 - 06:00</td>
                <td className="px-4 py-3 font-bold text-slate-200">8 veículos</td>
                <td className="px-4 py-3 font-mono text-slate-200">38 min</td>
                <td className="px-4 py-3 font-mono text-emerald-400">9 min</td>
                <td className="px-4 py-3 font-bold text-slate-400">28.0%</td>
                <td className="px-4 py-3 text-slate-400">Abastecimento interno e manutenção preventiva</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

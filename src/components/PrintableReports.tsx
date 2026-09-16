import React, { useState } from 'react';
import { Vehicle, Dock } from '../types/logistics';
import { Printer, Download, FileText, Calendar, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

interface PrintableReportsProps {
  vehicles: Vehicle[];
  docks: Dock[];
}

export const PrintableReports: React.FC<PrintableReportsProps> = ({ vehicles, docks }) => {
  const [reportType, setReportType] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    window.print();
  };

  const occupiedDocks = docks.filter((d) => d.status === 'Ocupada' || d.status === 'Congestionada').length;
  const completedCount = vehicles.filter((v) => v.status === 'Liberado (Concluído)').length;
  const inDocksCount = vehicles.filter((v) => v.status === 'Em Doca').length;
  const waitingYardCount = vehicles.filter((v) => v.status === 'No Pátio (Espera)').length;

  return (
    <div className="space-y-6">
      {/* Control bar (hidden during print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['diario', 'semanal', 'mensal'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer capitalize ${
                  reportType === type
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'diario' ? 'Relatório Diário' : type === 'semanal' ? 'Consolidado Semanal' : 'Relatório Mensal Executivo'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Data de Referência:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório (PDF / Papel)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="print-card bg-white text-slate-900 rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-200 max-w-5xl mx-auto space-y-8">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-sm">
                DF
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">DocasFlow YMS</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Centro de Distribuição Principal • Logística de Entrada e Saída
            </p>
            <h1 className="text-lg font-bold text-slate-900 pt-1">
              {reportType === 'diario'
                ? 'Relatório Operacional Diário de Fluxo e Docas'
                : reportType === 'semanal'
                ? 'Relatório Semanal de Gargalos e Indicadores de Pátio'
                : 'Relatório Executivo Mensal de Produtividade Logística'}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Emissão:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Período Ref.:</strong> {dateFilter}</div>
            <div><strong>Responsável:</strong> Coordenação de Pátio & Tráfego</div>
            <div><strong>Status da Operação:</strong> Turno Ativo (14 Docas)</div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            1. Sumário Executivo de Indicadores (KPIs)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 font-semibold block">Taxa de Utilização das Docas</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">78.4%</span>
              <span className="text-[11px] text-emerald-700 font-medium">✓ Dentro do padrão (70-85%)</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 font-semibold block">Tempo Médio de Permanência</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">54 min</span>
              <span className="text-[11px] text-emerald-700 font-medium">Portaria à Saída (Gate-to-Gate)</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 font-semibold block">Veículos Movimentados Hoje</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {vehicles.length} <span className="text-xs font-normal text-slate-500">veículos</span>
              </span>
              <span className="text-[11px] text-slate-600 font-medium">{completedCount} já liberados</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 font-semibold block">Índice de Acurácia de SLA</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">83.6%</span>
              <span className="text-[11px] text-amber-700 font-medium">16.4% fora do prazo</span>
            </div>
          </div>
        </div>

        {/* 14 Docks Operational State */}
        <div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            2. Panorama em Tempo Real das 14 Docas do Depósito
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Doca</th>
                  <th className="p-2.5">Categoria / Equipamento</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Veículo Atual</th>
                  <th className="p-2.5">Transportadora</th>
                  <th className="p-2.5">SLA Padrão</th>
                  <th className="p-2.5">Giro Hoje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {docks.map((dock) => {
                  const currentVeh = dock.currentVehicleId
                    ? vehicles.find((v) => v.id === dock.currentVehicleId)
                    : undefined;

                  return (
                    <tr key={dock.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold font-mono text-slate-900">{dock.code}</td>
                      <td className="p-2.5">
                        <span className="font-medium">{dock.category}</span>
                        <span className="text-[10px] text-slate-500 block">{dock.rampType}</span>
                      </td>
                      <td className="p-2.5 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dock.status === 'Livre'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dock.status === 'Ocupada'
                            ? 'bg-blue-100 text-blue-800'
                            : dock.status === 'Congestionada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {dock.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono">
                        {currentVeh ? `${currentVeh.plate} (${currentVeh.vehicleType})` : '—'}
                      </td>
                      <td className="p-2.5 truncate max-w-[150px]">
                        {currentVeh ? currentVeh.carrier : '—'}
                      </td>
                      <td className="p-2.5 font-mono">{dock.slaMinutes} min</td>
                      <td className="p-2.5 font-bold">{dock.turnoverToday} veíc.</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Movement Log */}
        <div>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            3. Registro Consolidado de Movimentações (Entrada / Doca / Saída)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Placa</th>
                  <th className="p-2.5">Transportadora</th>
                  <th className="p-2.5">Operação</th>
                  <th className="p-2.5">Entrada</th>
                  <th className="p-2.5">Doca Alocada</th>
                  <th className="p-2.5">Documento Fiscal</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{v.plate} ({v.vehicleType})</td>
                    <td className="p-2.5">{v.carrier}</td>
                    <td className="p-2.5 font-medium">{v.operationType}</td>
                    <td className="p-2.5 font-mono text-slate-600">
                      {new Date(v.entryTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-2.5 font-mono">
                      {v.assignedDockId ? `Doca ${v.assignedDockId < 10 ? '0' : ''}${v.assignedDockId}` : 'Pátio (Espera)'}
                    </td>
                    <td className="p-2.5 text-slate-600">{v.documentNumber}</td>
                    <td className="p-2.5 font-medium">{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnóstico e Recomendações Prioritárias */}
        <div className="border-t border-slate-200 pt-6 space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            4. Diagnóstico de Gargalos & Plano de Ação Recomendado
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
            <p>
              <strong>1. Pico de Chegadas das 08h-10h:</strong> Registrada fila máxima de 9 carretas aguardando no bolsão de espera. Ação: Instituir janelas fixas escalonadas com tolerância de 15 minutos.
            </p>
            <p>
              <strong>2. Assimetria de Alocação:</strong> Docas 01 a 04 operando em 92% de capacidade com carretas pesadas. Ação: Habilitar Docas 11 e 12 (cross-docking) como flexíveis para descarregamento a partir das 10h.
            </p>
            <p>
              <strong>3. Manutenção da Doca 08:</strong> Rampa pneumática inoperante. OS #4089 aberta para reparo preventivo.
            </p>
          </div>
        </div>

        {/* Formal Signature Area */}
        <div className="border-t-2 border-slate-200 pt-10 flex justify-between items-end text-xs text-slate-600">
          <div className="text-center w-64 space-y-1">
            <div className="border-b border-slate-400 pb-1" />
            <span className="font-bold text-slate-900 block">Supervisor de Pátio e Docas</span>
            <span className="text-[11px] text-slate-500">Operação & Portaria</span>
          </div>

          <div className="text-center w-64 space-y-1">
            <div className="border-b border-slate-400 pb-1" />
            <span className="font-bold text-slate-900 block">Gerência de Logística e Transportes</span>
            <span className="text-[11px] text-slate-500">Planejamento e Controle Operacional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

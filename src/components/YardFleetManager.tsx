import React, { useState } from 'react';
import { Vehicle, Dock, VehicleStatus } from '../types/logistics';
import { 
  Truck, 
  Search, 
  Clock, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RotateCcw, 
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

interface YardFleetManagerProps {
  vehicles: Vehicle[];
  docks: Dock[];
  onOpenGateModal: () => void;
  onAssignVehicleToDock: (dockId: number, vehicleId: string) => void;
  onSelectDock: (dock: Dock) => void;
  onSelectVehicleForExit?: (vehicleId: string) => void;
}

export const YardFleetManager: React.FC<YardFleetManagerProps> = ({
  vehicles,
  docks,
  onOpenGateModal,
  onAssignVehicleToDock,
  onSelectDock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [assigningVehicleId, setAssigningVehicleId] = useState<string | null>(null);

  const calculateMinutesSince = (timeIso: string) => {
    const diffMs = Date.now() - new Date(timeIso).getTime();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const yardVehicles = vehicles.filter((v) => v.status === 'No Pátio (Espera)');
  const dockVehicles = vehicles.filter((v) => v.status === 'Em Doca');
  const completedVehicles = vehicles.filter((v) => v.status === 'Liberado (Concluído)');

  return (
    <div className="space-y-6">
      {/* Top Yard Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Veículos no Bolsão (Pátio)</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{yardVehicles.length}</div>
            <span className="text-[11px] text-slate-500">Aguardando doca livre</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Veículos Operando em Doca</span>
            <div className="text-2xl font-extrabold text-sky-400 mt-0.5">{dockVehicles.length}</div>
            <span className="text-[11px] text-slate-500">Carga e descarga ativas</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Liberados Hoje (Concluídos)</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{completedVehicles.length}</div>
            <span className="text-[11px] text-slate-500">Turnover acumulado no turno</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Tempo Médio de Espera (Pátio)</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5">38 min</div>
            <span className="text-[11px] text-rose-400/80 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3 h-3" /> Meta SLA: máx 30 min
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por placa, transportadora, motorista ou NF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['Todos', 'No Pátio (Espera)', 'Em Doca', 'Liberado (Concluído)'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'No Pátio (Espera)' ? 'No Pátio' : st === 'Liberado (Concluído)' ? 'Liberados' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenGateModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>+ Registrar Entrada na Portaria</span>
        </button>
      </div>

      {/* Vehicle Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Placa / Porte</th>
                <th className="px-4 py-3">Transportadora & Motorista</th>
                <th className="px-4 py-3">Operação</th>
                <th className="px-4 py-3">Status Atual</th>
                <th className="px-4 py-3">Entrada / Permanência</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((v) => {
                  const minutesInYard = calculateMinutesSince(v.entryTime);
                  const isWaitingLong = v.status === 'No Pátio (Espera)' && minutesInYard > 30;

                  // Compatible free docks if vehicle is waiting in yard
                  const compatibleDocks = docks.filter(
                    (d) => d.status === 'Livre' && d.allowedVehicles.includes(v.vehicleType)
                  );

                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition">
                      {/* Placa e Tipo */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                            {v.plate}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {v.vehicleType}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{v.id}</span>
                      </td>

                      {/* Transportadora e Motorista */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-200 max-w-[200px] truncate" title={v.carrier}>
                          {v.carrier}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{v.driverName}</span>
                          {v.driverPhone && <span className="text-slate-500">• {v.driverPhone}</span>}
                        </div>
                        <div className="text-[10px] text-slate-500">{v.documentNumber}</div>
                      </td>

                      {/* Operação */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                          v.operationType === 'Descarga'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : v.operationType === 'Carga'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {v.operationType === 'Descarga' && <ArrowDownCircle className="w-3 h-3" />}
                          {v.operationType === 'Carga' && <ArrowUpCircle className="w-3 h-3" />}
                          {v.operationType === 'Cross-docking' && <RotateCcw className="w-3 h-3" />}
                          {v.operationType}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {v.status === 'No Pátio (Espera)' ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isWaitingLong
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {v.status}
                          </span>
                        ) : v.status === 'Em Doca' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            Em Operação
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ Liberado
                          </span>
                        )}
                      </td>

                      {/* Tempo */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-slate-200">
                          {new Date(v.entryTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 ${isWaitingLong ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                          {minutesInYard} min decorridos
                        </div>
                      </td>

                      {/* Localização Atual */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {v.assignedDockId ? (
                          <button
                            onClick={() => {
                              const targetDock = docks.find((d) => d.id === v.assignedDockId);
                              if (targetDock) onSelectDock(targetDock);
                            }}
                            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold bg-sky-950/60 px-2 py-1 rounded border border-sky-800/80 cursor-pointer"
                          >
                            <span>Doca {v.assignedDockId < 10 ? `0${v.assignedDockId}` : v.assignedDockId}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-slate-500 italic">Bolsão Pátio</span>
                        )}
                      </td>

                      {/* Ação */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {v.status === 'No Pátio (Espera)' ? (
                          <div className="relative inline-block text-left">
                            {assigningVehicleId === v.id ? (
                              <div className="absolute right-0 bottom-full mb-1 z-30 bg-slate-950 border border-amber-500/60 p-2 rounded-lg shadow-2xl w-56 text-left">
                                <div className="text-[11px] font-bold text-amber-300 mb-1 flex items-center justify-between">
                                  <span>Escolher Doca Livre:</span>
                                  <button onClick={() => setAssigningVehicleId(null)} className="text-slate-400 hover:text-white">
                                    ×
                                  </button>
                                </div>
                                {compatibleDocks.length > 0 ? (
                                  <div className="space-y-1 max-h-36 overflow-y-auto">
                                    {compatibleDocks.map((d) => (
                                      <button
                                        key={d.id}
                                        onClick={() => {
                                          onAssignVehicleToDock(d.id, v.id);
                                          setAssigningVehicleId(null);
                                        }}
                                        className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-amber-500/20 text-slate-200 text-xs border border-slate-800 flex justify-between"
                                      >
                                        <span className="font-bold text-amber-400">{d.code}</span>
                                        <span className="text-[10px] text-slate-400">{d.category}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-rose-400 py-1">Nenhuma doca compatível livre no momento.</p>
                                )}
                              </div>
                            ) : null}

                            <button
                              onClick={() => setAssigningVehicleId(assigningVehicleId === v.id ? null : v.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <span>Alocar em Doca</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ) : v.status === 'Em Doca' ? (
                          <button
                            onClick={() => {
                              const targetDock = docks.find((d) => d.id === v.assignedDockId);
                              if (targetDock) onSelectDock(targetDock);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition cursor-pointer ml-auto"
                          >
                            Ver Operação
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Nenhum veículo encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

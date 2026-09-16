import React, { useState } from 'react';
import { 
  Dock, 
  Vehicle, 
  DockCategory, 
  DockStatus 
} from '../types/logistics';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Truck, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RotateCcw, 
  Snowflake,
  Filter,
  Check
} from 'lucide-react';

interface DockOverviewProps {
  docks: Dock[];
  vehicles: Vehicle[];
  onSelectDock: (dock: Dock) => void;
  onQuickReleaseDock: (dockId: number) => void;
  onQuickAssignVehicle: (dockId: number, vehicleId: string) => void;
  onOpenGateModalForDock: (dockId: number) => void;
}

export const DockOverview: React.FC<DockOverviewProps> = ({
  docks,
  vehicles,
  onSelectDock,
  onQuickReleaseDock,
  onQuickAssignVehicle,
  onOpenGateModalForDock,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [quickAssignDockId, setQuickAssignDockId] = useState<number | null>(null);

  // Filter docks
  const filteredDocks = docks.filter((d) => {
    const matchesCategory = categoryFilter === 'Todas' || d.category === categoryFilter;
    const matchesStatus = statusFilter === 'Todos' || d.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  // Eligible vehicles waiting in yard
  const waitingVehicles = vehicles.filter((v) => v.status === 'No Pátio (Espera)');

  const getStatusBadge = (status: DockStatus) => {
    switch (status) {
      case 'Livre':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Livre
          </span>
        );
      case 'Ocupada':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Em Operação
          </span>
        );
      case 'Aguardando Liberação':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-400" />
            Aguardando Liberação
          </span>
        );
      case 'Congestionada':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-rose-400 animate-pulse" />
            Atraso / SLA Estourado
          </span>
        );
      case 'Manutenção':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            <Wrench className="w-3 h-3 text-slate-400" />
            Manutenção
          </span>
        );
    }
  };

  const calculateElapsedMinutes = (startTimeStr?: string) => {
    if (!startTimeStr) return 0;
    const diffMs = Date.now() - new Date(startTimeStr).getTime();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </div>

          {/* Status buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['Todos', 'Livre', 'Ocupada', 'Aguardando Liberação', 'Congestionada'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'Todos' ? 'Todas' : st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="Todas">Todas as Categorias de Doca</option>
            <option value="Recebimento Pesado">Recebimento Pesado (Docas 01-04)</option>
            <option value="Expedição Geral">Expedição Geral (Docas 05-08)</option>
            <option value="Cross-Docking Rápido">Cross-Docking Rápido (Docas 09-12)</option>
            <option value="Refrigerada / Especial">Refrigerada / Frio (Docas 13-14)</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Livre
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Em Operação
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Aguardando Liberação
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Congestionada / Atraso
          </span>
        </div>
      </div>

      {/* Grid of 14 Docks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocks.map((dock) => {
          const vehicle = dock.currentVehicleId
            ? vehicles.find((v) => v.id === dock.currentVehicleId)
            : undefined;

          const elapsedMinutes = calculateElapsedMinutes(dock.operationStartTime);
          const progressPercent = Math.min(100, Math.round((elapsedMinutes / dock.slaMinutes) * 100));
          const isOverdue = elapsedMinutes > dock.slaMinutes && (dock.status === 'Ocupada' || dock.status === 'Congestionada');

          // Border color by status
          let borderClass = 'border-slate-800 hover:border-slate-700';
          let headerBg = 'bg-slate-900';
          if (dock.status === 'Livre') {
            borderClass = 'border-emerald-500/20 hover:border-emerald-500/40 bg-slate-900/60';
            headerBg = 'bg-emerald-950/20';
          } else if (dock.status === 'Ocupada') {
            borderClass = 'border-sky-500/30 hover:border-sky-500/50 bg-slate-900';
            headerBg = 'bg-sky-950/30';
          } else if (dock.status === 'Aguardando Liberação') {
            borderClass = 'border-amber-500/40 hover:border-amber-500/60 bg-amber-950/10';
            headerBg = 'bg-amber-950/30';
          } else if (dock.status === 'Congestionada') {
            borderClass = 'border-rose-500/60 ring-1 ring-rose-500/40 bg-rose-950/10';
            headerBg = 'bg-rose-950/40';
          } else if (dock.status === 'Manutenção') {
            borderClass = 'border-slate-800 opacity-60 bg-slate-950';
            headerBg = 'bg-slate-900';
          }

          return (
            <div
              key={dock.id}
              id={`dock-card-${dock.id}`}
              className={`rounded-xl border ${borderClass} transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md`}
            >
              {/* Card Header */}
              <div className={`${headerBg} p-3.5 border-b border-slate-800/80 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
                    {dock.id < 10 ? `0${dock.id}` : dock.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{dock.code}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      {dock.category}
                      {dock.temperatureControlled && (
                        <Snowflake className="w-3 h-3 text-cyan-400 inline" title="Controle Térmico Ativo" />
                      )}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(dock.status)}</div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {vehicle ? (
                  <div className="space-y-2.5">
                    {/* Vehicle Plate & Operator */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-base text-slate-100 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                            {vehicle.plate}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium px-1.5 py-0.5 rounded bg-slate-800">
                            {vehicle.vehicleType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 font-medium truncate max-w-[200px]" title={vehicle.carrier}>
                          {vehicle.carrier}
                        </p>
                      </div>

                      {/* Operation Type Icon */}
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                        vehicle.operationType === 'Descarga'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : vehicle.operationType === 'Carga'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {vehicle.operationType === 'Descarga' ? (
                          <ArrowDownCircle className="w-3 h-3" />
                        ) : vehicle.operationType === 'Carga' ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        {vehicle.operationType}
                      </span>
                    </div>

                    {/* Progress Bar and Elapsed Timer */}
                    <div className="space-y-1 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Tempo em Doca:
                        </span>
                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                          {elapsedMinutes} min / {dock.slaMinutes} min SLA
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverdue
                              ? 'bg-rose-500'
                              : progressPercent > 80
                              ? 'bg-amber-500'
                              : 'bg-sky-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {isOverdue && (
                        <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Estouro de SLA em +{elapsedMinutes - dock.slaMinutes} min
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      <span className="text-slate-500">Doc:</span> {vehicle.documentNumber}
                    </div>
                  </div>
                ) : dock.status === 'Livre' ? (
                  <div className="py-5 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-400">Doca Pronta para Alocação</p>
                    <p className="text-[11px] text-slate-400">
                      Rampa: {dock.rampType}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Permitidos: {dock.allowedVehicles.join(', ')}
                    </p>
                  </div>
                ) : dock.status === 'Manutenção' ? (
                  <div className="py-6 text-center space-y-1.5">
                    <Wrench className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-400">Doca em Manutenção Preventiva</p>
                    <p className="text-[10px] text-slate-500">Reparo de atuador pneumático</p>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-amber-300">Conferência Finalizada</p>
                    <p className="text-[11px] text-slate-400">Aguardando saída física do veículo</p>
                  </div>
                )}

                {/* Card Quick Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                  {dock.status === 'Livre' ? (
                    <>
                      {waitingVehicles.length > 0 ? (
                        <div className="relative flex-1">
                          {quickAssignDockId === dock.id ? (
                            <div className="bg-slate-950 p-2 rounded-lg border border-amber-500/60 space-y-2 absolute bottom-full mb-1 left-0 right-0 z-20 shadow-xl">
                              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                                <span>Chamar do Pátio:</span>
                                <button
                                  onClick={() => setQuickAssignDockId(null)}
                                  className="text-slate-400 hover:text-white"
                                >
                                  ×
                                </button>
                              </div>
                              <div className="max-h-36 overflow-y-auto space-y-1">
                                {waitingVehicles
                                  .filter((v) => dock.allowedVehicles.includes(v.vehicleType))
                                  .map((v) => (
                                    <button
                                      key={v.id}
                                      onClick={() => {
                                        onQuickAssignVehicle(dock.id, v.id);
                                        setQuickAssignDockId(null);
                                      }}
                                      className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-amber-500/20 text-slate-200 text-xs flex items-center justify-between cursor-pointer border border-slate-800"
                                    >
                                      <div>
                                        <span className="font-mono font-bold text-amber-400">{v.plate}</span>
                                        <span className="text-[10px] text-slate-400 ml-1.5">({v.vehicleType})</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400">{v.operationType}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ) : null}

                          <button
                            id={`btn-call-yard-${dock.id}`}
                            onClick={() => setQuickAssignDockId(quickAssignDockId === dock.id ? null : dock.id)}
                            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Chamar do Pátio ({waitingVehicles.length})</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenGateModalForDock(dock.id)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
                        >
                          + Entrada Direta
                        </button>
                      )}
                    </>
                  ) : dock.status === 'Aguardando Liberação' ? (
                    <button
                      id={`btn-release-dock-${dock.id}`}
                      onClick={() => onQuickReleaseDock(dock.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Liberar Doca (Check-out)</span>
                    </button>
                  ) : dock.status === 'Ocupada' || dock.status === 'Congestionada' ? (
                    <button
                      id={`btn-manage-dock-${dock.id}`}
                      onClick={() => onSelectDock(dock)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Gerenciar Operação</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectDock(dock)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 text-xs transition cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  )}

                  <button
                    onClick={() => onSelectDock(dock)}
                    title="Detalhes técnicos da doca"
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
                  >
                    ℹ️
                  </button>
                </div>
              </div>

              {/* Card Footer turnover indicator */}
              <div className="bg-slate-950/90 px-3 py-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Giro Hoje: <strong className="text-slate-200">{dock.turnoverToday} veículos</strong></span>
                <span>Tempo Ativo: <strong className="text-slate-200">{dock.totalOccupiedMinutesToday} min</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

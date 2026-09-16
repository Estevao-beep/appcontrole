import React, { useState } from 'react';
import { Dock, Vehicle, DockStatus } from '../types/logistics';
import { 
  X, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  ArrowDownCircle, 
  ArrowUpCircle,
  FileText,
  User,
  Phone,
  ShieldCheck
} from 'lucide-react';

interface DockDetailModalProps {
  dock: Dock | null;
  vehicles: Vehicle[];
  onClose: () => void;
  onUpdateDockStatus: (dockId: number, status: DockStatus) => void;
  onReleaseDock: (dockId: number) => void;
  onAssignVehicle: (dockId: number, vehicleId: string) => void;
}

export const DockDetailModal: React.FC<DockDetailModalProps> = ({
  dock,
  vehicles,
  onClose,
  onUpdateDockStatus,
  onReleaseDock,
  onAssignVehicle,
}) => {
  if (!dock) return null;

  const currentVehicle = dock.currentVehicleId
    ? vehicles.find((v) => v.id === dock.currentVehicleId)
    : undefined;

  const waitingVehicles = vehicles.filter(
    (v) => v.status === 'No Pátio (Espera)' && dock.allowedVehicles.includes(v.vehicleType)
  );

  const [selectedYardVehicleId, setSelectedYardVehicleId] = useState<string>('');

  const calculateElapsedMinutes = (startTimeStr?: string) => {
    if (!startTimeStr) return 0;
    const diffMs = Date.now() - new Date(startTimeStr).getTime();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  const elapsedMinutes = calculateElapsedMinutes(dock.operationStartTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-400 text-lg">
              {dock.id < 10 ? `0${dock.id}` : dock.id}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">{dock.name}</h2>
              <p className="text-xs text-slate-400">{dock.category} • Rampa: {dock.rampType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & SLA Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Status Operacional</span>
              <span className="text-sm font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 inline-block">
                {dock.status}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-1">SLA Padrão de Operação</span>
              <span className="font-mono text-sm font-bold text-amber-400">
                {dock.slaMinutes} minutos
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-1">Veículos Atendidos Hoje</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {dock.turnoverToday} veículos
              </span>
            </div>
          </div>

          {/* Current Vehicle Section */}
          {currentVehicle ? (
            <div className="bg-slate-950/60 p-5 rounded-xl border border-sky-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-200">Veículo em Operação na Doca</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {currentVehicle.operationType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Placa do Veículo</span>
                  <span className="font-mono text-base font-extrabold text-white">
                    {currentVehicle.plate} ({currentVehicle.vehicleType})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Transportadora</span>
                  <span className="font-semibold text-slate-200">
                    {currentVehicle.carrier}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Motorista</span>
                  <span className="font-medium text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {currentVehicle.driverName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Contato / Telefone</span>
                  <span className="font-mono text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {currentVehicle.driverPhone || 'Não informado'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Documento Fiscal</span>
                  <span className="font-mono text-slate-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    {currentVehicle.documentNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Tempo Decorrido na Doca</span>
                  <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {elapsedMinutes} min (Meta: {dock.slaMinutes} min)
                  </span>
                </div>
              </div>

              {currentVehicle.cargoDescription && (
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-0.5">Descrição da Carga:</span>
                  <p className="text-slate-300">{currentVehicle.cargoDescription}</p>
                </div>
              )}

              {currentVehicle.notes && (
                <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30 text-xs text-amber-300">
                  <strong className="block mb-0.5">Observação Operacional:</strong>
                  {currentVehicle.notes}
                </div>
              )}

              {/* Action buttons for active dock */}
              <div className="pt-2 flex flex-wrap gap-2">
                {dock.status === 'Ocupada' && (
                  <button
                    onClick={() => onUpdateDockStatus(dock.id, 'Aguardando Liberação')}
                    className="flex-1 py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Finalizar Operação Física (Ir para Conferência)
                  </button>
                )}

                <button
                  onClick={() => onReleaseDock(dock.id)}
                  className="flex-1 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Liberar Doca Imediatamente (Check-out)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Alocar Veículo do Pátio de Espera
              </h3>

              {waitingVehicles.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Selecione um dos {waitingVehicles.length} veículos compatíveis aguardando no pátio:
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={selectedYardVehicleId}
                      onChange={(e) => setSelectedYardVehicleId(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="">Selecione um veículo...</option>
                      {waitingVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.plate} - {v.carrier} ({v.vehicleType} | {v.operationType})
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!selectedYardVehicleId}
                      onClick={() => {
                        if (selectedYardVehicleId) {
                          onAssignVehicle(dock.id, selectedYardVehicleId);
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Direcionar para Doca
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  Não há veículos no bolsão de espera compatíveis com o tipo desta doca ({dock.allowedVehicles.join(', ')}).
                </p>
              )}
            </div>
          )}

          {/* Technical Specs & Constraints */}
          <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
            <h4 className="font-bold text-slate-300">Especificações e Restrições Físicas da Doca</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block">Tipo de Rampa:</span>
                <span className="font-semibold text-slate-300">{dock.rampType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Veículos Permitidos:</span>
                <span className="font-semibold text-slate-300">{dock.allowedVehicles.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Controle Térmico:</span>
                <span className="font-semibold text-slate-300">
                  {dock.temperatureControlled ? 'Sim (-18°C a +4°C)' : 'Não'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Override */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Controle Manual de Manutenção:</span>
            <div className="flex gap-2">
              {dock.status === 'Manutenção' ? (
                <button
                  onClick={() => onUpdateDockStatus(dock.id, 'Livre')}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 transition cursor-pointer font-semibold"
                >
                  Concluir Manutenção & Liberar
                </button>
              ) : (
                <button
                  onClick={() => onUpdateDockStatus(dock.id, 'Manutenção')}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                >
                  Interditar para Manutenção
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

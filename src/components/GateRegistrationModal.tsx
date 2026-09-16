import React, { useState } from 'react';
import { Dock, Vehicle, VehicleType, OperationType } from '../types/logistics';
import { 
  X, 
  Truck, 
  FileText, 
  User, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RotateCcw 
} from 'lucide-react';

interface GateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  docks: Dock[];
  initialDockId?: number;
  onRegisterVehicle: (newVehicle: Omit<Vehicle, 'id' | 'entryTime'>) => void;
}

export const GateRegistrationModal: React.FC<GateRegistrationModalProps> = ({
  isOpen,
  onClose,
  docks,
  initialDockId,
  onRegisterVehicle,
}) => {
  if (!isOpen) return null;

  const [plate, setPlate] = useState('');
  const [carrier, setCarrier] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Carreta');
  const [operationType, setOperationType] = useState<OperationType>('Descarga');
  const [documentNumber, setDocumentNumber] = useState('');
  const [cargoDescription, setCargoDescription] = useState('');
  const [destinationChoice, setDestinationChoice] = useState<'yard' | 'dock'>(
    initialDockId ? 'dock' : 'yard'
  );
  const [selectedDockId, setSelectedDockId] = useState<number | undefined>(initialDockId);
  const [priority, setPriority] = useState<Vehicle['priority']>('Normal');
  const [notes, setNotes] = useState('');

  // Compatible free docks
  const compatibleFreeDocks = docks.filter(
    (d) => d.status === 'Livre' && d.allowedVehicles.includes(vehicleType)
  );

  const handleQuickDemoFill = () => {
    const demoPlates = ['RTE8A22', 'KPL4J90', 'GHB1C33', 'MER7F55', 'BTX9M10'];
    const demoCarriers = ['Expresso Rodoviário Veloz', 'TransBrasil Cargas', 'Alfa Logística Inteligente', 'Pontual Cargas Pesadas'];
    const demoDrivers = ['Severino Gomes da Costa', 'Anderson Luis Santos', 'Tiago Ribeiro', 'Claudio Donizete'];
    const randomPlate = demoPlates[Math.floor(Math.random() * demoPlates.length)];
    const randomCarrier = demoCarriers[Math.floor(Math.random() * demoCarriers.length)];
    const randomDriver = demoDrivers[Math.floor(Math.random() * demoDrivers.length)];

    setPlate(randomPlate);
    setCarrier(randomCarrier);
    setDriverName(randomDriver);
    setDriverPhone('(11) 98765-4321');
    setDocumentNumber(`NF-e ${Math.floor(100000 + Math.random() * 900000)}`);
    setCargoDescription('Paletes com produtos manufaturados e insumos');
    setNotes('Veículo verificado na portaria. Lacre intacto.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim() || !carrier.trim()) return;

    let targetDuration = 60;
    if (vehicleType === 'VUC') targetDuration = 30;
    else if (vehicleType === 'Toco') targetDuration = 45;
    else if (vehicleType === 'Truck') targetDuration = 60;
    else if (vehicleType === 'Carreta') targetDuration = 80;
    else if (vehicleType === 'Bitrem') targetDuration = 100;

    const assignedDock = destinationChoice === 'dock' && selectedDockId ? selectedDockId : undefined;

    onRegisterVehicle({
      plate: plate.toUpperCase().trim(),
      carrier: carrier.trim(),
      driverName: driverName.trim() || 'Motorista Portaria',
      driverPhone: driverPhone.trim(),
      vehicleType,
      operationType,
      documentNumber: documentNumber.trim() || 'S/N - Aguardando Emissão',
      cargoDescription: cargoDescription.trim() || 'Carga mista em paletes',
      status: assignedDock ? 'Em Doca' : 'No Pátio (Espera)',
      assignedDockId: assignedDock,
      dockStartTime: assignedDock ? new Date().toISOString() : undefined,
      targetDurationMinutes: targetDuration,
      priority,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const vehicleTypes: VehicleType[] = ['VUC', 'Toco', 'Truck', 'Carreta', 'Bitrem'];
  const operationTypes: OperationType[] = ['Descarga', 'Carga', 'Cross-docking', 'Devolução'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Portaria: Registro Rápido de Entrada</h2>
              <p className="text-xs text-slate-400">Triagem de veículo e direcionamento para pátio ou doca</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Preencher</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Placa e Tipo de Veículo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Placa do Veículo *</label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="Ex: BRA2E19"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-sm uppercase px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transportadora / Frota *</label>
              <input
                type="text"
                required
                placeholder="Ex: TransLog Sul Express"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Tipo de Veículo Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Porte do Veículo</label>
            <div className="grid grid-cols-5 gap-1.5">
              {vehicleTypes.map((vt) => (
                <button
                  type="button"
                  key={vt}
                  onClick={() => setVehicleType(vt)}
                  className={`py-1.5 px-1 text-center rounded-lg font-bold transition cursor-pointer border ${
                    vehicleType === vt
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {vt}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Operação */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Tipo de Operação</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {operationTypes.map((op) => (
                <button
                  type="button"
                  key={op}
                  onClick={() => setOperationType(op)}
                  className={`py-1.5 px-2 text-center rounded-lg font-semibold transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                    operationType === op
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {op === 'Descarga' && <ArrowDownCircle className="w-3.5 h-3.5" />}
                  {op === 'Carga' && <ArrowUpCircle className="w-3.5 h-3.5" />}
                  {op === 'Cross-docking' && <RotateCcw className="w-3.5 h-3.5" />}
                  <span>{op}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motorista e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nome do Motorista</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Telefone / WhatsApp</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="(DDD) 99999-9999"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Documento Fiscal & Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">NF-e / CT-e / Manifesto</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: NF-e 991.020"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <FileText className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="Normal">Normal (Fila Padrão)</option>
                <option value="Alta">Alta Prioridade</option>
                <option value="Urgente">Urgente (Carga Perecível / Conexão)</option>
                <option value="Baixa">Baixa Prioridade</option>
              </select>
            </div>
          </div>

          {/* Destino Imediato */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="block font-semibold text-slate-200">Destino Inicial do Veículo</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="destChoice"
                  checked={destinationChoice === 'yard'}
                  onChange={() => setDestinationChoice('yard')}
                  className="text-amber-500 focus:ring-0"
                />
                <span>Enviar para Bolsão de Espera (Pátio)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="destChoice"
                  checked={destinationChoice === 'dock'}
                  onChange={() => setDestinationChoice('dock')}
                  className="text-amber-500 focus:ring-0"
                />
                <span>Direcionar Imediatamente para Doca Livre</span>
              </label>
            </div>

            {destinationChoice === 'dock' && (
              <div className="pt-2">
                {compatibleFreeDocks.length > 0 ? (
                  <div>
                    <label className="block text-slate-400 mb-1">Selecione uma doca livre compatível:</label>
                    <select
                      value={selectedDockId || ''}
                      onChange={(e) => setSelectedDockId(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-emerald-500/50 text-white p-2 rounded-lg"
                    >
                      <option value="">Selecione a Doca...</option>
                      {compatibleFreeDocks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} - {d.name} ({d.category})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-rose-400 text-xs">
                    ⚠️ Nenhuma das 14 docas livres é compatível com {vehicleType} no momento. O veículo será enviado ao pátio.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Entrada no Depósito</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

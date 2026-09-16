export type VehicleType = 'VUC' | 'Toco' | 'Truck' | 'Carreta' | 'Bitrem';

export type OperationType = 'Descarga' | 'Carga' | 'Cross-docking' | 'Devolução';

export type VehicleStatus = 'Em Trânsito' | 'No Pátio (Espera)' | 'Em Doca' | 'Liberado (Concluído)';

export type DockStatus = 'Livre' | 'Ocupada' | 'Aguardando Liberação' | 'Congestionada' | 'Manutenção';

export type DockCategory = 'Recebimento Pesado' | 'Expedição Geral' | 'Cross-Docking Rápido' | 'Refrigerada / Especial';

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone?: string;
  carrier: string;
  vehicleType: VehicleType;
  operationType: OperationType;
  documentNumber: string; // NF / CTe
  cargoDescription: string;
  status: VehicleStatus;
  entryTime: string; // ISO string
  assignedDockId?: number;
  dockStartTime?: string;
  dockEndTime?: string;
  exitTime?: string;
  targetDurationMinutes: number;
  actualDurationMinutes?: number;
  notes?: string;
  priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
}

export interface Dock {
  id: number;
  code: string; // e.g. "DOCA-01"
  name: string;
  category: DockCategory;
  allowedVehicles: VehicleType[];
  status: DockStatus;
  currentVehicleId?: string;
  currentVehicle?: Vehicle;
  operationStartTime?: string;
  estimatedCompletionTime?: string;
  slaMinutes: number;
  temperatureControlled?: boolean;
  rampType: 'Hidráulica Niveladora' | 'Pneumática' | 'Padrão Manual';
  turnoverToday: number;
  totalOccupiedMinutesToday: number;
}

export interface CongestionPoint {
  hour: string;
  vehiclesWaiting: number;
  docksOccupied: number;
  avgDwellMinutes: number;
  severity: 'normal' | 'alerta' | 'critico';
}

export interface LogisticsKPIs {
  dockUtilizationRate: number; // %
  avgDwellTimeMinutes: number; // Portaria a portaria
  avgDockOperationMinutes: number; // Em doca
  totalVehiclesHandledToday: number;
  vehiclesInYardWaiting: number;
  vehiclesInDocks: number;
  docksAvailableCount: number;
  dockTurnoverRate: number; // Veículos / Doca / Dia
  slaComplianceRate: number; // %
  criticalBottlenecksCount: number;
}

export interface BestPracticeSuggestion {
  id: string;
  title: string;
  category: 'Agendamento' | 'Layout & Alocação' | 'Processo Documental' | 'Gestão de Gargalo';
  impact: 'Alto' | 'Médio' | 'Crítico';
  metricTarget: string;
  diagnosis: string;
  actionablePlan: string;
  suggestedActionLabel?: string;
  implemented?: boolean;
}

export interface SimulationScenario {
  id: 'normal' | 'pico_congestionado' | 'otimizado';
  label: string;
  description: string;
}

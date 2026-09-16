import React from 'react';
import { 
  Truck, 
  Warehouse, 
  BarChart3, 
  Lightbulb, 
  Printer, 
  FileCode2, 
  PlusCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { SimulationScenario } from '../types/logistics';

interface HeaderProps {
  activeTab: 'docks' | 'yard' | 'kpis' | 'suggestions' | 'reports' | 'spec';
  setActiveTab: (tab: 'docks' | 'yard' | 'kpis' | 'suggestions' | 'reports' | 'spec') => void;
  onOpenNewVehicleModal: () => void;
  occupiedDocksCount: number;
  totalDocksCount: number;
  waitingYardCount: number;
  currentScenario: SimulationScenario['id'];
  onSelectScenario: (scenario: SimulationScenario['id']) => void;
  onResetData: () => void;
}

interface NavItem {
  id: 'docks' | 'yard' | 'kpis' | 'suggestions' | 'reports' | 'spec';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewVehicleModal,
  occupiedDocksCount,
  totalDocksCount,
  waitingYardCount,
  currentScenario,
  onSelectScenario,
  onResetData,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { id: 'docks', label: 'Monitor das 14 Docas', icon: Warehouse },
    { id: 'yard', label: 'Portaria & Pátio', icon: Truck },
    { id: 'kpis', label: 'KPIs & Gargalos', icon: BarChart3 },
    { id: 'suggestions', label: 'Boas Práticas & IA', icon: Lightbulb },
    { id: 'reports', label: 'Relatórios & Impressão', icon: Printer },
    { id: 'spec', label: 'Especificação Arquitetural', icon: FileCode2, highlight: true },
  ];

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner with System Status and Quick Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">DocasFlow</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operação ao Vivo (Turno 1)
              </span>
            </div>
            <p className="text-xs text-slate-400">Sistema Especialista de Gestão de Pátio & Docas (YMS)</p>
          </div>
        </div>

        {/* Live Operational Metrics Pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium">{currentTime}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 border-r border-slate-800">
            <span className="text-slate-400">Docas:</span>
            <span className="font-semibold text-white">
              {occupiedDocksCount}/{totalDocksCount}
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              occupiedDocksCount >= 12 ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {Math.round((occupiedDocksCount / totalDocksCount) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-slate-400">Pátio em espera:</span>
            <span className={`font-semibold ${waitingYardCount > 4 ? 'text-amber-400' : 'text-slate-200'}`}>
              {waitingYardCount} veículos
            </span>
            {waitingYardCount > 4 && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            )}
          </div>
        </div>

        {/* Simulation Scenario & New Vehicle CTA */}
        <div className="flex items-center gap-2">
          {/* Scenario Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <span className="text-slate-400 px-2 font-medium hidden sm:inline">Cenário:</span>
            <select
              value={currentScenario}
              onChange={(e) => onSelectScenario(e.target.value as any)}
              className="bg-transparent text-slate-200 py-1 px-2 focus:outline-none cursor-pointer text-xs"
            >
              <option value="normal" className="bg-slate-900 text-slate-200">Operação Padrão</option>
              <option value="pico_congestionado" className="bg-slate-900 text-rose-400">Pico Crítico (09:00h)</option>
              <option value="otimizado" className="bg-slate-900 text-emerald-400">Pós-Otimização (Com IA)</option>
            </select>
          </div>

          <button
            onClick={onResetData}
            title="Restaurar dados iniciais"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            id="btn-quick-entry"
            onClick={onOpenNewVehicleModal}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrada</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-950/70 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${item.highlight && !isActive ? 'text-cyan-400 hover:text-cyan-300 font-bold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'spec' && (
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-700/50 px-1.5 py-0.2 rounded font-mono">
                    SDD
                  </span>
                )}
                {item.id === 'suggestions' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                    4
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

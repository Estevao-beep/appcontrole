import React, { useState, useEffect } from 'react';
import { 
  INITIAL_DOCKS, 
  INITIAL_VEHICLES, 
  INITIAL_SUGGESTIONS 
} from './data/initialData';
import { 
  Dock, 
  Vehicle, 
  DockStatus, 
  SimulationScenario, 
  BestPracticeSuggestion 
} from './types/logistics';
import { Header } from './components/Header';
import { DockOverview } from './components/DockOverview';
import { DockDetailModal } from './components/DockDetailModal';
import { GateRegistrationModal } from './components/GateRegistrationModal';
import { YardFleetManager } from './components/YardFleetManager';
import { AnalyticsKPIs } from './components/AnalyticsKPIs';
import { SmartAdvisory } from './components/SmartAdvisory';
import { PrintableReports } from './components/PrintableReports';
import { TechnicalSpecViewer } from './components/TechnicalSpecViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'docks' | 'yard' | 'kpis' | 'suggestions' | 'reports' | 'spec'
  >('docks');

  // Load from localStorage if available, or fall back to INITIAL
  const [docks, setDocks] = useState<Dock[]>(() => {
    const saved = localStorage.getItem('docasflow_docks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DOCKS;
      }
    }
    return INITIAL_DOCKS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('docasflow_vehicles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_VEHICLES;
      }
    }
    return INITIAL_VEHICLES;
  });

  const [suggestions, setSuggestions] = useState<BestPracticeSuggestion[]>(INITIAL_SUGGESTIONS);
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario['id']>('normal');

  // Modals state
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [gateInitialDockId, setGateInitialDockId] = useState<number | undefined>(undefined);
  const [selectedDockForDetail, setSelectedDockForDetail] = useState<Dock | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('docasflow_docks', JSON.stringify(docks));
  }, [docks]);

  useEffect(() => {
    localStorage.setItem('docasflow_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Operational metrics
  const occupiedDocksCount = docks.filter(
    (d) => d.status === 'Ocupada' || d.status === 'Congestionada' || d.status === 'Aguardando Liberação'
  ).length;

  const waitingYardCount = vehicles.filter((v) => v.status === 'No Pátio (Espera)').length;

  // Register vehicle from Gate
  const handleRegisterVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'entryTime'>) => {
    const newId = `VEH-${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle: Vehicle = {
      ...newVehicleData,
      id: newId,
      entryTime: new Date().toISOString(),
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    // If directed immediately to a dock
    if (newVehicle.assignedDockId) {
      const targetDockId = newVehicle.assignedDockId;
      setDocks((prevDocks) =>
        prevDocks.map((d) => {
          if (d.id === targetDockId) {
            return {
              ...d,
              status: 'Ocupada',
              currentVehicleId: newId,
              operationStartTime: new Date().toISOString(),
              estimatedCompletionTime: new Date(Date.now() + d.slaMinutes * 60000).toISOString(),
              totalOccupiedMinutesToday: d.totalOccupiedMinutesToday + d.slaMinutes,
            };
          }
          return d;
        })
      );
    }
  };

  // Assign vehicle from Yard to Dock
  const handleAssignVehicleToDock = (dockId: number, vehicleId: string) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) return;

    // Update vehicle
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: 'Em Doca',
            assignedDockId: dockId,
            dockStartTime: new Date().toISOString(),
          };
        }
        return v;
      })
    );

    // Update dock
    setDocks((prev) =>
      prev.map((d) => {
        if (d.id === dockId) {
          return {
            ...d,
            status: 'Ocupada',
            currentVehicleId: vehicleId,
            operationStartTime: new Date().toISOString(),
            estimatedCompletionTime: new Date(Date.now() + d.slaMinutes * 60000).toISOString(),
          };
        }
        return d;
      })
    );

    if (selectedDockForDetail?.id === dockId) {
      setSelectedDockForDetail((prev) => (prev ? { ...prev, status: 'Ocupada', currentVehicleId: vehicleId } : null));
    }
  };

  // Update dock status (e.g. Manutenção, Aguardando Liberação)
  const handleUpdateDockStatus = (dockId: number, status: DockStatus) => {
    setDocks((prev) =>
      prev.map((d) => {
        if (d.id === dockId) {
          return { ...d, status };
        }
        return d;
      })
    );

    if (selectedDockForDetail?.id === dockId) {
      setSelectedDockForDetail((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Release Dock (Check-out)
  const handleReleaseDock = (dockId: number) => {
    const targetDock = docks.find((d) => d.id === dockId);
    const vehicleId = targetDock?.currentVehicleId;

    if (vehicleId) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === vehicleId) {
            const entryDate = new Date(v.entryTime).getTime();
            const actualDuration = Math.round((Date.now() - entryDate) / 60000);
            return {
              ...v,
              status: 'Liberado (Concluído)',
              exitTime: new Date().toISOString(),
              dockEndTime: new Date().toISOString(),
              actualDurationMinutes: actualDuration,
            };
          }
          return v;
        })
      );
    }

    setDocks((prev) =>
      prev.map((d) => {
        if (d.id === dockId) {
          return {
            ...d,
            status: 'Livre',
            currentVehicleId: undefined,
            operationStartTime: undefined,
            estimatedCompletionTime: undefined,
            turnoverToday: d.turnoverToday + 1,
          };
        }
        return d;
      })
    );

    if (selectedDockForDetail?.id === dockId) {
      setSelectedDockForDetail(null);
    }
  };

  // Reset to initial baseline
  const handleResetData = () => {
    localStorage.removeItem('docasflow_docks');
    localStorage.removeItem('docasflow_vehicles');
    setDocks(INITIAL_DOCKS);
    setVehicles(INITIAL_VEHICLES);
    setSuggestions(INITIAL_SUGGESTIONS);
    setCurrentScenario('normal');
  };

  // Toggle optimization suggestion
  const handleToggleSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, implemented: !s.implemented } : s))
    );
  };

  // Switch simulation scenario
  const handleSelectScenario = (scenario: SimulationScenario['id']) => {
    setCurrentScenario(scenario);

    if (scenario === 'pico_congestionado') {
      // Simulate extreme 09:00h congestion: 13 docks busy, 9 vehicles waiting in yard
      setDocks((prev) =>
        prev.map((d) => {
          if (d.id === 8) return d; // Keep maintenance
          return {
            ...d,
            status: d.id === 2 || d.id === 1 ? 'Congestionada' : 'Ocupada',
          };
        })
      );
    } else if (scenario === 'otimizado') {
      // Smooth flow: Doca 08 fixed, load balanced, only 1 waiting in yard
      setDocks((prev) =>
        prev.map((d) => {
          if (d.id === 8) {
            return {
              ...d,
              status: 'Livre',
              category: 'Expedição Geral',
            };
          }
          if (d.id === 3 || d.id === 7 || d.id === 11 || d.id === 12 || d.id === 14) {
            return {
              ...d,
              status: 'Livre',
              currentVehicleId: undefined,
            };
          }
          return d;
        })
      );
      setSuggestions((prev) => prev.map((s) => ({ ...s, implemented: true })));
    } else {
      handleResetData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation & Status Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewVehicleModal={() => {
          setGateInitialDockId(undefined);
          setIsGateModalOpen(true);
        }}
        occupiedDocksCount={occupiedDocksCount}
        totalDocksCount={docks.length}
        waitingYardCount={waitingYardCount}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'docks' && (
          <DockOverview
            docks={docks}
            vehicles={vehicles}
            onSelectDock={(dock) => setSelectedDockForDetail(dock)}
            onQuickReleaseDock={handleReleaseDock}
            onQuickAssignVehicle={handleAssignVehicleToDock}
            onOpenGateModalForDock={(dockId) => {
              setGateInitialDockId(dockId);
              setIsGateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'yard' && (
          <YardFleetManager
            vehicles={vehicles}
            docks={docks}
            onOpenGateModal={() => {
              setGateInitialDockId(undefined);
              setIsGateModalOpen(true);
            }}
            onAssignVehicleToDock={handleAssignVehicleToDock}
            onSelectDock={(dock) => setSelectedDockForDetail(dock)}
          />
        )}

        {activeTab === 'kpis' && <AnalyticsKPIs />}

        {activeTab === 'suggestions' && (
          <SmartAdvisory
            suggestions={suggestions}
            onToggleImplemented={handleToggleSuggestion}
            onApplyPresetScenario={(sc) => handleSelectScenario(sc)}
          />
        )}

        {activeTab === 'reports' && (
          <PrintableReports vehicles={vehicles} docks={docks} />
        )}

        {activeTab === 'spec' && <TechnicalSpecViewer />}
      </main>

      {/* Footer (hidden in print mode) */}
      <footer className="no-print bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DocasFlow • Sistema de Gestão de Pátio e Docas (YMS)</span>
          <span className="text-[11px] text-slate-500">
            Arquitetura Híbrida: Vercel Blob Snapshots • Google Drive Reporting • React 19 & Tailwind 4
          </span>
        </div>
      </footer>

      {/* Modals */}
      {isGateModalOpen && (
        <GateRegistrationModal
          isOpen={isGateModalOpen}
          onClose={() => {
            setIsGateModalOpen(false);
            setGateInitialDockId(undefined);
          }}
          docks={docks}
          initialDockId={gateInitialDockId}
          onRegisterVehicle={handleRegisterVehicle}
        />
      )}

      {selectedDockForDetail && (
        <DockDetailModal
          dock={selectedDockForDetail}
          vehicles={vehicles}
          onClose={() => setSelectedDockForDetail(null)}
          onUpdateDockStatus={handleUpdateDockStatus}
          onReleaseDock={handleReleaseDock}
          onAssignVehicle={handleAssignVehicleToDock}
        />
      )}
    </div>
  );
}

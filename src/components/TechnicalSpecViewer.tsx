import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Workflow, 
  HardDrive, 
  BarChart4, 
  Copy, 
  Check, 
  Server, 
  Terminal,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const TechnicalSpecViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'storage' | 'arch' | 'flows' | 'schemas' | 'modules' | 'stack' | 'kpis' | 'roadmap'
  >('storage');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    { id: 'storage', label: '1. Persistência: Vercel Blob vs Google Drive', icon: HardDrive },
    { id: 'arch', label: '2. Arquitetura Técnica C4 (Visão Geral)', icon: Layers },
    { id: 'flows', label: '3. Fluxo do Usuário (BPMN Passo a Passo)', icon: Workflow },
    { id: 'schemas', label: '4. Estrutura de Dados & Schemas JSON/TS', icon: Database },
    { id: 'modules', label: '5. Módulos & Matriz de Funcionalidades', icon: Cpu },
    { id: 'kpis', label: '6. Fórmulas de KPIs & Métricas', icon: BarChart4 },
    { id: 'stack', label: '7. Stack Tecnológica Recomendada', icon: Server },
    { id: 'roadmap', label: '8. Plano de Entrega & Guia do Desenvolvedor', icon: Terminal },
  ] as const;

  const jsonSchemaVehicle = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VehicleMovement",
  "type": "object",
  "required": [
    "id",
    "plate",
    "carrier",
    "vehicleType",
    "operationType",
    "status",
    "entryTime"
  ],
  "properties": {
    "id": { "type": "string", "example": "VEH-2026-0042" },
    "plate": { 
      "type": "string", 
      "pattern": "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-[0-9]{4}$",
      "description": "Placa padrão Mercosul ou antigo"
    },
    "driver": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "phone": { "type": "string" },
        "cnh": { "type": "string" }
      }
    },
    "carrier": { "type": "string" },
    "vehicleType": { 
      "type": "string", 
      "enum": ["VUC", "Toco", "Truck", "Carreta", "Bitrem"] 
    },
    "operationType": { 
      "type": "string", 
      "enum": ["Descarga", "Carga", "Cross-docking", "Devolução"] 
    },
    "fiscalDocument": {
      "type": "object",
      "properties": {
        "number": { "type": "string" },
        "chaveAcesso": { "type": "string" },
        "cte": { "type": "string" },
        "cargoDescription": { "type": "string" }
      }
    },
    "status": {
      "type": "string",
      "enum": ["Em Trânsito", "No Pátio (Espera)", "Em Doca", "Liberado (Concluído)"]
    },
    "timestamps": {
      "entryGateTime": { "type": "string", "format": "date-time" },
      "dockAssignmentTime": { "type": "string", "format": "date-time" },
      "dockStartTime": { "type": "string", "format": "date-time" },
      "dockEndTime": { "type": "string", "format": "date-time" },
      "exitGateTime": { "type": "string", "format": "date-time" }
    },
    "assignedDockId": { "type": "integer", "minimum": 1, "maximum": 14 },
    "slaMinutes": { "type": "integer", "default": 60 },
    "priority": { 
      "type": "string", 
      "enum": ["Baixa", "Normal", "Alta", "Urgente"] 
    }
  }
}`;

  const vercelBlobIntegrationCode = `// lib/storage/blobStorage.ts
import { put, list, del } from '@vercel/blob';

interface DailyYardSnapshot {
  date: string;
  updatedAt: string;
  vehicles: Vehicle[];
  docks: Dock[];
  metrics: LogisticsKPIs;
}

export async function saveYardSnapshot(snapshot: DailyYardSnapshot) {
  const fileName = \`snapshots/\${snapshot.date}/yard-state-\${Date.now()}.json\`;
  
  // Salva no Vercel Blob com acesso restrito
  const blob = await put(fileName, JSON.stringify(snapshot, null, 2), {
    access: 'public', // ou 'restricted' com edge middleware
    contentType: 'application/json',
    addRandomSuffix: false
  });

  return blob;
}

export async function getLatestYardSnapshot(date: string): Promise<DailyYardSnapshot | null> {
  const { blobs } = await list({ prefix: \`snapshots/\${date}/\` });
  if (blobs.length === 0) return null;
  
  // Pega o snapshot mais recente pelo timestamp do nome
  const latestBlob = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
  const response = await fetch(latestBlob.url);
  return response.json();
}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Especificação Técnica e Arquitetura de Software (SDD & SRS)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Documento de Engenharia de Software para o Sistema de Gestão de Pátio e 14 Docas (YMS)
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-lg">
          DocasFlow-v1.0-SPEC
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="truncate">{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* SECTION 1: PERSISTENCE - GOOGLE DRIVE VS VERCEL BLOB */}
        {activeSection === 'storage' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-amber-400" />
                1. Decisão Arquitetural de Persistência: Vercel Blob Storage vs Google Drive API
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Análise comparativa de viabilidade técnica, latência, concorrência e custos operacionais.
              </p>
            </div>

            {/* Verdict Box */}
            <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Veredito Técnico do Arquiteto: Padrão Híbrido com Vercel Blob Primário
              </div>
              <p className="text-slate-200 leading-relaxed">
                Para um sistema de gestão de pátio em tempo real (onde caminhões chegam e saem a cada poucos minutos),{' '}
                <strong>o Vercel Blob Storage é tecnicamente muito superior ao Google Drive</strong> como camada de
                persistência de dados transacionais, devido à latência de borda (Edge CDN de 30-80ms vs 450-900ms do Drive),
                isenção de quotas agressivas de rate-limit por usuário e facilidade de integração em TypeScript.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>Estratégia Recomendada:</strong> Utilizar <strong>Vercel Blob</strong> para o estado vivo
                (snapshots JSON e append-only audit trail de movimentações) e uma <strong>rotina de exportação agendada (Cron)</strong>{' '}
                para Google Drive/Google Sheets no fechamento diário, atendendo a auditoria corporativa e planilhas de stakeholders.
              </p>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
                <thead className="bg-slate-950 text-slate-300 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Critério Técnico</th>
                    <th className="p-3 text-cyan-400">Vercel Blob Storage</th>
                    <th className="p-3 text-amber-400">Google Drive API</th>
                    <th className="p-3 text-slate-400">Impacto na Operação de Depósito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Latência de Leitura/Escrita</td>
                    <td className="p-3 text-emerald-400 font-bold">~30ms - 80ms (Edge CDN Global)</td>
                    <td className="p-3 text-rose-400 font-medium">~450ms - 1.200ms (REST API)</td>
                    <td className="p-3 text-slate-400">Vercel Blob não causa atraso perceptível no clique do operador.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Concorrência e Locks</td>
                    <td className="p-3 text-emerald-400">Append-only / Imutabilidade por timestamp</td>
                    <td className="p-3 text-rose-400">Alto risco de colisão ao editar mesmo arquivo</td>
                    <td className="p-3 text-slate-400">Múltiplos operadores de portaria registrando veículos sem sobrescrita.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Autenticação e Credenciais</td>
                    <td className="p-3 text-emerald-400">Token server-side único (BLOB_READ_WRITE_TOKEN)</td>
                    <td className="p-3 text-amber-400">OAuth 2.0 com Refresh Tokens ou Service Account complexa</td>
                    <td className="p-3 text-slate-400">Vercel dispensa logins recorrentes do Google na guarita da portaria.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Limites de Taxa (Rate Limits)</td>
                    <td className="p-3 text-emerald-400">Altíssima capacidade para picos de tráfego</td>
                    <td className="p-3 text-rose-400">10 requisições/segundo por usuário (User Rate Limit)</td>
                    <td className="p-3 text-slate-400">Google Drive pode retornar HTTP 429 Too Many Requests em horários de pico.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Visualização por Stakeholders</td>
                    <td className="p-3 text-slate-400">Via dashboard da aplicação ou JSON</td>
                    <td className="p-3 text-emerald-400 font-bold">Visualização nativa em planilhas e PDF</td>
                    <td className="p-3 text-slate-400">Drive é excelente para relatórios consolidados em PDF e CSV.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Implementation Blueprint Code Sample */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Exemplo de Implementação Vercel Blob (Snapshots de Pátio):</span>
                <button
                  onClick={() => copyToClipboard(vercelBlobIntegrationCode, 'blob-code')}
                  className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
                >
                  {copiedKey === 'blob-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'blob-code' ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
                {vercelBlobIntegrationCode}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 2: ARCHITECTURE C4 OVERVIEW */}
        {activeSection === 'arch' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                2. Arquitetura Técnica C4 (Contexto, Containers & Componentes)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Topologia cliente-servidor em camadas com processamento assíncrono e isolamento de falhas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Camada 1: Frontend SPA */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center text-xs">1</div>
                  Frontend SPA (Operação)
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li><strong>React 19 + Vite:</strong> Interface reativa de alta performance.</li>
                  <li><strong>Tailwind CSS 4:</strong> Design responsivo com suporte a modo escuro e layout de impressão.</li>
                  <li><strong>Lucide Icons:</strong> Sinalização ergonômica para operadores.</li>
                  <li><strong>State Cache:</strong> LocalStorage com sincronização otimista.</li>
                  <li><strong>Print Engine:</strong> Gerador de folhas de impressão A4 limpas.</li>
                </ul>
              </div>

              {/* Camada 2: Backend API */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <div className="w-6 h-6 rounded bg-sky-500/20 flex items-center justify-center text-xs">2</div>
                  Backend API & Regras
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li><strong>Node.js + Express:</strong> Endpoints RESTful leves (/api/docks, /api/movements).</li>
                  <li><strong>SLA & Queue Engine:</strong> Monitoramento contínuo de estouro de SLA (&gt;60min).</li>
                  <li><strong>Slotting Rules:</strong> Validação de restrições de veículos (docas pesadas vs leves).</li>
                  <li><strong>Smart Advisory Logic:</strong> Detecção heurística de congestionamento e gargalos.</li>
                </ul>
              </div>

              {/* Camada 3: Persistência & Backup */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-xs">3</div>
                  Persistência & Backup
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                  <li><strong>Vercel Blob Storage:</strong> Persistência primária de snapshots JSON com chave por dia.</li>
                  <li><strong>Audit Log:</strong> Registro imutável de movimentações (entrada, acoplamento, saída).</li>
                  <li><strong>Google Drive Export:</strong> Sync diário de relatórios PDF e planilhas de fechamento de turno.</li>
                  <li><strong>Resiliência:</strong> Capacidade de operar offline temporário no pátio.</li>
                </ul>
              </div>
            </div>

            {/* Diagram Representation */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono space-y-2">
              <span className="text-amber-400 font-bold">[FLUXO DE DADOS ARQUITETURAL]</span>
              <p className="text-slate-400">
                [Operador Guarita / Portaria] ──(HTTP POST /api/gate/entry)──► [Express API Gateway]
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [Validação de Perfil de Doca 1..14]
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [Persistência Snapshot Vercel Blob]
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [Broadcast de Mudança de Status]
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──► [Backup Agendado Google Drive API]
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: USER FLOWS */}
        {activeSection === 'flows' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
                3. Fluxo de Usuário Principal: Entrada, Operação em Doca e Liberação
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Jornada operacional desenhada para ser executada em até 3 cliques por veículo.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Passo 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Chegada na Portaria & Registro Rápido (Gate-In)</h4>
                  <p className="text-slate-300 leading-relaxed">
                    O veículo chega à portaria. O operador clica em <strong>+ Registrar Entrada</strong> (ou usa o atalho F2).
                    Digita a placa (sistema formata em Mercosul automaticamente), seleciona o porte (VUC, Carreta, etc.),
                    tipo de operação e NF. O sistema valida se há doca compatível livre:
                  </p>
                  <p className="text-amber-400 font-mono">
                    ➜ Se houver doca livre: direciona direto com emissão de ticket digital de doca.<br />
                    ➜ Se todas ocupadas: direciona para o Bolsão de Espera com ticket de fila.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Alocação e Acoplamento na Doca</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Assim que uma das 14 docas é liberada, o operador da doca ou da torre de controle clica em{' '}
                    <strong>Chamar do Pátio</strong> na doca livre. O sistema prioriza por tempo de espera e nível de urgência
                    (cargas refrigeradas têm prioridade nas docas 13 e 14). O cronômetro de SLA da doca inicia.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Conclusão de Carga/Descarga e Pré-Liberação</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Ao término da movimentação física dos paletes, o conferente clica em{' '}
                    <strong>Finalizar Operação Física</strong>. A doca passa para o status{' '}
                    <em>Aguardando Liberação Documental</em>. Isso alerta a portaria para expedir o manifesto e evita que o
                    caminhão permaneça ocupando o espaço físico sem necessidade.
                  </p>
                </div>
              </div>

              {/* Passo 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Check-out e Liberação do Portão (Gate-Out)</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Com 1 clique em <strong>Liberar Doca (Check-out)</strong>, o veículo é marcado como concluído,
                    o tempo total de permanência (Gate-to-Gate) é consolidado no KPI, e a doca volta imediatamente ao
                    status <strong>Livre (Verde)</strong> para receber o próximo veículo da fila.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DATA SCHEMAS JSON */}
        {activeSection === 'schemas' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                4. Estrutura de Dados & JSON Schemas do Sistema
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modelos de dados canônicos com tipagem estrita para movimentação de veículos e status de docas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Schema JSON: VehicleMovement</span>
                <button
                  onClick={() => copyToClipboard(jsonSchemaVehicle, 'vehicle-schema')}
                  className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
                >
                  {copiedKey === 'vehicle-schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'vehicle-schema' ? 'Copiado!' : 'Copiar Schema'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-96">
                {jsonSchemaVehicle}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 5: MODULES */}
        {activeSection === 'modules' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                5. Lista de Funcionalidades por Módulo de Software
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Decomposição funcional completa do produto para escopo e estimativas de desenvolvimento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm">Módulo 1: Portaria & Controle de Acesso</h4>
                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                  <li>Registro de entrada em menos de 30 segundos com autocompletar de transportadora.</li>
                  <li>Máscara de placas Mercosul e validação de formato.</li>
                  <li>Triagem imediata: envio para Doca ou Bolsão de Espera do Pátio.</li>
                  <li>Check-out com emissão de comprovante e liberação de cancela.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-sky-400 text-sm">Módulo 2: Monitoramento das 14 Docas</h4>
                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                  <li>Painel visual com as 14 docas codificadas por cor (Verde, Azul, Amarelo, Vermelho).</li>
                  <li>Cronômetro de SLA com barra de progresso e alerta visual de estouro.</li>
                  <li>Ação de 1 clique para chamar o próximo caminhão elegível do pátio.</li>
                  <li>Controle de manutenção preventiva e bloqueio de doca com registro de OS.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">Módulo 3: Cockpit de KPIs & Gargalos</h4>
                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                  <li>Cálculo em tempo real de DUR (Dock Utilization Rate).</li>
                  <li>Turn-around time (permanência Gate-to-Gate e Dock-to-Dock).</li>
                  <li>Histograma horário de congestionamento das 06:00 às 22:00.</li>
                  <li>Comparativo de desempenho entre Turnos 1, 2 e 3.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-rose-400 text-sm">Módulo 4: Relatórios & Impressão PDF</h4>
                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                  <li>Relatório Diário, Semanal e Mensal formatado em folha A4 limpa.</li>
                  <li>Botão nativo de impressão sem cabeçalhos de navegador indesejados.</li>
                  <li>Quadro de assinatura de supervisão para auditoria de transportadora.</li>
                  <li>Exportação de dados consolidados em formato compatível com Google Sheets.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: KPIS FORMULAS */}
        {activeSection === 'kpis' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart4 className="w-5 h-5 text-amber-400" />
                6. Matriz de Indicadores (KPIs) e Fórmulas Matemáticas
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fórmulas formais padronizadas pela literatura logística (WMS/YMS).
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold text-sm">Taxa de Utilização de Docas (DUR - Dock Utilization Rate)</strong>
                  <span className="text-amber-400 font-mono">Meta: 70% a 85%</span>
                </div>
                <div className="bg-slate-900 p-3 rounded font-mono text-cyan-300">
                  DUR (%) = ( Σ Horas Ocupadas de Todas as 14 Docas / (14 Docas × Horas do Período) ) × 100
                </div>
                <p className="text-slate-400">
                  *Valores abaixo de 60% indicam ociosidade de capital; acima de 90% indicam formação imediata de filas no portão.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold text-sm">Tempo Médio de Permanência (Dwell Time / Turn-around)</strong>
                  <span className="text-sky-400 font-mono">Meta: &le; 60 min</span>
                </div>
                <div className="bg-slate-900 p-3 rounded font-mono text-cyan-300">
                  Dwell Time = ( Σ (ExitGateTime_i - EntryGateTime_i) ) / Total Veículos Concluídos
                </div>
                <p className="text-slate-400">
                  Mede a eficiência ponta a ponta, segregando tempo de espera no pátio vs tempo em operação na doca.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold text-sm">Taxa de Rotatividade das Docas (Dock Turnover)</strong>
                  <span className="text-emerald-400 font-mono">Meta: &ge; 4 veíc/doca/dia</span>
                </div>
                <div className="bg-slate-900 p-3 rounded font-mono text-cyan-300">
                  Turnover = Total Veículos Atendidos no Dia / 14 Docas
                </div>
                <p className="text-slate-400">
                  Indica a capacidade dinâmica de giro do centro de distribuição.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: STACK */}
        {activeSection === 'stack' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                7. Stack Tecnológica Apropriada e Justificativa
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Combinação moderna, segura e com baixo custo de infraestrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Camada de Frontend</h4>
                <p className="text-slate-300"><strong>React 19 + TypeScript:</strong> Tipagem rígida para evitar erros operacionais.</p>
                <p className="text-slate-300"><strong>Vite:</strong> Compilação instantânea e bundle otimizado.</p>
                <p className="text-slate-300"><strong>Tailwind CSS 4:</strong> Interface limpa, responsiva (desktop e tablet de guarita).</p>
                <p className="text-slate-300"><strong>Motion:</strong> Micro-animações suaves para mudanças de estado de doca.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Camada de Backend & Storage</h4>
                <p className="text-slate-300"><strong>Node.js / Express:</strong> API server-side segura.</p>
                <p className="text-slate-300"><strong>Vercel Blob Storage:</strong> Armazenamento de snapshots JSON e histórico auditável.</p>
                <p className="text-slate-300"><strong>Google Drive API v3:</strong> Rotina diária de exportação de relatórios em PDF e planilhas.</p>
                <p className="text-slate-300"><strong>Gemini API / Heurísticas:</strong> Motor inteligente de sugestão de boas práticas logísticas.</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: ROADMAP */}
        {activeSection === 'roadmap' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                8. Plano de Entrega para o Desenvolvedor (Roadmap de 3 Fases)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Passo a passo acionável para colocar o sistema em produção em um centro de distribuição.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">Fase 1: MVP Operacional (Semanas 1-2)</span>
                <p className="text-slate-300">
                  Implementação da grade das 14 docas, formulário ágil de portaria (registro de placas),
                  cálculo de tempo decorrido e persistência local/Vercel Blob. Operadores já conseguem abandonar pranchetas em papel.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400">Fase 2: KPIs & Análise de Gargalos (Semanas 3-4)</span>
                <p className="text-slate-300">
                  Implementação do cockpit analítico de utilização, gráfico horário de congestionamento das 06h às 22h,
                  motor de sugestões de boas práticas (Time-Slotting) e relatórios formatados para impressão em folha A4.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400">Fase 3: Integrações Automáticas & IA (Semanas 5-6)</span>
                <p className="text-slate-300">
                  Exportação automática diária para Google Drive (Sheets e PDFs), leitura óptica de placas (OCR) ou código de barras de CTE,
                  e alertas automáticos via WhatsApp/SMS para motoristas aguardando no pátio.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

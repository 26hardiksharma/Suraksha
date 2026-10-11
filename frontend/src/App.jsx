import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowUpRight, BarChart3, Bell, Bot, CheckCircle2, ChevronRight, CircleHelp, FlaskConical, Gauge, Globe2, KeyRound, LayoutDashboard, Menu, Network, Play, Radar, Search, Shield, ShieldAlert, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SimulationPage from './components/SimulationPage';
import { checkBackendHealth, checkMlHealth, fetchAlerts, fetchOverview, fetchRules, fetchTraffic, runMlPrediction, submitSignatureTraffic, validateBrokenRule } from './services/api';

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Traffic monitor', path: '/traffic', icon: Network },
  { name: 'Alert queue', path: '/alerts', icon: ShieldAlert, count: 5 },
  { name: 'Threat analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Detection rules', path: '/rules', icon: SlidersHorizontal },
  { name: 'Blocked IPs', path: '/blocked-ips', icon: Globe2 },
  { name: 'AI assistant', path: '/ai', icon: Bot },
  { name: 'Verification lab', path: '/verification', icon: FlaskConical },
  { name: 'Attack simulator', path: '/simulator', icon: Radar },
];

const demoAlerts = [
  { id: 'AL-2048', type: 'SQL injection', source: '185.220.101.42', target: '/api/users', severity: 'Critical', time: '2 min ago', method: 'Signature' },
  { id: 'AL-2047', type: 'Unusual request pattern', source: '203.0.113.54', target: '/auth/login', severity: 'High', time: '8 min ago', method: 'ML anomaly' },
  { id: 'AL-2046', type: 'Cross-site scripting', source: '45.33.32.156', target: '/search?q=', severity: 'Medium', time: '14 min ago', method: 'Signature' },
  { id: 'AL-2045', type: 'Directory traversal', source: '198.51.100.23', target: '/download', severity: 'High', time: '22 min ago', method: 'Signature' },
];
const trend = [38, 52, 44, 68, 56, 78, 61, 84, 73, 91, 66, 76];

function Brand() { return <div className="brand"><div className="brand-mark"><Shield size={21} /></div><div><strong>suraksha</strong><span>security operations</span></div></div>; }

function Sidebar({ open, onClose }) {
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-top"><Brand /><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={19} /></button></div><div className="workspace-switcher"><span className="status-dot" /> <span>Demo environment</span><ChevronRight size={15} /></div><nav className="nav-list"><p className="nav-label">Workspace</p>{navItems.map(({ name, path, icon: Icon, count }) => <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`} onClick={onClose}><Icon size={18} /><span>{name}</span>{count && <b>{count}</b>}</NavLink>)}</nav><div className="sidebar-footer"><div className="system-health"><span className="status-dot" /><div><strong>All systems healthy</strong><small>Last checked just now</small></div></div><div className="profile"><div className="avatar">AK</div><div><strong>Arjun Kumar</strong><small>Security analyst</small></div><ChevronRight size={15} /></div></div></aside>;
}

function Header({ onMenu }) {
  const location = useLocation();
  const current = navItems.find((item) => item.path === location.pathname)?.name || 'Overview';
  return <header className="topbar"><button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Suraksha</span><ChevronRight size={14} /><strong>{current}</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input placeholder="Search events, IPs, rules..." aria-label="Search" /><kbd>/</kbd></div><button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button><button className="notification-button" aria-label="Notifications"><Bell size={18} /><i /></button></div></header>;
}

function StatCard({ label, value, detail, tone, icon: Icon }) { return <article className="stat-card"><div className="stat-card-head"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={17} /></span></div><strong>{value}</strong><p className={detail.startsWith('+') ? 'positive' : ''}>{detail}</p></article>; }
function SeverityBadge({ severity }) { return <span className={`severity severity-${severity.toLowerCase()}`}><i />{severity}</span>; }

function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState(demoAlerts);
  const [scanState, setScanState] = useState('idle');
  const [scanMessage, setScanMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchOverview(), fetchAlerts()]).then(([nextOverview, nextAlerts]) => {
      setOverview(nextOverview);
      setAlerts(nextAlerts.slice(0, 4).map((alert) => ({
        ...alert,
        type: alert.attackType,
        method: alert.detectionMethod,
        target: alert.destinationIP,
        time: new Date(alert.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      })));
    }).catch(() => {
      // The dashboard remains useful while the API is unavailable.
    });
  }, []);

  async function runTrafficScan() {
    setScanState('running');
    setScanMessage('');
    try {
      const result = await submitSignatureTraffic();
      setScanState('success');
      setScanMessage(`${result.alert?.attackType || 'Traffic'} detected via ${result.alert?.detectionMethod || 'the API'}.`);
      const [nextOverview, nextAlerts] = await Promise.all([fetchOverview(), fetchAlerts()]);
      setOverview(nextOverview);
      setAlerts(nextAlerts.slice(0, 4).map((alert) => ({ ...alert, type: alert.attackType, method: alert.detectionMethod, target: alert.destinationIP, time: new Date(alert.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) })));
    } catch (error) {
      setScanState('error');
      setScanMessage(error.response?.data?.message || 'The backend could not process the scan.');
    }
  }

  return (
    <div className="page-content">
      <div className="page-heading"><div><p className="eyebrow">Monday, September 20, 2026</p><h1>Good morning, Arjun</h1><p className="lede">Here is what is happening across your protected traffic.</p>{scanMessage && <p className={`scan-message ${scanState}`}>{scanMessage}</p>}</div><button className="primary-button" onClick={runTrafficScan} disabled={scanState === 'running'}><Play size={16} fill="currentColor" /> {scanState === 'running' ? 'Scanning...' : 'Run traffic scan'}</button></div>
      <section className="stat-grid"><StatCard label="Requests inspected" value={overview?.totalTraffic?.toLocaleString() || '18,492'} detail="+12.8% from yesterday" tone="cyan" icon={Activity} /><StatCard label="Threats detected" value={overview?.totalAlerts?.toLocaleString() || '127'} detail="+8.4% from yesterday" tone="orange" icon={AlertTriangle} /><StatCard label="Active incidents" value={String(overview?.activeThreats || 5).padStart(2, '0')} detail="2 require attention" tone="red" icon={ShieldAlert} /><StatCard label="Blocked sources" value={overview?.blockedIps?.toLocaleString() || '38'} detail="+4 this week" tone="green" icon={KeyRound} /></section>
      <section className="dashboard-grid"><article className="panel trend-panel"><div className="panel-heading"><div><h2>Threat activity</h2><p>Detection volume over the last 24 hours</p></div><button className="select-button">Last 24 hours <ChevronRight size={14} /></button></div><div className="chart"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-area"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div><div className="bars">{trend.map((height, index) => <div className="bar-wrap" key={index}><span className={index === 9 ? 'bar bar-hot' : 'bar'} style={{ height: `${height}%` }} />{index % 2 === 0 && <small>{index === 0 ? '12 AM' : `${index * 2} AM`}</small>}</div>)}</div></div></div><div className="chart-legend"><span><i className="legend-dot cyan" />All detections</span><span><i className="legend-dot orange" />Signature matches</span><span><i className="legend-dot red" />ML anomalies</span></div></article><article className="panel posture-panel"><div className="panel-heading"><div><h2>Security posture</h2><p>Current environment score</p></div><Gauge size={19} className="muted-icon" /></div><div className="score-ring"><div><strong>84</strong><span>/ 100</span></div></div><div className="posture-copy"><strong>Good protection</strong><p>Improve your score by reviewing 2 open incidents.</p></div><button className="text-button">View recommendations <ArrowUpRight size={15} /></button></article></section>
      <section className="panel alerts-panel"><div className="panel-heading"><div><h2>Recent alerts</h2><p>Prioritized events that need your attention</p></div><button className="text-button" onClick={() => navigate('/alerts')}>View all alerts <ArrowUpRight size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>Detection</th><th>Source</th><th>Target</th><th>Severity</th><th>Detected</th><th aria-label="Actions" /></tr></thead><tbody>{alerts.map((alert) => <tr key={alert.id}><td><div className="detection-cell"><span className="alert-symbol"><AlertTriangle size={15} /></span><div><strong>{alert.type}</strong><small>{alert.id} · {alert.method}</small></div></div></td><td><code>{alert.source}</code></td><td><code>{alert.target}</code></td><td><SeverityBadge severity={alert.severity} /></td><td className="muted-text">{alert.time}</td><td><button className="row-action" onClick={() => navigate('/alerts')} aria-label={`Open ${alert.id}`}><ArrowUpRight size={16} /></button></td></tr>)}</tbody></table></div></section>
      <section className="bottom-grid"><article className="panel activity-panel"><div className="panel-heading"><div><h2>Detection breakdown</h2><p>How threats were identified</p></div></div><div className="breakdown"><div className="breakdown-bar"><span className="signature-fill" /><span className="ml-fill" /></div><div className="breakdown-items"><span><i className="legend-dot cyan" /><strong>78%</strong> Signature rules</span><span><i className="legend-dot orange" /><strong>22%</strong> ML anomalies</span></div></div></article><article className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Common analyst workflows</p></div></div><div className="quick-actions"><button onClick={() => navigate('/alerts')}><ShieldAlert size={18} /><span><strong>Review alert queue</strong><small>5 alerts waiting</small></span><ChevronRight size={16} /></button><button onClick={() => navigate('/rules')}><SlidersHorizontal size={18} /><span><strong>Manage detection rules</strong><small>24 active rules</small></span><ChevronRight size={16} /></button></div></article></section>
    </div>
  );
}

function ModulePage({ title, description, load, actionLabel = 'Explore module' }) {
  const [result, setResult] = useState(null);
  const [state, setState] = useState('idle');

  async function loadModule() {
    setState('running');
    try {
      setResult(await load());
      setState('success');
    } catch (error) {
      setResult(error.response?.data || { message: error.message });
      setState('error');
    }
  }

  return <div className="module-page"><div className="empty-page"><div className="empty-icon"><Network size={24} /></div><p className="eyebrow">Workspace module</p><h1>{title}</h1><p>{description}</p><button className="primary-button" onClick={loadModule} disabled={state === 'running'}><Play size={16} /> {state === 'running' ? 'Loading...' : actionLabel}</button>{result && <pre className={`module-result ${state}`}>{JSON.stringify(result, null, 2)}</pre>}</div></div>;
}

const verificationChecks = [
  { id: 'backend-health', title: 'Backend health', description: 'Confirm the API is reachable and reporting an OK status.', run: checkBackendHealth },
  { id: 'analytics', title: 'Analytics overview', description: 'Load seeded totals for traffic, alerts, and active threats.', run: fetchOverview },
  { id: 'alerts', title: 'Alert filtering', description: 'Fetch the current alert queue and verify alert records are available.', run: fetchAlerts },
  { id: 'signature', title: 'Signature detection', description: 'Submit the SQL injection example and inspect the generated alert.', run: submitSignatureTraffic },
  { id: 'rule-validation', title: 'Rule validation', description: 'Send a broken expression and expect a deliberate HTTP 400 response.', run: validateBrokenRule },
  { id: 'ml-health', title: 'ML service health', description: 'Confirm the optional prediction service is reachable.', run: checkMlHealth },
  { id: 'prediction', title: 'ML prediction', description: 'Send the sample feature vector and display its prediction metrics.', run: runMlPrediction },
];

function VerificationPage() {
  const [results, setResults] = useState({});
  const [runningAll, setRunningAll] = useState(false);

  async function runCheck(check) {
    setResults((current) => ({ ...current, [check.id]: { state: 'running' } }));
    try {
      const data = await check.run();
      setResults((current) => ({ ...current, [check.id]: { state: 'success', data } }));
    } catch (error) {
      const errorDetails = error.response?.data || (check.id.startsWith('ml-')
        ? { message: 'ML service is unavailable. Start it with: python -m uvicorn app.main:app --app-dir ml-service --reload --port 8000', endpoint: import.meta.env.VITE_ML_API_URL || 'http://localhost:8000' }
        : error.message);
      setResults((current) => ({ ...current, [check.id]: { state: 'error', error: errorDetails } }));
    }
  }

  async function runAll() {
    setRunningAll(true);
    await Promise.all(verificationChecks.map(runCheck));
    setRunningAll(false);
  }

  const completed = verificationChecks.filter((check) => results[check.id]?.state === 'success').length;
  return <div className="page-content verification-page">
    <div className="page-heading"><div><p className="eyebrow">Live integration checks</p><h1>Verification lab</h1><p className="lede">Exercise the runbook flows without leaving the dashboard.</p></div><button className="primary-button" onClick={runAll} disabled={runningAll}><Play size={16} fill="currentColor" /> {runningAll ? 'Running checks...' : 'Run all checks'}</button></div>
    <section className="verification-summary panel"><div><span className="summary-label">Checks passed</span><strong>{completed} <small>/ {verificationChecks.length}</small></strong></div><p>Each check calls the configured service directly. Results stay visible until you run them again.</p></section>
    <section className="verification-grid">{verificationChecks.map((check) => {
      const result = results[check.id];
      const isSuccess = result?.state === 'success';
      return <article className="verification-card panel" key={check.id}><div className="verification-card-head"><div className={`verification-icon ${result?.state || ''}`}>{isSuccess ? <CheckCircle2 size={18} /> : <FlaskConical size={18} />}</div><div><h2>{check.title}</h2><p>{check.description}</p></div></div><div className="verification-result">{result?.state === 'running' && <span className="result-running">Request in progress...</span>}{!result && <span className="result-idle">Not run yet</span>}{result?.state === 'error' && <span className="result-error">Request failed</span>}{isSuccess && <span className="result-success">Passed</span>}</div>{result?.state === 'error' && <pre>{JSON.stringify(result.error, null, 2)}</pre>}{isSuccess && <pre>{JSON.stringify(result.data, null, 2)}</pre>}<button className="secondary-button" onClick={() => runCheck(check)} disabled={result?.state === 'running'}>{result?.state === 'running' ? 'Running...' : 'Run check'}</button></article>;
    })}</section>
  </div>;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell"><div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} /><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><main className="main-content"><Header onMenu={() => setSidebarOpen(true)} />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/traffic" element={<ModulePage title="Traffic monitor" description="Inspect incoming requests, protocols, and processing decisions in one stream." load={fetchTraffic} actionLabel="Load traffic records" />} />
          <Route path="/alerts" element={<ModulePage title="Alert queue" description="Investigate detections, compare evidence, and record the response taken." load={fetchAlerts} actionLabel="Load alert queue" />} />
          <Route path="/analytics" element={<ModulePage title="Threat analytics" description="Track attack patterns, top sources, and detection trends over time." load={fetchOverview} actionLabel="Load analytics" />} />
          <Route path="/rules" element={<ModulePage title="Detection rules" description="Configure signature patterns and tune the rules protecting your environment." load={fetchRules} actionLabel="Load detection rules" />} />
          <Route path="/blocked-ips" element={<ModulePage title="Blocked IPs" description="Review simulated prevention actions and manage blocked sources." load={async () => ({ message: 'Blocked IP management is available through the backend API.' })} actionLabel="Check blocked IP service" />} />
          <Route path="/ai" element={<ModulePage title="AI assistant" description="Ask for plain-language explanations of detections and practical mitigations." load={async () => ({ message: 'AI assistant is ready for the next analysis request.' })} actionLabel="Check assistant" />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/simulator" element={<SimulationPage />} />
        </Routes>
      </main>
    </div>
  );
}

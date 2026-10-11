import { AlertTriangle, CheckCircle2, Play, Radar, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { launchSimulation } from '../services/api';

const scenarios = {
  normal: {
    label: 'Normal HTTP request',
    sourceIP: '192.168.1.12',
    destinationIP: '10.0.0.5',
    sourcePort: 4567,
    destinationPort: 80,
    protocol: 'HTTP',
    method: 'GET',
    endpoint: '/api/products',
    payload: '{"action":"view"}',
  },
  sql_injection: {
    label: 'SQL injection',
    sourceIP: '198.51.100.42',
    destinationIP: '10.0.0.5',
    sourcePort: 51422,
    destinationPort: 80,
    protocol: 'HTTP',
    method: 'GET',
    endpoint: '/search?q=UNION SELECT password FROM users',
    payload: "' OR 1=1 --",
  },
  xss: {
    label: 'Cross-site scripting',
    sourceIP: '203.0.113.77',
    destinationIP: '10.0.0.5',
    sourcePort: 51423,
    destinationPort: 80,
    protocol: 'HTTP',
    method: 'POST',
    endpoint: '/comments',
    payload: '<script>alert(1)</script>',
  },
  port_scan: {
    label: 'Port scan',
    sourceIP: '192.0.2.14',
    destinationIP: '10.0.0.5',
    sourcePort: 41000,
    destinationPort: 22,
    protocol: 'TCP',
    method: 'SCAN',
    endpoint: '/network/scan?ports=20-1024',
    payload: 'PORT_SCAN',
  },
  anomaly: {
    label: 'Anomalous request',
    sourceIP: '203.0.113.54',
    destinationIP: '10.0.0.5',
    sourcePort: 51424,
    destinationPort: 80,
    protocol: 'HTTP',
    method: 'POST',
    endpoint: '/auth/login',
    payload: 'x'.repeat(650),
  },
};

function ResultValue({ label, value }) {
  return <div className="simulation-result-value"><span>{label}</span><strong>{value}</strong></div>;
}

export default function SimulationPage() {
  const [scenario, setScenario] = useState('normal');
  const [form, setForm] = useState(scenarios.normal);
  const [state, setState] = useState('idle');
  const [result, setResult] = useState(null);

  function selectScenario(event) {
    const nextScenario = event.target.value;
    setScenario(nextScenario);
    setForm(scenarios[nextScenario]);
    setResult(null);
    setState('idle');
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function launch() {
    setState('running');
    setResult(null);
    try {
      setResult(await launchSimulation(form));
      setState('success');
    } catch (error) {
      setResult({ error: error.response?.data?.message || error.message });
      setState('error');
    }
  }

  const flagged = Boolean(result?.alert);
  return <div className="page-content simulation-page">
    <div className="page-heading"><div><p className="eyebrow">Controlled test traffic</p><h1>Attack simulator</h1><p className="lede">Launch a safe, local request and inspect how Suraksha classifies it.</p></div><button className="primary-button" onClick={launch} disabled={state === 'running'}><Play size={16} fill="currentColor" /> {state === 'running' ? 'Launching...' : 'Launch request'}</button></div>
    <div className="simulation-layout">
      <section className="panel simulation-form-panel"><div className="panel-heading"><div><h2>Request setup</h2><p>Choose a scenario, then adjust the request details.</p></div><Radar size={19} className="muted-icon" /></div><label className="field-label" htmlFor="scenario">Scenario</label><select id="scenario" className="simulation-input" value={scenario} onChange={selectScenario}>{Object.entries(scenarios).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select><div className="field-grid"><label><span className="field-label">Source IP</span><input className="simulation-input" name="sourceIP" value={form.sourceIP} onChange={updateField} /></label><label><span className="field-label">Destination IP</span><input className="simulation-input" name="destinationIP" value={form.destinationIP} onChange={updateField} /></label><label><span className="field-label">Source port</span><input className="simulation-input" type="number" name="sourcePort" value={form.sourcePort} onChange={updateField} /></label><label><span className="field-label">Destination port</span><input className="simulation-input" type="number" name="destinationPort" value={form.destinationPort} onChange={updateField} /></label><label><span className="field-label">Protocol</span><select className="simulation-input" name="protocol" value={form.protocol} onChange={updateField}><option>HTTP</option><option>HTTPS</option><option>TCP</option><option>UDP</option></select></label><label><span className="field-label">Method</span><select className="simulation-input" name="method" value={form.method} onChange={updateField}><option>GET</option><option>POST</option><option>PUT</option><option>SCAN</option></select></label></div><label className="field-label" htmlFor="endpoint">Endpoint</label><input id="endpoint" className="simulation-input" name="endpoint" value={form.endpoint} onChange={updateField} /><label className="field-label" htmlFor="payload">Payload</label><textarea id="payload" className="simulation-input simulation-textarea" name="payload" value={form.payload} onChange={updateField} /><button className="secondary-button simulation-launch-button" onClick={launch} disabled={state === 'running'}><Play size={14} /> {state === 'running' ? 'Launching...' : 'Launch this request'}</button></section>
      <section className="panel simulation-result-panel"><div className="panel-heading"><div><h2>Detection result</h2><p>Backend signature/anomaly detection and ML prediction.</p></div><ShieldAlert size={19} className="muted-icon" /></div>{state === 'idle' && <div className="simulation-empty"><Radar size={28} /><strong>Ready to simulate</strong><p>Your result will appear here after launch.</p></div>}{state === 'running' && <div className="simulation-empty"><span className="loading-pulse" /><strong>Processing request</strong><p>Sending traffic to the backend and ML service.</p></div>}{state === 'error' && <div className="simulation-error"><AlertTriangle size={21} /><strong>Request failed</strong><pre>{JSON.stringify(result, null, 2)}</pre></div>}{state === 'success' && <div className="simulation-results"><div className={`flag-banner ${flagged ? 'flagged' : 'clear'}`}>{flagged ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}<div><strong>{flagged ? 'Request flagged as an attack' : 'Request not flagged'}</strong><span>{flagged ? `${result.alert.attackType} detected by ${result.alert.detectionMethod}.` : 'No matching signature or anomaly threshold was found.'}</span></div></div><div className="simulation-result-grid"><ResultValue label="Detection method" value={result.alert?.detectionMethod || 'None'} /><ResultValue label="Attack type" value={result.alert?.attackType || 'Normal traffic'} /><ResultValue label="Severity" value={result.alert?.severity || 'None'} /><ResultValue label="ML prediction" value={result.prediction?.prediction || 'Unavailable'} /><ResultValue label="Confidence" value={result.prediction ? `${Math.round(result.prediction.confidence * 100)}%` : 'Unavailable'} /><ResultValue label="Anomaly score" value={result.prediction?.anomalyScore ?? 'Unavailable'} /></div>{result.mlError && <p className="ml-warning">ML service unavailable. Backend detection result is still valid. Start the ML service on port 8000 to see its prediction.</p>}<details className="simulation-details"><summary>View response details</summary><pre>{JSON.stringify(result, null, 2)}</pre></details></div>}</section>
    </div>
  </div>;
}

const now = () => new Date().toISOString();

let sequence = 1000;
const nextId = (prefix) => `${prefix}-${++sequence}`;

const rules = [
  { id: 'rule-sqli-union', name: 'SQL injection - UNION SELECT', attackType: 'SQL Injection', pattern: 'UNION SELECT', severity: 'High', description: 'Detects UNION-based SQL injection attempts.', enabled: true, autoBlock: false, createdAt: now(), updatedAt: now() },
  { id: 'rule-xss-script', name: 'Cross-site scripting - script tag', attackType: 'Cross-Site Scripting', pattern: '<script', severity: 'High', description: 'Detects script tags in request data.', enabled: true, autoBlock: false, createdAt: now(), updatedAt: now() },
  { id: 'rule-traversal', name: 'Directory traversal', attackType: 'Directory Traversal', pattern: '\\.\\./', severity: 'High', description: 'Detects attempts to access parent directories.', enabled: true, autoBlock: false, createdAt: now(), updatedAt: now() },
  { id: 'rule-command', name: 'Command injection', attackType: 'Command Injection', pattern: '&&', severity: 'Critical', description: 'Detects shell command chaining in request data.', enabled: true, autoBlock: false, createdAt: now(), updatedAt: now() },
  { id: 'rule-port-scan', name: 'Port scan marker', attackType: 'Port Scan', pattern: 'PORT_SCAN', severity: 'High', description: 'Detects simulated network port scanning activity.', enabled: true, autoBlock: false, createdAt: now(), updatedAt: now() },
];

const traffic = [];
const alerts = [];
const blockedIps = [];

export const store = {
  rules,
  traffic,
  alerts,
  blockedIps,
  nextId,
  now,
};

export function seedDemoData() {
  if (traffic.length > 0) return;
  const samples = [
    { sourceIP: '185.220.101.42', destinationIP: '10.0.0.12', protocol: 'HTTP', method: 'GET', endpoint: '/api/users?id=1 UNION SELECT password FROM users', payload: '' },
    { sourceIP: '203.0.113.54', destinationIP: '10.0.0.12', protocol: 'HTTP', method: 'POST', endpoint: '/auth/login', payload: 'username=admin&password=' + 'x'.repeat(520) },
    { sourceIP: '45.33.32.156', destinationIP: '10.0.0.12', protocol: 'HTTP', method: 'GET', endpoint: '/search?q=<script>alert(1)</script>', payload: '' },
  ];
  samples.forEach((sample, index) => {
    const record = ingestTraffic(sample, { seed: true });
    const detections = [
      { attackType: 'SQL Injection', detectionMethod: 'Signature', severity: 'High', confidence: 0.98, description: 'Detects UNION-based SQL injection attempts.' },
      { attackType: 'Anomalous Request', detectionMethod: 'ML anomaly', severity: 'High', confidence: 0.86, anomalyScore: 0.86, description: 'The request differs significantly from normal traffic patterns.' },
      { attackType: 'Cross-Site Scripting', detectionMethod: 'Signature', severity: 'High', confidence: 0.98, description: 'Detects script tags in request data.' },
    ];
    createAlert({ ...detections[index], sourceIP: record.sourceIP, destinationIP: record.destinationIP, payload: record.payload, trafficId: record.id, actionTaken: 'Alert created' });
  });
}

export function ingestTraffic(input, options = {}) {
  const record = {
    id: nextId('TR'),
    sourceIP: input.sourceIP,
    destinationIP: input.destinationIP,
    sourcePort: input.sourcePort || null,
    destinationPort: input.destinationPort || null,
    protocol: input.protocol,
    method: input.method || 'GET',
    endpoint: input.endpoint,
    payload: input.payload || '',
    packetSize: input.packetSize || Buffer.byteLength(input.payload || '', 'utf8'),
    timestamp: input.timestamp || now(),
    processingStatus: 'processed',
    ...options,
  };
  traffic.unshift(record);
  return record;
}

export function createAlert(input) {
  const alert = { id: nextId('AL'), timestamp: now(), status: 'New', actionTaken: 'None', ...input };
  alerts.unshift(alert);
  return alert;
}

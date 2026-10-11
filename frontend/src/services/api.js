import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 2500,
});

const mlApi = axios.create({
  baseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:8000',
  timeout: 4000,
});

export async function fetchOverview() {
  const { data } = await api.get('/analytics/overview');
  return data;
}

export async function fetchAlerts() {
  const { data } = await api.get('/alerts');
  return data.alerts || [];
}

export async function fetchTraffic() {
  const { data } = await api.get('/traffic?limit=25');
  return data;
}

export async function fetchRules() {
  const { data } = await api.get('/rules');
  return data;
}

export async function checkBackendHealth() {
  const { data } = await api.get('/health');
  return data;
}

export async function submitSignatureTraffic() {
  const { data } = await api.post('/traffic', {
    sourceIP: '192.0.2.10',
    destinationIP: '10.0.0.12',
    protocol: 'HTTP',
    method: 'GET',
    endpoint: '/search?q=UNION SELECT password FROM users',
    payload: '',
  });
  return data;
}

export async function validateBrokenRule() {
  try {
    await api.post('/rules', {
      name: 'Broken rule',
      attackType: 'Test',
      pattern: '[',
      severity: 'High',
    });
    return { passed: false, message: 'The API accepted an invalid regular expression.' };
  } catch (error) {
    if (error.response?.status === 400) {
      return { passed: true, status: error.response.status, message: error.response.data?.message };
    }
    throw error;
  }
}

export async function checkMlHealth() {
  const { data } = await mlApi.get('/health');
  return data;
}

export async function runMlPrediction() {
  const { data } = await mlApi.post('/predict', {
    features: {
      sourcePort: 4567,
      destinationPort: 80,
      packetSize: 1700,
      requestLength: 800,
      responseLength: 120,
      protocol: 'HTTP',
      requestFrequency: 20,
      connectionCount: 10,
      failedAttempts: 4,
      payloadLength: 700,
    },
  });
  return data;
}

export async function launchSimulation(traffic) {
  const { data } = await api.post('/traffic', traffic);
  const features = {
    sourcePort: Number(traffic.sourcePort) || 4567,
    destinationPort: Number(traffic.destinationPort) || 80,
    packetSize: Number(traffic.packetSize) || new TextEncoder().encode(traffic.payload || '').length,
    requestLength: (traffic.endpoint || '').length,
    responseLength: 120,
    protocol: traffic.protocol || 'HTTP',
    requestFrequency: Number(traffic.requestFrequency) || 1,
    connectionCount: Number(traffic.connectionCount) || 1,
    failedAttempts: Number(traffic.failedAttempts) || 0,
    payloadLength: (traffic.payload || '').length,
  };

  try {
    const { data: prediction } = await mlApi.post('/predict', { features });
    return { ...data, prediction, features };
  } catch (error) {
    return { ...data, prediction: null, mlError: error.response?.data || 'ML service is unavailable.', features };
  }
}

export default api;

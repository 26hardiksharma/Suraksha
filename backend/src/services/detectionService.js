import { createAlert, store } from './store.js';

const severityRank = { Low: 1, Medium: 2, High: 3, Critical: 4 };

function combinedTrafficText(traffic) {
  return [traffic.method, traffic.endpoint, traffic.payload].filter(Boolean).join(' ').toLowerCase();
}

function matchesRule(rule, text) {
  try {
    return new RegExp(rule.pattern, 'i').test(text);
  } catch {
    return text.includes(rule.pattern.toLowerCase());
  }
}

export function detectTraffic(traffic) {
  const text = combinedTrafficText(traffic);
  const matchedRule = store.rules
    .filter((rule) => rule.enabled && matchesRule(rule, text))
    .sort((left, right) => severityRank[right.severity] - severityRank[left.severity])[0];

  if (matchedRule) {
    return {
      attackType: matchedRule.attackType,
      detectionMethod: 'Signature',
      severity: matchedRule.severity,
      confidence: 0.98,
      description: matchedRule.description,
      ruleId: matchedRule.id,
      actionTaken: matchedRule.autoBlock ? 'Blocked' : 'Alert created',
    };
  }

  const anomalyScore = Math.min(0.99, traffic.payload.length > 400 ? 0.86 : traffic.endpoint.length > 120 ? 0.72 : 0.08);
  if (anomalyScore >= 0.7) {
    return {
      attackType: 'Anomalous Request',
      detectionMethod: 'ML anomaly',
      severity: anomalyScore >= 0.8 ? 'High' : 'Medium',
      confidence: Number(anomalyScore.toFixed(2)),
      description: 'The request differs significantly from normal traffic patterns.',
      anomalyScore,
      actionTaken: 'Alert created',
    };
  }

  return null;
}

export function processTraffic(traffic) {
  const detection = detectTraffic(traffic);
  if (!detection) return { traffic, alert: null };

  const alert = createAlert({
    sourceIP: traffic.sourceIP,
    destinationIP: traffic.destinationIP,
    attackType: detection.attackType,
    detectionMethod: detection.detectionMethod,
    severity: detection.severity,
    confidence: detection.confidence,
    anomalyScore: detection.anomalyScore || null,
    description: detection.description,
    payload: traffic.payload,
    trafficId: traffic.id,
    ruleId: detection.ruleId || null,
    actionTaken: detection.actionTaken,
  });

  return { traffic, alert };
}

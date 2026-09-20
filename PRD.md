
# Suraksha

## Explainable Hybrid Intrusion Detection & Prevention System

**Product Requirements Document (PRD)**

**Project Type:** College Mini Project
**Domain:** Cybersecurity / Intrusion Detection & Prevention / Machine Learning
**Version:** 1.0
**Status:** Development Specification

---

# 1. Executive Summary

**Suraksha** is a web-based Hybrid Intrusion Detection and Prevention System (IDPS) designed to demonstrate how traditional signature-based security techniques can be combined with machine learning and explainable AI.

The system analyzes network/request traffic and detects threats through two complementary approaches:

1. **Signature-Based Detection** — identifies known attack patterns using predefined rules.
2. **Machine Learning Detection** — identifies suspicious or anomalous traffic that may not match predefined signatures.

When a threat is detected, Suraksha assigns a severity level and generates an alert. For machine-learning detections, **SHAP (SHapley Additive exPlanations)** is used to explain which traffic features contributed to the prediction.

An optional **AI Security Assistant** uses an LLM to convert technical security information into understandable explanations and provide general mitigation guidance.

Suraksha also includes a **simulated prevention layer** capable of actions such as blocking an IP address or marking an address as throttled. These actions are intentionally simulated and do not modify the operating system firewall or perform real network blocking.

A React-based SOC-style dashboard allows users to monitor traffic, investigate alerts, analyze attack trends, manage detection rules, view blocked IPs, and interact with the AI assistant.

The project is intentionally designed as a **manageable academic prototype rather than an enterprise-grade security platform**.

---

# 2. Problem Statement

Modern networks continuously receive large volumes of traffic containing both legitimate and potentially malicious requests. Attacks such as SQL injection, Cross-Site Scripting (XSS), directory traversal, command injection, port scanning, brute-force attempts, and other anomalous behaviors can be difficult to identify reliably.

Traditional signature-based IDS solutions are effective at detecting known attack patterns but have difficulty identifying previously unseen or modified attacks.

Machine-learning-based IDS solutions can identify anomalous behavior beyond fixed signatures, but their predictions can be difficult to understand because of their black-box nature.

Furthermore, many educational IDS implementations stop after generating an alert and do not demonstrate what happens after a threat is detected.

Suraksha addresses these limitations by combining:

* Known-threat signature detection
* ML-based anomaly detection
* Explainable ML using SHAP
* AI-assisted security explanations
* Threat severity classification
* Simulated prevention
* Historical analytics
* A centralized security dashboard

The original project specification identifies the same core limitations: signature systems may miss unknown or mutated attacks, ML systems may lack transparency, and academic demonstrations frequently lack prevention capabilities.

---

# 3. Product Vision

> **To create a simple, explainable, and interactive IDPS that demonstrates the complete security workflow from traffic detection to analysis, explanation, and simulated response.**

Suraksha should make it possible for a student or security analyst to answer:

* What traffic is entering the system?
* Is the traffic suspicious?
* What type of attack was detected?
* Why was it detected?
* How severe is the threat?
* What action should be taken?
* Was the source IP blocked?
* What attacks are occurring over time?

---

# 4. Objectives

## 4.1 Primary Objectives

Suraksha shall:

1. Accept simulated network/request traffic.
2. Detect known attacks using configurable signatures.
3. Detect suspicious/anomalous traffic using machine learning.
4. Classify detected events by attack type and severity.
5. Explain ML predictions using SHAP.
6. Generate understandable AI-assisted explanations.
7. Generate security alerts.
8. Simulate prevention actions such as IP blocking.
9. Store traffic and security events in MongoDB.
10. Provide an interactive SOC-style dashboard.
11. Provide historical attack analytics.
12. Allow administrators to manage detection rules.

The original project objectives similarly include continuous traffic monitoring, signature detection, ML detection, SHAP explanations, alerts, simulated prevention, visualization, and historical storage.

---

# 5. Project Scope

## 5.1 In Scope

### Detection

* HTTP/request traffic analysis
* Signature-based detection
* ML-based anomaly detection
* Attack classification
* Threat severity scoring

### Explainability

* SHAP-based feature explanations
* Human-readable explanations
* AI Security Assistant

### Prevention

* Simulated IP blocking
* Simulated throttling
* Blocked-IP management
* Prevention history

### Monitoring

* Traffic dashboard
* Alert dashboard
* Threat statistics
* Attack timelines
* Top attacking IPs
* Attack-type distribution

### Administration

* Detection rule creation
* Rule editing
* Rule enable/disable
* Rule deletion
* Rule severity configuration

### Data

* Traffic logs
* Alerts
* Rules
* Blocked IPs

---

# 6. Out of Scope

To keep the project suitable for a mini-project, the following are **not required**:

* Real firewall modification
* Real IP blocking through iptables/firewalld
* Kubernetes
* Docker
* Docker Compose
* Redis
* Kafka
* RabbitMQ
* GraphQL
* Microservice orchestration
* Complex authentication/authorization
* Enterprise RBAC
* Email/SMS notification infrastructure
* Cloud deployment
* Distributed processing
* Production-grade packet capture
* Large-scale network infrastructure
* Real-time WebSocket infrastructure
* Snort integration as a core requirement
* Advanced deep-learning architectures
* Automated vulnerability exploitation
* Automated penetration testing

Snort was present as an optional integration in the original design, rather than a fundamental requirement.

---

# 7. Target Users

## 7.1 Security Analyst

The primary user.

### Goals

* Monitor network activity
* Investigate alerts
* Understand threats
* Identify attacking IPs
* Review ML explanations
* Manage detection rules

### Needs

* Clear alerts
* Threat severity
* Attack classification
* Explanation of detections
* Historical data

---

## 7.2 Network Administrator

### Goals

* Monitor traffic
* Identify suspicious sources
* Configure security rules
* Manage simulated blocks

---

## 7.3 Student / Learner

Suraksha also serves as an educational demonstration of:

* Signature-based IDS
* Anomaly detection
* Machine learning
* Explainable AI
* IPS concepts
* Security monitoring

The original frontend design explicitly identified the student/learner as a target persona and emphasized showing the cause-and-effect relationship behind security decisions.

---

# 8. High-Level System Architecture

```text
                         ┌──────────────────────────┐
                         │      Traffic Simulator   │
                         │        Python            │
                         └────────────┬─────────────┘
                                      │
                                      │ REST API
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js / Express Backend                │
│                                                             │
│  Traffic Ingestion                                         │
│        │                                                    │
│        ▼                                                    │
│  Signature Detection                                        │
│        │                                                    │
│        ├─────────────── Match ────────────────► Alert       │
│        │                                                    │
│        ▼ No Match                                           │
│  ML Detection ───────────────► Python ML Service            │
│        │                             │                      │
│        │                             ▼                      │
│        │                           SHAP                     │
│        │                             │                      │
│        ▼                             ▼                      │
│              Threat Analysis / Scoring                     │
│                         │                                   │
│                         ▼                                   │
│                    Alert Management                         │
│                         │                                   │
│              ┌──────────┴──────────┐                        │
│              ▼                     ▼                        │
│       Prevention Simulation    AI Assistant                 │
│                                                             │
└───────────────────┬──────────────────────┬──────────────────┘
                    │                      │
                    ▼                      ▼
              ┌───────────┐        ┌──────────────┐
              │  MongoDB  │        │ React        │
              │           │        │ Dashboard    │
              └───────────┘        └──────────────┘
```

The original architecture placed the Node.js API server at the center of traffic processing, with signature detection, ML analysis, prevention, database storage, and the frontend around it.

### Architectural simplifications

The final Suraksha implementation intentionally removes:

* Socket.IO
* WebSocket communication
* Separate SHAP service
* Separate LLM service
* Notification service
* Analytics microservice
* Container orchestration

The frontend communicates with the backend using **REST APIs**.

Dashboard refreshes can use periodic polling where necessary.

---

# 9. Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Recharts
* Axios
* Lucide React

## Backend

* Node.js
* Express
* Mongoose
* Axios
* dotenv
* CORS
* Helmet

## Machine Learning

* Python
* FastAPI
* Scikit-learn
* SHAP
* Pandas
* NumPy

## Database

* MongoDB

## AI

* OpenAI API
* OpenAI SDK

## Traffic Simulation

* Python
* Requests

---

# 10. Core Functional Requirements

---

## FR-001 — Traffic Ingestion

The system shall provide an API through which traffic records can be submitted.

A traffic record may contain:

```text
sourceIP
destinationIP
sourcePort
destinationPort
protocol
method
endpoint
payload
packetSize
timestamp
```

The backend shall validate the incoming traffic object before processing it.

---

## FR-002 — Traffic Logging

Every submitted traffic record shall be stored in MongoDB.

The system should preserve enough information to:

* Display traffic history
* Investigate alerts
* Calculate statistics
* Reproduce detection scenarios

---

# 11. Signature-Based Detection

## FR-010 — Signature Engine

The backend shall contain a signature detection engine capable of comparing incoming traffic against predefined attack patterns.

The original requirements specify signatures for common attacks such as SQL injection, XSS, directory traversal, and command injection.

---

## FR-011 — Initial Attack Signatures

The initial implementation should support at least:

### SQL Injection

Examples of suspicious patterns:

```text
' OR 1=1
UNION SELECT
DROP TABLE
SELECT *
```

### Cross-Site Scripting

Examples:

```text
<script>
javascript:
onerror=
onload=
```

### Directory Traversal

Examples:

```text
../
..\
/etc/passwd
```

### Command Injection

Examples:

```text
; ls
&& whoami
| cat
$(command)
```

### Port Scanning

Repeated connection attempts across multiple ports from the same source IP may be classified as a port-scan pattern.

### Brute Force

Repeated authentication attempts from the same source IP within a short time period may be classified as brute-force behavior.

---

# 12. Detection Rules

Every signature rule should contain:

```text
id
name
attackType
pattern
severity
description
enabled
autoBlock
createdAt
updatedAt
```

Example:

```json
{
  "name": "SQL Injection - UNION SELECT",
  "attackType": "SQL Injection",
  "pattern": "UNION SELECT",
  "severity": "High",
  "description": "Detects a common SQL injection pattern.",
  "enabled": true,
  "autoBlock": false
}
```

---

# 13. Rule Manager

## FR-020 — Create Rule

An administrator shall be able to create a custom detection rule.

## FR-021 — Edit Rule

An administrator shall be able to modify an existing rule.

## FR-022 — Enable / Disable Rule

Rules shall be dynamically enabled or disabled.

Disabled rules shall not participate in detection.

## FR-023 — Delete Rule

An administrator shall be able to delete unnecessary rules.

## FR-024 — Rule Validation

The system shall validate:

* Rule name
* Attack type
* Pattern
* Severity

Invalid regular expressions should be rejected.

---

# 14. Machine Learning Detection

## FR-030 — ML Analysis

Traffic that does not match a known signature may be forwarded to the Python ML service.

The ML service shall return:

```text
prediction
confidence
anomalyScore
```

Example:

```json
{
  "prediction": "Attack",
  "confidence": 0.91,
  "anomalyScore": 0.84
}
```

---

# 15. ML Model

The initial implementation may use a lightweight tree-based or anomaly-detection model.

Preferred options:

* Random Forest
* Isolation Forest

The model should prioritize:

1. Simplicity
2. Explainability
3. Fast inference
4. Ease of demonstration

The original project considered Random Forest/XGBoost and anomaly-detection approaches such as Isolation Forest.

A complex deep-learning model is **not required**.

---

# 16. ML Features

Possible input features include:

```text
sourcePort
destinationPort
packetSize
requestLength
responseLength
protocol
requestFrequency
connectionCount
failedAttempts
payloadLength
```

Categorical values should be encoded before model inference.

---

# 17. SHAP Explainability

## FR-040 — Explain ML Prediction

For ML-generated detections, Suraksha shall generate SHAP explanations.

The explanation should identify the features that contributed most strongly to the prediction.

Example:

```text
Prediction: Attack

Top contributing features:

Request Frequency     +0.31
Packet Size            +0.24
Destination Port       +0.18
Failed Attempts        +0.15
```

---

## FR-041 — Feature Importance Visualization

The dashboard shall display important features using a visual representation such as:

* Horizontal bar chart
* Positive/negative contribution chart
* Feature importance list

The original specification also called for global feature importance visualization.

---

# 18. Threat Classification

Every detected threat shall contain:

```text
attackType
detectionMethod
confidence
severity
sourceIP
timestamp
```

Detection methods:

```text
Signature
Machine Learning
```

---

# 19. Threat Severity

Suraksha shall categorize alerts into:

| Severity | Description                           |
| -------- | ------------------------------------- |
| Low      | Minor suspicious behavior             |
| Medium   | Potentially harmful activity          |
| High     | Significant security threat           |
| Critical | Severe or repeated malicious activity |

Severity can be determined using:

* Signature severity
* ML confidence
* Attack type
* Frequency of events
* Number of repeated attacks

The original PRD similarly required Low/Medium/High/Critical classification and policy-driven prevention decisions.

---

# 20. Alert Management

## FR-050 — Alert Creation

When suspicious activity is detected, Suraksha shall create an alert.

An alert should contain:

```text
id
timestamp
sourceIP
destinationIP
attackType
detectionMethod
severity
confidence
description
payload
status
actionTaken
```

---

## FR-051 — Alert Status

Alerts may have statuses:

```text
New
Investigating
Resolved
Blocked
Ignored
```

---

## FR-052 — Alert Filtering

Users shall be able to filter alerts by:

* Severity
* Attack type
* Detection method
* Source IP
* Status
* Date/time

---

# 21. Alert Investigation

Selecting an alert should display:

### Basic Information

* Attack type
* Source IP
* Destination
* Timestamp
* Severity
* Detection method

### Traffic Information

* Protocol
* Port
* Endpoint
* Payload
* Request characteristics

### Detection Information

* Matched signature, if applicable
* ML confidence, if applicable
* Anomaly score

### Explainability

* SHAP feature contributions

### Response

* Action taken
* Block status
* Prevention information

---

# 22. AI Security Assistant

## FR-060 — AI Explanation

Suraksha may use an LLM to explain security events in natural language.

Example:

**User:**

> Why was this request classified as SQL injection?

**Assistant:**

> The request matched a known SQL injection pattern containing SQL query manipulation keywords. This behavior can be used to alter the intended database query.

---

## FR-061 — Security Questions

The AI Assistant should support questions such as:

* Why was this alert generated?
* Why was this IP blocked?
* What does this attack mean?
* How does SQL injection work?
* How can XSS be prevented?
* What features caused the ML model to flag this traffic?

The original project specification explicitly proposed these types of alert-context questions for the AI Assistant.

---

## FR-062 — Context-Aware Prompting

When an alert is selected, relevant alert information should be supplied to the AI Assistant.

The system should avoid sending unnecessary data.

---

## FR-063 — AI Safety Boundary

The AI Assistant is intended for:

* Explanation
* Education
* Defensive recommendations
* Incident summarization

It should not automatically execute security commands or perform real-world offensive actions.

---

# 23. Prevention Simulation

## FR-070 — Simulated Blocking

Suraksha shall support simulated IP blocking.

When an IP is blocked:

```text
IP Address
Block Time
Expiry Time
Reason
Related Alert
Status
```

shall be stored.

---

## FR-071 — Simulated Throttling

The system may mark an IP as throttled.

No actual network traffic rate is required to be changed.

---

## FR-072 — Prevention Policy

Example policies:

```text
High severity → Block IP
Critical severity → Block IP
Low severity → Log only
Medium severity → Log / investigate
```

These policies should be configurable where practical.

---

## FR-073 — Blocked IP Management

The dashboard shall display:

* Active blocked IPs
* Reason for blocking
* Block time
* Expiry time
* Related attack

---

## FR-074 — Blocked Traffic

Traffic originating from a currently blocked IP should be marked:

```text
Blocked
```

and should not proceed through the normal detection workflow, while still being logged if required.

---

# 24. Dashboard

The React application shall provide a centralized SOC-style dashboard.

The original design organized the interface around overview monitoring, live traffic, alerts, analytics, reports, rule management, blocked IPs, and the AI assistant.

---

# 25. Overview Dashboard

The main dashboard shall answer:

> **"What is happening in the network right now?"**

It should display:

### KPI Cards

* Total traffic
* Total alerts
* Active threats
* Critical alerts
* Blocked IPs

### Charts

* Traffic volume
* Alerts over time
* Attack distribution
* Severity distribution

### Recent Alerts

A table containing:

```text
Time
Source IP
Attack
Severity
Method
Status
```

---

# 26. Traffic Monitor

The Traffic Monitor shall display incoming traffic records.

Columns:

```text
Timestamp
Source IP
Destination IP
Protocol
Port
Method
Endpoint
Status
```

Users should be able to:

* Search
* Filter
* Sort
* Inspect individual traffic records

---

# 27. Alerts Page

The Alerts page shall provide a complete list of security alerts.

Features:

* Search
* Filtering
* Sorting
* Pagination
* Alert details
* Severity indicators
* Detection method indicators

---

# 28. Threat Analytics

The Analytics page shall provide historical analysis.

Suggested visualizations:

### Attack Distribution

```text
SQL Injection
XSS
Port Scan
Brute Force
Directory Traversal
Command Injection
Other Anomalies
```

### Attack Timeline

Number of attacks over time.

### Top Attackers

Rank source IP addresses by number of detected attacks.

### Severity Distribution

Low / Medium / High / Critical.

### Detection Method

Signature vs ML.

---

# 29. Reports

Suraksha should provide a basic report view.

Reports may contain:

* Reporting period
* Total traffic
* Total attacks
* Attack breakdown
* Top attacking IPs
* Severity breakdown
* Blocked IPs
* Detection method distribution

The original PRD proposed daily/weekly and custom incident reports with CSV/PDF export. For this mini-project, basic report generation and CSV export should be considered the primary target; PDF can remain optional.

---

# 30. Blocked IP Page

The Blocked IP page shall display simulated prevention actions.

Columns:

```text
IP Address
Reason
Attack Type
Blocked At
Expires At
Status
```

Users may be able to manually unblock an IP.

---

# 31. AI Assistant Page

The AI Assistant shall provide a conversational interface.

It should support:

* Free-form defensive security questions
* Alert-specific questions
* Explanation of detection decisions
* Mitigation recommendations
* Incident summaries

---

# 32. Data Model

Suraksha will use MongoDB.

## 32.1 TrafficLog

```text
TrafficLog
├── sourceIP
├── destinationIP
├── sourcePort
├── destinationPort
├── protocol
├── method
├── endpoint
├── payload
├── packetSize
├── timestamp
└── processingStatus
```

---

## 32.2 Alert

```text
Alert
├── trafficId
├── sourceIP
├── destinationIP
├── attackType
├── detectionMethod
├── severity
├── confidence
├── description
├── matchedRule
├── shapExplanation
├── status
├── actionTaken
└── timestamp
```

---

## 32.3 Rule

```text
Rule
├── name
├── attackType
├── pattern
├── severity
├── description
├── enabled
├── autoBlock
├── createdAt
└── updatedAt
```

---

## 32.4 BlockedIP

```text
BlockedIP
├── ipAddress
├── reason
├── attackType
├── alertId
├── blockedAt
├── expiresAt
└── active
```

---

# 33. API Requirements

The backend shall expose REST APIs.

## Health

```http
GET /api/health
```

---

## Traffic

```http
POST /api/traffic
GET /api/traffic
GET /api/traffic/:id
```

---

## Alerts

```http
GET /api/alerts
GET /api/alerts/:id
PATCH /api/alerts/:id
```

---

## Rules

```http
GET /api/rules
POST /api/rules
GET /api/rules/:id
PUT /api/rules/:id
DELETE /api/rules/:id
PATCH /api/rules/:id/toggle
```

---

## Prevention

```http
GET /api/blocked-ips
POST /api/blocked-ips
DELETE /api/blocked-ips/:id
```

---

## Analytics

```http
GET /api/analytics/overview
GET /api/analytics/attacks
GET /api/analytics/timeline
GET /api/analytics/top-attackers
```

---

## AI Assistant

```http
POST /api/ai/explain
POST /api/ai/chat
```

---

# 34. ML Service API

The Python FastAPI service shall expose:

```http
GET /health
POST /predict
POST /explain
```

### `/predict`

Input:

```json
{
  "features": {
    "packetSize": 1200,
    "requestLength": 400,
    "destinationPort": 80,
    "requestFrequency": 12
  }
}
```

Output:

```json
{
  "prediction": "Attack",
  "confidence": 0.91,
  "anomalyScore": 0.84
}
```

---

# 35. Traffic Simulator

A lightweight Python traffic simulator shall be provided for demonstrations.

It should generate both:

### Normal Traffic

Examples:

* GET requests
* POST requests
* Normal browsing
* Normal API requests
* Different source IPs

### Attack Traffic

Examples:

* SQL injection
* XSS
* Directory traversal
* Command injection
* Port scanning
* Brute force
* ML-anomalous traffic

---

# 36. Simulation Controls

The simulator should support scenarios such as:

```text
Normal Traffic
SQL Injection Attack
XSS Attack
Port Scan
Brute Force
Directory Traversal
Command Injection
Mixed Traffic
```

Optional parameters:

```text
request count
attack frequency
source IP
delay
```

---

# 37. End-to-End Detection Workflow

The complete workflow shall be:

```text
1. Traffic Simulator generates traffic
                 ↓
2. POST /api/traffic
                 ↓
3. Backend validates traffic
                 ↓
4. Traffic is logged
                 ↓
5. Signature Engine checks known patterns
                 ↓
        ┌────────┴────────┐
        │                 │
      Match             No Match
        │                 │
        ▼                 ▼
    Signature          ML Service
     Alert             Analysis
        │                 │
        │                 ▼
        │               SHAP
        │                 │
        └────────┬────────┘
                 ▼
          Threat Scoring
                 ↓
            Alert Created
                 ↓
        Prevention Decision
                 ↓
       Simulated Action
                 ↓
          MongoDB Storage
                 ↓
          React Dashboard
```

The original system workflow followed the same fundamental sequence: traffic collection → signature detection → ML detection → threat scoring → SHAP → LLM explanation → prevention → storage → dashboard.

---

# 38. Detection Priority

The system should follow this order:

```text
Traffic
   ↓
Check Blocked IP
   ↓
Signature Detection
   ↓
ML Detection
   ↓
Threat Scoring
   ↓
Alert
   ↓
Prevention
```

### Why signatures first?

Known attacks can be detected quickly using deterministic rules.

### Why ML after signatures?

ML provides an additional detection layer for traffic that does not match known signatures.

This creates the project's central **hybrid detection model**.

---

# 39. Threat Scoring

Suraksha may calculate a normalized threat score from 0–100.

Example conceptual formula:

```text
Threat Score =
    Attack Severity Contribution
  + ML Confidence Contribution
  + Frequency Contribution
```

Example:

```text
0–24   → Low
25–49  → Medium
50–74  → High
75–100 → Critical
```

The exact formula may be adjusted during implementation.

The score should be presented as an **application-specific risk score**, not as an official CVSS score.

---

# 40. Real-Time / Near-Real-Time Updates

Suraksha will **not use Socket.IO or WebSockets**.

Instead, the React dashboard shall use REST APIs.

For example:

```text
Frontend
   ↓
GET /api/alerts
   ↓
Wait 3–5 seconds
   ↓
GET /api/alerts
```

Polling should be used only on pages where continuously refreshed information is useful.

Static/historical pages do not need polling.

---

# 41. Non-Functional Requirements

## NFR-001 — Usability

The interface should allow users to understand an alert without reading source code.

---

## NFR-002 — Performance

The system should provide responsive API operations for the scale of the project demonstration.

The project does **not** require enterprise-scale throughput.

---

## NFR-003 — Reliability

A failure in the ML service should not prevent signature-based detection from functioning.

---

## NFR-004 — Maintainability

The codebase should be separated into logical modules.

Backend:

```text
controllers/
routes/
models/
services/
middleware/
utils/
```

Frontend:

```text
components/
pages/
layouts/
services/
hooks/
utils/
```

---

## NFR-005 — Security

The application should:

* Validate incoming API data
* Sanitize user-controlled input where appropriate
* Avoid exposing API keys
* Store secrets in environment variables
* Use HTTP security headers
* Restrict CORS appropriately

---

## NFR-006 — Explainability

Every ML alert should provide understandable evidence for why the model classified the traffic as suspicious.

---

# 42. Error Handling

The backend should gracefully handle:

* Invalid traffic payloads
* Invalid rules
* ML service unavailable
* Database errors
* Invalid alert IDs
* Invalid blocked IP operations
* AI API failures

Example:

If ML service is unavailable:

```text
Signature Detection → continues normally

ML Detection → marked unavailable
```

The system should not crash.

---

# 43. Logging

Backend logs should record:

* Server startup
* API errors
* Detection errors
* ML service failures
* Database errors
* Prevention actions

Sensitive information such as API keys must never be logged.

---

# 44. Configuration

Environment variables should be used.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/suraksha
ML_SERVICE_URL=http://localhost:8001
OPENAI_API_KEY=
```

The application should provide `.env.example` files without containing real credentials.

---

# 45. Project Structure

```text
suraksha/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── ml-service/
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── main.py
│   │   └── config.py
│   ├── requirements.txt
│   └── .env.example
│
├── traffic-simulator/
│   ├── simulator.py
│   ├── scenarios.py
│   └── requirements.txt
│
├── docs/
│
├── .gitignore
├── README.md
└── .env.example
```

---

# 46. Frontend Pages

The initial version should contain:

```text
/
├── Dashboard
├── Traffic
├── Alerts
├── Analytics
├── Rules
├── Blocked IPs
├── AI Assistant
└── Reports
```

---

# 47. Dashboard Design Principles

The interface should prioritize:

### Clarity

Important security events should stand out.

### Hierarchy

Critical alerts should receive more visual emphasis than ordinary traffic.

### Simplicity

Charts should only be used when they communicate useful information.

### Consistency

Severity should use consistent visual indicators.

### Investigation

Users should be able to move from:

```text
Dashboard
   ↓
Alert
   ↓
Alert Details
   ↓
Explanation
   ↓
Prevention
```

The original frontend design similarly emphasized visual hierarchy, contextual communication, data-first simplicity, and clear security signals.

---

# 48. Testing Requirements

## Unit Testing

Test:

* Signature matching
* Rule validation
* Threat scoring
* Prevention logic
* API validation
* ML preprocessing

---

## Integration Testing

Test:

```text
Traffic
→ Backend
→ Detection
→ Alert
→ MongoDB
```

and:

```text
Traffic
→ ML Service
→ SHAP
→ Alert
```

---

## Manual Testing

The team should manually verify:

* SQL injection detection
* XSS detection
* Directory traversal detection
* Command injection detection
* Port scanning detection
* Brute-force detection
* ML anomaly detection
* SHAP explanations
* Simulated blocking
* Rule management
* Dashboard filtering

The original testing plan likewise emphasized testing rule matching, end-to-end alert creation, database integration, ML preprocessing, and manual attack scenarios.

---

# 49. Acceptance Criteria

Suraksha will be considered successfully implemented when:

### Detection

* [ ] Traffic can be submitted to the backend.
* [ ] Traffic is stored in MongoDB.
* [ ] Known attack signatures generate alerts.
* [ ] Multiple attack categories are supported.
* [ ] ML can classify/analyze traffic.
* [ ] ML results include confidence/anomaly information.

### Explainability

* [ ] SHAP explanations are generated for supported ML predictions.
* [ ] Important features are displayed to the user.
* [ ] AI Assistant can explain an alert.

### Prevention

* [ ] High-severity alerts can trigger simulated blocking.
* [ ] Blocked IPs are stored.
* [ ] Blocked IPs are visible on the dashboard.
* [ ] Blocked traffic is identified appropriately.

### Dashboard

* [ ] Dashboard displays traffic statistics.
* [ ] Alerts are displayed.
* [ ] Alerts can be filtered.
* [ ] Attack trends are visualized.
* [ ] Top attackers are displayed.
* [ ] Detection methods can be compared.

### Rules

* [ ] Rules can be created.
* [ ] Rules can be edited.
* [ ] Rules can be enabled/disabled.
* [ ] Rules can be deleted.

### System

* [ ] Backend health endpoint works.
* [ ] ML health endpoint works.
* [ ] Application handles ML/API failures gracefully.
* [ ] No secrets are committed to GitHub.

---

# 50. Development Phases

## Phase 1 — Project Setup

* Initialize React/Vite
* Configure Tailwind
* Initialize Express backend
* Configure MongoDB
* Initialize FastAPI service
* Create basic health endpoints
* Create project structure

**Deliverable:** Running frontend, backend, ML service, and database connection.

---

## Phase 2 — Traffic Simulator

* Build normal traffic generator
* Build attack scenarios
* Send traffic to backend
* Store traffic logs

**Deliverable:** Traffic can be generated and viewed.

---

## Phase 3 — Signature Detection

* Implement rule engine
* Add initial signatures
* Create alerts
* Implement severity
* Build rule manager

**Deliverable:** Known attacks generate meaningful alerts.

---

## Phase 4 — ML + SHAP

* Select dataset
* Prepare features
* Train lightweight model
* Implement `/predict`
* Implement SHAP explanation
* Connect Node backend to ML service

**Deliverable:** Unknown/suspicious traffic receives ML analysis and explanation.

---

## Phase 5 — Dashboard

* Dashboard
* Traffic page
* Alerts page
* Analytics
* Charts
* Filtering

**Deliverable:** Functional SOC-style interface.

---

## Phase 6 — Prevention

* Blocked IP model
* Simulated blocking
* Prevention policies
* Blocked IP page

**Deliverable:** End-to-end detection-to-prevention demonstration.

---

## Phase 7 — AI Assistant

* Integrate OpenAI API
* Add alert context
* Implement explanation prompts
* Implement defensive recommendations

**Deliverable:** AI-powered security explanation.

---

## Phase 8 — Polish & Demonstration

* UI refinement
* Error handling
* Testing
* Documentation
* Demo scenarios
* Screenshots
* Final presentation

**Deliverable:** Complete mini-project ready for evaluation.

---

# 51. Demo Scenario

The final demonstration should show the complete security lifecycle.

### Scenario

1. Start Suraksha.
2. Open the Dashboard.
3. Start the traffic simulator.
4. Normal traffic appears.
5. Launch an SQL injection scenario.
6. Signature engine detects the request.
7. Alert appears.
8. Dashboard displays:

   * Attack type
   * Source IP
   * Severity
   * Detection method
9. Trigger a simulated block.
10. Open Blocked IPs.
11. Demonstrate that subsequent traffic from the IP is marked blocked.
12. Launch anomalous traffic.
13. ML detects the anomaly.
14. SHAP displays contributing features.
15. Open AI Assistant.
16. Ask why the traffic was detected.
17. Show historical analytics.

This demonstrates the project's full pipeline without requiring actual malicious network activity or real firewall manipulation.

---

# 52. Security & Ethical Considerations

Suraksha is intended for **defensive cybersecurity education and controlled testing**.

The system should use:

* Synthetic traffic
* Controlled test payloads
* Local development environments
* Simulated prevention

It should not automatically attack external systems or modify real firewall configurations.

The simulated prevention model is particularly important because the project's objective is to demonstrate the **concept of IPS response** without introducing potentially destructive system-level operations.

---

# 53. Limitations

The initial version will have several intentional limitations:

1. Traffic is primarily simulated rather than captured from production networks.
2. Signature detection is limited to predefined patterns.
3. ML performance depends on the selected dataset and features.
4. ML predictions may produce false positives.
5. SHAP explanations explain model behavior rather than proving that an attack occurred.
6. AI-generated explanations may contain inaccuracies.
7. Prevention is simulated.
8. REST polling is used instead of WebSockets.
9. The system is not intended for production deployment.
10. Authentication and enterprise access control are outside the minimum scope.

---

# 54. Future Enhancements

Possible future versions may include:

### Network Integration

* Live packet capture
* PCAP analysis
* Snort integration
* Zeek integration

### Advanced Detection

* Deep learning
* Sequence-based anomaly detection
* Ensemble models
* Behavioral profiling

### Prevention

* Real firewall integration
* Rate limiting
* Automated quarantine
* Network isolation

### Intelligence

* Threat intelligence feeds
* IP reputation
* CVE enrichment
* GeoIP information

### Platform

* User authentication
* Role-based access control
* Cloud deployment
* Docker
* Kubernetes
* Distributed processing

These are **future possibilities, not requirements for the current mini-project**.

---

# 55. Success Metrics

The project should be evaluated using both technical and demonstration-oriented metrics.

## Detection

* Percentage of known test attacks correctly detected
* False-positive rate
* Detection coverage by attack category

## ML

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix

The original project documentation proposed evaluating ML using held-out datasets and reporting metrics such as accuracy, recall, confusion matrices, and ROC curves.

## System

* API response time
* ML inference time
* Dashboard responsiveness
* Successful end-to-end detection rate

## Usability

* Clarity of alert information
* Understandability of SHAP explanations
* Ease of rule configuration
* Ease of investigating an incident

---

# 56. Final Product Definition

Suraksha is ultimately a **hybrid, explainable IDPS prototype** consisting of four major security capabilities:

```text
              SURAKSHA
                  │
      ┌───────────┼────────────┐
      │           │            │
   DETECT      EXPLAIN      RESPOND
      │           │            │
      ▼           ▼            ▼
 Signature      SHAP       IP Blocking
     +           +          Simulation
    ML          LLM
      │           │            │
      └───────────┼────────────┘
                  ▼
             MONITOR
                  │
                  ▼
           SOC Dashboard
```

The core value proposition is:

> **Suraksha does not simply say that traffic is malicious. It attempts to detect the threat, explain why it was detected, show its impact, and demonstrate an appropriate response.**

---

# 57. Minimum Viable Product

If development time becomes limited, the following features have the highest priority:

### Must Have

1. Traffic simulator
2. REST traffic ingestion
3. MongoDB storage
4. Signature detection
5. SQL injection detection
6. XSS detection
7. Directory traversal detection
8. Command injection detection
9. Basic ML detection
10. SHAP explanation
11. Alert dashboard
12. Threat severity
13. Simulated IP blocking
14. Basic analytics

### Should Have

15. Rule Manager
16. AI Security Assistant
17. Blocked IP management
18. Traffic monitoring
19. Attack timeline

### Nice to Have

20. CSV reports
21. PDF reports
22. Advanced ML classification
23. Snort integration
24. Threat intelligence
25. Authentication

This prioritization ensures that **the project remains complete even if the optional features have to be dropped**.

---

# 58. Final Architecture Principle

The most important architectural principle for this version of Suraksha is:

> **Keep the system simple enough to finish, but rich enough to demonstrate the complete IDPS lifecycle.**

Therefore, the project intentionally uses:

```text
React
   +
Node.js / Express
   +
MongoDB
   +
Python / FastAPI
   +
Scikit-learn + SHAP
   +
OpenAI API
```

and avoids unnecessary infrastructure.

The result is a project that demonstrates the important concepts from the original AegisAI vision while remaining realistic for a college mini-project.

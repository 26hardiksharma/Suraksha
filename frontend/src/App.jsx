import { Routes, Route, Link } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Traffic', path: '/traffic' },
  { name: 'Alerts', path: '/alerts' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Rules', path: '/rules' },
  { name: 'Blocked IPs', path: '/blocked-ips' },
  { name: 'AI Assistant', path: '/ai' },
  { name: 'Reports', path: '/reports' },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Suraksha Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total Traffic', '1,248'],
          ['Total Alerts', '27'],
          ['Active Threats', '5'],
          ['Critical Alerts', '2'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Recent alerts</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-200">
          <li>SQL Injection from 192.168.10.14 • High • Signature</li>
          <li>XSS attempt from 10.0.0.8 • Medium • Signature</li>
          <li>Unusual request pattern from 203.0.113.54 • Critical • ML</li>
        </ul>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-4 text-slate-300">This page is ready for implementation based on the PRD.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-950 p-5">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cyan-400">Suraksha</h1>
          <p className="mt-1 text-sm text-slate-400">IDPS Dashboard</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/traffic" element={<PlaceholderPage title="Traffic Monitor" />} />
          <Route path="/alerts" element={<PlaceholderPage title="Alerts" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Threat Analytics" />} />
          <Route path="/rules" element={<PlaceholderPage title="Detection Rules" />} />
          <Route path="/blocked-ips" element={<PlaceholderPage title="Blocked IPs" />} />
          <Route path="/ai" element={<PlaceholderPage title="AI Security Assistant" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        </Routes>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, eventsApi } from '../../services/api';

interface Dashboard { totalSponsors: number; totalAttendees: number; totalStamps: number; totalQualified: number; }
interface Qualified { id: string; name: string; email: string; company?: string; }
interface Sponsor { id: string; name: string; boothNumber?: string; qrCode: string; scanCount: number; }

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dashboard' | 'sponsors' | 'qualified'>('dashboard');
  const [eventId, setEventId] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [qualified, setQualified] = useState<Qualified[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [newSponsor, setNewSponsor] = useState({ name: '', boothNumber: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    if (!token) { navigate('/admin'); return; }

    eventsApi.getActive().then(res => {
      const id = res.data.id;
      setEventId(id);
      return Promise.all([
        adminApi.getDashboard(id),
        adminApi.getQualified(id),
        adminApi.getSponsorScans(id),
      ]);
    }).then(([d, q, s]) => {
      setDashboard(d.data);
      setQualified(q.data);
      setSponsors(s.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleAddSponsor = async () => {
    if (!newSponsor.name) return;
    await adminApi.createSponsor({ ...newSponsor, eventId });
    const res = await adminApi.getSponsorScans(eventId);
    setSponsors(res.data);
    setNewSponsor({ name: '', boothNumber: '' });
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Eliminar este sponsor?')) return;
    await adminApi.deleteSponsor(id);
    setSponsors(s => s.filter(x => x.id !== id));
  };

  const handleExport = async () => {
    const res = await adminApi.exportCsv(eventId);
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = 'qualificados.csv'; a.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('staff_token');
    navigate('/admin');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <p className="text-white/50">A carregar...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header */}
      <div className="bg-brand-mid px-6 pt-10 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-white">Painel Admin</h1>
          <p className="text-white/40 text-sm">BSides Porto 2025 — Staff</p>
        </div>
        <button onClick={handleLogout} className="text-white/40 text-sm">Sair</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-6 bg-brand-mid">
        {(['dashboard', 'sponsors', 'qualified'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition-colors
              ${tab === t ? 'border-brand-accent text-brand-accent' : 'border-transparent text-white/40'}`}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'sponsors' ? 'Sponsors' : 'Qualificados'}
          </button>
        ))}
      </div>

      <div className="px-6 py-6">

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Participantes', value: dashboard.totalAttendees, icon: '👥' },
              { label: 'Sponsors', value: dashboard.totalSponsors, icon: '🏢' },
              { label: 'Carimbos', value: dashboard.totalStamps, icon: '📮' },
              { label: 'Qualificados', value: dashboard.totalQualified, icon: '🏆' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* SPONSORS TAB */}
        {tab === 'sponsors' && (
          <div className="flex flex-col gap-4">
            {/* Add sponsor */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3">
              <p className="text-white/70 text-sm font-semibold">Adicionar Sponsor</p>
              <input
                placeholder="Nome do sponsor"
                value={newSponsor.name}
                onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })}
                className="bg-white/10 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-accent"
              />
              <input
                placeholder="Nº do stand (opcional)"
                value={newSponsor.boothNumber}
                onChange={e => setNewSponsor({ ...newSponsor, boothNumber: e.target.value })}
                className="bg-white/10 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-accent"
              />
              <button
                onClick={handleAddSponsor}
                className="bg-brand-accent text-white font-semibold py-2 rounded-lg text-sm"
              >
                + Adicionar
              </button>
            </div>

            {/* Sponsor list */}
            {sponsors.map(s => (
              <div key={s.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium text-sm">{s.name}</p>
                  <p className="text-white/40 text-xs">{s.boothNumber ? `Stand ${s.boothNumber}` : ''} · {s.scanCount} scans</p>
                  <p className="text-white/20 text-xs font-mono mt-1">{s.qrCode}</p>
                </div>
                <button
                  onClick={() => handleDeleteSponsor(s.id)}
                  className="text-brand-accent/60 hover:text-brand-accent text-sm px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* QUALIFIED TAB */}
        {tab === 'qualified' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-white/50 text-sm">{qualified.length} qualificados</p>
              <button
                onClick={handleExport}
                className="bg-brand-accent text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Exportar CSV
              </button>
            </div>
            {qualified.map(a => (
              <div key={a.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white font-medium text-sm">{a.name}</p>
                <p className="text-white/50 text-xs">{a.email}</p>
                {a.company && <p className="text-white/40 text-xs">{a.company}</p>}
              </div>
            ))}
            {qualified.length === 0 && (
              <p className="text-white/30 text-sm text-center py-8">Ainda nenhum participante qualificado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

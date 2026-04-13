import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, authApi, eventsApi } from '../../services/api';

interface Dashboard { totalSponsors: number; totalAttendees: number; totalStamps: number; totalQualified: number; }
interface Qualified { id: string; name: string; email: string; company?: string; }
interface Sponsor { id: string; name: string; boothNumber?: string; qrCode: string; scanCount: number; }
interface Attendee { id: string; name: string; email: string; company?: string; createdAt: string; stamps: { id: string }[]; }

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'dashboard' | 'sponsors' | 'attendees' | 'qualified' | 'settings'>('dashboard');
  const [eventId, setEventId] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [qualified, setQualified] = useState<Qualified[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [newSponsor, setNewSponsor] = useState({ name: '', boothNumber: '' });
  const [loading, setLoading] = useState(true);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

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

  useEffect(() => {
    if (tab !== 'attendees' || !eventId || attendees.length > 0) return;
    setAttendeesLoading(true);
    adminApi.getAttendees(eventId)
      .then(res => setAttendees(res.data))
      .catch(() => {})
      .finally(() => setAttendeesLoading(false));
  }, [tab, eventId]);

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

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      setPwError('Preenche todos os campos.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('As passwords não coincidem.');
      return;
    }
    if (pwForm.newPw.length < 8) {
      setPwError('A nova password deve ter pelo menos 8 caracteres.');
      return;
    }
    setPwLoading(true);
    setPwError('');
    try {
      await authApi.changePassword(pwForm.current, pwForm.newPw);
      setPwSuccess(true);
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err?.response?.data?.message || 'Erro ao alterar password.');
    } finally {
      setPwLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <p className="font-mono text-brand-green animate-pulse">{'>'} A carregar...</p>
    </div>
  );

  const tabs = [
    { key: 'dashboard',  label: 'Dashboard' },
    { key: 'sponsors',   label: 'Sponsors' },
    { key: 'attendees',  label: 'Participantes' },
    { key: 'qualified',  label: 'Qualificados' },
    { key: 'settings',   label: 'Definições' },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-black pb-24">

      {/* Header */}
      <div className="px-6 pt-10 pb-4 border-b border-brand-gray2 flex justify-between items-start">
        <div>
          <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ STAFF PANEL ]</p>
          <h1 className="font-mono font-bold text-white text-xl">Admin — BSides Porto 2026</h1>
        </div>
        <button onClick={() => navigate('/admin/qrcodes')}
          className="font-mono text-brand-muted text-xs border border-brand-gray2 px-3 py-1 rounded hover:border-brand-green hover:text-brand-green transition-colors">
          QR Codes
        </button>
        <button onClick={handleLogout}
          className="font-mono text-brand-muted text-xs border border-brand-gray2 px-3 py-1 rounded hover:border-brand-red hover:text-brand-red transition-colors">
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-gray2 px-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`font-mono py-3 px-3 text-xs uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap
              ${tab === t.key
                ? 'border-brand-green text-brand-green'
                : 'border-transparent text-brand-muted hover:text-white'}`}>
            {tab === t.key ? '> ' : ''}{t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6">

        {/* DASHBOARD */}
        {tab === 'dashboard' && dashboard && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Participantes', value: dashboard.totalAttendees, icon: '👥' },
                { label: 'Sponsors',      value: dashboard.totalSponsors,  icon: '🏢' },
                { label: 'Carimbos',      value: dashboard.totalStamps,    icon: '📮' },
                { label: 'Qualificados',  value: dashboard.totalQualified, icon: '🏆' },
              ].map(stat => (
                <div key={stat.label}
                  className="border border-brand-gray2 rounded p-5 text-center hover:border-brand-green transition-colors"
                  style={stat.label === 'Qualificados' && stat.value > 0 ? { borderColor: '#00FF41', boxShadow: '0 0 10px #00FF4133' } : {}}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-mono font-bold text-white text-3xl">{stat.value}</div>
                  <div className="font-mono text-brand-muted text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {dashboard.totalAttendees > 0 && (
              <div className="border border-brand-gray2 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-brand-muted text-xs">Taxa de qualificação</span>
                  <span className="font-mono text-brand-green text-xs font-bold">
                    {Math.round((dashboard.totalQualified / dashboard.totalAttendees) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-brand-gray2 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((dashboard.totalQualified / dashboard.totalAttendees) * 100)}%`,
                      backgroundColor: '#00FF41',
                      boxShadow: '0 0 6px #00FF41'
                    }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SPONSORS */}
        {tab === 'sponsors' && (
          <div className="flex flex-col gap-4">
            <div className="border border-brand-gray2 rounded p-4 flex flex-col gap-3">
              <p className="font-mono text-brand-green text-xs tracking-widest">{'>'} ADICIONAR SPONSOR</p>
              <input placeholder="Nome do sponsor" value={newSponsor.name}
                onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })}
                className="bg-brand-gray text-white placeholder-brand-muted rounded px-3 py-2 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
              <input placeholder="Nº do stand (opcional)" value={newSponsor.boothNumber}
                onChange={e => setNewSponsor({ ...newSponsor, boothNumber: e.target.value })}
                className="bg-brand-gray text-white placeholder-brand-muted rounded px-3 py-2 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
              <button onClick={handleAddSponsor}
                className="font-mono font-bold py-2 rounded text-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                style={{ backgroundColor: '#00FF41', boxShadow: '0 0 10px #00FF4144' }}>
                + Adicionar
              </button>
            </div>

            {sponsors.map(s => (
              <div key={s.id}
                className="border border-brand-gray2 rounded p-4 flex justify-between items-start hover:border-brand-green transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-white text-sm">{s.name}</p>
                  <p className="font-mono text-brand-muted text-xs mt-1">
                    {s.boothNumber ? `Stand ${s.boothNumber}  ·  ` : ''}{s.scanCount} scans
                  </p>
                  <p className="font-mono text-brand-gray2 text-xs mt-1 truncate">{s.qrCode}</p>
                </div>
                <button onClick={() => handleDeleteSponsor(s.id)}
                  className="font-mono text-brand-muted hover:text-brand-red text-sm px-2 transition-colors flex-shrink-0">
                  ✕
                </button>
              </div>
            ))}

            {sponsors.length === 0 && (
              <p className="font-mono text-brand-muted text-sm text-center py-8">Nenhum sponsor adicionado.</p>
            )}
          </div>
        )}

        {/* PARTICIPANTES */}
        {tab === 'attendees' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-mono text-brand-muted text-xs">{attendees.length} registados</p>
              <button
                onClick={() => {
                  setAttendees([]);
                  setAttendeesLoading(true);
                  adminApi.getAttendees(eventId)
                    .then(res => setAttendees(res.data))
                    .finally(() => setAttendeesLoading(false));
                }}
                className="font-mono text-brand-muted text-xs border border-brand-gray2 px-3 py-1 rounded hover:border-brand-green hover:text-brand-green transition-colors">
                ↻ Actualizar
              </button>
            </div>

            {attendeesLoading && (
              <p className="font-mono text-brand-green text-sm text-center py-8 animate-pulse">{'>'} A carregar...</p>
            )}

            {!attendeesLoading && attendees.map(a => {
              const stampsCount = a.stamps?.length ?? 0;
              const totalSponsors = dashboard?.totalSponsors ?? 0;
              const isQualified = totalSponsors > 0 && stampsCount >= totalSponsors;
              return (
                <div key={a.id}
                  className="border rounded p-4"
                  style={{
                    borderColor: isQualified ? '#00FF41' : '#2A2A2A',
                    boxShadow: isQualified ? '0 0 6px #00FF4122' : 'none'
                  }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-white text-sm">
                        {isQualified ? '✓ ' : ''}{a.name}
                      </p>
                      <p className="font-mono text-brand-muted text-xs mt-1">{a.email}</p>
                      {a.company && (
                        <p className="font-mono text-brand-muted text-xs">{a.company}</p>
                      )}
                      <p className="font-mono text-brand-muted text-xs mt-2">
                        {formatDate(a.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-mono text-xs"
                        style={{ color: isQualified ? '#00FF41' : '#888888' }}>
                        {stampsCount}/{totalSponsors}
                      </p>
                      <p className="font-mono text-brand-muted text-xs">stamps</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {!attendeesLoading && attendees.length === 0 && (
              <div className="border border-brand-gray2 rounded p-8 text-center">
                <p className="font-mono text-brand-muted text-sm">Nenhum participante registado.</p>
              </div>
            )}
          </div>
        )}

        {/* QUALIFIED */}
        {tab === 'qualified' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-mono text-brand-muted text-xs">{qualified.length} qualificados</p>
              <button onClick={handleExport}
                className="font-mono font-bold text-xs px-4 py-2 rounded text-black uppercase tracking-wider active:scale-95 transition-all"
                style={{ backgroundColor: '#00FF41', boxShadow: '0 0 10px #00FF4144' }}>
                Exportar CSV
              </button>
            </div>

            {qualified.map(a => (
              <div key={a.id}
                className="border border-brand-green rounded p-4"
                style={{ boxShadow: '0 0 6px #00FF4122' }}>
                <p className="font-mono font-bold text-white text-sm">✓ {a.name}</p>
                <p className="font-mono text-brand-muted text-xs mt-1">{a.email}</p>
                {a.company && <p className="font-mono text-brand-muted text-xs">{a.company}</p>}
              </div>
            ))}

            {qualified.length === 0 && (
              <div className="border border-brand-gray2 rounded p-8 text-center">
                <p className="font-mono text-brand-muted text-sm">Ainda nenhum participante qualificado.</p>
              </div>
            )}
          </div>
        )}

        {/* DEFINIÇÕES */}
        {tab === 'settings' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <p className="font-mono text-brand-green text-xs tracking-widest">{'>'} ALTERAR PASSWORD</p>

            <div>
              <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Password actual</label>
              <input type="password" value={pwForm.current}
                onChange={e => { setPwForm({ ...pwForm, current: e.target.value }); setPwError(''); }}
                className="w-full bg-brand-gray text-white rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
            </div>

            <div>
              <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Nova password</label>
              <input type="password" value={pwForm.newPw}
                onChange={e => { setPwForm({ ...pwForm, newPw: e.target.value }); setPwError(''); }}
                className="w-full bg-brand-gray text-white rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
            </div>

            <div>
              <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Confirmar nova password</label>
              <input type="password" value={pwForm.confirm}
                onChange={e => { setPwForm({ ...pwForm, confirm: e.target.value }); setPwError(''); }}
                className="w-full bg-brand-gray text-white rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
            </div>

            {pwError && <p className="font-mono text-brand-red text-sm">{pwError}</p>}

            {pwSuccess && (
              <div className="border border-brand-green rounded p-3"
                style={{ boxShadow: '0 0 10px #00FF4122' }}>
                <p className="font-mono text-brand-green text-sm">✓ Password alterada com sucesso.</p>
              </div>
            )}

            <button onClick={handleChangePassword} disabled={pwLoading}
              className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest disabled:opacity-40 active:scale-95 transition-all border-2"
              style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4555' }}>
              {pwLoading ? '> A alterar...' : '> Alterar password'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

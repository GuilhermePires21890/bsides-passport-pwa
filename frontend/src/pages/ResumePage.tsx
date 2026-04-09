import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResumePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/register'); return; }
    localStorage.setItem('passport_token', token);
    window.location.href = '/passport';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <p className="font-mono text-brand-green animate-pulse">{'>'} A recuperar o teu passport...</p>
    </div>
  );
}
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('bioclinica_token', res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Greška pri prijavi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f0f' }}>
      {/* Dekorativni background blur */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: '#e5252a' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Bioclinica_Logo.png" alt="Bioclinica" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Admin Panel
          </h1>
          <p className="text-sm text-[#666] mt-1">Prijavite se za pristup administraciji</p>
        </div>

        {/* Form card */}
        <div className="admin-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                Korisničko ime ili email
              </label>
              <input
                className="admin-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                Lozinka
              </label>
              <div className="relative">
                <input
                  className="admin-input pr-10"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[#f87171] text-sm bg-[#2e1a1a] border border-[#5a2d2d] rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary w-full justify-center py-3"
            >
              <LogIn size={17} />
              {loading ? 'Prijavljujem...' : 'Prijavi se'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#444] mt-6">
          Bioclinica © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

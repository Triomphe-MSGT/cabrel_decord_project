import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import BrandLogo from '../../components/ui/BrandLogo';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__brand">
            <BrandLogo size="xl" />
            <p className="admin-login__label">Administration</p>
          </div>
          <form onSubmit={handleSubmit} className="admin-login__form">
            {error && <p className="admin-login__error">{error}</p>}
            <label className="block">
              <span className="admin-field__label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cabreldecor.com"
                required
                autoComplete="email"
                className="admin-login__input"
              />
            </label>
            <label className="block">
              <span className="admin-field__label">Mot de passe</span>
              <div className="admin-login__password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                  autoComplete="current-password"
                  className="admin-login__input admin-login__input--password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="admin-login__toggle-pw"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button type="submit" disabled={loading} className="admin-login__submit">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

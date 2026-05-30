import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import AdminShell from '../../components/admin/AdminShell';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminProfile() {
  const { adminUser, refreshProfile } = useAdmin();
  const [profileForm, setProfileForm] = useState({ nom: '', email: '', currentPassword: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (adminUser) {
      setProfileForm((f) => ({
        ...f,
        nom: adminUser.nom || '',
        email: adminUser.email || '',
      }));
    }
  }, [adminUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);
    setProfileError(null);
    try {
      await adminApi.updateProfile({
        nom: profileForm.nom,
        email: profileForm.email,
        currentPassword: profileForm.currentPassword,
      });
      await refreshProfile();
      setProfileForm((f) => ({ ...f, currentPassword: '' }));
      setProfileMsg('Profil mis à jour.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoadingPassword(true);
    try {
      await adminApi.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg('Mot de passe modifié.');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <PageTransition>
      <AdminShell title="Mon profil" description="Modifiez vos informations de connexion.">
        <div className="admin-profile-grid">
          <form onSubmit={handleProfileSubmit} className="admin-card">
            <h2 className="admin-card__title">Informations personnelles</h2>
            {profileError && <p className="admin-login__error mb-3">{profileError}</p>}
            {profileMsg && <p className="admin-toast">{profileMsg}</p>}
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">Nom</span>
                <input
                  type="text"
                  value={profileForm.nom}
                  onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                  required
                  className="admin-field__input"
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Email de connexion</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  className="admin-field__input"
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Mot de passe actuel (pour confirmer)</span>
                <input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, currentPassword: e.target.value })
                  }
                  required
                  className="admin-field__input"
                />
              </label>
            </div>
            <button type="submit" disabled={loadingProfile} className="admin-btn admin-btn--primary">
              {loadingProfile ? 'Enregistrement...' : 'Enregistrer le profil'}
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="admin-card">
            <h2 className="admin-card__title">Changer le mot de passe</h2>
            {passwordError && <p className="admin-login__error mb-3">{passwordError}</p>}
            {passwordMsg && <p className="admin-toast">{passwordMsg}</p>}
            <div className="space-y-4">
              <label className="admin-field block">
                <span className="admin-field__label">Mot de passe actuel</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                  className="admin-field__input"
                />
              </label>
              <label className="admin-field block">
                <span className="admin-field__label">Nouveau mot de passe</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="admin-field__input"
                />
              </label>
              <label className="admin-field block">
                <span className="admin-field__label">Confirmer le nouveau mot de passe</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                  className="admin-field__input"
                />
              </label>
            </div>
            <button type="submit" disabled={loadingPassword} className="admin-btn admin-btn--primary">
              {loadingPassword ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      </AdminShell>
    </PageTransition>
  );
}

import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { useContactSettings } from '../../context/ContactSettingsContext';
import AdminShell from '../../components/admin/AdminShell';
import PageTransition from '../../components/layout/PageTransition';

const emptyForm = {
  whatsapp: '',
  email: '',
  facebook: '',
  adresse: '',
  horaires: '',
};

export default function AdminContact() {
  const { reloadContact } = useContactSettings();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getContact()
      .then(({ data }) => setForm({ ...emptyForm, ...data }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await adminApi.updateContact(form);
      await reloadContact();
      setMessage('Coordonnées mises à jour — visibles sur le site immédiatement.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <AdminShell
        title="Contact & réseaux"
        description="WhatsApp, e-mail, Messenger et informations affichées dans le pied de page."
      >
        {loading ? (
          <p className="admin-empty">Chargement…</p>
        ) : (
          <form onSubmit={handleSubmit} className="admin-card max-w-xl">
            {error && <p className="admin-login__error mb-4">{error}</p>}
            {message && <p className="admin-toast mb-4">{message}</p>}

            <fieldset className="admin-form-section">
              <legend className="admin-form-section__title">Réseaux sociaux</legend>
              <div className="space-y-4">
                <label className="admin-field block">
                  <span className="admin-field__label">Numéro WhatsApp</span>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="237670423949"
                    required
                    className="admin-field__input"
                  />
                  <span className="admin-field__hint">
                    Indicatif pays + numéro, sans espaces ni + (ex. 237670423949).
                  </span>
                </label>

                <label className="admin-field block">
                  <span className="admin-field__label">Adresse e-mail</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@cabreldecor.com"
                    required
                    className="admin-field__input"
                  />
                  <span className="admin-field__hint">
                    Utilisée pour les boutons « Nous écrire » et le pied de page.
                  </span>
                </label>

                <label className="admin-field block">
                  <span className="admin-field__label">Page Facebook / Messenger</span>
                  <input
                    type="text"
                    value={form.facebook}
                    onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                    placeholder="cabreldecor"
                    className="admin-field__input"
                  />
                  <span className="admin-field__hint">
                    Nom de votre page Facebook (lien m.me/votre-page).
                  </span>
                </label>
              </div>
            </fieldset>

            <fieldset className="admin-form-section">
              <legend className="admin-form-section__title">Informations affichées</legend>
              <div className="space-y-4">
                <label className="admin-field block">
                  <span className="admin-field__label">Adresse</span>
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                    placeholder="Yaoundé, Cameroun"
                    className="admin-field__input"
                  />
                </label>

                <label className="admin-field block">
                  <span className="admin-field__label">Horaires d&apos;ouverture</span>
                  <input
                    type="text"
                    value={form.horaires}
                    onChange={(e) => setForm({ ...form, horaires: e.target.value })}
                    placeholder="Lun – Sam · 9h – 18h"
                    className="admin-field__input"
                  />
                </label>
              </div>
            </fieldset>

            <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">
              {saving ? 'Enregistrement…' : 'Enregistrer les coordonnées'}
            </button>
          </form>
        )}
      </AdminShell>
    </PageTransition>
  );
}

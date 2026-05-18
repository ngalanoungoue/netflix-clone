import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Navbar from '../components/Navbar';


const PLANS = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '',
    priceId: null,
    color: '#555',
    features: ['Accès limité', 'Qualité SD', 'Publicités', '1 écran'],
    cta: 'Plan actuel',
  },
  {
    name: 'Standard',
    price: '9,99€',
    period: '/mois',
    priceId: import.meta.env.VITE_STRIPE_STANDARD_PRICE,
    color: '#1a73e8',
    features: ['Accès complet', 'Qualité HD', 'Sans publicité', '2 écrans'],
    cta: 'Choisir Standard',
  },
  {
    name: 'Premium',
    price: '14,99€',
    period: '/mois',
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE,
    color: '#E50914',
    features: ['Accès complet', 'Qualité 4K', 'Sans publicité', '4 écrans', 'Téléchargements illimités'],
    cta: 'Choisir Premium',
  },
];

export default function Pricing() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading]         = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);
  const navigate = useNavigate();

  const handleSuccess = useCallback(async (planName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: planName,
      status: 'active',
      updated_at: new Date().toISOString(),
    });
    setCurrentPlan(planName);
    setSuccess(true);
    window.history.replaceState({}, '', '/pricing');
  }, []);

  useEffect(() => {
    const fetchSub = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();
      if (data) setCurrentPlan(data.plan);
    };
    fetchSub();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    if (!plan) return;
    const timer = setTimeout(() => handleSuccess(plan), 0);
    return () => clearTimeout(timer);
  }, [handleSuccess]);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
  if (!priceId) return;
  setLoading(planName);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { navigate('/login'); return; }

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'success_url': `${window.location.origin}/pricing?plan=${planName.toLowerCase()}`,
        'cancel_url': `${window.location.origin}/pricing`,
        'client_reference_id': user.id,
      }),
    });

    const session = await res.json();
    if (session.url) {
      window.open(session.url, '_self');
    } else {
      alert('Erreur Stripe : ' + (session.error?.message || 'inconnue'));
    }
  } catch {
    alert('Erreur de connexion à Stripe');
  } finally {
    setLoading(null);
  }
};

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '90px 40px 40px', maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '12px' }}>
            💳 Choisir un abonnement
          </h1>
          <p style={{ color: '#aaa', fontSize: '16px' }}>
            Accède à tout le contenu sans limitation
          </p>
        </div>

        {/* Message succès */}
        {success && (
          <div style={{
            backgroundColor: '#1a2a1a', border: '1px solid #46d369',
            borderRadius: '8px', padding: '16px', marginBottom: '32px',
            color: '#46d369', fontWeight: 700, textAlign: 'center', fontSize: '16px',
          }}>
            🎉 Abonnement activé avec succès ! Bienvenue sur le plan {currentPlan} !
          </div>
        )}

        {/* Grille des plans */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {PLANS.map(plan => {
            const isCurrentPlan = (
              (plan.name === 'Gratuit'  && currentPlan === 'free') ||
              (plan.name === 'Standard' && currentPlan === 'standard') ||
              (plan.name === 'Premium'  && currentPlan === 'premium')
            );

            return (
              <div
                key={plan.name}
                style={{
                  backgroundColor: '#1f1f1f', borderRadius: '12px',
                  padding: '32px 24px',
                  border: `2px solid ${isCurrentPlan ? plan.color : '#333'}`,
                  position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${plan.color}33`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isCurrentPlan && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: plan.color, color: '#fff',
                    padding: '4px 16px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    ✓ Plan actuel
                  </div>
                )}

                <h2 style={{ color: plan.color, fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>
                  {plan.name}
                </h2>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900 }}>{plan.price}</span>
                  <span style={{ color: '#aaa', fontSize: '14px' }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{
                      color: '#ccc', fontSize: '14px', padding: '8px 0',
                      borderBottom: '1px solid #2a2a2a',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={isCurrentPlan || loading === plan.name}
                  style={{
                    width: '100%',
                    backgroundColor: isCurrentPlan ? '#333' : plan.color,
                    color: '#fff', border: 'none', borderRadius: '6px',
                    padding: '14px', fontSize: '15px', fontWeight: 700,
                    cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                    opacity: loading === plan.name ? 0.7 : 1,
                  }}
                >
                  {loading === plan.name ? 'Chargement...' : isCurrentPlan ? '✓ Actif' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Carte de test */}
        <div style={{
          marginTop: '48px', backgroundColor: '#1a2a1a',
          border: '1px solid #46d369', borderRadius: '8px', padding: '20px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#46d369', fontWeight: 700, marginBottom: '8px' }}>
            🧪 Mode test Stripe — Utilise cette carte :
          </p>
          <p style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '4px', fontFamily: 'monospace' }}>
            4242 4242 4242 4242
          </p>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
            Date : n'importe quelle date future · CVC : n'importe quels 3 chiffres
          </p>
        </div>
      </div>
    </div>
  );
}
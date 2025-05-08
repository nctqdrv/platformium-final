'use client';
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import styles from './SentimentDashboard.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!EMAIL_REGEX.test(email)) {
      setError('Zəhmət olmasa düzgün email daxil edin.');
      return;
    }
    setLoading(true);
    // Check for duplicate
    const { data: existing, error: fetchError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (fetchError) {
      setError('Xəta baş verdi. Bir azdan yenidən yoxlayın.');
      setLoading(false);
      return;
    }
    if (existing) {
      setError('Bu email artıq gözləmə siyahısındadır.');
      setLoading(false);
      return;
    }
    // Insert
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ email });
    if (insertError) {
      setError('Xəta baş verdi. Bir azdan yenidən yoxlayın.');
      setLoading(false);
      return;
    }
    setSuccess('Uğurla qeyd olundunuz!');
    setEmail('');
    setLoading(false);
  };

  // Hide success message when user starts typing a new email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (success) setSuccess('');
    if (error) setError('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="/Logo.png" alt="Platformium Logo" className={styles.logoImage} />
        </div>
      </div>
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <div className={styles.headingGroup}>
              <h1>
                Azərbaycan dilində <span className={styles.highlight}>sosial dinləmə platforması</span>
              </h1>
              <p>Azərbaycan dilini başa düşən ilk və tək sentiment və mövzu analizi aləti</p>
            </div>
            {/* Success Alert */}
            {success && (
              <div style={{
                width: '100%',
                background: '#B7F7C7',
                color: '#14532d',
                borderRadius: '8px',
                padding: '16px',
                margin: '12px 0',
                fontWeight: 600,
                fontSize: '18px',
                textAlign: 'center',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
              }}>
                Təşəkkür edirik!
              </div>
            )}
            <form className={styles.emailForm} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="E-mail ünvanınız"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Göndərilir...' : 'Siyahıya qoşulun'}
              </button>
            </form>
            <span className={styles.hint}>
              Qeydiyyat edərək <a href="#">istifadəçi şərtlərini</a> qəbul edirsiniz
            </span>
            {error && <span className={styles.hint} style={{ color: '#FFD6D6', display: 'block' }}>{error}</span>}
          </div>
          <div className={styles.mockupWrapper}>
            <img src="/Mockup.png" alt="Sentiment Chart Mockup" className={styles.chartImage} />
          </div>
        </section>
      </main>
    </div>
  );
} 
'use client';
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import styles from './SentimentDashboard.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('WaitlistForm YÜKLENDİ!');

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form gönderildi, email:', email);
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
    <form className={styles.emailForm} onSubmit={handleSubmit}>
      {success ? (
        <div
          style={{
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
          }}
        >
          Təşəkkür edirik!
        </div>
      ) : (
        <>
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
          {error && (
            <div
              style={{
                width: '100%',
                background: '#FFD6D6',
                color: '#7F1D1D',
                borderRadius: '8px',
                padding: '12px',
                margin: '12px 0 0 0',
                fontWeight: 600,
                fontSize: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
              }}
            >
              {error}
            </div>
          )}
        </>
      )}
    </form>
  );
} 
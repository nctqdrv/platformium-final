"use client";
import styles from './SentimentDashboard.module.css';
import { useEffect, useState } from 'react';
import WaitlistForm from './WaitlistForm';

export default function SentimentDashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Header with Logo */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img 
            src="/Logo.png" 
            alt="Platformium Logo" 
            className={styles.logoImage}
          />
        </div>
      </header>
      <div className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <div className={styles.headingGroup}>
              <h1>
                Azərbaycan dilində <span className={styles.highlight}>sosial dinləmə platforması</span>
              </h1>
              <p>Azərbaycan dilini başa düşən ilk və tək sentiment və mövzu analizi aləti</p>
            </div>
            <WaitlistForm />
            <span className={styles.hint}>
              Qeydiyyat edərək <a href="#">istifadəçi şərtlərini</a> qəbul edirsiniz
            </span>
          </div>
          {!isMobile && (
            <div className={styles.mockupWrapper}>
              <img
                src="/Mockup.png"
                alt="Sentiment Chart Mockup"
                className={styles.chartImage}
              />
            </div>
          )}
        </section>
        {/* Mobilde Card.png heroSection'ın hemen altında, morun bitiminden sonra gelsin */}
        {isMobile && (
          <img
            src="/Card.png"
            alt="Sentiment Card"
            style={{ width: '100%', maxWidth: '100%', height: 'auto', borderRadius: 16, display: 'block', margin: '-80px auto 0.5rem auto' }}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import AnimatedTitle from "./helper";

const StatueCanvas = dynamic(() => import("./StatueCanvas"), { ssr: false, loading: () => <div style={{ width: "100%", height: "100%" }} /> });

const NAV = ["Home", "About", "Practice Area", "Blogs", "Contact Us"];

function useCounter(target: number, duration = 1800, active = false) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [active, target, duration]);
    return val;
}

function StatItem({ value, label, active, visible }: { value: number; label: string; active: boolean; visible: boolean }) {
    const count = useCounter(value, 1800, active);
    return (
        <div className={`stat-item${visible ? " visible" : ""}`}>
            <span className="stat-number" color="black">{count.toLocaleString()}+</span>
            <span className="stat-label" color="black">{label}</span>
        </div>
    );
}

export default function JuriCallHero() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [teamVisible, setTeamVisible] = useState(false);
    const [emergencyVisible, setEmergencyVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);
    const emergencyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 120);
        return () => clearTimeout(t);
    }, []);

    // IntersectionObserver for stats
    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // IntersectionObserver for team section
    useEffect(() => {
        const el = teamRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTeamVisible(true); },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // IntersectionObserver for emergency card
    useEffect(() => {
        const el = emergencyRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setEmergencyVisible(true); },
            { threshold: 0.3 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #EDE8D5;
          --cream-dark: #E2DBc4;
          --ink: #1A1A1A;
          --ink-mid: #2C2C2C;
          --gold: #C8A96E;
          --text-muted: #666;
          --white: #fff;
          --stat-border: rgba(26,26,26,0.15);
        }

        body { background: var(--cream); }

        .page { font-family: 'Jost', sans-serif; background: var(--cream); min-height: 100vh; overflow-x: hidden; }

        /* ── NAV ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: var(--cream);
          border-bottom: 1px solid rgba(26,26,26,0.08);
          height: 64px;
          display: flex; align-items: center;
          padding: 0 48px;
          gap: 48px;
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 700;
          color: var(--ink); text-decoration: none;
          display: flex; align-items: center; gap: 4px;
          flex-shrink: 0;
        }
        .nav-logo-icon { color: var(--gold); font-size: 20px; }
        .nav-links { display: flex; align-items: center; gap: 32px; flex: 1; justify-content: center; }
        .nav-link {
          font-size: 14px; font-weight: 400; letter-spacing: 0.02em;
          color: var(--ink); text-decoration: none;
          position: relative; padding-bottom: 2px;
          transition: color 0.2s;
        }
        .nav-link.active::after,
        .nav-link:hover::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1.5px; background: var(--ink);
        }
        .nav-link.active { font-weight: 500; }
        .nav-cta {
          background: var(--ink); color: var(--white);
          border: none; border-radius: 4px;
          padding: 10px 22px; font-family: 'Jost', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
          cursor: pointer; white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none; display: inline-block;
        }
        .nav-cta:hover { background: #333; transform: translateY(-1px); }
        .nav-burger {
          display: none; background: none; border: none;
          cursor: pointer; padding: 4px; flex-direction: column;
          gap: 5px; width: 36px;
        }
        .nav-burger span {
          display: block; height: 1.5px; background: var(--ink);
          border-radius: 2px; transition: transform 0.3s, opacity 0.3s;
        }

        /* ── MOBILE DRAWER ── */
        .mobile-drawer {
          display: none;
          position: fixed; top: 0; right: 0; bottom: 0; width: 280px;
          background: var(--ink-mid); z-index: 300;
          flex-direction: column; padding: 24px;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-drawer.open { transform: translateX(0); }
        .drawer-close {
          align-self: flex-end; background: none; border: 1px solid rgba(255,255,255,0.15);
          color: var(--white); border-radius: 4px; width: 32px; height: 32px;
          font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          margin-bottom: 32px;
        }
        .drawer-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; color: rgba(255,255,255,0.85);
          text-decoration: none; padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: color 0.2s;
        }
        .drawer-link:hover { color: var(--white); }
        .drawer-cta {
          margin-top: 32px; padding: 12px;
          border: 1px solid rgba(200,169,110,0.4);
          border-radius: 100px; text-align: center;
          font-size: 14px; color: var(--gold);
          text-decoration: none; letter-spacing: 0.05em;
        }
        .drawer-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 299;
        }
        .drawer-overlay.open { display: block; }

        /* ── HERO ── */
        .hero {
          padding-top: 64px; min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }

        /* Left content */
        .hero-left {
          display: flex; flex-direction: column; justify-content: center;
          padding: 80px 48px 80px 64px;
          position: relative; z-index: 2;
        }
        .hero-badge {
          display: inline-flex; align-items: center;
          background: var(--ink); color: var(--white);
          font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
          padding: 7px 16px; border-radius: 100px;
          width: fit-content; margin-bottom: 28px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease;
        }
        .hero-badge.visible { opacity: 1; transform: translateY(0); }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 4.5vw, 62px);
          font-weight: 700; line-height: 1.1;
          color: var(--ink); margin-bottom: 24px;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s 0.25s ease, transform 0.7s 0.25s ease;
        }
        .hero-title.visible { opacity: 1; transform: translateY(0); }

        .hero-desc {
          font-size: 15px; color: var(--text-muted); line-height: 1.7;
          max-width: 380px; margin-bottom: 40px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.4s ease, transform 0.6s 0.4s ease;
        }
        .hero-desc.visible { opacity: 1; transform: translateY(0); }

        .hero-btn {
          display: inline-block; padding: 14px 32px;
          border: 1.5px solid var(--ink); border-radius: 4px;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500;
          color: var(--ink); text-decoration: none; width: fit-content;
          background: transparent;
          transition: background 0.25s, color 0.25s, transform 0.2s;
          cursor: pointer;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.55s ease, transform 0.6s 0.55s ease,
                      background 0.25s, color 0.25s;
        }
        .hero-btn.visible { opacity: 1; transform: translateY(0); }
        .hero-btn:hover { background: var(--ink); color: var(--white); }

        .hero-team {
          margin-top: 64px;
          opacity: 0; transform: translateX(100px);
          transition: opacity 0.6s 0.7s ease, transform 0.6s 0.7s ease;
        }
        .hero-team.visible { opacity: 1; transform: translateX(0); }
        .hero-team-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 18px; color: var(--ink);
          margin-bottom: 12px;
        }
        .avatar-stack { display: flex; align-items: center; }
        .avatar {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2.5px solid var(--cream);
          background: var(--ink-mid);
          margin-left: -12px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: white; font-weight: 500;
        }
        .avatar:first-child { margin-left: 0; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-more {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2.5px solid var(--cream);
          background: var(--ink); color: var(--white);
          margin-left: -12px; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 300;
        }

        /* Right: 3D model area */
        .hero-right {
          position: relative;
          overflow: hidden;
        }
        .hero-right-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #d8d1bc 0%, #c8bfa6 100%);
        }
        .model-container {
          position: absolute; inset: 0;
          opacity: 0; transform: translateY(80px) scale(0.97);
          transition: opacity 0.9s 0.3s ease, transform 0.9s 0.3s ease;
        }
        .model-container.visible { opacity: 1; transform: translateY(0) scale(1); }

        /* Floating card */
        .emergency-card {
          position: absolute; bottom: 120px; right: 32px;
          background: rgba(26,26,26,0.92); backdrop-filter: blur(12px);
          border-radius: 8px; padding: 20px 24px; max-width: 280px;
          opacity: 0; transform: translateY(60px);
          transition: opacity 0.7s 0.8s ease, transform 0.7s 0.8s ease;
          z-index: 10;
        }
        .emergency-card.visible { opacity: 1; transform: translateY(0); }
        .emergency-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 18px; color: var(--white);
          margin-bottom: 8px; line-height: 1.3;
        }
        .emergency-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 16px; line-height: 1.5; }
        .emergency-btn {
          display: block; width: 100%; padding: 10px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px; text-align: center;
          font-size: 13px; color: var(--white); text-decoration: none;
          transition: background 0.2s;
        }
        .emergency-btn:hover { background: rgba(255,255,255,0.18); }

        /* ── STATS ── */
        .stats-section {
          background: var(--cream);
          padding: 64px 64px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid var(--stat-border);
        }
        .stat-item {
          display: flex; flex-direction: column; align-items: center;
          padding: 32px 24px;
          border-right: 1px solid var(--stat-border);
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .stat-item.visible { opacity: 1; transform: translateY(0); }
        .stat-item:nth-child(1) { transition-delay: 0s; }
        .stat-item:nth-child(2) { transition-delay: 0.12s; }
        .stat-item:nth-child(3) { transition-delay: 0.24s; }
        .stat-item:nth-child(4) { transition-delay: 0.36s; border-right: none; }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 5vw, 62px); font-weight: 600;
          color: var(--ink); line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 15px; color: var(--text-muted);
          text-align: center; line-height: 1.4;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          nav { padding: 0 32px; gap: 24px; }
          .hero-left { padding: 60px 32px 60px 32px; }
          .stats-section { padding: 40px 32px; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-cta.desktop { display: none; }
          .nav-burger { display: flex; }
          .mobile-drawer { display: flex; }

          .hero {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            min-height: auto;
          }
          .hero-left {
            padding: 40px 24px 32px;
            order: 1;
          }
          .hero-right {
            order: 2;
            height: 420px;
          }
          .emergency-card {
            bottom: 24px; right: 16px; left: 16px; max-width: none;
          }
          .stats-section {
            grid-template-columns: repeat(2, 1fr);
            padding: 32px 16px;
          }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-top: 1px solid var(--stat-border); border-right: 1px solid var(--stat-border); }
          .stat-item:nth-child(4) { border-top: 1px solid var(--stat-border); }
        }

        @media (max-width: 480px) {
          nav { padding: 0 16px; }
          .hero-left { padding: 32px 16px 24px; }
          .hero-right { height: 360px; }
          .hero-team { margin-top: 40px; }
          .stats-section { padding: 24px 8px; }
          .stat-number { font-size: 38px; }
        }
      `}</style>

            <div className="page">
                <nav>
                    <a href="#" className="nav-logo">
                        Juricall <span className="nav-logo-icon">⚖</span>
                    </a>
                    <div className="nav-links">
                        {NAV.map((n, i) => (
                            <a key={n} href="#" className={`nav-link${i === 0 ? " active" : ""}`}>{n}</a>
                        ))}
                    </div>
                    <a href="tel:+213000000000" className="nav-cta desktop">Call: +213 (0) 00 00 00 00</a>
                    <button className="nav-burger" onClick={() => setMenuOpen(true)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </nav>

                <div className={`drawer-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />
                <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
                    <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
                    {NAV.map((n) => (
                        <a key={n} href="#" className="drawer-link" onClick={() => setMenuOpen(false)}>{n}</a>
                    ))}
                    <a href="tel:+213000000000" className="drawer-cta">Call: +213 (0) 00 00 00 00</a>
                </div>

                <section className="hero" ref={heroRef}>
                    <div className="hero-left">
                        <div className={`hero-badge${heroVisible ? " visible" : ""}`}>
                            Trusted Legal Partner
                        </div>
                        <AnimatedTitle
                            text="Elite Representation For High-Stakes Legal Matters"
                            className={`hero-title${heroVisible ? " visible" : ""}`}
                        />
                        <p className={`hero-desc${heroVisible ? " visible" : ""}`}>
                            Strategic litigation, decisive negotiation — we protect your rights and your reputation in complex disputes.
                        </p>
                        <a href="#" className={`hero-btn${heroVisible ? " visible" : ""}`}>
                            Book A Consultation
                        </a>

                        <div className={`hero-team${teamVisible ? " visible" : ""}`} ref={teamRef}>
                            <div className="hero-team-label">Empower.Inspire.Leadership</div>
                            <div className="avatar-stack">
                                {["JD", "MK", "AL", "RB"].map((initials) => (
                                    <div key={initials} className="avatar">{initials}</div>
                                ))}
                                <div className="avatar-more">+</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="hero-right-bg" />
                        <div className={`model-container${heroVisible ? " visible" : ""}`}>
                            <StatueCanvas />
                        </div>
                        <div className={`emergency-card${emergencyVisible ? " visible" : ""}`} ref={emergencyRef}>
                            <div className="emergency-title">24/7 Emergency Counsel &amp; Case Review</div>
                            <div className="emergency-sub">Confidential intake — senior attorney response within 24 hours.</div>
                            <a href="tel:+213000000000" className="emergency-btn">Call: +213 (0) 00 00 00 00</a>
                        </div>
                    </div>
                </section>

                {/* ── STATS ── */}
                <section className="stats-section" ref={statsRef}>
                    {[
                        { value: 1550, label: "Successful Cases" },
                        { value: 120, label: "Expert Attorneys & Staff" },
                        { value: 2200, label: "Hours Of Litigation" },
                        { value: 250, label: "Jury Trials & Appeals" },
                    ].map(({ value, label }, i) => (
                        <StatItem key={label} value={value} label={label} active={statsVisible} visible={statsVisible} />
                    ))}
                </section>
            </div>
        </>
    );
}

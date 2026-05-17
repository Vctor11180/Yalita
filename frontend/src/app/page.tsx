"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function SplashPage() {
  const knotRef     = useRef<SVGSVGElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const orb1Ref     = useRef<HTMLDivElement>(null);
  const orb2Ref     = useRef<HTMLDivElement>(null);
  const orb3Ref     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      // ── Set initial state for SVG paths ──────────────────────────────────
      const paths = knotRef.current?.querySelectorAll<SVGPathElement>("path.knot");
      paths?.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 1,
        });
      });

      const centerCircle = knotRef.current?.querySelector<SVGCircleElement>("circle.knot-center");
      if (centerCircle) gsap.set(centerCircle, { opacity: 0, scale: 0, transformOrigin: "50px 50px" });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Background orbs float in
        tl.from([orb1Ref.current, orb2Ref.current, orb3Ref.current], {
          opacity: 0, scale: 0.4, duration: 1.8, stagger: 0.25, ease: "power1.out",
        }, 0);

        // 2. Draw knot paths
        if (paths?.[0]) tl.to(paths[0], { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.15);
        if (paths?.[1]) tl.to(paths[1], { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.45);

        // 3. Pop center circle
        if (centerCircle) {
          tl.to(centerCircle, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 1.3);
        }

        // 4. Logo text
        tl.from(logoRef.current, { opacity: 0, y: 22, duration: 0.55 }, 0.9);

        // 5. Tagline lines stagger
        const taglines = taglineRef.current?.children;
        if (taglines) {
          tl.from(Array.from(taglines), { opacity: 0, y: 14, duration: 0.45, stagger: 0.13 }, 1.15);
        }

        // 6. CTA buttons stagger
        const ctaChildren = ctaRef.current?.children;
        if (ctaChildren) {
          tl.from(Array.from(ctaChildren), { opacity: 0, y: 10, duration: 0.4, stagger: 0.1 }, 1.5);
        }

        // ── Infinite floating orbs ───────────────────────────────────────────
        gsap.to(orb1Ref.current, { y: -18, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(orb2Ref.current, { y: 14, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
        gsap.to(orb3Ref.current, { y: -10, x: 8, duration: 5.1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.6 });

        // ── Knot idle pulse ──────────────────────────────────────────────────
        gsap.to(knotRef.current, {
          filter: "drop-shadow(0 0 20px rgba(170,239,223,0.4)) drop-shadow(0 0 40px rgba(170,239,223,0.15))",
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.8,
        });
      });
    });

    return () => { ctx?.revert(); };
  }, []);

  return (
    <main
      className="min-h-screen relative flex flex-col items-center overflow-hidden p-6 pt-10 pb-10"
      style={{ background: "var(--y-navy)" }}
    >
      {/* ── Background orbs ────────────────────────────────────────────────── */}
      <div
        ref={orb1Ref}
        className="absolute top-16 right-6 w-52 h-52 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(170,239,223,0.13) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-28 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Aguayo pattern ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none">
          <defs>
            <pattern id="aguayo" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="#AAEFDF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aguayo)" />
        </svg>
      </div>

      {/* ── Center content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">

        {/* Animated Knot SVG */}
        <svg
          ref={knotRef}
          width="140" height="140"
          viewBox="0 0 100 100"
          fill="none"
          className="mb-8"
          style={{ filter: "drop-shadow(0 0 8px rgba(170,239,223,0.2))" }}
          aria-hidden="true"
        >
          {/* Outer decorative rings */}
          <circle cx="50" cy="50" r="47" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 4" />

          {/* Knot path 1 — rojo */}
          <path
            className="knot"
            d="M50 14 C28 14, 16 34, 50 50 C84 66, 72 86, 50 86"
            stroke="#C0392B"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Knot path 2 — ámbar */}
          <path
            className="knot"
            d="M50 14 C72 14, 84 34, 50 50 C16 66, 28 86, 50 86"
            stroke="#F59E0B"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Nodo central */}
          <circle
            className="knot-center"
            cx="50" cy="50" r="9"
            fill="var(--y-navy)"
            stroke="#2CB462"
            strokeWidth="4"
          />
        </svg>

        {/* Logo */}
        <div ref={logoRef} className="text-center">
          <h1
            className="font-serif tracking-tight"
            style={{ fontSize: "4rem", lineHeight: 1, color: "var(--y-aqua)" }}
          >
            Yalita
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mt-1" style={{ color: "rgba(170,239,223,0.35)" }}>
            Protocolo · Avalanche
          </p>
        </div>

        {/* Tagline */}
        <div ref={taglineRef} className="text-center mt-6 space-y-1.5">
          <p className="text-xl font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>
            Tu reputación es tu mayor activo
          </p>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
            Rápido, simple y justo · Para Bolivia y Latam
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-5 pt-4">
            {[
              { val: "210M", label: "sin crédito" },
              { val: "2 min", label: "para empezar" },
              { val: "0%", label: "colateral" },
            ].map(({ val, label }) => (
              <div key={val} className="text-center">
                <p className="font-lora text-lg font-bold" style={{ color: "var(--y-aqua)" }}>{val}</p>
                <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ────────────────────────────────────────────────────── */}
      <div ref={ctaRef} className="w-full max-w-sm z-10 space-y-3 mt-8">
        <Link
          href="/onboarding"
          className="block w-full font-bold py-4 px-6 rounded-2xl text-center text-white transition-all active:scale-[0.97] animate-shimmer-btn"
          style={{
            background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #C0392B 100%)",
            backgroundSize: "200% 100%",
            boxShadow: "0 8px 32px rgba(192,57,43,0.45), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Empieza gratis →
        </Link>

        <Link
          href="/dashboard"
          className="block w-full font-medium py-3 px-6 text-center rounded-xl transition-all active:opacity-70"
          style={{
            color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Ya tengo cuenta — Entrar
        </Link>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {["🔒 Sin banco", "⚡ 2 minutos", "🇧🇴 Bolivia"].map((badge) => (
            <span key={badge} className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.22)" }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import "aos/dist/aos.css";

let aosInitialized = false;
const loadAos = () => import("aos");

export function usePortfolioAnimations(
  hero: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    document.documentElement.dataset.aosReady = "false";
    if (!enabled) return;
    let cancelled = false;
    let refreshFrame = 0;
    void loadAos().then(({ default: AOS }) => {
      if (cancelled) return;
      if (!aosInitialized) {
        AOS.init({ duration: 650, easing: "ease-out-cubic", once: true, offset: 50 });
        aosInitialized = true;
      }
      AOS.refreshHard();
      document.documentElement.dataset.aosReady = "true";
      refreshFrame = requestAnimationFrame(() => AOS.refresh());
    }).catch(() => {
      if (!cancelled) document.documentElement.dataset.aosReady = "false";
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(refreshFrame);
      document.documentElement.dataset.aosReady = "false";
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const context = gsap.context(() => {
      gsap.fromTo("[data-hero-reveal]", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out", clearProps: "opacity,transform",
      });
    }, hero);
    return () => context.revert();
  }, [hero, enabled]);
}

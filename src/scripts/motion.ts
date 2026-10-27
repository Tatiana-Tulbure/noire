// NOIRÉ motion layer — GSAP + ScrollTrigger + SplitText.
// Calm, gallery-like timing (expo/power3 eases, no bounce). Everything here is progressive
// enhancement: html.motion is only set when the visitor hasn't asked for reduced motion.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const root = document.documentElement;
const enabled = root.classList.contains("motion");
const EASE = "expo.out";
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];

if (enabled) init();

function init() {
  // Initial (hidden) states are set here, *then* html.motion-ready lets CSS stop hiding things.
  const hero = document.querySelector<HTMLElement>(".hero");
  const heroParts = hero ? $(".hero__lead, .hero__cta, .spot", hero) : [];
  if (hero) {
    gsap.set(heroParts, { autoAlpha: 0, y: 24 });
    gsap.set(".hero__title", { autoAlpha: 0 });
    gsap.set(".hero__img", { scale: 1.12, autoAlpha: 0 });
  }
  const cardEls = $(".card, .teaser__more");
  if (cardEls.length) gsap.set(cardEls, { autoAlpha: 0, y: 60 });
  root.classList.add("motion-ready");

  const intro = playIntro();

  document.fonts.ready.then(() => {
    const start = intro ? intro.duration() - 0.55 : 0.1;
    desktopOnly();
    heroIn(start);
    headings();
    balanceScene();
    images();
    cards();
    parallax();
    footerWordmark();
    filterFlip();
    ScrollTrigger.refresh();
    sweep();
    window.addEventListener("scroll", () => requestAnimationFrame(sweep), { passive: true });
    window.addEventListener("load", sweep);
  });

  microInteractions();
}

/* ---------- Safety net ----------
   Each reveal is registered here too. Anything whose top is inside (or above) the viewport
   but hasn't played yet — e.g. after a fast scroll or a reload mid-page — is played now. */

const pending = new Set<{ el: Element; play: () => void }>();
const watch = (el: Element, play: () => void) => pending.add({ el, play });

function sweep() {
  for (const item of pending) {
    if (item.el.getBoundingClientRect().top < innerHeight * 0.95) {
      item.play();
      pending.delete(item);
    }
  }
}

const playOnce = (t: gsap.core.Tween) => () => {
  if (t.progress() === 0 && !t.isActive()) t.play();
};

/* ---------- 1. Intro: NOIRÉ letters rise, then the curtain lifts (once per session) ---------- */

function playIntro(): gsap.core.Timeline | null {
  const el = document.querySelector<HTMLElement>(".intro");
  if (!el || !root.classList.contains("has-intro")) return null;
  try {
    sessionStorage.setItem("noire:intro", "1");
  } catch {
    /* private mode */
  }
  const tl = gsap.timeline({
    defaults: { ease: EASE },
    onComplete: () => {
      root.classList.add("intro-done");
      el.remove();
    },
  });
  tl.fromTo(".intro__char", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08 })
    .fromTo(".intro__line", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, "-=0.6")
    .to(".intro__char", { yPercent: -110, duration: 0.7, stagger: 0.05, ease: "power3.in" }, "+=0.25")
    .to(".intro__line", { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: "power3.in" }, "<0.1")
    .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.2");
  return tl;
}

/* ---------- 2. Hero: masked character reveal, image scale-in + parallax, hotspots ---------- */

function heroIn(delay: number) {
  const title = document.querySelector<HTMLElement>(".hero__title");
  if (!title) return;
  const split = SplitText.create(title, { type: "lines,chars", mask: "lines" });
  gsap.set(title, { autoAlpha: 1 });
  if (!document.querySelector(".hero__img")) return;
  const tl = gsap.timeline({ delay, defaults: { ease: EASE } });
  tl.from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.022, onComplete: () => split.revert() })
    .to(".hero__img", { scale: 1, autoAlpha: 1, duration: 2.2, ease: "power3.out" }, 0)
    .to(".hero__lead, .hero__cta", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.6)
    .to(".spot", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, onComplete: () => document.querySelector(".hero")?.classList.add("is-live") }, 1.1);

  // Scroll parallax on the chair photo
  gsap.to(".hero__img", {
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

/* ---------- 3. Scroll reveals ----------
   Every reveal uses end: "max": once its start has passed the trigger stays active, so
   content above the viewport (fast scroll, reload mid-page) still ends up visible. */

function headings() {
  $(".title-xl, .title-lg, .col-hero__title").forEach((el) => {
    if (el.closest(".hero, dialog") || !el.textContent?.trim()) return;
    const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
    const t = gsap.from(split.words, {
      yPercent: 110,
      duration: 1.3,
      stagger: 0.06,
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", end: "max", once: true },
      onComplete: () => split.revert(),
    });
    watch(el, playOnce(t));
  });

  // Layered display words (Essence) rise and fade
  $(".essence__word").forEach((el) => {
    const t = gsap.from(el, {
      yPercent: 40,
      autoAlpha: 0,
      duration: 1.6,
      ease: EASE,
      scrollTrigger: { trigger: el.closest("section")!, start: "top 75%", end: "max", once: true },
    });
    watch(el.closest("section")!, playOnce(t));
  });
}

/* "The perfect balance": the three lines swing in from opposite sides like the arms of a scale,
   their words rise out of masks, and everything levels out into the Figma layout. Scrubbed, so
   the end state is exactly the static design whenever the section has been scrolled through. */
function balanceScene() {
  const section = document.querySelector<HTMLElement>(".balance");
  if (!section) return;
  const lines = $(".balance__line", section);
  const rule = section.querySelector(".balance__rule");
  const sides = [
    { xPercent: -28, rotation: -6 },
    { xPercent: 28, rotation: 6 },
    { xPercent: -22, rotation: -4 },
  ];

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 90%", end: "top 30%", scrub: 1 },
  });
  lines.forEach((line, i) => {
    const at = i * 0.12;
    tl.fromTo(line, { xPercent: sides[i].xPercent, scaleX: 1.08 }, { xPercent: 0, scaleX: 1, duration: 1, ease: "power3.out" }, at)
      // back.out gives the small overshoot of a scale settling level
      .fromTo(line, { rotation: sides[i].rotation, transformOrigin: "50% 50%" }, { rotation: 0, duration: 1, ease: "back.out(2.4)" }, at)
      .fromTo($(".bw__in", line), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, at);
  });

  // Once level: the rule draws from the centre, copy fades up line by line, the button arrives last
  const text = section.querySelector<HTMLElement>(".balance__text");
  const cta = section.querySelector<HTMLElement>(".balance__cta");
  const after = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  if (rule) after.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "expo.inOut" }, 0);
  if (text) {
    const split = SplitText.create(text, { type: "lines" });
    after.from(split.lines, { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, onComplete: () => split.revert() }, 0.2);
  }
  if (cta) after.from(cta, { y: 24, autoAlpha: 0, duration: 0.9 }, ">-0.4");

  ScrollTrigger.create({ trigger: section, start: "top 40%", end: "max", once: true, onEnter: () => after.play() });
  watch(section, () => {
    if (after.progress() === 0) after.play();
  });
}

/* Collection: filters/search/"More results" rearrange the grid fluidly (GSAP Flip).
   collection.astro fires noire:filter-before / noire:filter-after around each update. */
function filterFlip() {
  const grid = document.querySelector<HTMLElement>("[data-results]");
  if (!grid) return;
  const items = () => $("[data-product]", grid);
  let state: Flip.FlipState | null = null;
  document.addEventListener("noire:filter-before", () => {
    state = Flip.getState(items().filter((li) => !li.hidden));
  });
  document.addEventListener("noire:filter-after", () => {
    if (!state) return;
    const shown = items().filter((li) => !li.hidden);
    // cards that just appeared skip the scroll reveal and fade in with the move
    shown.forEach((li) => gsap.set(li.querySelector(".card"), { autoAlpha: 1, y: 0 }));
    Flip.from(state, {
      targets: shown,
      duration: 0.75,
      ease: "power3.inOut",
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.15 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    state = null;
  });
}

function images() {
  // Clip-path wipe, bottom → top
  $(".col-hero__img, .auth__photo, .pdp__stage, .pdp__thumb, .balance__stage, .order__img, .nf__art").forEach((el, i) => {
    const t = gsap.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.6,
        ease: "expo.inOut",
        delay: el.classList.contains("pdp__thumb") ? 0.1 * (i % 3) : 0,
        scrollTrigger: { trigger: el, start: "top 90%", end: "max", once: true },
        clearProps: "clipPath",
      },
    );
    watch(el, playOnce(t));
  });
}

function cards() {
  if (!document.querySelector(".card, .teaser__more")) return;
  ScrollTrigger.batch(".card, .teaser__more", {
    start: "top 95%",
    end: "max",
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "power3.out", overwrite: "auto" }),
  });
  $(".card, .teaser__more").forEach((card) =>
    watch(card, () => {
      if (+getComputedStyle(card).opacity < 1) gsap.to(card, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", overwrite: "auto" });
    }),
  );
  // Cards that appear later (filters, "More results", wishlist) need fresh trigger positions
  document.addEventListener("noire:change", () => ScrollTrigger.refresh());
  document.querySelector("[data-filters]")?.addEventListener("input", () => requestAnimationFrame(() => ScrollTrigger.refresh()));
  document.querySelector("[data-more]")?.addEventListener("click", () => requestAnimationFrame(() => ScrollTrigger.refresh()));
}

function parallax() {
  const scrub = (target: string, trigger: string, from: number, to: number) => {
    if (!document.querySelector(target)) return;
    gsap.fromTo(target, { yPercent: from }, { yPercent: to, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } });
  };
  // Parallax only where the layered desktop/tablet compositions exist; phones get a calm stacked layout
  gsap.matchMedia().add("(min-width: 768px)", () => {
    // Both balance layers move together: the cut-out chair must stay aligned with the photo under it
    scrub(".balance__img", ".balance", 4, -4);
    scrub(".essence__chair--white", ".essence", 10, -10);
    scrub(".essence__chair--pink", ".essence", -4, 6);
  });
}

function footerWordmark() {
  const paths = $<SVGPathElement>(".footer__wordmark path");
  if (!paths.length) return;
  gsap.from(paths, {
    yPercent: 100,
    stagger: 0.08,
    ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top 95%", end: "top 35%", scrub: 1 },
  });
}

/* ---------- 4. Desktop: pinned horizontal Sales strip, mouse parallax ---------- */

function desktopOnly() {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 992px)", () => {
    const section = document.querySelector<HTMLElement>(".sales");
    const track = document.querySelector<HTMLElement>(".sales__track");
    const thumb = document.querySelector<HTMLElement>(".sales [data-carousel-thumb]");
    if (section && track) {
      track.classList.add("is-pinned");
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const tween = gsap.to(track.children, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            if (!thumb) return;
            const w = parseFloat(thumb.style.width) || 38;
            thumb.style.left = `${st.progress * (100 - w)}%`;
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track.children, { clearProps: "transform" });
        track.classList.remove("is-pinned");
      };
    }
  });

  // Gentle mouse parallax on the hero photo (fine pointers only)
  mm.add("(min-width: 992px) and (pointer: fine)", () => {
    const media = document.querySelector<HTMLElement>(".hero__media");
    if (!media) return;
    const xTo = gsap.quickTo(media, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(media, "y", { duration: 1.2, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      xTo((e.clientX / innerWidth - 0.5) * -24);
      yTo((e.clientY / innerHeight - 0.5) * -16);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  });

  // Studio light: a soft spotlight follows the pointer over the hero chair
  mm.add("(min-width: 992px) and (pointer: fine)", () => {
    const media = document.querySelector<HTMLElement>(".hero__media");
    if (!media) return;
    const light = document.createElement("div");
    light.className = "hero__light";
    light.setAttribute("aria-hidden", "true");
    media.appendChild(light);
    const lx = gsap.quickTo(light, "x", { duration: 0.9, ease: "power3.out" });
    const ly = gsap.quickTo(light, "y", { duration: 0.9, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      const r = media.getBoundingClientRect();
      lx(e.clientX - r.left);
      ly(e.clientY - r.top);
    };
    const enter = () => gsap.to(light, { autoAlpha: 1, duration: 0.8 });
    const leave = () => gsap.to(light, { autoAlpha: 0, duration: 0.8 });
    media.addEventListener("mousemove", move);
    media.addEventListener("mouseenter", enter);
    media.addEventListener("mouseleave", leave);
    return () => {
      media.removeEventListener("mousemove", move);
      media.removeEventListener("mouseenter", enter);
      media.removeEventListener("mouseleave", leave);
      light.remove();
    };
  });
}

/* ---------- 5. Micro-interactions ---------- */

function microInteractions() {
  const mm = gsap.matchMedia();

  // Magnetic primary buttons + custom cursor — desktop pointers only
  mm.add("(min-width: 992px) and (pointer: fine)", () => {
    const cleanups: (() => void)[] = [];

    $(".btn--light, .btn--outline").forEach((btn) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.12);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
        gsap.set(btn, { clearProps: "transform" });
      });
    });

    const cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="cursor__label">View</span>';
    document.body.appendChild(cursor);
    const cx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      cx(e.clientX);
      cy(e.clientY);
      cursor.classList.add("is-on");
      const overCard = (e.target as HTMLElement).closest(".card__link");
      cursor.classList.toggle("is-view", !!overCard);
    };
    const out = () => cursor.classList.remove("is-on");
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", out);
    cleanups.push(() => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", out);
      cursor.remove();
    });

    return () => cleanups.forEach((fn) => fn());
  });

  // Heart pop on wishlist toggle (runs after ui.ts flips aria-pressed)
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-wish]");
    if (!btn) return;
    requestAnimationFrame(() => {
      const on = btn.getAttribute("aria-pressed") === "true";
      gsap.fromTo(btn, { scale: on ? 1.45 : 0.75 }, { scale: 1, duration: 0.6, ease: "power3.out" });
    });
  });

  // Add to cart: the product photo glides into the cart icon, then the drawer opens
  (window as unknown as { noireFly?: (img: HTMLImageElement) => Promise<void> }).noireFly = (img) =>
    new Promise((resolve) => {
      const target = $("[data-cart-open]").find((el) => el.offsetParent !== null);
      if (!target) return resolve();
      const from = img.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const ghost = img.cloneNode() as HTMLImageElement;
      ghost.className = "fly-ghost";
      Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
      document.body.appendChild(ghost);
      gsap
        .timeline({ onComplete: () => (ghost.remove(), resolve()) })
        .to(ghost, {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: 0.06,
          autoAlpha: 0.4,
          duration: 0.85,
          ease: "power3.inOut",
        })
        .fromTo(target, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: "power3.out" }, "-=0.15");
    });

  // Colour variants (product page + quick view): soft crossfade instead of a hard swap
  (window as unknown as { noireSwap?: (img: HTMLImageElement, src: string) => void }).noireSwap = (img, src) => {
    gsap.to(img, {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        img.src = src;
        img
          .decode()
          .catch(() => {})
          .then(() => gsap.to(img, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power3.out" }));
      },
    });
  };

  // Quick view panel: photo and copy glide in
  document.addEventListener("noire:qv-open", () => {
    gsap.fromTo(".qv__panel", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(".qv__img", { scale: 1.08 }, { scale: 1, duration: 1.2, ease: "expo.out" });
    gsap.fromTo(".qv__info > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, delay: 0.15, ease: "power3.out" });
  });

  // Cart drawer: panel slides in, lines stagger
  document.addEventListener("noire:cart-open", () => {
    gsap.fromTo(".cart__panel", { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(".cart .line, .cart__blank > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, delay: 0.12, ease: "power3.out" });
  });
}

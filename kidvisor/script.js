// Interactions for the Kidvisor case study page.

// ---------- 1. Nav line on scroll ----------
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- 2. Highlight the current chapter ----------
const chapterLinks = [...document.querySelectorAll(".chapters a")];
const chapterSections = chapterLinks.map((a) => document.querySelector(a.getAttribute("href")));
function updateChapters() {
  const line = window.innerHeight * 0.35;
  let current = -1;
  chapterSections.forEach((sec, i) => {
    if (sec && sec.getBoundingClientRect().top <= line) current = i;
  });
  chapterLinks.forEach((a, i) => a.classList.toggle("active", i === current));
  const active = chapterLinks[current];
  if (active) {
    const bar = active.closest("ol");
    const left = active.offsetLeft - bar.clientWidth / 2 + active.clientWidth / 2;
    bar.scrollTo({ left, behavior: "smooth" });
  }
}
window.addEventListener("scroll", updateChapters, { passive: true });
updateChapters();

// ---------- 3. Tabs (empathy map, testing rounds) ----------
document.querySelectorAll('[role="tablist"]').forEach((list) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });
});

// ---------- 4. Prototype explorer ----------
const screens = [
  { id: "splash", flow: "Getting started", title: "Splash",
    what: "The first thing parents see: the Kidvisor name and its promise, supporting parents in the age of intelligent media.",
    why: "A calm, simple start sets the tone for an app about a stressful topic.",
    from: "Our problem statement and design question" },
  { id: "signup", flow: "Getting started", title: "Welcome",
    what: "The first screen makes one clear promise: real-time content monitoring, alerts and literacy tools, all in one place.",
    why: "A monitoring app asks parents for a lot of trust, so privacy is said up front with \"Your data is never sold.\"",
    from: "Privacy concerns from our product persona and research" },
  { id: "account", flow: "Getting started", title: "Create an account",
    what: "A short sign-up with email, or one tap with Google or Apple.",
    why: "Parents told us they're busy and want something low-effort, so getting started takes as few steps as possible.",
    from: "Interview insight: \"I want something simple, not overwhelming\"" },
  { id: "quiz", flow: "Getting started", title: "Onboarding quiz",
    what: "Five quick questions, starting with the child's age, to personalize alerts and lessons.",
    why: "Testers found the onboarding language unclear, so each step now asks one simple question, with a progress bar showing how much is left.",
    from: "Usability testing round 2 and heuristic review" },
  { id: "profile-created", flow: "Getting started", title: "Profile created",
    what: "Confirms the child's profile and lists exactly what Kidvisor will now do, with an option to add another child.",
    why: "Being clear about what the app monitors builds trust. Testers loved the child profiles because many parents have more than one kid.",
    from: "Usability testing: child profiles felt thoughtful and intuitive" },
  { id: "dashboard", flow: "Everyday use", title: "Home dashboard",
    what: "A media health score, new alerts, color-coded screen time by app, and an exposure summary of flagged AI, harmful and educational content.",
    why: "Busy parents need to understand the day at a glance. Color coding and one score make it scannable in seconds, and parents can switch between children at the top.",
    from: "Insight 3: parents want simple, low-effort support" },
  { id: "alerts", flow: "Everyday use", title: "Alerts",
    what: "Urgent, Resolved and All tabs. Each alert explains why it was flagged, with Block, Allow and Monitor choices and healthier alternatives.",
    why: "This is the heart of Kidvisor. Other tools only block, so every alert explains what happened, which helps parents start a real conversation.",
    from: "Insight 1 and the \"Monitor vs. Block\" confusion from both test rounds" },
  { id: "controls", flow: "Everyday use", title: "Control center",
    what: "Daily screen time limits, bedtime blocks, AI content blocking, age-based filters and stranger interaction alerts.",
    why: "Timer controls confused testers, so every setting is a simple slider or toggle with a plain-language description underneath.",
    from: "Usability testing: timer and restriction controls weren't intuitive" },
  { id: "colearn", flow: "Learning together", title: "Co-Learn",
    what: "Lessons for parents, for kids, and to do together. A parent level, and lessons personalized from recent alerts, like \"How AI makes real-looking fake videos.\"",
    why: "Families who watched and talked together had the fewest problems. Co-Learn builds that habit and closes the AI literacy gap for parents too.",
    from: "Insight 2 and the expert advice to make learning structured and interactive" },
  { id: "community", flow: "Learning together", title: "Parent community",
    what: "Parents share experiences and tips, with conversation starters like \"How do you know if something online is true?\"",
    why: "Parents felt alone and unsure how to explain AI. Learning from other parents makes those hard conversations easier.",
    from: "Empathy map: parents feel overwhelmed and unsure how to explain AI" },
  { id: "profile", flow: "Learning together", title: "Profile and settings",
    what: "An overview of children, modules done and alerts resolved, plus family management, linked devices and privacy settings.",
    why: "Parents can see their progress and stay in control of their family's data in one place.",
    from: "Heuristic review: user control and freedom" },
];

const listEl = document.getElementById("screen-list");
const strip = document.getElementById("flowstrip");
const img = document.getElementById("device-img");
const flows = [...new Set(screens.map((s) => s.flow))];
let current = 4;

flows.forEach((flow) => {
  const group = document.createElement("div");
  group.innerHTML = `<h4>${flow}</h4><ul></ul>`;
  screens.forEach((s, i) => {
    if (s.flow !== flow) return;
    const li = document.createElement("li");
    li.innerHTML = `<button class="screen-btn" type="button" data-i="${i}"><small>${String(i + 1).padStart(2, "0")}</small>${s.title}</button>`;
    group.querySelector("ul").appendChild(li);
  });
  listEl.appendChild(group);
});

screens.forEach((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.i = i;
  b.innerHTML = `<img src="images/screen-${s.id}.webp" alt=""><span>${String(i + 1).padStart(2, "0")} ${s.title}</span>`;
  b.addEventListener("click", () => {
    show(i);
    document.getElementById("solution").scrollIntoView({ behavior: "smooth" });
  });
  strip.appendChild(b);
});

function show(i) {
  current = (i + screens.length) % screens.length;
  const s = screens[current];
  img.classList.add("swap");
  setTimeout(() => {
    img.src = `images/screen-${s.id}.webp`;
    img.alt = `${s.title} screen`;
    img.classList.remove("swap");
  }, 160);
  document.getElementById("scr-flow").textContent = s.flow;
  document.getElementById("scr-title").textContent = s.title;
  document.getElementById("scr-what").textContent = s.what;
  document.getElementById("scr-why").textContent = s.why;
  document.getElementById("scr-from").innerHTML = `<span>Came from:</span> ${s.from}`;
  document.getElementById("scr-count").textContent = `${current + 1} / ${screens.length}`;
  listEl.querySelectorAll(".screen-btn").forEach((b) => b.setAttribute("aria-current", Number(b.dataset.i) === current));
}

listEl.addEventListener("click", (e) => {
  const b = e.target.closest(".screen-btn");
  if (b) show(Number(b.dataset.i));
});
document.getElementById("scr-prev").addEventListener("click", () => show(current - 1));
document.getElementById("scr-next").addEventListener("click", () => show(current + 1));
show(current);

// ---------- 5. Click process images to enlarge ----------
document.querySelectorAll(".zoomable, [data-zoom]").forEach((el) => {
  el.addEventListener("click", () => {
    const src = el.dataset.zoom || el.src;
    const alt = el.dataset.alt || el.alt || "";
    const box = document.createElement("div");
    box.className = "lightbox" + (el.dataset.zoom ? " wide" : "");
    box.innerHTML = `<button class="lightbox-close" aria-label="Close">×</button><img src="${src}" alt="${alt}">`;
    const close = () => { box.remove(); document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    box.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    document.body.appendChild(box);
    box.querySelector("button").focus();
  });
});

// ---------- 6. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

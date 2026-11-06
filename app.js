// ---------- Storage helpers ----------
const store = {
  get: (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};
const getProfile = () => store.get("cp_profile", null);
const getBookmarks = () => store.get("cp_bookmarks", []);
function toggleBookmark(id) {
  let b = getBookmarks();
  b = b.includes(id) ? b.filter(x => x !== id) : [...b, id];
  store.set("cp_bookmarks", b); updateCount(); return b.includes(id);
}
function updateCount() { const el = document.getElementById("bmCount"); if (el) el.textContent = getBookmarks().length; }

// ---------- Utilities ----------
const daysLeft = d => Math.ceil((new Date(d) - new Date()) / 86400000);
const fmt = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const matchesProfile = (item, p) => !p || item.field === "All" || (item.field === p.field && (item.branch === "All" || item.branch === p.branch));

function newsCard(n) {
  const saved = getBookmarks().includes(n.id);
  return `<article class="card item"><div class="meta"><span class="pill">${n.cat}</span><span>${fmt(n.date)}</span></div>
  <h3>${n.title}</h3><p>${n.summary}</p><div class="foot"><small>${n.field}${n.branch !== "All" ? " · " + n.branch : ""}</small>
  <button class="bm ${saved ? "on" : ""}" data-id="${n.id}" title="Bookmark">${saved ? "★" : "☆"}</button></div></article>`;
}
function oppCard(o) {
  const saved = getBookmarks().includes(o.id), dl = daysLeft(o.deadline);
  const urgency = dl < 0 ? "closed" : dl <= 10 ? "soon" : "";
  return `<article class="card item"><div class="meta"><span class="pill">${o.type}</span><span class="dl ${urgency}">${dl < 0 ? "Closed" : dl + " days left"}</span></div>
  <h3>${o.title}</h3><p class="org">${o.org}</p><ul><li><b>Eligibility:</b> ${o.elig}</li><li><b>Reward:</b> ${o.reward}</li><li><b>Deadline:</b> ${fmt(o.deadline)}</li></ul>
  <div class="foot"><small>${o.field}${o.branch !== "All" ? " · " + o.branch : ""}</small>
  <button class="bm ${saved ? "on" : ""}" data-id="${o.id}" title="Bookmark">${saved ? "★" : "☆"}</button></div></article>`;
}
function bindBookmarks(root, rerender) {
  root.onclick = e => {
    const btn = e.target.closest(".bm"); if (!btn) return;
    const on = toggleBookmark(btn.dataset.id);
    btn.classList.toggle("on", on); btn.textContent = on ? "★" : "☆";
    if (rerender) rerender();
  };
}
const empty = msg => `<p class="empty">${msg}</p>`;

// ---------- Pages ----------
function initHome() {
  const fieldSel = document.getElementById("fieldSel"), branchSel = document.getElementById("branchSel");
  fieldSel.innerHTML = Object.keys(FIELDS).map(f => `<option>${f}</option>`).join("");
  const fillBranches = () => branchSel.innerHTML = FIELDS[fieldSel.value].map(b => `<option>${b}</option>`).join("");
  fieldSel.onchange = fillBranches;
  document.getElementById("interestBox").innerHTML = INTERESTS.map(i => `<label class="chip"><input type="checkbox" name="interests" value="${i}">${i}</label>`).join("");
  const form = document.getElementById("profileForm"), p = getProfile();
  if (p) {
    form.name.value = p.name; fieldSel.value = p.field; fillBranches(); branchSel.value = p.branch; form.year.value = p.year; form.skills.value = p.skills;
    form.querySelectorAll("[name=interests]").forEach(c => c.checked = p.interests.includes(c.value));
  } else fillBranches();
  form.onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(form);
    store.set("cp_profile", { name: fd.get("name"), field: fd.get("field"), branch: fd.get("branch"), year: fd.get("year"), skills: fd.get("skills"), interests: fd.getAll("interests") });
    location.href = "dashboard.html";
  };
}

function initDashboard() {
  const p = getProfile();
  if (!p) { document.querySelector("main").innerHTML = `<section class="card empty-state"><h2>No profile yet</h2><p>Create your profile to see a personalized dashboard.</p><a class="btn" href="index.html#profile">Create profile</a></section>`; return; }
  document.getElementById("welcome").innerHTML = `<h1>Hello, ${p.name} 👋</h1><p>${p.year} · ${p.field} · <b>${p.branch}</b></p><a href="index.html#profile" class="link">Edit profile</a>`;
  const news = NEWS.filter(n => matchesProfile(n, p)).sort((a, b) => b.date.localeCompare(a.date));
  let opps = OPPS.filter(o => matchesProfile(o, p) && daysLeft(o.deadline) >= 0);
  if (p.interests.length) opps.sort((a, b) => p.interests.includes(b.type) - p.interests.includes(a.type));
  document.getElementById("stats").innerHTML = [["News for you", news.length], ["Open opportunities", opps.length], ["Closing in 10 days", opps.filter(o => daysLeft(o.deadline) <= 10).length], ["Saved", getBookmarks().length]]
    .map(([l, v]) => `<div class="card stat"><b>${v}</b><span>${l}</span></div>`).join("");
  document.getElementById("deadlines").innerHTML = [...opps].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5)
    .map(o => `<div class="row"><span>${o.title} <small>· ${o.org}</small></span><span class="dl ${daysLeft(o.deadline) <= 10 ? "soon" : ""}">${daysLeft(o.deadline)} days</span></div>`).join("") || empty("No upcoming deadlines.");
  const dn = document.getElementById("dashNews"), dop = document.getElementById("dashOpps");
  dn.innerHTML = news.slice(0, 3).map(newsCard).join("") || empty("No news yet.");
  dop.innerHTML = opps.slice(0, 6).map(oppCard).join("") || empty("No opportunities yet.");
  bindBookmarks(dn); bindBookmarks(dop);
}

function initBoard(data, cats, cardFn, catKey) {
  const p = getProfile(), search = document.getElementById("search"), ff = document.getElementById("fieldFilter"), list = document.getElementById("list");
  const mine = document.getElementById("mineOnly"), sortSel = document.getElementById("sortSel");
  ff.innerHTML = `<option value="">All fields</option>` + Object.keys(FIELDS).map(f => `<option>${f}</option>`).join("");
  let cat = "All";
  const chips = document.getElementById("catChips");
  chips.innerHTML = ["All", ...cats].map(c => `<button class="chip ${c === "All" ? "active" : ""}" data-c="${c}">${c}</button>`).join("");
  chips.onclick = e => { const b = e.target.closest("button"); if (!b) return; cat = b.dataset.c; chips.querySelectorAll("button").forEach(x => x.classList.toggle("active", x === b)); render(); };
  function render() {
    const q = search.value.toLowerCase();
    let items = data.filter(d => (cat === "All" || d[catKey] === cat)
      && (!ff.value || d.field === ff.value || d.field === "All")
      && (!mine || !mine.checked || matchesProfile(d, p))
      && JSON.stringify(d).toLowerCase().includes(q));
    if (sortSel) items.sort((a, b) => sortSel.value === "title" ? a.title.localeCompare(b.title) : a.deadline.localeCompare(b.deadline));
    else items.sort((a, b) => b.date.localeCompare(a.date));
    list.innerHTML = items.map(cardFn).join("") || empty("Nothing matches your filters.");
  }
  [search, ff, mine, sortSel].forEach(el => el && el.addEventListener("input", render));
  if (mine && p) mine.checked = true;
  bindBookmarks(list); render();
}

function initSaved() {
  const list = document.getElementById("list");
  const render = () => {
    const b = getBookmarks();
    list.innerHTML = [...NEWS.filter(n => b.includes(n.id)).map(newsCard), ...OPPS.filter(o => b.includes(o.id)).map(oppCard)].join("")
      || empty("No saved items yet — tap ☆ on any news or opportunity.");
  };
  bindBookmarks(list, render); render();
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCount();
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav nav a").forEach(a => { if (location.pathname.endsWith(a.getAttribute("href"))) a.classList.add("active"); });
  if (page === "home") initHome();
  if (page === "dashboard") initDashboard();
  if (page === "news") initBoard(NEWS, [...new Set(NEWS.map(n => n.cat))], newsCard, "cat");
  if (page === "opps") initBoard(OPPS, INTERESTS, oppCard, "type");
  if (page === "saved") initSaved();
});

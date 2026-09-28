(function () {
  const C = window.CONFIG, P = window.PRODUCTS;
  const money = n => "$" + n.toLocaleString("es-MX");
  const wa = text => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;

  // Si una foto no existe, se oculta y queda el fondo elegante
  document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.classList.add("broken"); }, true);

  const card = p => `
    <article class="card reveal">
      <div class="card__media">
        <span class="ph">${p.emoji}</span>
        <img src="assets/img/${p.img}" alt="${p.name}" loading="lazy">
        ${p.oldPrice ? `<span class="badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}
      </div>
      <div class="card__body">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card__foot">
          <div class="price">${money(p.price)}${p.oldPrice ? ` <s>${money(p.oldPrice)}</s>` : ""}</div>
          <a class="btn btn--sm" target="_blank" rel="noopener" href="${wa(`Necesito más información de "${p.name}"`)}">Pedir →</a>
        </div>
      </div>
    </article>`;

  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
  const watch = () => document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
  const render = (id, list) => { document.getElementById(id).innerHTML = list.map(card).join(""); watch(); };

  render("ofertas-grid", P.filter(p => p.oldPrice));
  render("paquetes-grid", P.filter(p => p.category === "paquetes"));

  const filters = document.getElementById("filters");
  const cats = ["todos", ...new Set(P.map(p => p.category))];
  filters.innerHTML = cats.map((c, i) => `<button class="chip ${i ? "" : "active"}" data-c="${c}">${c}</button>`).join("");
  const show = c => render("catalogo-grid", c === "todos" ? P : P.filter(p => p.category === c));
  filters.addEventListener("click", e => {
    if (!e.target.dataset.c) return;
    filters.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b === e.target));
    show(e.target.dataset.c);
  });
  show("todos");

  document.querySelectorAll("[data-cfg]").forEach(el => el.textContent = C[el.dataset.cfg]);
  document.querySelectorAll("[data-wa]").forEach(el => el.href = wa("Hola, necesito información sobre sus flores."));
  document.getElementById("year").textContent = new Date().getFullYear();

  const header = document.querySelector("header"), nav = document.getElementById("nav");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 60);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  document.getElementById("menu-btn").onclick = () => nav.classList.toggle("open");
  nav.addEventListener("click", () => nav.classList.remove("open"));
  watch();
})();

/* ==========================================================================
   Fisioterapia e Pilates Cidade Jardim — interações
   Cada módulo é independente e sai silenciosamente se seus elementos não
   existirem, para que uma mudança no HTML nunca derrube o resto da página.
   ========================================================================== */
(function () {
  "use strict";

  var WHATSAPP = "5511988058005";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mqDesktop = window.matchMedia("(min-width: 901px)");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* Agrupa trabalho de scroll num único listener com rAF. */
  var scrollJobs = [];
  var ticking = false;
  function onScroll(fn) { scrollJobs.push(fn); fn(); }
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      for (var i = 0; i < scrollJobs.length; i++) scrollJobs[i]();
      ticking = false;
    });
  }, { passive: true });

  /* ---------------------------------------------------------------- Reveal */
  (function revealModule() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    items.forEach(function (el) {
      var d = el.getAttribute("data-reveal-delay");
      if (d) el.style.setProperty("--d", d);
    });

    function revealAll() {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      pending = [];
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    var pending = items.slice();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

    function show(el) {
      el.classList.add("is-visible");
      io.unobserve(el);
      var i = pending.indexOf(el);
      if (i > -1) pending.splice(i, 1);
    }

    /* Varredura direta, sem depender de rAF nem do observer: garante que
       nada fique invisível se a aba abrir em segundo plano. */
    function sweep() {
      if (!pending.length) return;
      var limit = window.innerHeight * 1.05;
      pending.slice().forEach(function (el) {
        if (el.getBoundingClientRect().top < limit) show(el);
      });
    }

    items.forEach(function (el) { io.observe(el); });

    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep, { passive: true });
    window.addEventListener("load", sweep);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) sweep();
    });
    window.setTimeout(sweep, 80);

    /* Último recurso: se nada apareceu, mostra tudo em vez de deixar
       a página em branco. */
    window.setTimeout(function () {
      if (!document.querySelector("[data-reveal].is-visible")) revealAll();
    }, 2500);
  })();

  /* ------------------------------------------------------- Barra de leitura */
  (function progressModule() {
    var bar = $("#progressBar");
    if (!bar) return;
    onScroll(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    });
  })();

  /* ----------------------------------------------------- Cabeçalho fixo */
  (function headerModule() {
    var header = $("#header");
    if (!header) return;
    onScroll(function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    });
  })();

  /* ------------------------------------------------- Aviso de endereço */
  (function topbarModule() {
    var bar = $("#topbar");
    var btn = $("#topbarClose");
    if (!bar || !btn) return;

    try {
      if (sessionStorage.getItem("topbarClosed") === "1") {
        bar.style.display = "none";
      }
    } catch (e) { /* sessionStorage bloqueado — segue exibindo */ }

    btn.addEventListener("click", function () {
      bar.style.height = bar.offsetHeight + "px";
      window.requestAnimationFrame(function () {
        bar.classList.add("is-closed");
        bar.style.height = "0px";
      });
      window.setTimeout(function () { bar.style.display = "none"; }, 450);
      try { sessionStorage.setItem("topbarClosed", "1"); } catch (e) {}
    });
  })();

  /* -------------------------------------------------------- Menu (celular) */
  (function menuModule() {
    var toggle = $("#navToggle");
    var panel = $("#navMenu");
    if (!toggle || !panel) return;

    var backdrop = document.createElement("div");
    backdrop.className = "nav__backdrop";
    document.body.appendChild(backdrop);

    var isOpen = false;
    var lastFocus = null;

    function focusables() {
      return $$("a[href], button:not([disabled])", panel).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function open() {
      isOpen = true;
      lastFocus = document.activeElement;
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("is-locked");
      var f = focusables();
      if (f.length) f[0].focus();
    }

    function close() {
      isOpen = false;
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("is-locked");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    toggle.addEventListener("click", function () { isOpen ? close() : open(); });
    backdrop.addEventListener("click", close);

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a") && isOpen) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      var f = focusables();
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    /* Ao voltar para desktop, desfaz o estado de menu aberto. */
    var onChange = function (e) { if (e.matches && isOpen) close(); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onChange);
    else if (mqDesktop.addListener) mqDesktop.addListener(onChange);
  })();

  /* ------------------------------------------ Seção ativa no menu (spy) */
  (function spyModule() {
    var links = $$("[data-spy]");
    if (!links.length) return;

    var indicator = $("#navIndicator");
    var targets = links.map(function (a) {
      var id = a.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    });

    function moveIndicator(link) {
      if (!indicator) return;
      if (!mqDesktop.matches || !link) { indicator.style.opacity = "0"; return; }
      var host = link.parentElement.parentElement; // ul.nav__menu
      var l = link.getBoundingClientRect();
      var h = host.getBoundingClientRect();
      indicator.style.opacity = "1";
      indicator.style.width = l.width + "px";
      indicator.style.transform = "translateX(" + (l.left - h.left) + "px)";
    }

    var current = null;
    onScroll(function () {
      var line = window.scrollY + window.innerHeight * 0.32;
      var activeIdx = -1;

      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        if (!t) continue;
        var top = t.offsetTop;
        if (line >= top && line < top + t.offsetHeight) { activeIdx = i; break; }
      }

      var link = activeIdx >= 0 ? links[activeIdx] : null;
      if (link === current) return;
      current = link;
      links.forEach(function (a) { a.classList.remove("is-active"); });
      if (link) link.classList.add("is-active");
      moveIndicator(link);
    });

    window.addEventListener("resize", function () { moveIndicator(current); }, { passive: true });
  })();

  /* --------------------------------------------------------- Contadores */
  (function counterModule() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    function finalValue(el) {
      var t = parseInt(el.getAttribute("data-count"), 10);
      return isNaN(t) ? null : t;
    }

    function setFinal(el) {
      var t = finalValue(el);
      if (t !== null) el.textContent = String(t);
    }

    function run(el) {
      var target = finalValue(el);
      if (target === null) return;

      /* Em aba oculta o rAF fica suspenso e o número congelaria num valor
         parcial — nesse caso vai direto ao valor final. */
      if (reduceMotion || document.hidden) { setFinal(el); return; }

      var dur = 1100;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }

    var done = [];
    function fire(el) {
      if (done.indexOf(el) > -1) return;
      done.push(el);
      io.unobserve(el);
      run(el);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) fire(entry.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });

    /* Mesma proteção do reveal: o número nunca fica travado num valor
       parcial nem em zero. */
    window.setTimeout(function () {
      nums.forEach(function (el) {
        var visivel = el.getBoundingClientRect().top < window.innerHeight;
        if (done.indexOf(el) === -1 && visivel) fire(el);
        if (visivel && el.textContent !== String(finalValue(el))) setFinal(el);
      });
    }, 2500);

    /* Se a aba voltar a ficar visível no meio da contagem, completa. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) return;
      nums.forEach(function (el) {
        if (done.indexOf(el) > -1 && el.textContent !== String(finalValue(el))) setFinal(el);
      });
    });
  })();

  /* ------------------------------------------------ Parallax do hero */
  (function parallaxModule() {
    var stage = $("#heroStage");
    if (!stage || reduceMotion) return;

    var cards = $$("[data-depth]", stage);
    if (!cards.length) return;

    /* Usa a propriedade `translate`, que compõe com o transform da
       animação de flutuação em vez de sobrescrevê-lo. */
    function reset() { cards.forEach(function (c) { c.style.translate = ""; }); }

    function onMove(e) {
      if (!mqDesktop.matches) return;
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      cards.forEach(function (c) {
        var depth = parseFloat(c.getAttribute("data-depth")) || 0.5;
        c.style.translate = (dx * depth * -16).toFixed(2) + "px " + (dy * depth * -16).toFixed(2) + "px";
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", reset);
    var onChange = function (e) { if (!e.matches) reset(); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onChange);
    else if (mqDesktop.addListener) mqDesktop.addListener(onChange);
  })();

  /* ------------------------------------------------ Filtros de serviço */
  (function filterModule() {
    var buttons = $$(".filter");
    var grid = $("#servicosGrid");
    var empty = $("#cardsEmpty");
    if (!buttons.length || !grid) return;

    var cards = $$(".card", grid);

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");

        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });

        var shown = 0;
        cards.forEach(function (card) {
          var match = cat === "todos" || card.getAttribute("data-cat") === cat;
          card.classList.toggle("is-hidden", !match);
          card.classList.remove("is-filtering");
          if (match) {
            shown++;
            /* reinicia a animação de entrada */
            void card.offsetWidth;
            card.classList.add("is-filtering");
          }
        });

        if (empty) empty.hidden = shown !== 0;
      });
    });
  })();

  /* ------------------------------------------------------- Carrossel */
  (function carouselModule() {
    var root = $("#carousel");
    var track = $("#carouselTrack");
    var viewport = $("#carouselViewport");
    var dotsBox = $("#carouselDots");
    var prev = $("#carouselPrev");
    var next = $("#carouselNext");
    if (!root || !track || !viewport) return;

    var slides = $$(".carousel__slide", track);
    if (slides.length < 2) {
      if (root.querySelector(".carousel__controls")) {
        root.querySelector(".carousel__controls").style.display = "none";
      }
      return;
    }

    var index = 0;
    var timer = null;
    var DELAY = 6000;

    slides.forEach(function (s, i) {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (i + 1) + " de " + slides.length);
    });

    var dots = [];
    if (dotsBox) {
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "carousel__dot";
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", "Depoimento " + (i + 1));
        d.addEventListener("click", function () { go(i); restart(); });
        dotsBox.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) {
        var on = i === index;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", on ? "true" : "false");
      });
      slides.forEach(function (s, i) {
        /* esconde do leitor de tela o que está fora de vista */
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(function () { go(index + 1); }, DELAY);
    }
    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); restart(); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); restart(); }
    });

    /* Arrastar / deslizar */
    var startX = 0, delta = 0, dragging = false, pid = null;

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      pid = e.pointerId;
      startX = e.clientX;
      delta = 0;
      stop();
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointermove", function (e) {
      if (!dragging || e.pointerId !== pid) return;
      delta = e.clientX - startX;
      track.style.transform = "translateX(calc(-" + index * 100 + "% + " + delta + "px))";
    });

    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false;
      pid = null;
      viewport.classList.remove("is-dragging");

      var threshold = Math.min(90, viewport.offsetWidth * 0.18);
      if (delta > threshold) go(index - 1);
      else if (delta < -threshold) go(index + 1);
      else render();

      delta = 0;
      start();
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    /* Impede que o arraste vire clique/seleção */
    viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

    render();
    start();
  })();

  /* ------------------------------------------------------------- FAQ */
  (function faqModule() {
    var root = $("#faqList");
    if (!root) return;
    var triggers = $$(".faq__trigger", root);
    if (!triggers.length) return;

    triggers.forEach(function (btn, i) {
      var item = btn.closest(".faq__item");
      var panel = $(".faq__panel", item);
      if (!panel) return;

      var pid = "faq-panel-" + (i + 1);
      panel.id = pid;
      btn.setAttribute("aria-controls", pid);

      btn.addEventListener("click", function () {
        var willOpen = btn.getAttribute("aria-expanded") !== "true";

        /* uma resposta aberta por vez */
        triggers.forEach(function (other) {
          var oItem = other.closest(".faq__item");
          other.setAttribute("aria-expanded", "false");
          if (oItem) oItem.classList.remove("is-open");
        });

        if (willOpen) {
          btn.setAttribute("aria-expanded", "true");
          item.classList.add("is-open");
        }
      });
    });
  })();

  /* -------------------------------------------------- Formulário → WhatsApp */
  (function formModule() {
    var form = $("#bookingForm");
    if (!form) return;

    var nome = $("#fNome");
    var servico = $("#fServico");
    var msg = $("#fMsg");
    var preview = $("#formPreview");

    function periodo() {
      var checked = form.querySelector('input[name="periodo"]:checked');
      return checked ? checked.value : "";
    }

    function buildText() {
      var n = (nome && nome.value.trim()) || "";
      var s = (servico && servico.value) || "";
      var p = periodo();
      var m = (msg && msg.value.trim()) || "";

      var t = "Olá! Meu nome é " + (n || "[seu nome]") + ".";
      t += "\nGostaria de agendar: " + (s || "[serviço]") + ".";
      if (p) t += "\nMelhor período: " + p + ".";
      if (m) t += "\n\n" + m;
      return t;
    }

    function updatePreview() {
      if (preview) preview.textContent = buildText();
    }

    function setError(field, on) {
      if (!field) return;
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("has-error", on);
      var err = form.querySelector('[data-error-for="' + field.id + '"]');
      if (err) err.hidden = !on;
    }

    ["input", "change"].forEach(function (evt) {
      form.addEventListener(evt, function (e) {
        updatePreview();
        if (e.target === nome && nome.value.trim()) setError(nome, false);
        if (e.target === servico && servico.value) setError(servico, false);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var okNome = !!(nome && nome.value.trim());
      var okServ = !!(servico && servico.value);
      setError(nome, !okNome);
      setError(servico, !okServ);

      if (!okNome) { nome.focus(); return; }
      if (!okServ) { servico.focus(); return; }

      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(buildText());
      window.open(url, "_blank", "noopener");
    });

    updatePreview();
  })();

  /* --------------------------------------------------- Copiar endereço */
  (function copyModule() {
    var btn = $("#copyAddress");
    var label = $("#copyAddressLabel");
    if (!btn || !label) return;

    var original = label.textContent;
    var resetTimer = null;

    function feedback(text) {
      label.textContent = text;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () { label.textContent = original; }, 2200);
    }

    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-address") || "";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { feedback("Endereço copiado!"); },
          function () { feedback("Não foi possível copiar"); }
        );
        return;
      }

      /* Navegadores sem Clipboard API */
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        feedback(document.execCommand("copy") ? "Endereço copiado!" : "Não foi possível copiar");
      } catch (err) {
        feedback("Não foi possível copiar");
      }
      document.body.removeChild(ta);
    });
  })();

  /* ------------------------------------- Voltar ao topo + barra do celular */
  (function floatingModule() {
    var top = $("#backToTop");
    var bar = $("#mobilebar");

    if (top) {
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    if (!top && !bar) return;

    onScroll(function () {
      var past = window.scrollY > window.innerHeight * 0.6;
      if (top) top.classList.toggle("is-visible", past);
      if (bar) bar.classList.toggle("is-visible", past);
    });
  })();

  /* ------------------------------------------------------- Ano do rodapé */
  (function yearModule() {
    var el = $("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();

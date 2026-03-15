(function () {
  var commandItems = [
    { label: "Open Experience", href: "/experience/" },
    { label: "Open Projects", href: "/projects/" },
    { label: "Open Skills", href: "/skills/" },
    { label: "Open Recommendations", href: "/recommendations/" },
    { label: "Open Resume", href: "/resume/" },
    { label: "Show Leapwork", href: "/projects/" },
    { label: "Why Sumit", href: "/recommendations/" }
  ];

  var assistantResponses = [
    {
      match: ["why sumit", "why hire", "why you"],
      answer: "Because the portfolio consistently shows a mix of hands-on engineering depth, delivery leadership, modern AI workflow thinking, and strong public recommendations."
    },
    {
      match: ["leapwork", "current role"],
      answer: "Current role: Engineering Manager at Leapwork, focused on execution systems, AI-enabled delivery, developer effectiveness, and product/platform thinking."
    },
    {
      match: ["react", "javascript", "frontend"],
      answer: "Public GitHub signal is strongest in JavaScript and React-oriented work, backed by frontend-heavy product delivery and side projects."
    },
    {
      match: ["leadership", "how i lead"],
      answer: "Leadership style here emphasizes clarity in ambiguity, structured execution, calm delivery, people growth, and systems that increase team leverage."
    },
    {
      match: ["projects", "show projects"],
      answer: "The projects page mixes official product work like Leapwork and SaxoTraderGO with side builds like Nuble, TMDB, CSVBreaker, Doodle, and the weather app."
    }
  ];

  function qsAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function activateByData(triggerSelector, panelSelector, key, value) {
    qsAll(triggerSelector).forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute(key) === value);
    });
    qsAll(panelSelector).forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute(key.replace("tab", "panel")) === value || el.getAttribute("data-era-panel") === value || el.getAttribute("data-sim-panel") === value);
    });
  }

  function setupPersonaTabs() {
    qsAll("[data-persona-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-persona-tab");
        qsAll("[data-persona-tab]").forEach(function (el) {
          el.classList.toggle("is-active", el.getAttribute("data-persona-tab") === value);
        });
        qsAll("[data-persona-panel]").forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-persona-panel") === value);
        });
      });
    });
  }

  function setupTimeline() {
    qsAll("[data-era]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-era");
        qsAll("[data-era]").forEach(function (el) {
          el.classList.toggle("is-active", el.getAttribute("data-era") === value);
        });
        qsAll("[data-era-panel]").forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-era-panel") === value);
        });
      });
    });
  }

  function setupSimulator() {
    qsAll("[data-sim-case]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-sim-case");
        qsAll("[data-sim-case]").forEach(function (el) {
          el.classList.toggle("is-active", el.getAttribute("data-sim-case") === value);
        });
        qsAll("[data-sim-panel]").forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-sim-panel") === value);
        });
      });
    });
  }

  function setupTeardowns() {
    qsAll(".teardown-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".teardown-item");
        if (item) {
          item.classList.toggle("is-open");
        }
      });
    });
  }

  function setupRecommendationFilters() {
    qsAll(".rec-filter").forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-rec-filter");
        qsAll(".rec-filter").forEach(function (el) {
          el.classList.toggle("is-active", el === button);
        });
        qsAll(".recommendation-grid .recommendation-card").forEach(function (card) {
          var tags = (card.getAttribute("data-rec-tags") || "").toLowerCase();
          var show = filter === "all" || tags.indexOf(filter.toLowerCase()) > -1;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  function setupPrintResume() {
    qsAll("[data-print-resume]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  function setupReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    qsAll(".section-panel, .career-card, .project-card, .recommendation-card, .manifesto-card, .stack-band, .launcher-card, .dashboard-panel, .chart-panel").forEach(function (el) {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  }

  function createCommandPalette() {
    var shell = document.createElement("div");
    shell.className = "command-palette-shell";
    shell.innerHTML =
      '<button class="command-launcher" type="button">Command</button>' +
      '<div class="command-backdrop" hidden></div>' +
      '<div class="command-modal" hidden>' +
      '<div class="command-modal-inner">' +
      '<input class="command-input" type="text" placeholder="Type: open projects, show leapwork, why sumit" />' +
      '<div class="command-list"></div>' +
      '</div>' +
      '</div>';
    document.body.appendChild(shell);

    var launcher = shell.querySelector(".command-launcher");
    var backdrop = shell.querySelector(".command-backdrop");
    var modal = shell.querySelector(".command-modal");
    var input = shell.querySelector(".command-input");
    var list = shell.querySelector(".command-list");

    function render(query) {
      var q = (query || "").toLowerCase();
      var items = commandItems.filter(function (item) {
        return !q || item.label.toLowerCase().indexOf(q) > -1;
      });
      list.innerHTML = items.map(function (item) {
        return '<button class="command-item" data-href="' + item.href + '" type="button">' + item.label + "</button>";
      }).join("");
      qsAll(".command-item", list).forEach(function (item) {
        item.addEventListener("click", function () {
          window.location.href = item.getAttribute("data-href");
        });
      });
    }

    function openPalette() {
      backdrop.hidden = false;
      modal.hidden = false;
      render("");
      input.value = "";
      setTimeout(function () { input.focus(); }, 0);
    }

    function closePalette() {
      backdrop.hidden = true;
      modal.hidden = true;
    }

    launcher.addEventListener("click", openPalette);
    backdrop.addEventListener("click", closePalette);
    input.addEventListener("input", function () { render(input.value); });

    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
      if (event.key === "Escape") {
        closePalette();
      }
    });
  }

  function createAssistant() {
    var shell = document.createElement("div");
    shell.className = "assistant-shell";
    shell.innerHTML =
      '<button class="assistant-launcher" type="button">Ask Sumit</button>' +
      '<div class="assistant-panel" hidden>' +
      '<div class="assistant-head">Ask My Portfolio</div>' +
      '<div class="assistant-log"><div class="assistant-line assistant-line-ai">Ask: Why Sumit, show projects, Leapwork, leadership.</div></div>' +
      '<form class="assistant-form">' +
      '<input class="assistant-input" type="text" placeholder="Ask my portfolio..." />' +
      '<button type="submit">Send</button>' +
      '</form>' +
      '</div>';
    document.body.appendChild(shell);

    var launcher = shell.querySelector(".assistant-launcher");
    var panel = shell.querySelector(".assistant-panel");
    var log = shell.querySelector(".assistant-log");
    var form = shell.querySelector(".assistant-form");
    var input = shell.querySelector(".assistant-input");

    launcher.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        input.focus();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value.trim();
      if (!text) {
        return;
      }
      var lower = text.toLowerCase();
      var answer = "I can answer questions about Leapwork, projects, skills, recommendations, and leadership style.";

      assistantResponses.forEach(function (entry) {
        if (entry.match.some(function (term) { return lower.indexOf(term) > -1; })) {
          answer = entry.answer;
        }
      });

      log.insertAdjacentHTML("beforeend", '<div class="assistant-line assistant-line-user">' + text + '</div>');
      log.insertAdjacentHTML("beforeend", '<div class="assistant-line assistant-line-ai">' + answer + '</div>');
      log.scrollTop = log.scrollHeight;
      input.value = "";
    });
  }

  function createGame() {
    var shell = document.createElement("div");
    shell.className = "game-shell";
    shell.innerHTML =
      '<button class="game-launcher" type="button">Play Game</button>' +
      '<div class="game-panel" hidden>' +
      '<div class="game-head">' +
      '<span>Mini Game: Catch the Pulse</span>' +
      '<button class="game-close" type="button">Close</button>' +
      '</div>' +
      '<div class="game-meta">' +
      '<span class="game-score">Score: 0</span>' +
      '<span class="game-timer">Time: 20</span>' +
      '<button class="game-start" type="button">Start</button>' +
      '</div>' +
      '<div class="game-board">' +
      '<button class="game-target" type="button" aria-label="Catch the pulse"></button>' +
      '<div class="game-message">Hit the moving pulse as many times as you can in 20 seconds.</div>' +
      '</div>' +
      '</div>';
    document.body.appendChild(shell);

    var launcher = shell.querySelector(".game-launcher");
    var panel = shell.querySelector(".game-panel");
    var closeButton = shell.querySelector(".game-close");
    var startButton = shell.querySelector(".game-start");
    var board = shell.querySelector(".game-board");
    var target = shell.querySelector(".game-target");
    var scoreEl = shell.querySelector(".game-score");
    var timerEl = shell.querySelector(".game-timer");
    var messageEl = shell.querySelector(".game-message");
    var score = 0;
    var timeLeft = 20;
    var gameInterval = null;
    var countdown = null;
    var active = false;

    function placeTarget() {
      var maxX = Math.max(board.clientWidth - 48, 10);
      var maxY = Math.max(board.clientHeight - 48, 10);
      var x = Math.floor(Math.random() * maxX);
      var y = Math.floor(Math.random() * maxY);
      target.style.left = x + "px";
      target.style.top = y + "px";
    }

    function stopGame() {
      active = false;
      window.clearInterval(gameInterval);
      window.clearInterval(countdown);
      gameInterval = null;
      countdown = null;
      target.disabled = true;
      messageEl.textContent = "Final score: " + score + ". Hit Start to play again.";
    }

    function startGame() {
      score = 0;
      timeLeft = 20;
      active = true;
      scoreEl.textContent = "Score: 0";
      timerEl.textContent = "Time: 20";
      messageEl.textContent = "Go!";
      target.disabled = false;
      placeTarget();

      window.clearInterval(gameInterval);
      window.clearInterval(countdown);

      gameInterval = window.setInterval(placeTarget, 900);
      countdown = window.setInterval(function () {
        timeLeft -= 1;
        timerEl.textContent = "Time: " + timeLeft;
        if (timeLeft <= 0) {
          stopGame();
        }
      }, 1000);
    }

    launcher.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        placeTarget();
      }
    });

    closeButton.addEventListener("click", function () {
      panel.hidden = true;
      if (active) {
        stopGame();
      }
    });

    startButton.addEventListener("click", startGame);

    target.addEventListener("click", function () {
      if (!active) {
        return;
      }
      score += 1;
      scoreEl.textContent = "Score: " + score;
      placeTarget();
    });

    target.disabled = true;
    placeTarget();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupPersonaTabs();
    setupTimeline();
    setupSimulator();
    setupTeardowns();
    setupRecommendationFilters();
    setupPrintResume();
    setupReveal();
    createCommandPalette();
    createAssistant();
    createGame();
  });
})();

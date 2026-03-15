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

  function setupAISkillLab() {
    var scoreNodes = qsAll("[data-ai-score]");
    var quizzes = qsAll(".ai-quiz-card");
    var resetButtons = qsAll(".ai-lab-reset");

    if (!quizzes.length) {
      return;
    }

    function updateScore() {
      var total = quizzes.length;
      var correct = quizzes.filter(function (quiz) {
        return quiz.getAttribute("data-ai-result") === "correct";
      }).length;
      scoreNodes.forEach(function (node) {
        node.textContent = correct + " / " + total + " correct";
      });
    }

    quizzes.forEach(function (quiz) {
      if (quiz.getAttribute("data-ai-bound") === "true") {
        return;
      }
      quiz.setAttribute("data-ai-bound", "true");

      var options = qsAll("[data-ai-answer]", quiz);
      var feedback = quiz.querySelector(".ai-quiz-feedback");

      options.forEach(function (option) {
        option.addEventListener("click", function () {
          if (quiz.getAttribute("data-ai-answered") === "true") {
            return;
          }

          var result = option.getAttribute("data-ai-answer");
          quiz.setAttribute("data-ai-answered", "true");
          quiz.setAttribute("data-ai-result", result);
          quiz.classList.add(result === "correct" ? "is-correct" : "is-wrong");

          options.forEach(function (btn) {
            var isCorrect = btn.getAttribute("data-ai-answer") === "correct";
            btn.disabled = true;
            btn.classList.toggle("is-correct", isCorrect);
            btn.classList.toggle("is-wrong", btn === option && !isCorrect);
          });

          if (feedback) {
            feedback.hidden = false;
          }

          updateScore();
        });
      });
    });

    resetButtons.forEach(function (button) {
      if (button.getAttribute("data-ai-bound") === "true") {
        return;
      }
      button.setAttribute("data-ai-bound", "true");

      button.addEventListener("click", function () {
        quizzes.forEach(function (quiz) {
          quiz.removeAttribute("data-ai-answered");
          quiz.removeAttribute("data-ai-result");
          quiz.classList.remove("is-correct", "is-wrong");
          var feedback = quiz.querySelector(".ai-quiz-feedback");
          if (feedback) {
            feedback.hidden = true;
          }
          qsAll("[data-ai-answer]", quiz).forEach(function (btn) {
            btn.disabled = false;
            btn.classList.remove("is-correct", "is-wrong");
          });
        });
        updateScore();
      });
    });

    updateScore();
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

  function createAISkillLabFloater() {
    var shell = document.createElement("div");
    shell.className = "ai-lab-shell";
    shell.innerHTML =
      '<button class="ai-lab-launcher" type="button">AI Skill Lab</button>' +
      '<div class="ai-lab-floater" hidden>' +
      '<div class="ai-lab-floater-head">' +
      '<span>AI Skill Lab</span>' +
      '<button class="ai-lab-close" type="button">Close</button>' +
      '</div>' +
      '<div class="ai-lab-floater-body">' +
      '<div class="ai-lab-scorebar">' +
      '<div><span class="signal-label">Lab Score</span><strong class="ai-lab-score" data-ai-score="0">0 / 3 correct</strong></div>' +
      '<button class="secondary-action ai-lab-reset" type="button">Reset Lab</button>' +
      '</div>' +
      '<div class="ai-quiz-grid ai-quiz-grid-floater">' +
      '<article class="ai-quiz-card" data-ai-quiz="prompt">' +
      '<span class="card-index">Challenge 01</span><h3>Prompt Design</h3>' +
      '<p class="ai-quiz-question">A PM asks: “Use AI to summarize customer calls.” What is the best next step?</p>' +
      '<div class="ai-quiz-options">' +
      '<button type="button" data-ai-answer="wrong">Ship a summarizer immediately and improve later.</button>' +
      '<button type="button" data-ai-answer="correct">Clarify users, output format, source quality, success criteria, and review loop before designing the prompt/system.</button>' +
      '<button type="button" data-ai-answer="wrong">Pick the biggest model first and optimize cost later.</button>' +
      '</div>' +
      '<div class="ai-quiz-feedback" hidden>Strong AI delivery starts by defining context, reliability needs, output shape, and human review expectations.</div>' +
      '</article>' +
      '<article class="ai-quiz-card" data-ai-quiz="rag">' +
      '<span class="card-index">Challenge 02</span><h3>RAG Judgment</h3>' +
      '<p class="ai-quiz-question">When is a RAG-style approach most useful?</p>' +
      '<div class="ai-quiz-options">' +
      '<button type="button" data-ai-answer="wrong">When you want the model to be more creative with no constraints.</button>' +
      '<button type="button" data-ai-answer="correct">When answers must stay grounded in changing documents, internal knowledge, or source-controlled facts.</button>' +
      '<button type="button" data-ai-answer="wrong">Whenever any chatbot exists, regardless of data freshness.</button>' +
      '</div>' +
      '<div class="ai-quiz-feedback" hidden>Retrieval helps when freshness, grounding, and traceability matter more than free-form generation.</div>' +
      '</article>' +
      '<article class="ai-quiz-card" data-ai-quiz="risk">' +
      '<span class="card-index">Challenge 03</span><h3>Production Risk</h3>' +
      '<p class="ai-quiz-question">What is the best early production safeguard for an AI workflow used by real teams?</p>' +
      '<div class="ai-quiz-options">' +
      '<button type="button" data-ai-answer="wrong">Hide the prompts so nobody questions the results.</button>' +
      '<button type="button" data-ai-answer="wrong">Trust model quality if the demo looked good once.</button>' +
      '<button type="button" data-ai-answer="correct">Add evaluation criteria, human review checkpoints, and visible failure handling before scaling usage.</button>' +
      '</div>' +
      '<div class="ai-quiz-feedback" hidden>Reliable AI systems need evaluation, review, and explicit failure paths, not just a strong first demo.</div>' +
      '</article>' +
      '</div>' +
      '<div class="ai-deepcut-panel"><p class="eyebrow">DEEP CUT</p><h3>Bonus Scenario</h3><p>Your organization wants an internal AI assistant. The real question is not “Which model?” first. The real question is: what decisions, workflows, knowledge sources, and review constraints will make that assistant useful and safe?</p></div>' +
      '</div>' +
      '</div>';
    document.body.appendChild(shell);

    var launcher = shell.querySelector(".ai-lab-launcher");
    var panel = shell.querySelector(".ai-lab-floater");
    var closeButton = shell.querySelector(".ai-lab-close");

    launcher.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
    });

    closeButton.addEventListener("click", function () {
      panel.hidden = true;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupPersonaTabs();
    setupTimeline();
    setupSimulator();
    setupTeardowns();
    setupRecommendationFilters();
    createAISkillLabFloater();
    setupAISkillLab();
    setupPrintResume();
    setupReveal();
    createCommandPalette();
    createAssistant();
    createGame();
  });
})();

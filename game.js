// ============================================================
// Poker Pot Odds Trainer - Game Logic
// ============================================================

(function () {
  "use strict";

  // ---- Card helpers ----
  const SUITS = [
    { symbol: "\u2660", name: "spades", color: "black" },
    { symbol: "\u2665", name: "hearts", color: "red" },
    { symbol: "\u2666", name: "diamonds", color: "red" },
    { symbol: "\u2663", name: "clubs", color: "black" },
  ];

  const RANKS = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",
  ];

  function buildDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ rank, suit });
      }
    }
    return deck;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function cardHTML(card) {
    return `<span class="card ${card.suit.color}">${card.rank}<span class="suit">${card.suit.symbol}</span></span>`;
  }

  // ---- Scenario generator ----

  // Streets: how many board cards to show
  const STREETS = [
    { name: "Flop", boardCount: 3 },
    { name: "Turn", boardCount: 4 },
    { name: "River", boardCount: 5 },
  ];

  // Generate a creative pot size — mix of odd, realistic, and large amounts
  function randomPot() {
    const ranges = [
      // Small pots (cash game feel): $7 – $55
      () => randInt(7, 55),
      // Medium pots: $56 – $185
      () => randInt(56, 185),
      // Bigger pots: $186 – $475
      () => randInt(186, 475),
      // Tournament-style big pots: $500 – $2400
      () => randInt(5, 24) * 100,
      // Odd/exact amounts that look real: e.g. $37, $113, $68
      () => randInt(12, 399),
    ];
    return ranges[Math.floor(Math.random() * ranges.length)]();
  }

  // Generate a bet that is always <= pot, with varied sizing
  function randomBet(pot) {
    // Common bet fractions that stay at or below pot size
    const fractions = [
      0.2, 0.25, 0.3, 0.33, 0.4, 0.5, 0.6, 0.66, 0.75, 0.8, 0.9, 1.0,
    ];
    const frac = fractions[Math.floor(Math.random() * fractions.length)];
    let bet = Math.round(pot * frac);
    // Add slight jitter so amounts aren't always perfectly round
    const jitter = randInt(-Math.floor(bet * 0.08), Math.floor(bet * 0.08));
    bet = bet + jitter;
    if (bet < 1) bet = 1;
    if (bet > pot) bet = pot; // never larger than the pot
    return bet;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateScenario() {
    const deck = shuffle(buildDeck());
    const hand = [deck.pop(), deck.pop()];
    const street = STREETS[Math.floor(Math.random() * STREETS.length)];
    const board = [];
    for (let i = 0; i < street.boardCount; i++) {
      board.push(deck.pop());
    }

    const pot = randomPot();
    const bet = randomBet(pot);

    // Pot odds = bet / (pot + bet) expressed as a percentage
    const potOddsPercent = (bet / (pot + bet)) * 100;

    return {
      hand,
      board,
      street,
      pot,
      bet,
      potOddsPercent: Math.round(potOddsPercent * 10) / 10, // 1 decimal
    };
  }

  // ---- Generate quiz choices ----
  function generateChoices(correct) {
    // Create 2 wrong answers that are plausible but distinct
    const choices = [];
    choices.push(correct);

    const offsets = shuffle([
      randomOffset(5, 12),
      randomOffset(5, 12),
      randomOffset(13, 25),
      randomOffset(13, 25),
    ]);

    let attempts = 0;
    while (choices.length < 3 && attempts < 20) {
      const offset = offsets[attempts % offsets.length];
      let wrong = correct + offset;
      wrong = Math.round(wrong * 10) / 10;
      if (wrong < 1) wrong = correct + Math.abs(offset);
      if (wrong > 99) wrong = correct - Math.abs(offset);
      wrong = Math.max(1, Math.min(99, wrong));
      wrong = Math.round(wrong * 10) / 10;
      // Ensure not too close to existing choices
      const tooClose = choices.some((c) => Math.abs(c - wrong) < 3);
      if (!tooClose) {
        choices.push(wrong);
      }
      attempts++;
    }
    // Fallback: if we still don't have 3, force some
    while (choices.length < 3) {
      choices.push(Math.round((Math.random() * 60 + 5) * 10) / 10);
    }

    return shuffle(choices);
  }

  function randomOffset(min, max) {
    const value = Math.random() * (max - min) + min;
    return Math.random() < 0.5 ? -value : value;
  }

  // ---- State ----
  let currentScenario = null;
  let sliderRound = 0;
  let sliderTotalError = 0;
  let quizRound = 0;
  let quizCorrect = 0;

  // ---- DOM references ----
  const $ = (sel) => document.querySelector(sel);

  // Screens
  const menuScreen = $("#menu-screen");
  const sliderScreen = $("#slider-screen");
  const quizScreen = $("#quiz-screen");

  function showScreen(screen) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    screen.classList.add("active");
  }

  // ---- Render helpers ----
  function renderScenario(prefix, scenario) {
    $(`#${prefix}-pot`).textContent = `$${scenario.pot}`;
    $(`#${prefix}-bet`).textContent = `$${scenario.bet}`;
    $(`#${prefix}-board`).innerHTML = scenario.board.map(cardHTML).join("");
    $(`#${prefix}-hand`).innerHTML = scenario.hand.map(cardHTML).join("");
  }

  function explanationText(s) {
    return `Pot = $${s.pot}, Bet = $${s.bet}. Pot odds = Bet / (Pot + Bet) = ${s.bet} / (${s.pot} + ${s.bet}) = ${s.bet} / ${s.pot + s.bet} = <strong>${s.potOddsPercent}%</strong>`;
  }

  // ---- Slider Mode ----
  function startSliderMode() {
    sliderRound = 0;
    sliderTotalError = 0;
    showScreen(sliderScreen);
    nextSliderRound();
  }

  function nextSliderRound() {
    sliderRound++;
    currentScenario = generateScenario();
    renderScenario("slider", currentScenario);

    // Reset slider
    const slider = $("#odds-slider");
    slider.value = 50;
    $("#slider-value-display").textContent = "50%";
    slider.disabled = false;
    $("#slider-submit").disabled = false;
    $("#slider-submit").classList.remove("hidden");
    $("#slider-result").classList.add("hidden");
    $("#slider-score").textContent = `Round ${sliderRound} | Avg error: ${sliderRound > 1 ? (sliderTotalError / (sliderRound - 1)).toFixed(1) : "—"}pp`;
  }

  // Slider live update
  $("#odds-slider").addEventListener("input", function () {
    $("#slider-value-display").textContent = this.value + "%";
  });

  // Submit slider
  $("#slider-submit").addEventListener("click", function () {
    const guess = parseFloat($("#odds-slider").value);
    const correct = currentScenario.potOddsPercent;
    const error = Math.abs(guess - correct);
    sliderTotalError += error;

    $("#odds-slider").disabled = true;
    this.disabled = true;

    // Show result
    $("#slider-correct-marker").style.left = correct + "%";
    $("#slider-your-marker").style.left = guess + "%";
    $("#slider-correct-val").textContent = correct.toFixed(1) + "%";
    $("#slider-your-val").textContent = guess.toFixed(1) + "%";

    let msg;
    if (error < 1) {
      msg = "Perfect! Spot on!";
    } else if (error < 3) {
      msg = "Excellent! Very close!";
    } else if (error < 7) {
      msg = "Good effort! Getting there.";
    } else if (error < 15) {
      msg = "Not bad, but room for improvement.";
    } else {
      msg = "Way off — keep practicing!";
    }
    $("#slider-message").textContent = `${msg} (Off by ${error.toFixed(1)} percentage points)`;
    $("#slider-message").className = "result-message " + (error < 3 ? "correct" : error < 10 ? "close" : "wrong");
    $("#slider-explanation").innerHTML = explanationText(currentScenario);

    $("#slider-result").classList.remove("hidden");
    $("#slider-score").textContent = `Round ${sliderRound} | Avg error: ${(sliderTotalError / sliderRound).toFixed(1)}pp`;
  });

  $("#slider-next").addEventListener("click", nextSliderRound);

  // ---- Quiz Mode ----
  function startQuizMode() {
    quizRound = 0;
    quizCorrect = 0;
    showScreen(quizScreen);
    nextQuizRound();
  }

  function nextQuizRound() {
    quizRound++;
    currentScenario = generateScenario();
    renderScenario("quiz", currentScenario);

    const choices = generateChoices(currentScenario.potOddsPercent);
    const container = $("#quiz-choices");
    container.innerHTML = "";

    choices.forEach((value) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = value.toFixed(1) + "%";
      btn.dataset.value = value;
      btn.addEventListener("click", handleQuizChoice);
      container.appendChild(btn);
    });

    $("#quiz-result").classList.add("hidden");
    $("#quiz-score").textContent = `${quizCorrect} / ${quizRound - 1} correct`;
  }

  function handleQuizChoice(e) {
    const chosen = parseFloat(e.target.dataset.value);
    const correct = currentScenario.potOddsPercent;
    const isCorrect = chosen === correct;

    if (isCorrect) quizCorrect++;

    // Highlight buttons
    document.querySelectorAll(".choice-btn").forEach((btn) => {
      btn.removeEventListener("click", handleQuizChoice);
      btn.disabled = true;
      const val = parseFloat(btn.dataset.value);
      if (val === correct) {
        btn.classList.add("correct");
      } else if (val === chosen && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    const msg = isCorrect ? "Correct!" : `Wrong! The answer is ${correct.toFixed(1)}%`;
    $("#quiz-message").textContent = msg;
    $("#quiz-message").className = "result-message " + (isCorrect ? "correct" : "wrong");
    $("#quiz-explanation").innerHTML = explanationText(currentScenario);
    $("#quiz-result").classList.remove("hidden");
    $("#quiz-score").textContent = `${quizCorrect} / ${quizRound} correct`;
  }

  $("#quiz-next").addEventListener("click", nextQuizRound);

  // ---- Navigation ----
  $("#btn-slider-mode").addEventListener("click", startSliderMode);
  $("#btn-quiz-mode").addEventListener("click", startQuizMode);
  $("#slider-back").addEventListener("click", () => showScreen(menuScreen));
  $("#quiz-back").addEventListener("click", () => showScreen(menuScreen));
})();

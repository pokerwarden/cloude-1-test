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

  // ---- Implied Odds Mode ----

  // Draw types with realistic out counts
  const DRAW_TYPES = [
    { name: "Flush Draw", outs: 9, desc: "Four to a flush" },
    { name: "Open-Ended Straight Draw", outs: 8, desc: "Eight outs to a straight" },
    { name: "Gutshot Straight Draw", outs: 4, desc: "Four outs to a straight" },
    { name: "Flush Draw + Gutshot", outs: 12, desc: "Combo draw — flush + gutshot" },
    { name: "Flush Draw + Open-Ender", outs: 15, desc: "Monster combo draw" },
    { name: "Two Overcards", outs: 6, desc: "Six outs to top pair" },
    { name: "One Overcard", outs: 3, desc: "Three outs to top pair" },
    { name: "Backdoor Flush + Gutshot", outs: 5, desc: "Weak draw — thin implied odds" },
    { name: "Set Draw (Pocket Pair)", outs: 2, desc: "Two outs to hit a set" },
    { name: "Flush Draw + Two Overcards", outs: 15, desc: "Big combo draw" },
  ];

  // Only flop and turn make sense for implied odds (river has no future streets)
  const IMPLIED_STREETS = [
    { name: "Flop", boardCount: 3, cardsTocome: 2 },
    { name: "Turn", boardCount: 4, cardsTocome: 1 },
  ];

  let impliedRound = 0;
  let impliedCorrectCount = 0;

  function generateImpliedScenario() {
    const deck = shuffle(buildDeck());
    const hand = [deck.pop(), deck.pop()];
    const street = IMPLIED_STREETS[Math.floor(Math.random() * IMPLIED_STREETS.length)];
    const board = [];
    for (let i = 0; i < street.boardCount; i++) {
      board.push(deck.pop());
    }

    const pot = randomPot();
    const bet = randomBet(pot);

    // Pick a draw type
    const draw = DRAW_TYPES[Math.floor(Math.random() * DRAW_TYPES.length)];

    // Stack sizes — remaining after this call
    // Effective stack between 2x and 8x the pot for interesting implied odds
    const effectiveMultiplier = 2 + Math.random() * 6;
    const yourStack = Math.round(pot * effectiveMultiplier) + bet;
    const villainStack = Math.round(yourStack * (0.7 + Math.random() * 0.6)); // 70%-130% of yours

    // --- Calculate the correct answer ---
    // Equity approximation: Rule of 2 (turn only) or Rule of 4 (flop, 2 cards to come)
    const equityPercent = street.cardsTocome === 2
      ? Math.min(draw.outs * 4, 100)
      : Math.min(draw.outs * 2, 100);
    const equity = equityPercent / 100;

    const potOddsPercent = (bet / (pot + bet)) * 100;
    const potOdds = potOddsPercent / 100;

    // Direct call profitable?
    const directlyProfitable = equity >= potOdds;

    // Required total pot to break even: call / equity
    const requiredTotalPot = bet / equity;
    // Extra money needed beyond what's already in the pot after our call
    const futurePot = pot + bet; // pot after we call (not counting our call as winnings)
    let extraNeeded = requiredTotalPot - futurePot;
    if (extraNeeded < 0) extraNeeded = 0;
    extraNeeded = Math.round(extraNeeded);

    // Can we actually get that from villain?
    const effectiveStack = Math.min(yourStack - bet, villainStack);
    const canGetEnough = extraNeeded <= effectiveStack;

    return {
      hand,
      board,
      street,
      pot,
      bet,
      draw,
      yourStack,
      villainStack,
      equityPercent: Math.round(equityPercent * 10) / 10,
      potOddsPercent: Math.round(potOddsPercent * 10) / 10,
      directlyProfitable,
      extraNeeded,
      requiredTotalPot: Math.round(requiredTotalPot),
      effectiveStack,
      canGetEnough,
    };
  }

  let currentImpliedScenario = null;

  function startImpliedMode() {
    impliedRound = 0;
    impliedCorrectCount = 0;
    showScreen($("#implied-screen"));
    nextImpliedRound();
  }

  function nextImpliedRound() {
    impliedRound++;
    currentImpliedScenario = generateImpliedScenario();
    const s = currentImpliedScenario;

    // Render scenario
    $("#implied-pot").textContent = `$${s.pot}`;
    $("#implied-bet").textContent = `$${s.bet}`;
    $("#implied-your-stack").textContent = `$${s.yourStack}`;
    $("#implied-villain-stack").textContent = `$${s.villainStack}`;
    $("#implied-draw-type").textContent = s.draw.name;
    $("#implied-draw-outs").textContent = `${s.draw.outs} outs`;
    $("#implied-draw-street").textContent = s.street.name;
    $("#implied-board").innerHTML = s.board.map(cardHTML).join("");
    $("#implied-hand").innerHTML = s.hand.map(cardHTML).join("");

    // Reset input
    $("#implied-answer").value = "";
    $("#implied-answer").disabled = false;
    $("#implied-submit").disabled = false;
    $("#implied-result").classList.add("hidden");
    $("#implied-score").textContent = `Round ${impliedRound} | ${impliedCorrectCount} close`;
  }

  // Submit implied odds answer
  $("#implied-submit").addEventListener("click", function () {
    const input = $("#implied-answer");
    const guess = parseInt(input.value) || 0;
    const s = currentImpliedScenario;
    const correct = s.extraNeeded;
    const error = Math.abs(guess - correct);

    input.disabled = true;
    this.disabled = true;

    // Is the user "close enough"? Within 15% of the correct value or $10, whichever is larger
    const tolerance = Math.max(correct * 0.15, 10);
    const isClose = error <= tolerance;
    if (isClose) impliedCorrectCount++;

    // Build result message
    let msg;
    if (correct === 0 && guess === 0) {
      msg = "Perfect! The call is directly profitable — no implied odds needed!";
    } else if (correct === 0 && guess > 0) {
      msg = "The call is already profitable! You don't need any extra money.";
    } else if (error === 0) {
      msg = "Spot on! Exactly right!";
    } else if (isClose) {
      msg = `Close! You said $${guess}, correct is $${correct}. (Off by $${error})`;
    } else {
      msg = `Off by $${error}. Correct answer: $${correct}`;
    }

    $("#implied-message").textContent = msg;
    $("#implied-message").className = "result-message " + (
      error === 0 || (correct === 0 && guess === 0) ? "correct" :
      isClose ? "close" : "wrong"
    );

    // Build breakdown
    const ruleLabel = s.street.cardsTocome === 2 ? "Rule of 4" : "Rule of 2";
    const equityCalc = s.street.cardsTocome === 2
      ? `${s.draw.outs} × 4 = ${s.equityPercent}%`
      : `${s.draw.outs} × 2 = ${s.equityPercent}%`;

    const rows = [
      ["Draw", `${s.draw.name} (${s.draw.desc})`],
      ["Street", `${s.street.name} (${s.street.cardsTocome} card${s.street.cardsTocome > 1 ? "s" : ""} to come)`],
      ["Outs", `${s.draw.outs}`],
      [`Equity (${ruleLabel})`, equityCalc],
      ["Pot Odds", `$${s.bet} / ($${s.pot} + $${s.bet}) = ${s.potOddsPercent}%`],
      ["Direct Call Profitable?", s.directlyProfitable ? "Yes — equity > pot odds" : "No — need implied odds"],
      ["Break-Even Pot Needed", `$${s.bet} / ${(s.equityPercent / 100).toFixed(3)} = $${s.requiredTotalPot}`],
      ["Pot After Calling", `$${s.pot + s.bet}`],
      ["Extra Money Needed", `$${s.requiredTotalPot} − $${s.pot + s.bet} = $${s.extraNeeded}`],
      ["Effective Stack Left", `$${s.effectiveStack}`],
      ["Can Get Enough?", s.extraNeeded === 0 ? "N/A — already profitable" : (s.canGetEnough ? `Yes — $${s.effectiveStack} ≥ $${s.extraNeeded}` : `No — $${s.effectiveStack} < $${s.extraNeeded}`)],
    ];

    const grid = $("#implied-breakdown-grid");
    grid.innerHTML = rows.map(([label, value]) =>
      `<div class="breakdown-label">${label}</div><div class="breakdown-value">${value}</div>`
    ).join("");

    // Verdict
    let verdict;
    if (s.directlyProfitable) {
      verdict = "This is a direct call — your equity beats the pot odds. No implied odds needed.";
    } else if (s.canGetEnough) {
      verdict = `You need to win $${s.extraNeeded} more on later streets. With $${s.effectiveStack} effective stack remaining, there's enough money behind to justify the call IF you expect to get paid.`;
    } else {
      verdict = `You'd need $${s.extraNeeded} extra but only $${s.effectiveStack} effective stack remains. Not enough implied odds — fold is likely correct.`;
    }
    $("#implied-verdict").textContent = verdict;
    $("#implied-verdict").className = "implied-verdict " + (
      s.directlyProfitable ? "profitable" : s.canGetEnough ? "possible" : "fold"
    );

    $("#implied-result").classList.remove("hidden");
    $("#implied-score").textContent = `Round ${impliedRound} | ${impliedCorrectCount} close`;
  });

  $("#implied-next").addEventListener("click", nextImpliedRound);

  // ---- Navigation ----
  $("#btn-slider-mode").addEventListener("click", startSliderMode);
  $("#btn-quiz-mode").addEventListener("click", startQuizMode);
  $("#btn-implied-mode").addEventListener("click", startImpliedMode);
  $("#slider-back").addEventListener("click", () => showScreen(menuScreen));
  $("#quiz-back").addEventListener("click", () => showScreen(menuScreen));
  $("#implied-back").addEventListener("click", () => showScreen(menuScreen));
})();

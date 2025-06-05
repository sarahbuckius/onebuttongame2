let questions = [
  "How are you feeling today?",
  "What’s on your mind right now?",
  "Did anything surprise you recently?",
  "What’s something you’re looking forward to?",
  "If you could teleport anywhere, where would you go?"
];

let userResponsesMap = {
  0: ["Good", "Bad", "Excited", "Tired", "Anxious", "Curious"],
  1: ["Work", "Family", "A project", "Nothing", "A mystery"],
  2: ["Yes", "No", "Kind of", "Can’t say", "Big time"],
  3: ["Vacation", "A meal", "A nap", "Nothing", "Something secret"],
  4: ["Home", "The beach", "The mountains", "Space", "Japan"]
};

let gameState = "ask";
let currentQuestionIndex = 0;
let currentResponseIndex = 0;
let botReply = "", botMood = "";

let timer = 10;
let lastSecond = 0;
let score = 0;
let badges = [];

function setup() {
  createCanvas(700, 500);
  textAlign(CENTER, CENTER);
  textSize(22);
  lastSecond = millis();
}

function draw() {
  background(240);
  drawHUD();

  let question = questions[currentQuestionIndex];
  let userResponses = userResponsesMap[currentQuestionIndex];

  if (gameState === "ask") {
    fill(0);
    text("AI Bot asks:", width / 2, 60);
    text(`"${question}"`, width / 2, 100);

    fill(50, 100, 250);
    rect(width / 2 - 150, height / 2 - 30, 300, 60, 10);
    fill(255);
    text(userResponses[currentResponseIndex], width / 2, height / 2);

    fill(120);
    text("Click to cycle and submit answer", width / 2, height - 50);

    handleTimer();
  } else if (gameState === "reply") {
    fill(0);
    text("You said:", width / 2, 80);
    text(`"${userResponses[currentResponseIndex]}"`, width / 2, 120);
    text(`AI Bot (${botMood}) replies:`, width / 2, 200);
    text(`"${botReply}"`, width / 2, 250);
    fill(120);
    text("Click to go to next question", width / 2, height - 50);
  }
}

function drawHUD() {
  fill(0);
  textSize(18);
  text(`⏱ Time: ${timer}`, 100, 20);
  text(`⭐ Score: ${score}`, 300, 20);
  text(`🎖️ Badges: ${badges.join(", ") || "None"}`, 550, 20);
}

function handleTimer() {
  if (millis() - lastSecond >= 1000) {
    timer--;
    lastSecond = millis();

    if (timer <= 0) {
      botReply = "Time’s up! Let's keep going.";
      botMood = "Impatient";
      speak(botReply);
      gameState = "reply";
    }
  }
}

function mousePressed() {
  let userResponses = userResponsesMap[currentQuestionIndex];

  if (gameState === "ask") {
    currentResponseIndex = (currentResponseIndex + 1) % userResponses.length;

    if (currentResponseIndex === 0) {
      let response = userResponses[currentResponseIndex];
      [botReply, botMood] = generateBotReply(response);
      if (timer > 0) score += 10;
      updateBadges();
      speak(botReply);
      gameState = "reply";
    }
  } else if (gameState === "reply") {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    currentResponseIndex = 0;
    botReply = "";
    botMood = "";
    timer = 10;
    lastSecond = millis();
    gameState = "ask";
  }
}

function generateBotReply(response) {
  let moods = ["Happy", "Sarcastic", "Wise", "Goofy", "Concerned"];
  let mood = random(moods);
  let reply = {
    Happy: `That's wonderful!`,
    Sarcastic: `Well aren't you special.`,
    Wise: `Every thought counts.`,
    Goofy: `Bleep blorp beep! That's fun!`,
    Concerned: `Hmmm. I'm processing that deeply.`
  }[mood];

  return [reply, mood];
}

function speak(text) {
  let speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1.2;
  speech.voice = window.speechSynthesis.getVoices().find(v => v.name.includes("Google") || v.lang === "en-US");
  window.speechSynthesis.speak(speech);
}

function updateBadges() {
  if (score >= 30 && !badges.includes("Listener")) badges.push("Listener");
  if (score >= 60 && !badges.includes("Conversationalist")) badges.push("Conversationalist");
  if (score >= 100 && !badges.includes("AI Whisperer")) badges.push("AI Whisperer");
}

import express from "express";
import admin from "firebase-admin";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import { generateHint, isSuccessHint } from "./hintLogic.js";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

// Static file serving setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from "fs";

dotenv.config({ path: path.join(__dirname, '.env') });

const TRAINING_FILE = path.join(__dirname, "training_data.jsonl");

function logTrainingData({ problemID, section, userInput, hintLevel, hint, isCorrect }) {
  try {
    const entry = JSON.stringify({
      ts: new Date().toISOString(),
      problemID,
      section,
      hintLevel,
      input: userInput,
      hint,
      isCorrect: !!isCorrect
    });
    fs.appendFileSync(TRAINING_FILE, entry + "\n", "utf8");
  } catch (_) {}
}

function getRelevantExamples(problemID, section, maxExamples = 5) {
  try {
    if (!fs.existsSync(TRAINING_FILE)) return "";
    const lines = fs.readFileSync(TRAINING_FILE, "utf8").split("\n").filter(Boolean);
    const relevant = lines
      .map(l => { try { return JSON.parse(l); } catch(_) { return null; } })
      .filter(e => e && e.problemID === problemID && e.section === section && e.input && e.hint)
      .slice(-50);
    const correct = relevant.filter(e => e.isCorrect).slice(-3);
    const incorrect = relevant.filter(e => !e.isCorrect).slice(-3);
    const picked = [...correct, ...incorrect].slice(0, maxExamples);
    if (picked.length === 0) return "";
    return `\nPast user examples from this section (learn from these):\n` +
      picked.map(e =>
        `- User typed: "${e.input.slice(0, 80)}" -> Hint given: "${e.hint.slice(0, 100)}" [${e.isCorrect ? "correct" : "wrong"}]`
      ).join("\n");
  } catch (_) { return ""; }
}
const app = express();

/* ✅ FIXED CORS */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

/* Static file serving */
app.use(express.static(path.join(__dirname, '..')));
app.use('/html', express.static(path.join(__dirname, '../html')));
app.use('/css', express.static(path.join(__dirname, '../css')));

/* 🔹 Firebase Init */
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
    databaseURL: process.env.FIREBASE_DB
});

const db = admin.database();

/* 🔹 OpenAI Init */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* 🔥 API */
app.post("/api/getHint", async (req, res) => {

    console.log("🔥 API HIT");
    console.log("BODY:", req.body);

    try {

        const { category, problemID, userInput } = req.body;

        const snapshot = await db.ref(`programs/${category}/${problemID}`).once("value");

        if (!snapshot.exists()) {
            return res.json({ hint: "No data found" });
        }

        const data = snapshot.val();

        const logic = data["Logic"] || "";
        const keywords = data["Logic keyword"] || "";

        const prompt = `
You are a logical tutor.

Logic:
${logic}

Concept Keywords:
${keywords}

Student Answer:
${userInput}

Task:
- Understand logic
- Compare student answer
- Identify missing part
- Give hint (NO programming words)
- Keep it short

Hint:
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        const hint = completion?.choices?.[0]?.message?.content || "⚠️ No response from AI";

        res.json({ hint });

    } catch (err) {

        console.error("❌ BACKEND ERROR:", err);

        res.json({ hint: "❌ Error generating hint" });
    }
});

/* 🔥 START SERVER */

/* Gemini AI Init */
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey: apiKey });
}
let ai = getAIClient();

app.post("/api/rewriteHint", async (req, res) => {
  const { problemID, section, userContent, hintLevel, recipeContent, logicContent } =
    req.body;

  // Always run local validation to see if the user passed.
  const localHint = generateHint(
    problemID || "problem01",
    section,
    userContent,
    hintLevel || 1,
    recipeContent || "",
    logicContent || "",
  );

  // If they passed, return the exact success message so the frontend advances.
  if (isSuccessHint(localHint)) {
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: true,
      hint: localHint,
      nextAction: "",
    });
  }

  let finalHint = localHint;
  let bypassAI = false;

  if (hintLevel <= 2 && finalHint && finalHint.trim() !== "") {
    bypassAI = true;
    if (finalHint.includes("<br>Hint:")) {
      let parts = finalHint.split("<br>Hint:");
      let questionPart = parts[0].trim();
      if (!questionPart.endsWith("?")) {
        questionPart += " Ithu eppadi nu yosichu parunga?";
      }
      finalHint = questionPart;
    } else if (finalHint.includes("You might want to try this instead:<br>")) {
      let parts = finalHint.split("You might want to try this instead:<br>");
      let questionPart = parts[1] ? parts[1].trim() : parts[0].trim();
      if (!questionPart.endsWith("?")) {
        questionPart += " Ithu eppadi nu yosichu parunga?";
      }
      finalHint = questionPart;
    } else if (finalHint.includes("<br>Example:")) {
      // keep as is
    }
  } else {
    bypassAI = false;
  }

  if (bypassAI) {
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: false,
      hint: finalHint,
      nextAction: "",
    });
  }

  // If they failed and we have AI, use AI to generate a detailed Tanglish hint.
  const aiClient = getAIClient();
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `The user is trying to solve a programming puzzle (Problem: ${problemID || "problem01"}).
Section: ${section}
User's current input:
${userContent}

${recipeContent ? `Recipe Content so far:\n${recipeContent}\n` : ""}
The local validation failed. Here was the generic hint the system wanted to show: "${localHint}".
They clicked 'Help' or 'Check' and need a hint.
Act as an expert programming trainer. You must guide the user step-by-step based EXACTLY on what they have written so far, using a mix of Tamil and English (Tanglish).
CRITICAL DIRECTIVE: DO NOT give conversational fillers like "Super start! Variable-ah nalla yosichu declare pannitinga, great job!". Be direct and focus purely on the next logical step.

Follow these rules:
1. Analyze user input: Look exactly at what the user has typed. Give a targeted hint for the specific line they are stuck on.
2. Step-by-step guidance: Tell them what they missed or what the next logical step is based on their current code/text.
3. No direct answers: NEVER give the full answer directly. Give a 'hard hint' that forces the user to think.
4. In 'logic' and 'recipe' sections: DO NOT allow programming syntax (like if, else, print, for, etc.). Pure math (+, -, %, ==) is ALLOWED. Tell them: "Logic/Recipe la code syntax use panna koodathu, theory ah explain pannunga."
5. In 'ingredients' section: Just ask them what is needed for this program (e.g., variables) and what condition/operation they will use (like if else). DO NOT ask them to assign values to variables here. Tell them: "Ingredients la variable declare panna pothum, value assign panna thevai illa. And if else condition kulla enna operation podaporom nu yosinga."
6. In 'taste the sample' (samplecode) section: Code syntax IS REQUIRED. Do not allow theory words. Ensure they declare a variable and set a value. If they struggle with if/else, provide example syntax like "if (condition) { } else { }". Make sure they put the correct condition (e.g. number % 2 == 0) inside the if.
7. CRITICAL RULE FOR ALL SECTIONS: To check odd/even, they MUST use the modulo operator (%) with divisor 2. They CANNOT use division (/), addition (+), subtraction (-), multiplication (*) or ANY other divisor. If they use the wrong operator or divisor, STRICTLY tell them: "Odd/even check panna % 2 thaan use pannanum. (+, -, *, /) use panna koodathu."
8. Keep your trainer feedback extremely concise - STRICTLY A SINGLE SHORT LINE (e.g., max 15 words). Mimic the style of a short backend hint but make it thought-provoking. Do not explain multiple steps. Clear and precise. Use HTML <br> if absolutely needed.`,
      });

      return res.json({
        source: "ai",
        section: section || "logic",
        hintLevel: hintLevel || 1,
        isCorrect: false,
        hint: response.text,
        nextAction: "",
      });
    } catch (error) {
      // Suppress the error log to prevent the error reporter from catching it,
      // as this is an expected fallback scenario when the API is overloaded.
      console.log(
        "Gemini API temporarily unavailable (e.g. 503), falling back to local hint.",
      );
    }
  } else {
    console.warn("GEMINI_API_KEY is not set. Falling back to local hint.");
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: false,
      hint:
        "AI features are currently unavailable because the Gemini API Key is missing. Please add it in the Settings menu. \n\n" +
        localHint,
      nextAction: "",
    });
  }

  // Fallback to local hint if AI fails or is not configured
  res.json({
    source: "local",
    section: section || "logic",
    hintLevel: hintLevel || 1,
    isCorrect: false,
    hint: localHint,
    nextAction: "",
  });
});

app.post("/api/rewriteHintStream", async (req, res) => {
  const { problemID, section, userContent, hintLevel, recipeContent, logicContent } =
    req.body;

  const localHint = generateHint(
    problemID || "problem01",
    section,
    userContent,
    hintLevel || 1,
    recipeContent || "",
    logicContent || "",
  );

  const isRelated =
    /(even|odd|number|modulo|remainder|mod|div|%|variable|var|let|const|input|output|print|console|log|if|else|condition|logic|math|declare|compare|code|program|operator|value|result|இரட்டை|ஒற்றை|எண்|வகு|மீதி|விடை|படி|முறை|logic|logic-ah|\d+|\ben\b|check|meethi|meedi|meeti|vagu|vaka|vaku|vaghikka|vaguka|irattai|otrai|othrai|orrai|rendu|buh|zero|one|equal|==|===)/i.test(
      userContent,
    );
  if (userContent !== "" && !isRelated) {
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: false,
      hint: "Unrelated-ah type pannatheenga. Intha problem oda core logic enna nu focus panni ezhuthunga.",
      nextAction: "",
    });
  }

  if (isSuccessHint(localHint)) {
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: true,
      hint: localHint,
      nextAction: "",
    });
  }

  let finalHint = localHint;
  let bypassAI = false;

  if (hintLevel <= 2 && finalHint && finalHint.trim() !== "") {
    bypassAI = true;
    if (finalHint.includes("<br>Hint:")) {
      let parts = finalHint.split("<br>Hint:");
      let questionPart = parts[0].trim();
      if (!questionPart.endsWith("?")) {
        questionPart += " Ithu eppadi nu yosichu parunga?";
      }
      finalHint = questionPart;
    } else if (finalHint.includes("You might want to try this instead:<br>")) {
      let parts = finalHint.split("You might want to try this instead:<br>");
      let questionPart = parts[1] ? parts[1].trim() : parts[0].trim();
      if (!questionPart.endsWith("?")) {
        questionPart += " Ithu eppadi nu yosichu parunga?";
      }
      finalHint = questionPart;
    } else if (finalHint.includes("<br>Example:")) {
      // keep as is
    }
  } else {
    bypassAI = false;
  }

  if (bypassAI) {
    return res.json({
      source: "local",
      section: section || "logic",
      hintLevel: hintLevel || 1,
      isCorrect: false,
      hint: finalHint,
      nextAction: "",
    });
  }

  const aiClient = getAIClient();
  let headersSent = false;

  if (aiClient) {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      headersSent = true;

      res.write(
        `data: ${JSON.stringify({ type: "start", source: "ai", isCorrect: false })}\n\n`,
      );

      const prompt = `The user is trying to solve a programming puzzle (Problem: ${problemID || "problem01"}).
Section: ${section}
User's current input:
${userContent}

${recipeContent ? `Recipe Content so far:\n${recipeContent}\n` : ""}
The local validation failed. Here was the generic hint the system wanted to show: "${localHint}".
They clicked 'Help' or 'Check' and need a hint.
Act as an expert programming trainer. You must guide the user step-by-step based EXACTLY on what they have written so far, using a mix of Tamil and English (Tanglish).
CRITICAL DIRECTIVE: DO NOT give conversational fillers like "Super start! Variable-ah nalla yosichu declare pannitinga, great job!". Be direct and focus purely on the next logical step.

Follow these rules:
1. Analyze user input: Look exactly at what the user has typed. Give a targeted hint for the specific line they are stuck on.
2. Step-by-step guidance: Tell them what they missed or what the next logical step is based on their current code/text.
3. No direct answers: NEVER give the full answer directly. Give a 'hard hint' that forces the user to think.
4. In 'logic' and 'recipe' sections: DO NOT allow programming syntax (like if, else, print, for, etc.). Pure math (+, -, %, ==) is ALLOWED. Tell them: "Logic/Recipe la code syntax use panna koodathu, theory ah explain pannunga."
5. In 'ingredients' section: Just ask them what is needed for this program (e.g., variables) and what condition/operation they will use (like if else). DO NOT ask them to assign values to variables here. Tell them: "Ingredients la variable declare panna pothum, value assign panna thevai illa. And if else condition kulla enna operation podaporom nu yosinga."
6. In 'taste the sample' (samplecode) section: Code syntax IS REQUIRED. Do not allow theory words. Ensure they declare a variable and set a value. If they struggle with if/else, provide example syntax like "if (condition) { } else { }". Make sure they put the correct condition (e.g. number % 2 == 0) inside the if.
7. CRITICAL RULE FOR ALL SECTIONS: To check odd/even, they MUST use the modulo operator (%) with divisor 2. They CANNOT use division (/), addition (+), subtraction (-), multiplication (*) or ANY other divisor. If they use the wrong operator or divisor, STRICTLY tell them: "Odd/even check panna % 2 thaan use pannanum. (+, -, *, /) use panna koodathu."
8. Keep your trainer feedback extremely concise - STRICTLY A SINGLE SHORT LINE (e.g., max 15 words). Mimic the style of a short backend hint but make it thought-provoking. Do not explain multiple steps. Clear and precise. Use HTML <br> if absolutely needed.`;

      const responseStream = await aiClient.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        res.write(
          `data: ${JSON.stringify({ type: "chunk", text: chunk.text })}\n\n`,
        );
      }

      res.write(`data: [DONE]\n\n`);
      return res.end();
    } catch (error) {
      console.log("Gemini API stream fallback activated.");

      if (!headersSent) {
        try {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          headersSent = true;
        } catch (hErr) {
          console.log("Failed to set headers on error fallback:", hErr.message);
        }
      }

      // Stream localHint dynamically to client as a fallback
      res.write(
        `data: ${JSON.stringify({ type: "start", source: "local", isCorrect: false })}\n\n`,
      );

      const words = localHint.split(" ");
      for (let j = 0; j < words.length; j++) {
        res.write(
          `data: ${JSON.stringify({ type: "chunk", text: (j === 0 ? "" : " ") + words[j] })}\n\n`,
        );
        // Wait for 6ms to simulate typing smoothly and fast under 1 second
        await new Promise((resolve) => setTimeout(resolve, 6));
      }

      res.write(`data: [DONE]\n\n`);
      return res.end();
    }
  }

  // If Gemini client was not initialized at all
  if (!headersSent) {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
    } catch (hErr) {
      console.log("Failed to set headers on no-client fallback:", hErr.message);
    }
  }

  res.write(
    `data: ${JSON.stringify({ type: "start", source: "local", isCorrect: false })}\n\n`,
  );
  const words = localHint.split(" ");
  for (let j = 0; j < words.length; j++) {
    res.write(
      `data: ${JSON.stringify({ type: "chunk", text: (j === 0 ? "" : " ") + words[j] })}\n\n`,
    );
    await new Promise((resolve) => setTimeout(resolve, 6));
  }
  res.write(`data: [DONE]\n\n`);
  return res.end();
});

app.post("/api/checkInput", (req, res) => {
  const { problemID, section, userInput, logicContent } = req.body;
  const text = (userInput || "").toLowerCase().trim();

  if (/\b(hi|hello|he|she|hey|good morning)\b/i.test(text)) {
    return res.json({
      correct: false,
      feedback:
        "Irrelevant elements like greetings ('hi', 'hello') or third-person pronouns ('he', 'she') do not contribute to code logic. Focus on the core content instead. You might want to try this instead: Write out your logical statements directly without conversational fillers.",
    });
  }

  const isRelated =
    /(even|odd|number|modulo|remainder|mod|div|%|variable|var|let|const|input|output|print|console|log|if|else|condition|logic|math|declare|compare|code|program|operator|value|result|இரட்டை|ஒற்றை|எண்|வகு|மீதி|விடை|படி|முறை|logic|logic-ah|\d+|\ben\b|check|meethi|meedi|meeti|vagu|vaka|vaku|vaghikka|vaguka|irattai|otrai|othrai|orrai|rendu|buh|zero|one|equal|==|===)/i.test(
      text,
    );
  if (text !== "" && !isRelated) {
    return res.json({
      correct: false,
      feedback:
        "Unrelated-ah type pannatheenga. Intha problem oda core logic enna nu focus panni ezhuthunga.",
    });
  }

  if (problemID === "problem02") {
    if (section === "logic") {
      if (
        text.length < 15 ||
        !/\b(mathematical|essence|proposition|function|logic)\b/i.test(text)
      ) {
        return res.json({
          correct: false,
          feedback:
            "Please write a detailed, concise mathematical definition of programming logic.",
        });
      }
    } else if (section === "recipe") {
      if (text.length < 15 || !/\b(step|first|then|next|loop)\b/i.test(text)) {
        return res.json({
          correct: false,
          feedback:
            "Please outline a step-by-step recipe describing the process of writing a program.",
        });
      }
    } else if (section === "ingredients") {
      if (
        !/loop/i.test(text) ||
        !/conditional/i.test(text) ||
        !/left/i.test(text) ||
        !/right/i.test(text)
      ) {
        return res.json({
          correct: false,
          feedback:
            "Ingredients must list 'for loops' with mechanics (start, end, increment), and conditional statements specifying left and right sides.",
        });
      }
    } else {
      if (text.length < 15 || !/if/.test(text)) {
        return res.json({
          correct: false,
          feedback: "Please provide a valid sample coding task implementation.",
        });
      }
    }
    return res.json({
      correct: true,
      feedback: "Correct! Move to the next step.",
    });
  }

  if (section === "logic") {
    const isCodeFormat =
      /[{}]|;|\bconsole\.log\b|\bif\s*\(|let\s+[a-zA-Z0-9_]+\s*=|const\s+[a-zA-Z0-9_]+\s*=|var\s+[a-zA-Z0-9_]+\s*=/i.test(
        text,
      );
    if (isCodeFormat) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Logic section-la programming code/keywords (braces, semicolons, console.log, if-conditions code structure) ezhutha koodathu. Plain theory-aagavo mathematical logic-aagavo thaan ezhuthanum.",
      });
    }

    const divByNonTwoMatch = text.match(
      /(?:divide|division|mod|modulo|%|by|vagu|vaku)\s*([3-9]|\d{2,})/i,
    );
    if (divByNonTwoMatch) {
      const wrongDivisor = divByNonTwoMatch[1];
      return res.json({
        correct: false,
        feedback: `Verification failed. Logic-la odd/even check panna number-ah 2-aala thaan modulo divide pannanum (e.g., modulo 2 or divide by 2). Neenga ${wrongDivisor}-aala divide panni check pannuringa.`,
      });
    }

    const invalidRemMatch = text.match(
      /(?:remainder|remider|meethi|meedi|meeti|result|value|equals|is)\s*(?:is|equals|equal|==|=|to)?\s*([2-9]|\d{2,})\b/i,
    );
    if (invalidRemMatch) {
      const wrongRem = invalidRemMatch[1];
      return res.json({
        correct: false,
        feedback: `Verification failed. Modulo by 2 panna remainder eppothume 0 (even) illa 1 (odd) thaan varum. Vera value (like ${wrongRem}) podakoodathu.`,
      });
    }

    const hasZeroOdd =
      /(?:0|zero)\s*(?:is|equals|equal|==|=|to)?\s*(?:an\s*)?odd/i.test(text) ||
      /odd\s*(?:number|is|equals|equal|==|=|to)?\s*(?:with|if)?\s*(?:remainder\s*)?(?:0|zero)/i.test(
        text,
      ) ||
      /remainder\s*(?:0|zero)\s*(?:is|==|=)?\s*odd/i.test(text) ||
      /meethi\s*(?:0|zero)\s*(?:na|vantha)?\s*odd/i.test(text) ||
      /(?:0|zero)\s*its\s*odd/i.test(text);
    const hasOneEven =
      /(?:1|one)\s*(?:is|equals|equal|==|=|to)?\s*(?:an\s*)?even/i.test(text) ||
      /even\s*(?:number|is|equals|equal|==|=|to)?\s*(?:with|if)?\s*(?:remainder\s*)?(?:1|one)/i.test(
        text,
      ) ||
      /remainder\s*(?:1|one)\s*(?:is|==|=)?\s*even/i.test(text) ||
      /meethi\s*(?:1|one)\s*(?:na|vantha)?\s*even/i.test(text) ||
      /(?:1|one)\s*its\s*even/i.test(text);

    if (hasZeroOdd || hasOneEven) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Math logic-la small error: Remainder 0 vantha athu Even number, Remainder 1 vantha athu Odd number. Mathi check pannunga.",
      });
    }

    const hasTwo = /2|two/i.test(text);
    if (!hasTwo) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Enna number-aala divide/modulo pannanum nu mention pannunga (e.g., modulo divide by 2).",
      });
    }

    const hasModOrDivOrRem =
      /%|modulo|mod|divide|remainder|remider|meethi|meedi/i.test(text);
    if (!hasModOrDivOrRem) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Logic-la modulo divide (%) or remainder pathi mention pannanum.",
      });
    }

    const hasEvenWord = /even|இரட்டை|irattai/i.test(text);
    const hasOddWord = /odd|ஒற்றை|otrai/i.test(text);
    if (!hasEvenWord) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Even number-gu enna logic-nu clear-ah mention pannunga.",
      });
    }
    if (!hasOddWord) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Odd number-gu enna logic-nu clear-ah mention pannunga.",
      });
    }

    const hasZero = /0|zero/i.test(text);
    const hasOne = /1|one/i.test(text);
    if (!hasZero || !hasOne) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Remainder 0 vantha enna number, 1 vantha enna number-nu exact remainders check panni logic-la ezhuthunga (e.g., remainder 0 is even, remainder 1 is odd).",
      });
    }

    return res.json({
      correct: true,
      feedback: "Correct logic — move to Recipe.",
    });
  } else if (section === "recipe") {
    const invalidRemainderRegex1 =
      /(?:remainder|remider|meethi|meedi)\s*(?:is|equals|equal|==|=|to)?\s*([2-9]|\d{2,})\b/i;
    const invalidRemainderRegex2 =
      /(?:%|mod|modulo)\s*2\s*(?:==|===|=|is)\s*([2-9]|\d{2,})\b/i;
    if (
      invalidRemainderRegex1.test(text) ||
      invalidRemainderRegex2.test(text)
    ) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Modulo by 2 panna remainder eppothume 0 (even) illa 1 (odd) thaan varum. Recipe la 0 or 1 thaan remainder check pannanum. Vera value (like 9, 10, etc.) podakoodathu.",
      });
    }

    // Wrong operator checks with WHY explanations (recipe section)
    const recipeCleanMinus = text.replace(/[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+/g, "");
    const recipeCleanSlash = text.replace(
      /\b(odd|even|if|else|yes|no|true|false|remainder|modulo|right|left|operator|operation|variable|var|let|const|input|output|print|console|log)\s*\/\s*(odd|even|if|else|yes|no|true|false|remainder|modulo|right|left|operator|operation|variable|var|let|const|input|output|print|console|log)\b/gi,
      "",
    );
    const recipeHasWrongPlus = /(?:\d\s*\+\s*\d|\b[a-z0-9_]+\s*\+\s*[a-z0-9_]+\b)/i.test(text);
    const recipeHasWrongMinus = /\-/.test(recipeCleanMinus) && /(?:\d\s*\-\s*\d|\b[a-z0-9_]+\s*\-\s*[a-z0-9_]+\b)/i.test(recipeCleanMinus);
    const recipeHasWrongMultiply = /(?:\d\s*\*\s*\d|\b[a-z0-9_]+\s*\*\s*[a-z0-9_]+\b)/i.test(text);
    const recipeHasWrongDivision = /\//.test(recipeCleanSlash) && /(?:\d\s*\/|\b[a-z0-9_]+\s*\/)/i.test(recipeCleanSlash);

    if (recipeHasWrongPlus) {
      return res.json({
        correct: false,
        feedback:
          "Recipe la + (plus) operator use panna koodathu. Karanam: Addition panna rendu number-in kootu (sum) kittum — athu oru number odd-a even-a nu sollathu. Odd/even kandupidikka 2-aala divide panna MEETHI (remainder) paakkanam. % (modulo) operator thaan remainder tharum. Correct: number % 2 = 0 → even, 1 → odd.",
      });
    }
    if (recipeHasWrongMinus) {
      return res.json({
        correct: false,
        feedback:
          "Recipe la - (minus) use panna koodathu. Karanam: Subtraction panna difference kittum — odd/even check panna MEETHI (remainder) thevai. % 2 thaan remainder tharum: 0 = even, 1 = odd.",
      });
    }
    if (recipeHasWrongMultiply) {
      return res.json({
        correct: false,
        feedback:
          "Recipe la * (multiply) use panna koodathu. Karanam: Multiplication panna product kittum — athu even/odd nature-ai sollathu. % 2 (modulo) panna remainder kittum, athu thaan odd/even kandupidikka use aagum.",
      });
    }
    if (recipeHasWrongDivision) {
      return res.json({
        correct: false,
        feedback:
          "Recipe la / (division) thappu. Karanam: / operator QUOTIENT tharum (example: 7 / 2 = 3.5) — aana odd/even check panna REMAINDER thevai (7 % 2 = 1). % (modulo) operator thaan remainder tharum, / tharaathu.",
      });
    }

    const hasNumberOrInput = /(number|input|vaangu|var|let|const|name|oru|value|eduthu)/i.test(
      text,
    );
    // Flexible regex: accepts theory text like "divide by 2", "2 aala vagu", "rendu aala divide" etc.
    const hasModTwo =
      /(?:%|mod|modulo|divide|divis|vagu|vaguk|remainder|meethi).*?(?:2|two|rendu|iraNdu)/i.test(text) ||
      /(?:2|two|rendu|iraNdu).*?(?:%|mod|modulo|divide|remainder|meethi|vagu)/i.test(text);
    const hasEven = /even|irattai/i.test(text);
    const hasOdd = /odd|otrai|orrai/i.test(text);

    if (!hasNumberOrInput) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. First step: Oru number input vaangu nu ezhuthunga.",
      });
    }
    if (!hasModTwo) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Odd or even kandupudikka 2-aala divide panna meethi (remainder) paakkanam nu mention pannunga. Math-la '% 2' or theory-la 'divide by 2' / '2 aala vagu' nu ezhuthalam.",
      });
    }
    if (!hasEven || !hasOdd) {
      if (!hasEven) {
        return res.json({
          correct: false,
          feedback:
            "Verification failed. Remainder 0 vantha even nu print panna sollanum. (Even logic is missing)",
        });
      }
      if (!hasOdd) {
        return res.json({
          correct: false,
          feedback:
            "Verification failed. Remainder 1 vantha (or else) odd nu print panna sollanum. (Odd logic is missing)",
        });
      }
    }
    if (text.indexOf("even") > text.indexOf("odd")) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Remainder 0 vantha even thaan first print panna sollanum, aduthu thaan odd print panna sollanum.",
      });
    }

    return res.json({
      correct: true,
      feedback: "Recipe correct — move to Ingredients.",
    });
  } else if (section === "ingredients") {
    const hasVariable =
      /(variable|var|let|const|input|number|declare|name)/i.test(text);
    const hasIfElse = /(if.*else|else.*if|if|else|condition)/i.test(text);
    const hasMod = /(%|mod|modulo|divide|remainder)/i.test(text);
    const hasTwo = /(2|two)/i.test(text);
    const hasCompare = /(==|===|equal|operator|compare)/i.test(text);
    const hasZeroOrOne = /(0|1|zero|one)/i.test(text);
    const hasEven = /even/i.test(text);
    const hasOdd = /odd/i.test(text);
    const hasPrint = /(print|console|output|log|correct)/i.test(text);

    const hasWordBeforeMod =
      /\b(variable|number|input|var|val|name|[a-z0-9_]+)\s*%/i.test(text);

    if (!hasVariable) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Ingredients first step: Variable declare pannanum nu ezhuthunga (e.g., 'Oru variable input vaanganum').",
      });
    }
    if (!hasIfElse) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Variable declare panniyachu, aduthu kandipa if else condition use pannanum (e.g., 'if else condition check pannanum').",
      });
    }
    if (hasMod && !hasWordBeforeMod) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Modulo operator (%) kku munnadi, oru variable name/ingredients-ah mention pannanum (e.g., 'variable % 2'). Verum '% 2' podakoodathu.",
      });
    }
    if (!hasMod) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. If else condition ezhuthiyeenga, aana athula if condition eppadi choose pannanum nu yosikavum (e.g., 'variable % 2 compute pannanum').",
      });
    }
    if (!hasTwo) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Odd or even check panna operator code % 2 aaga thaan irukkanum (e.g., 'variable % 2 check pannanum').",
      });
    }
    if (!hasCompare) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. If condition check panna left and right side-ah compare panna comparison operator '==' check pannanum (e.g., 'variable % 2 == 0').",
      });
    }
    if (!hasZeroOrOne) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Remainder value variable % 2 == 0 aaga compare pannanum.",
      });
    }
    if (!hasEven || !hasPrint) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. If condition % 2 == 0 satisfy aana 'even' nu print panna sollanum.",
      });
    }
    if (!hasOdd) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. If condition true aana even print panna sollitinga. Ippo else conditional step la 'odd' print pannanum nu sollanum.",
      });
    }
    if (text.indexOf("even") > text.indexOf("odd")) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. If condition % 2 == 0 check panni 'even' thaan first print pannanum, 'odd' second (else block la) print pannanum.",
      });
    }

    return res.json({
      correct: true,
      feedback: "Ingredients correct — go to Taste the Sample.",
    });
  } else if (section === "samplecode" || section === "sample") {
    const text = (userInput || "").toLowerCase().trim();
    const varMatch =
      text.match(/\b(?:let|const|var)\s+([a-zA-Z0-9_]+)\s*=\s*\d+/i) ||
      text.match(/\b([a-zA-Z0-9_]+)\s*=\s*\d+/i);
    const correctVarMatch = text.match(
      /\b(?:let|const|var)\s+([a-zA-Z0-9_]+)\s*=\s*\d+/i,
    );
    let varName = "number"; // default fallback
    if (varMatch) {
      varName = varMatch[1];
    }

    const hasVariable = !!varMatch;
    const hasVariableWithKeyword = !!correctVarMatch;
    const hasIfElse = /(if *\(|else)/i.test(text);
    const hasModuloSymbol = /%/.test(text);
    const hasVarBeforeMod = new RegExp(varName + "\\s*\\%\\s*2", "i").test(
      text,
    );
    const hasDivisor = /% *2/i.test(text);
    const hasCompare = /(===|==|!==|!=) *0/i.test(text);
    const hasPrint = /(console\.log|print)/i.test(text);
    const hasEven = /even/i.test(text);
    const hasOdd = /odd/i.test(text);

    const validEvenPrint =
      /console\.log\s*\(\s*(['"`])[^'"`]*even[^'"`]*\1\s*\)/i.test(text);
    const validOddPrint =
      /console\.log\s*\(\s*(['"`])[^'"`]*odd[^'"`]*\1\s*\)/i.test(text);

    if (!hasVariable) {
      if (/\b(variable|var|let|const)\b/i.test(text)) {
        return res.json({
          correct: false,
          feedback:
            "Verification failed. Variable declare panni athula oru number store pannunga (e.g., 'let variable = 5;'). Verum 'variable' nu ezhutha koodathu.",
        });
      }
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Mudhal step: Oru variable declare panni athula number store pannanum (e.g., 'let variable = 5;').",
      });
    }
    if (hasVariable && !hasVariableWithKeyword) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Variable-ah store panna, correct-ah variable declare keywords ('let', 'const', or 'var') use pannunga (e.g., 'let variable = 5;'). Verum 'variable = 5' nu ezhutha koodathu.",
      });
    }
    if (!hasIfElse) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Adutha step: Odd or even nu check panna if else statement thevai. Example syntax: if (condition) { ... } else { ... }",
      });
    }
    if (!hasModuloSymbol) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. if condition la enna podanum? Remainder check panna modulo operator (%) use pannunga.",
      });
    }
    if (
      /\%\s*2\s*(===|==)\s*0/.test(text) &&
      !new RegExp("[a-zA-Z0-9_]+\\s*\\%\\s*2", "i").test(text)
    ) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. if condition-la Modulo operator (%) kku munnadi variable name ezhuthanum (e.g., 'if (variable % 2 == 0)'). Verum 'if (% 2 == 0)' nu ezhutha koodathu.",
      });
    }
    if (!hasVarBeforeMod) {
      return res.json({
        correct: false,
        feedback: `Verification failed. Modulo operator (%) kku munnadi, Ingredients la declare panna variable name-ah ('${varName}') podanum (e.g., '${varName} % 2'). Verum '% 2' podakoodathu.`,
      });
    }
    if (!hasDivisor) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Modulo (%) operator kooda enna divisor podanum? Odd/even check panna 2 aala thaan divide pannanum.",
      });
    }
    if (!hasCompare) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Condition la remainder 0 varutha nu compare pannanum. Equality check panna '=== 0' use pannunga.",
      });
    }
    if (!hasPrint) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. Condition correct! Adutha step: Result ah display panna print statement thevai (e.g., console.log).",
      });
    }
    if (/console\.log(?!\s*\()/i.test(text)) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. console.log la parentheses '()' missing. Correct-ana syntax: console.log(\"even\") nu bracket kulla ezhuthanum.",
      });
    }
    if (/console\.log\s*\(\s*[^'"`\s)]+\s*\)/i.test(text)) {
      return res.json({
        correct: false,
        feedback:
          'Verification failed. console.log kulla display panna vendiya text-ah double quotes or single quotes kulla ezhuthanum (e.g., console.log("even")). Quotes/string syntax check pannunga.',
      });
    }
    if (!validEvenPrint) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. if block la display panna correct-ana print statement 'console.log(\"even\")' ezhuthunga.",
      });
    }
    if (!validOddPrint) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. else block la display panna correct-ana print statement 'console.log(\"odd\")' ezhuthunga.",
      });
    }
    if (!hasEven) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. if block la enna print pannanum? Condition true aana 'even' nu print pannunga.",
      });
    }
    if (!hasOdd) {
      return res.json({
        correct: false,
        feedback:
          "Verification failed. else block la enna print pannanum? Condition false aana 'odd' nu print pannunga.",
      });
    }

    return res.json({
      correct: true,
      feedback: "Sample code is correct — test it in the compiler!",
    });
  }

  return res.json({
    correct: false,
    feedback:
      "Verification failed. Review your answer carefully. You might want to try this instead: click Help to read the AI hints.",
  });
});

app.post("/api/logError", (req, res) => {
  console.log("Client Error:", req.body);
  res.sendStatus(200);
});
/* ?? START SERVER */
app.listen(3000, () => {
    console.log("?? Server running on http://localhost:3000");
});
// hintLogic.js - Extracted from vby2 server.js
// Contains generateHint() and isSuccessHint() for the CookDCode workspace
function generateHint(
  problemID,
  section,
  userInput,
  hintLevel = 1,
  recipeContent = "",
  logicContent = ""
) {
  if (problemID === "problem02") {
    return generateHintProblem02(section, userInput, hintLevel, logicContent, recipeContent);
  }

  const getRand = (hints) => hints[Math.floor(Math.random() * hints.length)];
  const getRandomHint = (hints) => {
    if (section === "recipe" || section === "ingredients" || hintLevel >= 4) {
      if (section === "logic") {
        return "You might want to try this instead:<br>Oru number ah 2 aala divide pannumbothu remainder 0 vantha athu even, illana odd.";
      } else if (section === "recipe") {
        const ut = (userInput || "").toLowerCase();
        const invalidRemainderRegex1 =
          /(?:remainder|remider|meethi|meedi)\s*(?:is|equals|equal|==|=|to)?\s*([2-9]|\d{2,})\b/i;
        const invalidRemainderRegex2 =
          /(?:%|mod|modulo)\s*2\s*(?:==|===|=|is)\s*([2-9]|\d{2,})\b/i;
        if (
          invalidRemainderRegex1.test(ut) ||
          invalidRemainderRegex2.test(ut)
        ) {
          return "You might want to try this instead:<br>Modulo by 2 panna remainder eppothume 0 (even) illa 1 (odd) thaan varum. Recipe la 0 or 1 thaan remainder check pannanum. Vera value (like 9, 10, etc.) podakoodathu.";
        }

        const hasInput = /(number|input|vaangu|var|let|const|name)/i.test(ut);
        const hasMod = /(%|mod|divide|calculate|remainder)/i.test(ut);
        const hasModTwo = /(%2|%\s*2|mod\s*2|modulo\s*2)/gi.test(ut);
        const hasEven = /even/i.test(ut);
        const hasOdd = /odd/i.test(ut);

        if (ut.trim() === "" || !hasInput) {
          return getRand([
            "Oru number-ah get panna first step enna ezhuthanum nu yosichu parunga?",
            "Code start panna mudhal-la namma user kitta irunthu enna vanganum?",
          ]);
        } else if (!hasMod) {
          return getRand([
            "Number vangiyachu. Aduthu antha number-ah odd/even nu check panna mathematical-ah enna calculate pannanum?",
            "Maths-la oru number odd/even kandupudikka enna panni remainder check pannuvom nu yosinga?",
          ]);
        } else if (!hasModTwo) {
          return getRand([
            "Remainder check panna yentha number-aala divide panni pakanum?",
            "Odd/even condition check panna divide panna vendiya exact number enna nu yosinga.",
          ]);
        } else if (!hasEven) {
          return getRand([
            "Super, calculation correct! Remainder 0 vantha athu enna number nu result tharanum?",
            "Remainder '0' aaga iruntha output enna varanum nu ezhuthunga.",
          ]);
        } else if (!hasOdd) {
          return getRand([
            "Even-ku ezhuthitinga. Illana (otherwise) remainder 1 vantha enna number nu print pannanum?",
            "Else condition-la balance ulla odd case-ku output enna varanum nu yosinga?",
          ]);
        } else if (ut.indexOf("even") > ut.indexOf("odd")) {
          return getRand([
            "Logic flow padi, first remainder 0-ku check panni even print pannanuma, illana odd-a?",
            "Order of check change ayiruku. First even-ah mudichutu apram odd-ah pakalāma?",
          ]);
        }
        return "You might want to try this instead:<br>Recipe step correct-ah ezhuthitinga! Aduthu ingredients section-uku ponga.";
      } else if (section === "ingredients") {
        const ut = (userInput || "").toLowerCase();

        if (ut.includes("=") && !ut.includes("==") && !ut.includes("===")) {
          return "You might want to try this instead:<br>= ithu assign panna, compare panna == use pannanum (e.g., comparition operator ==).";
        }

        const hasVariable =
          /(variable|var|let|const|input|number|declare|name)/i.test(ut);
        const hasIfElse = /(if.*else|else.*if|if|else|condition)/i.test(ut);
        const hasMod = /(%|mod|modulo|divide|remainder)/i.test(ut);
        const hasTwo = /(2|two)/i.test(ut);
        const hasCompare = /(==|===|equal|operator|compare)/i.test(ut);
        const hasZeroOrOne = /(0|1|zero|one)/i.test(ut);
        const hasEven = /even/i.test(ut);
        const hasOdd = /odd/i.test(ut);
        const hasPrint = /(print|console|output|log|correct)/i.test(ut);

        const hasWordBeforeMod =
          /\b(variable|number|input|var|val|name|[a-z0-9_]+)\s*%/i.test(ut);

        if (ut.trim() === "" || !hasVariable) {
          return getRand([
            "Code ezhutha start panrom, mudhal-la value-ah store panna enna create pannanum?",
            "Variable declare panni athula number store panra step-ah ezhuthingala?",
          ]);
        } else if (!hasIfElse) {
          return getRand([
            "Variable create panniyachu! Aduthu intha number-ah check panna enna conditional statement use pannanum?",
            "Oru condition true aana onnu, false aana innonnu nadakkanum. Ithu kku enna block use pannuvom nu yosinga?",
          ]);
        } else if (hasMod && !hasWordBeforeMod) {
          return "You might want to try this instead:<br>Modulo (%) operator kku munnadi, oru variable name/ingredients-ah mention pannanum (e.g., 'variable % 2'). Verum '% 2' nu ezhutha koodathu.";
        } else if (!hasMod) {
          return getRand([
            "If else block ezhuthitinga! Aana if-kulla remainder kandupudikka enna math operator use pannanum?",
            "Division-oda remainder-ah edukka namma specific-ah oru symbol (%) use pannuvom la, athu eppadi ezhuthanum nu yosinga?",
          ]);
        } else if (!hasTwo) {
          return getRand([
            "Odd or even check panna operator kooda entha divisor podanum nu check pannunga?",
            "Remainder check panna 2-aala thaan divide pannanum la? Athu ezhuthi irukingala nu parunga.",
          ]);
        } else if (!hasCompare) {
          return getRand([
            "If condition-la left and right side check panna enna comparison operator thevai?",
            "Equality check panna '==' operator use pannanum la? Atha serthu yosichu parunga.",
          ]);
        } else if (!hasZeroOrOne) {
          return getRand([
            "Remainder yentha number-ku equal-a irukanum nu compare pannanum?",
            "Condition-la even-nu mudivu panna remainder '0'-a varutha nu pakanum. Atha math check-la potingala?",
          ]);
        } else if (!hasEven || !hasPrint) {
          return getRand([
            "Super! Condition % 2 == 0 satisfy aana namma enna result-ah print panna sollanum?",
            "If block ulla result-ah display panna enna string-ah (e.g., 'even') print pannanum nu yosinga?",
          ]);
        } else if (!hasOdd) {
          return getRand([
            "If block-ku 'even' potachu. Appo condition fail aana (else block-la) enna print pannanum?",
            "False condition-ku else ulla balance iruka 'odd'-ah print panna ezhuthanum nu yosinga.",
          ]);
        } else if (ut.indexOf("even") > ut.indexOf("odd")) {
          return getRand([
            "Logic flow check pannunga: first 'even'-ah print pannanuma illa 'odd'-a?",
            "Condition % 2 == 0 iruntha first even thaan varanum. Atha maathi poturukingala nu check pannunga.",
          ]);
        }

        return "You might want to try this instead:<br>Ingredients correct-ah ezhuthitinga! Aduthu Sample Code section-uku ponga.";
      } else if (section === "samplecode") {
        const ut = (userInput || "").toLowerCase().trim();
        const varMatch =
          ut.match(/\b(?:let|const|var)\s+([a-zA-Z0-9_]+)\s*=\s*\d+/i) ||
          ut.match(/\b([a-zA-Z0-9_]+)\s*=\s*\d+/i);
        const correctVarMatch = ut.match(
          /\b(?:let|const|var)\s+([a-zA-Z0-9_]+)\s*=\s*\d+/i,
        );
        let varName = "number";
        if (varMatch) {
          varName = varMatch[1];
        }
        const hasVariable = !!varMatch;
        const hasVariableWithKeyword = !!correctVarMatch;
        const hasIfElse = /(if *\(|else)/i.test(ut);
        const hasModulo = /%/i.test(ut);
        const hasVarBeforeMod = new RegExp(varName + "\\s*\\%\\s*2", "i").test(
          ut,
        );
        const hasDivisor = /% *2/i.test(ut);
        const hasCompare = /(===|==|!==|!=) *0/i.test(ut);
        const hasPrint = /(console\.log|print)/i.test(ut);
        const hasEven = /even/i.test(ut);
        const hasOdd = /odd/i.test(ut);

        const validEvenPrint =
          /console\.log\s*\(\s*(['"`])[^'"`]*even[^'"`]*\1\s*\)/i.test(ut);
        const validOddPrint =
          /console\.log\s*\(\s*(['"`])[^'"`]*odd[^'"`]*\1\s*\)/i.test(ut);

        if (ut === "") {
          return getRand([
            "You might want to try this instead:<br>Onnume ezhuthama hint keta mudiyathu. Neenga ezhuthuna ingredients ah apdiye program ah poda try pannunga.",
          ]);
        } else if (!hasVariable) {
          if (/\b(variable|var|let|const)\b/i.test(ut)) {
            return getRand([
              "You might want to try this instead:<br>Variable declare panni athula oru number store pannunga (e.g., 'let variable = 5;'). Verum 'variable' nu ezhutha koodathu.",
            ]);
          }
          return getRand([
            "Code start panrom, JS-la mudhal-la number-ah save panna entha keyword use panni variable create pannanum?",
            "Variable declare panni athula number (e.g., = 5) assign pandra statement-ah ezhuthingala?",
          ]);
        } else if (hasVariable && !hasVariableWithKeyword) {
          return getRand([
            "Variable-ah create panna correct-ana JS keyword (let, const, var) thavaraama use pannitingala?",
            "Verum variable name mattum podama, munnadi var/let/const keyword thevai la? Check pannunga.",
          ]);
        } else if (!hasIfElse) {
          return getRand([
            "Adutha step: Odd/even-ah check panna enna JS statement thevai? if...else block ezhuthiyacha?",
            "Oru condition check pandrathuku syntax if (condition) { ... } else { ... } la? Atha potingala?",
          ]);
        } else if (!hasModulo) {
          return getRand([
            "if condition bracket-kulla remainder edukka enna operator podanum nu yosinga?",
            "Math division-oda remainder-ah edukka JS-la enna symbol (%) use pannuvom?",
          ]);
        } else if (
          /\%\s*2\s*(===|==)\s*0/.test(ut) &&
          !new RegExp("[a-zA-Z0-9_]+\\s*\\%\\s*2", "i").test(ut)
        ) {
          return getRand([
            "You might want to try this instead:<br>if condition-la Modulo operator (%) kku munnadi variable name ezhuthanum (e.g., 'if (variable % 2 == 0)'). Verum 'if (% 2 == 0)' nu ezhutha koodathu.",
          ]);
        } else if (!hasVarBeforeMod) {
          return getRand([
            `Modulo operator (%) kku munnadi entha number-ah divide pannanumo antha variable name ('${varName}') add pannitingala?`,
            "Verum % 2 podakoodathu, entha variable-la irunthu % 2 edukkirom nu sollanum la?",
          ]);
        } else if (!hasDivisor) {
          return getRand([
            "Modulo (%) operator kooda entha divisor podanum? Odd/even kandupudikka yentha number-aala divide pannanum?",
            "Remainder check panna 2-aala divide pannanum la? Athu code-la irukka nu parunga.",
          ]);
        } else if (!hasCompare) {
          return getRand([
            "Condition-la remainder '0'-ku equal-ah nu check panna enna equality operator (===) use pannanum?",
            "Condition check-la left side result '0' varutha nu compare panna eppadi ezhuthuvinga?",
          ]);
        } else if (!hasPrint) {
          return getRand([
            "Condition correct! Adutha step-la antha result-ah print panna JS-la enna command (console.log) thevai?",
            "Result-ah console-la display panna vendiya statement-ah ezhuthingala?",
          ]);
        } else if (/console\.log(?!\s*\()/i.test(ut)) {
          return getRand([
            "console.log ulla function brackets '()' potrukkingala nu check pannunga.",
            "Syntax check: console.log ezhuthumbothu athukulla brackets() use pannanum la?",
          ]);
        } else if (/console\.log\s*\(\s*[^'"`\s)]+\s*\)/i.test(ut)) {
          return getRand([
            "console.log ulla display panna vendiya text-ah double quotes/single quotes-kulla ezhuthitingala?",
            'Text string-ah print pannumbothu quotes "" ulla thaan ezhuthanum, code-la atheppadi iruku nu parunga.',
          ]);
        } else if (!validEvenPrint) {
          return getRand([
            "if block ulla even nu text-ah correct-aana print statement vazhiya ezhuthiyacha?",
            'Condition true aagumbothu console.log("even") nu code execute aagura mari potrukingala?',
          ]);
        } else if (!validOddPrint) {
          return getRand([
            "else block-la odd nu text-ah correct-aana print statement vazhiya ezhuthiyacha?",
            'Condition false aagumbothu (else block) console.log("odd") nu text display aaga enna pannanum?',
          ]);
        } else if (!hasEven) {
          return getRand([
            "You might want to try this instead:<br>if block la enna print pannanum? Condition true aana 'even' nu print pannunga.",
          ]);
        } else if (!hasOdd) {
          return getRand([
            "You might want to try this instead:<br>else block la enna print pannanum? Condition false aana 'odd' nu print pannunga.",
          ]);
        }
        return "You might want to try this instead:<br>Code looks good!";
      }
    }
    return getRand(hints);
  };

  const lines = (userInput || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const text = (userInput || "").toLowerCase().trim();

  // Greeting check requirement
  if (/\b(hi|hello|he|she|hey|good morning)\b/i.test(text)) {
    return getRandomHint([
      "Greetings vendam, logic mattum focus pannunga.<br>You might want to try this instead: Write the logical steps directly.",
      "Ithula hi/hello thevai illai.<br>Hint: Seedha problem logic ku ponga.",
      "Chat language venam.<br>Hint: Code and math terms use panni eluthunga.",
    ]);
  }

  // Unrelated input check
  const isRelated =
    /(even|odd|number|modulo|remainder|mod|div|%|variable|var|let|const|input|output|print|console|log|if|else|condition|logic|math|declare|compare|code|program|operator|value|result|இரட்டை|ஒற்றை|எண்|வகு|மீதி|விடை|படி|முறை|logic|logic-ah|\d+|\ben\b|check|meethi|meedi|meeti|vagu|vaka|vaku|vaghikka|vaguka|irattai|otrai|othrai|orrai|rendu|buh|zero|one|equal|==|===)/i.test(
      text,
    );
  if (text !== "" && !isRelated) {
    return getRandomHint([
      "Unrelated-ah type pannatheenga. Intha problem oda core logic enna nu focus panni ezhuthunga.",
      "Intha question-kum neenga type pannathukum sambandham illai. Problem logic enna nu focus pannunga.",
      "Please focus on the logic! Unrelated conversational elements or phrases type pannatheenga.",
    ]);
  }

  // Help / list check
  if (
    /\b(therla|theriyathu|don'?t know|what is|puriyala|explain|example|help|idea illa|no idea)\b/i.test(
      text,
    ) ||
    /(odd|even) number list/i.test(text)
  ) {
    return getRandomHint([
      "Even numbers na 2, 4, 6, 8... Odd numbers na 1, 3, 5, 7... Ithu eppadi varuthu nu yosi.<br>Hint: 2 aala divide panni paaru.",
      "Example: 2, 4, 6 ellam Even. 1, 3, 5 ellam Odd. Ipo logic ezhuthunga.<br>Hint: Modulo (%) operator use panni remainder check pannunga.",
      "Even na 2 aala divide aagura numbers. Odd na 2 aala divide aagatha numbers. Ipo math logic ezhuthunga.<br>Hint: % 2 check pannunga.",
    ]);
  }

  if (lines.length === 0) {
    if (section === "logic") {
      return getRandomHint([
        "Odd/even logic or math step ah explain pannu.<br>You might want to try this instead: First oru number eduthuko, athu odd/even find pannu.",
        "Logic section empty ah irukku.<br>Hint: Odd/Even kandupudikra math trick ah inga ezhuthunga.",
        "Starting point thevai.<br>Hint: Oru number ah eppadi even or odd nu solve pannuvenga nu explain pannunga.",
      ]);
    } else if (section === "recipe") {
      return getRandomHint([
        "Empty ah irukku. Logic ah base panni step-by-step ah ezhuthanum. First step enna varum nu yosichu ezhuthunga.",
        "Program start aaga mudhalla oru input thevai. Atha eppadi oru step ah ezhuthuvinga?",
        "First step missing. Oru operation panna ungaluku mudhalla enna thevai nu 1st step aaga ezhuthunga.",
      ]);
    } else if (section === "ingredients") {
      return getRandomHint([
        "Program ku thevayana var, loop, conditions list pannu.<br>You might want to try this instead: 1st step la variable(number) get pannirupom.",
        "Keywords thevai.<br>Hint: Intha program ku enna variables, operators use panringa nu sollunga.",
        "Ingredients illama code ezhutha mudiyathu.<br>Hint: If-else thevaiya? Variable thevaiya? List pannunga.",
      ]);
    } else if (section === "samplecode") {
      return getRandomHint([
        "Onnume ezhuthama hint keta mudiyathu. Neenga ezhuthuna ingredients ah apdiye program ah poda try pannunga.",
      ]);
    } else {
      return getRandomHint([
        "Theory vendam, program structure code ah eluthu.<br>You might want to try this instead: Implement full if-else statement.",
        "Final code section ithu.<br>Hint: Neenga mela sonna logic ah ipo code ah maathunga.",
        "Empty code block.<br>Hint: Unmai aana syntax use panni code eluthunga.",
      ]);
    }
  }

  // Line by line validation
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (problemID === "problem01" || !problemID) {
      // Clean lines to prevent false-positives on non-mathematical uses of operators
      const cleanLineForMinus = line.replace(
        /[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+/g,
        "",
      );
      const cleanLineForSlash = line.replace(
        /\b(odd|even|if|else|yes|no|true|false|remainder|modulo|right|left|operator|operation|variable|var|let|const|input|output|print|console|log)\s*\/\s*(odd|even|if|else|yes|no|true|false|remainder|modulo|right|left|operator|operation|variable|var|let|const|input|output|print|console|log)\b/gi,
        "",
      );

      const hasPlus = /(?:\d\s*\+\s*\d|\b[a-z0-9_]+\s*\+\s*[a-z0-9_]+\b)/i.test(
        line,
      );
      const hasMinus =
        /\-/.test(cleanLineForMinus) &&
        /(?:\d\s*\-\s*\d|\b[a-z0-9_]+\s*\-\s*[a-z0-9_]+\b)/i.test(
          cleanLineForMinus,
        );
      const hasMultiply =
        /(?:\d\s*\*\s*\d|\b[a-z0-9_]+\s*\*\s*[a-z0-9_]+\b)/i.test(line);
      const hasDivision =
        /\//.test(cleanLineForSlash) &&
        /(?:\d\s*\/|quotient|divide|\b[a-z0-9_]+\s*\/)/i.test(
          cleanLineForSlash,
        );

      if (hasPlus) {
        if (section === "recipe") {
          return getRandomHint([
            `Step ${i + 1} la error: + (plus) operator odd/even check panna use panna koodathu.<br>Yean na: Addition panna rendu number-in kootu (sum) kittum — athu oru number 2-aal valik paduma nu sollathu. Odd/even kandupidikka number-ai 2-aala divide panna MEETHI (remainder) paakkanam. ONLY % (modulo) thaan remainder tharum.<br>Correct: number % 2 = 0 → even, number % 2 = 1 → odd.`,
            `Step ${i + 1} thappu: + venam.<br>Karanam: Odd/even check panna remainder thevai — addition athai tharaathu. % 2 thaan correct: 0 = even, 1 = odd.`,
          ]);
        }
        return getRandomHint([
          `Line ${i + 1} la error iruku: Plus (+) operator odd/even find panna uthavathu.<br>You might want to try this instead: Modulo (%) operator use panni remainder paru.`,
          `Line ${i + 1} thappu: Addition vachi odd/even kandupudika mudiyathu.<br>Hint: Division oda remainder edukka (%) try pannunga.`,
          `Line ${i + 1} check pannu: (+) badhil vera operator thevai.<br>Hint: Modulo operator (%) tha inga workout aagum.`,
        ]);
      }
      if (hasMinus) {
        if (section === "recipe") {
          return getRandomHint([
            `Step ${i + 1} la error: - (minus) operator odd/even check panna use panna koodathu.<br>Yean na: Subtraction panna rendu number-in vithiyasam (difference) kittum — athu 2-aal valik paduma nu sollathu. Remainder kandupidikka % (modulo) thaan use pannanum.<br>Correct: number % 2 panna meethi 0 → even, 1 → odd.`,
            `Step ${i + 1} thappu: - venam.<br>Karanam: Odd/even check panna MEETHI (remainder) thevai — subtraction athai tharaathu. % 2 thaan correct.`,
          ]);
        }
        return getRandomHint([
          `Line ${i + 1} la error iruku: Minus (-) operator odd/even find panna uthavathu.<br>You might want to try this instead: Left side la number, right side la remainder check pannanum (%).`,
          `Line ${i + 1} thappu: Subtraction vachi odd/even kandupudika mudiyathu.<br>Hint: Division oda remainder edukka (%) try pannunga.`,
          `Line ${i + 1} check pannu: (-) badhil vera operator thevai.<br>Hint: Modulo operator (%) tha inga workout aagum.`,
        ]);
      }
      if (hasMultiply) {
        if (section === "recipe") {
          return getRandomHint([
            `Step ${i + 1} la error: * (multiply) operator odd/even check panna use panna koodathu.<br>Yean na: Multiplication panna rendu number-in product kittum — athu oru number even/odd-a nu sollathu. % 2 (modulo) panna remainder kittum, athu thaan odd/even kandupidikka use aagum.<br>Correct: number % 2 = 0 → even, 1 → odd.`,
            `Step ${i + 1} thappu: * venam.<br>Karanam: Multiplication product tharum — odd/even check panna help aagaathu. % 2 thaan correct.`,
          ]);
        }
        return getRandomHint([
          `Line ${i + 1} la error iruku: Multiplication (*) operator odd/even find panna uthavathu.<br>You might want to try this instead: Left side la number, right side la remainder check pannanum (%).`,
          `Line ${i + 1} thappu: Multiplication vachi odd/even kandupudika mudiyathu.<br>Hint: Division oda remainder edukka (%) try pannunga.`,
          `Line ${i + 1} check pannu: (*) badhil vera operator thevai.<br>Hint: Modulo operator (%) tha inga workout aagum.`,
        ]);
      }
      if (hasDivision) {
        if (section === "recipe") {
          return getRandomHint([
            `Step ${i + 1} la error: / (division) operator recipe-la use panna koodathu.<br>Yean na: / operator panna QUOTIENT kittum (example: 7 / 2 = 3.5) — aana odd/even check panna REMAINDER thevai (7 % 2 = 1). % (modulo) operator thaan remainder tharum, division (/) tharaathu.<br>Correct: number % 2 panna 0 vantha even, 1 vantha odd.`,
            `Step ${i + 1} thappu: / venam.<br>Karanam: Division quotient tharum (7/2=3.5), aana namba remainder paakkanam (7%2=1 → odd). % use pannunga!`,
          ]);
        }
        return getRandomHint([
          `Line ${i + 1} la error iruku: Division (/) quotient tha tharum, remainder illai.<br>You might want to try this instead: Variable % 2 == 0 irundhal even nu compare pannu.`,
          `Line ${i + 1} thappu: (/) operator division ku mattum tha.<br>Hint: Modulo (%) operator thaan remainder tharum.`,
          `Line ${i + 1} check pannu: Division venam.<br>Hint: Remainder kidaikka % use pannunga.`,
        ]);
      }
      if (/%/.test(line) || /mod/i.test(line)) {
        const mathMatch = line.match(
          /(\d+)\s*%\s*(\d+)\s*(?:==?|is|=|-)?\s*(\d+)/i,
        );
        if (mathMatch) {
          const num = parseInt(mathMatch[1]);
          const divisor = parseInt(mathMatch[2]);
          const userRem = parseInt(mathMatch[3]);

          if (divisor !== 2) {
            return getRandomHint([
              `Line ${i + 1} thappu: Divisor ${divisor} use pannirukinga.<br>Hint: Odd/Even check panna 2 aala divide pannanum.`,
              `Line ${i + 1} check pannu: ${divisor} aala divide panna odd/even kandupudika mudiyathu.<br>Hint: Divisor 2 aaga irukkanum.`,
              `Line ${i + 1} logic error: Divisor thappu.<br>Hint: 2 aala modulo (%) pannunga.`,
            ]);
          }

          if (num % divisor !== userRem) {
            return getRandomHint([
              `Line ${i + 1} thappu: ${num} % ${divisor} panna remainder ${userRem} varathu.<br>Hint: ${num} ah ${divisor} aala divide panna correct remainder ${num % divisor} thaan varum.<br>Even numbers: 2, 4, 6... Odd numbers: 1, 3, 5...`,
              `Line ${i + 1} check pannu: Math calculation thappu.<br>Hint: ${num} % ${divisor} oda correct answer ${num % divisor}.<br>Even na 2 aala divide aagum (2, 4, 6), Odd na divide aagathu (1, 3, 5).`,
              `Line ${i + 1} math error: ${num} ah ${divisor} aala divide pannum pothu remainder enna varum nu check pannunga.<br>Hint: Correct calculation ah ezhuthunga. Even: 2, 4, 6... Odd: 1, 3, 5...`,
            ]);
          }

          if (num % 2 === 0 && /odd/i.test(line) && !/even/i.test(line)) {
            return getRandomHint([
              `Line ${i + 1} thappu: ${num} oru even number.<br>Hint: Athu odd number illai (Example: 1, 3, 5, 7...), mathi ezhuthunga.<br>Even numbers: 2, 4, 6... Odd numbers: 1, 3, 5...`,
              `Line ${i + 1} check pannu: Logic thappu.<br>Hint: ${num} % 2 = 0 na athu Even number. Odd numbers na 1, 3, 5, 7 maari varum.<br>Even na 2 aala divide aagum (2, 4, 6), Odd na divide aagathu (1, 3, 5).`,
              `Line ${i + 1} error: ${num} ah odd nu sollirukinga.<br>Hint: Remainder 0 vantha athu even. Example for Odd: 1, 3, 5, 7...<br>Even: 2, 4, 6... Odd: 1, 3, 5...`,
            ]);
          }

          if (num % 2 !== 0 && /even/i.test(line) && !/odd/i.test(line)) {
            return getRandomHint([
              `Line ${i + 1} thappu: ${num} oru odd number.<br>Hint: Athu even number illai (Example: 2, 4, 6, 8...), mathi ezhuthunga.<br>Even numbers: 2, 4, 6... Odd numbers: 1, 3, 5...`,
              `Line ${i + 1} check pannu: Logic thappu.<br>Hint: ${num} % 2 = 1 na athu Odd number. Even numbers na 2, 4, 6, 8 maari varum.<br>Even na 2 aala divide aagum (2, 4, 6), Odd na divide aagathu (1, 3, 5).`,
              `Line ${i + 1} error: ${num} ah even nu sollirukinga.<br>Hint: Remainder 1 vantha athu odd. Example for Even: 2, 4, 6, 8...<br>Even: 2, 4, 6... Odd: 1, 3, 5...`,
            ]);
          }
        }

        if (/2/.test(line)) {
          if (/0/.test(line) && /odd/.test(line) && !/even/.test(line)) {
            return getRandomHint([
              `Line ${i + 1} thappu: Remainder 0 vantha athu odd number ah?<br>Hint: Divisor 2 vachi divide pannum pothu remainder 0 vantha athu Even number.<br>Even numbers: 2, 4, 6... Odd numbers: 1, 3, 5...`,
              `Line ${i + 1} check pannu: 0 remainder iruntha eppadi odd aagum?<br>Hint: % 2 == 0 na Even number nu mathi ezhuthunga.<br>Even na 2 aala divide aagum (2, 4, 6), Odd na divide aagathu (1, 3, 5).`,
              `Line ${i + 1} logic error: Math logic idikuthu.<br>Hint: Any number % 2 == 0 na athu definitely even.<br>Even: 2, 4, 6... Odd: 1, 3, 5...`,
            ]);
          }
          if (/1/.test(line) && /even/.test(line) && !/odd/.test(line)) {
            return getRandomHint([
              `Line ${i + 1} thappu: Remainder 1 vantha athu even number ah?<br>Hint: Divisor 2 vachi divide pannum pothu remainder 1 vantha athu Odd number.<br>Even numbers: 2, 4, 6... Odd numbers: 1, 3, 5...`,
              `Line ${i + 1} check pannu: 1 remainder iruntha eppadi even aagum?<br>Hint: % 2 == 1 na Odd number nu mathi ezhuthunga.<br>Even na 2 aala divide aagum (2, 4, 6), Odd na divide aagathu (1, 3, 5).`,
              `Line ${i + 1} logic error: Math logic idikuthu.<br>Hint: Any number % 2 == 1 na athu definitely odd.<br>Even: 2, 4, 6... Odd: 1, 3, 5...`,
            ]);
          }
        }
      }

      if (
        section !== "recipe" &&
        !/%/.test(line) &&
        !/\+/.test(line) &&
        !/\//.test(line)
      ) {
        if (
          /(?:even|even numbers)/i.test(line) &&
          !/(?:odd|odd numbers)/i.test(line)
        ) {
          const nums = line.match(/\d+/g) ? line.match(/\d+/g).map(Number) : [];
          const checkNums = nums.filter((n) => n > 2); // Ignore 0, 1, 2 as they are used in explanations
          const wrongEvens = checkNums.filter((n) => n % 2 !== 0);
          if (wrongEvens.length > 0) {
            return getRandomHint([
              `Line ${i + 1} thappu: ${[...new Set(wrongEvens)].join(", ")} even number illai.<br>Hint: Even numbers na 2, 4, 6... ithu 2 aala meethi illama divide aagum.`,
              `Line ${i + 1} check pannu: Neenga kudutha list la ${[...new Set(wrongEvens)].join(", ")} odd number.<br>Hint: Even numbers ah mattum ezhuthunga.`,
              `Line ${i + 1} error: ${[...new Set(wrongEvens)].join(", ")} 2 aala divide aagaathu.<br>Hint: Correct aana even numbers ah podunga.`,
            ]);
          }
        }

        if (
          /(?:odd|odd numbers)/i.test(line) &&
          !/(?:even|even numbers)/i.test(line)
        ) {
          const nums = line.match(/\d+/g) ? line.match(/\d+/g).map(Number) : [];
          const checkNums = nums.filter((n) => n > 2); // Ignore 0, 1, 2 as they are used in explanations
          const wrongOdds = checkNums.filter((n) => n % 2 === 0);
          if (wrongOdds.length > 0) {
            return getRandomHint([
              `Line ${i + 1} thappu: ${[...new Set(wrongOdds)].join(", ")} odd number illai.<br>Hint: Odd numbers na 1, 3, 5... ithu 2 aala meethi illama divide aagaathu.`,
              `Line ${i + 1} check pannu: Neenga kudutha list la ${[...new Set(wrongOdds)].join(", ")} even number.<br>Hint: Odd numbers ah mattum ezhuthunga.`,
              `Line ${i + 1} error: ${[...new Set(wrongOdds)].join(", ")} 2 aala divide aagum.<br>Hint: Correct aana odd numbers ah podunga.`,
            ]);
          }
        }
      }

      // Removed condition requirement for recipe as requested
    }
  }

  // Next step hint (if no errors found in the current lines)
  if (problemID === "problem02") {
    if (section === "logic") {
      if (!/mathematical/i.test(text)) {
        return getRandomHint([
          "Programming logic oda mathematical essence missing.<br>You might want to try this instead: Define logic in a concise mathematical way.",
          "Math essence thevai.<br>Hint: Math padi logic ah eppadi define pannuvenga?",
          "Mathematical words miss aaguthu.<br>Hint: Logic na mathematics aadharam, atha explain pannunga.",
        ]);
      }
    } else if (section === "recipe") {
      if (lines.length < 3) {
        return getRandomHint([
          "Innum steps theva. Process ah step-by-step outline pannu.<br>You might want to try this instead: Break down setup, condition, output steps.",
          "Steps pathala.<br>Hint: Innum detail ah 3 points kumele ezhuthunga.",
          "Process ah innum viriva ezhuthunga.<br>Hint: Setup, check, result nu break pannunga.",
        ]);
      }
    } else if (section === "ingredients") {
      if (
        !/loop/i.test(text) ||
        !/conditional/i.test(text) ||
        !/left/i.test(text) ||
        !/right/i.test(text)
      ) {
        return getRandomHint([
          "Fundamental concepts list pannunga.<br>You might want to try this instead: Explain loop mechanics and if-else conditions.",
          "Keywords missing.<br>Hint: Loop, condition, left/right paths pathi mention pannunga.",
          "Core ingredients innum thevai.<br>Hint: Loop, conditional branching ellam ingredients tha.",
        ]);
      }
    } else {
      if (!/if/.test(text)) {
        return getRandomHint([
          "Oru clear coding task example kudu.<br>You might want to try this instead: Provide a sample task users can write code for.",
          "Code task missing.<br>Hint: User try panna oru example (like 'if' statements) thanga.",
          "Sample code illai.<br>Hint: 'if' condition irukkara maari oru example ezhuthunga.",
        ]);
      }
    }
  } else {
    // Problem 01
    if (section === "logic") {
      const isCodeFormat =
        /[{}]|;|\bconsole\.log\b|\bif\s*\(|let\s+[a-zA-Z0-9_]+\s*=|const\s+[a-zA-Z0-9_]+\s*=|var\s+[a-zA-Z0-9_]+\s*=/i.test(
          text,
        );
      if (isCodeFormat) {
        return getRandomHint([
          "Logic section-la programming code/keywords (braces, semicolons, console.log, if-conditions code structure) ezhutha koodathu.<br>Hint: Code-aaga illamal, plain theory-aagavo mathematical logic-aagavo thaan ezhuthanum.",
          "Code syntax use panna koodathu.<br>Hint: Logic plain mathematical statements-aaga thaan ezhuthanum.",
          "Programming format venam.<br>Hint: Syntax/keywords ezhuthama unga logic-ah mathematical descriptions format-la ezhuthunga.",
        ]);
      }

      const divByNonTwoMatch = text.match(
        /(?:divide|division|mod|modulo|%|by|vagu|vaku)\s*([3-9]|\d{2,})/i,
      );
      if (divByNonTwoMatch) {
        const wrongDivisor = divByNonTwoMatch[1];
        return `Logic error: Odd/even check panna number-ah 2-aala thaan modulo divide pannanum (e.g., modulo 2 or divide by 2). Neenga ${wrongDivisor}-aala divide panni check pannuringa.`;
      }

      const invalidRemMatch = text.match(
        /(?:remainder|remider|meethi|meedi|meeti|result|value|equals|is)\s*(?:is|equals|equal|==|=|to)?\s*([2-9]|\d{2,})\b/i,
      );
      if (invalidRemMatch) {
        const wrongRem = invalidRemMatch[1];
        return `Logic check error: Modulo by 2 panna remainder eppothume 0 (even) illa 1 (odd) thaan varum. Vera remainder value (like ${wrongRem}) podakoodathu.`;
      }

      const hasZeroOdd =
        /(?:0|zero)\s*(?:is|equals|equal|==|=|to)?\s*(?:an\s*)?odd/i.test(
          text,
        ) ||
        /odd\s*(?:number|is|equals|equal|==|=|to)?\s*(?:with|if)?\s*(?:remainder\s*)?(?:0|zero)/i.test(
          text,
        ) ||
        /remainder\s*(?:0|zero)\s*(?:is|==|=)?\s*odd/i.test(text) ||
        /meethi\s*(?:0|zero)\s*(?:na|vantha)?\s*odd/i.test(text) ||
        /(?:0|zero)\s*its\s*odd/i.test(text);
      const hasOneEven =
        /(?:1|one)\s*(?:is|equals|equal|==|=|to)?\s*(?:an\s*)?even/i.test(
          text,
        ) ||
        /even\s*(?:number|is|equals|equal|==|=|to)?\s*(?:with|if)?\s*(?:remainder\s*)?(?:1|one)/i.test(
          text,
        ) ||
        /remainder\s*(?:1|one)\s*(?:is|==|=)?\s*even/i.test(text) ||
        /meethi\s*(?:1|one)\s*(?:na|vantha)?\s*even/i.test(text) ||
        /(?:1|one)\s*its\s*even/i.test(text);

      if (hasZeroOdd || hasOneEven) {
        return "Math logic-la small error: Remainder 0 vantha athu Even number, Remainder 1 vantha athu Odd number. Mathi check pannunga.";
      }

      if (
        !/%/.test(text) &&
        !/modulo/i.test(text) &&
        !/mod\b/i.test(text) &&
        !/remainder/i.test(text) &&
        !/divis/i.test(text) &&
        !/divide/i.test(text)
      ) {
        return getRandomHint([
          "Operator missing.<br>Hint: Modulo (%) or division rules use pannu.",
          "Logic clear ah illai.<br>Hint: Remainder kandupudikka % operator or division theory use pannunga.",
          "Odd or even check panna mathematical logic thevai.<br>Hint: 2 aala divide panra pathi yosinga.",
        ]);
      }
      if (!/2|two/i.test(text)) {
        return getRandomHint([
          "Divisor missing.<br>Hint: Enna number aala divide panni check pannanum? (e.g., 2)",
          "Odd/Even check panna entha number aala divide pannanum?<br>Hint: Divisor 2 ah irukkanum.",
          "Logic incomplete.<br>Hint: Number ah 2 aala divide panni paaru.",
        ]);
      }

      const mathMatches = [...text.matchAll(/(\d+)\s*%\s*2/gi)];
      for (const match of mathMatches) {
        const num = parseInt(match[1]);
        if (num % 2 === 0 && !/even/i.test(text) && /odd/i.test(text)) {
          return getRandomHint([
            `Logic thappu: Neenga ${num} ah vachi calculation potrukinga. Athu Even number, aana Odd nu explain pannirukinga.`,
            `Check pannu: ${num} % 2 panna remainder 0 varum. So athu Even. Aana neenga Odd nu sollirukinga.`,
            `Error: Math calculation padikku ${num} oru even number. Mathi ezhuthunga.`,
          ]);
        }
        if (num % 2 !== 0 && !/odd/i.test(text) && /even/i.test(text)) {
          return getRandomHint([
            `Logic thappu: Neenga ${num} ah vachi calculation potrukinga. Athu Odd number, aana Even nu explain pannirukinga.`,
            `Check pannu: ${num} % 2 panna remainder 1 varum. So athu Odd. Aana neenga Even nu sollirukinga.`,
            `Error: Math calculation padikku ${num} oru odd number. Mathi ezhuthunga.`,
          ]);
        }
      }

      if (!/even/i.test(text) || !/odd/i.test(text)) {
        if (!/even/i.test(text)) {
          return getRandomHint([
            "Even logic pathi sollala.<br>Hint: 2 aala divide pannumbothu remainder 0 vantha even nu explain pannunga.",
            "Even number logic missing.<br>Hint: Remainder 0 vantha even aagum nu mathematical logic ah explain pannunga.",
          ]);
        }
        if (!/odd/i.test(text)) {
          return getRandomHint([
            "Odd logic pathi sollala.<br>Hint: 2 aala divide pannumbothu remainder 1 vantha odd nu explain pannunga.",
            "Odd number logic missing.<br>Hint: Remainder 1 vantha odd aagum nu mathematical logic ah explain pannunga.",
          ]);
        }
      }
      return "Excellent logic!";
    } else if (section === "recipe") {
      if (lines.length === 0) {
        return getRandomHint([
          "Empty ah irukku. Logic ah base panni step-by-step ah ezhuthanum. First step enna varum nu yosichu ezhuthunga.",
          "Program start aaga mudhalla oru input thevai. Atha eppadi oru step ah ezhuthuvinga?",
          "First step missing. Oru operation panna ungaluku mudhalla enna thevai nu 1st step aaga ezhuthunga.",
        ]);
      }

      const step1 = lines[0] ? lines[0].toLowerCase() : "";
      const step2 = lines[1] ? lines[1].toLowerCase() : "";
      const step3 = lines[2] ? lines[2].toLowerCase() : "";
      const step4 = lines[3] ? lines[3].toLowerCase() : "";

      // Check Step 1
      if (!/(number|num|value|input)/i.test(step1)) {
        return getRandomHint([
          "Step 1 la thappu: First oru number input aaga vaanga vendama? Athai ezhuthunga.",
          "Line 1 check pannu: Oru number ah first vaanganum nu ezhuthunga.",
          "Input element thevai. Number vaangaratha muthal step ah podunga.",
        ]);
      }

      if (lines.length === 1) {
        return getRandomHint([
          "Number kedaichiduchu. Next antha number ah vachi odd/even kandupudikka enna math calculation pannanum nu 2nd step la ezhuthu.",
          "Input vaangiyachu, adutha step la odd/even find panna enna mathematical operation pannanum?",
          "Next step thevai: Number ah entha operation panna athu odd/even nu theriyum?",
        ]);
      }

      // Check Step 2
      if (
        !/(%|mod|modulo|divis|divide|remainder|vagu|vaguk|meethi|split).*?(2|two|rendu|iraNdu)/i.test(step2) &&
        !/(2|two|rendu|iraNdu).*?(divide|mod|%|remainder|meethi|vagu)/i.test(step2)
      ) {
        return getRandomHint([
          "Step 2 la error irukku: Odd or even check panna 2-aala divide panni meethi (remainder) kandupidikka sollanum. Theory ah ezhuthuvom na '2 aala divide pannu' or '% 2 use pannu' nu mention pannunga.",
          "Calculation thappu (Line 2). Odd/Even kandupudikka 2-aala divide panna meethi (remainder) paakkanam — athai step 2-la sollanum.",
          "Operation thappu (Line 2). Number-ai 2-aala divide panna meethi enna nu step 2-la ezhuthunga (e.g., '% 2 panni meethi kandupudi' or 'divide by 2').",
        ]);
      }

      if (lines.length === 2) {
        return getRandomHint([
          "Calculation ok. Ippa athoda answer (remainder) vachi eppadi odd or even nu mudivu pannuva? Athukkaana condition ah 3rd step la ezhuthu.",
          "Math logic ok, aana output enna varum nu 3rd step la sollala. Remainder enna vantha even or odd?",
          "Adutha step la output ah decide pannu. Remainder enna vantha even illa odd varum?",
        ]);
      }

      // Clean steps to remove leading numbers
      const cleanStep3 = step3.replace(
        /^\s*(step\s*\d+|\d+)[\)\.\-\:]?\s*/i,
        "",
      );
      const cleanStep4 = step4.replace(
        /^\s*(step\s*\d+|\d+)[\)\.\-\:]?\s*/i,
        "",
      );

      // Check Step 3
      if (/(0|zero).*odd|odd.*(0|zero)/i.test(cleanStep3)) {
        return getRandomHint([
          "Step 3 logic thappu: Remainder 0 vantha athu even, 1 vantha athu odd. Mathi ezhuthitinga check pannunga.",
          "Condition thappu (Line 3): 0 vantha odd nu potturukinga. Athu even thaane?",
          "Output error: 0 remainder vantha even nu ezhuthunga, odd illai.",
        ]);
      }
      if (/(1|one).*even|even.*(1|one)/i.test(cleanStep3)) {
        return getRandomHint([
          "Step 3 condition thappu: Oru number ah 2 aala divide panni 1 vantha athu odd. Mathi ezhuthitinga check pannunga.",
          "Condition thappu (Line 3): 1 vantha even nu potturukinga. Athu odd thaane?",
          "Output error: 1 remainder vantha odd nu ezhuthunga, even illai.",
        ]);
      }
      if (!/odd/i.test(cleanStep3) && !/even/i.test(cleanStep3)) {
        return getRandomHint([
          "Step 3 la error irukku: Remainder enna vantha 'odd' or 'even' nu clear ah ezhuthunga.",
          "Result missing (Line 3): 0 or 1 vantha enna print pannanum nu theliva sollala.",
        ]);
      }

      if (lines.length === 3) {
        let hasOdd3 = /odd/i.test(step3);
        let hasEven3 = /even/i.test(step3);

        if (hasOdd3 && !hasEven3) {
          return getRandomHint([
            "Odd step ezhuthiyachu. Aana even eppo varum nu 4th step la sollala.",
            "Odd logic ok, adutha step la even eppo varum nu ezhuthunga.",
            "Even missing: 4th step la even kkaana condition ah ezhuthunga.",
          ]);
        } else if (hasEven3 && !hasOdd3) {
          return getRandomHint([
            "Even step ezhuthiyachu. Aana odd eppo varum nu 4th step la sollala.",
            "Even logic ok, adutha step la odd eppo varum nu ezhuthunga.",
            "Odd missing: 4th step la odd kkaana condition ah ezhuthunga.",
          ]);
        }
      }

      // Check Step 4
      if (lines.length >= 4) {
        if (/(0|zero).*odd|odd.*(0|zero)/i.test(cleanStep4)) {
          return getRandomHint([
            "Step 4 logic thappu: Remainder 0 vantha athu even, 1 vantha athu odd. Mathi ezhuthitinga check pannunga.",
            "Condition thappu (Line 4): 0 vantha odd nu potturukinga. Athu even thaane?",
            "Output error: 0 remainder vantha even nu ezhuthunga, odd illai.",
          ]);
        }
        if (/(1|one).*even|even.*(1|one)/i.test(cleanStep4)) {
          return getRandomHint([
            "Step 4 condition thappu: Oru number ah 2 aala divide panni 1 vantha athu odd. Mathi ezhuthitinga check pannunga.",
            "Condition thappu (Line 4): 1 vantha even nu potturukinga. Athu odd thaane?",
            "Output error: 1 remainder vantha odd nu ezhuthunga, even illai.",
          ]);
        }
        if (!/odd/i.test(cleanStep4) && !/even/i.test(cleanStep4)) {
          return getRandomHint([
            "Step 4 la error irukku: Matha condition ku enna result varum ('odd' or 'even') nu clear ah ezhuthunga.",
            "Result missing (Line 4): Output odd ah even ah nu theliva sollala.",
          ]);
        }

        let hasOdd3 = /odd/i.test(step3);
        let hasEven3 = /even/i.test(step3);
        let hasOdd4 = /odd/i.test(step4);
        let hasEven4 = /even/i.test(step4);

        if (hasOdd3 && !hasEven3 && hasOdd4 && !hasEven4) {
          return getRandomHint([
            "Rendu step layum Odd eh ezhuthirukinga. Oru step Even kku maathunga.",
          ]);
        }
        if (hasEven3 && !hasOdd3 && hasEven4 && !hasOdd4) {
          return getRandomHint([
            "Rendu step layum Even eh ezhuthirukinga. Oru step Odd kku maathunga.",
          ]);
        }
      }

      return "Excellent! All steps are correct.";
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

      if (!hasVariable) {
        return getRandomHint([
          "Oru variable declare pannanum nu 1st step ezhuthunga.",
        ]);
      }
      if (!hasIfElse) {
        return getRandomHint([
          "Variable declare panniyachu, aduthu kandipa if else condition check pannanum nu yosi.",
        ]);
      }
      if (!hasMod) {
        return getRandomHint([
          "If else check panna modulo % calculation keyword standard ah include pannanum.",
        ]);
      }
      if (!hasTwo) {
        return getRandomHint([
          "Divide side check operator standard % 2 aaga thaan irukkanum.",
        ]);
      }
      if (!hasCompare) {
        return getRandomHint([
          "If statement la compare panna comparison operator == include panni check pannanum.",
        ]);
      }
      if (!hasZeroOrOne) {
        return getRandomHint([
          "Remainder condition standard value variable % 2 == 0 check pannanum.",
        ]);
      }
      if (!hasEven || !hasPrint) {
        return getRandomHint([
          "If condition % 2 == 0 satisfy aana 'even' nu print panna sollanum.",
        ]);
      }
      if (!hasOdd) {
        return getRandomHint([
          "If condition true na even, ippo else block statement la 'odd' print panna sollanum.",
        ]);
      }
      if (text.indexOf("even") > text.indexOf("odd")) {
        return getRandomHint([
          "If condition % 2 == 0 check panni 'even' thaan first print pannanum, 'odd' second (else block la) print pannanum.",
        ]);
      }
      return "Perfect ingredients!";
    } else if (section === "samplecode") {
      if (lines.length === 0) {
        return getRandomHint([
          "Onnume ezhuthama hint keta mudiyathu. Neenga ezhuthuna ingredients ah apdiye program ah poda try pannunga.",
          "Blank ah irukku. Ingredients la ezhuthuna mathi step-by-step ah code ezhuthunga.",
        ]);
      }

      // Check if it's theory instead of code
      const hasCodeKeywords =
        /(var|let|const|if|else|console|print|{|}|%|==|===)/i.test(text);
      const hasTheory =
        /\b(is even|is odd|number is|when we divide|remainder is)\b/i.test(
          text,
        ) && !hasCodeKeywords;

      if (hasTheory || !hasCodeKeywords) {
        return getRandomHint([
          "Taste the sample la theory ezhutha koodathu. Code mattum thaan ezhuthanum.",
        ]);
      }

      const hasVariable = /(var|let|const|number\s*=|input\s*=)/i.test(text);
      const hasIfElse = /(if *\(|else)/i.test(text);
      const hasModulo = /%/i.test(text);
      const hasDivisor = /% *2/i.test(text);
      const hasCompare = /(===|==|!==|!=) *0/i.test(text);
      const hasPrint = /(console\.log|print)/i.test(text);
      const hasEven = /even/i.test(text);
      const hasOdd = /odd/i.test(text);

      if (!hasVariable) {
        return getRandomHint([
          "Mudhal step: Oru variable ah eppadi declare pannanum nu yosi.<br>Example: let number = 5;",
        ]);
      }

      if (!hasIfElse) {
        return getRandomHint([
          "Adutha step: Odd or even nu check panna if else statement thevai.<br>Example syntax: if (condition) { ... } else { ... }",
        ]);
      }

      if (!hasModulo) {
        return getRandomHint([
          "if condition la enna podanum? Remainder check panna modulo operator (%) use pannunga.",
        ]);
      }

      if (!hasDivisor) {
        return getRandomHint([
          "Modulo (%) operator kooda enna divisor podanum? Odd/even check panna 2 aala thaan divide pannanum.",
        ]);
      }

      if (!hasCompare) {
        return getRandomHint([
          "Condition la remainder 0 varutha nu compare pannanum. Equality check panna '=== 0' use pannunga.",
        ]);
      }

      if (!hasPrint) {
        return getRandomHint([
          "Condition correct! Adutha step: Result ah display panna print statement thevai (e.g., console.log).",
        ]);
      }

      if (!hasEven) {
        return getRandomHint([
          "if block la enna print pannanum? Condition true aana 'even' nu print pannunga.",
        ]);
      }

      if (!hasOdd) {
        return getRandomHint([
          "else block la enna print pannanum? Condition false aana 'odd' nu print pannunga.",
        ]);
      }

      return "Code looks good!";
    }
  }

  return "Correct! Move to the next step.";
}

function isSuccessHint(hint) {
  if (!hint) return false;
  const h = hint.toLowerCase();
  return (
    h.includes("excellent logic") ||
    h.includes("all steps are correct") ||
    h.includes("perfect ingredients") ||
    h.includes("code looks good") ||
    h.includes("correct-ah ezhuthitinga") ||
    h.includes("move to the next step") ||
    h.includes("correct! move to the next step")
  );
}

export { generateHint, isSuccessHint };


function generateHintProblem02(section, userInput, hintLevel = 1, logicContent = "", recipeContent = "") {
  const getRand = (hints) => hints[Math.floor(Math.random() * hints.length)];
  const getVarHint = (...hints) => hints[(hintLevel - 1) % hints.length];
  const ut = (userInput || "").toLowerCase().trim();
  const rawUt = (userInput || "").trim();
  const lines = ut.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const rawLines = rawUt.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // ═══════════════════════════════════════════════════════════════
  // SECTION: LOGIC  (plain Tanglish theory, no code allowed)
  // ═══════════════════════════════════════════════════════════════
  if (section === "logic") {
    // Block code syntax in logic section
    const isCode = /[{}]|;\s*$|\bconsole\.log\b|\bif\s*\(|(?:let|const|var)\s+\w+\s*=|\bfor\s*\(|\bwhile\s*\(/i.test(ut);
    if (isCode) {
      return "Logic section-la code syntax use panna koodathu! 'let', 'for', 'console.log' maari keywords venam.<br>Plain theory-ah ezhuthunga. E.g.: '1 to N varaikkum ellaa numbers-aiyum add pannaa sum kidaikkum'.";
    }
    if (!ut) {
      if (hintLevel === 1) return "Blank ah irukku! Sum of N numbers-oda logic enna nu yosichu ezhutha try pannunga.";
      return getVarHint(
        "Blank ah irukku! Sum of N numbers-oda logic ezhuthunga.<br>Example: 'N = 5 na, 1+2+3+4+5 = 15 varum. Ithai eppadi calculate panravom?'",
        "Onnum illaye! 1 to N numbers-ai kootum (add) seyaluraiyai ezhuthunga.",
        "Empty box! Logic thevai. Numbers ah add panni sum kandupudikkum vazhiyai vilakkunga."
      );
    }
    // ── Parse arithmetic expressions a [op] b = c from user input ──
    const exprMatches = [...ut.matchAll(/(\d+)\s*([+\-*\/x×÷])\s*(\d+)\s*=\s*(\d+)/g)];

    if (exprMatches.length > 0) {
      // --- Step A: Check if any expression uses wrong operator ---
      const wrongOpExpr = exprMatches.find(e => e[2] !== '+');
      if (wrongOpExpr) {
        return getVarHint(
          `"${wrongOpExpr[0]}" — Intha expression-la <b>'${wrongOpExpr[2]}'</b> operator use pannirukinga!<br>Sum of N numbers-ku namma <b>+ (addition)</b> matum use pannanum.<br>👉 ${wrongOpExpr[1]} <b>+</b> ${wrongOpExpr[3]} = ? — ippadi ezhuthunga.`,
          `Wrong operator! '-', '*', '/' venam — sum edukka <b>'+'</b> use pannanum.`,
          `All expressions-la '+' operator matum use pannunga. E.g.: 0+1=1, 1+2=3, 3+3=6...`
        );
      }

      // --- Step B: Check arithmetic correctness (a+b must equal c) ---
      const wrongArith = exprMatches.find(e => {
        const a = parseInt(e[1]), b = parseInt(e[3]), c = parseInt(e[4]);
        return a + b !== c;
      });
      if (wrongArith) {
        const a = parseInt(wrongArith[1]), b = parseInt(wrongArith[3]), c = parseInt(wrongArith[4]);
        return getVarHint(
          `"${wrongArith[0]}" — Intha calculation <b>thappu</b>!<br>${a} + ${b} = <b>${a+b}</b> — aana neenga ${c} ezhuthiteenga.<br>Correct ah calculate panni ezhuthunga.`,
          `${a} + ${b} = ${c}? Correct ah calculate pannunga! ${a}+${b} = ${a+b}.`,
          `Arithmetic check: ${a}+${b}=${a+b}. Correct value ezhuthunga.`
        );
      }

      // --- Step C: Check sequence correctness ---
      const secondOps = exprMatches.map(e => parseInt(e[3]));
      const firstOps  = exprMatches.map(e => parseInt(e[1]));
      const results   = exprMatches.map(e => parseInt(e[4]));

      // Second operand MUST start from 1 or 2
      // Valid: 0+1=1 (secondOps[0]=1) OR 1+2=3 (secondOps[0]=2)
      const secondOpStartsFromOne = secondOps[0] === 1 || secondOps[0] === 2;
      if (!secondOpStartsFromOne) {
        return getVarHint(
          `"${exprMatches[0][0]}" — Operand thappu!<br>Sum of N numbers: <b>1-la irunthu</b> add pannanum.<br>Correct mudhal step: 0+<b>1</b>=1 or 1+<b>2</b>=3 — ippadi start pannunga.`,
          `First operand wrong! Add pannanum number 1 or 2-la start aaganum. "${secondOps[0]}" illai.`,
          `Pattern: E.g.: 0+1=1, 1+2=3, 3+3=6... OR 1+2=3, 3+3=6...`
        );
      }

      // CRITICAL: First operand (initial accumulated sum) MUST be 0
      // e.g.: 1+1=2 is WRONG because sum starts at 0, not 1
      // Correct: 0+1=1 (OR starting from 1+2=3 if skipping first step)
      const firstOpIsZero = firstOps[0] === 0;
      const startingFromTwo = firstOps[0] === 1 && secondOps[0] === 2; // e.g. 1+2=3 is ok
      if (!firstOpIsZero && !startingFromTwo) {
        // Calculate what the result SHOULD be vs what they got
        const userFinalResult = results[results.length - 1];
        const nGuess = secondOps[secondOps.length - 1]; // last addend
        const correctSum = (nGuess * (nGuess + 1)) / 2;  // n*(n+1)/2
        return getVarHint(
          `"${exprMatches[0][0]}" — Mudhal step thappu!<br>Neenga ${firstOps[0]}-la irunthu start pannirukinga — aana sum accumulation <b>0-la irunthu</b> start aaganum.<br>Correct mudhal step: <b>0+1=1</b> (accumulated sum 0, add 1, get 1)<br>Neenga panna final answer ${userFinalResult} — correct answer N=5 ku <b>${correctSum}</b>.`,
          `First step wrong! Sum initially <b>0</b> — so first step must be 0+1=1, not ${firstOps[0]}+1=${firstOps[0]+1}. ${firstOps[0]}-la irunthu start panna answer off aagum!`,
          `Fix: mudhal step <b>0+1=1</b> nu ezhuthunga. 0 thaan sum initial value.`
        );
      }

      // Second operands should be 1, 2, 3, 4, 5... (consecutive)
      const isConsecutive = secondOps.every((v, i) => i === 0 || v === secondOps[i-1] + 1);
      if (!isConsecutive) {
        const badIdx = secondOps.findIndex((v, i) => i > 0 && v !== secondOps[i-1] + 1);
        const expected = secondOps[badIdx - 1] + 1;
        return getVarHint(
          `"${exprMatches[badIdx][0]}" — Operand thappu!<br>Neenga add panna number <b>${secondOps[badIdx]}</b> — aana antha step-la <b>${expected}</b> add panna vendum.<br>Consecutive numbers (1,2,3,4,5...) add pannanum.`,
          `Step ${badIdx+1}-la wrong number! ${secondOps[badIdx]} illai, <b>${expected}</b> add pannanum.`,
          `Pattern: add 1, then 2, then 3... E.g.: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15.`
        );
      }

      // Result of each step must equal first operand of next step (chain check)
      const chainBrokenIdx = results.findIndex((r, i) => i < results.length - 1 && r !== firstOps[i+1]);
      if (chainBrokenIdx !== -1) {
        const expected = results[chainBrokenIdx];
        return getVarHint(
          `"${exprMatches[chainBrokenIdx+1][0]}" — Chain thappu!<br>Previous step result <b>${expected}</b> — next step first number also <b>${expected}</b> aaga vendum.<br>E.g.: 0+1=<b>1</b>, apram <b>1</b>+2=3, apram <b>3</b>+3=6...`,
          `Step result chain thappu! ${expected}-la result vandhu → next step-la ${expected}-la start aaganum.`,
          `Chain: each step's result = next step's first number. E.g.: 0+1=1 → 1+2=3 → 3+3=6...`
        );
      }

      // --- All expressions correct so far — guide to next step ---
      const lastResult   = results[results.length - 1];
      const nextAddend   = secondOps[secondOps.length - 1] + 1;
      const stepsDone    = exprMatches.length;

      // Try to detect N from the text (e.g. "5 numbers", "1 to 5", "N=5")
      const nMatch = ut.match(/(\d+)\s*numbers?|1\s*to\s*(\d+)|n\s*=\s*(\d+)/i);
      const nValue = nMatch ? parseInt(nMatch[1] || nMatch[2] || nMatch[3]) : null;

      // Accept as correct if: range mentioned AND all N steps done, OR ≥5 correct steps
      const enoughSteps = (nValue && stepsDone >= nValue) || stepsDone >= 5;

      if (enoughSteps) {
        return "Excellent logic! Sum of N Numbers-oda process correct ah explain pannitinga. ✔";
      }

      // Guide to next step — Socratic (don't give answer directly)
      return getVarHint(
        `Step ${stepsDone} correct! Current result = <b>${lastResult}</b><br>Ippo aduthu enna seivom? ${lastResult}-la <b>${nextAddend}</b> koottanom illaya?<br>Enna varum? Yosiyunga — ezhuthi parunga!`,
        `${lastResult} irukku — aduthu ${nextAddend}-ai koottuvom. Enna varum? Kalkulate panni ezhuthunga.`,
        `Next step: <b>${lastResult} + ${nextAddend} = ?</b> — Answer-ai yosichu ezhuthunga.`
      );
    }


    // ── No expressions — check for text-based logic ──

    // Tier 0: Just problem title
    const isProblemTitle = /^(sum\s*of\s*(n|number|num)\s*(numbers?|na|nu)?\.?\s*|find\s*(sum|total)\s*of\s*(n|number)\s*numbers?\s*)$/i.test(ut.trim());
    if (isProblemTitle) {
      return getVarHint(
        `"${ut.trim()}" — ithu problem peyar! Aana <b>eppadi</b> solve pannuvom nu sollavum.<br>N=5 na, 1,2,3,4,5 — intha numbers-ai enna seivom? Yosiyunga.`,
        `Problem title ezhuthiteenga! HOW-ah sollanum. N=5 na, eppadi 15 varum?`,
        `Process: 1-la irunthu N varaikkum oru-oru number-ai + pannaa sum kidaikkum. Adhai ezhuthunga.`
      );
    }

    const hasPlusOp = /(\+|plus|add|kootu|koot|seirni|cherki|koottikko|addition)/i.test(ut);
    const hasRange  = /(1\s*(to|muthal|la irunthu|iruntu)\s*[n5\d]|[n5\d]\s*varai|upto\s*[n\d]|till\s*[n\d]|from\s*1|n\s*numbers?|each\s*number|one\s*by\s*one|step\s*by\s*step)/i.test(ut);
    const hasResult = /(sum|total|result|answer|kidaikkum|varum|vandhu|find|calculate|output|kootal)/i.test(ut);

    if (hasPlusOp && hasRange) {
      return "Excellent logic! Sum of N Numbers-oda process correct ah explain pannitinga. ✔";
    }
    if (hasRange && !hasPlusOp) {
      return getVarHint(
        `"${ut.slice(0,60)}" — Range correct! Aana enna <b>operation</b> seivom?<br>1 to N varaikkum ellaa numbers-ai enna panna vendum?<br>👉 A) kuraikkanum(-) &nbsp; B) koottanum(+) &nbsp; C) ponnaam(*)<br>Correct operation-ah choose panni ezhuthunga.`,
        `Range irukku! Aana operation missing. Numbers-ai <b>koottanum(+)</b> illaya kerikanum(-)?`,
        `Operation '+' use pannanum. "1 to N varaikkum ellaa numbers + pannaa sum kidaikkum" nu ezhuthunga.`
      );
    }
    if (hasPlusOp && !hasRange) {
      return getVarHint(
        `"${ut.slice(0,60)}" — '+' operation correct!<br>Aana <b>enga irunthu enga varaikkum</b> + pannuvom?<br>👉 A) 1 to 5 &nbsp; B) 1 to N &nbsp; C) N to N<br>Correct range-ah choose panni ezhuthunga.`,
        `'+' operation ok! Range missing. Enga irunthu enga varaikkum add pannuvom?`,
        `Range: "1 muthal N varaikkum" + pannuvom. "1 to N varaikkum ellaa numbers koottuvom" nu ezhuthunga.`
      );
    }
    if (hasResult && !hasPlusOp && !hasRange) {
      return getVarHint(
        `"${ut.slice(0,60)}" — result/sum pathi ezhutheenga. Aana <b>eppadi</b> kidaikkum?<br>Enna operation? Enga irunthu enga varaikkum?`,
        `"Sum kidaikkum" nu sonneenga! Aana process enna? 1 to N varaikkum enna seivom?`,
        `Process: "1 to N varaikkum ellaa numbers-ai + pannaa sum varum" nu explain pannunga.`
      );
    }

    // ── Default: User completely lost — give "how to start" hint ──
    return getVarHint(
      `Eppadi start panurathu theriyalaiya?<br>Mudhal oru simple example yosichu paarunga:<br><b>N = 5</b> na, numbers: 1, 2, 3, 4, 5<br>Intha numbers-ai enna seivom? Yosiyunga.`,
      `Start hint: N=5 na, 1,2,3,4,5 irukku. Intha numbers-ai ellam <b>+ pannaa</b> sum kidaikkum. Eppadi + pannuvom?`,
      `Example step by step: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15 — ippadi ezhuthi parunga!`
    );
  }


  // ═══════════════════════════════════════════════════════════════
  // SECTION: RECIPE  (pseudocode steps, 4 steps expected)
  // ═══════════════════════════════════════════════════════════════
  if (section === "recipe") {
    if (!ut || lines.length === 0) {
      if (logicContent) {
        return getVarHint(
          `Neenga Logic-la '<b>${logicContent.slice(0,60)}</b>' nu ezhuthirukinga. Athai eppadi step-by-step ah code-la kondu varuvathu? Mudhal step enna thevai?`,
          `Logic section-la sonnapadi '<b>${logicContent.slice(0,60)}</b>' panna, mudhal step aaga namma enna vaanganum?`,
          `'<b>${logicContent.slice(0,60)}</b>' - ithai seiya, first step aaga N value vaanganum illaya? Adhai ezhuthunga.`
        );
      }
      if (hintLevel === 1) return "Empty ah irukku! Recipe-ah neengale step-by-step ah yosichu ezhutha try pannunga.";
      return getVarHint(
        "Empty ah irukku! Recipe-ah step-by-step ah ezhuthunga.<br>Mudhal step: N value vaangu-nu ezhuthunga.",
        "Onnum illaye! Mudhal step-ai yosiyunga: N value-ai eppadi vaanguvathu?",
        "Blank ah irukku! Step 1: N value vaangu, apdi start pannunga."
      );
    }

    // Extract user-defined variable name from Step 1 (e.g. 'use variable a' → 'a')
    const userVarMatch = rawUt.match(/(?:use\s+)?(?:variable|var|let|const)\s+([a-zA-Z]\w*)|([a-zA-Z])\s*(?:variable|=)/i);
    const userVarName = (userVarMatch ? (userVarMatch[1] || userVarMatch[2]) : "n") || "n";

    // Step 1: Get N
    const step1Ok = /(get|read|take|vaangu|input|enter|n\s*value|n\s*vaangu|n\s*=|number|eduthu|kelunga|kettu|ask|user.*ku|user.*give|user.*type|oru.*value|padi|padichedu|kelu|kudu|receive|accept|obtain|use.*variable|variable)/i.test(lines[0]);
    if (!step1Ok) {
      if (logicContent) {
        return getVarHint(
          `Line 1 la thappu! Neenga ezhuthiyathu: "${rawLines[0]}"<br>Logic-la '<b>${logicContent.slice(0,60)}</b>' panna, mudhal step aaga namma N value-ai vaanganum illaya? Adhai ezhuthunga.`,
          `Line 1 la thappu! Neenga ezhuthiyathu: "${rawLines[0]}"<br>Step 1-la N value ah vaangu nu ezhuthunga.`
        );
      }
      return `Line 1 la thappu! Neenga ezhuthiyathu: "${rawLines[0]}"<br>Step 1-la N value ah vaangu nu ezhuthunga. E.g.: "Get the value of N" or "N value vaangu".`;
    }

    // Step 2: Initialize sum = 0
    if (lines.length < 2) {
      if (logicContent) {
        return getVarHint(
          `Step 1 correct! "${rawLines[0]}" — N vaangiyachu.<br>Logic-la '<b>${logicContent.slice(0,60)}</b>' nu sonneenga illaya? Adhai seiya adutha step aaga sum-ai 0 nu initialize pannum step thevai. Adhai ezhuthunga.`,
          `Step 1 correct! "${rawLines[0]}" — N vaangiyachu.<br>Aduthu Step 2: Sum-ah 0 aaga initialize panna step ezhuthunga.`
        );
      }
      return `Step 1 correct! "${rawLines[0]}" — N vaangiyachu.<br>Aduthu Step 2: Sum-ah 0 aaga initialize panna step ezhuthunga. E.g.: "sum = 0 set pannu".`;
    }
    // Step 2: Extract sum variable name + validate
    const step2VarEarlyMatch = lines.slice(0,3).join(" ").match(/(sum|total|result|count|kootal|s|ans|answer)\s*(?:variable)?\s*[=:]/i);
    const sumVarName = step2VarEarlyMatch ? step2VarEarlyMatch[1].toLowerCase() : "sum";

    const step2Ok = /(sum|total|result|count|kootal|vilai|value|answer|ans|s|kootu)\s*(=\s*0|variable\s*=\s*0|variable=0|initialize|set|zero|start|padu|vaiku|la\s*0|to\s*0|as\s*0|aga\s*0|aaga\s*0)|((initialize|set|declare|start|begin|vaiku|padu)\s*(sum|total|result|count|kootal|vilai|value|answer))|(sum|total|result|count|kootal)\s*to\s*0|(0\s*(la|nu|aaga|set|le)\s*(start|vaiku|padu|initialize))|(start.*0|0.*start|zero.*set|set.*zero|0\s*aaga|kootal.*start|count.*0)/i.test(lines[1]);
    if (!step2Ok) {
      if (logicContent) {
        return getVarHint(
          `Line 2 la thappu! Neenga ezhuthiyathu: "${rawLines[1]}"<br>'<b>${logicContent.slice(0,60)}</b>' panna, munbaaga sum-ai 0 endru set panna vendum. Adhai ezhuthunga.`,
          `Line 2 la thappu! Neenga ezhuthiyathu: "${rawLines[1]}"<br>Step 2-la sum variable-ah 0 aaga initialize panna sollanum. E.g.: "sum = 0 nu set pannu".`
        );
      }
      return `Line 2 la thappu! Neenga ezhuthiyathu: "${rawLines[1]}"<br>Step 2-la sum variable-ah 0 aaga initialize panna sollanum. E.g.: "Initialize sum = 0" or "sum = 0 nu set pannu".`;
    }

    // Step 3: Loop and add
    if (lines.length < 3) {
      if (logicContent) {
        return getVarHint(
          `Step 2 correct! "${rawLines[1]}" — sum initialized.<br>Ippo '<b>${logicContent.slice(0,60)}</b>' ithai seyalpadutha, oru loop thevai illaya? Loop panni add pannum step-ai ezhuthunga.`,
          `Step 2 correct! "${rawLines[1]}" — sum initialized.<br>Aduthu Step 3: 1 to N varaikkum loop panni each number-ah sum-la add pannum step ezhuthunga.`
        );
      }
      return `Step 2 correct! "${rawLines[1]}" — sum initialized.<br>Aduthu Step 3: 1 to N varaikkum loop panni each number-ah sum-la add pannum step ezhuthunga.`;
    }
    // Step 3: Repeat and add — no programming keywords needed, just the concept
    const allRecipeText = lines.join(" ");
    const step3HasLoop  = /(loop|for|repeat|iterate|thirumba|oru.*oru|each|every|run|go.*through|1.*n|n.*1|range|varaikkum|varai|muthal|koottanum|add.*each|each.*add|thodarndhu|continuous|eppovum|ellaa.*number|number.*ellam|one.*by.*one|step|turn|round|pass)/i.test(lines[2]);
    const step3HasAdd   = /(add|koot|plus|sum|kootu|\+|collect|gather|accumulate|seirnu|seir|cher|cherki|koottikko|calculate|count)/i.test(lines[2]);
    const step3HasRange = /(1\s*to\s*[n\d]+|[n\d]+\s*varai|1\s*muthal|start.*end|1\s*from|n.*number|n.*varaikkum|1.*start|start.*1|n.*end|end.*n)/i.test(lines[2]);

    // ── Ingredients / field format detection ──
    // Detects ALL variations:
    //   for loop(start,end,next) | for(start,end,next) | for loop + start:/end:/next: lines
    //   for   start 4, end, next  ← new: "for" + "start" + "end" + "next" keywords
    const hasForKeyword   = /\bfor\b/i.test(lines[2] || "");
    const hasStartEndNext = /\bstart\b/i.test(allRecipeText) &&
                            /\bend\b/i.test(allRecipeText) &&
                            /\bnext\b/i.test(allRecipeText);
    const hasIngredientLoop = hasForKeyword && (
      /for\s*(loop\s*)?\(/i.test(allRecipeText) ||   // for( or for loop(
      /for\s*loop/i.test(allRecipeText) ||            // "for loop" keyword
      /start\s*[=:]/i.test(allRecipeText) ||          // start: or start= line
      hasStartEndNext                                  // start + end + next anywhere
    );

    if (hasIngredientLoop) {
      const s = sumVarName;   // e.g. "sum"
      const v = userVarName;  // e.g. "a"

      // Helper: is a token just a keyword placeholder (not a real value)?
      const isPlaceholder = (t) => !t || /^(start|end|next|value|here|condition|step|stArt)$/i.test(t.trim());

      // Parse paren content: for loop(X; Y; Z) or for(X, Y, Z)
      const parenRaw   = rawUt.match(/for\s*(?:loop\s*)?\(([^)]*)\)/i);
      const parenParts = parenRaw ? parenRaw[1].trim().split(/[;,]+/).map(p => p.trim()).filter(Boolean) : [];
      // Also try inline format: "for   start 4, end, next" → split by comma
      // Extract the for-line and split its parts after "for"
      const forLineRaw = rawUt.split('\n').find(l => /^\s*for\b/i.test(l)) || "";
      const forInlineParts = forLineRaw
        .replace(/^\s*for\s*(loop)?\s*/i, '')   // remove "for" / "for loop"
        .replace(/[()]/g, '')                    // remove parens
        .split(/[,;]+/)                          // split by comma/semicolon
        .map(p => p.trim()).filter(Boolean);

      // ── START field ──
      // Priority: paren parts → inline for-line parts → multiline start: line
      let startText = "";
      if (parenParts[0] && !isPlaceholder(parenParts[0])) {
        startText = parenParts[0];
      } else if (forInlineParts[0] && !isPlaceholder(forInlineParts[0].replace(/^start\s*/i,'').trim())) {
        // e.g. "start 4" → value is "4" (but "start" alone is placeholder)
        const raw = forInlineParts[0].replace(/^start\s*/i,'').trim();
        startText = raw || "";
      } else {
        const m = rawUt.match(/^[ \t]*start\s*[=:]\s*(.+)$/im);
        startText = m ? m[1].trim() : "";
      }
      const startHasI = /\bi\s*=\s*1\b|i\s*=\s*1/i.test(startText);

      if (!startHasI) {
        const show = startText || (parenParts[0] ? `"${parenParts[0]}"` : "blank");
        return getVarHint(
          `for loop — start field: <b>${show}</b><br>Loop-ku oru <b>variable peyar</b> thevai! Convention-ah <b>i</b> nu peyar vaipom.<br>Start position-la <b>i = 1</b> nu ezhuthunga.`,
          `start field-la loop variable declare pannanum! <b>i = 1</b> nu ezhuthunga.`,
          `start: <b>i = 1</b> — ithai ezhuthunga. i thaan loop-oda counter.`
        );
      }

      // ── END field ──
      let endText = "";
      if (parenParts[1] && !isPlaceholder(parenParts[1])) {
        endText = parenParts[1];
      } else if (forInlineParts[1] && !isPlaceholder(forInlineParts[1].replace(/^end\s*/i,'').trim())) {
        endText = forInlineParts[1].replace(/^end\s*/i,'').trim();
      } else {
        const m = rawUt.match(/^[ \t]*end\s*[=:]\s*(.+)$/im);
        endText = m ? m[1].trim() : "";
      }
      const endHasCondition = new RegExp(`i\\s*<=?\\s*(${v}|n)|i\\s*<\\s*(${v}|n)`, 'i').test(endText);
      const endHasOnlyVar   = new RegExp(`^(${v}|n)$`, 'i').test(endText);

      if (!endText) {
        return getVarHint(
          `start: i=1 ✔ correct!<br>Ippo <b>end</b> field — loop <b>enga varai</b> run aaganum?<br>👉 A) i &lt;= ${v} &nbsp; B) i &lt; ${v} &nbsp; C) i = ${v}<br>Correct condition-ah choose panni ezhuthunga.`,
          `end field blank! Loop end condition thevai. <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end: <b>i &lt;= ${v}</b> — ithai ezhuthunga. Loop i &lt;= ${v} varaikkum run aagum.`
        );
      }
      if (endHasOnlyVar && !endHasCondition) {
        return getVarHint(
          `end: "${endText}" — Ithu just variable name! Loop end-ku <b>condition</b> thevai.<br>👉 A) i &lt;= ${v} &nbsp; B) i &lt; ${v} &nbsp; C) i = ${v}<br>Correct condition ezhuthunga.`,
          `Condition missing! end field-la <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end: <b>i &lt;= ${v}</b> — condition ezhuthunga.`
        );
      }
      if (!endHasCondition) {
        return getVarHint(
          `end: "${endText}" — Format thappu!<br>Loop condition: <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end field: <b>i &lt;= ${v}</b> format-la ezhuthunga.`,
          `end: i &lt;= ${v} — correct condition.`
        );
      }

      // ── NEXT field ──
      let nextText = "";
      if (parenParts[2] && !isPlaceholder(parenParts[2])) {
        nextText = parenParts[2];
      } else if (forInlineParts[2] && !isPlaceholder(forInlineParts[2].replace(/^next\s*/i,'').trim())) {
        nextText = forInlineParts[2].replace(/^next\s*/i,'').trim();
      } else {
        const m = rawUt.match(/^[ \t]*next\s*[=:]\s*(.+)$/im);
        nextText = m ? m[1].trim() : "";
      }
      const nextHasIncr    = /i\+\+|\+\+i|i\s*=\s*i\s*\+\s*1/i.test(nextText);
      const nextHasDecr    = /i--|--i|i\s*=\s*i\s*-\s*1/i.test(nextText);
      // Detect wrong variable in increment: start++, a++, n++ etc. (not i)
      const nextWrongVar   = /\b(?!i\b)([a-z]\w*)\s*\+\+/i.test(nextText);
      const nextWrongVarName = (nextText.match(/\b(?!i\b)([a-z]\w*)\s*\+\+/i) || [])[1] || "";

      if (!nextText) {
        return getVarHint(
          `end: i&lt;=${v} ✔ correct!<br>Ippo <b>next</b> field — ovvoru loop turn-laiyum i-ah eppadi <b>change</b> seivom?<br>👉 A) i-- &nbsp; B) i++ &nbsp; C) i = i + 2<br>Correct option choose panni ezhuthunga.`,
          `next field blank! Loop counter-ai increase panna <b>i++</b> nu ezhuthunga.`,
          `next: <b>i++</b> — ithai ezhuthunga. Ovvoru loop turn-laiyum i one step increase aagum.`
        );
      }
      if (nextHasDecr) {
        return getVarHint(
          `next: "${nextText}" — i-- (decrease) panringa!<br>Sum of N numbers-ku 1-la irunthu N varaikkum <b>increase</b> pannanum.<br>i-- illai, <b>i++</b> use pannanum.`,
          `i-- wrong! 1 to N count panna <b>i++</b> use pannanum.`,
          `next: <b>i++</b> — i++ means i increases by 1 each step.`
        );
      }
      if (nextWrongVar) {
        return getVarHint(
          `next: "${nextText}" — Variable peyar thappu!<br>Loop counter variable peyar <b>i</b> — neenga <b>${nextWrongVarName}</b> use pannirukinga.<br><b>i++</b> nu ezhuthunga — loop ovvoru step-um i-ah one increase panna.`,
          `"${nextWrongVarName}++" wrong! Loop counter variable <b>i</b> — so <b>i++</b> nu ezhuthunga.`,
          `next: <b>i++</b> — start: la i=1 declare pannineengala? So next-la i++ use pannanum.`
        );
      }
      if (!nextHasIncr) {
        return getVarHint(
          `next: "${nextText}" — Format correct illai!<br>Loop counter i-ai eppadi increase pannuvom?<br>👉 A) i-- &nbsp; B) i++ &nbsp; C) i = i + 2<br>Correct choose panni ezhuthunga.`,
          `next field: <b>i++</b> nu ezhuthunga. Ovvoru step-um i one-ah increase aaganum.`,
          `next: <b>i++</b> — ithai ezhuthunga.`
        );
      }


      // ── LOOP BODY operation: sum = sum + i ──
      const hasCorrectOp = new RegExp(
        `${s}\\s*[+]=\\s*i|${s}\\s*=\\s*${s}\\s*[+]\\s*i|sum\\s*[+]=\\s*i|sum\\s*=\\s*sum\\s*[+]\\s*i`, 'i'
      ).test(allRecipeText);
      const hasWrongOp = new RegExp(
        `${s}\\s*[-*\/]=\\s*i|${s}\\s*=\\s*${s}\\s*[-*\/]\\s*i`, 'i'
      ).test(allRecipeText);
      const anyOp = new RegExp(
        `${s}\\s*[+\\-*\/]=\\s*i|${s}\\s*=\\s*${s}\\s*[+\\-*\/]\\s*i`, 'i'
      ).test(allRecipeText);

      // Detect wrong variable in body: sum=sum+start (should be sum=sum+i)
      const bodyWrongVarMatch = allRecipeText.match(
        new RegExp(`${s}\\s*=\\s*${s}\\s*[+]\\s*((?!i\\b)[a-zA-Z]\\w*)`, 'i')
      );
      const bodyWrongVar = bodyWrongVarMatch && !hasCorrectOp;
      const bodyWrongVarName = bodyWrongVarMatch ? bodyWrongVarMatch[1] : "";

      if (hasWrongOp) {
        return getVarHint(
          `Loop structure ✔ correct!<br>Aana loop body-la operation thappu! <b>'+'</b> use pannanum.<br>✔ Correct: <b>${s} = ${s} + i</b> or <b>${s} += i</b>`,
          `Wrong operation! '+' use pannanum. ${s} = ${s} + i nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b> — correct. Thappaana operator maathunga.`
        );
      }
      if (bodyWrongVar) {
        return getVarHint(
          `"${s} = ${s} + ${bodyWrongVarName}" — Variable thappu!<br>Loop counter variable peyar <b>i</b> — neenga <b>${bodyWrongVarName}</b> use pannirukinga.<br>Loop ulla <b>${s} = ${s} + i</b> nu ezhuthunga.`,
          `"${bodyWrongVarName}" wrong variable! Loop counter <b>i</b> — so <b>${s} = ${s} + i</b> nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b> — "i" thaan loop counter, not "${bodyWrongVarName}".`
        );
      }
      if (!anyOp) {
        return getVarHint(
          `for loop (i=1; i&lt;=${v}; i++) ✔ complete!<br>Ippo loop <b>ulla enna seivom</b>? Ovvoru i-yum sum-la kooduvathu thaan goal.<br>👉 A) ${s} - i &nbsp; B) ${s} = ${s} + i &nbsp; C) ${s} * i<br>Correct operation ezhuthunga.`,
          `Loop ok! Aana loop body operation missing. ${s} = ${s} + i nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b> — ithai loop-ulla ezhuthunga.`
        );
      }

      // ── PRINT — must print the SUM variable, not the input variable ──
      const hasPrint = /(print|display|output|show|console\.?log|kaatu|kaattu|sollu)/i.test(allRecipeText);
      // Check if user is printing the correct variable (sum) vs wrong one (a / input)
      const printsSumVar  = new RegExp(`(print|display|output|show|console\.?log)\\s*\\(?\\s*(${s}|sum|result|answer)`, 'i').test(allRecipeText);
      const printsWrongVar = new RegExp(`(print|display|output|show|console\.?log)\\s*\\(?\\s*(${v}\\b)`, 'i').test(allRecipeText) && !printsSumVar;

      if (!hasPrint) {
        return getVarHint(
          `${s} = ${s} + i ✔ correct operation!<br>Loop mudinjatu. Ippo final step: <b>'${s}'</b> result-ai user-ku kaata enna seivom?<br>👉 A) Variable &nbsp; B) Print command &nbsp; C) Loop<br>Correct choose panni ezhuthunga.`,
          `Operation correct! Final step: '${s}' result-ai <b>print</b>/<b>display</b> panna step ezhuthunga.`,
          `Last step: <b>print ${s}</b> or <b>display ${s}</b> nu ezhuthunga.`
        );
      }
      if (printsWrongVar) {
        return getVarHint(
          `print(<b>${v}</b>) — Thappu variable print panringa!<br>'<b>${v}</b>' thaan user input — antha value-ah print pannideenga.<br>Namma calculate panna <b>'${s}'</b> (sum)-ah print pannanum.<br>👉 <b>print ${s}</b> or <b>console.log(${s})</b> nu ezhuthunga.`,
          `Wrong! '<b>${v}</b>' input variable — aana print pannanum <b>'${s}'</b> (sum result). console.log(<b>${s}</b>) nu ezhuthunga.`,
          `print <b>${s}</b> — sum result print pannanum, not input variable <b>${v}</b>.`
        );
      }

      return "Excellent! All steps are correct.";
    }


    // Structured pattern: for loop + start:1 + end:var + next step:++
    const step3HasStart     = /(start\s*[=:]\s*1|begins?\s*(at|from)?\s*1|1\s*la\s*start|from\s*1)/i.test(allRecipeText);
    const step3HasEnd       = new RegExp(`end\\s*[=:]\\s*(n|${userVarName})|upto\\s*(n|${userVarName})|till\\s*(n|${userVarName})|to\\s*(n|${userVarName})|(n|${userVarName})\\s*varai|i\\s*<=?\\s*(n|${userVarName})`, 'i').test(allRecipeText);
    const step3HasIncrement = /(next\s*step\s*[=:]\s*[\+\-]{2}|next\s*[=:]\s*i\+\+|i\+\+|i--|increment|\+\+|--)/i.test(allRecipeText);
    const step3StructuredOk = step3HasLoop && step3HasStart && step3HasEnd && step3HasIncrement;
    const step3Ok = (step3HasLoop && step3HasAdd) || step3StructuredOk;

    if (!step3Ok) {
      // Structured format partially correct — give targeted hints
      if (step3HasLoop && step3HasStart && step3HasEnd && !step3HasIncrement) {
        return getVarHint(
          `"${rawLines[2]}" — Start & end ok! Aana 'next step' missing. Loop ovvoru turn-laiyum i-ah eppadi change seivom? (++ or --?)`,
          `For loop-la next step thevai! i++ or i-- nu mention pannunga.`,
          `"${rawLines[2]}" — next step: ++ ezhuthunga. E.g.: "for loop, start:1, end:N, next step:++".`
        );
      }
      if (step3HasLoop && step3HasStart && !step3HasEnd) {
        return getVarHint(
          `"${rawLines[2]}" — Start ok! Aana loop <b>enga end</b> aaganum? N-la end aaganum nu mention pannunga.`,
          `Start point ok, end missing. "end:N" or "till N" nu ezhuthunga.`,
          `"${rawLines[2]}" — end:N mention pannunga. E.g.: "for loop, start:1, end:N, next step:++".`
        );
      }
      if (step3HasLoop && !step3HasStart && step3HasEnd) {
        return getVarHint(
          `"${rawLines[2]}" — End point irukku! Aana loop <b>enga irunthu</b> start aaganum? 1-la start aaganum nu mention pannunga.`,
          `End ok, start missing. "start:1" or "from 1" nu ezhuthunga.`,
          `"${rawLines[2]}" — start:1 mention pannunga. E.g.: "for loop, start:1, end:N, next step:++".`
        );
      }
      if (step3HasLoop && step3HasAdd && !step3HasRange) {
        // Loop + add mentioned but no range
        return getVarHint(
          `Loop panni add panradu correct! Aana edhu varai (range) kootanum nu sollalai.<br>"${rawLines[2]}" — Loop 1-la start aaguthu, N-la end aaguthu illaya? Athai ezhuthunga.`,
          `Step 3-la range missing! Loop 1-la start aagi N-la mudithu, oru-oru number kootanum. Edhu varai nu specify pannunga.`,
          `"${rawLines[2]}" — Loop 1 to N varaikkum nu range sollanum. E.g.: "1 to N varai loop panni add pannu".`
        );
      }
      if (step3HasLoop && !step3HasAdd) {
        // Loop mentioned but no add
        return getVarHint(
          `"${rawLines[2]}" — Loop irukku, aana loop ulla enna seivom? Oru-oru number-aiyum sum-la koottanum illaya? Adhai ezhuthunga.`,
          `Loop ok, aana addition missing! Each number-aiyum sum-kooda kootum step-ai mention pannunga.`,
          `Step 3-la loop panni each number add panra step sollanum. E.g.: "Loop 1 to N, sum-la add pannu".`
        );
      }
      if (logicContent) {
        return getVarHint(
          `Line 3 la thappu! Neenga ezhuthiyathu: "${rawLines[2]}"<br>'<b>${logicContent.slice(0,60)}</b>' itharku loop use panni 1 to N varai sum-la add pannum step ezhuthunga.`,
          `Line 3 la thappu! Neenga ezhuthiyathu: "${rawLines[2]}"<br>Step 3-la loop use panni 1 to N numbers-ah sum-la add panra step ezhuthunga.`
        );
      }
      return `Line 3 la thappu! Neenga ezhuthiyathu: "${rawLines[2]}"<br>Step 3-la loop use panni 1 to N numbers-ah sum-la add panra step ezhuthunga.<br>E.g.: "Loop 1 to N, sum = sum + i" or "1 muthal N varai loop panni add pannu".`;
    }
    // ─── Step 3.5: Loop body check (only when structured format used) ───
    if (step3StructuredOk) {
      const v = userVarName;  // user's variable e.g. 'a'
      const s = sumVarName;   // sum variable e.g. 'sum'

      // Detect ANY assignment operation on sumVar (correct or wrong)
      const anyOpAttempt = new RegExp(
        `${s}\\s*[+\\-*\\/]=\\s*\\w+|${s}\\s*=\\s*${s}\\s*[+\\-*\\/]`,
        'i'
      ).test(allRecipeText);

      // Detect CORRECT operation: sum = sum + a, sum += a, sum = sum + i, sum += i
      const hasCorrectOp = new RegExp(
        `${s}\\s*[+]=\\s*(${v}|i|j|num|counter)|` +
        `${s}\\s*=\\s*${s}\\s*[+]\\s*(${v}|i|j|num|counter)|` +
        `sum\\s*[+]=|sum\\s*=\\s*sum\\s*[+]`,
        'i'
      ).test(allRecipeText);

      // Detect WRONG operation: sum -= a, sum *= a, sum = sum - a, etc.
      const hasWrongOp = new RegExp(
        `${s}\\s*[-*\\/]=\\s*(${v}|i|j)|` +
        `${s}\\s*=\\s*${s}\\s*[-*\\/]\\s*(${v}|i|j)`,
        'i'
      ).test(allRecipeText);

      if (!anyOpAttempt && !hasCorrectOp) {
        // No operation written at all — ask what to write
        return getVarHint(
          `Loop structure (start=1, end=<b>${v}</b>, next step=++) ✔ correct!<br>Aana loop <b>ulla enna operation</b> pannuvom?<br>Neenga '<b>${v}</b>' varaikkum loop potta, oru-oru number-ai '<b>${s}</b>'-la koottanum.<br>👉 A) ${s} - ${v} &nbsp; B) ${s} = ${s} + ${v} &nbsp; C) ${s} * ${v}<br>Correct operation-ah choose panni loop-ulla ezhuthunga.`,
          `Loop ok! Aana loop ulla '<b>${s}</b>'-ah update panna operation missing.<br>Ovvoru step-um '<b>${s}</b>'-la koottu — enna operator seivom?`,
          `Loop body missing! "${s} = ${s} + ${v}" or "${s} += ${v}" nu loop-ulla ezhuthunga.`
        );
      }

      if (hasWrongOp) {
        // Wrong operation written — tell them to fix it
        return getVarHint(
          `Loop body-la operation thappu! '<b>${s}</b>'-la numbers-ai minus/multiply pannirukinga.<br>Sum edukka '<b>+</b>' operator use pannanum.<br>✔ Correct: "${s} = ${s} + ${v}" or "${s} += ${v}"`,
          `Wrong operation! Sum edukka koottanum (add). '-' or '*' illamal '+' use pannunga.`,
          `"${s} += ${v}" — correct operation. Thappaana operator-ai maathunga.`
        );
      }

      // Correct operation is written — now check for print
      const hasPrintAfterBody = /(print|display|output|show|console|kaatu|kaattu|sollu)/i.test(allRecipeText);
      if (!hasPrintAfterBody) {
        return getVarHint(
          `"${s} = ${s} + ${v}" ✔ correct operation!<br>Ippo final step: '<b>${s}</b>' result-ai user-kku kaata enna thevai?<br>👉 A) Variable &nbsp; B) Print command &nbsp; C) Loop<br>Correct-ah choose panni ezhuthunga.`,
          `Operation correct! Final step: '<b>${s}</b>'-ai screen-la kaata oru command thevai. Athai ezhuthunga.`,
          `Last step: "print ${s}" or "display ${s}" nu ezhuthunga.`
        );
      }

      // Loop body + print both present — all correct!
      return "Excellent! All steps are correct.";
    }


    // Step 4: Print result
    if (lines.length < 4 && !step3StructuredOk) {
      if (logicContent) {
        return getVarHint(
          `Step 3 correct! "${rawLines[2]}" — loop add step ok.<br>'<b>${logicContent.slice(0,60)}</b>' ellaam mudintha piragu, final aaga sum-ai print panna vendum illaya? Adhai ezhuthunga.`,
          `Step 3 correct! "${rawLines[2]}" — loop add step ok.<br>Last step: Final sum result-ah print/display pannum step ezhuthunga.`
        );
      }
      return `Step 3 correct! loop add step ok.<br>Last step: Final '${sumVarName}' result-ah print/display pannum step ezhuthunga.`;
    }
    // If structured format - check print even if step 4 not separate line yet
    if (step3StructuredOk && lines.length < 5) {
      const hasPrintInAll = /(print|display|output|show|console|kaatu|kaattu|sollu)/i.test(allRecipeText);
      if (!hasPrintInAll) {
        return getVarHint(
          `Loop body correct! Ippo final step: '${sumVarName}' result-ai user-kku kaata enna thevai?<br>👉 A) Variable &nbsp; B) Print command &nbsp; C) Loop<br>Correct-ah choose panni print step ezhuthunga.`,
          `Loop complete! Enna final '${sumVarName}'-ai print panna oru step ezhuthunga.`,
          `Last step: 'print ${sumVarName}' or 'display ${sumVarName}' nu ezhuthunga.`
        );
      }
    }
    // Extract the sum variable name the user defined in Step 2
    const step2VarMatch = lines.slice(0,3).join(" ").match(/(sum|total|result|count|s|ans|answer)/i);
    const sumVarDefined = (step2VarMatch ? step2VarMatch[1].toLowerCase() : null) || sumVarName;

    // Step 4: Show result — for structured format check all lines, else just lines[3]
    const step4Source = step3StructuredOk ? allRecipeText : (lines[3] || "");
    const step4HasPrintWord = /(print|display|output|show|console|kaatu|kaattu|sollu|vilai\s*kaatu|result.*kaatu|kaatiduvom|screen|notify|write|present|reveal|paakalam|theriyum|theriyapaduthu|sollunga|solli|report)/i.test(step4Source);
    const step4HasSumVar = /(sum|total|result|count|kootal|vilai|answer|ans|final|output|kidaithath|kidaitha|vantha|vandhath)/i.test(step4Source);
    const step4HasWrongNumber = /\b(print|display|output|show)\s+\d+\b|\b\d+\s+(print|display|show)\b/i.test(step4Source);
    const step4Ok = step4HasPrintWord || step4HasSumVar;


    if (!step4Ok) {
      if (step4HasPrintWord && step4HasWrongNumber) {
        // They said "print 0" or "display 15" - direct number, not variable
        return getVarHint(
          `"${rawLines[3]}" — Neenga oru number-ai print panrathaga sonneenga!<br>Number illai, Step 2-la neengale define panna '${sumVarDefined}' variable-ai print pannanum. Variable peyrai ezhuthunga.`,
          `Direct number print panra step thappe! '${sumVarDefined}' variable store aagirukkum correct sum-ai print pannanum.`,
          `"${rawLines[3]}" — '${sumVarDefined}' variable-ai print/display pannunga, number-ai illa.`
        );
      }
      if (step4HasPrintWord && !step4HasSumVar) {
        // Print mentioned but not the right variable
        return getVarHint(
          `"${rawLines[3]}" — Print panrathaga sonneenga, aana enna print pannuvom? Step 2-la neengale define panna variable-ai print pannanum. Athu enna peyar?`,
          `Print/display panna solleenga, aana '${sumVarDefined}' variable missing. Step 2-la define panna variable peyar mention pannunga.`,
          `"${rawLines[3]}" — '${sumVarDefined}' ah print pannunga. E.g.: "Print ${sumVarDefined}" or "Display ${sumVarDefined}".`
        );
      }
      if (logicContent) {
        return getVarHint(
          `Line 4 la thappu! Neenga ezhuthiyathu: "${rawLines[3]}"<br>'<b>${logicContent.slice(0,60)}</b>' nu sonnapadi kidaikkum final sum-ai display/print pannum step ezhuthunga.`,
          `Line 4 la thappu! Neenga ezhuthiyathu: "${rawLines[3]}"<br>Step 4-la final sum-ah display/print pannum step ezhuthunga. E.g.: "Print ${sumVarDefined}".`
        );
      }
      return `Line 4 la thappu! Neenga ezhuthiyathu: "${rawLines[3]}"<br>Step 4-la final '${sumVarDefined}' variable-ah display/print pannum step ezhuthunga. E.g.: "Print ${sumVarDefined}" or "Display ${sumVarDefined}".`;
    }
    return "Excellent! All steps are correct.";
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION: INGREDIENTS  (list what's needed, no code values)
  // ═══════════════════════════════════════════════════════════════
  if (section === "ingredients") {
    if (!ut) {
      if (hintLevel === 1) return "Empty ah irukku! Intha program kku thevaiyana porutkalai (variables, loops) yosichu list pannunga.";
      return getVarHint(
        "Empty ah irukku! Ingredients list panni ezhuthunga.<br>Mudhal ingredient: N value store panna oru variable thevai. E.g., 'let n' or 'variable N'",
        "Blank ah irukku! First ingredient-ai yosiyunga. N-ai store panna enna thevai?",
        "Onnum illaye! N value vaanga thevaiyana oru variable-ai add pannunga."
      );
    }
    const hasVarN = /(variable|var|let|const|declare|n\s*value|input\s*variable)/i.test(ut);
    if (!hasVarN) {
      return getVarHint(
        `Neenga ezhuthiyathu: "${rawLines[0] || ut.slice(0,50)}"<br>N value-ai store panna namma enna use pannuvom?<br>👉 A) Variable &nbsp;&nbsp; B) Function &nbsp;&nbsp; C) Loop<br>Correct-ah choose panni ingredient-la ezhuthunga.`,
        `Neenga ezhuthiyathu: "${rawLines[0] || ut.slice(0,50)}"<br>N value-ai memory-la vaikka enna thevai? Variable-ah, constant-ah? Yosiyunga.`,
        `N value store panna oru <b>Variable</b> thevai. E.g., "variable N" or "let n" ezhuthunga.`
      );
    }
    const hasSumVar = /(\bsum\b|\btotal\b|\baccumulator\b|\bresult\b)/i.test(ut);
    if (!hasSumVar) {
      return getVarHint(
        `N variable ok! Kooti varum result-ai store panna innoru ingredient thevai.<br>👉 Athu enna maari irukum? A) Variable &nbsp;&nbsp; B) Operator &nbsp;&nbsp; C) Function<br>Correct-ah choose panni ezhuthunga.`,
        `Oru variable thevai — aana ithu N-ku illai, result-ku. Initial value enna irukkanum? 0-ah, 1-ah, vera enna-ah? Yosiyunga.`,
        `Sum store panna oru variable thevai (initial value = 0). E.g., "sum variable" or "total = 0" ezhuthunga.`
      );
    }
    // --- INGREDIENT LOOP FORMAT: for( start, end, next) style → guide field by field ---
    // When user writes for loop with start/end/next values, validate each field step by step
    const hasIngFormatInIng =
      /for\s*(loop\s*)?\(/i.test(ut) ||           // for( or for loop(
      /\bfor\b.*\bstart\b/i.test(ut) ||           // for ... start
      /start\s*[=:]/i.test(ut) ||                 // start:val or start=val
      (/\bfor\b/i.test(lines[2]||"") &&           // for on line 3
       /\bstart\b/i.test(ut) && /\bend\b/i.test(ut) && /\bnext\b/i.test(ut));

    if (hasIngFormatInIng) {
      // Detect variable names from user's input
      const varMatch = rawUt.match(/^\s*variable\s+(\w+)/im) || rawUt.match(/^\s*(?:var|let|const)\s+(\w+)/im);
      const sumMatch = rawUt.match(/^\s*(\w+)\s*=\s*0/im);
      const v = varMatch ? varMatch[1] : "a";
      const s = sumMatch ? sumMatch[1] : "sum";
      const isPlaceholderIng = (t) => !t || /^(start|end|next|value|here|condition|step)$/i.test(t.trim());


      // Parse paren or inline parts
      const parenRawIng = rawUt.match(/for\s*(?:loop\s*)?\(([^)]*)\)/i);
      const parenPartsIng = parenRawIng
        ? parenRawIng[1].trim().split(/[;,]+/).map(p => p.trim()).filter(Boolean)
        : [];
      const forLineIngRaw = rawUt.split('\n').find(l => /^\s*for\b/i.test(l)) || "";
      const forInlineIngParts = forLineIngRaw
        .replace(/^\s*for\s*(loop)?\s*/i,'').replace(/[()]/g,'')
        .split(/[,;]+/).map(p => p.trim()).filter(Boolean);

      // START
      let startTxt = "";
      if (parenPartsIng[0] && !isPlaceholderIng(parenPartsIng[0])) startTxt = parenPartsIng[0];
      else if (forInlineIngParts[0] && !isPlaceholderIng(forInlineIngParts[0].replace(/^start\s*/i,'').trim()))
        startTxt = forInlineIngParts[0].replace(/^start\s*/i,'').trim();
      else { const m = rawUt.match(/^[ \t]*start\s*[=:]\s*(.+)$/im); startTxt = m ? m[1].trim() : ""; }

      if (!/\bi\s*=\s*1\b|i\s*=\s*1/i.test(startTxt)) {
        const show = startTxt || (parenPartsIng[0] ? `"${parenPartsIng[0]}"` : "blank");
        return getVarHint(
          `for loop — start field: <b>${show}</b><br>Loop-ku oru <b>variable peyar</b> thevai! Convention-ah <b>i</b> nu peyar vaipom.<br>Start position-la <b>i = 1</b> nu ezhuthunga.`,
          `start field-la loop variable declare pannanum! <b>i = 1</b> nu ezhuthunga.`,
          `start: <b>i = 1</b> — ithai ezhuthunga. i thaan loop-oda counter.`
        );
      }

      // END
      let endTxt = "";
      const rawEnd1 = (parenPartsIng[1] || "").replace(/^end\s*/i,'').trim();
      const rawEnd2 = (forInlineIngParts[1] || "").replace(/^end\s*/i,'').trim();
      if (rawEnd1 && !isPlaceholderIng(rawEnd1)) endTxt = rawEnd1;
      else if (rawEnd2 && !isPlaceholderIng(rawEnd2)) endTxt = rawEnd2;
      else { const m = rawUt.match(/^[ \t]*end\s*[=:]\s*(.+)$/im); endTxt = m ? m[1].trim() : ""; }


      const endOk = new RegExp(`i\\s*<=?\\s*(${v}|n)`, 'i').test(endTxt);
      const endOnlyVar = new RegExp(`^(${v}|n)$`, 'i').test(endTxt);

      if (!endTxt) {
        return getVarHint(
          `start: i=1 ✔ correct!<br>Ippo <b>end</b> field — loop <b>enga varai</b> run aaganum?<br>👉 A) i &lt;= ${v} &nbsp; B) i &lt; ${v} &nbsp; C) i = ${v}<br>Correct condition choose panni ezhuthunga.`,
          `end field blank! <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end: <b>i &lt;= ${v}</b> — loop i &lt;= ${v} varaikkum run aagum.`
        );
      }
      if (endOnlyVar && !endOk) {
        return getVarHint(
          `end: "${endTxt}" — Just variable name! Loop end-ku <b>condition</b> thevai.<br>👉 A) i &lt;= ${v} &nbsp; B) i &lt; ${v} &nbsp; C) i = ${v}`,
          `Condition missing! <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end: <b>i &lt;= ${v}</b> — condition ezhuthunga.`
        );
      }
      if (!endOk) {
        return getVarHint(
          `end: "${endTxt}" — Format thappu!<br>Loop condition: <b>i &lt;= ${v}</b> nu ezhuthunga.`,
          `end field: <b>i &lt;= ${v}</b> format-la ezhuthunga.`,
          `end: i &lt;= ${v} — correct condition.`
        );
      }

      // NEXT
      let nextTxt = "";
      const rawNext1 = (parenPartsIng[2] || "").replace(/^next\s*/i,'').trim();
      const rawNext2 = (forInlineIngParts[2] || "").replace(/^next\s*/i,'').trim();
      if (rawNext1 && !isPlaceholderIng(rawNext1)) nextTxt = rawNext1;
      else if (rawNext2 && !isPlaceholderIng(rawNext2)) nextTxt = rawNext2;
      else { const m = rawUt.match(/^[ \t]*next\s*[=:]\s*(.+)$/im); nextTxt = m ? m[1].trim() : ""; }

      const nextOk    = /i\+\+|\+\+i|i\s*=\s*i\s*\+\s*1/i.test(nextTxt);
      const nextDecr  = /i--|--i/i.test(nextTxt);
      const nextWrong = /\b(?!i\b)([a-z]\w*)\s*\+\+/i.test(nextTxt);
      const nextWrongName = (nextTxt.match(/\b(?!i\b)([a-z]\w*)\s*\+\+/i)||[])[1]||"";

      if (!nextTxt) {
        return getVarHint(
          `end: i&lt;=${v} ✔ correct!<br>Ippo <b>next</b> field — ovvoru loop turn-laiyum i-ah eppadi <b>change</b> seivom?<br>👉 A) i-- &nbsp; B) i++ &nbsp; C) i = i + 2`,
          `next field blank! <b>i++</b> nu ezhuthunga.`,
          `next: <b>i++</b> — ovvoru loop turn-laiyum i one step increase aagum.`
        );
      }
      if (nextDecr) {
        return getVarHint(
          `next: "${nextTxt}" — i-- wrong! 1 to N count panna <b>increase</b> pannanum.<br><b>i++</b> use pannanum.`,
          `i-- wrong! <b>i++</b> use pannanum.`,
          `next: <b>i++</b> — i++ correct.`
        );
      }
      if (nextWrong) {
        return getVarHint(
          `next: "${nextTxt}" — Variable peyar thappu!<br>Loop counter <b>i</b> — neenga <b>${nextWrongName}</b> use pannirukinga.<br><b>i++</b> nu ezhuthunga.`,
          `"${nextWrongName}++" wrong! Loop counter <b>i</b> — so <b>i++</b> nu ezhuthunga.`,
          `next: <b>i++</b> — i thaan counter, not ${nextWrongName}.`
        );
      }
      if (!nextOk) {
        return getVarHint(
          `next: "${nextTxt}" — Format thappu!<br>👉 A) i-- &nbsp; B) i++ &nbsp; C) i = i + 2`,
          `next field: <b>i++</b> nu ezhuthunga.`,
          `next: <b>i++</b> — ithai ezhuthunga.`
        );
      }

      // BODY
      const bodyOk  = new RegExp(`${s}\\s*=\\s*${s}\\s*\\+\\s*i|${s}\\s*\\+=\\s*i`, 'i').test(ut);
      const bodyWrong = new RegExp(`${s}\\s*=\\s*${s}\\s*[+]\\s*((?!i\\b)[a-zA-Z]\\w*)`, 'i').exec(ut);
      const anyBodyOp = new RegExp(`${s}\\s*[+\\-*\\/]=\\s*i|${s}\\s*=\\s*${s}\\s*[+\\-*\\/]\\s*i`, 'i').test(ut);
      const wrongBodyOp = new RegExp(`${s}\\s*[-*\\/]=\\s*i|${s}\\s*=\\s*${s}\\s*[-*\\/]\\s*i`, 'i').test(ut);

      if (wrongBodyOp) {
        return getVarHint(
          `Loop structure ✔!<br>Loop body-la operation thappu! <b>'+'</b> use pannanum.<br>✔ Correct: <b>${s} = ${s} + i</b>`,
          `'+' use pannanum. ${s} = ${s} + i nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b>`
        );
      }
      if (bodyWrong && !bodyOk) {
        return getVarHint(
          `"${s} = ${s} + ${bodyWrong[1]}" — Variable thappu!<br>Loop counter <b>i</b> — so <b>${s} = ${s} + i</b> nu ezhuthunga.`,
          `"${bodyWrong[1]}" wrong! Loop counter <b>i</b> — <b>${s} = ${s} + i</b> nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b>`
        );
      }
      if (!anyBodyOp) {
        return getVarHint(
          `for loop (i=1; i&lt;=${v}; i++) ✔ complete!<br>Loop <b>ulla enna seivom</b>?<br>👉 A) ${s} - i &nbsp; B) ${s} = ${s} + i &nbsp; C) ${s} * i`,
          `Loop ok! Body operation missing. ${s} = ${s} + i nu ezhuthunga.`,
          `Loop body: <b>${s} = ${s} + i</b>`
        );
      }

      // PRINT
      const hasPrintIng = /(print|display|output|show|console\.?log)/i.test(ut);
      const printsSumIng = new RegExp(`(print|display|output|show|console\\.?log)\\s*\\(?\\s*(${s}|sum|result)`, 'i').test(ut);
      const printsWrongIng = new RegExp(`(print|display|output|show|console\\.?log)\\s*\\(?\\s*(${v}\\b)`, 'i').test(ut) && !printsSumIng;

      if (!hasPrintIng) {
        return getVarHint(
          `${s} = ${s} + i ✔ correct!<br>Loop mudinjatu. Final step: <b>'${s}'</b> result print pannanum.<br>👉 A) Variable &nbsp; B) Print command &nbsp; C) Loop`,
          `Final step: '${s}' result <b>print</b>/<b>display</b> pannanum.`,
          `Last step: <b>print ${s}</b> or <b>console.log(${s})</b> nu ezhuthunga.`
        );
      }
      if (printsWrongIng) {
        return getVarHint(
          `print(<b>${v}</b>) — Thappu! '<b>${v}</b>' input variable — <b>'${s}'</b> (sum result) print pannanum.<br>👉 <b>print ${s}</b> or <b>console.log(${s})</b>`,
          `Wrong! <b>'${s}'</b> (sum) print pannanum, not '<b>${v}</b>' (input).`,
          `print <b>${s}</b> — sum result print pannanum.`
        );
      }

      return "Excellent! All steps are correct.";
    }

    // --- Loop check: detect what parts of the loop concept are present ---
    const ingLoopHasKeyword = /(for\s*loop|while\s*loop|\bfor\b|\bwhile\b|\bloop\b|\brepeat\b|\biterate\b)/i.test(ut);
    const ingLoopHasStart  = /(start|begin|from|1|mudhal|\bfrom\s*1\b|starts?\s*(at|from|with))/i.test(ut);
    const ingLoopHasEnd    = /(end|upto|till|until|varai|n\s*varai|to\s*n|n\s*muthal|stops?|finish)/i.test(ut);
    const ingLoopHasBody   = /(add|plus|kootu|\+|each|every|number|step|body|inside|ulla)/i.test(ut);
    const hasLoop = ingLoopHasKeyword && ingLoopHasStart && ingLoopHasEnd && ingLoopHasBody;



    if (!hasLoop) {
      if (!ingLoopHasKeyword) {
        return getVarHint(
          `Variables ok! Ippo 1 to N varaikkum thirumba thirumba add panrathuku enna use pannuvom?<br>👉 A) if statement &nbsp;&nbsp; B) Loop &nbsp;&nbsp; C) Function<br>Correct-ah choose panni ezhuthunga.`,
          `Thodarndhu (repeatedly) oru velai seiya enna structure thevai? Loop-ah, condition-ah?`,
          `Thirumba thirumba seiya <b>Loop</b> thevai. 'for loop' or 'while loop' ezhuthunga.`
        );
      }
      if (ingLoopHasKeyword && !ingLoopHasStart) {
        return getVarHint(
          `Loop mention panneenga — correct choice! Aana for loop-ku oru <b>start point</b> thevai.<br>👉 Ithu enga irunthu start aaganum? A) 0 &nbsp;&nbsp; B) 1 &nbsp;&nbsp; C) N<br>Correct-ah choose panni ezhuthunga.`,
          `For loop-la 3 parts irukku: start, end, next step. Ippo start enga nu sollunga.`,
          `Loop 1-la start aaganum. "starts from 1" or "start:1" nu ezhuthunga.`
        );
      }
      if (ingLoopHasKeyword && ingLoopHasStart && !ingLoopHasEnd) {
        return getVarHint(
          `Start:1 ok! Aana loop <b>enga stop</b> aaganum?<br>👉 A) 1-la stop &nbsp;&nbsp; B) N-la stop &nbsp;&nbsp; C) Endless loop<br>Correct-ah choose panni ezhuthunga.`,
          `Start point correct! End point enna? Loop N-la mutiyanum illaya, vera enda value-la?`,
          `Loop N-la end aaganum. "end:N" or "till N" or "to N" nu ezhuthunga.`
        );
      }
      if (ingLoopHasKeyword && ingLoopHasStart && ingLoopHasEnd && !ingLoopHasBody) {
        return getVarHint(
          `Loop 1 to N — correct! Aana loop ulla <b>enna operation</b> pannuvom?<br>👉 A) Subtract (-) &nbsp;&nbsp; B) Add (+) &nbsp;&nbsp; C) Multiply (*)<br>Correct operation-ah choose panni ezhuthunga.`,
          `Start & end ok! Loop run aagum — aana ulla enna seivom? 1,2,3...N-ah kootanum illaya keraikanum? Which operation?`,
          `Loop ulla each number-ai sum-la <b>add</b> pannanum. '+' operation ezhuthunga.`
        );
      }
    }
    const hasAdd = /(\+|\bplus\b|\badd\b|\baddition\b|sum\s*\+=|kootu)/i.test(ut);
    if (!hasAdd) {
      return getVarHint(
        `Loop ok! Loop ulla numbers-ai sum-kooda seiya enna operation thevai?<br>👉 A) + (add) &nbsp;&nbsp; B) - (subtract) &nbsp;&nbsp; C) * (multiply)<br>Correct operation-ah choose panni ezhuthunga.`,
        `Sum-ah increase seiya enna mathematical operator use pannuvom? Yosiyunga.`,
        `'+' operator or 'addition' use pannanum. E.g., "sum += i" or "sum + each number" ezhuthunga.`
      );
    }
    const hasPrint = /(console\.log|\bprint\b|\boutput\b|\bdisplay\b)/i.test(ut);
    if (!hasPrint) {
      return getVarHint(
        `Almost done! Ellaam mudintha piragu result-ai user-kku kaata enna thevai?<br>👉 A) Variable &nbsp;&nbsp; B) Output command &nbsp;&nbsp; C) Loop<br>Correct-ah choose panni ezhuthunga.`,
        `Result ready — aana screen-la kaatave illai. Enna command use pannuvom? console.log-ah, alert-ah, vera enna-ah?`,
        `Output panna <b>console.log</b> or <b>print</b> use pannanum. Final ingredient-ah ezhuthunga.`
      );
    }
    return "Perfect ingredients!";
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION: SAMPLECODE  (actual JavaScript code)
  // ═══════════════════════════════════════════════════════════════
  if (section === "samplecode") {
    if (!ut) {
      if (hintLevel === 1) return "Code empty ah irukku! Neenga ezhuthiya recipe padi code ezhutha try pannunga.";
      return "Code start pannunga! Mudhal step: N value store panna variable declare pannunga.<br>E.g.: <b>let n = 5;</b>";
    }

    // 1. N variable (e.g. let n = 5)
    const nVarMatch = rawUt.match(/(?:let|const|var)\s+(\w+)\s*=\s*(\d+)/i);
    if (!nVarMatch) {
      const hasVarKeyword = /(?:let|const|var)\s+\w+/i.test(rawUt);
      if (hasVarKeyword) {
        return "Variable declare pannirukinga, aana value assign pannalai!<br>E.g.: <b>let n = 5;</b> — '= 5' nu number assign pannunga.";
      }
      return "Mudhal step: N value store panna variable declare pannunga.<br>E.g.: <b>let n = 5;</b>";
    }
    const nVarName = nVarMatch[1];
    const nValue = parseInt(nVarMatch[2]);

    // 2. Sum variable initialized to 0 (e.g. let sum = 0)
    const sumVarMatch = rawUt.match(/(?:let|const|var)\s+(\w+)\s*=\s*0/i);
    if (!sumVarMatch) {
      const sumWrongMatch = rawUt.match(/(?:let|const|var)\s+(sum|total|result)\s*=\s*(\d+)/i);
      if (sumWrongMatch && parseInt(sumWrongMatch[2]) !== 0) {
        return `'${sumWrongMatch[1]}' variable declare pannirukinga, aana initial value '${sumWrongMatch[2]}' thappu!<br>Sum-ah <b>0</b>-aaga initialize pannunga: <b>let ${sumWrongMatch[1]} = 0;</b>`;
      }
      return `'${nVarName}' ok! Aduthu sum-ah 0-aaga initialize pannunga.<br>E.g.: <b>let sum = 0;</b>`;
    }
    const sumVarName = sumVarMatch[1];

    // 3. For loop exists
    const hasForLoop = /\bfor\s*\(/i.test(rawUt);
    const hasWhileLoop = /\bwhile\s*\(/i.test(rawUt);
    if (!hasForLoop && !hasWhileLoop) {
      return `'${nVarName}' and '${sumVarName}' declare aagidu! Aduthu for loop ezhuthunga:<br><b>for(let i = 1; i <= ${nVarName}; i++) { }</b>`;
    }

    if (hasForLoop) {
      // 4a. Loop initializer: must start at 1
      const loopInitMatch = rawUt.match(/for\s*\(\s*(?:let|var|const)?\s*(\w+)\s*=\s*(\d+)/i);
      if (!loopInitMatch) {
        return `for loop-la initialization missing!<br>E.g.: <b>for(let i = 1; i <= ${nVarName}; i++)</b>`;
      }
      const loopVar = loopInitMatch[1];
      const loopStart = parseInt(loopInitMatch[2]);

      if (loopStart === 0) {
        return `Loop '${loopVar} = 0' aaga start panni irukinga!<br>1 to N sum edukka '${loopVar} = 1' aaga start pannanum (0 include aana total thappaa varum).<br>E.g.: <b>for(let ${loopVar} = 1; ${loopVar} <= ${nVarName}; ${loopVar}++)</b>`;
      }
      if (loopStart !== 1) {
        return `Loop '${loopVar} = ${loopStart}' aaga start panni irukinga. Sum of 1 to N edukka '${loopVar} = 1' aaga start pannanum.`;
      }

      // 4b. Loop condition: i <= n
      const hasCondLE = new RegExp(`${loopVar}\\s*<=\\s*${nVarName}`, "i").test(rawUt);
      const hasCondLT = new RegExp(`${loopVar}\\s*<\\s*${nVarName}`, "i").test(rawUt);
      if (!hasCondLE && !hasCondLT) {
        const wrongCond = rawUt.match(new RegExp(`${loopVar}\\s*([<>]=?|==)\\s*(\\w+)`, "i"));
        if (wrongCond) {
          return `Loop condition thappu! Neenga ezhuthiyathu: '${wrongCond[0]}'<br>N varaikkum loop nadakka '<b>${loopVar} <= ${nVarName}</b>' nu condition venum.`;
        }
        return `for loop condition missing!<br>'${loopVar} <= ${nVarName}' nu N varaikkum loop run aagum.`;
      }
      if (hasCondLT && !hasCondLE) {
        return `Loop condition thappu! '${loopVar} < ${nVarName}' nu ezhuthirukinga.<br>N-ah sum-la serakka '<b>${loopVar} <= ${nVarName}</b>' venum ('<' venam, '<=' venum).`;
      }

      // 4c. Increment: i++
      const hasIncrement = new RegExp(`${loopVar}\\s*\\+\\+|\\+\\+\\s*${loopVar}|${loopVar}\\s*\\+=\\s*1`, "i").test(rawUt);
      if (!hasIncrement) {
        return `Loop increment missing! Each step-la '${loopVar}'-ah oru kootta '${loopVar}++' ezhuthunga.<br>E.g.: <b>for(let ${loopVar} = 1; ${loopVar} <= ${nVarName}; ${loopVar}++)</b>`;
      }

      // 5. Sum addition: sum += i  OR  sum = sum + i
      const addPatt1 = new RegExp(`${sumVarName}\\s*\\+=\\s*${loopVar}`, "i");
      const addPatt2 = new RegExp(`${sumVarName}\\s*=\\s*${sumVarName}\\s*\\+\\s*${loopVar}`, "i");
      const hasAddition = addPatt1.test(rawUt) || addPatt2.test(rawUt);
      if (!hasAddition) {
        const wrongAdd = rawUt.match(new RegExp(`${sumVarName}\\s*\\+=\\s*(\\w+)`, "i"));
        if (wrongAdd) {
          return `Loop-la '${sumVarName} += ${wrongAdd[1]}' nu ezhuthirukinga.<br>Loop variable '${loopVar}' use pannanum: <b>${sumVarName} += ${loopVar};</b>`;
        }
        const partialAdd = new RegExp(`${sumVarName}\\s*\\+\\s*${loopVar}`, "i").test(rawUt);
        if (partialAdd) {
          return `'${sumVarName} + ${loopVar}' ezhuthirukinga, aana result assign pannalai!<br>'+=' use pannunga: <b>${sumVarName} += ${loopVar};</b>`;
        }
        return `Loop brace { } kulla sum update missing!<br>Each iteration-la '${loopVar}'-ah sum-la koottanum: <b>${sumVarName} += ${loopVar};</b>`;
      }
    }

    // 6. console.log with sum variable
    const hasPrint = /console\.log\s*\(/i.test(rawUt);
    if (!hasPrint) {
      return `Loop-um sum calculation-um correct! Aduthu result print panna:<br><b>console.log(${sumVarName});</b> — loop closing brace } piragu ezhuthunga.`;
    }
    const printMatch = rawUt.match(/console\.log\s*\(\s*(\w+)\s*\)/i);
    if (printMatch) {
      const printedVar = printMatch[1];
      if (printedVar.toLowerCase() !== sumVarName.toLowerCase()) {
        return `console.log(<b>${printedVar}</b>) nu ezhuthirukinga.<br>Sum result-ah print panna sum variable-ah pass pannunga: <b>console.log(${sumVarName});</b>`;
      }
    } else {
      const emptyLog = /console\.log\s*\(\s*\)/i.test(rawUt);
      if (emptyLog) {
        return `console.log() empty ah irukku!<br>Sum variable-ah ulla pass pannunga: <b>console.log(${sumVarName});</b>`;
      }
    }

    // 7. Hardcoded answer check
    if (nValue > 0) {
      const expectedSum = (nValue * (nValue + 1)) / 2;
      const hardMat = rawUt.match(/console\.log\s*\(\s*(\d+)\s*\)/i);
      if (hardMat && parseInt(hardMat[1]) !== expectedSum) {
        return `console.log(<b>${hardMat[1]}</b>) nu hardcode pannirukinga.<br>N=${nValue} ku correct sum ${expectedSum} varum — direct number podakoodathu, loop use panni calculate pannunga.`;
      }
    }

    return "Code looks good!";
  }

  return "Correct! Move to the next step.";
}


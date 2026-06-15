export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { company, snippets, purpose, sources } = req.body
  if (!company || !snippets) {
    return res.status(400).json({ error: "Missing company or snippets" })
  }

  const systemPrompt = `You are a senior company research analyst at a top-tier global management consulting firm (e.g., McKinsey, BCG, Bain).
Given a company name, the user's research purpose, and web search results about that company, write a highly professional, context-aware intelligence brief.

WRITING STYLE RULES:
- The report should feel like a professional consultant prepared it, a business analyst wrote it, or a meeting preparation document.
- Keep the tone sophisticated, direct, and insight-dense (consulting brief style, not an AI chatbot response).
- Avoid ChatGPT-style responses, excessive formatting, repetition, marketing language, and generic advice.
- The output must be concise, actionable, and directly useful before a meeting.

CRITICAL:
1. Reply ONLY with valid JSON. No markdown wrappers. No backticks. No explanation before or after. Just the raw JSON object.
2. Adapt the analysis heavily based on the user's research purpose. Tailor the prioritization of details to match the specified goal.
3. Do NOT write any chain-of-thought, reasoning, pre-text, introductions, or explanations. Do not write text out loud. Your response MUST begin exactly with '{' and end exactly with '}'.
4. Every single key in the JSON must map to a string value. Do NOT use nested JSON arrays or JSON objects for any key.
5. The JSON must have EXACTLY these 7 keys:

{
  "executiveSummary": "A concise overview (3-5 sentences) covering: what the company does, why it is relevant to the user's goal, the most important opportunity, and the most important risk.",
  "companySnapshot": "Factual and concise details formatted as a single string with lines separated by \\n: Company Name, Industry, Headquarters, Founded Year, Employee Count (if available), Funding Stage (if available), Website, and a One-line company description.",
  "businessOverview": "Core products, services, revenue model, target customers, and market positioning. Use simple language. Avoid long paragraphs. Format as a single string with points separated by \\n.",
  "recentDevelopments": "3-5 recent developments formatted as a single string (NOT a JSON array) with items separated by \\n. Each item must contain a headline, short explanation, and source reference (e.g., '• Headline: Stripe Unveils New API Optimizations \\n  Explanation: Enhances developer experience... \\n  Source: [Source: TechCrunch]').",
  "risks": "Market, competitive, operational, regulatory, and strategic concerns. Do not exaggerate. If confidence is low, clearly state uncertainty. Format as a single string (NOT a JSON array) with points separated by \\n.",
  "goalSpecificIntelligence": "Contextual intelligence customized for the Research Purpose. Format as a single string with points separated by \\n.",
  "meetingStrategy": "A single string (NOT a JSON object) structured exactly as follows using literal \\n for newlines:
### Focus On\\n• DISCUSSION_AREA_1: BRIEF_EXPLANATION\\n• DISCUSSION_AREA_2: BRIEF_EXPLANATION\\n... (3-5 areas)
\\n### Avoid\\n• TOPIC_TO_AVOID_1: BRIEF_EXPLANATION\\n... (topics/approaches to avoid)
\\n### Questions To Ask\\n• QUESTION_1\\n• QUESTION_2\\n... (5-8 thoughtful, non-generic, business-focused questions)
\\n### Potential Opportunity\\nSTRATEGIC_INSIGHT (2-4 sentences advice from business analyst)"
}`;

  const userMessage = `Company: ${company}
User Research Purpose: ${purpose || "General company research and intelligence"}

Search results:
${snippets}

Generate the brief now. Return only JSON.`

  // Function to escape unescaped control characters inside JSON string values
  function escapeJsonStrings(str) {
    let result = "";
    let inString = false;
    let escaped = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '"' && !escaped) {
        inString = !inString;
        result += char;
      } else if (inString) {
        if (char === '\\' && !escaped) {
          escaped = true;
          result += char;
        } else {
          if (escaped) {
            escaped = false;
            result += char;
          } else if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\r';
          } else if (char === '\t') {
            result += '\\t';
          } else if (char.charCodeAt(0) < 32) {
            result += '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
          } else {
            result += char;
          }
        }
      } else {
        result += char;
      }
    }
    return result;
  }

  try {
    const modelsToTry = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemma-2-9b-it:free",
      "openrouter/free"
    ];

    let briefFromJson = null;
    let lastError = null;
    let chosenModel = "";

    for (const model of modelsToTry) {
    try {
      console.log(`[API Server] Attempting brief generation with model: ${model}`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(40000), // 40-second timeout to prevent 3-min hanging
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 2500,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[API Server] Model ${model} failed with status ${response.status}:`, errorText);
        lastError = { status: response.status, text: errorText };
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      if (!text.trim()) {
        console.warn(`[API Server] Model ${model} returned empty completion content.`);
        lastError = { status: 500, text: "Empty response from AI model" };
        continue;
      }

      console.log(`[API Server] Model ${model} returned response preview: "${text.substring(0, 100)}..."`);

      let jsonStr = text.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }

      const cleanedJsonStr = escapeJsonStrings(jsonStr);
      const parsed = JSON.parse(cleanedJsonStr);

      // Simple validation of parsed keys
      if (!parsed.executiveSummary && !parsed.companySnapshot) {
        throw new Error("Parsed JSON lacks required fields (executiveSummary / companySnapshot)");
      }

      briefFromJson = parsed;
      chosenModel = model;
      break; // Success! Exit loop.
    } catch (err) {
      console.warn(`[API Server] Model ${model} processing failed:`, err.message);
      lastError = { status: 500, text: err.message };
    }
  }

  if (!briefFromJson) {
    const status = lastError?.status || 500;
    const detail = lastError?.text || "All attempts to generate brief failed";
    console.error(`[API Server] All models failed. Returning error status ${status}:`, detail);
    return res.status(status).json({ error: "Brief generation failed", detail: detail });
  }

  console.log(`[API Server] Successfully generated brief using model: ${chosenModel}`);

  const brief = {
    ...briefFromJson,
    sources: sources || []
  };

  res.json({ brief });

  } catch (err) {
    console.error("[API Server] Error processing generated brief:", err);
    res.status(500).json({ error: "Brief generation failed", detail: err.message });
  }
}

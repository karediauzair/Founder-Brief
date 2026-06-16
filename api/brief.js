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
- Avoid ChatGPT-style responses, marketing language, and generic advice.

CRITICAL FORMATTING INSTRUCTIONS:
1. Output MUST be a valid JSON object. Do NOT wrap it in markdown code blocks or add any other text outside the JSON.
2. Adapt the analysis heavily based on the user's research purpose. Tailor the prioritization of details to match the specified goal.
3. The JSON object MUST contain exactly these keys:
   - "executiveSummary": Markdown string summarizing the company.
   - "companySnapshot": Markdown string (Basic facts: Founding, Location, Size).
   - "businessModel": Markdown string (How they make money).
   - "meetingStrategy": Markdown string (Include Focus On, Avoid, Questions to Ask, Potential Opportunity based on the purpose).
   - "opportunities": Markdown string.
   - "risks": Markdown string (Red flags & risks).
   - "confidenceScore": Integer between 1-100 indicating confidence in data.
   - "dataQualityNotes": String noting any conflicting information or incomplete data.
   - "sourceBreakdown": A JSON object with exactly these keys: 'official', 'news', 'industry', 'public', containing the integer count of sources for each category.`;

  const userMessage = `Company: ${company}
User Research Purpose: ${purpose || "General company research and intelligence"}

Search results:
${snippets}

Generate the brief now. Return ONLY valid JSON.`;

  try {
    const modelsToTry = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemma-2-9b-it:free",
      "openrouter/free"
    ];

    let briefMarkdown = null;
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

      let mdStr = text.trim();
      if (mdStr.startsWith('```json')) {
        mdStr = mdStr.slice(7);
      } else if (mdStr.startsWith('```')) {
        mdStr = mdStr.slice(3);
      }
      if (mdStr.endsWith('```')) {
        mdStr = mdStr.slice(0, -3);
      }
      mdStr = mdStr.trim();

      // Ensure it's valid JSON
      briefMarkdown = JSON.parse(mdStr);
      chosenModel = model;
      break; // Success! Exit loop.
    } catch (err) {
      console.warn(`[API Server] Model ${model} processing failed:`, err.message);
      lastError = { status: 500, text: err.message };
    }
  }

  if (!briefMarkdown) {
    const status = lastError?.status || 500;
    const detail = lastError?.text || "All attempts to generate brief failed";
    console.error(`[API Server] All models failed. Returning error status ${status}:`, detail);
    return res.status(status).json({ error: "Brief generation failed", detail: detail });
  }

  console.log(`[API Server] Successfully generated brief using model: ${chosenModel}`);

  const brief = {
    ...briefMarkdown,
    sources: sources || []
  };

  res.json({ brief });

  } catch (err) {
    console.error("[API Server] Error processing generated brief:", err);
    res.status(500).json({ error: "Brief generation failed", detail: err.message });
  }
}

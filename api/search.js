export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { company } = req.body
  if (!company) return res.status(400).json({ error: "Company name required" })

  const serperKey = process.env.SERPER_API_KEY;
  const isMock = !serperKey || serperKey === "your_serper_key_here";

  if (isMock) {
    const mockSnippets = `${company} Overview: ${company} is a modern technology venture specializing in scalable software infrastructure.
${company} Funding & Origin: Founded recently, the company has completed a Series A funding round backed by prominent early-stage VC firms.
${company} Revenue Model: Generates revenue via scalable B2B subscription fees, tiered enterprise licensing, and volume-based developer plans.
${company} Competitors: Faces direct competition from large established software platforms and high-growth developer tools.
${company} Recent News: Lately introduced major API optimizations, expanded product features, and expanded its engineering team.
${company} Key Risks: High customer acquisition costs, dependency on developer ecosystem, and intense market competition.`;

    const mockSources = [
      { title: `${company} - Official Website`, link: `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` },
      { title: `${company} Profile - Crunchbase`, link: "https://www.crunchbase.com" },
      { title: `${company} Funding News - TechCrunch`, link: "https://techcrunch.com" }
    ];

    return res.json({ snippets: mockSnippets, sources: mockSources });
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: `${company} company business model funding competitors news`,
        num: 8
      })
    })

    const data = await response.json()

    const snippets = data.organic
      ?.slice(0, 8)
      .map(r => `${r.title}: ${r.snippet}`)
      .join("\n") || ""

    const sources = data.organic
      ?.slice(0, 8)
      .map(r => ({ title: r.title, link: r.link })) || []

    if (!snippets) {
      return res.status(404).json({ error: "No results found for this company" })
    }

    res.json({ snippets, sources })

  } catch (err) {
    res.status(500).json({ error: "Search failed", detail: err.message })
  }
}

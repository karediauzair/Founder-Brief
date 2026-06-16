import React, { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput';
import LoadingScreen from './components/LoadingScreen';
import BriefOutput from './components/BriefOutput';
import ErrorState from './components/ErrorState';

function App() {
  const [appState, setAppState] = useState("idle");
  // values: "idle" | "loading" | "result" | "error"

  const [companyName, setCompanyName] = useState("");
  const [researchPurpose, setResearchPurpose] = useState("");
  const [briefData, setBriefData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Loading screen synchronization flags
  const [pendingBrief, setPendingBrief] = useState(null);
  const [apiFinished, setApiFinished] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSearch = (name, purpose) => {
    const trimmedName = name.trim();
    const trimmedPurpose = purpose.trim();
    if (!trimmedName || !trimmedPurpose) return;

    setCompanyName(trimmedName);
    setResearchPurpose(trimmedPurpose);
    setAppState("loading");
    
    // Reset synchronization states
    setPendingBrief(null);
    setApiFinished(false);
    setApiError("");

    fetchBrief(trimmedName, trimmedPurpose);
  };

  const fetchBrief = async (name, purpose) => {
    try {
      // Step 1: Web search via Serper
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: name })
      });

      if (!searchRes.ok) {
        const errorData = await searchRes.json().catch(() => ({}));
        let detailMsg = errorData.detail || "";
        try {
          const parsedDetail = JSON.parse(detailMsg);
          if (parsedDetail.error?.message) {
            detailMsg = parsedDetail.error.message;
          }
        } catch (e) {}
        const fullMsg = errorData.error || `Search failed (status ${searchRes.status})`;
        throw new Error(fullMsg);
      }

      const { snippets, sources } = await searchRes.json();
      if (!snippets) throw new Error("No search results found");

      // Step 2: Synthesis via Claude 3.5 Sonnet on OpenRouter
      const briefRes = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: name, snippets, purpose, sources })
      });

      if (!briefRes.ok) {
        const errorData = await briefRes.json().catch(() => ({}));
        let detailMsg = errorData.detail || "";
        try {
          const parsedDetail = JSON.parse(detailMsg);
          if (parsedDetail.error?.message) {
            detailMsg = parsedDetail.error.message;
          }
        } catch (e) {}
        const fullMsg = errorData.error || `Brief generation failed (status ${briefRes.status})`;
        throw new Error(fullMsg);
      }

      const { brief } = await briefRes.json();
      if (!brief) throw new Error("Could not generate brief");

      setPendingBrief(brief);
      setApiFinished(true);

    } catch (err) {
      setApiError(err.message || "An unexpected error occurred");
      setApiFinished(true);
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setBriefData(null);
    setCompanyName("");
    setResearchPurpose("");
    setErrorMessage("");
    setPendingBrief(null);
    setApiFinished(false);
    setApiError("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <main className="flex-grow flex flex-col justify-center">
        {appState === "idle" && (
          <SearchInput onSearch={handleSearch} />
        )}
        {appState === "loading" && (
          <LoadingScreen 
            company={companyName}
            apiFinished={apiFinished}
            pendingBrief={pendingBrief}
            apiError={apiError}
            onTransitionToResult={(brief) => {
              setBriefData(brief);
              setAppState("result");
            }}
            onTransitionToError={(err) => {
              setErrorMessage(err);
              setAppState("error");
            }}
          />
        )}
        {appState === "result" && briefData && (
          <BriefOutput 
            brief={briefData} 
            company={companyName} 
            purpose={researchPurpose}
            onReset={handleReset} 
          />
        )}
        {appState === "error" && (
          <ErrorState 
            message={errorMessage} 
            onRetry={handleReset} 
          />
        )}
      </main>
    </div>
  );
}

export default App;

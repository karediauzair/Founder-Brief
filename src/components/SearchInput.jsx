import React, { useState, useEffect, useRef } from 'react';

const PURPOSE_TEMPLATES = {
  "Investor Meeting": "I am preparing for an investor meeting and would like to understand the company's growth indicators, market position, business model, competitive advantages, and potential risks.",
  "Partnership Discussion": "I am exploring a potential partnership with this company. Help me understand their strategic initiatives, collaboration opportunities, current partnerships, and key discussion points.",
  "Competitor Research": "I am researching this company as a competitor. Help me understand their strengths, weaknesses, market position, differentiation, and competitive threats.",
  "Vendor Evaluation": "I am evaluating this company as a potential vendor or service provider. Help me assess reliability, reputation, capabilities, risks, and suitability.",
  "Sales Meeting": "I am preparing for a sales discussion. Help me understand their priorities, challenges, opportunities, and relevant talking points."
};

const SUGGESTIONS = ['Stripe', 'OpenAI', 'Zepto', 'Notion'];

export default function SearchInput({ onSearch }) {
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [purposeError, setPurposeError] = useState('');
  const companyInputRef = useRef(null);

  // Autofocus the company name input on load
  useEffect(() => {
    if (companyInputRef.current) {
      companyInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!company.trim()) {
      setCompanyError('Please enter a company name or website');
      valid = false;
    } else {
      setCompanyError('');
    }

    if (!purpose.trim()) {
      setPurposeError('Please enter your research purpose');
      valid = false;
    } else if (purpose.length > 500) {
      setPurposeError('Purpose must be under 500 characters');
      valid = false;
    } else {
      setPurposeError('');
    }

    if (valid) {
      onSearch(company.trim(), purpose.trim());
    }
  };

  const handlePillClick = (label) => {
    setPurpose(PURPOSE_TEMPLATES[label]);
    setPurposeError('');
  };

  const handleSuggestionClick = (name) => {
    setCompany(name);
    setCompanyError('');
    // Automatically set a mock default purpose if none is entered yet
    if (!purpose.trim()) {
      setPurpose(`I want to explore collaboration and partnership opportunities with ${name}.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 font-sans text-center relative py-12 select-none fade-in">
      
      {/* 3-column Layout Container */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-start justify-center">
        
        {/* Left Column: Desktop Tag List */}
        <div className="hidden md:flex flex-col w-48 text-left pt-36">
          <div className="text-[10px] uppercase tracking-widest text-[#CCCCCC] mb-3 font-bold">
            USED FOR
          </div>
          <div className="flex flex-col items-start gap-1">
            {Object.keys(PURPOSE_TEMPLATES).map((label) => (
              <span
                key={label}
                onClick={() => handlePillClick(label)}
                className="text-sm text-[#888480] hover:text-[#E8622A] cursor-pointer transition-colors py-1 block text-left"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Center Column: Main Form */}
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto flex-1">
          {/* FounderBrief Logo */}
          <div className="flex items-center gap-2 mb-8 animate-pulse">
            <span className="w-2.5 h-6 bg-amber rounded-full block"></span>
            <span className="font-serif text-2xl font-bold text-ink tracking-tight select-none">
              FounderBrief
            </span>
          </div>

          {/* Hero Headings */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ink leading-tight max-w-3xl">
            Know Any Company In 30 Seconds
          </h1>
          
          <p className="text-base md:text-lg text-stone mt-4 max-w-xl leading-relaxed">
            AI-powered meeting intelligence tailored to your specific business goal.
          </p>

          {/* Form Container */}
          <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-xl mt-12 bg-white rounded-xl border border-chalk p-6 md:p-8 premium-shadow text-left"
          >
            {/* Company Name / URL */}
            <div className="mb-6">
              <label htmlFor="company" className="text-[11px] font-sans font-bold uppercase tracking-wider text-stone block mb-2">
                Company Name or URL
              </label>
              <input
                id="company"
                ref={companyInputRef}
                type="text"
                placeholder="e.g. Stripe or stripe.com"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (e.target.value.trim()) setCompanyError('');
                }}
                className={`border rounded-lg px-4 py-3 bg-white w-full text-base transition-colors duration-200 outline-none ${
                  companyError ? 'border-red-500 focus:border-red-500' : 'border-chalk focus:border-amber'
                }`}
              />
              {companyError && (
                <span className="text-xs text-red-600 font-medium mt-1.5 block">
                  {companyError}
                </span>
              )}
              
              {/* Suggestion Chips */}
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs text-stone">
                <span>Try:</span>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="hover:text-amber font-medium transition-colors duration-150 underline decoration-chalk underline-offset-4 hover:decoration-amber/50 px-1 py-0.5 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Research Purpose Textarea */}
            <div className="mb-6 relative">
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="purpose" className="text-[11px] font-sans font-bold uppercase tracking-wider text-stone block">
                  Research Purpose
                </label>
                <span className={`text-[10px] font-mono ${
                  purpose.length > 500 ? 'text-red-500 font-bold' : 'text-stone'
                }`}>
                  {purpose.length}/500
                </span>
              </div>
              
              <textarea
                id="purpose"
                placeholder="Why are you researching this company?&#10;&#10;Examples:&#10;• I want to explore a partnership opportunity.&#10;• I am preparing for an investor meeting.&#10;• I want to evaluate them as a vendor.&#10;• I need competitor intelligence.&#10;• I am preparing for a sales meeting."
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (e.target.value.trim()) setPurposeError('');
                }}
                rows={6}
                maxLength={600}
                className={`border rounded-lg px-4 py-3 bg-white w-full text-base transition-colors duration-200 outline-none resize-none leading-relaxed ${
                  purposeError ? 'border-red-500 focus:border-red-500' : 'border-chalk focus:border-amber'
                }`}
              />
              {purposeError && (
                <span className="text-xs text-red-600 font-medium mt-1 block">
                  {purposeError}
                </span>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              className="w-full bg-amber text-white font-semibold rounded-lg px-6 py-3.5 hover:opacity-90 active:scale-[0.99] transition-all duration-200 text-base"
            >
              Generate Brief →
            </button>
          </form>

          {/* Used For Pills - Mobile/Tablet list under form (Below md) */}
          <div className="md:hidden mt-12 w-full max-w-xl text-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone block mb-4">
              Used For
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(PURPOSE_TEMPLATES).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handlePillClick(label)}
                  className="border border-[#E5E2DB] rounded-full px-3 py-1 text-xs text-[#888480] hover:border-amber/50 hover:bg-paper active:scale-95 transition-all duration-200 select-none font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Desktop Spacer (for balance) */}
        <div className="hidden md:block w-48"></div>

      </div>
    </div>
  );
}

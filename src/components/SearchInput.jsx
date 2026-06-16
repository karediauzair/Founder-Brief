import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Target, ShieldCheck, Zap, Search, FileText, CheckCircle2 } from 'lucide-react';

const PURPOSE_TEMPLATES = {
  "Investor Meeting": "I am preparing for an investor meeting and would like to understand the company's growth indicators, market position, business model, competitive advantages, and potential risks.",
  "Partnership": "I am exploring a potential partnership with this company. Help me understand their strategic initiatives, collaboration opportunities, current partnerships, and key discussion points.",
  "Competitor": "I am researching this company as a competitor. Help me understand their strengths, weaknesses, market position, differentiation, and competitive threats.",
  "Vendor Eval": "I am evaluating this company as a potential vendor or service provider. Help me assess reliability, reputation, capabilities, risks, and suitability.",
  "Sales Prep": "I am preparing for a sales discussion. Help me understand their priorities, challenges, opportunities, and relevant talking points."
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
    if (!purpose.trim()) {
      setPurpose(`I want to explore collaboration and partnership opportunities with ${name}.`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-100 selection:text-blue-900 fade-in">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">FounderBrief</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#" className="hover:text-gray-900 transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        
        {/* Hero & Search Section */}
        <section className="pt-24 pb-20 px-6 text-center max-w-[1200px] mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-8 border border-gray-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Premium Business Intelligence
          </div>
          
          <h1 className="text-5xl md:text-[64px] font-extrabold text-gray-900 leading-[1.1] max-w-4xl mx-auto tracking-tight">
            Know Any Company In 30 Seconds
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            FounderBrief transforms hours of company research into actionable business intelligence and meeting preparation insights.
          </p>

          <p className="text-sm text-gray-400 mt-4 max-w-2xl mx-auto">
            Prepare for investor meetings, partnership discussions, vendor evaluations, sales conversations, and competitor research using AI-powered intelligence briefs.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-2xl mx-auto mt-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-left relative z-10"
          >
            {/* Company Name / URL */}
            <div className="mb-6">
              <label htmlFor="company" className="text-xs font-semibold text-gray-700 block mb-2">
                Company Name or URL
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  className={`pl-11 pr-4 py-3 bg-gray-50/50 border rounded-xl w-full text-sm transition-colors duration-200 outline-none ${
                    companyError ? 'border-red-500 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 hover:border-gray-300'
                  }`}
                />
              </div>
              {companyError && (
                <span className="text-xs text-red-600 font-medium mt-1.5 block">
                  {companyError}
                </span>
              )}
              
              {/* Suggestion Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-gray-500">
                <span className="font-medium">Try:</span>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="hover:text-gray-900 font-medium transition-colors duration-150 underline decoration-gray-200 underline-offset-4 hover:decoration-gray-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Research Purpose */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="purpose" className="text-xs font-semibold text-gray-700 block">
                  Research Purpose
                </label>
                <span className={`text-[10px] font-medium ${
                  purpose.length > 500 ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {purpose.length}/500
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(PURPOSE_TEMPLATES).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handlePillClick(label)}
                    className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 select-none font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <textarea
                id="purpose"
                placeholder="Why are you researching this company? (e.g., I am preparing for a partnership meeting to discuss API integration)"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (e.target.value.trim()) setPurposeError('');
                }}
                rows={4}
                maxLength={600}
                className={`px-4 py-3 bg-gray-50/50 border rounded-xl w-full text-sm transition-colors duration-200 outline-none resize-none leading-relaxed ${
                  purposeError ? 'border-red-500 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 hover:border-gray-300'
                }`}
              />
              {purposeError && (
                <span className="text-xs text-red-600 font-medium mt-1 block">
                  {purposeError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-medium rounded-xl px-6 py-3.5 hover:bg-gray-800 active:scale-[0.99] transition-all duration-200 text-sm shadow-sm flex items-center justify-center gap-2"
            >
              Generate Intelligence Brief
              <Zap className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Company Intelligence</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Understand any company quickly with aggregated, high-quality data.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Target className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Goal-Specific Insights</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Research perfectly tailored to your objective, not generic summaries.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Meeting Strategy</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Receive actionable preparation guidance and intelligent questions to ask.</p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Source Transparency</h3>
                <p className="text-sm text-gray-500 leading-relaxed">View all sources, confidence levels, and data quality notes to ensure trust.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-[#FAFAFA]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-16 tracking-tight">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-gray-200 z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-xl font-bold text-gray-900">
                  1
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Enter Company Name</h3>
                <p className="text-sm text-gray-500">Provide the name or URL of the target company.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-xl font-bold text-gray-900">
                  2
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Define Research Purpose</h3>
                <p className="text-sm text-gray-500">Tell us what you want to achieve in your meeting.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md text-xl font-bold">
                  3
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Generate Intelligence Brief</h3>
                <p className="text-sm text-gray-500">Receive a polished, actionable report in 30 seconds.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900">FounderBrief</span>
            <span className="text-xs text-gray-400 ml-2">© 2026</span>
          </div>
          
          <div className="text-xs text-gray-500 text-center md:text-right">
            Built by Team <span className="font-semibold text-gray-700">TheFirewallCrew</span><br/>
            Karedia Uzair, Chougle Talha, Shaikh Amr, Shaikh Abdurrahman
          </div>
        </div>
      </footer>
    </div>
  );
}

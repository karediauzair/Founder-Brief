import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Target, ShieldCheck, Zap, Search, FileText, CheckCircle2, Database, Users, Bell, Download } from 'lucide-react';

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

  const [recentSearches, setRecentSearches] = useState([]);

  // Autofocus the company name input on load
  useEffect(() => {
    if (companyInputRef.current) {
      companyInputRef.current.focus();
    }
    const saved = localStorage.getItem('fb_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
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
      const newSearch = company.trim();
      let updated = [newSearch, ...recentSearches.filter(s => s.toLowerCase() !== newSearch.toLowerCase())].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem('fb_recent_searches', JSON.stringify(updated));
      onSearch(newSearch, purpose.trim());
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
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">FounderBrief</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#upcoming" className="hover:text-gray-900 transition-colors">What's Next</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 px-4">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-12 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-8 border border-gray-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Premium Business Intelligence
          </div>
          <h1 className="text-5xl md:text-[64px] font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Know Any Company <br className="md:hidden" />
            <span className="text-blue-600">In 30 Seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            AI-powered meeting intelligence for founders, investors, consultants, and operators.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Turn hours of company research into actionable meeting preparation, strategic insights, and decision-ready intelligence.
          </p>
        </div>

        {/* Main Search Card */}
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm fade-in relative z-10" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit}>
            
            {/* Company Name */}
            <div className="mb-6">
              <label htmlFor="company" className="text-xs font-semibold text-gray-700 block mb-2">
                Company Name or URL
              </label>
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-4" />
                <input
                  id="company"
                  ref={companyInputRef}
                  type="text"
                  placeholder="e.g., Notion, Stripe, or notion.so"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (e.target.value.trim()) setCompanyError('');
                  }}
                  className={`pl-12 pr-4 py-3 bg-gray-50/50 border rounded-xl w-full text-sm md:text-base font-medium transition-colors duration-200 outline-none ${
                    companyError ? 'border-red-300 focus:border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-blue-500 focus:bg-white'
                  }`}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              {companyError && <p className="text-red-500 text-xs mt-2 font-medium">{companyError}</p>}
              
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                <span className="font-medium mr-1">{recentSearches.length > 0 ? "Recent:" : "Try:"}</span>
                {(recentSearches.length > 0 ? recentSearches : SUGGESTIONS).map((suggestion) => (
                  <div key={suggestion} className="flex items-center group relative bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1 hover:border-gray-300 transition-colors shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="hover:text-gray-900 font-medium transition-colors duration-150 mr-1 text-gray-600"
                    >
                      {suggestion}
                    </button>
                    {recentSearches.length > 0 && (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentSearches.filter(s => s !== suggestion);
                          setRecentSearches(updated);
                          localStorage.setItem('fb_recent_searches', JSON.stringify(updated));
                        }}
                        className="text-gray-400 hover:bg-red-100 hover:text-red-500 rounded-full p-0.5 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    )}
                  </div>
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
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.keys(PURPOSE_TEMPLATES).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handlePillClick(label)}
                    className="px-3 py-1 rounded-full border border-gray-200 bg-white text-[11px] font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
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
                  purposeError ? 'border-red-300 focus:border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-blue-500 focus:bg-white'
                }`}
              />
              {purposeError && <p className="text-red-500 text-xs mt-2 font-medium">{purposeError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white rounded-xl py-3.5 md:py-4 px-6 font-semibold text-sm md:text-base hover:bg-gray-800 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              Generate Intelligence Brief
              <Zap className="w-4 h-4" />
            </button>
          </form>
        </div>


      </main>

      {/* Feature Highlights */}
      <section id="features" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything you need to prepare</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Get complete context on any company before your next big meeting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-4 shadow-sm text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Company Intelligence</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Understand any company quickly with aggregated, high-quality data.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center mb-4 shadow-sm text-purple-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Goal-Specific Insights</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Research tailored exactly to your objective, not generic summaries.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center mb-4 shadow-sm text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Meeting Strategy</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Actionable preparation guidance and intelligent questions to ask.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center mb-4 shadow-sm text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Source Transparency</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Every insight is backed by cited sources and checked for data quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 tracking-tight">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-gray-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-xl font-bold text-gray-900">
                1
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Enter Company Name</h3>
              <p className="text-sm text-gray-500">Provide the name or URL of the target company.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-xl font-bold text-gray-900">
                2
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Define Research Purpose</h3>
              <p className="text-sm text-gray-500">Tell us what you want to achieve in your meeting.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm text-xl font-bold text-gray-900">
                3
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Generate Intelligence Brief</h3>
              <p className="text-sm text-gray-500">Receive a polished, actionable report in 30 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section id="upcoming" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-600 mb-8 border border-blue-100">
            <Zap className="w-3.5 h-3.5" /> Coming Soon
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">What's Next for FounderBrief</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-5 border border-gray-100 rounded-xl bg-[#FAFAFA]">
              <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mb-3 text-blue-600">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">CRM Integration</h4>
              <p className="text-sm text-gray-500">Automatically sync briefs to Salesforce and HubSpot.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl bg-[#FAFAFA]">
              <div className="w-8 h-8 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center mb-3 text-purple-600">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Team Collaboration</h4>
              <p className="text-sm text-gray-500">Share briefs with your team and add private notes.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl bg-[#FAFAFA]">
              <div className="w-8 h-8 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center mb-3 text-orange-600">
                <Bell className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Automated Monitoring</h4>
              <p className="text-sm text-gray-500">Get alerts when a target company has major news.</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl bg-[#FAFAFA]">
              <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center mb-3 text-green-600">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Export to Notion</h4>
              <p className="text-sm text-gray-500">1-click export to your existing Notion workspaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-[1200px] mx-auto py-12 px-6 mt-20 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo-icon.png" alt="Logo" className="h-6 w-auto" />
            <span className="font-bold text-gray-900 tracking-tight">FounderBrief</span>
          </div>
          <p className="text-xs text-gray-500 max-w-xs">
            AI-Powered Meeting Intelligence Platform
          </p>
          <p className="text-[10px] text-gray-400 mt-4">
            &copy; 2026 FounderBrief. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Built By Team Firewall Crew</p>
          <p className="text-xs font-semibold text-gray-700 mb-1">Team Members:</p>
          <p className="text-[11px] text-gray-500 mb-4 max-w-[200px]">
            Karedia Uzair, Chougle Talha, Shaikh Amr, Shaikh Abdurrahman
          </p>

        </div>
      </footer>
    </div>
  );
}

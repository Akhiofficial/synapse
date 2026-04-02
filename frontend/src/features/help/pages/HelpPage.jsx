import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboard/components/Sidebar';
import Topbar from '../../dashboard/components/Topbar';
import { DashboardProvider } from '../../dashboard/store/DashboardContext';
import { CollectionsProvider } from '../../collections/store/CollectionsContext';

const HelpSection = ({ title, icon, children, delay = "0ms" }) => (
  <div 
    className="glass-card p-8 hover:bg-white/10 transition-all duration-500 group animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-start gap-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 group-hover:scale-110 group-hover:bg-brand-orange/20 transition-all duration-500">
        <span className="material-symbols-outlined text-brand-orange text-3xl font-fill-1">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">{title}</h3>
        <div className="text-slate-400 leading-relaxed font-body text-sm space-y-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const HelpContent = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Neural Links & Capturing",
      icon: "bolt",
      delay: "100ms",
      content: (
        <>
          <p>The <strong>New Neural Link</strong> button is your primary gateway to Synapse. You can capture:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Web URLs</span>: Automatically parsed and summarized.</li>
            <li><span className="text-white font-medium">Text Snippets</span>: Quick thoughts or copied research.</li>
            <li><span className="text-white font-medium">Images & Documents</span>: Visual memories and PDF research papers.</li>
          </ul>
        </>
      )
    },
    {
      title: "AI Analysis & Insights",
      icon: "psychology",
      delay: "200ms",
      content: (
        <>
          <p>Every item you capture is processed by our <strong>Predictive Engine</strong>. Synapse provides:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Intelligent Summaries</span>: Digest long content in seconds.</li>
            <li><span className="text-white font-medium">Auto-Tagging</span>: Semantic categories added automatically.</li>
            <li><span className="text-white font-medium">Key Takeaways</span>: Bullet points of the most relevant info.</li>
          </ul>
        </>
      )
    },
    {
      title: "Neural Graph Visualization",
      icon: "account_tree",
      delay: "300ms",
      content: (
        <>
          <p>Visualize the connections in your second brain. The <strong>Graph View</strong> helps you:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Spacial Relations</span>: See which ideas cluster together.</li>
            <li><span className="text-white font-medium">Discovery</span>: Find non-obvious links between different concepts.</li>
            <li><span className="text-white font-medium">Navigation</span>: Jump to related items through their connections.</li>
          </ul>
        </>
      )
    },
    {
      title: "Collections & Curation",
      icon: "folder_open",
      delay: "400ms",
      content: (
        <>
          <p>Organize your knowledge into themed hubs. Use <strong>Collections</strong> to:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Thematic Grouping</span>: Projects, research topics, or reading lists.</li>
            <li><span className="text-white font-medium">Custom Curation</span>: Drag and drop items into specialized folders.</li>
            <li><span className="text-white font-medium">Focused Workspace</span>: Ditch the noise and work within a specific context.</li>
          </ul>
        </>
      )
    },
    {
      title: "Semantic AI Search",
      icon: "search",
      delay: "500ms",
      content: (
        <>
          <p>Quit searching for keywords, start searching for ideas. Our <strong>Natural Language Search</strong> allows:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Concept Search</span>: Find topics even if the exact words aren't there.</li>
            <li><span className="text-white font-medium">Deep Querying</span>: "Show me my notes about quantum physics from last month."</li>
            <li><span className="text-white font-medium">Fast Retrieval</span>: Instant access across all your neural links.</li>
          </ul>
        </>
      )
    },
    {
      title: "Highlights & Annotation",
      icon: "border_color",
      delay: "600ms",
      content: (
        <>
          <p>Engage with your content directly. Inside any item, you can:</p>
          <ul className="list-disc ml-4 space-y-2">
            <li><span className="text-white font-medium">Smart Highlighting</span>: Select text to save it as a neural fragment.</li>
            <li><span className="text-white font-medium">Personal Notes</span>: Add your own thoughts and context to saved items.</li>
            <li><span className="text-white font-medium">Persistent Context</span>: Your annotations are saved alongside the AI summaries.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-24 px-8 pb-24 max-w-7xl mx-auto">
        <header className="mb-16 animate-fade-in text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/5 blur-[120px] rounded-full -z-10"></div>
          <h1 className="text-5xl font-display font-bold mb-6 tracking-tight">
            Welcome to <span className="text-accent-gradient">Synapse</span> Help
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Master your digital second brain. Use this guide to explore the high-end capabilities of your neural network.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <HelpSection 
              key={index}
              title={feature.title}
              icon={feature.icon}
              delay={feature.delay}
            >
              {feature.content}
            </HelpSection>
          ))}
        </div>

        <section className="mt-24 glass-card p-12 border-brand-orange/10 relative overflow-hidden group animate-slide-up" style={{ animationDelay: "700ms" }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[100px] rounded-full -z-10 group-hover:bg-brand-orange/10 transition-all duration-700"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="material-symbols-outlined text-brand-orange text-5xl mb-6 font-fill-1 animate-float">info</span>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Amplify Your Mind?</h2>
            <p className="text-slate-400 font-body mb-8">
              Synapse isn't just a place to store data—it's an interactive partner that grows with your knowledge. Keep capturing, and the AI will get better at resurfacing exactly what you need, when you need it.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Start Exploring
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-[-1]"></div>
    </div>
  );
};

const HelpPage = () => (
  <DashboardProvider>
    <CollectionsProvider>
      <HelpContent />
    </CollectionsProvider>
  </DashboardProvider>
);

export default HelpPage;


import React, { useState } from 'react';
import { generateSouthpawIdea } from '../services/geminiService';

const Submit: React.FC = () => {
  const [type, setType] = useState<'real' | 'fake'>('real');
  const [problem, setProblem] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<any>(null);

  const handleGenerate = async () => {
    if (!problem.trim()) return;
    setIsGenerating(true);
    const idea = await generateSouthpawIdea(problem);
    if (idea) setGeneratedIdea(idea);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-16">
      <div className="text-center mb-12">
         <h1 className="text-4xl font-black tracking-tight mb-4">The Southpaw Idea Lab</h1>
         <p className="text-slate-600 dark:text-slate-400 text-lg">
           Help us end the right-handed monopoly. Submit a real ergonomic tool or pitch a genius fake concept.
         </p>
      </div>

      <div className="bg-white dark:bg-[#1a2335] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex h-12 bg-slate-100 dark:bg-background-dark p-1 rounded-xl mb-10">
          <button 
            onClick={() => setType('real')}
            className={`flex-1 rounded-lg text-sm font-bold transition-all ${type === 'real' ? 'bg-white dark:bg-[#1a2335] text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Submit Real Gear
          </button>
          <button 
            onClick={() => setType('fake')}
            className={`flex-1 rounded-lg text-sm font-bold transition-all ${type === 'fake' ? 'bg-white dark:bg-[#1a2335] text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pitch Fake Idea
          </button>
        </div>

        {type === 'real' ? (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" placeholder="e.g. Left-handed Can Opener Pro" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Buy Link or Official Site</label>
              <input type="url" className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Why is it great for Southpaws?</label>
              <textarea rows={4} className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" placeholder="Explain the ergonomic advantage..." />
            </div>
            <div className="pt-4">
              <button className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform">
                Submit to Registry
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-300">What's the right-handed problem you want to solve?</label>
               <textarea 
                 value={problem}
                 onChange={(e) => setProblem(e.target.value)}
                 rows={3} 
                 className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                 placeholder="e.g. Notebook wires biting my hand, pencil sharpeners rotating the wrong way..." 
               />
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating || !problem.trim()}
                 className="flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 px-6 rounded-xl font-bold hover:bg-primary hover:text-white transition-all w-full"
               >
                 <span className="material-symbols-outlined">{isGenerating ? 'refresh' : 'auto_awesome'}</span>
                 {isGenerating ? 'Generating Lefty Genius...' : 'Generate Idea with AI'}
               </button>
            </div>

            {generatedIdea && (
              <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                   <span className="material-symbols-outlined">lightbulb</span>
                   Idea Generated
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white">{generatedIdea.name}</h3>
                 <p className="text-lg font-bold text-primary italic">"{generatedIdea.tagline}"</p>
                 <ul className="space-y-2 pt-4">
                    {generatedIdea.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                        {f}
                      </li>
                    ))}
                 </ul>
                 <div className="pt-6">
                   <button className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30">
                     Add to the Hall of Fame
                   </button>
                 </div>
              </div>
            )}
            
            <p className="text-center text-xs text-slate-400 font-medium">
               Submitting a fake idea helps raise awareness of the daily ergonomic challenges lefties face.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submit;

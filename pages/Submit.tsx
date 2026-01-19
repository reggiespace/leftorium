import React, { useState } from 'react';
import { generateSouthpawIdea } from '../services/geminiService';
import { StrapiService } from '../services/strapiService';
import { Category } from '../types';

const Submit: React.FC = () => {
  const [type, setType] = useState<'real' | 'fake'>('real');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real product state
  const [formData, setFormData] = useState({
    title: '',
    category: Category.KITCHEN,
    price: '',
    shortDescription: '',
    description: '',
    features: '',
    artUrl: '',
    isReal: true
  });

  // ... (Fake idea state)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format payload for Strapi
    const payload = {
      data: {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: formData.category,
        price: formData.price || 'N/A',
        short_description: formData.shortDescription,
        description: formData.description,
        is_real: true,
        features: formData.features.split('\n').filter(f => f.trim() !== ''),
        art_url: formData.artUrl
      }
    };

    try {
      await StrapiService.submitProduct(payload);
      alert('Product submitted successfully!');
      // Reset form or redirect? keeping it simple for now as per instructions
      setFormData({
        title: '',
        category: Category.KITCHEN,
        price: '',
        shortDescription: '',
        description: '',
        features: '',
        artUrl: '',
        isReal: true
      });
    } catch (error) {
      console.error(error);
      alert('Failed to submit product to Strapi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFakeSubmit = async () => {
    if (!generatedIdea) return;
    setIsSubmitting(true);

    const payload = {
      data: {
        title: generatedIdea.name,
        problem: problem,
        tagline: generatedIdea.tagline,
        features: generatedIdea.features,
        votes: 0
      }
    };

    try {
      await StrapiService.submitSuggestion(payload);
      alert('Idea submitted to the Hall of Fame!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit suggestion.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form className="space-y-6" onSubmit={handleRealSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. Left-handed Can Opener Pro" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Price</label>
                <input 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                  placeholder="$12.99" 
                />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Image URL</label>
                <input 
                  required
                  name="artUrl"
                  value={formData.artUrl}
                  onChange={handleInputChange}
                  type="url" 
                  className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                  placeholder="https://..." 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Short Description</label>
              <input 
                required
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                type="text" 
                className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                placeholder="Brief summary for the product card..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Description (Markdown)</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4} 
                className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                placeholder="Explain the ergonomic advantage in detail..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Features (One per line)</label>
              <textarea 
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={4} 
                className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                placeholder="- Reversed blades&#10;- Ergonomic grip&#10;- High-carbon steel" 
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform">
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
                   <button 
                     onClick={handleFakeSubmit}
                     className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform"
                   >
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

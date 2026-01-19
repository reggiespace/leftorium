import React, { useState } from 'react';
// import { generateSouthpawIdea } from '../services/geminiService';
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

  // Fake idea state
  const [fakeFormData, setFakeFormData] = useState({
    title: '',
    problem: '',
    tagline: '',
    features: ''
  });

  const handleFakeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFakeFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleFakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      data: {
        title: fakeFormData.title,
        problem: fakeFormData.problem,
        tagline: fakeFormData.tagline,
        features: fakeFormData.features.split('\n').filter(f => f.trim() !== ''),
        votes: 0
      }
    };

    try {
      await StrapiService.submitSuggestion(payload);
      alert('Idea submitted to the Hall of Fame!');
      setFakeFormData({
        title: '',
        problem: '',
        tagline: '',
        features: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to submit suggestion.');
    } finally {
      setIsSubmitting(false);
    }
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
          <form className="space-y-6" onSubmit={handleFakeSubmit}>
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Idea Name</label>
               <input 
                 required
                 name="title"
                 value={fakeFormData.title}
                 onChange={handleFakeInputChange}
                 type="text" 
                 className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                 placeholder="e.g. The Ambi-Coffee Mug" 
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-300">The Problem It Solves</label>
               <textarea 
                 required
                 name="problem"
                 value={fakeFormData.problem}
                 onChange={handleFakeInputChange}
                 rows={2} 
                 className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                 placeholder="What's annoying you?" 
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tagline</label>
               <input 
                 required
                 name="tagline"
                 value={fakeFormData.tagline}
                 onChange={handleFakeInputChange}
                 type="text" 
                 className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                 placeholder="Catchy slogan..." 
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Features (One per line)</label>
               <textarea 
                 name="features"
                 value={fakeFormData.features}
                 onChange={handleFakeInputChange}
                 rows={4} 
                 className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary" 
                 placeholder="- Feature 1&#10;- Feature 2" 
               />
             </div>

             <div className="pt-4">
               <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] transition-transform">
                 Add to Hall of Fame
               </button>
             </div>
             
             <p className="text-center text-xs text-slate-400 font-medium">
               Submitting a fake idea helps raise awareness of the daily ergonomic challenges lefties face.
             </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Submit;

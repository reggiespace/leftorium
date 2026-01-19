
import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-black uppercase tracking-widest text-xs">Where Left is Right</span>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            About Leftorium
          </h1>
        </div>

        {/* Intro */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200">
            Welcome to Leftorium, where the 10% of us who are left-handed are finally in the majority!
          </p>
          <p>
            The name is a playful nod to a famous "Simpsons" episode, and much like its animated counterpart, 
            Leftorium is a place where all things left-handed are celebrated and, in our own unique way, made available. 
            Our mission is to shine a light on the daily, often unnoticed, challenges of navigating a world designed for the right-handed.
          </p>
        </div>

        {/* Righteous & Left Behind */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Righteous & Left Behind</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Ever felt like an afterthought in a world of right-handed scissors, can openers, and even spiral notebooks? 
            That feeling of being "left behind" is the very reason this website exists. For the 90% of the population who are right-handed, 
            the world just works. But for lefties, simple tasks can become a frustrating puzzle. This is our stage to humorously 
            and thoughtfully showcase a series of "products" that highlight and solve these everyday problems.
          </p>
        </div>

        {/* Hero Image */}
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl relative">
          <img 
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200" 
            alt="Creative Workspace" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white font-medium text-sm">
            Artistic representation of left-handedness
          </div>
        </div>

        {/* Left is Right */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Left is Right</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
             <p>
                Here at Leftorium, we firmly believe that left is right. Our goal is to call attention to the myriad of ways our world is built 
                for right-handed convenience. From the direction zippers close to the design of school desks, the right-handed bias is everywhere. 
                While our "products" may be conceptual, the problems they aim to solve are very real.
             </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-4xl">info</span>
                <div>
                  <h4 className="text-xl font-bold mb-2">Did you know?</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Approximately <strong>10% of the global population</strong> is left-handed. That's over 780 million people who often have to adapt, 
                    contort, and make do with tools not designed for them. This can range from the merely annoying, like smudging ink while writing, 
                    to the genuinely hazardous when operating certain power tools.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Common Designs Grid */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Consider these common right-hand-centric designs:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <DesignCard 
               icon="cut" 
               title="Scissors" 
               description="The blades are oriented for right-handed use, making it difficult for lefties to see their cutting line and apply proper pressure." 
             />
             <DesignCard 
               icon="menu_book" 
               title="Spiral Notebooks" 
               description="A classic lefty nemesis, the spiral binding gets in the way of natural hand placement, forcing an uncomfortable writing position." 
             />
             <DesignCard 
               icon="restaurant" 
               title="Can Openers" 
               description="The cranking mechanism and gear placement are designed for right-hand operation, turning a simple kitchen task into an awkward maneuver." 
             />
             <DesignCard 
               icon="mouse" 
               title="Computer Mice" 
               description="While settings can often be adjusted, the ergonomic design of many mice is contoured for the right hand." 
             />
             <DesignCard 
               icon="restaurant_menu" 
               title="Vegetable Peelers" 
               description="Most peelers are designed to be pulled towards the user with the right hand, making them inefficient and sometimes dangerous for lefties." 
             />
          </div>
        </div>

        {/* Conclusion */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
           <p>
              Through our curated showcase of "products," we hope to foster a greater understanding and appreciation for the challenges faced by the left-handed community. 
              Our aim is to spark conversation and encourage a more inclusive approach to design in the real world. So, have a look around, share a laugh, 
              and perhaps see the world from a slightly different, left-handed perspective.
           </p>
        </div>
        
        {/* CTA */}
        <div className="bg-primary text-white p-10 rounded-3xl text-center space-y-6">
           <h3 className="text-3xl font-black">Ready to join the revolution?</h3>
           <p className="text-lg opacity-90 max-w-xl mx-auto">Explore our curated gear or share your own "Lefty Life" hacks with our growing community.</p>
           <Link to="/products">
             <button className="bg-white text-primary px-10 py-4 rounded-xl font-black text-lg hover:bg-slate-100 transition-colors cursor-pointer">
                Browse the Catalog
             </button>
           </Link>
        </div>
      </div>
    </div>
  );
};

const DesignCard: React.FC<{icon: string, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="p-6 bg-white dark:bg-[#151d2c] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default About;

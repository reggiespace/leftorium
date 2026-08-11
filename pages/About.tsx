import React from 'react';
import { PRINCIPLES } from '../mockData';

const About: React.FC = () => {
  return (
    <div className="px-5 md:px-10 pt-[52px] pb-20 max-w-[900px] mx-auto">
      <h1 className="mb-5 text-4xl md:text-[42px] font-medium tracking-[-0.025em]">
        Who we are, and what this is for
      </h1>
      <p className="mb-4 max-w-[60ch] text-[17px] text-ink-dim text-pretty">
        Leftorium is not a shop. Nothing here is for sale, and nothing here earns us anything. It is a display case for a problem most people never see: the physical world has a default hand, and it isn't ours.
      </p>
      <p className="mb-4 max-w-[60ch] text-[15px] text-ink-dim text-pretty">
        Half of the catalogue is real gear that already exists — often hard to find, often priced as a novelty for being nothing more than a mirror image. The other half we invented, some of it sensible enough that it should exist, some of it deliberately ridiculous. Each carries a small mark. We keep the mark small on purpose.
      </p>
      <p className="mb-8 max-w-[60ch] text-[15px] text-ink-dim text-pretty">
        If you have ever smudged a whole page, cut a crooked line with the wrong scissors, or paid double for a mirrored version of an ordinary object, you already understand the joke. If you haven't, flip the switch in the header and spend five minutes as one of us.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-[30px] border-t border-border">
        {PRINCIPLES.map((v) => (
          <div key={v.h}>
            <div className="h-px w-9 bg-primary mb-3" />
            <h3 className="mb-2 text-lg font-medium">{v.h}</h3>
            <p className="text-sm text-ink-mute text-pretty">{v.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;

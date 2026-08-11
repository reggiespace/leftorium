import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ImgPlaceholder } from '../components/ImgPlaceholder';
import { HERO_IMAGE_URL } from '../lib/assets';
import { STATS } from '../mockData';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ProductService.getFeatured(4).then(setFeatured);
    ProductService.getAll().then((all) => setTotal(all.length));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-14 items-center px-5 md:px-10 pt-16 md:pt-[88px] pb-16 max-w-[1320px] mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 font-mono-tag text-[11px] tracking-[0.16em] uppercase text-primary mb-6">
            <span className="w-[22px] h-px bg-primary" />
            An awareness project, disguised as a shop
          </div>
          <h1 className="mb-[22px] text-5xl md:text-7xl leading-[1.03] tracking-[-0.03em] font-medium text-pretty">
            Everything here is
            <br />
            built the other way round.
          </h1>
          <p className="mb-3.5 max-w-[53ch] text-[17px] text-ink-dim text-pretty">
            Leftorium is a catalogue of tools made for the ten percent of people the world forgot to design for. Some of them you can actually buy. Some of them we invented with a machine because nobody has bothered to make them yet.
          </p>
          <p className="mb-8 max-w-[53ch] text-sm text-ink-faint">We never sell anything. We just point at the gap.</p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary rounded-lg text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              Browse the catalogue →
            </Link>
            <Link
              to="/submit"
              className="inline-flex items-center px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-white/[0.07] transition-colors"
            >
              Submit a product
            </Link>
          </div>
        </div>
        <figure className="m-0">
          <ImgPlaceholder
            label={'hero photo — a left hand\nmid-task, shot on black'}
            src={HERO_IMAGE_URL}
            aspect="aspect-[4/3.2]"
          />
          <figcaption className="mt-2 text-[11px] text-ink-faint">
            Drop the hero image here. Dark background, please — it blends into the page.
          </figcaption>
        </figure>
      </section>

      {/* Most viewed shelf */}
      <section className="px-5 md:px-10 pb-[76px] max-w-[1320px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
          <div>
            <h2 className="mb-1.5 text-3xl font-medium tracking-[-0.02em]">On the shelf this week</h2>
            <p className="text-sm text-ink-faint">Sorted by what people keep coming back to look at.</p>
          </div>
          <Link to="/products" className="text-sm text-primary whitespace-nowrap">
            All {total || '12'} tools →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-accent px-5 md:px-10 py-16 border-y border-border">
        <div className="max-w-[1320px] mx-auto">
          <p className="mb-8 font-mono-tag text-[11px] tracking-[0.16em] uppercase text-primary-hover">
            Why a joke shop exists
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
            {STATS.map((s) => (
              <div key={s.n}>
                <div className="text-5xl font-medium tracking-[-0.03em] leading-none mb-2.5">{s.n}</div>
                <div className="h-px w-11 bg-primary mb-3" />
                <p className="text-sm text-accent-foreground text-pretty">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-up explainer */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-14 px-5 md:px-10 py-[76px] max-w-[1320px] mx-auto">
        <div>
          <h2 className="mb-4 text-3xl font-medium tracking-[-0.02em]">Half of this catalogue is a lie</h2>
          <p className="mb-3 text-[15px] text-ink-dim max-w-[52ch] text-pretty">
            Every entry carries one small mark:{' '}
            <span className="font-mono-tag text-[10px] tracking-[0.1em] text-ink-dim border border-border rounded px-1.5 py-0.5">
              REAL
            </span>{' '}
            if you can buy it somewhere on this planet,{' '}
            <span className="font-mono-tag text-[10px] tracking-[0.1em] text-ink-dim border border-border rounded px-1.5 py-0.5">
              AI
            </span>{' '}
            if we made it up.
          </p>
          <p className="text-[15px] text-ink-dim max-w-[52ch] text-pretty">
            We deliberately made the mark quiet. If you have to look twice to work out whether a left-handed tool is real, that is the whole point of the site.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-3xl font-medium tracking-[-0.02em]">There is a switch in the header</h2>
          <p className="mb-3 text-[15px] text-ink-dim max-w-[52ch] text-pretty">
            It says LEFTY. Flip it to RIGHTY and the site rearranges itself for the other 90% — everything jumps to the far side, the ink smudges under your hand, and nothing is quite where you reach for it.
          </p>
          <p className="text-[15px] text-ink-dim max-w-[52ch] text-pretty">Most people flip it once. Lefties live there.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

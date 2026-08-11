import React, { useState } from 'react';
import { Category } from '../types';
import { StrapiService } from '../services/strapiService';

type Kind = 'real' | 'fake';

const SEG_BASE = 'cursor-pointer select-none px-3.5 py-1.5 text-[13px] transition-colors';

const SegButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${SEG_BASE} ${active ? 'text-primary shadow-[inset_0_0_0_1px_var(--primary)]' : 'text-ink-dim'}`}
  >
    {children}
  </button>
);

const fieldClass =
  'w-full min-h-9 px-2.5 py-1.5 text-sm text-foreground bg-background border border-border rounded-lg placeholder:text-ink-faint focus:border-primary transition-colors';

const Submit: React.FC = () => {
  const [kind, setKind] = useState<Kind>('real');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.KITCHEN);
  const [sourceOrLook, setSourceOrLook] = useState('');
  const [reasoning, setReasoning] = useState('');

  const pickKind = (k: Kind) => {
    setKind(k);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (kind === 'real') {
        await StrapiService.submitProduct({
          data: {
            title: name,
            category,
            is_real: true,
            source_or_look: sourceOrLook,
            reasoning,
          },
        });
      } else {
        await StrapiService.submitSuggestion({
          data: {
            title: name,
            category,
            source_or_look: sourceOrLook,
            reasoning,
          },
        });
      }
      setSubmitted(true);
      setName('');
      setSourceOrLook('');
      setReasoning('');
    } catch (err) {
      console.error(err);
      alert("Couldn't reach the submission queue. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-5 md:px-10 pt-[52px] pb-20 max-w-[820px] mx-auto">
      <h1 className="mb-2.5 text-4xl md:text-[42px] font-medium tracking-[-0.025em]">Submit a product</h1>
      <p className="mb-[30px] max-w-[58ch] text-[15px] text-ink-dim text-pretty">
        Found something genuinely left-handed out in the wild? Send it and we will verify it. Got an idea that should exist but doesn't? Describe it and we will have a machine build the picture.
      </p>

      <div className="inline-flex border border-border rounded-lg overflow-hidden mb-[26px]">
        <SegButton active={kind === 'real'} onClick={() => pickKind('real')}>
          A real product I found
        </SegButton>
        <SegButton active={kind === 'fake'} onClick={() => pickKind('fake')}>
          A product that should exist
        </SegButton>
      </div>

      <div className="bg-card border border-border rounded-[14px] px-6 md:px-7 py-[26px]">
        <p className="mb-[22px] text-sm text-ink-mute text-pretty">
          {kind === 'real'
            ? 'We check that it is buyable somewhere and that it is genuinely mirrored rather than just marketed at us. Verified entries get the REAL mark.'
            : 'Describe it well enough that a machine can picture it. If we like it, we generate the render and it goes up with the AI mark.'}
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[18px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="md:col-span-2">
            <label className="block mb-1.5 text-xs text-ink-dim">Name of the tool</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reversed-blade kitchen shears"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs text-ink-dim">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={fieldClass}
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-xs text-ink-dim">
              {kind === 'real' ? 'Where can we find it?' : 'What does it look like?'}
            </label>
            <input
              required
              value={sourceOrLook}
              onChange={(e) => setSourceOrLook(e.target.value)}
              placeholder={kind === 'real' ? 'Link, shop name, or the town you saw it in' : 'Matte steel, mirrored grip, deeply unnecessary'}
              className={fieldClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1.5 text-xs text-ink-dim">
              Why a right-handed person has never noticed this problem
            </label>
            <textarea
              required
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Be specific. Bonus points for scars."
              rows={4}
              className={`${fieldClass} resize-y`}
            />
          </div>
        </form>

        <div className="flex items-center justify-between gap-4 mt-[22px] flex-wrap">
          <span className="font-mono-tag text-[11px] text-ink-faint">
            {kind === 'real' ? '14 submissions in the verification queue' : '31 ideas waiting on the render queue'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name || !sourceOrLook || !reasoning}
            className="inline-flex items-center px-5 py-2.5 border border-primary rounded-lg text-primary font-medium disabled:opacity-40 hover:bg-primary/10 transition-colors"
          >
            {submitting ? 'Sending…' : kind === 'real' ? 'Send for verification' : 'Send to the Idea Lab'}
          </button>
        </div>
      </div>

      {submitted && (
        <div className="mt-5 px-5 py-[18px] border border-primary rounded-[14px] bg-primary/[0.08]">
          <p className="mb-1 font-mono-tag text-[10px] tracking-[0.14em] uppercase text-primary">
            Awaiting approval
          </p>
          <p className="text-sm text-ink-dim">
            {kind === 'real'
              ? 'Thank you. A human lefty will check it exists, then it joins the shelf with a REAL mark.'
              : 'Thank you. If it survives the approval round we will have the machine draw it, mark it AI, and let people argue in the comments.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Submit;

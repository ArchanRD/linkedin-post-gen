import React from 'react';
import { PostImageLayout, LayoutOption } from '../types';
import { Check, Sparkles, LayoutGrid, Columns, Square, LayoutTemplate } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: PostImageLayout | null;
  onSelectLayout: (layout: PostImageLayout) => void;
  disabled?: boolean;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'single-hero',
    title: 'Single Hero Spotlight',
    subtitle: '1 High-Impact Visual',
    imageCount: 1,
    description: 'A bold, panoramic keynote or banner graphic that commands immediate attention in the feed.',
    wireframe: '1',
  },
  {
    id: 'dual-split',
    title: 'Dual Perspective Split',
    subtitle: '2 Side-by-Side Visuals',
    imageCount: 2,
    description: 'Pairs a mainstage keynote snapshot with a vibrant community networking or workshop moment.',
    wireframe: '1+1',
  },
  {
    id: 'triptych-grid',
    title: 'Triptych Editorial Grid',
    subtitle: '3 Balanced Visuals (1 Hero + 2 Stacked)',
    imageCount: 3,
    description: 'Dynamic editorial arrangement with one prominent feature card flanked by two detail snapshots.',
    wireframe: '1+2',
  },
  {
    id: 'quad-mosaic',
    title: 'Quad Event Mosaic',
    subtitle: '4 Visuals (2x2 Grid Collage)',
    imageCount: 4,
    description: 'Full collage capturing keynotes, panel discussions, live demos, and community networking.',
    wireframe: '2x2',
  },
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onSelectLayout,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-slate-900">
            Select Visual Post Layout <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose how Gemini AI should generate and arrange your LinkedIn post images.
          </p>
        </div>
        {selectedLayout && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {LAYOUT_OPTIONS.find((l) => l.id === selectedLayout)?.imageCount} Images Selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = selectedLayout === layout.id;

          return (
            <button
              key={layout.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLayout(layout.id)}
              className={`relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              {/* Checkmark indicator badge */}
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 group-hover:border-slate-400 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>

              <div>
                {/* Visual Wireframe Preview Box */}
                <div className="w-full h-24 mb-3 rounded-xl bg-slate-100/90 border border-slate-200/80 p-2 flex items-center justify-center overflow-hidden">
                  {layout.wireframe === '1' && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/90 shadow-xs">
                      <LayoutTemplate className="w-6 h-6" />
                    </div>
                  )}

                  {layout.wireframe === '1+1' && (
                    <div className="w-full h-full grid grid-cols-2 gap-1.5">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/90">
                        <Columns className="w-5 h-5" />
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white/90">
                        <Columns className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {layout.wireframe === '1+2' && (
                    <div className="w-full h-full grid grid-cols-2 gap-1.5">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/90">
                        <Square className="w-5 h-5" />
                      </div>
                      <div className="grid grid-rows-2 gap-1.5">
                        <div className="rounded bg-gradient-to-br from-amber-500 to-orange-600"></div>
                        <div className="rounded bg-gradient-to-br from-teal-500 to-emerald-600"></div>
                      </div>
                    </div>
                  )}

                  {layout.wireframe === '2x2' && (
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5">
                      <div className="rounded bg-blue-500"></div>
                      <div className="rounded bg-indigo-600"></div>
                      <div className="rounded bg-emerald-500"></div>
                      <div className="rounded bg-rose-500"></div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {layout.title}
                  </h4>
                </div>

                <p className="text-xs font-medium text-blue-600 mt-0.5">
                  {layout.subtitle}
                </p>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {layout.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">
                  {layout.imageCount} {layout.imageCount === 1 ? 'Asset' : 'Assets'}
                </span>
                <span className="text-blue-600 font-medium">Gemini Nano / Imagen</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

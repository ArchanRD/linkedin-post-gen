import React from 'react';
import { PostImageLayout, LayoutOption } from '../types';
import { Check, Sparkles, Columns, LayoutTemplate, Image as ImageIcon, PanelLeft, PanelRight, Layers } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: PostImageLayout | null;
  onSelectLayout: (layout: PostImageLayout) => void;
  disabled?: boolean;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'text-up-image-below',
    title: 'Text Up & Image Below',
    subtitle: 'Classic Feed • 5 Images',
    imageCount: 5,
    description: 'Post copy on top followed by an interactive multi-image carousel below.',
    wireframe: 'text-up',
  },
  {
    id: 'text-left-image-right',
    title: 'Text Left & Image Right',
    subtitle: 'Side-by-Side Split • 5 Images',
    imageCount: 5,
    description: 'Formatted copy on the left column with interactive image reel on the right.',
    wireframe: 'text-left',
  },
  {
    id: 'text-right-image-left',
    title: 'Text Right & Image Left',
    subtitle: 'Visual Split • 5 Images',
    imageCount: 5,
    description: 'Post text on the right paired with high-res image showcase on the left.',
    wireframe: 'text-right',
  },
  {
    id: 'image-only',
    title: 'Image Only',
    subtitle: 'Visual Showcase • 5 Images',
    imageCount: 5,
    description: 'Focuses entirely on high-impact visual imagery with an expandable post caption.',
    wireframe: 'image-only',
  },
  {
    id: 'text-on-image-fullscreen',
    title: 'Text on Image Full Screen',
    subtitle: 'Cinematic Overlay • 5 Images',
    imageCount: 5,
    description: 'Headline and insights overlaid directly on full-bleed photography with image switcher.',
    wireframe: 'text-overlay',
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
            Select Single Post Layout Design <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose your single post layout. At least 5 real conference images will be generated via Nano Banana for your selected design.
          </p>
        </div>
        {selectedLayout && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Min 5 Images • Nano Banana
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = selectedLayout === layout.id;

          return (
            <button
              key={layout.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLayout(layout.id)}
              className={`relative text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              {/* Checkmark indicator badge */}
              <div
                className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors z-10 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 group-hover:border-slate-400 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </div>

              <div>
                {/* Visual Wireframe Preview Box */}
                <div className="w-full h-24 mb-3 rounded-xl bg-slate-100 border border-slate-200/80 p-2 flex flex-col items-center justify-center overflow-hidden">
                  {/* 1. Text Up & Image Below */}
                  {layout.wireframe === 'text-up' && (
                    <div className="w-full h-full flex flex-col gap-1.5">
                      <div className="h-6 rounded bg-slate-200 p-1 flex flex-col justify-around">
                        <div className="h-1 bg-slate-400 rounded-full w-4/5"></div>
                        <div className="h-1 bg-slate-400 rounded-full w-3/5"></div>
                      </div>
                      <div className="flex-1 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white/90 shadow-2xs relative overflow-hidden">
                        <ImageIcon className="w-4 h-4" />
                        <span className="absolute bottom-0.5 right-1 text-[8px] bg-black/40 px-1 rounded text-white font-mono">1/5</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Text Left & Image Right */}
                  {layout.wireframe === 'text-left' && (
                    <div className="w-full h-full grid grid-cols-2 gap-1.5">
                      <div className="rounded bg-slate-200 p-1.5 flex flex-col justify-around">
                        <div className="h-1 bg-slate-400 rounded-full w-full"></div>
                        <div className="h-1 bg-slate-400 rounded-full w-4/5"></div>
                        <div className="h-1 bg-slate-400 rounded-full w-3/5"></div>
                      </div>
                      <div className="rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white/90 relative overflow-hidden">
                        <PanelRight className="w-4 h-4" />
                        <span className="absolute bottom-0.5 right-1 text-[8px] bg-black/40 px-1 rounded text-white font-mono">5</span>
                      </div>
                    </div>
                  )}

                  {/* 3. Image Left & Text Right */}
                  {layout.wireframe === 'text-right' && (
                    <div className="w-full h-full grid grid-cols-2 gap-1.5">
                      <div className="rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white/90 relative overflow-hidden">
                        <PanelLeft className="w-4 h-4" />
                        <span className="absolute bottom-0.5 left-1 text-[8px] bg-black/40 px-1 rounded text-white font-mono">5</span>
                      </div>
                      <div className="rounded bg-slate-200 p-1.5 flex flex-col justify-around">
                        <div className="h-1 bg-slate-400 rounded-full w-full"></div>
                        <div className="h-1 bg-slate-400 rounded-full w-4/5"></div>
                        <div className="h-1 bg-slate-400 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  )}

                  {/* 4. Image Only */}
                  {layout.wireframe === 'image-only' && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex flex-col items-center justify-center text-white/90 shadow-2xs relative p-2">
                      <ImageIcon className="w-6 h-6 text-blue-300" />
                      <div className="flex gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                      </div>
                    </div>
                  )}

                  {/* 5. Text on Image Full Screen */}
                  {layout.wireframe === 'text-overlay' && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-tr from-slate-950 via-blue-900 to-indigo-700 relative p-1.5 flex flex-col justify-end overflow-hidden border border-white/10">
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]"></div>
                      <div className="relative z-10 space-y-1">
                        <div className="h-1.5 bg-white rounded-full w-3/4 shadow-xs"></div>
                        <div className="h-1 bg-blue-200 rounded-full w-1/2"></div>
                      </div>
                      <span className="absolute top-1 right-1 text-[8px] bg-black/50 px-1 rounded text-blue-300 font-bold">HERO</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {layout.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                    {layout.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {layout.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-bold text-slate-700">
                  {layout.imageCount} Images
                </span>
                <span className="text-blue-600 font-semibold">Real Photos</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

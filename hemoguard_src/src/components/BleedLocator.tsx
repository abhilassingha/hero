import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HemoData } from '../types';
import { cn } from '../lib/utils';

interface BleedLocatorProps { data: HemoData; }

const ZONES: Record<string, { front:[number,number]; back:[number,number]; label:string }> = {
  RUQ:  { front:[118,196], back:[118,196], label:'Right upper quadrant' },
  LUQ:  { front:[82, 196], back:[82, 196], label:'Left upper quadrant'  },
  RLQ:  { front:[118,228], back:[118,228], label:'Right lower quadrant' },
  LLQ:  { front:[82, 228], back:[82, 228], label:'Left lower quadrant'  },
  PELV: { front:[100,260], back:[100,260], label:'Pelvic region'        },
  THOR: { front:[100,152], back:[100,152], label:'Thoracic cavity'      },
  NECK: { front:[100, 88], back:[100, 88], label:'Cervical region'      },
};

const BleedMarker = ({ cx, cy }: { cx:number; cy:number }) => (
  <g>
    <circle cx={cx} cy={cy} r="24" fill="#ff3b3b0a" stroke="#ff3b3b" strokeWidth="0.7" strokeDasharray="3 2" className="animate-pulse-bleed"/>
    <circle cx={cx} cy={cy} r="14" fill="#ff3b3b18" stroke="#ff3b3b" strokeWidth="1"/>
    <circle cx={cx} cy={cy} r="6"  fill="#ff3b3b80"/>
    <circle cx={cx} cy={cy} r="3"  fill="#ff6060"/>
    <line x1={cx+17} y1={cy-10} x2={cx+48} y2={cy-35} stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="3 2"/>
    <circle cx={cx+48} cy={cy-35} r="2.5" fill="#00d4ff"/>
    <text x={cx+52} y={cy-38} fill="#00d4ff" fontSize="9" fontFamily="system-ui" fontWeight="700" letterSpacing="0.5">BLEED</text>
  </g>
);

function BodySVG({ view, bleedZone, bleedDetected }: { view:'front'|'back'; bleedZone:string; bleedDetected:boolean }) {
  const coords = ZONES[bleedZone]?.[view] ?? [100,200];
  const S = { fill:'#0f1830', stroke:'#2a3d5e', strokeWidth:1.5 };
  const dim = { fill:'#1e2a42' };
  return (
    <svg viewBox="0 0 200 440" style={{ width:'100%', maxHeight:370 }}>
      {/* belts */}
      <rect x="55" y="125" width="90" height="5" rx="2.5" fill="#00d4ff" opacity="0.4"/>
      <rect x="55" y="190" width="90" height="5" rx="2.5" fill="#00d4ff" opacity="0.3"/>
      <rect x="55" y="248" width="90" height="4" rx="2"   fill="#00d4ff" opacity="0.25"/>
      <rect x="32"  y="310" width="36" height="4" rx="2"   fill="#00d4ff" opacity="0.25"/>
      <rect x="132" y="310" width="36" height="4" rx="2"   fill="#00d4ff" opacity="0.25"/>
      <rect x="82"  y="83"  width="36" height="4" rx="2"   fill="#00d4ff" opacity="0.3"/>

      {/* head */}
      <ellipse cx="100" cy="46" rx="30" ry="36" {...S}/>
      <ellipse cx="100" cy="16" rx="28" ry="11" fill="#1a2a42"/>
      <ellipse cx="68"  cy="50" rx="5" ry="8" {...S}/>
      <ellipse cx="132" cy="50" rx="5" ry="8" {...S}/>
      {view==='front' && <>
        <ellipse cx="88"  cy="50" rx="4" ry="5" {...dim} opacity="0.8"/>
        <ellipse cx="112" cy="50" rx="4" ry="5" {...dim} opacity="0.8"/>
        <path d="M90 65 Q100 70 110 65" fill="none" stroke="#2a3d5e" strokeWidth="1" strokeLinecap="round"/>
      </>}
      {view==='back' && <ellipse cx="100" cy="22" rx="27" ry="13" fill="#1a2a42"/>}

      {/* neck */}
      <rect x="86" y="80" width="28" height="20" rx="6" {...S}/>

      {/* shoulders */}
      <path d="M62 99 Q47 101 42 116 L37 148 Q36 156 43 157 L59 157 Q63 153 63 146 L66 109 Z" {...S}/>
      <path d="M138 99 Q153 101 158 116 L163 148 Q164 156 157 157 L141 157 Q137 153 137 146 L134 109 Z" {...S}/>

      {/* torso */}
      <path d="M62 99 Q57 97 52 100 L50 277 Q50 284 58 285 L142 285 Q150 284 150 277 L148 100 Q143 97 138 99 Q118 104 100 104 Q82 104 62 99 Z" {...S}/>
      {view==='front' && <>
        <path d="M66 118 Q83 126 100 124 Q117 126 134 118" fill="none" stroke="#1e2a42" strokeWidth="1"/>
        <line x1="100" y1="130" x2="100" y2="272" stroke="#1e2a42" strokeWidth="0.8"/>
        <line x1="71"  y1="165" x2="129" y2="165" stroke="#1e2a42" strokeWidth="0.8"/>
        <line x1="69"  y1="197" x2="131" y2="197" stroke="#1e2a42" strokeWidth="0.8"/>
        <line x1="68"  y1="228" x2="132" y2="228" stroke="#1e2a42" strokeWidth="0.8"/>
        <path d="M68 107 Q84 114 100 112 Q116 114 132 107" fill="none" stroke="#2a3d5e" strokeWidth="1.2"/>
      </>}
      {view==='back' && <>
        <line x1="100" y1="108" x2="100" y2="277" stroke="#1e2a42" strokeWidth="1.2"/>
        <ellipse cx="78"  cy="148" rx="16" ry="20" fill="none" stroke="#1e2a42" strokeWidth="1"/>
        <ellipse cx="122" cy="148" rx="16" ry="20" fill="none" stroke="#1e2a42" strokeWidth="1"/>
        <path d="M58 170 Q62 205 66 244" fill="none" stroke="#1e2a42" strokeWidth="0.9"/>
        <path d="M142 170 Q138 205 134 244" fill="none" stroke="#1e2a42" strokeWidth="0.9"/>
      </>}

      {/* upper arms */}
      <path d="M43 120 L31 178 Q29 187 36 190 L51 190 Q57 187 57 178 L59 122 Z" {...S}/>
      <path d="M157 120 L169 178 Q171 187 164 190 L149 190 Q143 187 143 178 L141 122 Z" {...S}/>

      {/* forearms */}
      <path d="M36 188 L26 238 Q25 246 31 247 L47 247 Q53 246 52 238 L51 188 Z" {...S}/>
      <path d="M164 188 L174 238 Q175 246 169 247 L153 247 Q147 246 148 238 L149 188 Z" {...S}/>

      {/* hands */}
      <ellipse cx="36"  cy="253" rx="9" ry="11" {...S}/>
      <ellipse cx="164" cy="253" rx="9" ry="11" {...S}/>

      {/* hips */}
      <path d="M50 280 Q50 291 55 296 L80 296 L81 276 Z" {...S}/>
      <path d="M150 280 Q150 291 145 296 L120 296 L119 276 Z" {...S}/>

      {/* thighs */}
      <path d="M57 294 L51 368 Q50 377 58 378 L79 378 Q86 377 85 368 L83 294 Z" {...S}/>
      <path d="M143 294 L149 368 Q150 377 142 378 L121 378 Q114 377 115 368 L117 294 Z" {...S}/>

      {/* knees */}
      <ellipse cx="67"  cy="381" rx="14" ry="10" {...S}/>
      <ellipse cx="133" cy="381" rx="14" ry="10" {...S}/>

      {/* shins */}
      <path d="M55 389 L52 432 Q51 439 58 440 L77 440 Q84 439 83 432 L80 389 Z" {...S}/>
      <path d="M145 389 L148 432 Q149 439 142 440 L123 440 Q116 439 117 432 L120 389 Z" {...S}/>

      {bleedDetected && <BleedMarker cx={coords[0]} cy={coords[1]}/>}
    </svg>
  );
}

function DepthView({ data }: { data: HemoData }) {
  const pct = Math.min((data.bleedDepth / 15) * 100, 100);
  const layers = [
    { label:'Epidermis',    pct:1.5,  bg:'#243352' },
    { label:'Subcutaneous', pct:10,   bg:'#1c2a44' },
    { label:'Fascia',       pct:4,    bg:'#162038' },
    { label:'Muscle',       pct:25,   bg:'#10192e' },
    { label:'Peritoneum',   pct:8,    bg:'#0c1426' },
    { label:'Visceral fat', pct:18,   bg:'#09101f' },
    { label:'Organ / vessel', pct:33.5, bg:'#060c17' },
  ];
  return (
    <div className="flex-1 flex flex-col gap-3 px-4 pt-3 pb-2">
      <div className="section-label text-center tracking-widest">Tissue depth cross-section</div>
      <div className="relative rounded-xl overflow-hidden border border-medical-border" style={{height:200}}>
        <div className="absolute inset-0 flex flex-col">
          {layers.map((l,i)=>(
            <div key={i} style={{height:`${l.pct}%`, background:l.bg}}
                 className="relative flex items-center border-b border-medical-border/10 last:border-0">
              <span className="absolute left-2 text-[8px] text-medical-disabled uppercase tracking-widest">{l.label}</span>
            </div>
          ))}
        </div>
        {/* Scale on right */}
        {[0,3,6,9,12,15].map(d=>(
          <div key={d} className="absolute right-2 text-[8px] text-medical-disabled"
               style={{top:`${(d/15)*100}%`, transform:'translateY(-50%)'}}>
            {d}cm
          </div>
        ))}
        {/* Bleed line */}
        <motion.div
          initial={{top:'0%'}} animate={{top:`${pct}%`}} transition={{duration:1.2, ease:'easeOut'}}
          className="absolute left-0 right-0 h-[2px] bg-medical-critical z-10"
          style={{boxShadow:'0 0 10px rgba(255,59,59,0.9)'}}>
          <div className="absolute left-2 -top-5 bg-medical-critical/90 text-white text-[10px] font-black px-2 py-0.5 rounded">
            ▶ {data.bleedDepth.toFixed(1)} cm — {data.bleedZone}
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          {l:'Depth',      v:`${data.bleedDepth.toFixed(1)} cm`, c:'text-medical-critical'},
          {l:'Vessel type',v:data.vesselType,                    c:'text-medical-warning'},
          {l:'AI conf.',   v:`${Math.round(data.confidenceScore*100)}%`, c:'text-medical-ai'},
        ].map(x=>(
          <div key={x.l} className="bg-medical-card border border-medical-border rounded-xl p-3 text-center">
            <div className="section-label mb-1">{x.l}</div>
            <div className={cn('text-sm font-bold',x.c)}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BleedLocator: React.FC<BleedLocatorProps> = ({ data }) => {
  const [tab, setTab] = useState<'front'|'back'|'depth'>('front');
  const zone = ZONES[data.bleedZone];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-medical-border bg-medical-header">
        {(['front','back','depth'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn('flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-200',
              tab===t ? 'text-medical-ai border-b-2 border-medical-ai bg-medical-ai/5'
                      : 'text-medical-disabled hover:text-medical-secondary')}>
            {t==='front'?'Anterior':t==='back'?'Posterior':'Depth'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}
          transition={{duration:.15}}
          className="flex-1 flex flex-col overflow-hidden">
          {tab!=='depth' ? (
            <div className="flex-1 flex items-center justify-center px-8 py-2 min-h-0">
              <div style={{width:'100%', maxWidth:180}}>
                <BodySVG view={tab} bleedZone={data.bleedZone} bleedDetected={data.bleedDetected}/>
              </div>
            </div>
          ) : (
            <DepthView data={data}/>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="border-t border-medical-border bg-medical-header px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="section-label mb-0.5">Zone detected</div>
          <div className="text-sm font-bold text-medical-white truncate">{zone?.label ?? data.bleedZone}</div>
          <div className="text-[11px] text-medical-secondary mt-0.5 leading-snug">
            {data.vesselType} · {data.bleedDepth.toFixed(1)} cm · {data.bleedRateMlMin} mL/min
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="section-label mb-1">Confidence</div>
          <div className="text-xl font-black text-medical-ai">{Math.round(data.confidenceScore*100)}%</div>
          <div className="w-20 h-1.5 bg-medical-border rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-medical-ai rounded-full transition-all duration-700"
                 style={{width:`${data.confidenceScore*100}%`}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

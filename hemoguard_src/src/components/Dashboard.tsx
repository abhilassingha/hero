import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HemoData } from '../types';
import { cn } from '../lib/utils';
import { Activity, Droplets, Heart, Wind, AlertTriangle } from 'lucide-react';

interface DashboardProps { data: HemoData; }

const SHOCK_META = [
  { cls:1, label:'Mild',         ml:'<750 mL',   color:'#44ff99' },
  { cls:2, label:'Moderate',     ml:'750–1500',  color:'#ffcc44' },
  { cls:3, label:'Severe',       ml:'1500–2000', color:'#ff8c00' },
  { cls:4, label:'Life-threat',  ml:'>2000 mL',  color:'#ff3b3b' },
];

function Ring({ value, max, color, size=52 }: { value:number; max:number; color:string; size?:number }) {
  const r = (size-6)/2, circ = 2*Math.PI*r;
  const pct = Math.min(value/max, 1);
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2a42" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
              strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
              strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{transition:'stroke-dashoffset 0.8s ease-out'}}/>
    </svg>
  );
}

function MetricCard({ label, value, unit, icon, status, ring }:
  { label:string; value:number|string; unit:string; icon:React.ReactNode; status:'ok'|'warn'|'crit'; ring?:{val:number;max:number} }) {
  const palette = {
    ok:   { border:'border-medical-normal/20',   bg:'bg-medical-normal/5',   text:'text-medical-normal',   ring:'#44ff99' },
    warn: { border:'border-medical-warning/30',  bg:'bg-medical-warning/5',  text:'text-medical-warning',  ring:'#ffcc44' },
    crit: { border:'border-medical-critical/30', bg:'bg-medical-critical/8', text:'text-medical-critical', ring:'#ff3b3b' },
  }[status];

  return (
    <div className={cn('rounded-2xl border p-3 flex flex-col gap-2 transition-colors duration-500', palette.border, palette.bg)}>
      <div className="flex items-center justify-between">
        <span className="section-label">{label}</span>
        <span className={palette.text}>{icon}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <motion.span key={String(value)}
            initial={{opacity:0.4,y:4}} animate={{opacity:1,y:0}} transition={{duration:.3}}
            className={cn('text-3xl font-black leading-none tracking-tighter', palette.text)}>
            {value}
          </motion.span>
          <span className="text-[11px] text-medical-secondary ml-1">{unit}</span>
        </div>
        {ring && <Ring value={ring.val} max={ring.max} color={palette.ring}/>}
      </div>
    </div>
  );
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const active = SHOCK_META[data.shockClass - 1];

  return (
    <div className="flex flex-col gap-0">
      {/* Patient strip */}
      <div className="bg-medical-header border-b border-medical-border px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-medical-ai/15 border border-medical-ai/30 flex items-center justify-center text-medical-ai text-xs font-black">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-medical-white leading-tight">DOE, John</div>
          <div className="text-[10px] text-medical-secondary">34 yrs · 82 kg · Casevac #004</div>
        </div>
        {data.bleedDetected && (
          <motion.div animate={{opacity:[1,0.4,1]}} transition={{repeat:Infinity,duration:1.1}}
            className="flex items-center gap-1.5 bg-medical-critical/15 border border-medical-critical/60 px-2.5 py-1.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-medical-critical"/>
            <span className="text-[10px] font-black text-medical-critical tracking-wide">ALERT</span>
          </motion.div>
        )}
      </div>

      {/* Alert banner */}
      <AnimatePresence>
        {data.bleedDetected && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            className="overflow-hidden">
            <div className="bg-medical-critical/10 border-b border-medical-critical/40 px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-medical-critical animate-pulse-critical flex-shrink-0"/>
              <span className="text-[11px] font-bold text-medical-critical uppercase tracking-wider leading-snug">
                Active hemorrhage · {data.bleedZone} · {data.vesselType} · {data.bleedDepth.toFixed(1)} cm
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 flex flex-col gap-3">
        {/* 4-metric grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <MetricCard label="Heart rate" value={data.vitals.hr} unit="bpm"
            icon={<Heart className="w-3.5 h-3.5"/>}
            status={data.vitals.hr > 110 ? 'crit' : 'ok'}
            ring={{val:data.vitals.hr, max:200}}/>
          <MetricCard label="Shock index" value={data.vitals.shockIndex} unit="SI"
            icon={<Activity className="w-3.5 h-3.5"/>}
            status={data.vitals.shockIndex > 1.2 ? 'crit' : data.vitals.shockIndex > 0.9 ? 'warn' : 'ok'}
            ring={{val:data.vitals.shockIndex*100, max:200}}/>
          <MetricCard label="Blood loss" value={data.volumeEstimateMl} unit="mL"
            icon={<Droplets className="w-3.5 h-3.5"/>}
            status={data.volumeEstimateMl > 500 ? 'crit' : data.volumeEstimateMl > 250 ? 'warn' : 'ok'}
            ring={{val:data.volumeEstimateMl, max:2000}}/>
          <MetricCard label="SpO₂" value={data.vitals.spo2} unit="%"
            icon={<Wind className="w-3.5 h-3.5"/>}
            status={data.vitals.spo2 < 90 ? 'crit' : data.vitals.spo2 < 95 ? 'warn' : 'ok'}
            ring={{val:data.vitals.spo2, max:100}}/>
        </div>

        {/* Bleed rate bar */}
        <div className="bg-medical-card border border-medical-border rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Bleed rate</span>
            <span className="text-medical-critical text-xs font-black">{data.bleedRateMlMin} mL/min</span>
          </div>
          <div className="h-2 bg-medical-border rounded-full overflow-hidden">
            <motion.div className="h-full bg-medical-critical rounded-full"
              initial={{width:0}} animate={{width:`${Math.min((data.bleedRateMlMin/50)*100,100)}%`}}
              transition={{duration:0.8, ease:'easeOut'}}/>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-medical-disabled">0</span>
            <span className="text-[9px] text-medical-disabled">50 mL/min critical</span>
          </div>
        </div>

        {/* Shock class */}
        <div className="bg-medical-card border border-medical-border rounded-2xl p-3">
          <div className="section-label mb-2.5">Hemorrhagic shock class</div>
          <div className="flex gap-1.5">
            {SHOCK_META.map(s => (
              <div key={s.cls}
                className={cn('flex-1 rounded-lg py-2 px-1 text-center transition-all duration-500 border',
                  data.shockClass === s.cls
                    ? 'border-opacity-100 bg-opacity-20'
                    : 'border-medical-border bg-transparent opacity-40')}
                style={data.shockClass===s.cls ? {borderColor:s.color,background:`${s.color}18`} : {}}>
                <div className="text-[8px] font-black uppercase tracking-wider"
                     style={data.shockClass===s.cls ? {color:s.color} : {color:'#445577'}}>
                  Class {s.cls}
                </div>
                <div className="text-[7px] mt-0.5"
                     style={data.shockClass===s.cls ? {color:s.color,opacity:0.8} : {color:'#445577'}}>
                  {s.ml}
                </div>
              </div>
            ))}
          </div>
          {active && (
            <div className="mt-2 text-[10px] font-bold text-center" style={{color:active.color}}>
              {active.label} hemorrhage — est. {data.volumeEstimateMl} mL lost
            </div>
          )}
        </div>

        {/* Interventions */}
        <div className="bg-medical-card border border-medical-border rounded-2xl p-3">
          <div className="section-label mb-2">Recommended interventions</div>
          <div className="flex flex-wrap gap-1.5">
            {data.interventionFlags.map((f,i) => (
              <div key={f}
                className={cn('px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border',
                  i===0 ? 'bg-medical-critical/15 border-medical-critical/60 text-medical-critical'
                        : i===1 ? 'bg-medical-warning/15 border-medical-warning/50 text-medical-warning'
                               : 'bg-medical-ai/10 border-medical-ai/40 text-medical-ai')}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

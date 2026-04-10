import React from 'react';
import { HemoData } from '../types';
import { cn } from '../lib/utils';
import { Download, Share2, Clock, Cpu, Siren } from 'lucide-react';

interface FullReportProps { data: HemoData; }

const Row = ({ label, value, color }: { label:string; value:string; color?:string }) => (
  <div className="flex items-center justify-between py-2 border-b border-medical-border/30 last:border-0">
    <span className="text-[11px] text-medical-secondary">{label}</span>
    <span className={cn('text-[11px] font-bold text-right max-w-[55%] leading-snug', color ?? 'text-medical-white')}>{value}</span>
  </div>
);

const Section = ({ title, icon, children }: { title:string; icon:React.ReactNode; children:React.ReactNode }) => (
  <div className="bg-medical-card border border-medical-border rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-medical-border bg-medical-header">
      <span className="text-medical-ai">{icon}</span>
      <span className="section-label">{title}</span>
    </div>
    <div className="px-4 py-1">{children}</div>
  </div>
);

export const FullReport: React.FC<FullReportProps> = ({ data }) => (
  <div className="flex flex-col h-full bg-medical-bg">
    <div className="px-4 py-3 border-b border-medical-border bg-medical-header flex items-center justify-between">
      <div>
        <div className="text-sm font-bold text-medical-white">Clinical report</div>
        <div className="text-[10px] text-medical-secondary">Session #004 · 12:24 UTC · HemoGuard v2.4</div>
      </div>
      <div className="flex gap-1.5">
        <button className="p-2 bg-medical-card border border-medical-border rounded-xl hover:bg-medical-border/50 transition-colors">
          <Download className="w-4 h-4 text-medical-secondary"/>
        </button>
        <button className="p-2 bg-medical-card border border-medical-border rounded-xl hover:bg-medical-border/50 transition-colors">
          <Share2 className="w-4 h-4 text-medical-secondary"/>
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <Section title="Hemorrhage assessment" icon={<Siren className="w-3.5 h-3.5"/>}>
        <Row label="Bleed detected"   value={data.bleedDetected ? 'Confirmed' : 'Negative'} color={data.bleedDetected?'text-medical-critical':undefined}/>
        <Row label="Location"         value={data.bleedZone}          color="text-medical-ai"/>
        <Row label="Vessel type"      value={data.vesselType}         color="text-medical-warning"/>
        <Row label="Depth"            value={`${data.bleedDepth.toFixed(1)} cm`} color="text-medical-ai"/>
        <Row label="Est. volume"      value={`${data.volumeEstimateMl} mL`}  color="text-medical-critical"/>
        <Row label="Bleed rate"       value={`${data.bleedRateMlMin} mL/min`} color="text-medical-critical"/>
        <Row label="AI confidence"    value={`${Math.round(data.confidenceScore*100)}%`} color="text-medical-ai"/>
      </Section>

      <Section title="Vitals &amp; shock" icon={<Cpu className="w-3.5 h-3.5"/>}>
        <Row label="Heart rate"    value={`${data.vitals.hr} bpm`}   color={data.vitals.hr>110?'text-medical-critical':'text-medical-normal'}/>
        <Row label="Blood pressure" value={data.vitals.bp}/>
        <Row label="SpO₂"          value={`${data.vitals.spo2}%`}    color={data.vitals.spo2<92?'text-medical-critical':'text-medical-normal'}/>
        <Row label="Shock index"   value={String(data.vitals.shockIndex)} color={data.vitals.shockIndex>1?'text-medical-critical':'text-medical-warning'}/>
        <Row label="Shock class"   value={`Class ${data.shockClass} of 4`} color="text-medical-critical"/>
      </Section>

      <Section title="Event timeline" icon={<Clock className="w-3.5 h-3.5"/>}>
        <div className="py-2 space-y-3">
          {[
            { t:'12:24:02', txt:'Belts applied — 12 sensor modalities active', c:'text-medical-normal' },
            { t:'12:24:15', txt:'Sensor fusion lock achieved — AI inference started', c:'text-medical-ai'   },
            { t:'12:25:10', txt:`Hemorrhage alert: ${data.bleedZone} ${data.vesselType}`, c:'text-medical-critical' },
            { t:'12:25:11', txt:'Intervention protocol generated — TXA recommended', c:'text-medical-warning' },
          ].map(e => (
            <div key={e.t} className="flex gap-3 items-start">
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', e.c==='text-medical-critical'?'bg-medical-critical':e.c==='text-medical-ai'?'bg-medical-ai':'bg-medical-normal')}/>
              </div>
              <div>
                <div className="text-[10px] text-medical-disabled font-mono">{e.t}</div>
                <div className={cn('text-[11px]',e.c)}>{e.txt}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interventions" icon={<Siren className="w-3.5 h-3.5"/>}>
        <div className="py-2 flex flex-wrap gap-2">
          {data.interventionFlags.map((f,i)=>(
            <span key={f} className={cn('px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wide',
              i===0?'bg-medical-critical/15 border-medical-critical/50 text-medical-critical'
                   :i===1?'bg-medical-warning/15 border-medical-warning/50 text-medical-warning'
                          :'bg-medical-ai/10 border-medical-ai/40 text-medical-ai')}>
              {f}
            </span>
          ))}
        </div>
      </Section>

      <button className="w-full bg-medical-ai/10 border border-medical-ai/50 text-medical-ai font-black py-3 rounded-2xl uppercase tracking-widest text-[11px] hover:bg-medical-ai/20 active:scale-[.98] transition-all">
        Export HL7 FHIR record
      </button>
    </div>
  </div>
);

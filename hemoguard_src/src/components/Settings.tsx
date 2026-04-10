import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Wifi, Battery, ShieldAlert, Sliders, User } from 'lucide-react';

function Toggle({ defaultOn=false }: { defaultOn?:boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={()=>setOn(!on)}
      className={cn('w-10 h-6 rounded-full border transition-all duration-300 relative flex-shrink-0',
        on ? 'bg-medical-ai/20 border-medical-ai' : 'bg-transparent border-medical-border')}>
      <div className={cn('absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300',
        on ? 'left-[18px] bg-medical-ai' : 'left-0.5 bg-medical-disabled')}/>
    </button>
  );
}

function Section({ title, icon, children }: { title:string; icon:React.ReactNode; children:React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-medical-ai">{icon}</span>
        <span className="section-label">{title}</span>
      </div>
      <div className="bg-medical-card border border-medical-border rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, right, border=true }: { label:string; right:React.ReactNode; border?:boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3',border&&'border-b border-medical-border/40')}>
      <span className="text-[12px] text-medical-white">{label}</span>
      {right}
    </div>
  );
}

function Val({ v, color }: { v:string; color?:string }) {
  return <span className={cn('text-[11px] font-bold', color ?? 'text-medical-secondary')}>{v}</span>;
}

export const Settings: React.FC = () => (
  <div className="flex flex-col h-full bg-medical-bg">
    <div className="px-4 py-3 border-b border-medical-border bg-medical-header">
      <div className="text-sm font-bold text-medical-white">System settings</div>
      <div className="text-[10px] text-medical-secondary">HemoGuard v2.4 · Firmware 1.8.2</div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      <Section title="Session" icon={<User className="w-3.5 h-3.5"/>}>
        <Row label="Operator ID"    right={<Val v="MED-772"/>}/>
        <Row label="Unit number"    right={<Val v="AMB-12"/>}/>
        <Row label="Session start"  right={<Val v="12:24:02 UTC"/>} border={false}/>
      </Section>

      <Section title="Alert thresholds" icon={<ShieldAlert className="w-3.5 h-3.5"/>}>
        <Row label="Critical bleed alerts"  right={<Toggle defaultOn/>}/>
        <Row label="Haptic feedback"        right={<Toggle defaultOn/>}/>
        <Row label="Audio alarms"           right={<Toggle/>}/>
        <Row label="HL7 auto-sync"          right={<Toggle/>} border={false}/>
      </Section>

      <Section title="Hardware" icon={<Wifi className="w-3.5 h-3.5"/>}>
        <Row label="Hub"               right={<Val v="● Connected" color="text-medical-normal"/>}/>
        <Row label="Belt A (thoracic)" right={<Val v="● Connected" color="text-medical-normal"/>}/>
        <Row label="Belt B (pelvic)"   right={<Val v="● Connected" color="text-medical-normal"/>}/>
        <Row label="Scanner module"    right={<Val v="● Docked"    color="text-medical-ai"/>} border={false}/>
      </Section>

      <Section title="Power" icon={<Battery className="w-3.5 h-3.5"/>}>
        <Row label="Hub battery" right={
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-medical-border rounded-full overflow-hidden">
              <div className="h-full bg-medical-normal rounded-full" style={{width:'87%'}}/>
            </div>
            <Val v="87%" color="text-medical-normal"/>
          </div>
        }/>
        <Row label="Est. runtime" right={<Val v="5h 20m"/>} border={false}/>
      </Section>

      <Section title="Display" icon={<Sliders className="w-3.5 h-3.5"/>}>
        <Row label="Dark mode (tactical)"  right={<Toggle defaultOn/>}/>
        <Row label="Units"                 right={<Val v="mL · cm · °C"/>}/>
        <Row label="Language"              right={<Val v="EN / HI"/>} border={false}/>
      </Section>

      <div className="text-center pt-2 pb-6">
        <div className="text-[10px] text-medical-disabled">HemoGuard · AFMC Hackathon 2025</div>
        <div className="text-[10px] text-medical-disabled">Detect · Localize · Quantify · Save Lives</div>
      </div>
    </div>
  </div>
);

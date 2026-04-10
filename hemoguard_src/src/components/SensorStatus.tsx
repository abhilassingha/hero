import React from 'react';
import { motion } from 'motion/react';
import { HemoData } from '../types';
import { cn } from '../lib/utils';

interface SensorStatusProps { data: HemoData; }

const SENSOR_META: Record<string, { label:string; spec:string; depth:string }> = {
  'PPG-1': { label:'PPG — Forehead',    spec:'940nm / 660nm',    depth:'0–0.5 cm' },
  'PPG-2': { label:'PPG — Foot',        spec:'940nm / 660nm',    depth:'0–0.5 cm' },
  'US-1':  { label:'Ultrasound A',      spec:'5 MHz phased',     depth:'0–8 cm'   },
  'US-2':  { label:'Ultrasound B',      spec:'1 MHz focused',    depth:'8–15 cm'  },
  'BIO-Z': { label:'EIT impedance',     spec:'16-ch 250 Hz',     depth:'2–8 cm'   },
  'ACCEL': { label:'IMU ×4',            spec:'6-axis 32kHz',     depth:'Motion'   },
  'TEMP':  { label:'Skin temperature',  spec:'NTC thermistor',   depth:'Surface'  },
  'EMG':   { label:'Surface EMG',       spec:'Electrode array',  depth:'0–2 cm'   },
  'NIRS-1':{ label:'NIR-I (850nm)',     spec:'4-channel VCSEL',  depth:'0.5–3 cm' },
  'NIRS-2':{ label:'NIR-II (1200nm)',   spec:'InGaAs array',     depth:'6–12 cm'  },
  'EIT':   { label:'Photoacoustic',     spec:'PA 50kHz pulse',   depth:'1–5 cm'   },
  'PRESS': { label:'Piezo pressure',    spec:'PVDF flex array',  depth:'0–4 cm'   },
};

function SignalBars({ status }: { status:'active'|'weak'|'inactive' }) {
  const heights = [4,10,7,13,9,12];
  const color = status==='active'?'#00d4ff':status==='weak'?'#ffcc44':'#2a3a55';
  return (
    <div className="flex items-end gap-[2px] h-4">
      {heights.map((h,i)=>(
        <motion.div key={i}
          animate={ status!=='inactive' ? {height:[h,h*0.5+2,h,h*0.7+1,h]} : {height:2} }
          transition={{repeat:Infinity, duration:0.6+i*0.1, repeatType:'reverse', delay:i*0.07}}
          style={{width:3, background:color, borderRadius:2, minHeight:2}}/>
      ))}
    </div>
  );
}

export const SensorStatus: React.FC<SensorStatusProps> = ({ data }) => {
  const active   = Object.values(data.sensorStatus).filter(s=>s.status==='active').length;
  const weak     = Object.values(data.sensorStatus).filter(s=>s.status==='weak').length;
  const inactive = Object.values(data.sensorStatus).filter(s=>s.status==='inactive').length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-medical-border bg-medical-header">
        <div className="text-sm font-bold text-medical-white">Sensor status</div>
        <div className="flex gap-3 mt-1">
          <span className="text-[10px] text-medical-normal font-bold">{active} active</span>
          {weak>0 && <span className="text-[10px] text-medical-warning font-bold">{weak} weak</span>}
          {inactive>0 && <span className="text-[10px] text-medical-disabled font-bold">{inactive} offline</span>}
        </div>
      </div>

      {/* Summary pills */}
      <div className="px-4 py-2 flex gap-2 border-b border-medical-border/50">
        {[
          {label:'Active', val:active,   color:'bg-medical-normal/15 border-medical-normal/40 text-medical-normal'},
          {label:'Weak',   val:weak,     color:'bg-medical-warning/15 border-medical-warning/40 text-medical-warning'},
          {label:'Off',    val:inactive, color:'bg-medical-disabled/10 border-medical-border text-medical-disabled'},
        ].map(p=>(
          <div key={p.label} className={cn('flex-1 text-center py-1.5 rounded-xl border text-[10px] font-black', p.color)}>
            {p.val} {p.label}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(data.sensorStatus).map(([name, info]) => {
          const meta = SENSOR_META[name] ?? { label:name, spec:info.spec, depth:'—' };
          const statusColor = {active:'bg-medical-normal',weak:'bg-medical-warning',inactive:'bg-medical-disabled'}[info.status];
          const valColor = {active:'text-medical-white',weak:'text-medical-warning',inactive:'text-medical-disabled'}[info.status];
          return (
            <div key={name}
              className="flex items-center gap-3 px-4 py-3 border-b border-medical-border/30 hover:bg-medical-card/40 transition-colors">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', statusColor,
                info.status==='active'&&'animate-pulse-sensor')}/>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-medical-white leading-tight truncate">{meta.label}</div>
                <div className="text-[9px] text-medical-disabled leading-tight">{meta.spec} · {meta.depth}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={cn('text-[11px] font-bold', valColor)}>{info.value}</div>
                <SignalBars status={info.status}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

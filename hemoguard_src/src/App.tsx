import { useState } from 'react';
import { useHemoData } from './hooks/useHemoData';
import { Dashboard } from './components/Dashboard';
import { BleedLocator } from './components/BleedLocator';
import { FullReport } from './components/FullReport';
import { SensorStatus } from './components/SensorStatus';
import { Settings } from './components/Settings';
import { cn } from './lib/utils';
import { LayoutDashboard, Target, FileText, Activity, Settings as SettingsIcon } from 'lucide-react';

type Screen = 'dashboard' | 'locator' | 'report' | 'sensors' | 'settings';

const NAV = [
  { id:'dashboard' as Screen, label:'Monitor',  Icon:LayoutDashboard },
  { id:'locator'   as Screen, label:'Locator',  Icon:Target },
  { id:'report'    as Screen, label:'Report',   Icon:FileText },
  { id:'sensors'   as Screen, label:'Sensors',  Icon:Activity },
  { id:'settings'  as Screen, label:'System',   Icon:SettingsIcon },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const data = useHemoData();

  const content = {
    dashboard: <Dashboard data={data}/>,
    locator:   <BleedLocator data={data}/>,
    report:    <FullReport data={data}/>,
    sensors:   <SensorStatus data={data}/>,
    settings:  <Settings/>,
  }[screen];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-medical-bg border-x border-medical-border shadow-2xl overflow-hidden select-none">
      {/* ── App header ── */}
      <header className="bg-medical-header border-b border-medical-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-medical-critical/20 border border-medical-critical/50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-medical-critical"/>
          </div>
          <div>
            <div className="text-sm font-black tracking-tighter text-medical-white leading-tight">
              HEMO<span className="text-medical-ai">GUARD</span>
            </div>
            <div className="text-[8px] text-medical-disabled uppercase tracking-widest leading-none">
              Hemorrhage detection system
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-medical-normal animate-pulse"/>
            <span className="text-[9px] font-bold text-medical-normal uppercase tracking-wider">Live</span>
          </div>
          <div className="text-[9px] text-medical-disabled border border-medical-border px-2 py-1 rounded-lg font-mono">
            v2.4
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-h-0">
        {content}
      </main>

      {/* ── Nav bar ── */}
      <nav className="bg-medical-header border-t border-medical-border flex justify-around items-center pb-safe flex-shrink-0"
           style={{paddingBottom:'max(8px, env(safe-area-inset-bottom))'}}>
        {NAV.map(({ id, label, Icon }) => {
          const active = screen === id;
          return (
            <button key={id} onClick={()=>setScreen(id)}
              className={cn('flex flex-col items-center gap-1 py-2 px-3 transition-all duration-200 min-w-[56px] relative',
                active ? 'text-medical-ai' : 'text-medical-disabled hover:text-medical-secondary')}>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-medical-ai rounded-full"/>
              )}
              <Icon className={cn('w-5 h-5 transition-all duration-200', active && 'scale-110')}
                    style={active ? {filter:'drop-shadow(0 0 6px rgba(0,212,255,0.5))'} : {}}/>
              <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

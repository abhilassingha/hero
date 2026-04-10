export interface SensorStatus {
  [key: string]: {
    status: 'active' | 'weak' | 'inactive';
    value: string;
    spec: string;
  };
}

export interface HemoData {
  bleedDetected: boolean;
  bleedZone: string;
  bleedDepth: number;
  vesselType: string;
  volumeEstimateMl: number;
  bleedRateMlMin: number;
  shockClass: number;
  confidenceScore: number;
  interventionFlags: string[];
  sensorStatus: SensorStatus;
  vitals: {
    hr: number;
    shockIndex: number;
    spo2: number;
    bp: string;
  };
}

export const INITIAL_DATA: HemoData = {
  bleedDetected: true,
  bleedZone: 'RUQ',
  bleedDepth: 4.2,
  vesselType: 'Arterial',
  volumeEstimateMl: 450,
  bleedRateMlMin: 12,
  shockClass: 2,
  confidenceScore: 0.94,
  interventionFlags: ['TXA Mandatory', 'REBOA Prep', 'Fluid Resus'],
  vitals: {
    hr: 118,
    shockIndex: 1.1,
    spo2: 94,
    bp: '105/65'
  },
  sensorStatus: {
    'PPG-1': { status: 'active', value: 'Clean', spec: '940nm/660nm' },
    'PPG-2': { status: 'weak', value: 'Noisy', spec: '940nm/660nm' },
    'US-1': { status: 'active', value: 'Locked', spec: '5MHz Phased' },
    'US-2': { status: 'active', value: 'Locked', spec: '5MHz Phased' },
    'BIO-Z': { status: 'active', value: 'Stable', spec: '4-Electrode' },
    'ACCEL': { status: 'active', value: 'Active', spec: '6-Axis IMU' },
    'TEMP': { status: 'active', value: '37.2°C', spec: 'NTC Therm' },
    'EMG': { status: 'inactive', value: 'Off', spec: 'Surface' },
    'NIRS-1': { status: 'active', value: 'Clean', spec: 'Multi-λ' },
    'NIRS-2': { status: 'active', value: 'Clean', spec: 'Multi-λ' },
    'EIT': { status: 'active', value: 'Active', spec: '16-Channel' },
    'PRESS': { status: 'active', value: 'Clean', spec: 'Piezo' },
  }
};

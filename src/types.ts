// types.ts

export type DeviceType = "DDSU" | "PZEM" | "SHT" | "BMS";

export interface DDSUData {
  voltage: number;
  current: number;
  power: number;
  reactive_power: number;
  power_factor: number;
  frequency: number;
}

export interface PZEMData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
}

export interface SHTData {
  temperature: number;
  humidity: number;
}

export interface BMSData {
  voltage: number;
  current: number;
  capacity: number;
  state_of_charge: number;
  state_of_health: number;
  cycle_count: number;
}

export interface SensorEntry {
  id: number;
  type: DeviceType;
  // Use a Discriminated Union for better type safety
  data: DDSUData | PZEMData | SHTData | BMSData;
}

export interface WSMessage {
  ts: number;
  data: SensorEntry[];
}

export interface DDSURecord {
  id: string;
  dev_id: string;
  voltage: number;
  power: number;
  frequency: number;
  power_factor: number;
  energy: number;
  timestamp: number;
}

export interface PZEMRecord {
  id: string;
  dev_id: string;
  voltage: number;
  power: number;
  energy: number;
  timestamp: number;
}

export interface SHTRecord {
  id: string;
  dev_id: string;
  temperature: number;
  humidity: number;
  timestamp: number;
}

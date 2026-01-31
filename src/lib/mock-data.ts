// Mock data generator for Solar PV monitoring system

export interface ACMeterData {
  id: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  timestamp: Date;
  isOnline: boolean;
}

export interface DCMeterData {
  id: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  timestamp: Date;
  isOnline: boolean;
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export interface TimeSeriesPoint {
  time: string;
  acPower: number;
  dcPower: number;
  energy: number;
  temperature: number;
  humidity: number;
}

// Generate realistic AC meter data
export function generateACMeterData(id: string): ACMeterData {
  const baseVoltage = 220 + Math.random() * 10;
  const baseCurrent = 8 + Math.random() * 4;
  const power = baseVoltage * baseCurrent * (0.85 + Math.random() * 0.1);

  return {
    id,
    voltage: Math.round(baseVoltage * 10) / 10,
    current: Math.round(baseCurrent * 100) / 100,
    power: Math.round(power),
    energy: Math.round((1000 + Math.random() * 500) * 100) / 100,
    frequency: Math.round((49.9 + Math.random() * 0.2) * 100) / 100,
    powerFactor: Math.round((0.92 + Math.random() * 0.06) * 100) / 100,
    timestamp: new Date(),
    isOnline: Math.random() > 0.05,
  };
}

// Generate realistic DC meter data
export function generateDCMeterData(id: string): DCMeterData {
  const baseVoltage = 350 + Math.random() * 50;
  const baseCurrent = 6 + Math.random() * 3;
  const power = baseVoltage * baseCurrent;

  return {
    id,
    voltage: Math.round(baseVoltage * 10) / 10,
    current: Math.round(baseCurrent * 100) / 100,
    power: Math.round(power),
    energy: Math.round((800 + Math.random() * 400) * 100) / 100,
    timestamp: new Date(),
    isOnline: Math.random() > 0.05,
  };
}

// Generate environmental data
export function generateEnvironmentalData(): EnvironmentalData {
  return {
    temperature: Math.round((25 + Math.random() * 15) * 10) / 10,
    humidity: Math.round((40 + Math.random() * 30) * 10) / 10,
    timestamp: new Date(),
  };
}

// Generate time series data for charts
export function generateTimeSeriesData(hours = 12): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();

    // Simulate solar power curve (peak at noon)
    const solarMultiplier = Math.max(
      0,
      Math.sin(((hourOfDay - 6) * Math.PI) / 12)
    );
    const cloudFactor = 0.7 + Math.random() * 0.3;

    const dcPower = Math.round(
      solarMultiplier * cloudFactor * 5000 * (0.9 + Math.random() * 0.2)
    );
    const acPower = Math.round(dcPower * (0.92 + Math.random() * 0.05));

    data.push({
      time: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      acPower,
      dcPower,
      energy:
        Math.round(
          (i === hours ? 0 : data[data.length - 1]?.energy || 0) +
            acPower * 0.001 * 100
        ) / 100,
      temperature:
        Math.round((20 + solarMultiplier * 15 + Math.random() * 5) * 10) / 10,
      humidity:
        Math.round((60 - solarMultiplier * 20 + Math.random() * 10) * 10) / 10,
    });
  }

  return data;
}

// Generate all meter data
export function generateAllMeterData() {
  const acMeters: ACMeterData[] = [];
  const dcMeters: DCMeterData[] = [];

  for (let i = 1; i <= 5; i++) {
    acMeters.push(generateACMeterData(`dds666_0${i}`));
  }

  for (let i = 1; i <= 2; i++) {
    dcMeters.push(generateDCMeterData(`pzem017_0${i}`));
  }

  return { acMeters, dcMeters };
}

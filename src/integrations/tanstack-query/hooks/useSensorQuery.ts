import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import type { DDSURecord, PZEMRecord, SHTRecord } from "@/types";

import { BASE_API_URL, SENSOR_AGGREGATION_INTERVAL_MS } from "@/lib/constants";

const STALE_TIME = SENSOR_AGGREGATION_INTERVAL_MS; // 1 hour invalidation

export const useSHTHistory = () => {
  return useQuery<SHTRecord[]>({
    queryKey: ["history", "sht"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_API_URL}/shts/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const useDDSUHistory = () => {
  return useQuery<DDSURecord[]>({
    queryKey: ["history", "ddsu"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_API_URL}/ddsus/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const usePZEMHistory = () => {
  return useQuery<PZEMRecord[]>({
    queryKey: ["history", "pzem"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_API_URL}/pzems/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

// hooks/useSensorQueries.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { DDSURecord, PZEMRecord, SHTRecord } from "@/types";

const BASE_URL = "http://localhost:8080/api/v1";

const STALE_TIME = 1000 * 60; // 1 hour invalidation

export const useSHTHistory = () => {
  return useQuery<SHTRecord[]>({
    queryKey: ["history", "sht"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/shts/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const useDDSUHistory = () => {
  return useQuery<DDSURecord[]>({
    queryKey: ["history", "ddsu"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/ddsus/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const usePZEMHistory = () => {
  return useQuery<PZEMRecord[]>({
    queryKey: ["history", "pzem"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/pzems/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

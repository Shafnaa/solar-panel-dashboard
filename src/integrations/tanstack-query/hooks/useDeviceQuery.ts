import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { BASE_API_URL, SENSOR_AGGREGATION_INTERVAL_MS } from "@/lib/constants";

const STALE_TIME = SENSOR_AGGREGATION_INTERVAL_MS; // 1 hour invalidation

export const useDeviceQuery = (id: string) => {
  return useQuery({
    queryKey: ["device", id],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_API_URL}/devices/id/${id}`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

export const useDevicesQuery = () => {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_API_URL}/devices/`);
      return data;
    },
    staleTime: STALE_TIME,
  });
};

// useSensorWebSocket.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";

import type { WSMessage } from "@/types";

import { BASE_WS_URL } from "@/lib/constants";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

export const useSensorWebSocket = (url: string = BASE_WS_URL) => {
  const setSensorData = useSetAtom(latestSensorDataAtom);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event: MessageEvent) => {
      try {
        const payload: WSMessage = JSON.parse(event.data);
        setSensorData(payload);
      } catch (err) {
        console.error("Type Mismatch or Parse Error", err);
      }
    };

    return () => socket.close();
  }, [url, setSensorData]);
};

// useSensorWebSocket.ts
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { latestSensorDataAtom } from "@/integrations/jotai/store";
import type { WSMessage } from "@/types";

export const useSensorWebSocket = (url: string = "ws://0.0.0.0:8765") => {
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

"use client";

import { useEffect, useState } from "react";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function useTempUserSession() {
  const [sessionId, setSessionId] = useState<string>('temp_id');

  useEffect(() => {
    let storedSession = localStorage.getItem("tempSessionId");

    if (!storedSession) {
      storedSession = generateUUID();
      localStorage.setItem("tempSessionId", storedSession);
    }

    setSessionId(storedSession);
  }, []);

  return sessionId;
}

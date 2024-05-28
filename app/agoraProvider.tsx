"use client";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import React from "react";
export default function AgoraProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
}

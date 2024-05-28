"use client";
import AgoraRTC, {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteUser,
  useConnectionState,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Image from "next/image";
import { useState, useEffect } from "react";
interface Props {
  token: string;
}
const AppID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
export default function Videos({ token }: Props) {
  return <h1>Hello</h1>;
}

// components/VideoCall.tsx
"use client";
import React, { useState, useEffect } from "react";
import AgoraRTC, {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  useConnectionState,
} from "agora-rtc-react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-react";

interface Props {
  token: string;
  channel: string;
}

const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;

const VideoCall = ({ token, channel }: Props) => {
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const remoteUsers = useRemoteUsers();
  const { data, isLoading, error, isConnected } = useJoin({
    appid: appID,
    token: token,
    channel: channel,
  });

  useEffect(() => {
    const getLocalTracks = async () => {
      const [microphoneTrack, cameraTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);
      setLocalAudioTrack(microphoneTrack);
      setLocalVideoTrack(cameraTrack);
    };
    getLocalTracks();

    return () => {
      localAudioTrack?.close();
      localVideoTrack?.close();
    };
  }, [isConnected]);

  const handleEndCall = () => {
    if (localAudioTrack) localAudioTrack.close();
    if (localVideoTrack) localVideoTrack.close();
    window.location.reload(); // Simple way to leave and reset the call
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (localAudioTrack) {
      localAudioTrack.setEnabled(isMuted);
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localVideoTrack) localVideoTrack.setEnabled(isVideoOff);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="relative w-96 h-80 bg-gray-700">
        {localVideoTrack && (
          <video
            ref={(element) => {
              if (element && localVideoTrack) {
                localVideoTrack.play(element);
              }
            }}
            className="w-full h-full"
            autoPlay
            playsInline
          ></video>
        )}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          <button
            onClick={handleEndCall}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fff"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={handleMute}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 256 256"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                  d="m213.92 218.62l-160-176a8 8 0 0 0-11.84 10.76L80 95.09V128a48 48 0 0 0 69.11 43.12l11.1 12.2A63.4 63.4 0 0 1 128 192a64.07 64.07 0 0 1-64-64a8 8 0 0 0-16 0a80.11 80.11 0 0 0 72 79.6V240a8 8 0 0 0 16 0v-32.41a78.8 78.8 0 0 0 35.16-12.22l30.92 34a8 8 0 1 0 11.84-10.76ZM128 160a32 32 0 0 1-32-32v-15.31l41.66 45.82A32 32 0 0 1 128 160m57.52-3.91A63.3 63.3 0 0 0 192 128a8 8 0 0 1 16 0a79.16 79.16 0 0 1-8.11 35.12a8 8 0 0 1-7.19 4.49a7.9 7.9 0 0 1-3.51-.82a8 8 0 0 1-3.67-10.7M84 44.87A48 48 0 0 1 176 64v64a49 49 0 0 1-.26 5a8 8 0 0 1-8 7.17a8 8 0 0 1-.84 0a8 8 0 0 1-7.12-8.79c.11-1.1.17-2.24.17-3.36V64a32 32 0 0 0-61.31-12.75A8 8 0 1 1 84 44.87"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleToggleVideo}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isVideoOff ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative w-80 h-60 bg-black">
            {user.videoTrack && (
              <video
                ref={(element) => {
                  if (element && user.videoTrack) {
                    user.videoTrack.play(element);
                  }
                }}
                className="w-full h-full"
                autoPlay
                playsInline
              ></video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCall;

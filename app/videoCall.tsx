"use client";
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const agoraAppId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

const VideoCall = () => {
  const [client, setClient] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAgora = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);

      agoraClient.on("user-published", async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          if (remoteVideoTrack && remoteVideoRef.current) {
            remoteVideoTrack.play(remoteVideoRef.current);
          }
        }
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack?.play();
        }
      });

      agoraClient.on("user-unpublished", (user) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
        }
      });
    };

    initAgora();
  }, []);

  const joinChannel = async () => {
    if (!client) return;

    const token =
      "007eJxTYHjxO/3/xsowxZXlRvKdr79seXpR8J7F/Qd5Tu97voRufPFegSHRwNA4Oc3IzMTIzMIk2TzF0tzYJDnVMNnU1NDI3NQ4+XhzSFpDICNDt0EUKyMDBIL4LAwhqcUlDAwAj/Ei6A=="; // Generate and set a token if you are using a secure channel
    const channel = "Test"; // Replace with your channel name

    await client.join(agoraAppId as string, channel, token, null);
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const videoTrack = await AgoraRTC.createCameraVideoTrack();

    setLocalAudioTrack(audioTrack);
    setLocalVideoTrack(videoTrack);

    if (localVideoRef.current) {
      videoTrack.play(localVideoRef.current);
    }

    await client.publish([audioTrack, videoTrack]);
    setJoined(true);
  };

  const leaveChannel = async () => {
    if (!client) return;

    await client.leave();
    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = "";
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = "";
    }
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.close();
    }
    setJoined(false);
  };

  const stopCall = () => {
    leaveChannel();
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (localVideoTrack.isPlaying) {
        localVideoTrack.stop();
      } else {
        await localVideoTrack.play(localVideoRef.current);
      }
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (localAudioTrack.isPlaying) {
        localAudioTrack.stop();
      } else {
        await localAudioTrack.play();
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Agora Video Call</h1>
      <div className="flex space-x-4">
        <div ref={localVideoRef} className="w-96 h-72 bg-gray-200"></div>
        <div ref={remoteVideoRef} className="w-96 h-72 bg-gray-200"></div>
      </div>
      <div className="mt-4 space-x-4">
        <button
          onClick={joined ? leaveChannel : joinChannel}
          className="bg-black text-white py-2 px-4 rounded"
        >
          {joined ? "Leave" : "Start Meeting"}
        </button>
        {joined && (
          <>
            <button
              onClick={stopCall}
              className="bg-red-600 text-white py-2 px-4 rounded"
            >
              Stop Call
            </button>
            <button
              onClick={toggleVideo}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Toggle Video
            </button>
            <button
              onClick={toggleAudio}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Toggle Audio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;

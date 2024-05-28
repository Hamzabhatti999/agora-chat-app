"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Videos from "./videoComponent";
import AgoraProvider from "./agoraProvider";
const HomePage = () => {
  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState<string>("");

  const generateToken = async () => {
    const response = await axios.post("/api/channel", {
      channelName: "Arrived",
    });
    setToken(response.data.token);
  };

  const handleJoin = async () => {
    await generateToken();
    setInCall(true);
  };

  return (
    <AgoraProvider>
      {inCall ? (
        <Videos token={token} channel="Arrived" />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <button
            onClick={handleJoin}
            className="bg-sky-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-sky-600 transition duration-200"
          >
            Join Call
          </button>
        </div>
      )}
    </AgoraProvider>
  );
};

export default HomePage;

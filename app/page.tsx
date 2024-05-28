"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Videos from "./videoComponent";
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
    <div>
      {inCall ? (
        <Videos token={token} />
      ) : (
        <div>
          <button onClick={handleJoin}>Join Call</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

import React from "react";
import VideoCall from "./videoCall";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-6">
        Agora Audio and Video Calling App
      </h1>
      <VideoCall />
    </main>
  );
};

export default Home;

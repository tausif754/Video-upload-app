// src/App.js
import React from "react";
import UploadForm from "./components/UploadForm";
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    // <div>
    //   <h1>Video Upload App</h1>
    //   <UploadForm onUpload={handleUpload} />
    //   <VideoList onSelect={setSelectedVideo} />
    //   <VideoPlayer video={selectedVideo} />
    // </div>

    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/all" element={<VideoList />} />
        <Route path="all/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
};

export default App;

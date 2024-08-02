// src/components/VideoPlayer.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./VideoPlayer.css";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  console.log(id);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/upload/${id}`
        );
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideo();
  }, [id]);

  return (
    <div className="videoPlayerContainer">
      {video ? (
        <div className="videoCard">
          <div className="videoElement">
            <video width="600" controls autoPlay>
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <h2 className="videoTitle">{video && video?.title}</h2>
          <p className="videoDesc">{video && video.description}</p>
        </div>
      ) : (
        <p>Video Not Found</p>
      )}
    </div>
  );
};

export default VideoPlayer;

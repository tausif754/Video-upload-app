// src/components/VideoList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VideoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  console.log(videos);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/upload");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const handleClick = (video) => {
    console.log(video);
    navigate(`/all/${video._id}`);
  };

  return (
    <>
      <h2 className="allVideoLabel">All Videos</h2>
      {
        <div className="videoContainer">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                className="videoCard"
                key={video._id}
                onClick={() => handleClick(video)}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  style={{ width: "400px", height: "250px" }}
                />
                <h3>{video && video.title}</h3>
                <p>{video && video.description}</p>
              </div>
            ))
          ) : (
            <p>No Videos Found</p>
          )}
        </div>
      }
    </>
  );
};

export default VideoList;

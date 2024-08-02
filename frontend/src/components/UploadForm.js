import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import "./UploadForm.css";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [data]);
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data);
      navigate("/all");
    } catch (error) {
      alert("Some error occured");
      setIsLoading(false);

      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="uploadFormContainer">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <div className="fieldLabel">
            <p>Title</p>
            <p>:</p>
          </div>
          <div className="fieldInput">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="50"
              required
              className="titleInput"
              placeholder="Write Title Here..."
            />
          </div>
        </div>
        <div className="field">
          <div className="fieldLabel fieldLableDesc">
            <p>Description</p>
            <p>:</p>
          </div>
          <div className="fieldInput">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="1000"
              required
              placeholder="Write Description Here..."
            ></textarea>
          </div>
        </div>
        <div className="field">
          <div className="fieldLabel">
            <p>Thumbnail</p>
            <p>:</p>
          </div>
          <div className="customImageUpload">
            <label for="imageUpload">Select Thumbnail</label>
            <input
              id="imageUpload"
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="image/png, image/jpeg"
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="fieldLabel">
            <p>Video</p>
            <p>:</p>
          </div>
          <div className="customImageUpload">
            <label for="videoUpload">Select Video</label>
            <input
              id="videoUpload"
              type="file"
              onChange={(e) => setVideo(e.target.files[0])}
              accept="video/mp4"
              required
            />
          </div>
        </div>
        <button className="btn" type="submit">
          {isLoading ? <Spinner /> : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

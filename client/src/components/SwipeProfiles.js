import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SwipeProfiles.css";

const SwipeProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          navigate("/auth"); 
          return;
        }
        const response = await axios.get("http://localhost:5000/api/profiles/swipe", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched profiles:", response.data);
        setProfiles(response.data.profiles || []); 
      } catch (error) {
        console.error("Error fetching profiles:", error.response?.data || error.message);
      }
    };

    fetchProfiles();
  }, [navigate]);

  const handleSwipe = async (action) => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];

    if (action === "like") {
      try {
        const token = localStorage.getItem("authToken");
        await axios.post(
          "http://localhost:5000/api/profiles/swipe",
          { likedUserId: profile.user_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedProfiles([...likedProfiles, profile]);
        console.log("Liked profile:", profile);
      } catch (error) {
        console.error("Error saving match:", error.response?.data || error.message);
      }
    }

    setCurrentIndex(currentIndex + 1);
  };

  if (profiles.length === 0) {
    return (
      <div className="swipe-container">
        <p>No profiles available for swiping</p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="swipe-container">
        <div>
          <p>You have swiped through all profiles!</p>
          <button onClick={() => navigate("/chat")}>
            Chat with your matched mates
          </button>
        </div>
      </div>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <div className="swipe-container">
      <h2>Swipe Profiles</h2>
      <div className="profile-card">
        <h3>{profile.username}</h3>
        <p>
          <strong>Compatibility Score:</strong> {profile.compatibilityScore}
        </p>
        <p>
          <strong>Match Percentage:</strong> {profile.compatibilityPercent}%
        </p>
      </div>

      <div className="swipe-actions">
        <button onClick={() => handleSwipe("pass")}>Pass</button>
        <button onClick={() => handleSwipe("like")}>Like</button>
      </div>

      <p>
        Swipe Count: {currentIndex + 1} / {profiles.length}
      </p>
    </div>
  );
};

export default SwipeProfiles;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import defaultAvatar from "./default-avatar.png";

const ProfileUpdate = () => {
  const [profile, setProfile] = useState({ email: "", avatar: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const token = localStorage.getItem("authToken");

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    fetchProfile();
  }, [API_BASE, token]);

  const handleInputChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError("");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validatePasswords = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return "All password fields are required.";
    }
    if (newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirm password do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", profile.email);
    if (selectedFile) formData.append("avatar", selectedFile);

    try {
      await axios.put(`${API_BASE}/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Profile update failed!");
    }

    if (
      passwordData.currentPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      const passwordValidationError = validatePasswords();
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        return;
      }

      try {
        await axios.put(
          `${API_BASE}/api/users/change-password`,
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (err) {
        console.error("Failed to update password:", err);
        setPasswordError("Failed to update password. Please check your current password.");
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-preview">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : profile.avatar || defaultAvatar
              }
              alt="Profile Preview"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>

          {passwordError && <p className="error-message">{passwordError}</p>}

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;

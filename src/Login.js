import React, { useState, useEffect } from "react";

export default function UserDashboard() {
  const [pfpUrl, setPfpUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("vanityUser") || "{}");
  const username = storedUser.username;

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("You must be logged in to view the dashboard.");
      return;
    }

    const fetchOrCreateProfile = async () => {
      try {
        let res = await fetch(
          `https://vanitybackend-43ng.onrender.com/api/getProfile/${username}`
        );

        // If profile not found, create a new one
        if (res.status === 404) {
          await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              bio: "",
              links: [],
              pfpUrl: null,
            }),
          });

          // Retry fetching after creation
          res = await fetch(
            `https://vanitybackend-43ng.onrender.com/api/getProfile/${username}`
          );
        }

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUserName(data.username || "");
        setBio(data.bio || "");
        setLinks((data.links || []).join(", "));
        setPfpUrl(data.pfpUrl || "");
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateProfile();
  }, [username]);

  const handleSaveProfile = async () => {
    if (!username) return alert("You must be logged in!");

    const payload = {
      username: userName,
      bio,
      links: links.split(",").map((l) => l.trim()),
      pfpUrl,
    };

    try {
      const res = await fetch(
        "https://vanitybackend-43ng.onrender.com/api/saveProfile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      alert(data.message || "Profile saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
  };

  if (loading) return <p className="text-white p-6">Loading profile...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block mb-2">Profile Picture URL</label>
          {pfpUrl && (
            <img
              src={pfpUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-3 object-cover border border-gray-700"
            />
          )}
          <input
            type="text"
            value={pfpUrl || ""}
            placeholder="Enter image URL"
            onChange={(e) => setPfpUrl(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div className="mb-4">
          <label>Username</label>
          <input
            value={userName || ""}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div className="mb-4">
          <label>Bio</label>
          <textarea
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div className="mb-4">
          <label>Links (comma separated)</label>
          <input
            value={links || ""}
            onChange={(e) => setLinks(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="mt-4 px-6 py-3 bg-sky-600 rounded-xl"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

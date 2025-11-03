import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 67
export default function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://vanitybackend-43ng.onrender.com/getProfile/${username}`);
        const data = await res.json();
        if (res.ok) setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        404 User not Found : Claim this user today!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 p-6">
      <div className="max-w-md mx-auto text-center">
        {profile.pfpUrl && (
          <img
            src={profile.pfpUrl}
            alt={`${profile.username} profile`}
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-2 border-gray-700"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
        {profile.bio && <p className="text-gray-400 mb-6">{profile.bio}</p>}
        <div className="space-y-3">
          {(profile.links || []).map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 border border-gray-700 py-3 rounded-2xl hover:bg-sky-700 transition-all"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `https://vanitybackend-43ng.onrender.com/api/getProfileByUsername/${username}`
                );

                if (!res.ok) {
                    if (res.status === 404) {
                        setProfile(null);
                        setError("User not found! Claim this username today!");
                    } else {
                        throw new Error("Failed to fetch profile");
                    }
                } else {
                    const data = await res.json();
                    setProfile(data);
                    setError(null);
                }
            } catch (err) {
                console.error(err);
                setProfile(null);
                setError("Server error. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) return <p className="text-white p-6">Loading profile...</p>;
    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300 p-4 text-center">
                {error}
            </div>
        );

    return (
        <div
            className="min-h-screen flex flex-col items-center p-6"
            style={{ backgroundColor: profile.themeColor || "#111" }}
        >
            {profile.pfpUrl && (
                <img
                    src={profile.pfpUrl}
                    alt={`${profile.username} profile`}
                    className="w-28 h-28 rounded-full mb-4 object-cover border-2 border-gray-700"
                />
            )}
            <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
            {profile.bio && <p className="text-gray-200 mb-6 text-center">{profile.bio}</p>}
            <div className="flex flex-col w-full max-w-sm space-y-3">
                {(profile.links || []).map((link, i) => (
                    <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-800 text-white py-3 rounded-xl text-center hover:bg-sky-600 transition-colors"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </div>
    );
}

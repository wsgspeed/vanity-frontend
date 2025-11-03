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
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Profile not found");

                setProfile(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
                Loading profile...
            </div>
        );

    if (error || !profile)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
                404 User not Found
            </div>
        );

    // Dynamic styles
    const backgroundStyle = {
        backgroundImage: profile.backgroundUrl
            ? `url(${profile.backgroundUrl})`
            : "linear-gradient(to bottom, #0a0a0a, #111)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: profile.cursorStyle === "sparkle"
            ? "url('/sparkle-cursor.png'), auto"
            : profile.cursorStyle === "neon"
                ? "url('/neon-cursor.png'), auto"
                : "auto",
    };

    return (
        <div
            className="min-h-screen text-gray-100 p-6 transition-all duration-300"
            style={backgroundStyle}
        >
            {/* Banner */}
            {profile.bannerUrl && (
                <div className="w-full h-48 rounded-2xl mb-6 overflow-hidden">
                    <img
                        src={profile.bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Profile header */}
            <div className="max-w-md mx-auto text-center backdrop-blur-sm bg-black/40 p-6 rounded-2xl border border-gray-800 shadow-xl">
                {profile.pfpUrl && (
                    <img
                        src={profile.pfpUrl}
                        alt={profile.username}
                        className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border-2 border-gray-700"
                    />
                )}

                <h1 className="text-3xl font-bold mb-1">@{profile.username}</h1>
                {profile.bio && (
                    <p className="text-gray-400 mb-4 px-3">{profile.bio}</p>
                )}

                {/* Music player */}
                {profile.songUrl && (
                    <audio controls className="mx-auto mb-4">
                        <source src={profile.songUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}

                {/* Links */}
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

            {/* Optional floating animation background */}
            {profile.cursorTrail && (
                <div className="fixed inset-0 pointer-events-none animate-pulse bg-white/2"></div>
            )}
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Particles from "react-tsparticles";

export default function UserProfile() {
    const { username } = useParams(); // or uid if you want
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `https://vanitybackend-43ng.onrender.com/api/getProfile/${username}`
                );
                if (!res.ok) {
                    if (res.status === 404) setProfile(null);
                    throw new Error("Profile not found");
                }
                const data = await res.json();
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

    if (loading) return <p className="text-white p-6">Loading profile...</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;
    if (!profile) return <p className="text-gray-300 p-6">404: User not found</p>;

    // Determine background
    let bgStyle = {};
    if (profile.bgType === "color") bgStyle.backgroundColor = profile.bgColor || "#111";
    else if (profile.bgType === "gradient") bgStyle.backgroundImage = profile.bgGradient || "linear-gradient(to right, #0ea5e9, #f43f5e)";
    else if (profile.bgType === "image") bgStyle.backgroundImage = `url(${profile.bgImage})`;

    return (
        <div className="min-h-screen relative text-white p-6" style={bgStyle}>
            {profile.cursorEnabled && <CustomCursor color={profile.cursorColor} trail={profile.cursorTrail} />}
            {profile.themeColor && (
                <Particles
                    className="absolute top-0 left-0 w-full h-full z-0"
                    options={{
                        fpsLimit: 60,
                        particles: {
                            number: { value: 50 },
                            color: { value: profile.themeColor },
                            move: { enable: true, speed: 2 },
                            shape: { type: "circle" }
                        },
                    }}
                />
            )}

            <div className="relative z-10 max-w-md mx-auto text-center">
                {profile.pfpUrl && (
                    <img
                        src={profile.pfpUrl}
                        alt={`${profile.username} profile`}
                        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-2 border-gray-700"
                    />
                )}
                <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
                {profile.bio && <p className="text-gray-300 mb-6">{profile.bio}</p>}
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

// Custom cursor (readonly)
function CustomCursor({ color = "#0ea5e9", trail = true }) {
    useEffect(() => {
        const cursor = document.createElement("div");
        cursor.style.position = "fixed";
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        cursor.style.borderRadius = "50%";
        cursor.style.background = color;
        cursor.style.pointerEvents = "none";
        cursor.style.zIndex = "9999";
        cursor.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(cursor);

        const move = (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        };
        document.addEventListener("mousemove", move);
        return () => {
            document.removeEventListener("mousemove", move);
            document.body.removeChild(cursor);
        };
    }, [color]);

    return null;
}

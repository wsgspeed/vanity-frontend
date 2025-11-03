import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://vanitybackend-43ng.onrender.com/api/findProfile?username=${username}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) return <div className="text-center text-gray-400 p-10">Loading...</div>;
    if (!profile) return <div className="text-center text-gray-400 p-10">404 - User not found</div>;

    return (
        <div
            className={`min-h-screen text-center p-8 transition-all duration-500 ${profile.background === "space" ? "bg-gradient-to-b from-gray-900 to-black" :
                    profile.background === "blue" ? "bg-gradient-to-br from-blue-900 to-blue-600" :
                        profile.background === "pink" ? "bg-gradient-to-br from-pink-900 to-purple-700" :
                            "bg-gray-900"
                }`}
            style={{
                cursor:
                    profile.cursor === "spark" ? "url('/spark.cur'), auto" : profile.cursor || "default",
            }}
        >
            <div className="max-w-md mx-auto text-white">
                {profile.pfpUrl && (
                    <img
                        src={profile.pfpUrl}
                        alt="pfp"
                        className={`w-32 h-32 rounded-full mx-auto mb-4 object-cover ${profile.glow ? "shadow-[0_0_20px_#0ff]" : ""
                            }`}
                    />
                )}
                <h1 className="text-3xl font-bold">@{profile.username}</h1>
                {profile.bio && <p className="text-gray-300 mt-2 mb-6">{profile.bio}</p>}
                <div className="space-y-3">
                    {(profile.links || []).map((link, i) => (
                        <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-800 py-3 rounded-xl hover:bg-sky-700 transition"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

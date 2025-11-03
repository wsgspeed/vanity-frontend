import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `https://vanitybackend-43ng.onrender.com/api/findProfile?username=${username}`
                );
                if (!res.ok) throw new Error("Profile not found");
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Loading profile...
            </div>
        );

    if (!profile)
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
                404 — User not found.
            </div>
        );

    return (
        <div
            className="min-h-screen flex flex-col items-center text-center"
            style={{
                background: profile.background || "#0a0a0a",
                color: "#fff",
                fontFamily: profile.font || "Arial, sans-serif",
                cursor:
                    profile.cursor && profile.cursor !== "default"
                        ? `url(${profile.cursor}), auto`
                        : "auto",
            }}
        >
            {profile.bannerUrl && (
                <img
                    src={profile.bannerUrl}
                    alt="Banner"
                    className="w-full h-40 object-cover"
                />
            )}

            <div className="max-w-md w-full mt-[-40px] bg-black/70 p-6 rounded-2xl shadow-lg border border-gray-700">
                {profile.pfpUrl && (
                    <img
                        src={profile.pfpUrl}
                        alt="Profile"
                        className={`w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 ${profile.glow ? "border-sky-500 shadow-lg shadow-sky-500/30" : ""
                            }`}
                    />
                )}

                <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                <p className="text-gray-400">@{profile.username}</p>

                {profile.bio && (
                    <p className="text-gray-300 mt-3 px-2">{profile.bio}</p>
                )}

                {profile.youtube && (
                    <div className="mt-6 aspect-video rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${profile.youtube
                                .split("v=")[1]
                                ?.split("&")[0]}`}
                            title="YouTube Video"
                            allowFullScreen
                        />
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {(profile.links || []).map((link, i) => (
                        <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-800 py-3 rounded-xl hover:bg-sky-700 transition-all"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>

            {profile.trail && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              document.addEventListener("mousemove", function(e) {
                const dot = document.createElement("div");
                dot.style.position = "fixed";
                dot.style.left = e.clientX + "px";
                dot.style.top = e.clientY + "px";
                dot.style.width = "6px";
                dot.style.height = "6px";
                dot.style.borderRadius = "50%";
                dot.style.background = "#0ff";
                dot.style.pointerEvents = "none";
                dot.style.opacity = "0.7";
                document.body.appendChild(dot);
                setTimeout(() => dot.remove(), 300);
              });
            `,
                    }}
                />
            )}
        </div>
    );
}

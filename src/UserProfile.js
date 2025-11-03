import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://vanitybackend-43ng.onrender.com/api/findProfile?username=${encodeURIComponent(username)}`);
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j.message || "Not found");
                }
                const data = await res.json();
                if (!data) throw new Error("Not found");
                setProfile({
                    username: data.username,
                    bio: data.bio || "",
                    pfpUrl: data.pfpUrl || "",
                    bannerUrl: data.bannerUrl || "",
                    backgroundType: data.backgroundType || "gradient",
                    backgroundValue: data.backgroundValue || "linear-gradient(135deg,#0ea5e9,#9333ea)",
                    accentColor: data.accentColor || "#0ea5e9",
                    fontFamily: data.fontFamily || "system-ui",
                    buttonStyle: data.buttonStyle || "rounded",
                    cursorStyle: data.cursorStyle || "default",
                    cursorTrail: data.cursorTrail ?? true,
                    glow: data.glow ?? true,
                    songUrl: data.songUrl || "",
                    autoplaySong: data.autoplaySong || false,
                    layout: data.layout || "centered",
                    sections: (data.sections || []).map(s => ({ title: s.title, links: (s.links || []).map(l => typeof l === "string" ? l : (l.url || l.label || "")) }))
                });
            } catch (e) {
                console.error(e);
                setError(String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, [username]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>;
    if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">404 - Profile not found</div>;

    const bgStyle = {};
    if (profile.backgroundType === "color") bgStyle.background = profile.backgroundValue;
    else if (profile.backgroundType === "gradient") bgStyle.backgroundImage = profile.backgroundValue;
    else if (profile.backgroundType === "image") bgStyle.backgroundImage = `url(${profile.backgroundValue})`;

    return (
        <div className="min-h-screen p-8" style={{ ...bgStyle, color: "#fff", fontFamily: profile.fontFamily }}>
            {profile.cursorTrail && <CursorTrail color={profile.accentColor} />}
            <div className="max-w-2xl mx-auto text-center">
                {profile.bannerUrl && <img src={profile.bannerUrl} alt="banner" className="w-full h-48 object-cover rounded mb-4" style={{ boxShadow: profile.glow ? `0 0 24px ${profile.accentColor}` : undefined }} />}
                {profile.pfpUrl && <img src={profile.pfpUrl} alt="pfp" className="w-28 h-28 rounded-full mx-auto mb-3" style={{ boxShadow: profile.glow ? `0 0 20px ${profile.accentColor}` : undefined }} />}
                <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
                {profile.bio && <p className="text-gray-200 mb-6">{profile.bio}</p>}
                {profile.songUrl && <div className="mb-4"><audio controls src={profile.songUrl} preload="auto" /></div>}
                <div className={`space-y-3 ${profile.layout === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col"}`}>
                    {(profile.sections || []).flatMap(s => s.links || []).map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noreferrer" className="block bg-gray-900 py-3 rounded-xl hover:bg-sky-600 transition">{link}</a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CursorTrail({ color = "#0ea5e9" }) {
    const [dots, setDots] = useState([]);
    useEffect(() => {
        const onMove = e => setDots(d => [...d.slice(-18), { x: e.clientX, y: e.clientY, id: Math.random() }]);
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);
    return <div className="pointer-events-none fixed inset-0 z-50">{dots.map(d => <div key={d.id} style={{ position: "absolute", left: d.x, top: d.y, transform: "translate(-50%,-50%)", width: 8, height: 8, background: color, borderRadius: 999, opacity: 0.7 }} />)}</div>;
}

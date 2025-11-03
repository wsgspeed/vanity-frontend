import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://vanitybackend-43ng.onrender.com/api/findProfile?username=${encodeURIComponent(username)}`);
                if (!res.ok) {
                    setProfile(null);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setProfile(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [username]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">404 - Profile not found</div>;

    const bgStyle = {};
    if (profile.backgroundType === "color") bgStyle.backgroundColor = profile.backgroundValue || "#0b1226";
    else if (profile.backgroundType === "gradient") bgStyle.backgroundImage = profile.backgroundValue || "linear-gradient(90deg,#0ea5e9,#9333ea)";
    else if (profile.backgroundType === "image") bgStyle.backgroundImage = `url(${profile.backgroundValue})`;
    else if (profile.backgroundType === "video") bgStyle.background = profile.backgroundValue;

    return (
        <div className="min-h-screen p-8" style={{ ...bgStyle, color: profile.fontColor || "#fff", fontFamily: profile.fontFamily || "system-ui" }}>
            {profile.cursorTrail && <PublicCursorTrail color={profile.cursorColor || "#0ea5e9"} />}
            <div className="max-w-2xl mx-auto text-center">
                {profile.bannerUrl && <img src={profile.bannerUrl} alt="banner" className="w-full h-48 object-cover rounded mb-4" style={{ boxShadow: profile.glow ? `0 0 24px ${profile.themeColor}` : undefined }} />}
                {profile.pfpUrl && <img src={profile.pfpUrl} alt="pfp" className="w-28 h-28 rounded-full mx-auto mb-3" style={{ boxShadow: profile.glow ? `0 0 20px ${profile.themeColor}` : undefined }} />}
                <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
                {profile.bio && <p className="text-gray-200 mb-6">{profile.bio}</p>}
                {profile.songEmbed && <div className="mb-4"><EmbedPlayer url={profile.songEmbed} autoplay={profile.autoplaySong} /></div>}
                <div className={`space-y-3 ${profile.layout === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col"}`}>
                    {(profile.sections || []).flatMap((s) => s.links || []).map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noreferrer" className="block bg-gray-900 py-3 rounded-xl hover:bg-sky-600 transition">
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EmbedPlayer({ url, autoplay }) {
    if (!url) return null;
    if (url.includes("spotify")) {
        const src = url.includes("embed") ? url : url.replace("open.spotify.com", "open.spotify.com/embed");
        return <iframe title="spotify" src={`${src}${autoplay ? "&autoplay=1" : ""}`} style={{ width: "100%", height: 80 }} frameBorder="0" allow="autoplay; encrypted-media" />;
    }
    if (url.includes("youtube") || url.includes("youtu.be")) {
        let id = "";
        try {
            const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
            id = m ? m[1] : "";
        } catch { id = ""; }
        const src = `https://www.youtube.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
        return <iframe title="youtube" src={src} style={{ width: "100%", height: 200 }} frameBorder="0" allow="autoplay; encrypted-media" />;
    }
    if (url.includes("soundcloud")) {
        const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}${autoplay ? "&auto_play=true" : ""}`;
        return <iframe title="soundcloud" src={src} style={{ width: "100%", height: 120 }} frameBorder="0" allow="autoplay" />;
    }
    return <div className="text-sm text-gray-300">Unsupported embed</div>;
}

function PublicCursorTrail({ color = "#0ea5e9" }) {
    const [dots, setDots] = useState([]);
    useEffect(() => {
        const onMove = (e) => setDots((d) => [...d.slice(-20), { x: e.clientX, y: e.clientY, id: Math.random() }]);
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);
    return (
        <div className="pointer-events-none fixed inset-0 z-50">
            {dots.map((p, i) => (
                <div key={p.id} style={{ left: p.x, top: p.y }} className="absolute rounded-full" >
                    <div style={{ width: 8, height: 8, background: color, transform: "translate(-50%, -50%)", opacity: 0.6 }} />
                </div>
            ))}
        </div>
    );
}

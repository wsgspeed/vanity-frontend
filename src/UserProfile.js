import React, { useEffect, useState } from "react";

export default function UserProfile({ profile }) {
    const [visitorCount, setVisitorCount] = useState(0);
    const [bgVideo, setBgVideo] = useState(profile.backgroundVideo || "");
    const [bgMusic, setBgMusic] = useState(profile.backgroundMusic || "");

    // Visitor count logic
    useEffect(() => {
        const counterName = "profileViews";
        const cookieName = "lastVisitTime";

        function setCookie(name, value, hours) {
            const date = new Date();
            date.setTime(date.getTime() + hours * 60 * 60 * 1000);
            document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}`;
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
        }

        async function updateVisitorCount() {
            const lastVisit = getCookie(cookieName);
            const now = Date.now();

            try {
                let newCount = profile.visitorCount || 0;
                if (!lastVisit || now - parseInt(lastVisit) > 12 * 60 * 60 * 1000) {
                    newCount += 1;
                    setCookie(cookieName, now.toString(), 12);
                }
                setVisitorCount(newCount);
            } catch (err) {
                console.error(err);
            }
        }
        updateVisitorCount();
    }, [profile.visitorCount]);

    // Cursor trail
    useEffect(() => {
        if (!profile.trail) return;
        const handleMove = (e) => {
            const dot = document.createElement("div");
            dot.style.position = "fixed";
            dot.style.left = e.clientX + "px";
            dot.style.top = e.clientY + "px";
            dot.style.width = "6px";
            dot.style.height = "6px";
            dot.style.borderRadius = "50%";
            dot.style.background = "rgba(0,255,255,0.7)";
            dot.style.pointerEvents = "none";
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 300);
        };
        document.addEventListener("mousemove", handleMove);
        return () => document.removeEventListener("mousemove", handleMove);
    }, [profile.trail]);

    return (
        <div
            className="min-h-screen w-full relative"
            style={{
                backgroundColor: profile.background || "#000",
                fontFamily: profile.font || "Courier New, monospace",
                color: "#fff",
                cursor:
                    profile.cursor && profile.cursor !== "default"
                        ? `url(${profile.cursor}), auto`
                        : "auto",
                overflow: "hidden",
            }}
        >
            {bgVideo && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="fixed top-0 left-0 w-full h-full object-cover -z-10"
                >
                    <source src={bgVideo} type="video/webm" />
                </video>
            )}
            {bgMusic && (
                <audio autoPlay loop>
                    <source src={bgMusic} type="audio/mp4" />
                </audio>
            )}

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[820px] max-w-full bg-black/70 p-6 rounded-xl backdrop-blur-lg flex flex-col gap-4 z-20">
                {/* Profile Header */}
                <div
                    className="flex gap-4 p-4 rounded-xl relative overflow-hidden"
                    style={{
                        backgroundImage: `url(${profile.bannerUrl || "/assets/def_banner.webp"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="relative w-36 h-36">
                        <img
                            src={profile.pfpUrl || "/assets/def_profile.gif"}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-4 border-sky-500 shadow-lg"
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                            <div className="flex flex-wrap gap-2">
                                {(profile.badges || []).map((b, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={b.icon}
                                            alt={b.name}
                                            className="w-6 h-6 hover:scale-125 transition-transform"
                                        />
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/70 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {b.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-300">{profile.bio}</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 flex-wrap mt-2">
                    {(profile.links || []).map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-xl hover:bg-sky-600 transition"
                        >
                            <img src={link.icon} alt={link.title} className="w-6 h-6" />
                            <span>{link.title}</span>
                        </a>
                    ))}
                </div>

                {/* Visitor Counter */}
                <div className="flex items-center gap-2 mt-4 bg-gray-800 px-3 py-2 rounded-xl self-start">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    <span>{visitorCount}</span>
                    <span className="text-xs text-gray-400">Profile Views</span>
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Skills</h2>
                        <div className="flex flex-col gap-2">
                            {profile.skills.map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <span className="flex items-center gap-1">
                                            <img src={s.icon} alt={s.name} className="w-5 h-5" />
                                            {s.name}
                                        </span>
                                        <span>{s.level}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-700 rounded">
                                        <div
                                            className="h-full rounded"
                                            style={{
                                                width: `${s.level}%`,
                                                background: s.color,
                                                transition: "width 2s",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

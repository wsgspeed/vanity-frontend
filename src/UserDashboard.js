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
            <div className="flex justify-center items-center h-screen text-white">
                Loading profile...
            </div>
        );

    if (!profile)
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Profile not found.
            </div>
        );

    const {
        username: uname,
        bio,
        pfpUrl,
        bannerUrl,
        background,
        cursor,
        font,
        links,
        youtubeEmbed,
        trail,
    } = profile;

    // Cursor trail
    useEffect(() => {
        if (!trail) return;
        const dots = [];
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.pointerEvents = "none";
        container.style.zIndex = "9999";
        document.body.appendChild(container);

        for (let i = 0; i < 10; i++) {
            const dot = document.createElement("div");
            dot.style.width = dot.style.height = "8px";
            dot.style.borderRadius = "50%";
            dot.style.background = "white";
            dot.style.position = "absolute";
            dot.style.opacity = `${1 - i / 10}`;
            container.appendChild(dot);
            dots.push({ el: dot, x: 0, y: 0 });
        }

        const move = (e) => {
            dots[0].x = e.clientX;
            dots[0].y = e.clientY;
            for (let i = 1; i < dots.length; i++) {
                dots[i].x += (dots[i - 1].x - dots[i].x) * 0.3;
                dots[i].y += (dots[i - 1].y - dots[i].y) * 0.3;
            }
            dots.forEach((d) => {
                d.el.style.transform = `translate(${d.x}px, ${d.y}px)`;
            });
        };
        window.addEventListener("mousemove", move);
        return () => {
            window.removeEventListener("mousemove", move);
            container.remove();
        };
    }, [trail]);

    const fontClasses = {
        sans: "font-sans",
        serif: "font-serif",
        mono: "font-mono",
        fancy: "italic font-semibold",
    };

    return (
        <div
            className={`min-h-screen text-white transition-all ${fontClasses[font]}`}
            style={{
                background: background?.startsWith("http")
                    ? `url(${background}) center/cover no-repeat`
                    : background || "#0f172a",
                cursor: cursor || "default",
            }}
        >
            {bannerUrl && (
                <img
                    src={bannerUrl}
                    alt="banner"
                    className="w-full h-40 object-cover"
                />
            )}

            <div className="max-w-xl mx-auto text-center px-4 mt-[-40px]">
                {pfpUrl && (
                    <img
                        src={pfpUrl}
                        alt="pfp"
                        className="w-32 h-32 rounded-full border-4 border-white mx-auto object-cover"
                    />
                )}

                <h1 className="text-3xl font-bold mt-3">{uname}</h1>
                <p className="text-gray-300 mt-1">{bio}</p>

                <div className="mt-4 flex flex-col space-y-3">
                    {(links || []).map((l, i) => (
                        <a
                            key={i}
                            href={l}
                            target="_blank"
                            rel="noreferrer"
                            className="block bg-sky-600 hover:bg-sky-700 py-2 rounded-xl transition"
                        >
                            {l.replace(/^https?:\/\//, "")}
                        </a>
                    ))}
                </div>

                {youtubeEmbed && (
                    <div className="mt-6 aspect-video">
                        <iframe
                            src={youtubeEmbed}
                            title="YouTube"
                            className="w-full h-full rounded-xl"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
}

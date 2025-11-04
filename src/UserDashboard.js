import React, { useState, useEffect } from "react";

// Dummy Counter class for demonstration; replace with your CounterAPI instance
class Counter {
    constructor({ workspace }) { this.workspace = workspace; }
    async get(name) { return { data: { value: Math.floor(Math.random() * 1000) } }; }
    async up(name) { return { data: { up_count: Math.floor(Math.random() * 1000) } }; }
}

export default function UserDashboard({ uid }) {
    const [profile, setProfile] = useState({
        username: "",
        displayName: "",
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        background: "#000000",
        cursor: "",
        glow: true,
        trail: true,
        font: "Courier New",
        youtube: "",
        links: [],
        badges: [
            { src: "/assets/staff.png", title: "Staff" },
            { src: "/assets/active_developer.png", title: "Active Developer" },
            { src: "/assets/quests.png", title: "Quests" },
            { src: "/assets/nitro.png", title: "Nitro" }
        ],
        skills: [
            { name: "Python", value: 87, color: "linear-gradient(90deg, #ff6b6b, #ff9f9f)" },
            { name: "C++", value: 75, color: "linear-gradient(90deg, #4facfe, #00f2fe)" },
            { name: "C#", value: 80, color: "linear-gradient(90deg, #43e97b, #38f9d7)" }
        ],
        visitorCount: 0
    });

    const [newLink, setNewLink] = useState("");

    // Load profile from backend
    useEffect(() => {
        if (!uid) return;
        fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data && setProfile((p) => ({ ...p, ...data })))
            .catch(() => { });
    }, [uid]);

    // Load Discord info (avatar/banner)
    useEffect(() => {
        async function fetchDiscord() {
            if (!uid) return;
            try {
                const res = await fetch(`https://api.lanyard.rest/v1/users/${uid}`);
                const data = await res.json();
                const user = data.data.discord_user;
                const avatarFormat = user.avatar.startsWith("a_") ? "gif" : "png";
                const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarFormat}`;

                const bannerRes = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${uid}`);
                const bannerData = await bannerRes.json();
                const bannerUrl = bannerData.banner?.link || "/assets/def_banner.webp";

                setProfile((prev) => ({
                    ...prev,
                    username: user.username,
                    displayName: user.username,
                    pfpUrl: avatarUrl,
                    bannerUrl: bannerUrl
                }));
            } catch (err) {
                console.error(err);
            }
        }
        fetchDiscord();
    }, [uid]);

    // Load visitor count
    useEffect(() => {
        async function fetchVisitorCount() {
            const counter = new Counter({ workspace: "counter" });
            try {
                const result = await counter.get("cuner");
                setProfile((prev) => ({ ...prev, visitorCount: result.data.value || 0 }));
            } catch (err) {
                console.error("Visitor count error:", err);
            }
        }
        fetchVisitorCount();
    }, []);

    const addLink = () => {
        if (!newLink) return;
        setProfile((prev) => ({ ...prev, links: [...prev.links, newLink] }));
        setNewLink("");
    };

    const removeLink = (idx) => {
        setProfile((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
    };

    const saveProfile = async () => {
        await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile)
        });
        alert("Profile saved!");
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "#050505" }}>
            <h1 className="text-3xl font-bold mb-6 text-white">User Dashboard</h1>

            {/* Profile Preview */}
            <div
                className="w-full max-w-3xl p-6 rounded-xl mb-6"
                style={{
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    fontFamily: profile.font,
                    cursor: profile.cursor || "auto"
                }}
            >
                <div className="profile-header relative flex gap-4" style={{ backgroundImage: `url(${profile.bannerUrl})`, height: 160, borderRadius: 25 }}>
                    <div className="profile-container relative w-36 h-36">
                        <img src={profile.pfpUrl} className="rounded-full w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                            <div className="flex gap-2">
                                {profile.badges.map((b, i) => (
                                    <div key={i} className="relative">
                                        <img src={b.src} alt={b.title} className="w-6 h-6" />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-1 rounded opacity-0 hover:opacity-100">
                                            {b.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>{profile.bio}</div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {profile.links.map((link, i) => (
                        <a key={i} href={link} target="_blank" className="bg-gray-800 px-3 py-1 rounded">{link}</a>
                    ))}
                </div>

                <div className="mt-4">
                    <strong>Profile Views:</strong> {profile.visitorCount}
                </div>

                <div className="mt-4 flex gap-2">
                    <input
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="Add link"
                        className="p-2 rounded bg-gray-800 text-white flex-1"
                    />
                    <button onClick={addLink} className="bg-sky-600 px-4 rounded">Add</button>
                </div>
            </div>

            {/* Settings */}
            <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-xl space-y-4 text-white">
                <input
                    placeholder="Display Name"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800"
                />
                <textarea
                    placeholder="Bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800"
                />
                <input
                    placeholder="Profile Picture URL"
                    value={profile.pfpUrl}
                    onChange={(e) => setProfile({ ...profile, pfpUrl: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800"
                />
                <input
                    placeholder="Banner URL"
                    value={profile.bannerUrl}
                    onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800"
                />

                <div className="flex gap-2">
                    <label>
                        Cursor URL:
                        <input
                            value={profile.cursor}
                            onChange={(e) => setProfile({ ...profile, cursor: e.target.value })}
                            className="p-1 rounded bg-gray-800 ml-2"
                        />
                    </label>
                    <label>
                        Background:
                        <input
                            type="color"
                            value={profile.background}
                            onChange={(e) => setProfile({ ...profile, background: e.target.value })}
                            className="ml-2 w-12 h-8 cursor-pointer"
                        />
                    </label>
                </div>

                <div className="flex gap-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={profile.glow}
                            onChange={(e) => setProfile({ ...profile, glow: e.target.checked })}
                        />
                        Glow
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={profile.trail}
                            onChange={(e) => setProfile({ ...profile, trail: e.target.checked })}
                        />
                        Cursor Trail
                    </label>
                </div>

                <button onClick={saveProfile} className="bg-sky-600 px-6 py-2 rounded">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

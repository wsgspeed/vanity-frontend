import React, { useState, useEffect } from "react";

export default function UserDashboard() {
    const [profile, setProfile] = useState({
        username: "",
        bio: "",
        links: "",
        pfpUrl: "",
        background: "default",
        cursor: "default",
        glow: false,
        trail: false,
    });
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("profile");

    const storedUser = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = storedUser.uid;

    useEffect(() => {
        if (!uid) return (window.location.href = "/login");

        const loadProfile = async () => {
            try {
                let res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                if (res.status === 404) {
                    await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid, username: storedUser.username, bio: "", links: [], pfpUrl: "" }),
                    });
                    res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                }
                const data = await res.json();
                setProfile({
                    username: data.username || "",
                    bio: data.bio || "",
                    links: (data.links || []).join(", "),
                    pfpUrl: data.pfpUrl || "",
                    background: data.background || "default",
                    cursor: data.cursor || "default",
                    glow: data.glow || false,
                    trail: data.trail || false,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [uid, storedUser.username]);

    const saveProfile = async () => {
        const payload = {
            ...profile,
            uid,
            links: profile.links.split(",").map((l) => l.trim()),
        };
        const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        alert(data.message || "Saved!");
    };

    const handleChange = (field, value) => {
        setProfile((p) => ({ ...p, [field]: value }));
    };

    if (loading) return <p className="text-white p-6">Loading dashboard...</p>;

    return (
        <div className={`min-h-screen text-white relative transition-all duration-500 ${profile.background === "space" ? "bg-gradient-to-b from-gray-900 to-black" :
                profile.background === "blue" ? "bg-gradient-to-br from-blue-900 to-blue-600" :
                    profile.background === "pink" ? "bg-gradient-to-br from-pink-900 to-purple-700" :
                        "bg-gray-900"
            }`}>
            {profile.trail && <CursorTrail />}
            <div className="max-w-4xl mx-auto py-10 px-6">
                <h1 className="text-3xl font-bold mb-6">Welcome, @{profile.username}</h1>

                <div className="flex space-x-4 border-b border-gray-700 mb-6">
                    {["profile", "appearance", "settings"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-2 capitalize ${tab === t ? "border-b-2 border-sky-500 text-sky-400" : "text-gray-400"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {tab === "profile" && (
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Profile Picture URL</label>
                            <input
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={profile.pfpUrl}
                                onChange={(e) => handleChange("pfpUrl", e.target.value)}
                            />
                        </div>

                        {profile.pfpUrl && (
                            <img src={profile.pfpUrl} alt="pfp" className="w-24 h-24 rounded-full mb-3 object-cover" />
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Username</label>
                            <input
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={profile.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Bio</label>
                            <textarea
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={profile.bio}
                                onChange={(e) => handleChange("bio", e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Links (comma separated)</label>
                            <input
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                                value={profile.links}
                                onChange={(e) => handleChange("links", e.target.value)}
                            />
                        </div>

                        <button onClick={saveProfile} className="px-6 py-3 bg-sky-600 rounded-xl hover:bg-sky-700 transition">
                            Save Profile
                        </button>
                    </div>
                )}

                {tab === "appearance" && (
                    <div>
                        <h2 className="text-xl mb-3">Appearance Settings</h2>
                        <div className="mb-4">
                            <label>Background</label>
                            <select
                                className="w-full bg-gray-800 p-2 rounded"
                                value={profile.background}
                                onChange={(e) => handleChange("background", e.target.value)}
                            >
                                <option value="default">Default</option>
                                <option value="space">Space</option>
                                <option value="blue">Blue</option>
                                <option value="pink">Pink</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label>Cursor Style</label>
                            <select
                                className="w-full bg-gray-800 p-2 rounded"
                                value={profile.cursor}
                                onChange={(e) => handleChange("cursor", e.target.value)}
                            >
                                <option value="default">Default</option>
                                <option value="pointer">Pointer</option>
                                <option value="crosshair">Crosshair</option>
                                <option value="spark">Spark</option>
                            </select>
                        </div>

                        <div className="flex space-x-4 mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={profile.glow}
                                    onChange={(e) => handleChange("glow", e.target.checked)}
                                />
                                <span>Enable Glow</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={profile.trail}
                                    onChange={(e) => handleChange("trail", e.target.checked)}
                                />
                                <span>Cursor Trail</span>
                            </label>
                        </div>

                        <button onClick={saveProfile} className="px-6 py-3 bg-sky-600 rounded-xl hover:bg-sky-700">
                            Save Appearance
                        </button>
                    </div>
                )}

                {tab === "settings" && (
                    <div>
                        <h2 className="text-xl mb-3">Account Settings</h2>
                        <button
                            onClick={() => {
                                localStorage.removeItem("vanityUser");
                                window.location.href = "/login";
                            }}
                            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700"
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function CursorTrail() {
    const [trail, setTrail] = useState([]);
    useEffect(() => {
        const move = (e) => {
            setTrail((t) => [...t.slice(-15), { x: e.clientX, y: e.clientY }]);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);
    return (
        <div className="pointer-events-none fixed inset-0 z-50">
            {trail.map((p, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-sky-500 rounded-full opacity-60"
                    style={{
                        left: p.x,
                        top: p.y,
                        transform: "translate(-50%, -50%)",
                        animation: "fadeOut 0.5s linear forwards",
                    }}
                ></div>
            ))}
        </div>
    );
}

import React, { useState, useEffect } from "react";

export default function UserDashboard({ uid }) {
    const [tab, setTab] = useState("profile");
    const [profile, setProfile] = useState({
        username: "",
        displayName: "",
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        background: "#0a0a0a",
        cursor: "default",
        glow: true,
        trail: true,
        font: "Arial",
        youtube: "",
        links: [],
    });
    const [newLink, setNewLink] = useState("");

    const fonts = [
        "Arial",
        "Verdana",
        "Courier New",
        "Georgia",
        "Times New Roman",
        "Comic Sans MS",
    ];

    useEffect(() => {
        if (!uid) return;
        fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data && setProfile((p) => ({ ...p, ...data })))
            .catch(() => { });
    }, [uid]);

    const saveProfile = async () => {
        await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, ...profile }),
        });
        alert("✅ Profile saved!");
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center p-6"
            style={{ background: profile.background }}
        >
            <h1 className="text-3xl font-bold mb-6 text-white">User Dashboard</h1>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {["profile", "design", "links", "media"].map((t) => (
                    <button
                        key={t}
                        className={`px-5 py-2 rounded-xl font-semibold ${tab === t
                                ? "bg-sky-600 text-white"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            }`}
                        onClick={() => setTab(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* PROFILE TAB */}
            {tab === "profile" && (
                <div className="w-full max-w-lg space-y-4">
                    <input
                        placeholder="Username"
                        value={profile.username}
                        onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />
                    <input
                        placeholder="Display Name"
                        value={profile.displayName}
                        onChange={(e) =>
                            setProfile({ ...profile, displayName: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />
                    <textarea
                        placeholder="Bio"
                        value={profile.bio}
                        onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl h-24 text-white"
                    />
                    <input
                        placeholder="Profile Picture URL"
                        value={profile.pfpUrl}
                        onChange={(e) =>
                            setProfile({ ...profile, pfpUrl: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />
                    <input
                        placeholder="Banner Image URL"
                        value={profile.bannerUrl}
                        onChange={(e) =>
                            setProfile({ ...profile, bannerUrl: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />
                </div>
            )}

            {/* DESIGN TAB */}
            {tab === "design" && (
                <div className="w-full max-w-lg space-y-4">
                    <label className="block text-white">Background Color</label>
                    <input
                        type="color"
                        value={profile.background}
                        onChange={(e) =>
                            setProfile({ ...profile, background: e.target.value })
                        }
                        className="w-full h-10 rounded-xl cursor-pointer"
                    />

                    <label className="block text-white">Font</label>
                    <select
                        value={profile.font}
                        onChange={(e) =>
                            setProfile({ ...profile, font: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    >
                        {fonts.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>

                    <label className="block text-white">Cursor URL (optional)</label>
                    <input
                        placeholder="Custom cursor URL"
                        value={profile.cursor}
                        onChange={(e) =>
                            setProfile({ ...profile, cursor: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />

                    <div className="flex space-x-6 mt-4 text-white">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={profile.glow}
                                onChange={(e) =>
                                    setProfile({ ...profile, glow: e.target.checked })
                                }
                            />
                            <span>Glow</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={profile.trail}
                                onChange={(e) =>
                                    setProfile({ ...profile, trail: e.target.checked })
                                }
                            />
                            <span>Cursor Trail</span>
                        </label>
                    </div>
                </div>
            )}

            {/* LINKS TAB */}
            {tab === "links" && (
                <div className="w-full max-w-lg space-y-3">
                    <div className="flex space-x-2">
                        <input
                            placeholder="Add link (https://...)"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            className="flex-grow bg-gray-800 p-3 rounded-xl text-white"
                        />
                        <button
                            onClick={() => {
                                if (!newLink) return;
                                setProfile({ ...profile, links: [...profile.links, newLink] });
                                setNewLink("");
                            }}
                            className="bg-sky-600 px-4 rounded-xl text-white"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {profile.links.map((l, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-xl text-white"
                            >
                                <span className="truncate">{l}</span>
                                <button
                                    onClick={() =>
                                        setProfile({
                                            ...profile,
                                            links: profile.links.filter((_, idx) => idx !== i),
                                        })
                                    }
                                    className="text-red-400 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MEDIA TAB */}
            {tab === "media" && (
                <div className="w-full max-w-lg space-y-4">
                    <input
                        placeholder="YouTube Video URL"
                        value={profile.youtube}
                        onChange={(e) =>
                            setProfile({ ...profile, youtube: e.target.value })
                        }
                        className="w-full bg-gray-800 p-3 rounded-xl text-white"
                    />
                </div>
            )}

            <button
                onClick={saveProfile}
                className="mt-8 bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-xl text-white font-semibold"
            >
                Save Changes
            </button>
        </div>
    );
}

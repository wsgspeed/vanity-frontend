import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile"; // import the profile preview component

export default function UserDashboard({ uid }) {
    const [profile, setProfile] = useState({
        username: "",
        displayName: "",
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        backgroundVideo: "",
        backgroundMusic: "",
        cursor: "",
        glow: true,
        trail: true,
        font: "Courier New",
        socialLinks: [
            // Example: { icon: "discord.png", url: "https://discord.gg/temeria", title: "Discord" }
        ],
        skills: [
            // Example: { name: "Python", percentage: 87, icon: "" }
        ],
    });

    const [newLink, setNewLink] = useState({ icon: "", url: "", title: "" });
    const [newSkill, setNewSkill] = useState({ name: "", percentage: 50, icon: "" });

    // Load saved profile from backend
    useEffect(() => {
        if (!uid) return;
        fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`)
            .then((res) => res.ok ? res.json() : null)
            .then((data) => data && setProfile((p) => ({ ...p, ...data })))
            .catch(() => { });
    }, [uid]);

    // Save profile to backend
    const saveProfile = async () => {
        await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, ...profile }),
        });
        alert("✅ Profile saved!");
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
                {/* --- Settings Form --- */}
                <div className="flex-1 space-y-6">
                    {/* Profile */}
                    <div className="bg-gray-900 p-4 rounded-xl space-y-4">
                        <h2 className="text-xl font-semibold">Profile</h2>
                        <input
                            placeholder="Username"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <input
                            placeholder="Display Name"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <textarea
                            placeholder="Bio"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                            rows={4}
                        />
                        <input
                            placeholder="Profile Picture URL"
                            value={profile.pfpUrl}
                            onChange={(e) => setProfile({ ...profile, pfpUrl: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <input
                            placeholder="Banner URL"
                            value={profile.bannerUrl}
                            onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                    </div>

                    {/* Design */}
                    <div className="bg-gray-900 p-4 rounded-xl space-y-4">
                        <h2 className="text-xl font-semibold">Design</h2>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={profile.glow}
                                onChange={(e) => setProfile({ ...profile, glow: e.target.checked })}
                            />
                            Glow
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={profile.trail}
                                onChange={(e) => setProfile({ ...profile, trail: e.target.checked })}
                            />
                            Cursor Trail
                        </label>
                        <input
                            placeholder="Custom Cursor URL"
                            value={profile.cursor}
                            onChange={(e) => setProfile({ ...profile, cursor: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <input
                            placeholder="Font"
                            value={profile.font}
                            onChange={(e) => setProfile({ ...profile, font: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <input
                            placeholder="Background Video URL"
                            value={profile.backgroundVideo}
                            onChange={(e) => setProfile({ ...profile, backgroundVideo: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                        <input
                            placeholder="Background Music URL"
                            value={profile.backgroundMusic}
                            onChange={(e) => setProfile({ ...profile, backgroundMusic: e.target.value })}
                            className="w-full p-3 rounded-xl bg-gray-800"
                        />
                    </div>

                    {/* Social Links */}
                    <div className="bg-gray-900 p-4 rounded-xl space-y-4">
                        <h2 className="text-xl font-semibold">Social Links</h2>
                        <div className="flex gap-2">
                            <input
                                placeholder="Icon URL"
                                value={newLink.icon}
                                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                                className="flex-1 p-2 rounded bg-gray-800"
                            />
                            <input
                                placeholder="Title"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                className="flex-1 p-2 rounded bg-gray-800"
                            />
                            <input
                                placeholder="Link URL"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="flex-1 p-2 rounded bg-gray-800"
                            />
                            <button
                                onClick={() => {
                                    if (!newLink.url) return;
                                    setProfile({ ...profile, socialLinks: [...profile.socialLinks, newLink] });
                                    setNewLink({ icon: "", url: "", title: "" });
                                }}
                                className="bg-sky-600 px-4 rounded-xl"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {profile.socialLinks.map((l, i) => (
                                <div key={i} className="flex justify-between bg-gray-800 p-2 rounded-xl">
                                    <span>{l.title}: {l.url}</span>
                                    <button
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                socialLinks: profile.socialLinks.filter((_, idx) => idx !== i),
                                            })
                                        }
                                        className="text-red-400"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-gray-900 p-4 rounded-xl space-y-4">
                        <h2 className="text-xl font-semibold">Skills</h2>
                        <div className="flex gap-2 items-center">
                            <input
                                placeholder="Skill Name"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                className="p-2 rounded bg-gray-800"
                            />
                            <input
                                type="number"
                                placeholder="%"
                                value={newSkill.percentage}
                                onChange={(e) => setNewSkill({ ...newSkill, percentage: Number(e.target.value) })}
                                className="w-20 p-2 rounded bg-gray-800"
                            />
                            <input
                                placeholder="Icon URL"
                                value={newSkill.icon}
                                onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                                className="p-2 rounded bg-gray-800"
                            />
                            <button
                                onClick={() => {
                                    if (!newSkill.name) return;
                                    setProfile({ ...profile, skills: [...profile.skills, newSkill] });
                                    setNewSkill({ name: "", percentage: 50, icon: "" });
                                }}
                                className="bg-sky-600 px-4 rounded-xl"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {profile.skills.map((s, i) => (
                                <div key={i} className="flex justify-between bg-gray-800 p-2 rounded-xl">
                                    <span>{s.name} - {s.percentage}%</span>
                                    <button
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                skills: profile.skills.filter((_, idx) => idx !== i),
                                            })
                                        }
                                        className="text-red-400"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={saveProfile}
                        className="mt-4 bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-xl"
                    >
                        Save Profile
                    </button>
                </div>

                {/* --- Profile Preview --- */}
                <div className="flex-1">
                    <UserProfile profile={profile} />
                </div>
            </div>
        </div>
    );
}

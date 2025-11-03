import React, { useState, useEffect } from "react";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [pfpUrl, setPfpUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [links, setLinks] = useState([{ label: "", url: "" }]);
    const [themeColor, setThemeColor] = useState("#0ea5e9");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const storedUser = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = storedUser.uid;

    useEffect(() => {
        if (!uid) window.location.href = "/login";
    }, [uid]);

    useEffect(() => {
        if (!uid) return;

        const fetchProfile = async () => {
            try {
                let res = await fetch(
                    `https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`
                );
                if (res.status === 404) {
                    await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            uid,
                            username: storedUser.username,
                            bio: "",
                            links: [],
                            pfpUrl: null,
                        }),
                    });
                    res = await fetch(
                        `https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`
                    );
                }
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setUserName(data.username || "");
                setBio(data.bio || "");
                setLinks(
                    (data.links || []).map((l) =>
                        typeof l === "string" ? { label: l, url: l } : l
                    )
                );
                setPfpUrl(data.pfpUrl || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [uid, storedUser.username]);

    const handleSaveProfile = async () => {
        if (!uid) return alert("You must be logged in!");
        const payload = {
            uid,
            username: userName,
            bio,
            links: links.map((l) => l.url),
            pfpUrl,
            themeColor,
        };
        try {
            const res = await fetch(
                "https://vanitybackend-43ng.onrender.com/api/saveProfile",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save profile");
            alert(data.message || "Profile saved!");
        } catch (err) {
            alert("Error saving profile: " + err.message);
        }
    };

    const addLink = () => setLinks([...links, { label: "", url: "" }]);
    const updateLink = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };
    const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

    if (loading) return <p className="text-white p-6">Loading...</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex mb-6 space-x-4">
                    {["profile", "links", "settings", "analytics"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg ${activeTab === tab
                                    ? "bg-sky-600"
                                    : "bg-gray-800 hover:bg-gray-700"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === "profile" && (
                    <div className="space-y-4">
                        <div>
                            <label>Profile Picture URL</label>
                            {pfpUrl && (
                                <img
                                    src={pfpUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full mb-2 object-cover border border-gray-700"
                                />
                            )}
                            <input
                                type="text"
                                value={pfpUrl}
                                onChange={(e) => setPfpUrl(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                            />
                        </div>
                        <div>
                            <label>Username</label>
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                            />
                        </div>
                        <div>
                            <label>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            className="px-6 py-2 bg-sky-600 rounded-lg"
                        >
                            Save Profile
                        </button>
                    </div>
                )}

                {activeTab === "links" && (
                    <div className="space-y-4">
                        {links.map((link, i) => (
                            <div key={i} className="flex space-x-2 items-center">
                                <input
                                    placeholder="Label"
                                    value={link.label}
                                    onChange={(e) => updateLink(i, "label", e.target.value)}
                                    className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
                                />
                                <input
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => updateLink(i, "url", e.target.value)}
                                    className="flex-2 p-2 rounded bg-gray-800 border border-gray-700"
                                />
                                <button
                                    onClick={() => removeLink(i)}
                                    className="px-2 py-1 bg-red-600 rounded-lg"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addLink}
                            className="px-4 py-2 bg-green-600 rounded-lg"
                        >
                            Add Link
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            className="px-6 py-2 bg-sky-600 rounded-lg"
                        >
                            Save Links
                        </button>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-4">
                        <div>
                            <label>Theme Color</label>
                            <input
                                type="color"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                className="w-16 h-10 rounded border border-gray-700"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            className="px-6 py-2 bg-sky-600 rounded-lg"
                        >
                            Save Settings
                        </button>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="text-gray-400">
                        Analytics coming soon...
                    </div>
                )}
            </div>
        </div>
    );
}

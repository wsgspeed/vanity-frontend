import React, { useState, useEffect } from "react";

export default function UserDashboard() {
    const [pfpUrl, setPfpUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [links, setLinks] = useState("");
    const [youtubeEmbed, setYoutubeEmbed] = useState("");
    const [background, setBackground] = useState("");
    const [cursor, setCursor] = useState("default");
    const [font, setFont] = useState("sans");
    const [trail, setTrail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const storedUser = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = storedUser.uid;

    // Redirect after render
    useEffect(() => {
        if (!uid) {
            window.location.href = "/login";
        }
    }, [uid]);

    // Fetch or create profile
    useEffect(() => {
        if (!uid) return;

        const fetchOrCreateProfile = async () => {
            try {
                let res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);

                if (res.status === 404) {
                    await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            uid,
                            username: storedUser.username,
                            bio: "",
                            links: [],
                            pfpUrl: "",
                            bannerUrl: "",
                        }),
                    });
                    res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                }

                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();

                setUserName(data.username || "");
                setBio(data.bio || "");
                setLinks((data.links || []).join(", "));
                setPfpUrl(data.pfpUrl || "");
                setBannerUrl(data.bannerUrl || "");
                setBackground(data.background || "");
                setCursor(data.cursor || "default");
                setFont(data.font || "sans");
                setTrail(!!data.trail);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrCreateProfile();
    }, [uid, storedUser.username]);

    const handleSaveProfile = async () => {
        if (!uid) return alert("You must be logged in!");

        const payload = {
            uid,
            username: userName,
            bio,
            links: links.split(",").map((l) => l.trim()),
            pfpUrl,
            bannerUrl,
            youtubeEmbed,
            background,
            cursor,
            font,
            trail,
        };

        try {
            const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save profile");
            alert("✅ Profile saved!");
        } catch (err) {
            console.error(err);
            alert("Error saving profile: " + err.message);
        }
    };

    if (loading) return <p className="text-white p-6">Loading profile...</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold text-center mb-4">Dashboard</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Profile Picture URL</label>
                        {pfpUrl && <img src={pfpUrl} alt="pfp" className="w-24 h-24 rounded-full mb-3 object-cover border border-gray-700" />}
                        <input
                            type="text"
                            value={pfpUrl}
                            onChange={(e) => setPfpUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">Banner Image URL</label>
                        {bannerUrl && <img src={bannerUrl} alt="banner" className="w-full h-24 object-cover mb-3 border border-gray-700 rounded" />}
                        <input
                            type="text"
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="Banner image URL"
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">Username</label>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Links (comma separated)</label>
                        <input
                            value={links}
                            onChange={(e) => setLinks(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">YouTube Embed URL</label>
                        <input
                            value={youtubeEmbed}
                            onChange={(e) => setYoutubeEmbed(e.target.value)}
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">Background</label>
                        <input
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            placeholder="Color hex or image URL"
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />

                        <label className="block mt-4 mb-2">Cursor</label>
                        <select
                            value={cursor}
                            onChange={(e) => setCursor(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        >
                            <option value="default">Default</option>
                            <option value="pointer">Pointer</option>
                            <option value="crosshair">Crosshair</option>
                            <option value="none">Hidden</option>
                        </select>

                        <label className="block mt-4 mb-2">Font</label>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        >
                            <option value="sans">Sans</option>
                            <option value="serif">Serif</option>
                            <option value="mono">Monospace</option>
                            <option value="fancy">Fancy</option>
                        </select>

                        <label className="block mt-4">
                            <input
                                type="checkbox"
                                checked={trail}
                                onChange={() => setTrail(!trail)}
                                className="mr-2"
                            />
                            Enable Cursor Trail
                        </label>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleSaveProfile}
                        className="mt-6 px-8 py-3 bg-sky-600 hover:bg-sky-700 rounded-xl transition"
                    >
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

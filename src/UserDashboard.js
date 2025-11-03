import React, { useState, useEffect } from "react";


export default function UserDashboard() {
    const [pfpUrl, setPfpUrl] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [links, setLinks] = useState("");
    const [user, setUser] = useState(null);

    // Track logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) setUser(currentUser);
            else setUser(null);
        });
        return unsubscribe;
    }, []);

    // Load profile from backend
    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${user.uid}`);
                if (!res.ok) throw new Error("Profile not found");
                const data = await res.json();
                setUsername(data.username || "");
                setBio(data.bio || "");
                setLinks((data.links || []).join(", "));
                setPfpUrl(data.pfpUrl || "");
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return alert("You must be logged in to save your profile!");

        const payload = {
            username,
            bio,
            links: links.split(",").map((l) => l.trim()),
            pfpUrl,
        };

        try {
            const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            alert(data.message || "Profile saved!");
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    if (!user) return <p className="text-white p-6">Please log in to edit your profile.</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl mb-4">Edit Profile</h2>

                <div className="mb-4">
                    <label className="block mb-2">Profile Picture URL</label>
                    {pfpUrl && <img src={pfpUrl} alt="Profile" className="w-24 h-24 rounded-full mb-3 object-cover border border-gray-700" />}
                    <input
                        type="text"
                        value={pfpUrl}
                        placeholder="Enter image URL"
                        onChange={(e) => setPfpUrl(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
                </div>

                <div className="mb-4">
                    <label>Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
                </div>

                <div className="mb-4">
                    <label>Links (comma separated)</label>
                    <input value={links} onChange={(e) => setLinks(e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
                </div>

                <button onClick={handleSaveProfile} className="mt-4 px-6 py-3 bg-sky-600 rounded-xl">
                    Save Profile
                </button>
            </div>
        </div>
    );
}

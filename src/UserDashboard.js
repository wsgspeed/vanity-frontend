import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // adjust path
import { onAuthStateChanged } from "firebase/auth";

export default function UserDashboard() {
    const [pfpUrl, setPfpUrl] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [links, setLinks] = useState("");
    const [userId, setUserId] = useState(null);

    // Track logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return unsubscribe;
    }, []);

    // Load profile from Firestore when user logs in
    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            const docRef = doc(db, "profiles", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPfpUrl(data.pfpUrl || "");
                setUsername(data.username || "");
                setBio(data.bio || "");
                setLinks((data.links || []).join(", "));
            }
        };

        fetchProfile();
    }, [userId]);

    const handleSaveProfile = async () => {
        if (!userId) {
            alert("You must be logged in to save your profile!");
            return;
        }

        const payload = {
            username,
            bio,
            links: links.split(",").map((l) => l.trim()),
            pfpUrl,
        };

        await setDoc(doc(db, "profiles", userId), payload);
        alert("Profile saved!");
    };

    if (!userId) {
        return <p className="text-white p-6">Please log in to edit your profile.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl mb-4">Edit Profile</h2>

                <div className="mb-4">
                    <label className="block mb-2">Profile Picture URL</label>
                    {pfpUrl && (
                        <img
                            src={pfpUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mb-3 object-cover border border-gray-700"
                        />
                    )}
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
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label>Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label>Links (comma separated)</label>
                    <input
                        value={links}
                        onChange={(e) => setLinks(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                </div>

                <button
                    onClick={handleSaveProfile}
                    className="mt-4 px-6 py-3 bg-sky-600 rounded-xl"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChromePicker } from "react-color";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Particles from "react-tsparticles";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState({ uid: "", username: "" });
    const [pfpUrl, setPfpUrl] = useState("");
    const [bio, setBio] = useState("");
    const [links, setLinks] = useState([{ label: "", url: "" }]);
    const [themeColor, setThemeColor] = useState("#0ea5e9");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("vanityUser") || "{}");
        if (!stored.uid) window.location.href = "/login";
        setUser(stored);
    }, []);

    useEffect(() => {
        if (!user.uid) return;
        const fetchProfile = async () => {
            try {
                let res = await fetch(
                    `https://vanitybackend-43ng.onrender.com/api/getProfile/${user.uid}`
                );
                if (res.status === 404) {
                    await fetch(
                        "https://vanitybackend-43ng.onrender.com/api/saveProfile",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                uid: user.uid,
                                username: user.username,
                                bio: "",
                                links: [],
                                pfpUrl: null,
                            }),
                        }
                    );
                    res = await fetch(
                        `https://vanitybackend-43ng.onrender.com/api/getProfile/${user.uid}`
                    );
                }
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setPfpUrl(data.pfpUrl || "");
                setBio(data.bio || "");
                setLinks(
                    (data.links || []).map((l) =>
                        typeof l === "string" ? { label: l, url: l } : l
                    )
                );
                setThemeColor(data.themeColor || "#0ea5e9");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.uid]);

    const handleSave = async () => {
        const payload = {
            uid: user.uid,
            username: user.username,
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
            if (!res.ok) throw new Error(data.error || "Failed to save");
            alert(data.message || "Saved!");
        } catch (err) {
            alert(err.message);
        }
    };

    const addLink = () => setLinks([...links, { label: "", url: "" }]);
    const updateLink = (i, field, value) => {
        const newLinks = [...links];
        newLinks[i][field] = value;
        setLinks(newLinks);
    };
    const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newLinks = Array.from(links);
        const [removed] = newLinks.splice(result.source.index, 1);
        newLinks.splice(result.destination.index, 0, removed);
        setLinks(newLinks);
    };

    if (loading) return <p className="text-white p-6">Loading...</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;

    return (
        <div className="min-h-screen relative bg-gray-900 text-white p-6 overflow-hidden">
            <Particles
                className="absolute top-0 left-0 w-full h-full z-0"
                options={{
                    fpsLimit: 60,
                    particles: {
                        number: { value: 50 },
                        color: { value: themeColor },
                        shape: { type: "circle" },
                        opacity: { value: 0.5 },
                        size: { value: 3 },
                        move: { enable: true, speed: 2 },
                    },
                }}
            />
            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="flex mb-6 space-x-4">
                    {["profile", "links", "settings", "preview"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-sky-600" : "bg-gray-800 hover:bg-gray-700"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === "profile" && (
                    <div className="space-y-4">
                        <input
                            placeholder="Profile Image URL"
                            value={pfpUrl}
                            onChange={(e) => setPfpUrl(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                        <input
                            placeholder="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-sky-600 rounded-lg"
                        >
                            Save Profile
                        </button>
                    </div>
                )}

                {activeTab === "links" && (
                    <div>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="links">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {links.map((link, i) => (
                                            <Draggable key={i} draggableId={String(i)} index={i}>
                                                {(prov) => (
                                                    <div
                                                        ref={prov.innerRef}
                                                        {...prov.draggableProps}
                                                        {...prov.dragHandleProps}
                                                        className="flex space-x-2 mb-2 items-center"
                                                    >
                                                        <input
                                                            placeholder="Label"
                                                            value={link.label}
                                                            onChange={(e) =>
                                                                updateLink(i, "label", e.target.value)
                                                            }
                                                            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
                                                        />
                                                        <input
                                                            placeholder="URL"
                                                            value={link.url}
                                                            onChange={(e) =>
                                                                updateLink(i, "url", e.target.value)
                                                            }
                                                            className="flex-2 p-2 rounded bg-gray-800 border border-gray-700"
                                                        />
                                                        <button
                                                            onClick={() => removeLink(i)}
                                                            className="px-2 py-1 bg-red-600 rounded-lg"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <button
                            onClick={addLink}
                            className="px-4 py-2 bg-green-600 rounded-lg mt-2"
                        >
                            Add Link
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-sky-600 rounded-lg mt-2"
                        >
                            Save Links
                        </button>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-4">
                        <label>Theme Color</label>
                        <ChromePicker
                            color={themeColor}
                            onChangeComplete={(c) => setThemeColor(c.hex)}
                        />
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-sky-600 rounded-lg mt-2"
                        >
                            Save Settings
                        </button>
                    </div>
                )}

                {activeTab === "preview" && (
                    <div
                        className="mt-6 p-4 rounded-lg"
                        style={{ backgroundColor: "#111", border: `2px solid ${themeColor}` }}
                    >
                        <img
                            src={pfpUrl}
                            className="w-24 h-24 rounded-full mx-auto mb-2"
                            alt="profile"
                        />
                        <h2 className="text-center text-xl mb-2">{user.username}</h2>
                        <p className="text-center mb-4">{bio}</p>
                        <div className="space-y-2">
                            {links.map((l, idx) => (
                                <a
                                    key={idx}
                                    href={l.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block py-2 bg-gray-800 hover:bg-sky-700 rounded-lg transition-all"
                                >
                                    {l.label || l.url}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

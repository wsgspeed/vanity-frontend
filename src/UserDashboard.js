import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const stored = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = stored.uid;
    const starterUsername = stored.username || "";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [profile, setProfile] = useState({
        uid: uid || "",
        username: starterUsername,
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        backgroundType: "gradient", // color | gradient | image
        backgroundValue: "linear-gradient(135deg,#0ea5e9,#9333ea)",
        accentColor: "#0ea5e9",
        fontFamily: "system-ui",
        buttonStyle: "rounded", // rounded | glass | neon
        cursorStyle: "default", // default | pointer | crosshair | neon
        cursorTrail: true,
        glow: true,
        songUrl: "",
        autoplaySong: false,
        layout: "centered",
        sections: [
            { id: Date.now(), title: "Links", links: [{ id: Date.now() + 1, label: "Website", url: "https://example.com" }] }
        ]
    });

    useEffect(() => {
        if (!uid) {
            window.location.href = "/login";
            return;
        }
        (async () => {
            try {
                let res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                if (res.status === 404) {
                    await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid, username: starterUsername })
                    });
                    res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                }
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                setProfile((p) => ({
                    ...p,
                    username: data.username || p.username,
                    bio: data.bio || "",
                    pfpUrl: data.pfpUrl || "",
                    bannerUrl: data.bannerUrl || "",
                    backgroundType: data.backgroundType || p.backgroundType,
                    backgroundValue: data.backgroundValue || p.backgroundValue,
                    accentColor: data.accentColor || p.accentColor,
                    fontFamily: data.fontFamily || p.fontFamily,
                    buttonStyle: data.buttonStyle || p.buttonStyle,
                    cursorStyle: data.cursorStyle || p.cursorStyle,
                    cursorTrail: data.cursorTrail ?? p.cursorTrail,
                    glow: data.glow ?? p.glow,
                    songUrl: data.songUrl || "",
                    autoplaySong: data.autoplaySong || false,
                    layout: data.layout || p.layout,
                    sections: data.sections && data.sections.length ? data.sections.map((s, i) => ({ id: Date.now() + i, title: s.title, links: (s.links || []).map((l, j) => ({ id: Date.now() + i + j + 1, label: l.label || l, url: l.url || l })) })) : p.sections
                }));
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, [uid, starterUsername]);

    const change = (key, value) => setProfile(p => ({ ...p, [key]: value }));
    const save = async () => {
        setSaving(true);
        try {
            const payload = { ...profile };
            payload.sections = (profile.sections || []).map(s => ({ title: s.title, links: (s.links || []).map(l => ({ label: l.label, url: l.url })) }));
            const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j.error || j.message || "Save failed");
            alert(j.message || "Saved");
        } catch (e) {
            alert(String(e));
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => setProfile(p => ({ ...p, sections: [...(p.sections || []), { id: Date.now(), title: "New Section", links: [] }] }));
    const removeSection = id => setProfile(p => ({ ...p, sections: (p.sections || []).filter(s => s.id !== id) }));
    const updateSectionTitle = (id, title) => setProfile(p => ({ ...p, sections: p.sections.map(s => s.id === id ? { ...s, title } : s) }));
    const addLink = secId => setProfile(p => ({ ...p, sections: p.sections.map(s => s.id === secId ? { ...s, links: [...(s.links || []), { id: Date.now(), label: "", url: "" }] } : s) }));
    const updateLink = (secId, linkId, field, v) => setProfile(p => ({ ...p, sections: p.sections.map(s => s.id === secId ? { ...s, links: s.links.map(l => l.id === linkId ? { ...l, [field]: v } : l) } : s) }));
    const removeLink = (secId, linkId) => setProfile(p => ({ ...p, sections: p.sections.map(s => s.id === secId ? { ...s, links: s.links.filter(l => l.id !== linkId) } : s) }));
    const moveLink = (secId, linkId, dir) => setProfile(p => {
        const sections = p.sections.map(s => {
            if (s.id !== secId) return s;
            const idx = s.links.findIndex(l => l.id === linkId);
            if (idx < 0) return s;
            const arr = [...s.links];
            const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(arr.length - 1, idx + 1);
            const [it] = arr.splice(idx, 1);
            arr.splice(newIdx, 0, it);
            return { ...s, links: arr };
        });
        return { ...p, sections };
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading dashboard...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">Error: {error}</div>;

    const previewData = {
        username: profile.username,
        bio: profile.bio,
        pfpUrl: profile.pfpUrl,
        bannerUrl: profile.bannerUrl,
        backgroundType: profile.backgroundType,
        backgroundValue: profile.backgroundValue,
        accentColor: profile.accentColor,
        fontFamily: profile.fontFamily,
        buttonStyle: profile.buttonStyle,
        cursorStyle: profile.cursorStyle,
        cursorTrail: profile.cursorTrail,
        glow: profile.glow,
        songUrl: profile.songUrl,
        autoplaySong: profile.autoplaySong,
        layout: profile.layout,
        sections: profile.sections.map(s => ({ title: s.title, links: s.links.map(l => l.url || l.label) }))
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Vanity Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={save} disabled={saving} className="px-4 py-2 bg-sky-600 rounded">
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <nav className="flex space-x-2">
                            {["appearance", "content", "effects", "music", "advanced"].map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab === t ? "bg-sky-600" : "bg-gray-700"}`}>{t[0].toUpperCase() + t.slice(1)}</button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {tab === "appearance" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Username</label>
                                    <input value={profile.username} onChange={e => change("username", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Banner URL</label>
                                    <input value={profile.bannerUrl} onChange={e => change("bannerUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Profile picture URL</label>
                                    <input value={profile.pfpUrl} onChange={e => change("pfpUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Bio</label>
                                    <textarea value={profile.bio} onChange={e => change("bio", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Background type</label>
                                    <select value={profile.backgroundType} onChange={e => change("backgroundType", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="color">Solid Color</option>
                                        <option value="gradient">Gradient</option>
                                        <option value="image">Image URL</option>
                                    </select>
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-300 mb-1">Background value (css color / gradient / image url)</label>
                                        <input value={profile.backgroundValue} onChange={e => change("backgroundValue", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Accent color</label>
                                        <input type="color" value={profile.accentColor} onChange={e => change("accentColor", e.target.value)} className="w-full h-10" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Font family</label>
                                        <input value={profile.fontFamily} onChange={e => change("fontFamily", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {tab === "content" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg">Sections</h3>
                                    <button onClick={addSection} className="px-3 py-1 bg-green-600 rounded">Add</button>
                                </div>
                                <div className="space-y-3">
                                    {profile.sections.map(sec => (
                                        <div key={sec.id} className="bg-gray-900 p-3 rounded border border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <input value={sec.title} onChange={e => updateSectionTitle(sec.id, e.target.value)} className="p-2 bg-gray-800 rounded flex-1 mr-2" />
                                                <button onClick={() => removeSection(sec.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
                                            </div>
                                            <div className="space-y-2">
                                                {(sec.links || []).map(l => (
                                                    <div key={l.id} className="flex items-center space-x-2">
                                                        <input placeholder="Label" value={l.label} onChange={e => updateLink(sec.id, l.id, "label", e.target.value)} className="flex-1 p-2 bg-gray-800 rounded" />
                                                        <input placeholder="URL" value={l.url} onChange={e => updateLink(sec.id, l.id, "url", e.target.value)} className="flex-2 p-2 bg-gray-800 rounded" />
                                                        <button onClick={() => moveLink(sec.id, l.id, "up")} className="px-2 py-1 bg-gray-700 rounded">↑</button>
                                                        <button onClick={() => moveLink(sec.id, l.id, "down")} className="px-2 py-1 bg-gray-700 rounded">↓</button>
                                                        <button onClick={() => removeLink(sec.id, l.id)} className="px-2 py-1 bg-red-600 rounded">X</button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addLink(sec.id)} className="px-3 py-1 bg-blue-600 rounded">Add link</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === "effects" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Cursor style</label>
                                    <select value={profile.cursorStyle} onChange={e => change("cursorStyle", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="default">Default</option>
                                        <option value="pointer">Pointer</option>
                                        <option value="crosshair">Crosshair</option>
                                        <option value="neon">Neon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={profile.cursorTrail} onChange={e => change("cursorTrail", e.target.checked)} />
                                        <span className="ml-2">Cursor trail</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={profile.glow} onChange={e => change("glow", e.target.checked)} />
                                        <span className="ml-2">Glow</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {tab === "music" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Song URL (mp3 or supported embed)</label>
                                    <input value={profile.songUrl} onChange={e => change("songUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={profile.autoplaySong} onChange={e => change("autoplaySong", e.target.checked)} />
                                        <span className="ml-2">Autoplay (if supported)</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {tab === "advanced" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Layout</label>
                                    <select value={profile.layout} onChange={e => change("layout", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="centered">Centered</option>
                                        <option value="grid">Grid</option>
                                        <option value="compact">Compact</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Custom CSS</label>
                                    <textarea onChange={e => change("customCss", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="Optional CSS"></textarea>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Live preview</h3>
                    <div style={{ minHeight: 420 }} className="rounded p-3">
                        <ProfilePreview profile={previewData} />
                    </div>
                    <div className="mt-3 text-xs text-gray-400">Public URL: /u/{profile.username}</div>
                </div>
            </div>
        </div>
    );
}

function ProfilePreview({ profile }) {
    const bgStyle = {};
    if (profile.backgroundType === "color") bgStyle.background = profile.backgroundValue;
    else if (profile.backgroundType === "gradient") bgStyle.backgroundImage = profile.backgroundValue;
    else if (profile.backgroundType === "image") bgStyle.backgroundImage = `url(${profile.backgroundValue})`;
    return (
        <div style={{ ...bgStyle, minHeight: 360, borderRadius: 8, padding: 18, color: profile.fontColor || "#fff", fontFamily: profile.fontFamily || "system-ui" }}>
            {profile.bannerUrl && <img src={profile.bannerUrl} alt="banner" className="w-full h-28 object-cover rounded mb-3" />}
            <div className="flex flex-col items-center">
                {profile.pfpUrl && <img src={profile.pfpUrl} alt="pfp" className="w-20 h-20 rounded-full mb-2" style={{ boxShadow: profile.glow ? `0 0 18px ${profile.accentColor}` : undefined }} />}
                <h2 className="text-xl font-bold">@{profile.username}</h2>
                {profile.bio && <p className="text-sm text-gray-200 mb-3 text-center">{profile.bio}</p>}
                {profile.songUrl && <audio controls src={profile.songUrl} className="mb-3" />}
                <div className={`w-full ${profile.layout === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col space-y-3"}`}>
                    {(profile.sections || []).flatMap(s => s.links || []).map((l, i) => (
                        <a key={i} href={l} target="_blank" rel="noreferrer" className="block bg-gray-900 py-3 rounded-xl hover:bg-sky-600 transition text-center">{l}</a>
                    ))}
                </div>
            </div>
        </div>
    );
}

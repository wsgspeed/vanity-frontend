import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [tab, setTab] = useState("appearance");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const storedUser = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = storedUser.uid;
    const initialUsername = storedUser.username || "";

    const [state, setState] = useState({
        uid: uid || "",
        username: initialUsername,
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        backgroundType: "color", // color | gradient | image | video
        backgroundValue: "#0b1226", // color or gradient string or image url or video url
        fontFamily: "system-ui",
        fontColor: "#ffffff",
        themeColor: "#0ea5e9",
        cursorStyle: "default", // default | pointer | crosshair | neon
        cursorColor: "#0ea5e9",
        cursorTrail: true,
        glow: false,
        songEmbed: "",
        autoplaySong: false,
        layout: "centered", // centered | grid | compact
        sections: [
            { id: Date.now(), title: "Links", links: [{ id: Date.now() + 1, label: "Website", url: "" }] },
        ],
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
                        body: JSON.stringify({ uid, username: initialUsername }),
                    });
                    res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                }
                if (!res.ok) throw new Error("Failed to load profile");
                const data = await res.json();
                setState((s) => ({
                    ...s,
                    uid,
                    username: data.username || s.username,
                    bio: data.bio || "",
                    pfpUrl: data.pfpUrl || "",
                    bannerUrl: data.bannerUrl || "",
                    backgroundType: data.backgroundType || s.backgroundType,
                    backgroundValue: data.backgroundValue || s.backgroundValue,
                    fontFamily: data.fontFamily || s.fontFamily,
                    fontColor: data.fontColor || s.fontColor,
                    themeColor: data.themeColor || s.themeColor,
                    cursorStyle: data.cursorStyle || s.cursorStyle,
                    cursorColor: data.cursorColor || s.cursorColor,
                    cursorTrail: data.cursorTrail ?? s.cursorTrail,
                    glow: data.glow ?? s.glow,
                    songEmbed: data.songEmbed || "",
                    autoplaySong: data.autoplaySong || false,
                    layout: data.layout || s.layout,
                    sections: data.sections && data.sections.length ? data.sections : s.sections,
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [uid, initialUsername]);

    const change = (k, v) => setState((s) => ({ ...s, [k]: v }));

    const save = async () => {
        setSaving(true);
        try {
            const payload = { ...state };
            // normalize sections: remove transient ids when serializing
            payload.sections = (state.sections || []).map((sec) => ({
                title: sec.title,
                links: (sec.links || []).map((l) => ({ label: l.label, url: l.url })),
            }));
            const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Save failed");
            alert(data.message || "Saved");
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        setState((s) => ({
            ...s,
            sections: [...(s.sections || []), { id: Date.now(), title: "New Section", links: [] }],
        }));
    };
    const removeSection = (id) => {
        setState((s) => ({ ...s, sections: (s.sections || []).filter((x) => x.id !== id) }));
    };
    const updateSectionTitle = (id, title) => {
        setState((s) => ({ ...s, sections: s.sections.map((sec) => (sec.id === id ? { ...sec, title } : sec)) }));
    };
    const addLinkToSection = (secId) => {
        setState((s) => ({
            ...s,
            sections: s.sections.map((sec) => (sec.id === secId ? { ...sec, links: [...sec.links, { id: Date.now(), label: "", url: "" }] } : sec)),
        }));
    };
    const updateLink = (secId, linkId, field, value) => {
        setState((s) => ({
            ...s,
            sections: s.sections.map((sec) =>
                sec.id === secId ? { ...sec, links: sec.links.map((l) => (l.id === linkId ? { ...l, [field]: value } : l)) } : sec
            ),
        }));
    };
    const removeLink = (secId, linkId) => {
        setState((s) => ({ ...s, sections: s.sections.map((sec) => (sec.id === secId ? { ...sec, links: sec.links.filter((l) => l.id !== linkId) } : sec)) }));
    };
    const moveLink = (secId, linkId, dir) => {
        setState((s) => {
            const sections = s.sections.map((sec) => {
                if (sec.id !== secId) return sec;
                const idx = sec.links.findIndex((l) => l.id === linkId);
                if (idx < 0) return sec;
                const newLinks = [...sec.links];
                const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(newLinks.length - 1, idx + 1);
                const [item] = newLinks.splice(idx, 1);
                newLinks.splice(newIdx, 0, item);
                return { ...sec, links: newLinks };
            });
            return { ...s, sections };
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading dashboard...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">Error: {error}</div>;

    const previewProfile = {
        username: state.username,
        bio: state.bio,
        pfpUrl: state.pfpUrl,
        bannerUrl: state.bannerUrl,
        backgroundType: state.backgroundType,
        backgroundValue: state.backgroundValue,
        fontFamily: state.fontFamily,
        fontColor: state.fontColor,
        themeColor: state.themeColor,
        cursorStyle: state.cursorStyle,
        cursorColor: state.cursorColor,
        cursorTrail: state.cursorTrail,
        glow: state.glow,
        songEmbed: state.songEmbed,
        autoplaySong: state.autoplaySong,
        layout: state.layout,
        sections: state.sections.map((s) => ({ title: s.title, links: s.links.map((l) => l.url || l.label) })),
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Editor</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={save} disabled={saving} className="px-4 py-2 bg-sky-600 rounded">
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <nav className="flex space-x-2">
                            {["appearance", "content", "effects", "music", "advanced"].map((t) => (
                                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab === t ? "bg-sky-600" : "bg-gray-700"}`}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {tab === "appearance" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Username</label>
                                <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.username} onChange={(e) => change("username", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Banner Image URL</label>
                                <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.bannerUrl} onChange={(e) => change("bannerUrl", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Profile Picture URL</label>
                                <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.pfpUrl} onChange={(e) => change("pfpUrl", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Bio</label>
                                <textarea className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.bio} onChange={(e) => change("bio", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Background Type</label>
                                <select className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.backgroundType} onChange={(e) => change("backgroundType", e.target.value)}>
                                    <option value="color">Solid Color</option>
                                    <option value="gradient">Gradient</option>
                                    <option value="image">Image URL</option>
                                    <option value="video">Video URL</option>
                                </select>
                                <div className="mt-2">
                                    <label className="block text-sm text-gray-300 mb-1">Background Value</label>
                                    <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.backgroundValue} onChange={(e) => change("backgroundValue", e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Font Family</label>
                                <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.fontFamily} onChange={(e) => change("fontFamily", e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Font Color</label>
                                    <input type="color" className="w-full h-10 p-1 rounded" value={state.fontColor} onChange={(e) => change("fontColor", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Theme Color</label>
                                    <input type="color" className="w-full h-10 p-1 rounded" value={state.themeColor} onChange={(e) => change("themeColor", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "content" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg">Sections</h3>
                                <button onClick={addSection} className="px-3 py-1 bg-green-600 rounded">Add Section</button>
                            </div>
                            <div className="space-y-4">
                                {state.sections.map((sec) => (
                                    <div key={sec.id} className="bg-gray-900 p-3 rounded border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <input className="p-2 bg-gray-800 rounded flex-1 mr-2" value={sec.title} onChange={(e) => updateSectionTitle(sec.id, e.target.value)} />
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => removeSection(sec.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {(sec.links || []).map((l) => (
                                                <div key={l.id} className="flex items-center space-x-2">
                                                    <input className="flex-1 p-2 bg-gray-800 rounded" placeholder="Label" value={l.label} onChange={(e) => updateLink(sec.id, l.id, "label", e.target.value)} />
                                                    <input className="flex-2 p-2 bg-gray-800 rounded" placeholder="URL" value={l.url} onChange={(e) => updateLink(sec.id, l.id, "url", e.target.value)} />
                                                    <button onClick={() => moveLink(sec.id, l.id, "up")} className="px-2 py-1 bg-gray-700 rounded">↑</button>
                                                    <button onClick={() => moveLink(sec.id, l.id, "down")} className="px-2 py-1 bg-gray-700 rounded">↓</button>
                                                    <button onClick={() => removeLink(sec.id, l.id)} className="px-2 py-1 bg-red-600 rounded">X</button>
                                                </div>
                                            ))}
                                            <button onClick={() => addLinkToSection(sec.id)} className="px-3 py-1 bg-blue-600 rounded">Add Link</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === "effects" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Cursor Style</label>
                                <select className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.cursorStyle} onChange={(e) => change("cursorStyle", e.target.value)}>
                                    <option value="default">Default</option>
                                    <option value="pointer">Pointer</option>
                                    <option value="crosshair">Crosshair</option>
                                    <option value="neon">Neon</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Cursor Color</label>
                                <input type="color" className="w-20 h-10" value={state.cursorColor} onChange={(e) => change("cursorColor", e.target.value)} />
                            </div>
                            <div>
                                <label className="inline-flex items-center">
                                    <input type="checkbox" checked={state.cursorTrail} onChange={(e) => change("cursorTrail", e.target.checked)} />
                                    <span className="ml-2">Enable Cursor Trail</span>
                                </label>
                            </div>
                            <div>
                                <label className="inline-flex items-center">
                                    <input type="checkbox" checked={state.glow} onChange={(e) => change("glow", e.target.checked)} />
                                    <span className="ml-2">Enable Glow on Images</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {tab === "music" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Song Embed URL (Spotify / SoundCloud / YouTube embed)</label>
                                <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.songEmbed} onChange={(e) => change("songEmbed", e.target.value)} />
                            </div>
                            <div>
                                <label className="inline-flex items-center">
                                    <input type="checkbox" checked={state.autoplaySong} onChange={(e) => change("autoplaySong", e.target.checked)} />
                                    <span className="ml-2">Autoplay song (if supported)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {tab === "advanced" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Layout</label>
                                <select className="w-full p-2 rounded bg-gray-900 border border-gray-700" value={state.layout} onChange={(e) => change("layout", e.target.value)}>
                                    <option value="centered">Centered</option>
                                    <option value="grid">Grid</option>
                                    <option value="compact">Compact</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Custom CSS (will be injected inline)</label>
                                <textarea className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="/* custom css */" onChange={(e) => change("customCss", e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                    <div style={{ minHeight: 400 }} className="rounded p-4" >
                        <ProfilePreview profile={previewProfile} />
                    </div>
                    <div className="mt-3 text-xs text-gray-400">Public URL: /u/{state.username}</div>
                </div>
            </div>
        </div>
    );
}

function ProfilePreview({ profile }) {
    const bgStyle = {};
    if (profile.backgroundType === "color") bgStyle.backgroundColor = profile.backgroundValue;
    else if (profile.backgroundType === "gradient") bgStyle.backgroundImage = profile.backgroundValue;
    else if (profile.backgroundType === "image") bgStyle.backgroundImage = `url(${profile.backgroundValue})`;
    else if (profile.backgroundType === "video") {
        return (
            <div style={{ position: "relative", minHeight: 300, overflow: "hidden", borderRadius: 8 }}>
                <video src={profile.backgroundValue} autoPlay muted loop style={{ width: "100%", objectFit: "cover", filter: profile.glow ? "brightness(1.05)" : undefined }} />
                <ProfileCore profile={profile} overlay />
            </div>
        );
    }

    return (
        <div style={{ ...bgStyle, borderRadius: 8, minHeight: 300, padding: 18 }}>
            <ProfileCore profile={profile} />
        </div>
    );
}

function ProfileCore({ profile, overlay }) {
    const containerStyle = {
        color: profile.fontColor || "#fff",
        fontFamily: profile.fontFamily || "system-ui",
    };

    return (
        <div style={containerStyle}>
            {profile.bannerUrl && !overlay && (
                <img src={profile.bannerUrl} alt="banner" className="w-full h-28 object-cover rounded mb-3" style={{ boxShadow: profile.glow ? `0 0 24px ${profile.themeColor}` : undefined }} />
            )}
            <div className="flex flex-col items-center">
                {profile.pfpUrl && <img src={profile.pfpUrl} alt="pfp" className="w-20 h-20 rounded-full mb-2" style={{ boxShadow: profile.glow ? `0 0 20px ${profile.themeColor}` : undefined }} />}
                <h2 className="text-xl font-bold">@{profile.username}</h2>
                {profile.bio && <p className="text-sm text-gray-200 mb-4 text-center">{profile.bio}</p>}
                {profile.songEmbed && (
                    <div className="mb-3 w-full">
                        <EmbedPlayer url={profile.songEmbed} autoplay={profile.autoplaySong} />
                    </div>
                )}
                <div className={`w-full ${profile.layout === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col space-y-3"}`}>
                    {(profile.sections || []).flatMap((s) => s.links || []).map((link, idx) => (
                        <a key={idx} href={link} target="_blank" rel="noreferrer" className="block bg-gray-900 hover:bg-sky-600 transition px-4 py-3 rounded" style={{ textAlign: "center" }}>
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EmbedPlayer({ url, autoplay }) {
    if (!url) return null;
    const isSpotify = url.includes("spotify");
    const isYouTube = url.includes("youtube") || url.includes("youtu.be");
    const isSoundcloud = url.includes("soundcloud");
    if (isSpotify) {
        const src = url.includes("embed") ? url : url.replace("open.spotify.com", "open.spotify.com/embed");
        return <iframe title="spotify" src={`${src}${autoplay ? "&autoplay=1" : ""}`} style={{ width: "100%", height: 80 }} frameBorder="0" allow="autoplay; encrypted-media" />;
    } else if (isYouTube) {
        let id = "";
        try {
            const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
            id = m ? m[1] : "";
        } catch { id = ""; }
        const src = `https://www.youtube.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
        return <iframe title="youtube" src={src} style={{ width: "100%", height: 180 }} frameBorder="0" allow="autoplay; encrypted-media" />;
    } else if (isSoundcloud) {
        const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}${autoplay ? "&auto_play=true" : ""}`;
        return <iframe title="soundcloud" src={src} style={{ width: "100%", height: 120 }} frameBorder="0" allow="autoplay" />;
    }
    return <div className="text-xs text-gray-300">Unsupported embed</div>;
}

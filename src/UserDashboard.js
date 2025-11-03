import React, { useEffect, useState } from "react";

export default function UserDashboard() {
    const stored = JSON.parse(localStorage.getItem("vanityUser") || "{}");
    const uid = stored.uid;
    const starterUsername = stored.username || "";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState("profile");
    const [error, setError] = useState(null);

    const fontOptions = [
        { id: "system", label: "System" },
        { id: "inter", label: "Inter" },
        { id: "poppins", label: "Poppins" },
        { id: "serif", label: "Serif" },
        { id: "mono", label: "Mono" },
        { id: "fancy", label: "Display" },
    ];

    const cursorOptions = [
        "default",
        "pointer",
        "crosshair",
        "none",
        "custom",
    ];

    const defaultState = {
        uid: uid || "",
        username: starterUsername,
        displayName: "",
        bio: "",
        pfpUrl: "",
        bannerUrl: "",
        // background config can be color, gradient, image
        backgroundType: "gradient",
        backgroundValue: "linear-gradient(135deg,#0ea5e9,#9333ea)",
        accentColor: "#0ea5e9",
        fontFamily: "system",
        buttonStyle: "rounded", // rounded | glass | neon
        cursorStyle: "default",
        customCursorUrl: "",
        cursorTrail: true,
        glow: true,
        songUrl: "",
        autoplaySong: false,
        layout: "centered", // centered | grid | compact
        sections: [
            { id: Date.now(), title: "Links", links: [{ id: Date.now() + 1, label: "Website", url: "https://example.com" }] },
        ],
        customCss: "",
    };

    const [state, setState] = useState(defaultState);

    useEffect(() => {
        if (!uid) {
            // allow useEffect to run (hooks not called conditionally) and then redirect
            setLoading(false);
            window.location.href = "/login";
            return;
        }
        let cancelled = false;
        async function load() {
            try {
                let res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                if (res.status === 404) {
                    // create default
                    await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid, username: starterUsername }),
                    });
                    res = await fetch(`https://vanitybackend-43ng.onrender.com/api/getProfile/${uid}`);
                }
                if (!res.ok) throw new Error("Failed to load profile");
                const data = await res.json();
                if (cancelled) return;
                setState((s) => ({
                    ...s,
                    uid,
                    username: data.username || s.username,
                    displayName: data.displayName || data.username || s.displayName,
                    bio: data.bio || "",
                    pfpUrl: data.pfpUrl || "",
                    bannerUrl: data.bannerUrl || "",
                    backgroundType: data.backgroundType || s.backgroundType,
                    backgroundValue: data.backgroundValue || s.backgroundValue,
                    accentColor: data.accentColor || s.accentColor,
                    fontFamily: data.fontFamily || s.fontFamily,
                    buttonStyle: data.buttonStyle || s.buttonStyle,
                    cursorStyle: data.cursorStyle || s.cursorStyle,
                    customCursorUrl: data.customCursorUrl || s.customCursorUrl,
                    cursorTrail: data.cursorTrail ?? s.cursorTrail,
                    glow: data.glow ?? s.glow,
                    songUrl: data.songUrl || "",
                    autoplaySong: data.autoplaySong ?? s.autoplaySong,
                    layout: data.layout || s.layout,
                    sections: Array.isArray(data.sections) && data.sections.length ? data.sections.map((sec, i) => ({
                        id: Date.now() + i,
                        title: sec.title || "Section",
                        links: (sec.links || []).map((l, j) => ({ id: Date.now() + i + j + 1, label: l.label || l, url: l.url || l })),
                    })) : s.sections,
                    customCss: data.customCss || "",
                }));
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [uid, starterUsername]);

    function change(key, value) {
        setState(s => ({ ...s, [key]: value }));
    }

    function addSection() {
        setState(s => ({ ...s, sections: [...s.sections, { id: Date.now(), title: "New", links: [] }] }));
    }
    function removeSection(id) {
        setState(s => ({ ...s, sections: s.sections.filter(x => x.id !== id) }));
    }
    function updateSectionTitle(id, title) {
        setState(s => ({ ...s, sections: s.sections.map(sec => sec.id === id ? { ...sec, title } : sec) }));
    }
    function addLink(secId) {
        setState(s => ({ ...s, sections: s.sections.map(sec => sec.id === secId ? { ...sec, links: [...sec.links, { id: Date.now(), label: "", url: "" }] } : sec) }));
    }
    function updateLink(secId, linkId, field, value) {
        setState(s => ({ ...s, sections: s.sections.map(sec => sec.id === secId ? { ...sec, links: sec.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } : sec) }));
    }
    function removeLink(secId, linkId) {
        setState(s => ({ ...s, sections: s.sections.map(sec => sec.id === secId ? { ...sec, links: sec.links.filter(l => l.id !== linkId) } : sec) }));
    }
    function moveLink(secId, linkId, dir) {
        setState(s => {
            const sections = s.sections.map(sec => {
                if (sec.id !== secId) return sec;
                const idx = sec.links.findIndex(l => l.id === linkId);
                if (idx < 0) return sec;
                const arr = [...sec.links];
                const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(arr.length - 1, idx + 1);
                const [it] = arr.splice(idx, 1);
                arr.splice(newIdx, 0, it);
                return { ...sec, links: arr };
            });
            return { ...s, sections };
        });
    }

    async function save() {
        setSaving(true);
        try {
            const payload = { ...state };
            payload.sections = (state.sections || []).map(sec => ({
                title: sec.title,
                links: (sec.links || []).map(l => ({ label: l.label, url: l.url })),
            }));
            const res = await fetch("https://vanitybackend-43ng.onrender.com/api/saveProfile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || json.message || "Save failed");
            alert(json.message || "Saved");
        } catch (err) {
            alert(String(err));
        } finally {
            setSaving(false);
        }
    }

    // cursor trail effect (preview only)
    useEffect(() => {
        if (!state.cursorTrail) return;
        const dots = [];
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "0";
        container.style.top = "0";
        container.style.pointerEvents = "none";
        container.style.zIndex = "999999";
        document.body.appendChild(container);
        for (let i = 0; i < 18; i++) {
            const d = document.createElement("div");
            d.style.width = d.style.height = `${6 + (i % 4)}px`;
            d.style.borderRadius = "50%";
            d.style.background = state.accentColor || "#0ea5e9";
            d.style.position = "absolute";
            d.style.opacity = `${1 - i / 20}`;
            container.appendChild(d);
            dots.push({ el: d, x: 0, y: 0 });
        }
        const move = (e) => {
            dots[0].x = e.clientX;
            dots[0].y = e.clientY;
            for (let i = 1; i < dots.length; i++) {
                dots[i].x += (dots[i - 1].x - dots[i].x) * 0.28;
                dots[i].y += (dots[i - 1].y - dots[i].y) * 0.28;
            }
            dots.forEach(d => { d.el.style.transform = `translate(${d.x}px,${d.y}px)`; });
        };
        window.addEventListener("mousemove", move);
        return () => {
            window.removeEventListener("mousemove", move);
            container.remove();
        };
    }, [state.cursorTrail, state.accentColor]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{String(error)}</div>;

    const preview = {
        username: state.username,
        displayName: state.displayName || state.username,
        bio: state.bio,
        pfpUrl: state.pfpUrl,
        bannerUrl: state.bannerUrl,
        backgroundType: state.backgroundType,
        backgroundValue: state.backgroundValue,
        accentColor: state.accentColor,
        fontFamily: state.fontFamily,
        buttonStyle: state.buttonStyle,
        cursorStyle: state.cursorStyle,
        customCursorUrl: state.customCursorUrl,
        cursorTrail: state.cursorTrail,
        glow: state.glow,
        songUrl: state.songUrl,
        autoplaySong: state.autoplaySong,
        layout: state.layout,
        sections: state.sections.map(s => ({ title: s.title, links: s.links.map(l => l.url || l.label) })),
        customCss: state.customCss,
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Editor</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={save} disabled={saving} className="px-4 py-2 bg-sky-600 rounded">
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <nav className="flex space-x-2">
                            {["profile", "appearance", "links", "media", "advanced"].map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab === t ? "bg-sky-600" : "bg-gray-700"}`}>
                                    {t[0].toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {tab === "profile" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Username</label>
                                    <input value={state.username} onChange={e => change("username", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Display name</label>
                                    <input value={state.displayName} onChange={e => change("displayName", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Bio</label>
                                    <textarea value={state.bio} onChange={e => change("bio", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Profile picture URL</label>
                                    <input value={state.pfpUrl} onChange={e => change("pfpUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Banner image URL</label>
                                    <input value={state.bannerUrl} onChange={e => change("bannerUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                            </div>
                        )}

                        {tab === "appearance" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Background type</label>
                                    <select value={state.backgroundType} onChange={e => change("backgroundType", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="color">Solid color</option>
                                        <option value="gradient">Gradient</option>
                                        <option value="image">Image URL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Background value</label>
                                    <input value={state.backgroundValue} onChange={e => change("backgroundValue", e.target.value)} placeholder="CSS color / gradient / image URL" className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Accent color</label>
                                        <input type="color" value={state.accentColor} onChange={e => change("accentColor", e.target.value)} className="w-full h-10" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Font</label>
                                        <select value={state.fontFamily} onChange={e => change("fontFamily", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                            {fontOptions.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Button style</label>
                                    <select value={state.buttonStyle} onChange={e => change("buttonStyle", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="rounded">Rounded</option>
                                        <option value="glass">Glass</option>
                                        <option value="neon">Neon</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {tab === "links" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg">Sections</h3>
                                    <button onClick={addSection} className="px-3 py-1 bg-green-600 rounded">Add</button>
                                </div>
                                <div className="space-y-3">
                                    {state.sections.map(sec => (
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

                        {tab === "media" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Song URL (mp3, spotify link, soundcloud)</label>
                                    <input value={state.songUrl} onChange={e => change("songUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" />
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={state.autoplaySong} onChange={e => change("autoplaySong", e.target.checked)} />
                                        <span className="ml-2">Autoplay</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">YouTube Embed URL (use embed URL)</label>
                                    <input className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="https://www.youtube.com/embed/VIDEO_ID" value={state.youtubeEmbed} onChange={e => change("youtubeEmbed", e.target.value)} />
                                </div>
                            </div>
                        )}

                        {tab === "advanced" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Cursor style</label>
                                    <select value={state.cursorStyle} onChange={e => change("cursorStyle", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        {cursorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Custom cursor URL (optional)</label>
                                    <input value={state.customCursorUrl} onChange={e => change("customCursorUrl", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="cursor URL (.cur/.png fallback)" />
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={state.cursorTrail} onChange={e => change("cursorTrail", e.target.checked)} />
                                        <span className="ml-2">Enable cursor trail</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" checked={state.glow} onChange={e => change("glow", e.target.checked)} />
                                        <span className="ml-2">Enable glow</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Layout</label>
                                    <select value={state.layout} onChange={e => change("layout", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700">
                                        <option value="centered">Centered</option>
                                        <option value="grid">Grid</option>
                                        <option value="compact">Compact</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Custom CSS (optional)</label>
                                    <textarea value={state.customCss} onChange={e => change("customCss", e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="/* custom CSS */" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Live preview</h3>
                    <div style={{ minHeight: 420 }} className="rounded p-3">
                        <ProfilePreview profile={preview} />
                    </div>
                    <div className="mt-3 text-xs text-gray-400">Public URL: /u/{state.username}</div>
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

    const fontMap = {
        system: "inherit",
        inter: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        poppins: "'Poppins', system-ui, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
        fancy: "'Oswald', system-ui, sans-serif",
    };

    return (
        <div style={{ ...bgStyle, minHeight: 360, borderRadius: 8, padding: 18, color: "#fff", fontFamily: fontMap[profile.fontFamily] }}>
            {profile.bannerUrl && <img src={profile.bannerUrl} alt="banner" className="w-full h-28 object-cover rounded mb-3" style={{ boxShadow: profile.glow ? `0 0 20px ${profile.accentColor}` : undefined }} />}
            <div className="flex flex-col items-center">
                {profile.pfpUrl && <img src={profile.pfpUrl} alt="pfp" className="w-20 h-20 rounded-full mb-2" style={{ boxShadow: profile.glow ? `0 0 16px ${profile.accentColor}` : undefined }} />}
                <h2 className="text-xl font-bold">{profile.displayName || profile.username}</h2>
                <p className="text-sm text-gray-200 mb-3 text-center">{profile.bio}</p>
                {profile.songUrl && <audio controls src={profile.songUrl} className="mb-3" />}
                <div className={`w-full ${profile.layout === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col space-y-3"}`}>
                    {(profile.sections || []).flatMap(s => s.links || []).map((l, i) => (
                        <a key={i} href={l} target="_blank" rel="noreferrer" className="block bg-gray-900 hover:bg-sky-600 transition px-4 py-3 rounded text-center">{l}</a>
                    ))}
                </div>
                {profile.customCss && <style>{profile.customCss}</style>}
            </div>
        </div>
    );
}

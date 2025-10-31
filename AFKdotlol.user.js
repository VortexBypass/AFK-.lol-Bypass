// ==UserScript==
// @name         AFK™.lol  Bypass
// @namespace    https://discord.gg/sideloading
// @version      1.0.2
// @description  Bypass rekonise bstlar and mboost.me
// @author       AFK™.lol
// @match        https://bstlar.com/*
// @match        https://rekonise.com/*
// @match        https://mboost.me/*
// @match        https://linkvertise.com/*
// @match        https://link-unlock.com/*
// @icon         https://i.ibb.co/KcXkWgGm/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png
// @grant        none
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/AFK-.lol-Bypass/AFKdotlol.user.js/main/AFKdotlol.user.js
// @updateURL    https://raw.githubusercontent.com/AFK-.lol-Bypass/AFKdotlol.meta.js/main/AFKdotlol.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const META_UPDATE_URL = "https://raw.githubusercontent.com/AFK-.lol-Bypass/AFKdotlol.meta.js/main/AFKdotlol.meta.js";
    const USER_SCRIPT_URL = "https://raw.githubusercontent.com/AFK-.lol-Bypass/AFKdotlol.user.js/main/AFKdotlol.user.js";
    const META_VERSION_KEY = 'afkLol_meta_version_v1';
    const META_SNAPSHOT_KEY = 'afkLol_meta_snapshot_v1';
    const TRW_API_BASE = "https://trw.lat/api/free/bypass?url=";

    let updateDetected = false;
    let lastFetchedMetaText = null;
    let trwApiStartTime = null;
    let trwTimerInterval = null;

    const modalHTML = `
        <div id="afkLol-modal">
            <div id="afkLol-modal-content">
                <img src="https://i.ibb.co/KcXkWgGm/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png" id="afkLol-logo" alt="AFK logo">
                <h1 id="afkLol-title">AFK™.lol Development</h1>
                <p>Bypass Successful! Here is your link:</p>
                <input type="text" id="afkLol-link" value="" readonly>
                <div id="afkLol-redirect-timer">Redirecting in <span id="afkLol-countdown">15</span>s...</div>
            </div>
        </div>
    `;

    const updateModalHTML = `
        <div id="afkLol-update-modal">
            <div id="afkLol-update-content">
                <h1>🔄 Update Detected</h1>
                <p>A new version is available: <strong id="afkLol-new-version"></strong></p>
                <button id="afkLol-update-btn">Update Now</button>
            </div>
        </div>
    `;

    const notificationHTML = `
        <div id="afkLol-notification">
            🎯 Userscript Loaded Successfully
        </div>
    `;

    const trwTimerHTML = `
        <div id="afkLol-trw-timer">
            ⚡ TRW API Processing: <span id="afkLol-api-time">0.00</span>s
        </div>
    `;

    const styleCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
        #afkLol-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4,6,15,0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483646;
            font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-modal-content {
            background: linear-gradient(180deg, #071027, #0b1220);
            color: #e6eef8;
            padding: 26px 22px 20px 22px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(2,6,23,0.7);
            max-width: 520px;
            width: 94%;
            position: relative;
            border: 1px solid rgba(124,58,237,0.12);
            box-sizing: border-box;
        }
        #afkLol-logo {
            width: 80px;
            height: 80px;
            border-radius: 12px;
            margin: 6px 0 12px 0;
            background: rgba(255,255,255,0.02);
            padding: 6px;
            object-fit: cover;
            float: left;
        }
        #afkLol-title {
            font-size: 24px;
            font-weight: 600;
            margin: 6px 0 8px 0;
            color: #f3f6fb;
            clear: both;
            text-shadow: 0 0 10px rgba(124, 58, 237, 0.7), 0 0 20px rgba(124, 58, 237, 0.5), 0 0 30px rgba(124, 58, 237, 0.3);
            animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
            from {
                text-shadow: 0 0 10px rgba(124, 58, 237, 0.7), 0 0 20px rgba(124, 58, 237, 0.5), 0 0 30px rgba(124, 58, 237, 0.3);
            }
            to {
                text-shadow: 0 0 15px rgba(124, 58, 237, 0.8), 0 0 25px rgba(124, 58, 237, 0.6), 0 0 35px rgba(124, 58, 237, 0.4);
            }
        }
        #afkLol-modal-content p {
            font-size: 13px;
            color: #b9c7e6;
            margin-bottom: 12px;
        }
        #afkLol-link {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            background: rgba(255,255,255,0.02);
            text-align: left;
            font-size: 13px;
            color: #e6eef8;
            margin-bottom: 12px;
            box-sizing: border-box;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        #afkLol-link:hover {
            background: rgba(255,255,255,0.04);
        }
        #afkLol-redirect-timer {
            width: 100%;
            padding: 12px;
            margin-top: 6px;
            background: linear-gradient(90deg,#7c3aed,#06b6d4);
            color: #071027;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
        }
        #afkLol-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(90deg, #7c3aed, #06b6d4);
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-weight: 600;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        #afkLol-update-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4,6,15,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-update-content {
            background: linear-gradient(180deg, #071027, #0b1220);
            color: #e6eef8;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(2,6,23,0.7);
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(124,58,237,0.12);
        }
        #afkLol-update-content h1 {
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 15px 0;
            color: #f3f6fb;
        }
        #afkLol-update-content p {
            font-size: 14px;
            color: #b9c7e6;
            margin-bottom: 20px;
        }
        #afkLol-update-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg,#7c3aed,#06b6d4);
            color: #071027;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 700;
            font-size: 14px;
            transition: transform 0.12s ease;
        }
        #afkLol-update-btn:hover {
            transform: translateY(-2px);
        }
        #afkLol-trw-timer {
            position: fixed;
            top: 70px;
            right: 20px;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-weight: 600;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        }
    `;

    function showNotification() {
        const notification = document.createElement("div");
        notification.innerHTML = notificationHTML;
        document.body.appendChild(notification);
        setTimeout(() => {
            const notif = document.getElementById("afkLol-notification");
            if (notif) notif.remove();
        }, 3800);
    }

    function showTrwTimer() {
        const timer = document.createElement("div");
        timer.innerHTML = trwTimerHTML;
        document.body.appendChild(timer);
        
        trwApiStartTime = performance.now();
        
        trwTimerInterval = setInterval(() => {
            const currentTime = performance.now();
            const elapsed = (currentTime - trwApiStartTime) / 1000;
            const timeEl = document.getElementById("afkLol-api-time");
            if (timeEl) {
                timeEl.textContent = elapsed.toFixed(2);
            }
        }, 10);
    }

    function hideTrwTimer() {
        if (trwTimerInterval) {
            clearInterval(trwTimerInterval);
            trwTimerInterval = null;
        }
        const timer = document.getElementById("afkLol-trw-timer");
        if (timer) {
            setTimeout(() => {
                timer.remove();
            }, 10000);
        }
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }

    function showBypassModal(link) {
        if (updateDetected) return;
        if (document.getElementById("afkLol-modal")) return;
        const modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        const linkInput = document.getElementById("afkLol-link");
        const redirectTimer = document.getElementById("afkLol-redirect-timer");
        
        if (linkInput) {
            linkInput.value = link;
            linkInput.addEventListener("click", () => {
                copyToClipboard(link);
                const originalValue = linkInput.value;
                linkInput.value = "copied result";
                linkInput.style.background = "rgba(16, 185, 129, 0.15)";
                setTimeout(() => {
                    linkInput.value = originalValue;
                    linkInput.style.background = "rgba(255,255,255,0.02)";
                }, 1000);
            });
        }

        const isUrl = /^https?:\/\//.test(link);
        
        if (isUrl && redirectTimer) {
            let countdown = 15;
            const countdownEl = document.getElementById("afkLol-countdown");
            const redirectInterval = setInterval(() => {
                countdown--;
                if (countdownEl) countdownEl.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(redirectInterval);
                    window.location.href = link;
                }
            }, 1000);

            document.addEventListener("keydown", function escListener(e) {
                if (e.key === "Escape") {
                    clearInterval(redirectInterval);
                    const modal = document.getElementById("afkLol-modal");
                    if (modal) modal.remove();
                    document.removeEventListener("keydown", escListener);
                }
            });
        } else if (redirectTimer) {
            redirectTimer.textContent = "Result displayed above";
            redirectTimer.style.background = "linear-gradient(90deg,#10b981,#06b6d4)";
        }
    }

    function showUpdateModal(newVersion) {
        updateDetected = true;
        const updateContainer = document.createElement("div");
        updateContainer.innerHTML = updateModalHTML;
        document.body.appendChild(updateContainer);

        const versionEl = document.getElementById("afkLol-new-version");
        if (versionEl) versionEl.textContent = newVersion || "unknown";

        const updateBtn = document.getElementById("afkLol-update-btn");
        if (updateBtn) {
            updateBtn.addEventListener("click", () => {
                try {
                    if (lastFetchedMetaText) {
                        const parsedVersion = (lastFetchedMetaText.match(/@version\s+([^\r\n]+)/) || [])[1];
                        if (parsedVersion) {
                            localStorage.setItem(META_VERSION_KEY, parsedVersion.trim());
                        } else {
                            localStorage.setItem(META_SNAPSHOT_KEY, lastFetchedMetaText);
                        }
                    }
                } catch (err) {
                }
                window.location.href = USER_SCRIPT_URL;
            });
        }
    }

    function checkForUpdates() {
        fetch(META_UPDATE_URL + '?t=' + new Date().getTime(), { cache: 'no-store' })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(metaText => {
                lastFetchedMetaText = metaText;
                const versionMatch = metaText.match(/@version\s+([^\r\n]+)/);
                const latestMetaVersion = versionMatch ? versionMatch[1].trim() : null;

                const localVersion = (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version)
                    ? GM_info.script.version
                    : null;

                if (localVersion) {
                    if (latestMetaVersion && latestMetaVersion !== localVersion) {
                        showUpdateModal(latestMetaVersion);
                        return;
                    }
                    return;
                }

                try {
                    if (latestMetaVersion) {
                        const stored = localStorage.getItem(META_VERSION_KEY);
                        if (!stored) {
                            localStorage.setItem(META_VERSION_KEY, latestMetaVersion);
                            return;
                        }
                        if (stored !== latestMetaVersion) {
                            showUpdateModal(latestMetaVersion);
                            return;
                        }
                        return;
                    }

                    const storedSnap = localStorage.getItem(META_SNAPSHOT_KEY);
                    if (!storedSnap) {
                        localStorage.setItem(META_SNAPSHOT_KEY, metaText);
                        return;
                    }
                    if (storedSnap !== metaText) {
                        showUpdateModal('updated');
                        return;
                    }
                } catch (err) {
                    console.error("Update check/storage failed:", err);
                }
            })
            .catch(err => console.error("Update (meta) check failed:", err));
    }

    function hasCloudflare() {
        const pageText = document.body && document.body.innerText ? document.body.innerText : "";
        const pageHTML = document.documentElement && document.documentElement.innerHTML ? document.documentElement.innerHTML : "";
        return pageText.includes("Just a moment") || pageHTML.includes("Just a moment");
    }

    function handleBstlar() {
        if (updateDetected) return;
        if (hasCloudflare()) return;
        const path = new URL(window.location.href).pathname.substring(1);
        fetch(`https://bstlar.com/api/link?url=${encodeURIComponent(path)}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": "null",
                "Referer": window.location.href,
                "Referrer-Policy": "same-origin"
            },
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.tasks && data.tasks.length > 0) {
                const linkId = data.tasks[0].link_id;
                return fetch("https://bstlar.com/api/link-completed", {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8",
                        "authorization": "null",
                        "Referer": window.location.href,
                        "Referrer-Policy": "same-origin"
                    },
                    body: JSON.stringify({ link_id: linkId }),
                    method: "POST"
                });
            }
            throw new Error("No tasks found in response!");
        })
        .then(response => response.text())
        .then(finalLink => showBypassModal(finalLink))
        .catch(console.error);
    }

    function handleRekonise() {
        if (updateDetected) return;
        if (hasCloudflare()) return;
        fetch(`https://api.rekonise.com/social-unlocks${location.pathname}/unlock`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "authorization": "null",
                "Referer": window.location.href,
                "Referrer-Policy": "same-origin"
            },
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            const responseText = JSON.stringify(data);
            const urlMatch = responseText.match(/(https?:\/\/[^\s"]+)/);
            const foundUrl = urlMatch ? urlMatch[0] : null;
            if (foundUrl) showBypassModal(foundUrl);
            else showBypassModal("Error, please join Discord Server in the Greasyfork script.");
        })
        .catch(console.error);
    }

    function handleMboost() {
        if (updateDetected) return;
        const pageContent = document.documentElement.outerHTML;
        const targetUrlMatches = [...pageContent.matchAll(/"targeturl\\":\\"(https?:\/\/[^\\"]+)/g)];
        targetUrlMatches.forEach((match) => { const url = match[1]; showBypassModal(url); });
        if (targetUrlMatches.length === 0) showBypassModal('Could not find destination! Please join our Discord.');
    }

    function isTrwTarget() {
        try {
            const host = window.location.hostname;
            return host === 'linkvertise.com' || host === 'link-unlock.com';
        } catch (err) {
            return false;
        }
    }

    function handleTrwApi() {
        if (updateDetected) return;
        if (!isTrwTarget()) return;
        if (hasCloudflare()) return;

        showTrwTimer();
        
        const currentUrl = window.location.href;
        const encodedUrl = encodeURIComponent(currentUrl);
        const apiUrl = TRW_API_BASE + encodedUrl;

        fetch(apiUrl, { method: 'GET', mode: 'cors', cache: 'no-store' })
            .then(resp => {
                if (!resp.ok) throw new Error('TRW API fetch failed');
                return resp.json();
            })
            .then(data => {
                if (data && data.success) {
                    const result = data.result;
                    showBypassModal(result);
                } else {
                    showBypassModal('TRW API failed to bypass — please join our Discord.');
                }
                hideTrwTimer();
            })
            .catch(err => {
                console.error('TRW API error:', err);
                showBypassModal('TRW API failed — please join our Discord.');
                hideTrwTimer();
            });
    }

    const style = document.createElement('style');
    style.textContent = styleCSS;
    document.head.appendChild(style);

    showNotification();
    checkForUpdates();

    setTimeout(() => {
        if (!updateDetected) {
            if (isTrwTarget()) {
                handleTrwApi();
                return;
            }

            if (window.location.hostname === 'bstlar.com') handleBstlar();
            else if (window.location.hostname === 'rekonise.com') handleRekonise();
            else if (window.location.hostname === 'mboost.me') handleMboost();
        }
    }, 500);
})();

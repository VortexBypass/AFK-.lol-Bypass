// ==UserScript==
// @name         AFK™.lol Bypasser
// @namespace    https://afk.lol/
// @version      1.1.7
// @description  Bypass Links
// @author       afk.l0l
// @icon         https://i.ibb.co/ks0qXqqY/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png
// @match        https://mboost.me/*
// @match        https://deltaios-executor.com/*
// @match        https://krnl-ios.com/*
// @match        https://auth.platoboost.app/*
// @match        https://auth.platoboost.net/*
// @match        https://loot-link.com/*
// @match        https://lootlink.org/*
// @match        https://lootlinks.co/*
// @match        https://lootdest.info/*
// @match        https://lootdest.org/*
// @match        https://lootdest.com/*
// @match        https://links-loot.com/*
// @match        https://loot-links.com/*
// @match        https://best-links.org/*
// @match        https://lootlinks.com/*
// @match        https://loot-labs.com/*
// @match        https://lootlabs.com/*
// @match        https://pandadevelopment.net/*
// @match        https://krnl.cat/*
// @match        https://lockr.so/*
// @match        https://link-unlock.com/*
// @match        https://direct-link.net/*
// @match        https://link-target.net/*
// @match        https://link-to.net/*
// @match        https://link-center.net/*
// @match        https://link-hub.net/*
// @match        https://up-to-down.net/*
// @match        https://linkvertise.com/*
// @match        https://sub2get.com/*
// @match        https://sub4unlock.com/*
// @match        https://sub2unlock.net/*
// @match        https://sub2unlock.com/*
// @match        https://rekonise.com/*
// @match        https://rkns.link/*
// @match        https://rekonise.org/*
// @match        https://overdrivehub.xyz/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @require      https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/refs/heads/main/AFKdotlol.yes.js
// @updateURL    https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/refs/heads/main/AFKdotlol.meta.js
// @downloadURL  https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/refs/heads/main/AFKdotlol.user.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const waitTime = 10;
    const S_THUMB = 'https://i.ibb.co/ks0qXqqY/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png';
    const META_UPDATE_URL = "https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/refs/heads/main/AFKdotlol.meta.js";
    const USER_SCRIPT_URL = "https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/refs/heads/main/AFKdotlol.user.js";
    const META_VERSION_KEY = 'afkLol_meta_version_v1';
    const META_SNAPSHOT_KEY = 'afkLol_meta_snapshot_v1';

    let hasRun = false;
    let notificationShown = false;
    let updateDetected = false;
    let lastFetchedMetaText = null;

    window.AFK_WAIT_TIME = waitTime;

    const styleCSS = `
        #afkLol-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4,6,15,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483646;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-modal-content {
            background: linear-gradient(180deg, #071027, #0b1220);
            color: #e6eef8;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(2,6,23,0.8);
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(124,58,237,0.15);
            box-sizing: border-box;
            margin: 20px;
        }
        #afkLol-logo {
            width: 80px;
            height: 80px;
            border-radius: 12px;
            margin: 0 auto 15px auto;
            display: block;
            background: rgba(255,255,255,0.02);
            padding: 6px;
            object-fit: cover;
        }
        #afkLol-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 15px 0;
            color: #f3f6fb;
            text-align: center;
        }
        #afkLol-modal-content p {
            font-size: 14px;
            color: #b9c7e6;
            margin-bottom: 20px;
            text-align: center;
        }
        #afkLol-link {
            width: 100%;
            padding: 15px;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            background: rgba(255,255,255,0.03);
            text-align: center;
            font-size: 14px;
            color: #e6eef8;
            margin-bottom: 15px;
            box-sizing: border-box;
            cursor: pointer;
        }
        #afkLol-link:hover {
            background: rgba(255,255,255,0.05);
        }
        #afkLol-redirect-timer {
            width: 100%;
            padding: 15px;
            margin-top: 10px;
            background: linear-gradient(90deg,#7c3aed,#06b6d4);
            color: #071027;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            text-align: center;
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
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-weight: 600;
            font-size: 14px;
        }
        #afkLol-api-timer {
            position: fixed;
            top: 70px;
            right: 20px;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-weight: 600;
            font-size: 14px;
        }
        #afkLol-wait-box {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4,6,15,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483646;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-wait-content {
            background: linear-gradient(180deg, #071027, #0b1220);
            color: #e6eef8;
            padding: 40px 30px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(2,6,23,0.8);
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(124,58,237,0.15);
        }
        #afkLol-wait-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 20px 0;
            color: #f3f6fb;
            text-align: center;
        }
        #afkLol-wait-counter {
            font-size: 60px;
            font-weight: 800;
            color: #60a5fa;
            margin: 25px 0;
            text-align: center;
        }
        #afkLol-wait-text {
            font-size: 16px;
            color: #b9c7e6;
            text-align: center;
        }
        #afkLol-update-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4,6,15,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-update-content {
            background: linear-gradient(180deg, #071027, #0b1220);
            color: #e6eef8;
            padding: 40px 30px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(2,6,23,0.8);
            max-width: 450px;
            width: 90%;
            border: 1px solid rgba(124,58,237,0.15);
        }
        #afkLol-update-content h1 {
            font-size: 26px;
            font-weight: 600;
            margin: 0 0 20px 0;
            color: #f3f6fb;
            text-align: center;
        }
        #afkLol-update-content p {
            font-size: 16px;
            color: #b9c7e6;
            margin-bottom: 25px;
            text-align: center;
        }
        #afkLol-update-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(90deg,#7c3aed,#06b6d4);
            color: #071027;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 700;
            font-size: 16px;
        }
        @media (max-width: 480px) {
            #afkLol-modal-content,
            #afkLol-wait-content,
            #afkLol-update-content {
                width: 85%;
                margin: 15px;
                padding: 25px 20px;
            }
            #afkLol-wait-counter {
                font-size: 50px;
            }
            #afkLol-title,
            #afkLol-wait-title,
            #afkLol-update-content h1 {
                font-size: 22px;
            }
        }
    `;

    const modalHTML = `
        <div id="afkLol-modal">
            <div id="afkLol-modal-content">
                <img src="${S_THUMB}" id="afkLol-logo" alt="AFK logo">
                <h1 id="afkLol-title">AFK™.lol Bypasser</h1>
                <p>Bypass Successful! Here is your link:</p>
                <input type="text" id="afkLol-link" value="" readonly>
                <div id="afkLol-redirect-timer">Redirecting in <span id="afkLol-countdown">15</span>s...</div>
            </div>
        </div>
    `;

    const notificationHTML = `
        <div id="afkLol-notification">
            🎯 AFK™.lol Bypasser Loaded
        </div>
    `;

    const apiTimerHTML = `
        <div id="afkLol-api-timer">
            ⚡ API Processing: <span id="afkLol-api-time">0.00</span>s
        </div>
    `;

    const waitBoxHTML = `
        <div id="afkLol-wait-box">
            <div id="afkLol-wait-content">
                <div id="afkLol-wait-title">⏳ Please Wait</div>
                <div id="afkLol-wait-counter">${waitTime}</div>
                <div id="afkLol-wait-text">Processing will start automatically</div>
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

    const style = document.createElement('style');
    style.textContent = styleCSS;
    try {
        (document.head || document.documentElement).appendChild(style);
    } catch (e) {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                (document.head || document.documentElement).appendChild(style);
            } catch (err) {}
        }, { once: true });
    }

    function showNotification() {
        if (notificationShown) return;
        notificationShown = true;
        const notification = document.createElement("div");
        notification.innerHTML = notificationHTML;
        const container = notification.firstElementChild || notification;
        (document.body || document.documentElement).appendChild(container);
        setTimeout(() => {
            const notif = document.getElementById("afkLol-notification");
            if (notif) notif.remove();
        }, 3800);
    }

    function showApiTimer() {
        const timer = document.createElement("div");
        timer.innerHTML = apiTimerHTML;
        const container = timer.firstElementChild || timer;
        (document.body || document.documentElement).appendChild(container);
        const apiStartTime = performance.now();
        const apiTimerInterval = setInterval(() => {
            const currentTime = performance.now();
            const elapsed = (currentTime - apiStartTime) / 1000;
            const timeEl = document.getElementById("afkLol-api-time");
            if (timeEl) {
                timeEl.textContent = elapsed.toFixed(2);
            }
        }, 50);
        return apiTimerInterval;
    }

    function hideApiTimer(apiTimerInterval) {
        if (apiTimerInterval) {
            clearInterval(apiTimerInterval);
        }
        const timer = document.getElementById("afkLol-api-timer");
        if (timer) {
            setTimeout(() => {
                timer.remove();
            }, 1000);
        }
    }

    function showWaitBox(callback) {
        const waitBox = document.createElement("div");
        waitBox.innerHTML = waitBoxHTML;
        const container = waitBox.firstElementChild || waitBox;
        (document.body || document.documentElement).appendChild(container);
        let counter = waitTime;
        const countdownEl = document.getElementById("afkLol-wait-counter");
        const interval = setInterval(() => {
            counter--;
            if (countdownEl) countdownEl.textContent = counter;
            if (counter <= 0) {
                clearInterval(interval);
                const wb = document.getElementById("afkLol-wait-box");
                if (wb) wb.remove();
                try { callback(); } catch (e) {}
            }
        }, 1000);
    }

    function showBypassModal(link) {
        if (updateDetected) return;
        if (document.getElementById("afkLol-modal")) return;
        const modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        const container = modalContainer.firstElementChild || modalContainer;
        (document.body || document.documentElement).appendChild(container);
        const linkInput = document.getElementById("afkLol-link");
        const redirectTimer = document.getElementById("afkLol-redirect-timer");
        if (linkInput) {
            linkInput.value = link;
            linkInput.addEventListener("click", () => {
                try {
                    navigator.clipboard.writeText(link);
                } catch (e) {}
                const originalValue = linkInput.value;
                linkInput.value = "Copied!";
                linkInput.style.background = "rgba(16, 185, 129, 0.15)";
                setTimeout(() => {
                    linkInput.value = originalValue;
                    linkInput.style.background = "rgba(255,255,255,0.03)";
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
                    try { window.location.href = link; } catch (e) {}
                }
            }, 1000);
            function escListener(e) {
                if (e.key === "Escape") {
                    clearInterval(redirectInterval);
                    const modal = document.getElementById("afkLol-modal");
                    if (modal) modal.remove();
                    document.removeEventListener("keydown", escListener);
                }
            }
            document.addEventListener("keydown", escListener);
        } else if (redirectTimer) {
            redirectTimer.textContent = "Result displayed above";
            redirectTimer.style.background = "linear-gradient(90deg,#10b981,#06b6d4)";
        }
    }

    function showUpdateModal(newVersion) {
        updateDetected = true;
        if (document.getElementById("afkLol-update-modal")) return;
        const updateContainer = document.createElement("div");
        updateContainer.innerHTML = updateModalHTML;
        const container = updateContainer.firstElementChild || updateContainer;
        (document.body || document.documentElement).appendChild(container);
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
                } catch (err) {}
                try { GM_openInTab(USER_SCRIPT_URL, {active: true}); } catch (e) { window.open(USER_SCRIPT_URL, "_blank"); }
            });
        }
    }

    function checkForUpdates() {
        try {
            fetch(META_UPDATE_URL + '?t=' + new Date().getTime(), { cache: 'no-store' })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
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
                    } catch (err) {}
                })
                .catch(err => {});
        } catch (e) {}
    }

    function extractUrlFromPage() {
        try {
            const url = new URL(location.href);
            return url.searchParams.get('URL') || url.searchParams.get('url') || url.searchParams.get('link') || location.href;
        } catch(e) {
            return location.href;
        }
    }

    function runBypass() {
        if (hasRun || updateDetected) return;
        hasRun = true;
        const targetUrl = extractUrlFromPage();
        showNotification();
        if (waitTime > 0) {
            showWaitBox(() => {
                executeApiCall(targetUrl);
            });
        } else {
            executeApiCall(targetUrl);
        }
    }

    function executeApiCall(url) {
        const apiTimerInterval = showApiTimer();
        try {
            if (typeof window.AFK_API === 'function') {
                window.AFK_API(url, (error, result) => {
                    hideApiTimer(apiTimerInterval);
                    if (error) {
                        showBypassModal('Error: ' + error);
                        return;
                    }
                    if (!result) {
                        showBypassModal('No response from API');
                        return;
                    }
                    const resultText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                    const urlMatch = resultText.match(/https?:\/\/[^\s"']+/);
                    if (urlMatch) {
                        showBypassModal(urlMatch[0]);
                    } else {
                        showBypassModal(resultText);
                    }
                });
            } else {
                hideApiTimer(apiTimerInterval);
                showBypassModal('API not available. Please refresh.');
            }
        } catch (e) {
            hideApiTimer(apiTimerInterval);
            showBypassModal('API call failed');
        }
    }

    function initialize() {
        setTimeout(() => {
            checkForUpdates();
        }, 2000);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runBypass);
        } else {
            setTimeout(runBypass, 500);
        }
        window.addEventListener('hashchange', () => {
            hasRun = false;
            setTimeout(runBypass, 500);
        });
        window.addEventListener('popstate', () => {
            hasRun = false;
            setTimeout(runBypass, 500);
        });
    }

    initialize();
})();

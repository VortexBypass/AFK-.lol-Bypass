// ==UserScript==
// @name         AFK™.lol Bypasser
// @namespace    https://afk.lol/
// @version      1.1.6
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
    let hasRun = false;
    let notificationShown = false;

    window.AFK_WAIT_TIME = waitTime;

    const styleCSS = `
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
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
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
            background: rgba(4,6,15,0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483646;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        #afkLol-wait-content {
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
        #afkLol-wait-title {
            font-size: 22px;
            font-weight: 600;
            margin: 0 0 15px 0;
            color: #f3f6fb;
        }
        #afkLol-wait-counter {
            font-size: 48px;
            font-weight: 800;
            color: #60a5fa;
            margin: 20px 0;
        }
        #afkLol-wait-text {
            font-size: 14px;
            color: #b9c7e6;
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

    const style = document.createElement('style');
    style.textContent = styleCSS;
    document.head.appendChild(style);

    function showNotification() {
        if (notificationShown) return;
        notificationShown = true;
        const notification = document.createElement("div");
        notification.innerHTML = notificationHTML;
        document.body.appendChild(notification);
        setTimeout(() => {
            const notif = document.getElementById("afkLol-notification");
            if (notif) notif.remove();
        }, 3800);
    }

    function showApiTimer() {
        const timer = document.createElement("div");
        timer.innerHTML = apiTimerHTML;
        document.body.appendChild(timer);
        const apiStartTime = performance.now();
        const apiTimerInterval = setInterval(() => {
            const currentTime = performance.now();
            const elapsed = (currentTime - apiStartTime) / 1000;
            const timeEl = document.getElementById("afkLol-api-time");
            if (timeEl) {
                timeEl.textContent = elapsed.toFixed(2);
            }
        }, 10);
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
        document.body.appendChild(waitBox);

        let counter = waitTime;
        const countdownEl = document.getElementById("afkLol-wait-counter");
        
        const interval = setInterval(() => {
            counter--;
            if (countdownEl) countdownEl.textContent = counter;
            
            if (counter <= 0) {
                clearInterval(interval);
                waitBox.remove();
                callback();
            }
        }, 1000);
    }

    function showBypassModal(link) {
        if (document.getElementById("afkLol-modal")) return;
        const modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        const linkInput = document.getElementById("afkLol-link");
        const redirectTimer = document.getElementById("afkLol-redirect-timer");

        if (linkInput) {
            linkInput.value = link;
            linkInput.addEventListener("click", () => {
                navigator.clipboard.writeText(link);
                const originalValue = linkInput.value;
                linkInput.value = "Copied!";
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

    function extractUrlFromPage() {
        try {
            const url = new URL(location.href);
            return url.searchParams.get('URL') || url.searchParams.get('url') || url.searchParams.get('link') || location.href;
        } catch(e) {
            return location.href;
        }
    }

    function runBypass() {
        if (hasRun) return;
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
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runBypass);
        } else {
            setTimeout(runBypass, 1000);
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

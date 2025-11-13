// ==UserScript==
// @name         AFK™.lol Bypasser
// @namespace    Tampermonkey
// @version      1.1.7
// @description  Bypass Links
// @author       AFK™.lol
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
// @require      https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/main/AFKdotlol.yes.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

(function(){
    'use strict';

    const WAIT_SECONDS = 10;
    const S_THUMB = 'https://i.ibb.co/ks0qXqqY/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png';
    const META_UPDATE_URL = 'https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/main/AFKdotlol.meta.js';
    const USER_SCRIPT_URL = 'https://raw.githubusercontent.com/VortexBypass/AFK-.lol-Bypass/main/AFKdotlol.user.js';
    const META_VERSION_KEY = 'afkLol_meta_version_v1';
    const META_SNAPSHOT_KEY = 'afkLol_meta_snapshot_v1';

    let updateDetected = false;
    let lastFetchedMetaText = null;
    let apiTimerInterval = null;
    let apiStartTime = null;
    let notificationShown = false;
    let waitIntervalId = null;
    let mutationObserver = null;

    const style = `
        :root { -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        .afk-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(4,6,15,0.90); z-index: 2147483647; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); pointer-events: auto; }
        .afk-modal { width: calc(100% - 40px); max-width: 520px; border-radius: 14px; padding: 22px; box-sizing: border-box; background: linear-gradient(180deg,#071027,#0b1220); color:#e6eef8; box-shadow: 0 20px 60px rgba(2,6,23,0.85); border:1px solid rgba(124,58,237,0.12); text-align:center; }
        .afk-logo { width:76px; height:76px; border-radius:12px; object-fit:cover; margin: 0 auto 12px; display:block; background: rgba(255,255,255,0.02); padding:6px; }
        .afk-title { font-size:22px; font-weight:700; margin:6px 0 8px; color:#f3f6fb; }
        .afk-sub { font-size:14px; color:#b9c7e6; margin-bottom:14px; }
        .afk-input { width:100%; padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:#e6eef8; font-size:14px; box-sizing:border-box; text-align:left; cursor:pointer; }
        .afk-timer { margin-top:12px; padding:12px; border-radius:10px; font-weight:700; font-size:15px; background: linear-gradient(90deg,#7c3aed,#06b6d4); color:#071027; }
        .afk-wait-counter { font-size:48px; font-weight:800; color:#60a5fa; margin:8px 0; }
        .afk-notification { position: fixed; top:16px; right:16px; padding:12px 16px; border-radius:10px; background: linear-gradient(90deg,#7c3aed,#06b6d4); color:white; z-index:2147483648; font-weight:700; pointer-events:auto; box-shadow:0 6px 20px rgba(0,0,0,0.4); }
        .afk-api-timer { position: fixed; top:72px; right:16px; padding:10px 14px; border-radius:10px; background: linear-gradient(90deg,#f59e0b,#d97706); color:white; z-index:2147483648; font-weight:700; pointer-events:auto; box-shadow:0 6px 20px rgba(0,0,0,0.4); }
        .afk-update-btn { width:100%; padding:12px; border-radius:10px; border:none; cursor:pointer; font-weight:700; margin-top:8px; background: linear-gradient(90deg,#7c3aed,#06b6d4); color:#071027; }
        @media (max-width:480px) { .afk-modal { width: calc(100% - 28px); padding:18px; border-radius:12px } .afk-wait-counter { font-size:40px } }
    `;

    try { GM_addStyle(style); } catch (e) { const s = document.createElement('style'); s.textContent = style; (document.head || document.documentElement).appendChild(s); }

    function ensureBody(cb){
        if (document.body) return cb();
        const onReady = ()=>{ if (document.body) { cb(); document.removeEventListener('DOMContentLoaded', onReady); } };
        document.addEventListener('DOMContentLoaded', onReady);
        const id = setInterval(()=>{ if (document.body){ clearInterval(id); try{ cb(); }catch(e){} } }, 150);
    }

    function attachOverlay(html, id){
        ensureBody(()=>{
            removeOverlay(id);
            const wrapper = document.createElement('div');
            wrapper.id = id || ('afk-' + Math.random().toString(36).slice(2,9));
            wrapper.className = 'afk-overlay';
            wrapper.innerHTML = html;
            document.body.appendChild(wrapper);
            observeRemoval(wrapper);
        });
    }

    function removeOverlay(id){
        try{
            const el = id ? document.getElementById(id) : null;
            if (el) el.remove();
        }catch(e){}
    }

    function observeRemoval(node){
        try{
            if (!mutationObserver){
                mutationObserver = new MutationObserver(()=>{ if (!document.getElementById('afk-wait-box') && !document.getElementById('afk-result-modal') && !document.getElementById('afk-update-modal')) return; });
                mutationObserver.observe(document.documentElement, { childList:true, subtree:true });
            }
        }catch(e){}
    }

    function showNotification(){
        if (notificationShown) return;
        notificationShown = true;
        ensureBody(()=>{
            const n = document.createElement('div');
            n.className = 'afk-notification';
            n.id = 'afk-notification';
            n.textContent = '🎯 AFK™.lol Bypasser Loaded';
            document.body.appendChild(n);
            setTimeout(()=>{ const el = document.getElementById('afk-notification'); if (el) el.remove(); }, 3200);
        });
    }

    function showApiTimer(){
        ensureBody(()=>{
            if (document.getElementById('afk-api-timer')) return;
            const t = document.createElement('div');
            t.className = 'afk-api-timer';
            t.id = 'afk-api-timer';
            t.innerHTML = '⚡ API Processing: <span id="afk-api-time">0.00</span>s';
            document.body.appendChild(t);
            apiStartTime = performance.now();
            apiTimerInterval = setInterval(()=>{ const el = document.getElementById('afk-api-time'); if (el) el.textContent = ((performance.now()-apiStartTime)/1000).toFixed(2); }, 50);
        });
    }

    function hideApiTimer(){
        try{ if (apiTimerInterval) clearInterval(apiTimerInterval); apiTimerInterval = null; const el = document.getElementById('afk-api-timer'); if (el) setTimeout(()=>el.remove(), 600); }catch(e){}
    }

    function showUpdateModal(version){
        updateDetected = true;
        const html = `<div id="afk-update-modal" class="afk-modal"><img class="afk-logo" src="${S_THUMB}" alt=""><div class="afk-title">🔄 Update Detected</div><div class="afk-sub">A new version is available: <strong id="afk-new-version">${version || 'unknown'}</strong></div><button id="afk-update-btn" class="afk-update-btn">Update Now</button></div>`;
        attachOverlay(html, 'afk-update-modal');
        ensureBody(()=>{
            const btn = document.getElementById('afk-update-btn');
            if (btn) btn.addEventListener('click', ()=>{ try{ if (lastFetchedMetaText){ const parsed = (lastFetchedMetaText.match(/@version\s+([^\r\n]+)/) || [])[1]; if (parsed) localStorage.setItem(META_VERSION_KEY, parsed.trim()); else localStorage.setItem(META_SNAPSHOT_KEY, lastFetchedMetaText); } }catch(e){} try{ GM_openInTab(USER_SCRIPT_URL, { active:true }); }catch(e){ window.open(USER_SCRIPT_URL, '_blank'); } });
        });
    }

    function checkForUpdates(){
        try{
            fetch(META_UPDATE_URL + '?t=' + Date.now(), { cache:'no-store' }).then(r=>{ if(!r.ok) throw r; return r.text(); }).then(txt=>{
                lastFetchedMetaText = txt;
                const m = txt.match(/@version\s+([^\r\n]+)/);
                const latest = m ? m[1].trim() : null;
                const local = (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) ? GM_info.script.version : null;
                if (local){ if (latest && latest !== local) showUpdateModal(latest); return; }
                try{
                    if (latest){
                        const stored = localStorage.getItem(META_VERSION_KEY);
                        if (!stored){ localStorage.setItem(META_VERSION_KEY, latest); return; }
                        if (stored !== latest){ showUpdateModal(latest); return; }
                        return;
                    }
                    const snap = localStorage.getItem(META_SNAPSHOT_KEY);
                    if (!snap){ localStorage.setItem(META_SNAPSHOT_KEY, txt); return; }
                    if (snap !== txt){ showUpdateModal('updated'); return; }
                }catch(e){}
            }).catch(()=>{});
        }catch(e){}
    }

    function showWaitBox(seconds){
        const html = `<div id="afk-wait-modal" class="afk-modal"><img class="afk-logo" src="${S_THUMB}" alt=""><div class="afk-title">⏳ Please Wait</div><div class="afk-sub">Processing will start automatically</div><div class="afk-wait-counter" id="afk-wait-counter">${seconds}</div><div class="afk-timer">Waiting for <strong id="afk-wait-name">API</strong> — starting in <span id="afk-wait-seconds">${seconds}</span>s</div></div>`;
        attachOverlay(html, 'afk-wait-box');
        let counter = seconds;
        const update = ()=>{ const el = document.getElementById('afk-wait-counter'); const sEl = document.getElementById('afk-wait-seconds'); if (el) el.textContent = counter; if (sEl) sEl.textContent = counter; };
        update();
        waitIntervalId = setInterval(()=>{
            counter--;
            update();
            if (counter <= 0){
                clearInterval(waitIntervalId);
                waitIntervalId = null;
                const waitBox = document.getElementById('afk-wait-box');
                if (waitBox) waitBox.remove();
                startApiFlow();
            }
        }, 1000);
    }

    function extractTargetFromLocation(){
        try{ const u = new URL(location.href); return u.searchParams.get('URL') || u.searchParams.get('url') || u.searchParams.get('link') || location.href; }catch(e){ return location.href; }
    }

    function startApiFlow(){
        showApiTimer();
        waitForApiThenCall(extractTargetFromLocation(), 8000).then(result=>{
            hideApiTimer();
            if (!result){
                showResultModal('No response from API');
                return;
            }
            if (typeof result === 'string' && result.trim() === ''){
                showResultModal('Empty response from API');
                return;
            }
            const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
            const urlMatch = text.match(/https?:\/\/[^\s"']+/);
            if (urlMatch) showResultModal(urlMatch[0]); else showResultModal(text);
        }).catch(err=>{
            hideApiTimer();
            showResultModal('API call failed');
        });
    }

    function waitForApiThenCall(targetUrl, timeoutMs){
        return new Promise((resolve, reject)=>{
            const start = Date.now();
            const tryCall = ()=>{
                if (updateDetected){ resolve(null); return; }
                if (typeof window.AFK_API === 'function'){
                    try{
                        window.AFK_API(targetUrl, (error, result)=>{
                            if (error) resolve('Error: '+String(error));
                            else resolve(result || null);
                        });
                    }catch(e){
                        resolve(null);
                    }
                    return;
                }
                if (Date.now() - start > timeoutMs){
                    resolve(null);
                    return;
                }
                setTimeout(tryCall, 200);
            };
            tryCall();
        });
    }

    function showResultModal(link){
        const displayValue = (link === null || link === undefined) ? 'No result' : String(link);
        const safeValue = displayValue.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        const html = `<div id="afk-result-modal" class="afk-modal"><img class="afk-logo" src="${S_THUMB}" alt=""><div class="afk-title">✅ Bypass Complete</div><div class="afk-sub">Here is your link</div><input class="afk-input" id="afk-result-input" readonly value="${safeValue}"><div class="afk-timer" id="afk-result-redirect">Redirecting in <span id="afk-result-countdown">15</span>s...</div></div>`;
        attachOverlay(html, 'afk-result-modal');
        const input = document.getElementById('afk-result-input');
        if (input) input.addEventListener('click', ()=>{ try{ navigator.clipboard.writeText(displayValue); input.value = 'Copied!'; setTimeout(()=>{ input.value = safeValue; }, 900); }catch(e){} });
        const isUrl = /^https?:\/\//.test(displayValue);
        if (isUrl){
            let c = 15;
            const el = document.getElementById('afk-result-countdown');
            const id = setInterval(()=>{
                c--;
                if (el) el.textContent = c;
                if (c <= 0){ clearInterval(id); try{ window.location.href = displayValue; }catch(e){} }
            }, 1000);
            document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ clearInterval(id); const m = document.getElementById('afk-result-modal'); if (m) m.remove(); document.removeEventListener('keydown', esc); }});
        }else{
            const timer = document.getElementById('afk-result-redirect');
            if (timer) timer.textContent = 'Result displayed above';
        }
    }

    function run(){
        showNotification();
        checkForUpdates();
        showWaitBox(WAIT_SECONDS);
    }

    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', run, { once:true });
        setTimeout(()=>{ if (!document.body) return; }, 1200);
    } else {
        setTimeout(run, 10);
    }

})();

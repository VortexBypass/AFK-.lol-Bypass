(function() {
    'use strict';

    const host = location.hostname;
    const debug = true;

    // Only run on Volcano/Work.ink sites
    if (!host.includes("key.volcano.wtf") && !host.includes("work.ink")) {
        return;
    }

    class AFKBypassPanel {
        constructor() {
            this.container = null;
            this.statusText = null;
            this.currentMessage = '';
            this.init();
        }

        init() {
            this.createPanel();
        }

        createPanel() {
            this.container = document.createElement('div');
            this.container.innerHTML = `
                <div id="afkLol-bypass-panel">
                    <div id="afkLol-bypass-content">
                        <img src="https://i.ibb.co/KcXkWgGm/B57-FBD3-E-489-E-4-F0-D-A5-C0-08017-DA44-C4-E.png" id="afkLol-bypass-logo" alt="AFK logo">
                        <h1 id="afkLol-bypass-title">AFK™.lol Development</h1>
                        <div id="afkLol-bypass-status">Complete The Captcha</div>
                    </div>
                </div>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                #afkLol-bypass-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(180deg, #071027, #0b1220);
                    color: #e6eef8;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(2,6,23,0.7);
                    max-width: 400px;
                    width: auto;
                    z-index: 2147483647;
                    border: 1px solid rgba(124,58,237,0.12);
                    font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                }
                #afkLol-bypass-content {
                    text-align: center;
                }
                #afkLol-bypass-logo {
                    width: 60px;
                    height: 60px;
                    border-radius: 10px;
                    margin: 0 0 10px 0;
                    background: rgba(255,255,255,0.02);
                    padding: 4px;
                    object-fit: cover;
                }
                #afkLol-bypass-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                    color: #f3f6fb;
                    text-shadow: 0 0 10px rgba(124, 58, 237, 0.7), 0 0 20px rgba(124, 58, 237, 0.5);
                }
                #afkLol-bypass-status {
                    font-size: 14px;
                    color: #b9c7e6;
                    padding: 10px;
                    background: rgba(255,255,255,0.02);
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.06);
                }
                @media (max-width: 768px) {
                    #afkLol-bypass-panel {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(this.container);
            this.statusText = document.getElementById('afkLol-bypass-status');
        }

        show(message) {
            if (this.statusText) {
                this.currentMessage = message;
                this.statusText.textContent = message;
            }
        }
    }

    let panel = null;
    setTimeout(() => { 
        panel = new AFKBypassPanel(); 
        panel.show('Complete The Captcha'); 
        
        if (host.includes("key.volcano.wtf")) handleVolcano();
        else if (host.includes("work.ink")) handleWorkInk();
    }, 100);

    function handleVolcano() {
        if (panel) panel.show('Complete The Captcha');
        if (debug) console.log('[Debug] Waiting Captcha');

        let alreadyDoneContinue = false;
        let alreadyDoneCopy = false;

        function actOnCheckpoint(node) {
            if (!alreadyDoneContinue) {
                const buttons = node && node.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]');
                for (const btn of buttons) {
                    const text = (btn.innerText || btn.value || "").trim().toLowerCase();
                    if (text.includes("continue") || text.includes("next step")) {
                        const disabled = btn.disabled || btn.getAttribute("aria-disabled") === "true";
                        const style = getComputedStyle(btn);
                        const visible = style.display !== "none" && style.visibility !== "hidden" && btn.offsetParent !== null;
                        if (visible && !disabled) {
                            alreadyDoneContinue = true;
                            if (panel) panel.show('Captcha Completed');
                            if (debug) console.log('[Debug] Captcha Solved');

                            for (const btn of buttons) {
                                const currentBtn = btn;
                                const currentPanel = panel;

                                setTimeout(() => {
                                    try {
                                        currentBtn.click();
                                        if (currentPanel) currentPanel.show('Redirecting to Work.ink...');
                                        if (debug) console.log('[Debug] Clicking Continue');
                                    } catch (err) {
                                        if (debug) console.log('[Debug] No Continue Found', err);
                                    }
                                }, 300);
                            }
                            return true;
                        }
                    }
                }
            }

            const copyBtn = node && node.nodeType === 1
                ? node.matches("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                    ? node
                    : node.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                : document.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']");
            if (copyBtn) {
                setInterval(() => {
                    try {
                        copyBtn.click();
                        if (debug) console.log('[Debug] Copy button spam click');
                        if (panel) panel.show('Bypass successful! Key copied');
                    } catch (err) {
                        if (debug) console.log('[Debug] No Copy Found', err);
                    }
                }, 500);
                return true;
            }

            return false;
        }

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (actOnCheckpoint(node)) {
                                if (alreadyDoneCopy) {
                                    mo.disconnect();
                                    return;
                                }
                            }
                        }
                    }
                }
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    if (actOnCheckpoint(mutation.target)) {
                        if (alreadyDoneCopy) {
                            mo.disconnect();
                            return;
                        }
                    }
                }
            }
        });

        mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'style'] });

        if (actOnCheckpoint()) {
            if (alreadyDoneCopy) {
                mo.disconnect();
            }
        }
    }

    function handleWorkInk() {
        if (panel) panel.show('Complete The Captcha');

        const startTime = Date.now();
        let sessionController = undefined;
        let sendMessageA = undefined;
        let onLinkInfoA = undefined;
        let onLinkDestinationA = undefined;
        let bypassTriggered = false;
        let destinationReceived = false;

        const map = {
            onLI: ["onLinkInfo"],
            onLD: ["onLinkDestination"]
        };

        function resolveName(obj, candidates) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }
            
            for (let i = 0; i < candidates.length; i++) {
                const name = candidates[i];
                if (typeof obj[name] === "function") {
                    return { fn: obj[name], index: i, name };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        function resolveWriteFunction(obj) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }
            
            for (let i in obj) {
                if (typeof obj[i] === "function" && obj[i].length === 2) {
                    return { fn: obj[i], name: i };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        const types = {
            mo: 'c_monetization',
            ss: 'c_social_started',
            tr: 'c_turnstile_response',
            ad: 'c_adblocker_detected',
        };

        function triggerBypass(reason) {
            if (bypassTriggered) {
                if (debug) console.log('[Debug] trigger Bypass skipped, already triggered');
                return;
            }
            bypassTriggered = true;
            if (debug) console.log('[Debug] trigger Bypass via:', reason);
            if (panel) panel.show('Captcha Completed Resuming');
            
            let retryCount = 0;
            function keepSpoofing() {
                if (destinationReceived) {
                    if (debug) console.log('[Debug] Destination received, stopping spoofing after', retryCount, 'attempts');
                    return;
                }
                retryCount++;
                if (debug) console.log(`[Debug] Spoofing attempt #${retryCount}`);
                spoofWorkink();
                setTimeout(keepSpoofing, 3000);
            }
            keepSpoofing();
            if (debug) console.log('[Debug] Waiting for server to send destination data...');
        }

        function spoofWorkink() {
            if (!sessionController?.linkInfo) {
                if (debug) console.log('[Debug] spoof Workink skipped: no sessionController.linkInfo');
                return;
            }
            if (debug) console.log('[Debug] spoof Workink starting, linkInfo:', sessionController.linkInfo);
            
            const socials = sessionController.linkInfo.socials || [];
            if (debug) console.log('[Debug] Total socials to fake:', socials.length);
            
            for (let i = 0; i < socials.length; i++) {
                const soc = socials[i];
                try {
                    if (sendMessageA) {
                        sendMessageA.call(this, types.ss, { url: soc.url });
                        if (debug) console.log(`[Debug] Faked social [${i+1}/${socials.length}]:`, soc.url);
                    } else {
                        if (debug) console.warn(`[Debug] No send message for social [${i+1}/${socials.length}]:`, soc.url);
                    }
                } catch (e) {
                    if (debug) console.error(`[Debug] Error faking social [${i+1}/${socials.length}]:`, soc.url, e);
                }
            }
            
            const monetizations = sessionController.linkInfo.monetizations || [];
            if (debug) console.log('[Debug] Total monetizations to fake:', monetizations.length);
            
            for (let i = 0; i < monetizations.length; i++) {
                const monetization = monetizations[i];
                try {
                    switch (monetization) {
                        case 22:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'readArticles2', payload: { event: 'read' } });
                            if (debug) console.log(`[Debug] Faked readArticles2 [${i+1}/${monetizations.length}]`);
                            break;
                        case 25:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'operaGX', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'operaGX', payload: { event: 'installClicked' } });
                            fetch('https://work.ink/_api/v2/callback/operaGX', {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ noteligible: true })
                            }).catch((e) => { if (debug) console.warn('[Debug] operaGX fetch failed:', e); });
                            if (debug) console.log(`[Debug] Faked operaGX [${i+1}/${monetizations.length}]`);
                            break;
                        case 34:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'norton', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'norton', payload: { event: 'installClicked' } });
                            if (debug) console.log(`[Debug] Faked norton [${i+1}/${monetizations.length}]`);
                            break;
                        case 71:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'externalArticles', payload: { event: 'start' } });
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'externalArticles', payload: { event: 'installClicked' } });
                            if (debug) console.log(`[Debug] Faked externalArticles [${i+1}/${monetizations.length}]`);
                            break;
                        case 45:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'pdfeditor', payload: { event: 'installed' } });
                            if (debug) console.log(`[Debug] Faked pdfeditor [${i+1}/${monetizations.length}]`);
                            break;
                        case 57:
                            sendMessageA && sendMessageA.call(this, types.mo, { type: 'betterdeals', payload: { event: 'installed' } });
                            if (debug) console.log(`[Debug] Faked betterdeals [${i+1}/${monetizations.length}]`);
                            break;
                        default:
                            if (debug) console.log(`[Debug] Unknown monetization [${i+1}/${monetizations.length}]:`, monetization);
                    }
                } catch (e) {
                    if (debug) console.error(`[Debug] Error faking monetization [${i+1}/${monetizations.length}]:`, monetization, e);
                }
            }
            
            if (debug) console.log('[Debug] spoof Workink completed');
        }

        function createSendMessageProxy() {
            return function(...args) {
                const pt = args[0];
                const pd = args[1];
                
                if (pt !== types.ping) {
                    if (debug) console.log('[Debug] Message sent:', pt, pd);
                }
                
                if (pt === types.ad) {
                    if (debug) console.log('[Debug] Blocking adblocker message');
                    return;
                }
                
                if (sessionController?.linkInfo && pt == types.tr) {
                    if (debug) console.log('[Debug] Captcha bypassed via TR');
                    triggerBypass('tr');
                }
                
                return sendMessageA ? sendMessageA.apply(this, args) : undefined;
            };
        }

        function createLinkInfoProxy() {
            return function(...args) {
                const [info] = args;
                if (debug) console.log('[Debug] Link info:', info);
                try {
                    Object.defineProperty(info, 'isAdblockEnabled', {
                        get: () => false,
                        set: () => {},
                        configurable: false,
                        enumerable: true
                    });
                    if (debug) console.log('[Debug] Adblock disabled in linkInfo');
                } catch (e) {
                    if (debug) console.warn('[Debug] Define Property failed:', e);
                }
                return onLinkInfoA ? onLinkInfoA.apply(this, args): undefined;
            };
        }

        function redirect(url) {
            if (debug) console.log('[Debug] Redirecting to:', url);
            window.location.href = url;
        }

        function startCountdown(url, waitLeft) {
            if (debug) console.log('[Debug] startCountdown: Started with', waitLeft, 'seconds');
            if (panel) panel.show(`Bypass successful, waiting ${Math.ceil(waitLeft)}s...`);

            const interval = setInterval(() => {
                waitLeft -= 1;
                if (waitLeft > 0) {
                    if (debug) console.log('[Debug] startCountdown: Time remaining:', waitLeft);
                    if (panel) panel.show(`Bypass successful, waiting ${Math.ceil(waitLeft)}s...`);
                } else {
                    clearInterval(interval);
                    redirect(url);
                }
            }, 1000);
        }

        function createDestinationProxy() {
            return function(...args) {
                const [data] = args;
                const secondsPassed = (Date.now() - startTime) / 1000;
                destinationReceived = true;
                if (debug) console.log('[Debug] Destination data:', data);

                let waitTimeSeconds = 5;
                const url = location.href;
                if (url.includes('42rk6hcq') || url.includes('ito4wckq') || url.includes('pzarvhq1')) {
                    waitTimeSeconds = 38;
                }

                if (secondsPassed >= waitTimeSeconds) {
                    if (panel) panel.show('Redirect');
                    redirect(data.url);
                } else {
                    startCountdown(data.url, waitTimeSeconds - secondsPassed);
                }
                return onLinkDestinationA ? onLinkDestinationA.apply(this, args): undefined;
            };
        }

        function setupProxies() {
            const send = resolveWriteFunction(sessionController);
            const info = resolveName(sessionController, map.onLI);
            const dest = resolveName(sessionController, map.onLD);

            if (!send.fn || !info.fn || !dest.fn) return;

            sendMessageA = send.fn;
            onLinkInfoA = info.fn;
            onLinkDestinationA = dest.fn;

            try {
                Object.defineProperty(sessionController, send.name, {
                    get: createSendMessageProxy,
                    set: v => (sendMessageA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, info.name, {
                    get: createLinkInfoProxy,
                    set: v => (onLinkInfoA = v),
                    configurable: true
                });
                Object.defineProperty(sessionController, dest.name, {
                    get: createDestinationProxy,
                    set: v => (onLinkDestinationA = v),
                    configurable: true
                });
                if (debug) console.log('[Debug] setupProxies: Proxies set successfully');
            } catch (e) {
                if (debug) console.warn('[Debug] setupProxies: Failed to set proxies:', e);
            }
        }

        function checkController(target, prop, value) {
            if (value &&
                typeof value === 'object' &&
                resolveWriteFunction(value).fn &&
                resolveName(value, map.onLI).fn &&
                resolveName(value, map.onLD).fn &&
                !sessionController) {
                sessionController = value;
                if (debug) console.log('[Debug] Controller detected:', sessionController);
                setupProxies();
            } else {
                if (debug) console.log('[Debug] checkController: No controller found for prop:', prop);
            }
            return Reflect.set(target, prop, value);
        }

        function createComponentProxy(comp) {
            return new Proxy(comp, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    if (instance.$$.ctx) {
                        instance.$$.ctx = new Proxy(instance.$$.ctx, { set: checkController });
                    }
                    return instance;
                }
            });
        }

        function createNodeProxy(node) {
            return async (...args) => {
                const result = await node(...args);
                return new Proxy(result, {
                    get: (t, p) => p === 'component' ? createComponentProxy(t.component) : Reflect.get(t, p)
                });
            };
        }

        function createKitProxy(kit) {
            if (!kit?.start) return [false, kit];
            return [
                true,
                new Proxy(kit, {
                    get(target, prop) {
                        if (prop === 'start') {
                            return function(...args) {
                                const [nodes, , opts] = args;
                                if (nodes?.nodes && opts?.node_ids) {
                                    const idx = opts.node_ids[1];
                                    if (nodes.nodes[idx]) {
                                        nodes.nodes[idx] = createNodeProxy(nodes.nodes[idx]);
                                    }
                                }
                                return kit.start.apply(this, args);
                            };
                        }
                        return Reflect.get(target, prop);
                    }
                })
            ];
        }

        function setupInterception() {
            const origPromiseAll = unsafeWindow.Promise.all;
            let intercepted = false;

            unsafeWindow.Promise.all = async function(promises) {
                const result = origPromiseAll.call(this, promises);
                if (!intercepted) {
                    intercepted = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...args]) => {
                            if (debug) console.log('[Debug]: Set up Interception!');

                            const [success, created] = createKitProxy(kit);
                            if (success) {
                                unsafeWindow.Promise.all = origPromiseAll;
                                if (debug) console.log('[Debug]: Kit ready', created, app);
                            }
                            resolve([created, app, ...args]);
                        });
                    });
                }
                return await result;
            };
        }

        window.googletag = {cmd: [], _loaded_: true};

        const blockedClasses = [
            "adsbygoogle",
            "adsense-wrapper",
            "inline-ad",
            "gpt-billboard-container"
        ];

        const blockedIds = [
            "billboard-1",
            "billboard-2",
            "billboard-3",
            "sidebar-ad-1",
            "skyscraper-ad-1"
        ];

        setupInterception();

        const ob = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        blockedClasses.forEach((cls) => {
                            if (node.classList?.contains(cls)) {
                                node.remove();
                                if (debug) console.log('[Debug]: Removed ad by class:', cls, node);
                            }
                            node.querySelectorAll?.(`.${cls}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Debug]: Removed nested ad by class:', cls, el);
                            });
                        });
                        
                        blockedIds.forEach((id) => {
                            if (node.id === id) {
                                node.remove();
                                if (debug) console.log('[Debug]: Removed ad by id:', id, node);
                            }
                            node.querySelectorAll?.(`#${id}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Debug]: Removed nested ad by id:', id, el);
                            });
                        });
                        
                        if (node.matches('.button.large.accessBtn.pos-relative.svelte-bv7qlp') && node.textContent.includes('Go To Destination')) {
                            if (debug) console.log('[Debug] GTD button detected');
                            
                            if (!bypassTriggered) {
                                if (debug) console.log('[Debug] GTD: Waiting for linkInfo...');
                                
                                let gtdRetryCount = 0;
                                
                                function checkAndTriggerGTD() {
                                    const ctrl = sessionController;
                                    const dest = resolveName(ctrl, map.onLD);
                                    
                                    if (ctrl && ctrl.linkInfo && dest.fn) {
                                        triggerBypass('gtd');
                                        if (debug) console.log('[Debug] Captcha bypassed via GTD after', gtdRetryCount, 'seconds');
                                    } else {
                                        gtdRetryCount++;
                                        if (debug) console.log(`[Debug] GTD retry ${gtdRetryCount}s: Still waiting for linkInfo...`);
                                        if (panel) panel.show('Please reload the page...');
                                        setTimeout(checkAndTriggerGTD, 1000);
                                    }
                                }
                                
                                checkAndTriggerGTD();
                                
                            } else {
                                if (debug) console.log('[Debug] GTD ignored: bypass already triggered via TR');
                            }
                        }
                    }
                }
            }
        });
        ob.observe(document.documentElement, { childList: true, subtree: true });
    }
})();

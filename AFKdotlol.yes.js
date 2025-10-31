(function() {
    "use strict";

    const EAS_API_BASE = "https://api.eas.lol/v3/bypass";
    const EAS_API_KEY = ".john2032-3253f-3262k-3631f-2626j-9078k";
    const TRW_API_BASE = "https://trw.lat/api/free/bypass";

    const EAS_TARGET_DOMAINS = ["shorter.me","sub2get.com","sub4unlock.io","sub4unlock.com","sub4unlock.net","subfinal.com","unlocknow.net","ytsubme.com","paste-drop.com","pastebin.com","pastecanyon.com","pastehill.com","pastemode.com","rentry.org","paster.so"];
    const TRW_TARGET_DOMAINS = ['linkvertise.com', 'link-unlock.com'];

    function isEasTarget() {
        try {
            const host = window.location.hostname;
            return EAS_TARGET_DOMAINS.includes(host);
        } catch (err) {
            return false;
        }
    }

    function isTrwTarget() {
        try {
            const host = window.location.hostname;
            return TRW_TARGET_DOMAINS.includes(host);
        } catch (err) {
            return false;
        }
    }

    function _extractUrlFromResponse(data) {
        if (!data) return null;
        if (typeof data === 'string') {
            const m = data.match(/(https?:\/\/[^\s"]+)/);
            return m ? m[0] : null;
        }
        if (typeof data === 'object') {
            if (data.url && typeof data.url === 'string') return data.url;
            if (data.link && typeof data.link === 'string') return data.link;
            if (data.destination && typeof data.destination === 'string') return data.destination;
            if (data.result) return _extractUrlFromResponse(data.result);
            if (data.data) return _extractUrlFromResponse(data.data);
            for (const key of Object.keys(data)) {
                const val = data[key];
                const found = _extractUrlFromResponse(val);
                if (found) return found;
            }
        }
        return null;
    }

    function handleEasApi() {
        return new Promise((resolve, reject) => {
            const currentUrl = window.location.href;
            const payload = { url: currentUrl };

            fetch(EAS_API_BASE, {
                method: 'POST',
                headers: {
                    'eas-api-key': EAS_API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'no-store',
                body: JSON.stringify(payload)
            })
            .then(resp => {
                if (!resp.ok) throw new Error(`EAS API HTTP error: ${resp.status} ${resp.statusText}`);
                return resp.json().catch(() => { throw new Error('EAS API returned non-JSON'); });
            })
            .then(data => {
                const extracted = _extractUrlFromResponse(data);
                if (extracted) {
                    resolve(extracted);
                    return;
                }
                if (data && (data.status === 'success' || data.success === true) && (data.result || data.data)) {
                    const maybe = _extractUrlFromResponse(data.result || data.data);
                    if (maybe) {
                        resolve(maybe);
                        return;
                    }
                }
                if (data && (data.status === 'error' || data.success === false)) {
                    const msg = data.message || data.error || 'Unknown error';
                    reject(new Error(`EAS API error: ${msg}`));
                    return;
                }
                reject(new Error('EAS API returned invalid response format'));
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    function handleTrwApi() {
        return new Promise((resolve, reject) => {
            const currentUrl = window.location.href;
            const apiUrl = `${TRW_API_BASE}?url=${encodeURIComponent(currentUrl)}`;

            fetch(apiUrl, { 
                method: 'GET', 
                mode: 'cors', 
                cache: 'no-store' 
            })
            .then(resp => {
                if (!resp.ok) throw new Error(`TRW API HTTP error: ${resp.status}`);
                return resp.json().catch(() => { throw new Error('TRW API returned non-JSON'); });
            })
            .then(data => {
                if (data && data.success && data.result) {
                    resolve(data.result);
                } else {
                    const extracted = _extractUrlFromResponse(data);
                    if (extracted) resolve(extracted);
                    else reject(new Error('TRW API failed to bypass'));
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    window.afkLolApi = {
        isEasTarget: isEasTarget,
        isTrwTarget: isTrwTarget,
        handleEasApi: handleEasApi,
        handleTrwApi: handleTrwApi
    };
})();

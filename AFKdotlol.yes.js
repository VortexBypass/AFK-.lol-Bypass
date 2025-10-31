(function() {
    "use strict";

    const EAS_API_BASE = "https://api.eas.lol/v2/bypass?url=";
    const EAS_API_KEY = ".john2032-3253f-3262k-3631f-2626j-9078k";
    const TRW_API_BASE = "https://trw.lat/api/free/bypass?url=";

    const EAS_TARGET_DOMAINS = ["shorter.me","sub2get.com","sub4unlock.io","sub4unlock.com","sub4unlock.net","subfinal.com","unlocknow.net","ytsubme.com","paste-drop.com","pastebin.com","pastecanyon.com","pastehill.com","pastemode.com","rentry.org","paster.so","loot-link.com","loot-links.com","lootlink.org","lootlinks.co","lootdest.info","lootdest.org","lootdest.com","links-loot.com","linksloot.net"];
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

    function handleEasApi() {
        return new Promise((resolve, reject) => {
            const currentUrl = window.location.href;
            const encodedUrl = encodeURIComponent(currentUrl);
            const apiUrl = EAS_API_BASE + encodedUrl;

            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'eas-api-key': EAS_API_KEY
                },
                mode: 'cors',
                cache: 'no-store'
            })
            .then(resp => {
                if (!resp.ok) throw new Error('EAS API fetch failed');
                return resp.json();
            })
            .then(data => {
                if (data && data.status === "success" && data.result) {
                    resolve(data.result);
                } else {
                    reject(new Error('EAS API failed to bypass'));
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    function handleTrwApi() {
        return new Promise((resolve, reject) => {
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
                        resolve(data.result);
                    } else {
                        reject(new Error('TRW API failed to bypass'));
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

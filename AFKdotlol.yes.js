(function() {
    "use strict";

    const TRW_API_BASE = "https://trw.lat/api/free/bypass";

    const TRW_TARGET_DOMAINS = ['linkvertise.com', 'link-unlock.com'];

    function isTrwTarget() {
        try {
            const host = window.location.hostname;
            return TRW_TARGET_DOMAINS.includes(host);
        } catch (err) {
            return false;
        }
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
                return resp.json();
            })
            .then(data => {
                if (data && data.success && data.result) {
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
        isTrwTarget: isTrwTarget,
        handleTrwApi: handleTrwApi
    };
})();

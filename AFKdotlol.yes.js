(function() {
    'use strict';
    
    const API_URL = 'https://vortex-bypass-two.vercel.app/bypass?url=';
    
    function parseJSON(text) {
        try {
            return JSON.parse(text);
        } catch(e) {
            return null;
        }
    }
    
    window.AFK_API = function(url, callback) {
        try {
            const fullUrl = API_URL + encodeURIComponent(url);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                timeout: 30000,
                onload: function(response) {
                    try {
                        const json = parseJSON(response.responseText);
                        if (json) {
                            if (json.status === 'success') {
                                callback(null, json.result);
                            } else if (json.status === 'error') {
                                callback(json.message || 'API error');
                            } else {
                                callback(null, json.result || json.data || json);
                            }
                        } else {
                            callback(null, {result: response.responseText});
                        }
                    } catch(error) {
                        callback('Parse error: ' + error);
                    }
                },
                onerror: function() {
                    callback('Network error');
                },
                ontimeout: function() {
                    callback('Timeout');
                }
            });
        } catch(error) {
            callback('Request error: ' + error);
        }
    };
})();

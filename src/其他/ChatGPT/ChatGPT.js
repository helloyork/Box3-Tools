class ChatGPTRequest {
    constructor(config) {
        if (!config) throw new Error("Config is required");
        let { fetch, base_url, api_key, protocol } = config;
        this._fetch = fetch;
        this._base_url = base_url;
        this._protocol = protocol || "https";
        this._getAPIKEY = function () {
            return api_key;
        };
    }
    fetch(c, options) {
        let t = this;
        return this._fetch(`${this._protocol}://${this._base_url}/${c}`, {
            ...options,
            headers: {
                ...options.header,
                "Content-Type": "application/json",
                "Authorization": "Bearer " + t._getAPIKEY()
            }
        });
    }
}

class Moderation {
    constructor(config) {
        if (!config) throw new Error("Config is required");
        let { OPENAI_API_KEY, model, fetch } = config;
        if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required");
        if (!fetch) throw new Error("fetch is required");
        this._getAPIKEY = function () {
            return OPENAI_API_KEY;
        };
        this._events = {};
        this._fetch = fetch;
        this._model = model || "text-moderation-latest";
    }
    onResponding(e) {
        if (typeof e != "function") return;
        this._events["onResponding"].push(e);
        let t = this._events["onResponding"];
        return {
            cancel: function () {
                t.splice((function (a, b) {
                    return a.map((v, i) => { v, i }).filter(v => v === b)[0].i;
                })(t, e), 1);
            },
            isCancelled: function () {
                return !~t.indexOf(e);
            }
        }
    }
    _trigger(type, arg) {
        this._events[type].forEach(v => v(...arg));
    }
    requesting(text) {
        return new ChatGPTRequest({
            fetch: this._fetch,
            base_url: "api.openai.com",
            api_key: this._getAPIKEY(),
        }).fetch("v1/moderations", {
            method:"POST",
            body: JSON.stringify({ input: text })
        })
    }
}

class ChatGPT {
    constructor(config) {
        if (!config) throw new Error("Config is required");
        let { OPENAI_API_KEY, organization, fetch, proxy_host, moderation, use_moderation, storage } = config;
        if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required");
        this._getAPIKEY = function () {
            return OPENAI_API_KEY;
        };
        if (!fetch) throw new Error("fetch is required");
        this._fetch = fetch;
        this._logs = [];
        this._organization = organization;
        this._storage = storage || new Map();
        this._API_BASE_URL = proxy_host || "api.openai.com";
        if (use_moderation && moderation === undefined) throw new Error("moderation is required when using moderation");
        this.moderation = use_moderation ? moderation : undefined;
    }
    async createCompletion(options) {
        let cq = new ChatGPTRequest({
            fetch: this._fetch,
            base_url: this._API_BASE_URL,
            api_key: this._getAPIKEY(),
        }), t = this, moderation;
        if (this.moderation) moderation = this.moderation;
        return new Promise((resolve, reject) => {
            Promise.all([
                new Promise((r, j) => {
                    cq.fetch("v1/chat/completions", {
                        method: "POST",
                        body: JSON.stringify({
                            model: options.model || "gpt-3.5-turbo",
                            messages: options.messages,
                            ...options,
                            stream: false,
                        }),
                        timeout: 100000,
                    })
                        .then(v => v.json())
                        .then(v => r(v))
                        .catch(r => j(r));
                }),
                new Promise((r, j) => {
                    if (!moderation) resolve({});
                    else {
                        moderation.requesting(options.messages.map(v => `${v.role}:${v.content}`).join('\n'))
                            .then(v => v.json())
                            .then(v => r(v))
                            .catch(e => j(e));
                    }
                })
            ])
                .then(v=>resolve({...v[0],moderation:v[1]}))
                .catch(r=>reject(r));
        })
    }
}
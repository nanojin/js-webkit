var WebKitLib = (function (exports) {
    'use strict';

    // webkit-lib/src/meta/tags.ts
    class Rule34Strategy {
        match() {
            return location.hostname.includes("rule34.xxx");
        }
        getTags() {
            const tagList = document.querySelectorAll("#tag-sidebar li");
            return Array.from(tagList)
                .filter(li => li.querySelector("a[href*='tags']"))
                .map(li => {
                var _a, _b, _c, _d;
                const type = ((_a = li.className.split(' ').find(cls => cls.startsWith('tag-type-'))) === null || _a === void 0 ? void 0 : _a.replace('tag-type-', '')) || '';
                const tag = ((_c = (_b = li.querySelector("a[href*='tags']")) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.replace(/ /g, '_')) || '';
                const rank = ((_d = li.querySelector("span")) === null || _d === void 0 ? void 0 : _d.textContent) || '';
                return { tag, rank, type };
            });
        }
    }

    // webkit-lib/src/meta/resolver.ts
    const strategies = [
        new Rule34Strategy(),
        // add GelbooruStrategy, DanbooruStrategy etc
    ];
    function getTags() {
        const strategy = strategies.find(s => s.match());
        return strategy ? strategy.getTags() : [];
    }

    const booru = {
        getTags,
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function getSiteDBName() {
        const hostname = location.hostname
            .replace(/^www\./, '')
            .replace(/^x/, 'twitter')
            .replace(/pinterest\\.[a-z.]+$/, 'pinterest')
            .replace(/[^a-z0-9]+/gi, '_')
            .toLowerCase();
        return `webkitdb-${hostname}`;
    }
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(getSiteDBName(), 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("data")) {
                    db.createObjectStore("data");
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    const SiteScopedDB = {
        get(key) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = yield openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction("data", "readonly");
                    const store = tx.objectStore("data");
                    const req = store.get(key);
                    req.onsuccess = () => { var _a; return resolve((_a = req.result) !== null && _a !== void 0 ? _a : null); };
                    req.onerror = () => reject(req.error);
                });
            });
        },
        set(key, value) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = yield openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction("data", "readwrite");
                    const store = tx.objectStore("data");
                    const req = store.put(value, key);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
            });
        },
        delete(key) {
            return __awaiter(this, void 0, void 0, function* () {
                const db = yield openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction("data", "readwrite");
                    const store = tx.objectStore("data");
                    const req = store.delete(key);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
            });
        },
        keys() {
            return __awaiter(this, void 0, void 0, function* () {
                const db = yield openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction("data", "readonly");
                    const store = tx.objectStore("data");
                    const req = store.getAllKeys();
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            });
        }
    };

    exports.booru = booru;
    exports.db = SiteScopedDB;

    return exports;

})({});

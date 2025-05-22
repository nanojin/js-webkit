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

    exports.getTags = getTags;

    return exports;

})({});

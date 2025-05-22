Object.defineProperty(window, 'TAGS', {
    get: () => {
        return Array.from(
            // document.querySelectorAll("#tag-sidebar li:has(a[href*='tags'])"),
            Array.from(document.querySelectorAll("#tag-sidebar li"))
            .filter(li => li.querySelector("a[href*='tags']")),
            li => {
                const type = li.className?.split(' ').find(cls => cls.startsWith('tag-type-'))?.replace('tag-type-', '');
                const tag = li.querySelector(`a[href*='tags']`)?.innerHTML.replace(/[ ]/g, '_');
                const rank = li.querySelector('span')?.innerHTML;
                // console.log(tag, rank);
                // return li
                return {tag, rank, type};
            })
    },
    configurable: false,
    enumerable: true,
});
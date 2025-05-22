// webkit-lib/src/meta/tags.ts

export type TagData = {
  tag: string;
  rank: string;
  type: string;
};

export interface TagRetrievalStrategy {
  match(): boolean;
  getTags(): TagData[];
}

export class Rule34Strategy implements TagRetrievalStrategy {
  match() {
    return location.hostname.includes("rule34.xxx");
  }

  getTags(): TagData[] {
    const tagList = document.querySelectorAll("#tag-sidebar li");
    return Array.from(tagList)
      .filter(li => li.querySelector("a[href*='tags']"))
      .map(li => {
        const type = li.className.split(' ').find(cls => cls.startsWith('tag-type-'))?.replace('tag-type-', '') || '';
        const tag = li.querySelector("a[href*='tags']")?.textContent?.replace(/ /g, '_') || '';
        const rank = li.querySelector("span")?.textContent || '';
        return { tag, rank, type };
      });
  }
}

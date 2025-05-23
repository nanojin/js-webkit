// webkit-lib/src/meta/resolver.ts

import type { TagRetrievalStrategy } from './tags';
import { Rule34Strategy } from './tags';

const strategies: TagRetrievalStrategy[] = [
  new Rule34Strategy(),
  // add GelbooruStrategy, DanbooruStrategy etc
];

export function getTags(): ReturnType<TagRetrievalStrategy["getTags"]> {
  const strategy = strategies.find(s => s.match());
  return strategy ? strategy.getTags() : [];
}
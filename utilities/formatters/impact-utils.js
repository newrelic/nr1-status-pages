export const IMPACT_RANK = { minor: 1, major: 2, critical: 3 };

// Single pass over `items`: computes each item's impact via `mapFn` and keeps
// the first item whose impact is strictly worse than what's been seen so
// far. Equivalent to a reduce-for-worst-impact followed by a find-for-entry,
// but calls `mapFn` once per item instead of twice.
export const worstBy = (items, mapFn) => {
  let worstImpact = 'minor';
  let worstEntry;

  items.forEach((entry) => {
    const impact = mapFn(entry);
    if (IMPACT_RANK[impact] > IMPACT_RANK[worstImpact]) {
      worstImpact = impact;
      worstEntry = entry;
    }
  });

  return { impact: worstImpact, entry: worstEntry || items[0] };
};

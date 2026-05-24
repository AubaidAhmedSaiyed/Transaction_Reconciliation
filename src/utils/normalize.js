const assetAlias = {
  BTC: 'bitcoin',
  Bitcoin: 'bitcoin',
  ETH: 'ethereum',
  Ethereum: 'ethereum'
};

const typeMap = {
  TRANSFER_IN: 'IN',
  TRANSFER_OUT: 'OUT',
  IN: 'IN',
  OUT: 'OUT'
};

function normalizeAsset(a) {
  if (!a) return '';
  const v = a.toString().trim();
  const up = v.toUpperCase();
  return assetAlias[up] || assetAlias[v] || up.toLowerCase();
}

function normalizeType(t) {
  if (!t) return '';
  const v = t.toString().trim().toUpperCase();
  return typeMap[v] || v;
}

function mapTypeForUser(t) {
  const nt = normalizeType(t);
  if (nt === 'IN') return 'IN';
  if (nt === 'OUT') return 'OUT';
  return nt;
}

function reverseType(t) {
  if (!t) return t;
  if (t === 'IN') return 'OUT';
  if (t === 'OUT') return 'IN';
  return t;
}

module.exports = { normalizeAsset, normalizeType, mapTypeForUser, reverseType };

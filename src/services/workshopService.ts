import AsyncStorage from '@react-native-async-storage/async-storage';

export type Workshop = {
  id: string;
  name: string;
  state: string;
  address: string;
  phone: string;
};

const CACHE_KEY = 'jpj_workshops';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const JPJ_URL = 'https://www.jpj.gov.my/bengkel-kemalangan/';

// Multi-word states must come before single-word to avoid partial matches
const STATES = [
  'KUALA LUMPUR',
  'WILAYAH PERSEKUTUAN',
  'W.P PUTRAJAYA',
  'W.P LABUAN',
  'NEGERI SEMBILAN',
  'PULAU PINANG',
  'JOHOR',
  'KEDAH',
  'KELANTAN',
  'MELAKA',
  'PAHANG',
  'PERAK',
  'PERLIS',
  'SABAH',
  'SARAWAK',
  'SELANGOR',
  'TERENGGANU',
];

type CachedWorkshops = { fetchedAt: number; data: Workshop[] };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseWorkshops(html: string): Workshop[] {
  const text = html.replace(/<[^>]+>/g, ' ');
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const workshops: Workshop[] = [];

  for (const line of lines) {
    const upper = line.toUpperCase();
    let matchedState: string | null = null;

    for (const state of STATES) {
      if (upper.startsWith(state)) {
        matchedState = state;
        break;
      }
    }

    if (!matchedState) continue;

    // Strip the state prefix (use original casing offsets)
    const rest = line.slice(matchedState.length).trim();
    if (!rest) continue;

    const dotIndex = rest.indexOf('.');
    const lastDotIndex = rest.lastIndexOf('.');

    if (dotIndex === -1) continue;

    const name = rest.slice(0, dotIndex).trim();
    if (!name) continue;

    let address = '';
    let phone = '';

    if (lastDotIndex > dotIndex) {
      address = rest.slice(dotIndex + 1, lastDotIndex).trim();
      phone = rest.slice(lastDotIndex + 1).trim();
    } else {
      address = rest.slice(dotIndex + 1).trim();
    }

    workshops.push({
      id: slugify(name),
      name,
      state: matchedState,
      address,
      phone,
    });
  }

  return workshops;
}

async function fetchAndParse(): Promise<Workshop[]> {
  const response = await fetch(JPJ_URL);
  const html = await response.text();
  return parseWorkshops(html);
}

export async function getWorkshops(): Promise<Workshop[]> {
  let staleData: Workshop[] | null = null;

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CachedWorkshops = JSON.parse(cached);
      const age = Date.now() - parsed.fetchedAt;
      if (age < CACHE_TTL_MS) {
        return parsed.data;
      }
      staleData = parsed.data;
    }
  } catch {
    // Ignore cache read errors
  }

  try {
    const data = await fetchAndParse();
    const payload: CachedWorkshops = { fetchedAt: Date.now(), data };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    return data;
  } catch {
    if (staleData) return staleData;
    return [];
  }
}

const DEFAULT_WORDS = [
  "cazzo", "merda", "stronzo", "puttana", "vaffanculo", "coglione",
  "minchia", "bastardo", "troia", "fuck", "shit", "bitch", "asshole",
  "dick", "damn", "nigger", "faggot", "cunt"
];

let cachedWords: string[] | null = null;

export const loadProfanityWords = async (
  fetchFn: () => Promise<string[]>
): Promise<string[]> => {
  if (cachedWords) return cachedWords;
  try {
    const dbWords = await fetchFn();
    cachedWords = dbWords.length > 0 ? dbWords : DEFAULT_WORDS;
  } catch {
    cachedWords = DEFAULT_WORDS;
  }
  return cachedWords;
};

export const resetProfanityCache = () => {
  cachedWords = null;
};

export const checkProfanity = (text: string, words: string[]): boolean => {
  const lower = text.toLowerCase();
  return words.some((w) => {
    const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return regex.test(lower);
  });
};

export const filterProfanity = (text: string, words: string[]): string => {
  let result = text;
  words.forEach((w) => {
    const regex = new RegExp(`\\b(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
    result = result.replace(regex, (match) => "*".repeat(match.length));
  });
  return result;
};

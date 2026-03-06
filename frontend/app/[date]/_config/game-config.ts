export const WORD_LENGTH = 5;
export const MAX_GUESSES = 7;

export const KEYBOARD_ROWS = [
  [..."qwertyuiop"],
  [..."asdfghjkl"],
  [..."zxcvbnm"],
] as const;

export const KEYBOARD_KEYS = KEYBOARD_ROWS.flat();

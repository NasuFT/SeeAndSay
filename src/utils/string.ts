export function isAllLetter(c: string) {
  return !/[^a-z]/i.test(c);
}

export function getMatchingCharacters(a: string, b: string) {
  return a
    .split('')
    .reduce((accumulator, char, index) => accumulator + (char === b.charAt(index) ? 1 : 0), 0);
}

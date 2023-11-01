export const cleanString = (s: string): Lowercase<string> => 
  s?.toLowerCase()
  .replace('&nbsp;', ' ')
  .replace('  ', ' ')
  .replace(/:|;|,|\.|"|'/g, '')
  .trim() as Lowercase<string>

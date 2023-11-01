export const cleanString = (s: string): Lowercase<string> => 
  s?.toLowerCase()
  .replace('&nbsp;', ' ')
  .replace('  ', ' ')
  .replace(/:|;|,|\.|"|'/g, '')
  .trim() as Lowercase<string>


export const getResultColor = (guess: Lowercase<string>[], guessIdx: number, currentDefinition?: Lowercase<string>[]) => (
  guess[guessIdx] === currentDefinition?.[guessIdx]
    ? 'green'
    : (currentDefinition?.filter(w => w === guess[guessIdx]).length || 0) > (currentDefinition?.filter((w,i) => w === guess[guessIdx] && currentDefinition?.[i] === guess[i]).length || 0)
      ? 'darkorange'
      : 'red'
)
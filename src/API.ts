

export function evaluatePhrase(guess: string[], truth: string[]): Promise<{similarity: string}> {
  return new Promise((resolve, reject) => {
    fetch('https://tnuv44hsc0.execute-api.us-east-2.amazonaws.com/default/description_engine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phrase1: guess.join(' ').toLowerCase(),
        phrase2: truth.join(' ').toLowerCase(),
      })
    })
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
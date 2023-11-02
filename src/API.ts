const getRandomWordURL = 'https://random-word-form.repl.co/random/noun' //https://random-word-api.p.rapidapi.com/get_word'
const getRandomWordOptions = {
  method: 'GET',
  // headers: {
  //   'X-RapidAPI-Key': '6ec85af870msh4898dba973f5b70p149201jsnb7914fe73642',
  //   'X-RapidAPI-Host': 'random-word-api.p.rapidapi.com'
  // }
};

export function getRandomWord(): Promise<string[]>{
 return new Promise<any>((resolve, reject) => {
    fetch(getRandomWordURL, getRandomWordOptions)
      .then(res => res.json()) 
      .then(res => resolve(res)) 
      .catch(err => reject(err)) 
  })
}

const getWordDataURL = (word: string) => `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${word}`
const getWordDataOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '6ec85af870msh4898dba973f5b70p149201jsnb7914fe73642',
    'X-RapidAPI-Host': 'lingua-robot.p.rapidapi.com'
  }
};

export function getWordData(word: string): Promise<{
  entries: {
    entry: string, 
    lexemes: {
      partOfSpeech: string, 
      senses: { 
        definition: string, 
        usageExamples: string[], 
        synonyms?: string[], 
        antonyms?: string[], 
        context?: {
          domains?: string[]
        }
      }[]
    }[]
  }[]
}>{
  return new Promise<any>((resolve, reject) => {
    fetch(getWordDataURL(word), getWordDataOptions)
    .then((res) => res.json()) 
    .then(res => resolve(res)) 
    .catch(err => reject(err)) 
  })
}


const evaluatePhraseURL = 'https://tnuv44hsc0.execute-api.us-east-2.amazonaws.com/default/description_engine'
const evaluatePhraseOptions = (guess: string[], truth: string[]) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phrase1: guess.join(' '),
    phrase2: truth.join(' ')
  })
})

export function evaluatePhrase(guess: string[], truth: string[] = []): Promise<{similarity: string}> {
  return new Promise((resolve, reject) => {
    fetch(evaluatePhraseURL, evaluatePhraseOptions(guess, truth))
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
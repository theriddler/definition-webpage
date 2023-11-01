import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";
import { cleanString } from "../utils";

interface EntryFormProps {
  guesses: Guess[];
  previousGuess?: Guess;
  currentDefinition?: string[];
  originalDefinitionString?: string;
  addGuessToState: (guess: string[], similarity: number) => void;
}

interface EntryFormState {
}

export class EntryForm extends React.Component<EntryFormProps, EntryFormState> {

  constructor(p: EntryFormProps){
    super(p);
    
    this.state = {

    }
  }

  makeGuess(guess: Lowercase<string>[], similarity: number){
    // filter out empty strings
    let cleanedGuess = guess.filter(w => w).map(w => cleanString(w))

    // add to our parent, filtering on empty strings
    // if(!this.props.guesses.some(g => g.value.length === cleanedGuess.length && g.value.every((w,idx) => w === cleanedGuess[idx])))
    this.props.addGuessToState(cleanedGuess, similarity);

    // put guess into textarea (in case this was triggered by a hint)
    let guessInput = (document.getElementById('guess_input') as HTMLDivElement)

    // format our textarea text
    guessInput.innerText = cleanedGuess.join(' ')
    guessInput!.innerHTML = cleanedGuess.map((word,idx) => `<span contenteditable="false" class="mx-2" style="color:${
      this.props.currentDefinition?.[idx] === word
        ? 'green'
        : this.props.currentDefinition?.some(w => w === word)
          ? 'orange'
          : 'red'
      };">${word}</span>`).join('')
  }

  makeHint(){
    let [hintWords, hintIndexes] = (this.props.currentDefinition || [])
      .map((w:string,idx:number) => ({w:w, idx:idx}))
      .filter((w) => w.w !== this.props.previousGuess?.value[w.idx])
      .reduce((acc: [hintWords: string[], hintIndexes: number[]],w) => {
        acc[0].push(w.w); 
        acc[1].push(w.idx); 
        return acc;
      }, [[],[]])

    let randomIndex = Math.floor(Math.random() * (hintIndexes.length-1))
    let hintWordIndex = hintIndexes[randomIndex]
    let hintWord = cleanString(hintWords[randomIndex])
    
    if(hintWord){
      let guessThatIsNowHint: Lowercase<string>[] = this.props.previousGuess?.value || Array(this.props.currentDefinition?.length)                  
      guessThatIsNowHint.splice(hintWordIndex, 1, hintWord)
      
      evaluatePhrase(guessThatIsNowHint, this.props.currentDefinition)
        .then(res => this.makeGuess(Object.assign(guessThatIsNowHint), parseFloat(res.similarity)))
        .catch(err => console.log(err))
    }
  }

  render(){
    return (
      <form id='guess_form' onSubmit={(event) => event.preventDefault()}>
        <div className="textarea-container">
          <div
            contentEditable 
            id='guess_input' 
            onKeyDownCapture={(e) => {
              if (e.key === "Enter" && !e.shiftKey)
                e.preventDefault()

              if(!e.code.includes('Key') && !e.code.includes('Arrow') && e.code !== 'Space' && e.code !== 'Backspace')
                e.preventDefault()
            }}
            onKeyUpCapture={(e) => {
              if (e.key === "Enter" && !e.shiftKey) 
                document.getElementById("guess_submit")?.click()
            }}
          >
          </div>
        </div>
        <div className='d-flex justify-content-center align-items-end' style={{gap: '50px'}}>
          <input
            id='guess_hint'
            type='button'
            value='Hint'
            style={{fontSize:'16px'}}
            onClick={this.makeHint}
          />
          <input
            id='guess_submit'
            type='submit'
            className="mt-5"
            onClick={() => {
              // get our input object
              let input = (document.getElementById(`guess_input`) as HTMLDivElement)

              // bring our input.innerHTML into a temporary container
              let tempEl = document.createElement("div")
              tempEl.innerHTML = input.innerHTML.trim()

              // clean, split and filter spaces/spans out
              let guess: Lowercase<string>[] = []
              
              while (tempEl.lastChild) {
                let firstChild = tempEl.firstChild as HTMLElement
                firstChild.textContent
                  ?.split(' ')
                  .map((w:string) => cleanString(w))
                  ?.filter(w => w)
                  ?.forEach(w => guess.push(w))
                tempEl.removeChild(firstChild);
              }
              
              // evaluate and set our guess to state
              evaluatePhrase(guess, this.props.currentDefinition)
                .then((res) => this.makeGuess(guess, parseFloat(res.similarity)))
                .catch((err: Error) => console.log(err));
            }}
          />
          <input
            id='guess_reset'
            type='button'
            value='Reset'
            style={{fontSize:'16px'}}
            onClick={() => (document.getElementById('guess_form') as HTMLFormElement).reset()}//(document.getElementById('guess_input') as HTMLDivElement)!.innerText = ''}}
          />
        </div>
      </form>
    )
  }
}
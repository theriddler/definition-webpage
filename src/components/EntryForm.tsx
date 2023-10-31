import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";
import { cleanString } from "../utils";

interface EntryFormProps {
  guesses: Guess[];
  previousGuess?: Guess;
  currentDefinition: string[];
  originalDefinitionString: string;
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
    let cleanedGuess = guess.filter(w => w) as Lowercase<string>[]

    // put guess into text area (in case this was triggered by a hint)
    (document.getElementById('guess_input') as HTMLDivElement).innerText = cleanedGuess.join(' ')

    // add to our parent, filtering on empty strings
    // if(!this.props.guesses.some(g => g.value.length === cleanedGuess.length && g.value.every((w,idx) => w === cleanedGuess[idx])))
      this.props.addGuessToState(cleanedGuess, similarity);
  }

  render(){
    return (
      <form id='guess_form'onSubmit={(event) => event.preventDefault()}>
        <div className="textarea-container">
          <div
            contentEditable 
            id={`guess_input`} 
            className="w-100 h-100 p-0 text-center"
            onKeyDownCapture={(e) => {
              if (e.key === "Enter" && !e.shiftKey)
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
            onClick={() => {
              let [hintWords, hintIndexes] = this.props.currentDefinition
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
                let guessThatIsNowHint: Lowercase<string>[] = this.props.previousGuess?.value || Array(this.props.currentDefinition.length)                  
                guessThatIsNowHint.splice(hintWordIndex, 1, hintWord)
                
                evaluatePhrase(guessThatIsNowHint, this.props.currentDefinition)
                  .then(res => this.makeGuess(Object.assign(guessThatIsNowHint), parseFloat(res.similarity)))
                  .catch(err => console.log(err))
              }
            }}
          />
          <input
            id='guess_submit'
            type='submit'
            className="mt-5"
            onClick={() => {
              // get our input object
              let input = (document.getElementById(`guess_input`) as HTMLDivElement).innerText

              // clean, split and filter spaces out
              let guess = cleanString(input).split(' ').filter(w => w) as Lowercase<string>[]
              
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
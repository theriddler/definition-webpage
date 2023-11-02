import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";
import { cleanString, getResultColor } from "../utils";

interface EntryFormProps {
  guesses: Guess[];
  previousGuess?: Guess;
  currentDefinition?: Lowercase<string>[];
  originalDefinitionString?: string;
  addGuessToState: (guess: string[], similarity: number) => void;
}

interface EntryFormState {
  savedRange?: Range;
}

export class EntryForm extends React.Component<EntryFormProps, EntryFormState> {

  constructor(p: EntryFormProps){
    super(p);
    
    this.state = {
      savedRange: undefined,
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
    guessInput!.innerHTML = cleanedGuess.map((guessWord,idx) => 
      `<span 
        class="mx-2" 
        style="color:${getResultColor(cleanedGuess, idx, this.props.currentDefinition)};"
      >${guessWord}</span>`).join('')
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

    // let randomIndex = Math.floor(Math.random() * (hintIndexes.length-1))
    let hintWordIndex = hintIndexes[0] // do first possible hint for now
    let hintWord = cleanString(hintWords[0])
    
    if(hintWord){
      let guessThatIsNowHint: Lowercase<string>[] = this.props.previousGuess?.value || Array(this.props.currentDefinition?.length)                  
      guessThatIsNowHint.splice(hintWordIndex, 1, hintWord)
      
      evaluatePhrase(guessThatIsNowHint, this.props.currentDefinition)
        .then(res => this.makeGuess(Object.assign(guessThatIsNowHint), parseFloat(res.similarity)))
        .catch(err => console.log(err))
    }
  }

  saveSelection(){
    if(window.getSelection)
      this.setState({savedRange: window.getSelection()?.getRangeAt(0)})
  }

  restoreSelection(){
    document.getElementById("guess_input")?.focus();
    if (this.state.savedRange !== undefined) 
      if (window.getSelection()){ // there is already a selection
          var s = window.getSelection();
          if ((s?.rangeCount || 0) > 0) 
              s?.removeAllRanges();
          s?.addRange(this.state.savedRange);
      }
      else if (document.createRange())// no selection
        window.getSelection()?.addRange(this.state.savedRange);
    
}

  render(){
    return (
      <form id='guess_form' onSubmit={(event) => event.preventDefault()}>
        <div id="guess_input_container">
          <div
            contentEditable 
            id='guess_input' 
            onKeyDownCapture={(e) => {
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
        <div className='py-3 fixed-bottom d-flex justify-content-center align-items-center' style={{gap: '50px', backgroundColor: 'black'}}>
          <input
            id='guess_hint'
            type='button'
            value='Hint'
            style={{fontSize:'16px'}}
            onClick={this.makeHint.bind(this)}
          />
          <input
            id='guess_submit'
            type='submit'
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
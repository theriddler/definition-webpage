import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";
import { cleanString } from "../utils";

interface EntryFormProps {
  guesses: Guess[];
  currentDefinition: string[];
  originalDefinitionString: string;
  addGuessToState: (guess: string[], similarity: number) => void;
}

interface EntryFormState {
  prevGuess: Guess | null;
}

export class EntryForm extends React.Component<EntryFormProps, EntryFormState> {

  constructor(p: EntryFormProps){
    super(p);
    
    this.state = {
      prevGuess: null
    }
  }

  makeGuess(guess: Lowercase<string>[], similarity: number){
    if(!this.props.guesses.some(g => guess.every((w: string, idx: number) => w && w === g.value[idx])))
      this.props.addGuessToState(guess, similarity)
    
    
    
    this.setState({
      prevGuess: {value: guess, similarity: similarity}
    })
  }

  render(){
    return (
      <form onSubmit={(event) => {document.getElementById("guess_submit")?.click(); event.preventDefault(); }}>
        <div className="textarea-container">
          <textarea 
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
            // placeholder={w.split('').map((l: string) => '-').join('')}
            // style={{
            //   borderColor: 
            //     this.state.prevGuess?.value[idx] === w 
            //       ? 'green' 
            //       : this.props.currentDefinition.includes(this.state.prevGuess?.value[idx] || 'z')
            //         ? 'orange' 
            //         : !this.state.prevGuess?.value[idx]
            //           ? 'white' 
            //           : 'red'
            // }}
          />
        </div>
        {/* {
          ['.',',',';'].includes(this.props.originalDefinitionString[++letterCount]) 
          && <span>{this.props.originalDefinitionString.split('')[letterCount++]}&nbsp;</span>
        } */}
        <div className='d-flex justify-content-center align-items-end' style={{gap: '50px'}}>
          <input
            id='guess_hint'
            type='button'
            value='Hint'
            style={{fontSize:'16px'}}
            onClick={() => {
              let unfoundWords = this.props.currentDefinition
                .map((w: string, idx: number) => ({w:w, idx:idx}))
                .filter((word: {w: string, idx: number}) => !this.props.guesses.some(g => g.value.includes(cleanString(word.w))))

              let randomWordIndex = Math.floor(Math.random() * unfoundWords.length)
              let randomWord = cleanString(unfoundWords[randomWordIndex]?.w)
              
              let guessThatIsNowHint: Lowercase<string>[] = this.props.guesses
                .find(g => g.value[randomWordIndex] !== randomWord)?.value || Array(this.props.currentDefinition.length)
                .join('.')
                .split('.')
                .map((s:string) => cleanString(s))
                
              guessThatIsNowHint.splice(randomWordIndex, 0, randomWord)
              console.log(guessThatIsNowHint)
              
              if(guessThatIsNowHint.length > 0)
                evaluatePhrase(guessThatIsNowHint, this.props.currentDefinition)
                  .then(res => this.makeGuess(guessThatIsNowHint, parseFloat(res.similarity)))
                  .catch(err => console.log(err))
                
            }}
          />
          <input
            id='guess_submit'
            type='submit'
            className="mt-5"
            onClick={() => {              
              // get our input object
              let input = (document.getElementById(`guess_input`) as HTMLInputElement).value

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
            onClick={() => false}//(document.getElementById('guess_input') as HTMLInputElement)!.value = ''}}
          />
        </div>
      </form>
    )
  }
}
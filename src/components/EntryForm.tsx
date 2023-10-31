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

  render(){
    return (
      <form onSubmit={(event) => {event.preventDefault(); document.getElementById("submit")?.click();}} className="entry-form">
        <span>
          <input 
            id={`guess_input`} 
            type='text'
            className="w-100 mx-2 text-center"
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
          {/* {
            ['.',',',';'].includes(this.props.originalDefinitionString[++letterCount]) 
            && <span>{this.props.originalDefinitionString.split('')[letterCount++]}&nbsp;</span>
          } */}
        </span> 
        <div className='d-flex justify-content-center align-items-end' style={{gap: '50px'}}>
          <span>
            <button
              style={{fontSize:'16px'}}
            >
              Reset
            </button>
          </span>
          <input
            id='submit'
            type='submit'
            className="mt-5"
            onSubmit={function(){return false}}
            onClick={() => {
              
              // get our input object
              let input = (document.getElementById(`guess_input`) as HTMLInputElement).value

              // clean and split
              let guess = cleanString(input).split(' ') as Lowercase<string>[]
              
              // evaluate and set our guess to state
              evaluatePhrase(guess, this.props.currentDefinition)
                .then((res) => {
                  this.props.addGuessToState(guess, parseFloat(res.similarity))
                  this.setState({prevGuess: {value: guess, similarity: parseFloat(res.similarity)}})
                })
                .catch((err: Error) => console.log(err));
            }}
          />
          <button
            style={{fontSize:'16px'}}
            onClick={() => {
              let unfoundWords = this.props.currentDefinition
                .map((w: string, idx: number) => ({w:w, idx:idx}))
                .filter((word: {w: string, idx: number}) => !this.props.guesses.some(g => g.value.includes(cleanString(word.w))))

              let randomWordIndex = Math.floor(Math.random() * unfoundWords.length)
              let randomWord = unfoundWords[randomWordIndex]?.w
              let guessToAddTo = this.props.guesses.find(g => g.value[randomWordIndex] !== randomWord)?.value || Array(this.props.currentDefinition.length).join('.').split('.')
              let guessThatIsNowHint = (guessToAddTo.splice(randomWordIndex, 0, randomWord) || '') as Lowercase<string>[]
              
              if(guessThatIsNowHint)
                evaluatePhrase(guessThatIsNowHint, this.props.currentDefinition)
                  .then(res => this.props.addGuessToState(guessThatIsNowHint, parseFloat(res.similarity)))
                  .catch(err => console.log(err))
                
            }}
          >
            Hint
          </button>
        </div>
      </form>
    )
  }
}
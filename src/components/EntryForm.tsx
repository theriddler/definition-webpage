import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";
import { cleanString } from "../utils";


interface EntryFormProps {
  guesses: Guess[];
  currentDefinition: string[];
  originalDefinitionString: string;
  setGuessToState: (guess: string[], similarity: number) => void;
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
    let letterCount = -1; 
    return (
      <form onSubmit={(event) => {event.preventDefault()}}>
        {
          this.props.currentDefinition
          .map((w: string, idx: number) => (letterCount += w.length) && (
            <>
              <input 
                id={`${idx}_guess`} 
                type='text'
                placeholder={w.split('').map(l => ' - ').join('')}
                style={{
                  width: `${w.length*40}px`,
                  borderColor: 
                    this.state.prevGuess?.value[idx] === w 
                      ? 'green' 
                      : this.props.currentDefinition.includes(this.state.prevGuess?.value[idx] || 'z')
                        ? 'orange' 
                        : !this.state.prevGuess?.value[idx]
                          ? 'white' 
                          : 'red'
                }}
                className="m-2"
              />
              {
                ['.',',',';'].includes(this.props.originalDefinitionString[++letterCount]) 
                && this.props.originalDefinitionString.split('')[letterCount++]
              }
            </>
          ))
        }
        <br/>
        <br/>
        <input
          id='click'
          type='submit'
          onClick={() => {
            
            // get each of the input objects for each word
            let inputs = this.props.currentDefinition
              .map((w: string, idx: number) => (document.getElementById(`${idx}_guess`) as HTMLInputElement))

            // reassemble the user's input
            let guess = inputs.map(w => cleanString(w.value))
            
            // evaluate and set our guess to state
            evaluatePhrase(guess, this.props.currentDefinition)
              .then((res) => {
                this.props.setGuessToState(guess, parseFloat(res.similarity))
                this.setState({prevGuess: {value: guess, similarity: parseFloat(res.similarity)}})
              })
              .catch((err: Error) => console.log(err));
          }}
          onSubmit={function(){return false}}
        />
      </form>
    )
  }
}
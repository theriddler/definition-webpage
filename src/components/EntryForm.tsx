import React from "react";
import { evaluatePhrase } from "../API";
import { Guess } from "../types";


interface EntryFormProps {
  guesses: Guess[];
  currentDefinition: string[];
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

  componentDidUpdate(prevProps: Readonly<EntryFormProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.guesses.length !== this.props.guesses.length){
      console.log(this.props.guesses)
    }
  }

  render(){
    return (
      <form onSubmit={(event) => {event.preventDefault()}}>
        {
          this.props.currentDefinition
          .map((w: string, idx: number) => `${console.log(this.props.guesses)}` && (
            <input 
              id={`${idx}_guess`} 
              type='text'
              style={{
                width: `${w.length}em`,
                borderColor: 
                  this.state.prevGuess?.value[idx] === w 
                    ? 'green' 
                    : this.props.currentDefinition[idx].includes(this.state.prevGuess?.value[idx] || 'z')
                      ? 'yellow' 
                      : !this.state.prevGuess?.value[idx]
                        ? 'white' 
                        : 'red'
              }}
              className="m-2"
            />
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
            let guess = inputs
              .map(w => w.value)
            
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
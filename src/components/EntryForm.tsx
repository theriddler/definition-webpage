import { evaluatePhrase } from "../API";
import { Guess } from "../types";


interface EntryFormProps {
  setGuessToState: (guess: string, similarity: number) => void;
  currentDefinition: string;
}

export const EntryForm = (props: EntryFormProps) => {
  return (
    <form onSubmit={(event) => {event.preventDefault()}}>
      <input 
        id='guess'
        type='text'
      />
      <br/>
      <br/>
      <input
        id='click'
        type='submit'
        onClick={() => {
          let input = document.getElementById('guess') as HTMLInputElement
          let guess = input.value
          input.value = ''
          
          evaluatePhrase(guess, props.currentDefinition)
            .then((res) => props.setGuessToState(guess, parseFloat(res.similarity)))
            .catch((err: Error) => console.log(err));
        }}
        onSubmit={function(){return false}}
      />
    </form>
  )
}
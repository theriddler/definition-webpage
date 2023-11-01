import React from 'react'
import { Guess } from "../types";
import { getResultColor } from '../utils';

interface GuessTableProps {
  guesses: Guess[];
  previousGuess?: Guess;
  currentDefinition?: Lowercase<string>[];
}

interface GuessTableState {
}

export class GuessTable extends React.Component<GuessTableProps,GuessTableState>{
  // constructor(p: GuessTableProps){
  //   super(p);
  // }

  render() {
    return (
      <div className='guess-table'>
        {
          this.props.guesses
          .sort((g1, g2) => g2.similarity - g1.similarity)
          .map(guess => <GuessTableRow key={Math.random().toString()} previousGuess={guess.value.length === this.props.previousGuess?.value.length && guess.value.every((w,idx) => w === this.props.previousGuess?.value[idx])} guess={guess} currentDefinition={this.props.currentDefinition || []}/>)
        }
      </div>
    )
  }
}

const GuessTableRow = (props: {guess: Guess, currentDefinition: Lowercase<string>[], previousGuess: boolean}) => (
  <div className='guess-row'>
    <div className='p-2'>
      {
        props.guess.value
        .map((word: string, idx: number) => (
          <span 
            key={`${word}_${idx}`}
            className='d-inline-block guessed-word-display'
            style={{color: getResultColor(props.guess.value, idx, props.currentDefinition)}}>
            {word}
          </span>
        ))
      }
    </div>
    <div className='p-2'>
      <span  
        key={`${props.guess.value.join('')}_${props.guess.similarity}`}
        className='px-3 d-inline-block guessed-word-display'
        style={{border: props.previousGuess ? '1px solid white' : '0'}}
      >
        {props.guess.similarity}%
      </span>
    </div>
  </div>
)
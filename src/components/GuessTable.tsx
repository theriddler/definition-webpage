import React from 'react'
import { Guess } from "../types";

interface GuessTableProps {
  guesses: Guess[];
  currentDefinition?: Lowercase<string>[];
}

interface GuessTableState {
  lastGuess?: Guess;
}

export class GuessTable extends React.Component<GuessTableProps,GuessTableState>{
  constructor(p: GuessTableProps){
    super(p);

    this.state = {
      lastGuess: undefined
    }
  }
  render() {
    this.setState({lastGuess:this.props.guesses[-1]})

    return (
      <table className='guess-table'>
        <tbody>
          {
            this.props.guesses
            .sort((g1, g2) => g2.similarity - g1.similarity)
            .map(guess => <GuessTableRow lastGuess={guess.value.every((w,idx) => w === guess.value[idx])} guess={guess} currentDefinition={this.props.currentDefinition || []}/>)
          }
        </tbody>
      </table>
    )
  }
}

const GuessTableRow = (props: {guess: Guess, currentDefinition: Lowercase<string>[], lastGuess: boolean}) => (
  <tr>
    <td className='p-3'>
      {
        props.guess.value
        .map((word: string, idx: number) => (
          <>
            <span 
              key={word}
              className='d-inline-block guessed-word-display'
              style={{color: 
                props.currentDefinition?.[idx] === word
                  ? 'green'
                  : props.currentDefinition?.some((w: Lowercase<string>) => w === word) 
                    ? 'darkorange'
                    : 'red'
            }}>
              {word}
            </span>
          </>
        ))
      }
    </td>
    <td className='p-3' style={{color: props.lastGuess ? 'green' : 'white'}}>
      {props.guess.similarity}%
    </td>
  </tr>
)
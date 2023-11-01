import React from 'react'
import { Guess } from "../types";

interface GuessTableProps {
  guesses: Guess[];
  currentDefinition?: Lowercase<string>[];
}

export class GuessTable extends React.Component<GuessTableProps,{}>{
  render() {
    return (
      <table className='guess-table'>
        <tbody>
          {
            this.props.guesses.length > 0 && 
              <GuessTableRow fullBorder={true} guess={this.props.guesses[this.props.guesses.length-1]} currentDefinition={this.props.currentDefinition || []}/> 
          }
          {
            this.props.guesses
            .slice(0, this.props.guesses.length-1)
            .sort((g1, g2) => g2.similarity - g1.similarity)
            .map(guess => <GuessTableRow fullBorder={false} guess={guess} currentDefinition={this.props.currentDefinition || []}/>)
          }
        </tbody>
      </table>
    )
  }
}

const GuessTableRow = (props: {guess: Guess, currentDefinition: Lowercase<string>[], fullBorder: boolean}) => (
  <tr style={{borderBottom: props.fullBorder ? '1px solid purple' : ''}}>
    <td className='p-3'>
      {
        props.guess.value
        .map((word: string, idx: number) => (
          <>
            <span 
              key={word}
              className='d-inline-block guessed-word-display'
              style={{backgroundColor: 
                props.currentDefinition?.[idx] === word
                  ? 'green'
                  : props.currentDefinition?.some((w: Lowercase<string>) => w === word) 
                    ? 'orange'
                    : 'red'
            }}>
              {word}
            </span>
            &nbsp;
          </>
        ))
      }
    </td>
    <td className='p-3'>
      {props.guess.similarity}%
    </td>
  </tr>
)
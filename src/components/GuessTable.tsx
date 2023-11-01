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
            this.props.guesses
            .sort((g1, g2) => g2.similarity - g1.similarity)
            .map(guess => {
              return (
                <tr>
                  <td>
                    {
                      guess.value
                      .map((word: string, idx: number) => (
                        <>
                          <span 
                            className='d-inline-block guessed-word-display'
                            style={{backgroundColor: 
                              this.props.currentDefinition?.[idx] === word
                                ? 'green'
                                : this.props.currentDefinition?.some((w: Lowercase<string>) => w === word) 
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
                  <td>{guess.similarity}%</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}
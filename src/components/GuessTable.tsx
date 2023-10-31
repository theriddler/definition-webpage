import { Guess } from "../types";

interface GuessTableProps {
  guesses: Guess[];
  currentDefinition: Lowercase<string>[];
}

export const GuessTable = (props: GuessTableProps) => (
  <table>
    <tbody>
      {
        props.guesses
        .sort((g1, g2) => g2.similarity - g1.similarity)
        .map(guess => {
          return (
            <tr>
              <td>
                {
                  guess.value
                  .map((word: string, idx: number) => `${console.log(word)}` && (
                    <>
                      <span 
                        style={{backgroundColor: 
                          props.currentDefinition[idx] === word
                            ? 'green'
                            : props.currentDefinition.some((w: Lowercase<string>) => w === word) 
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
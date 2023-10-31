import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Col, Container, Row } from 'reactstrap'
import { EntryForm } from './components/EntryForm';
import { Guess } from './types';
import { evaluatePhrase } from './API';
import { cleanString } from './utils';

interface Props {

}

interface State {
  res: any;
  currentWord: string;
  currentDefinition: string[];
  guesses: Guess[];
}


const wordDefinitionOptions = (word: string) => ({
  method: 'GET',
  url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
});

class App extends React.Component<Props, State> {

  constructor(p: Props){
    super(p);

    this.state = {
      res: null,
      guesses: [],
      currentDefinition: [],
      currentWord: ''
    }
  }

  componentDidMount(): void {
    this.chooseWord('ambidextrous')
    evaluatePhrase(this.state.currentDefinition, this.state.currentDefinition)
  }

  chooseWord(word: string): void {
    fetch(wordDefinitionOptions(word).url, wordDefinitionOptions(word))
      .then(res => res.json())
      .then(data => this.setState({
        currentWord: word, 
        currentDefinition: data[0]['meanings'][0]?.['definitions'][0]['definition']
          .split(' ')
          .map((w: string) => cleanString(w))
      }, () => console.log(this.state.currentDefinition)))
  }

  setGuessToState(guess: string[], similarity: number) {
    this.setState((prevState) => { 
      return {
        guesses: [
          ...prevState.guesses, 
          {
            'value': guess.map(w => cleanString(w)), 
            'similarity': similarity
          }
        ]
      }
    })
  }

  render() {
    return (
      <Container className='my-5 text-center'>
        <Row>
          <Col>
            <h2>Write the definition of this word</h2>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <h5 style={{color: 'purple'}}>{this.state.currentWord}</h5>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className=''>
            <EntryForm
              guesses={this.state.guesses}
              currentDefinition={this.state.currentDefinition}
              setGuessToState={this.setGuessToState.bind(this)}
            />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className='d-flex justify-content-center'>
            <table>
              <tbody>
                {
                  this.state.guesses
                  .sort((g1, g2) => g2.similarity - g1.similarity)
                  .map(guess => (
                    <tr>
                      <td>
                        {
                          guess.value
                          .map((word: string, idx: number) => (
                            <>
                              <span 
                                style={{backgroundColor: 
                                  this.state.currentDefinition.findIndex(w => w === word) === idx
                                    ? 'green'
                                    : this.state.currentDefinition.some(w => w === word) 
                                      ? 'orange'
                                      : 'red'
                              }}>
                                {
                                  this.state.currentDefinition[idx]
                                    .split('')
                                    .map((l,i) => word.split('')[i] || '-')
                                    .join('')
                                }
                              </span>
                              &nbsp;
                            </>
                          ))
                        }
                      </td>
                      <td>{guess.similarity}%</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    )
  };
}

export default App;

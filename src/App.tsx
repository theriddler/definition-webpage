import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Col, Container, Row, Spinner } from 'reactstrap'
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
  originalDefinitionString: string;
  guesses: Guess[];
  spinner: boolean;
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
      originalDefinitionString: '',
      currentWord: '',
      spinner: true
    }
  }

  componentDidMount(): void {
    this.chooseWord('ambidextrous')
    evaluatePhrase(this.state.currentDefinition, this.state.currentDefinition).then(res => this.setState({spinner: false}))
  }

  chooseWord(word: string): void {
    fetch(wordDefinitionOptions(word).url, wordDefinitionOptions(word))
      .then(res => res.json())
      .then(data => this.setState({
        currentWord: word, 
        originalDefinitionString: data[0]['meanings'][0]?.['definitions'][0]['definition'],
        currentDefinition: data[0]['meanings'][0]?.['definitions'][0]['definition']
          .split(' ')
          .map((w: string) => cleanString(w)),
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
    return !this.state.spinner ? (
      <Container className='my-5 text-center'>
        <Row>
          <Col>
            <h1>definition</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Define the word below in the spaces provided
            </p>
          </Col>
        </Row>
        <hr/>
        <Row className='mt-5'>
          <Col>
            <h2 style={{color: 'purple'}}>{this.state.currentWord}</h2>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col className=''>
            <EntryForm
              guesses={this.state.guesses}
              currentDefinition={this.state.currentDefinition}
              originalDefinitionString={this.state.originalDefinitionString}
              setGuessToState={this.setGuessToState.bind(this)}
            />
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col className='d-flex justify-content-center'>
            <table>
              <tbody>
                {
                  this.state.guesses
                  .sort((g1, g2) => g2.similarity - g1.similarity)
                  .map(guess => {
                    let letterCount = -1

                    return (
                      <tr>
                        <td>
                          {
                            guess.value
                            .map((word: string, idx: number) => (
                              <>
                                <span 
                                  style={{backgroundColor: 
                                    this.state.currentDefinition[idx] === word
                                      ? 'green'
                                      : this.state.currentDefinition.some(w => w === word) 
                                        ? 'orange'
                                        : 'red'
                                }}>
                                  {
                                    this.state.currentDefinition[idx]
                                      .split('')
                                      .map((l,i) => {
                                        letterCount++
                                        return word.split('')[i] || '-';
                                      })
                                      .join('')
                                  }
                                </span>
                                {
                                  letterCount++ 
                                  && ['.',',',';'].includes(this.state.originalDefinitionString[letterCount]) 
                                  && this.state.originalDefinitionString.split('')[letterCount++]
                                }
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
          </Col>
        </Row>
      </Container>
    ) : <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'><Spinner/></div>
  };
}

export default App;

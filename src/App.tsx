import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Col, Container, Row, Spinner } from 'reactstrap'
import { EntryForm } from './components/EntryForm';
import { Guess } from './types';
import { evaluatePhrase } from './API';
import { cleanString } from './utils';
import wordDictionary from './wordDictionary.json' 
import { GuessTable } from './components/GuessTable';

interface Props {

}

interface State {
  currentWord?: string;
  currentDefinition?: Lowercase<string>[];
  originalDefinitionString?: string;
  originalDefinitionData?: {results: any};
  guesses: Guess[];
  previousGuess?: Guess;
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
      currentWord: undefined,
      currentDefinition: [],
      originalDefinitionString: undefined,
      originalDefinitionData: undefined,
      guesses: [],
      previousGuess: undefined,
      spinner: true
    }
  }

  componentDidMount(): void {
    // choose a random word
    this.chooseNewWord(wordDictionary[Math.floor(Math.random()*wordDictionary.length)])

    // warm up lambda function
    evaluatePhrase(['x'],['y']).then(res => this.setState({spinner: false}))
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if(prevState.currentDefinition !== this.state.currentDefinition){
      console.log('updated')
    }
  }

  chooseNewWord(word: string): void {
    fetch(wordDefinitionOptions(word).url, wordDefinitionOptions(word))
      .then(res => res.json())
      .then(data => this.setState({
        currentWord: cleanString(word), 
        currentDefinition: data[0]['meanings'][0]?.['definitions'][0]['definition']
          .split(' ')
          .map((w: string) => cleanString(w)),
        originalDefinitionString: data[0]['meanings'][0]?.['definitions'][0]['definition'],
        originalDefinitionData: data
      }, () => console.log(this.state.currentDefinition)))
  }

  addGuessToState(guessArray: string[], similarity: number) {
    this.setState((prevState) => { 
      let guess = {
        'value': guessArray.map((w: string) => cleanString(w)), 
        'similarity': similarity
      }

      return {
        guesses: [...prevState.guesses, guess],
        previousGuess: guess
      }
    })
  }

  render() {
    return !this.state.spinner ? (
      <div>
        <div className='text-center mt-3 mb-2'>
          <h3>definition</h3>
        </div>
        <div className='text-center mb-3'>
          <p>
            Define the word below in the space provided
          </p>
        </div>
        <hr/>
        {/* <div className='pretty-lines'/> */}
        <Container className='my-5 text-center'>
          <Row className='mt-5'>
            <Col>
              <h1>{this.state.currentWord}</h1>
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col>
              <EntryForm
                guesses={this.state.guesses}
                previousGuess={this.state.previousGuess}
                currentDefinition={this.state.currentDefinition}
                originalDefinitionString={this.state.originalDefinitionString}
                addGuessToState={this.addGuessToState.bind(this)}
              />
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col className='d-flex justify-content-center'>
              <GuessTable
                guesses={this.state.guesses}
                currentDefinition={this.state.currentDefinition}
              />
            </Col>
          </Row>
        </Container>
      </div>
    ) : <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'><Spinner/></div>
  };
}

export default App;

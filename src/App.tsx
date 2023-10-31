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
  res: any;
  currentWord: string;
  currentDefinition: Lowercase<string>[];
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
    // choose a random word
    this.chooseNewWord(wordDictionary[Math.floor(Math.random()*wordDictionary.length)])

    // warm up lambda function
    evaluatePhrase(this.state.currentDefinition, this.state.currentDefinition).then(res => this.setState({spinner: false}))
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
        originalDefinitionString: data[0]['meanings'][0]?.['definitions'][0]['definition'],
        currentDefinition: data[0]['meanings'][0]?.['definitions'][0]['definition']
          .split(' ')
          .map((w: string) => cleanString(w)),
      }))
  }

  addGuessToState(guess: string[], similarity: number) {
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
            <h3>definition</h3>
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
            <h1 style={{color: 'purple'}}>{this.state.currentWord}</h1>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col>
            <EntryForm
              guesses={this.state.guesses}
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
    ) : <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'><Spinner/></div>
  };
}

export default App;

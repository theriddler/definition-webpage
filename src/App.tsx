import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { EntryForm } from './components/EntryForm';
import { Guess } from './types';
import { evaluatePhrase, getRandomWord, getWordData } from './API';
import { cleanString } from './utils';
import { GuessTable } from './components/GuessTable';
import { WordDisplay } from './components/WordDisplay';

interface Props {

}

interface State {
  currentWord?: string;
  currentWordData?: {definition: Lowercase<string>[], partOfSpeech?: string, usageExample?: string, synonyms?: string[], antonyms?: string[]}
  guesses: Guess[];
  previousGuess?: Guess;
  spinner: boolean;
  showIntroModal: boolean;
}

class App extends React.Component<Props, State> {

  constructor(p: Props){
    super(p);

    this.state = {
      currentWord: undefined,
      currentWordData: undefined,
      guesses: [],
      previousGuess: undefined,
      spinner: true,
      showIntroModal: true
    }
  }

  componentDidMount(): void {
    // get our word
    this.chooseNewWord()

    // warm up lambda function
    evaluatePhrase(['x'],['y']).then(res => this.setState({spinner: false}))
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if(prevState.currentWordData?.definition !== this.state.currentWordData?.definition){
      console.log('updated')
    }
  }

  async chooseNewWord() {
    let word, definition

    do{
      word = await getRandomWord()
      word = word[0]?.toLowerCase()
      definition = await getWordData(word)
    } while(!definition.entries[0]?.lexemes?.[0]?.senses[0].usageExamples)

    console.log(definition)

    this.setState({
      currentWord: cleanString(word), 
      currentWordData: {
        definition: definition.entries[0].lexemes[0].senses[0].definition.split(' ').map(w => cleanString(w)),
        usageExample: definition.entries[0].lexemes[0].senses[0].usageExamples?.[0].replace('  ',' '),
        partOfSpeech: definition.entries[0].lexemes[0].partOfSpeech,
        synonyms: definition.entries[0].lexemes[0].senses[0].synonyms,
        antonyms: definition.entries[0].lexemes[0].senses[0].antonyms
      }
    })
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
      <div style={{marginBottom: '100px'}}>
        {/* <div className='pretty-lines'/> */}
        <Container className='mt-5 text-center'>
          <Row>
            <Col className='d-flex justify-content-center'>
              <WordDisplay
                word={this.state.currentWord}
                partOfSpeech={this.state.currentWordData?.partOfSpeech}
                usageExample={this.state.currentWordData?.usageExample}
              />
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col>
              <EntryForm
                guesses={this.state.guesses}
                previousGuess={this.state.previousGuess}
                currentDefinition={this.state.currentWordData?.definition}
                addGuessToState={this.addGuessToState.bind(this)}
              />
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col>
              <GuessTable
                guesses={this.state.guesses}
                previousGuess={this.state.previousGuess}
                currentDefinition={this.state.currentWordData?.definition}
              />
            </Col>
          </Row>
        </Container>
        {/* <Modal className='my-auto h-100 d-flex align-items-center justify-content-center' isOpen={this.state.showIntroModal}>
          <ModalBody>
            <div className='d-flex flex-column align-items-center text-center'>
              <div className='mt-3 mb-2'>
                <h3>definition</h3>
              </div>
              <div className='mb-3'>
                <p>
                  Define the word below in the space provided
                </p>
              </div>
              <form>
                <input
                  type='submit'
                  onClick={() => this.setState({showIntroModal: false})}
                />
              </form>
            </div>
          </ModalBody>
        </Modal> */}
      </div>
    ) : <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'><Spinner/></div>
  };
}

export default App;

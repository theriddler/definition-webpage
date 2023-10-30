import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Row } from 'reactstrap'

interface Props {

}

interface State {
  res: any;
  currentWord: string;
  currentDefinition: string;
  guesses: Guess[];
}

interface Guess {
  'value':string;
  'similarity':string;
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
      currentDefinition: '',
      currentWord: ''
    }
  }

  componentDidMount(): void {
    this.chooseWord('ambidextrous')
  }

  chooseWord(word: string): void {
    fetch(wordDefinitionOptions(word).url, wordDefinitionOptions(word))
      .then(res => res.json())
      .then(data => this.setState({
        currentWord: word, 
        currentDefinition: data[0]['meanings'][0]?.['definitions'][0]['definition']
      }, () => console.log(this.state.currentDefinition)))
  }

  evaluatePhrase(guess: string, truth: string): Promise<{similarity: string}> {
    return new Promise((resolve, reject) => {
      fetch('https://tnuv44hsc0.execute-api.us-east-2.amazonaws.com/default/description_engine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase1: guess.toLowerCase(),
          phrase2: truth.toLowerCase(),
        })
      })
      .then(res => res.json())
      .then(res => resolve(res))
      .catch(err => reject(err))
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
            <h5>{this.state.currentWord}</h5>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className=''>
            <form onSubmit={(event) => {event.preventDefault()}}>
              <input 
                id='guess'
                type='text'
              />
              <br/>
              <br/>
              <input
                id='click'
                type='submit'
                onClick={() => {
                  let input = document.getElementById('guess') as HTMLInputElement
                  let guess = input.value
                  
                  this.evaluatePhrase(guess, this.state.currentDefinition)
                  .then(res => this.setState((prevState) => { 
                    return {
                      guesses: [
                        ...prevState.guesses, 
                        {
                          'value': guess.toLowerCase(), 
                          'similarity':res.similarity
                        }
                      ]
                    }
                  }))
                  .catch(err => console.log(err));
                  input.value = ''
                }}
                onSubmit={function(){return false}}
              />
            </form>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className='d-flex justify-content-center'>
            <table>
              <tbody>
                {
                  this.state.guesses
                  .sort((g1, g2) => parseFloat(g2.similarity) - parseFloat(g1.similarity))
                  .map(guess => (
                    <tr>
                      <td>
                        {
                          guess.value
                          .split(' ')
                          .map((word, idx) => (
                            <>
                              <span 
                                style={{backgroundColor: 
                                  !this.state.currentDefinition.split(' ').some(w => w.toLowerCase() === word.toLowerCase()) 
                                  ? 'red'
                                  : this.state.currentDefinition.split(' ').findIndex(w => w.toLowerCase() === word.toLowerCase()) === idx
                                    ? 'green'
                                    : 'yellow'
                              }}>
                                {word}
                              </span>
                              &nbsp;
                            </>
                          ))
                        }
                      </td>
                      <td>{guess.similarity}</td>
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

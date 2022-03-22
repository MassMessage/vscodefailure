import logo from './logo.svg';
import './App.css';

// just this give the error:
// Module not found: Can't resolve 'vscode' 
import { DoTheMagic } from './TextEditor/client';

const Foo = () =>
{
  return <div></div>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;


import './App.css';
import SERVER_PATH from './environment';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>(content)</p>
        <form action={SERVER_PATH + "/addcontent"} method="POST">
          <button type="submit">
            add content
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;

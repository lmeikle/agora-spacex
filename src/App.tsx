import React from 'react';
import './App.css';
import PastLaunches from './past-launches/PastLaunches';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="./logo.png" className="App-logo" alt="logo" />
      </header>
      <main>
        <PastLaunches />
      </main>
    </div>
  );
}

export default App;

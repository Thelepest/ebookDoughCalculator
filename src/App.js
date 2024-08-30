import React from 'react';
import Calculator from './Calculator';
import './App.css';

function App() {
  return (
      <div>
        <header>
          <div>
            <img src="/assets/pic.jpg" alt="Baking" />
          </div>
        </header>
        <main>
          <Calculator />
        </main>
      </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import Nystrum from './nystrum/Nystrum';
import OverflowToggle from './AppComponents/OverflowToggle';

function App() {
  return (
    <div className="App">
      <Nystrum />
      <OverflowToggle />
    </div>
  );
}

export default App;

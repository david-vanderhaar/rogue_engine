import React from 'react';
import './App.css';
import Nystrum from './nystrum/Nystrum';
import OverflowToggle from './AppComponents/OverflowToggle';
import SoundControl from './AppComponents/SoundControl';

function App() {
  return (
    <div className="App">
      <Nystrum />
      <OverflowToggle />&nbsp;&nbsp;&nbsp;
      <SoundControl />
    </div>
  );
}

export default App;

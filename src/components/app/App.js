import React, {useState} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css'
import Earth from '../earth'

function App() {

  const [viewdate, setViewdate] = useState(new Date())

  return (
    <div className="App">
      <Earth viewdate={viewdate}/>
    </div>
  );
}

export default App;

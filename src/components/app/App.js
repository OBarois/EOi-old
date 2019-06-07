import React, {useState} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager.container'

function App() {

  const [viewdate, setViewdate] = useState(new Date())

  const changeDate = (newdate) => {
    console.log('Date changed to: ' +newdate)
    setViewdate(newdate)
  }
  

  return (
    <div className="App">
      <Earth viewdate={viewdate}/>
      <DateManager viewdate={viewdate}  searching='true' onDateChange={ changeDate}/>
    </div>
  );
}

export default App;

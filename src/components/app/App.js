import React, {useState, useEffect} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager.container'
import { useHotkeys } from 'react-hotkeys-hook'

function App() {

    const [viewdate, setViewdate] = useState(new Date())
    const [startdate, setStartdate] = useState(new Date())

    
    const incrementDate = () => {
      console.log(' increment date')
      let _date = new Date(startdate.getTime()+1000*60*60*24)
      setStartdate(_date )
    }
    useHotkeys("t",incrementDate)  

    const changeDate = (newdate) => {
        // console.log('Date increment: ' +newdate)
        setViewdate(newdate)
    }
    // const handleClick = () => {
    //     let newdate =  new Date(viewdate.getTime()+1000*60*60*24)
    //     console.log('Change startdate: '+newdate.toJSON())
    //     // setViewdate(newdate)
    //     setStartdate(newdate)
    // }

    useEffect(() => {
      console.log('Initial viewdate: '+viewdate.toJSON())
  },[])
      
  useEffect(() => {
    console.log('startdate changed to: '+startdate.toJSON())
  },[startdate])
    


    return (
        <div className="App">
            <Earth viewdate={viewdate}/>
            <DateManager startdate={startdate}  searching='true' onDateChange={changeDate} />
        </div>
    )
}

export default App;

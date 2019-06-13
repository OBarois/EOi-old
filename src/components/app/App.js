import React, {useState, useEffect, useRef} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager.container'
import { useHotkeys } from 'react-hotkeys-hook'

function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, setStartdate] = useState(initdate)
    const [searching, setSearching] = useState(false)

    const changeDate = (newdate) => {
        // console.log('App changeDate callback: ' + newdate.toJSON())
        setViewdate(newdate)
    }

    useEffect(() => {
        // console.log('Initial viewdate: '+viewdate.toJSON())
    },[])
      
    useEffect(() => {
        // console.log('startdate changed to: '+startdate.toJSON())
    },[startdate])
    


    return (
        <div className="App">
            <Earth viewdate={viewdate}/>
            <DateManager startdate={startdate}  searching={searching} onDateChange={changeDate} />
        </div>
    )
}

export default App;

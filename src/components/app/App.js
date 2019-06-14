import React, {useState, useEffect} from 'react';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager.container'

function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, ] = useState(initdate)
    const [searching, ] = useState(false)

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

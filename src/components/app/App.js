import React, {useState, useEffect} from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager.container'

function App() {

    const [viewdate, setViewdate] = useState(new Date())
    const [startdate, setStartdate] = useState(viewdate)
    


    const changeDate = (newdate) => {
        // console.log('Date increment: ' +newdate)
        setViewdate(newdate)
    }
    const handleClick = () => {
        console.log('Change startdate:')
        setStartdate(new Date(viewdate.getTime()+1000*60*60))
    }

    useEffect(() => {
        console.log('Initial viewdate: '+viewdate.toJSON())
    },[])
        


    return (
        <div className="App">
            <Earth viewdate={viewdate} onclick={handleClick}/>
            <DateManager startdate={startdate} viewdate={viewdate} searching='true' onDateChange={changeDate} />
        </div>
    )
}

export default App;

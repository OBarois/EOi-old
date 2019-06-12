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
    const [counting, setCounting] = useState(false)

    const refcounter = useRef()
    const refdatecount = useRef()
    
    const togglecounter = () => {
        console.log('counter: '+counting)
        if(!counting) {
            refdatecount.current = new Date(viewdate.getTime())
            refcounter.current = setInterval( () => {
                console.log(refdatecount.current.toJSON())
                let _newdate = new Date(refdatecount.current.getTime()+100000)
                setStartdate(_newdate )  
                refdatecount.current = _newdate
            }, 100)
            setCounting(true)
  
        } else {
            clearInterval(refcounter.current)
            setCounting(false)
        }
    }
    useHotkeys("t",togglecounter)  

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
            <DateManager startdate={startdate}  searching={searching} onDateChange={changeDate} />
        </div>
    )
}

export default App;

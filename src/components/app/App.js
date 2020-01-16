import React, {useState, useEffect, useRef} from 'react';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel";
import MissionSelector from "../missionselector";

// import useToggle from 'react-use/lib/useToggle'
import Fullscreen from "react-full-screen"
import { useFullscreen } from '@straw-hat/react-fullscreen'


function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, ] = useState(initdate)
    const [searching, ] = useState(false)
    const [collection, setCollection] = useState('S1')

    const changeDate = (newdate) => {
        // console.log('App changeDate callback: ' + newdate.toJSON())
        setViewdate(newdate)
    }

    const changeCollection = (mission) => {
        console.log('new collection: ' + mission)
        setCollection(mission)
    }

    useEffect(() => {
        // console.log('Initial viewdate: '+viewdate.toJSON())
    },[])
      
    useEffect(() => {
        // console.log('startdate changed to: '+startdate.toJSON())
    },[startdate])
    
    const [isFull,setIsfull] = useState(false)
    const { isFullscreen, toggleFullscreen } = useFullscreen(window.document.body);
    useHotkeys("f",toggleFullscreen) 


    return (
        <div className="App" >
            <Fullscreen enabled={isFull} onChange={() =>  {if(!isFullscreen) setIsfull(false)} }>
                <div className="Earth">
                    <Earth viewdate={viewdate} id="globe" starfield="true" atmosphere='true' clon='0.5' clat='40' names='true'/>
                </div>
                <DateManager startdate={startdate}  searching={searching} onDateChange={changeDate} />
                <ControlPanel active="true">
                    <MissionSelector  onMissionChange={changeCollection}></MissionSelector>
                </ControlPanel>
            </Fullscreen>
        </div>
    )
}

export default App;

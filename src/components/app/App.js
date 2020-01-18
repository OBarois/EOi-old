import React, {useState, useEffect, useRef} from 'react';
import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel";
import MissionSelector from "../missionselector";
import MapSelector from "../mapselector";

// import useToggle from 'react-use/lib/useToggle'
import Fullscreen from "react-full-screen"
import { useFullscreen } from '@straw-hat/react-fullscreen'


function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, ] = useState(initdate)
    const [searching, ] = useState(false)
    const [collection, setCollection] = useState('S1')
    const [starfield, setStarfield] = useState(true)
    const [atmosphere, setAtmosphere] = useState(true)
    const [names, setNames] = useState(true)

    const changeDate = (newdate) => {
        // console.log('App changeDate callback: ' + newdate.toJSON())
        setViewdate(newdate)
    }


    const changeCollection = (mission) => {
        console.log('new collection: ' + mission)
        setCollection(mission)
    }

    const toggleStarfield = () => {
        console.log('Starfield')
        setStarfield(!starfield)
    }

    const toggleAtmosphere = () => {
        console.log('atmosphere')
        setAtmosphere(!atmosphere)
    }

    const toggleNames = () => {
        console.log('atmosphere')
        setNames(!names)
    }

      
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
                    <Earth viewdate={viewdate} id="globe" starfield={starfield} atmosphere={atmosphere} names={names}  clon='0.5' clat='40' />
                </div>
                <DateManager startdate={startdate}  searching={searching} onDateChange={changeDate} />
                <ControlPanel active="true">
                <MissionSelector  onMissionChange={changeCollection}></MissionSelector>
                <MapSelector  toggleStarfield={toggleStarfield} toggleNames={toggleNames} toggleAtmosphere={toggleAtmosphere}></MapSelector>
                </ControlPanel>
                <div className='MissionLabel'>{collection}</div>
            </Fullscreen>
        </div>
    )
}

export default App;

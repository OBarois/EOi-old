import React, {useState, useEffect, useRef} from 'react';
import { useGlobal } from 'reactn';

import './App.css'
import Earth from '../earth'
import DateManager from '../datemanager'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel";
import C_MissionSelector from "../../containers/MissionSelectorContainer";
import C_MapSelector from "../../containers/MapSelectorContainer";

// import useToggle from 'react-use/lib/useToggle'
import Fullscreen from "react-full-screen"
import { useFullscreen } from '@straw-hat/react-fullscreen'


function App() {
    
    let initdate = new Date()
    const [viewdate, setViewdate] = useState(initdate)
    const [startdate, ] = useState(initdate)
    const [searching, setSearching] = useState(false)
    // const [collection, setCollection] = useState('S1')

    const [ mission,  ] = useGlobal('mission');
    const [ mapSettings, ] = useGlobal('mapSettings')

    const changeDate = (newdate) => {
        // console.log('App changeDate callback: ' + newdate.toJSON())
        setViewdate(newdate)
    }

    const finalChangeDate = (date) => {
        console.log('Final Date: ' + date.toJSON())
        // setSearching(true)
    }



      
    // useEffect(() => {
    //     // console.log('startdate changed to: '+startdate.toJSON())
    // },[startdate])
    
    const [isFull,setIsfull] = useState(false)
    const { isFullscreen, toggleFullscreen } = useFullscreen(window.document.body);
    useHotkeys("f",toggleFullscreen) 


    return (
        <div className="App" >
            <Fullscreen enabled={isFull} onChange={() =>  {if(!isFullscreen) setIsfull(false)} }>
                <div className="Earth">
                    <Earth viewdate={viewdate} id="globe" starfield={mapSettings.starfield} atmosphere={mapSettings.atmosphere} names={mapSettings.names} background={mapSettings.background} clon='0.5' clat='40' />
                </div>
                <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/>
                <ControlPanel active="true">
                    <C_MissionSelector></C_MissionSelector>
                    <C_MapSelector ></C_MapSelector>
                </ControlPanel>
                <div className='MissionLabel'>{mission}</div>
            </Fullscreen>
        </div>
    )
}

export default App;

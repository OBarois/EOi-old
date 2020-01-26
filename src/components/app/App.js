import React, {useState, useEffect, useRef} from 'react';
import { useGlobal } from 'reactn';

import './App.css'
import Earth from '../earth'
// import DateManager from '../datemanager'
import { useHotkeys } from 'react-hotkeys-hook'
import ControlPanel from "../controlpanel";
import CDateManager from "../../containers/DateManagerContainer";
import CDateController from "../../containers/DateControllerContainer";

import CMissionSelector from "../../containers/MissionSelectorContainer";
import CMapSelector from "../../containers/MapSelectorContainer";

// import useToggle from 'react-use/lib/useToggle'
import Fullscreen from "react-full-screen"
import { useFullscreen } from '@straw-hat/react-fullscreen'


function App() {
    

    const [ mission,  ] = useGlobal('mission');
    const [ mapSettings, ] = useGlobal('mapSettings')
    const [ viewDate,  ] = useGlobal('viewDate');
    const [ searchDate,  ] = useGlobal('searchDate');
  


    // useEffect(() => {
    //     console.log('View Date: '+viewDate.toJSON())
    //     // setselectorStartdate(startdate)
    // },[viewDate])


      
    useEffect(() => {
        console.log('Search Date: '+searchDate.toJSON())
    },[searchDate])
    
    const [isFull,setIsfull] = useState(false)
    const { isFullscreen, toggleFullscreen } = useFullscreen(window.document.body);
    useHotkeys("f",toggleFullscreen) 


    return (
        <div className="App" >
            <Fullscreen enabled={isFull} onChange={() =>  {if(!isFullscreen) setIsfull(false)} }>
                <div className="Earth">
                    <Earth viewdate={viewDate} id="globe" starfield={mapSettings.starfield} atmosphere={mapSettings.atmosphere} names={mapSettings.names}  clon='0.5' clat='40' />
                </div>
                {/* <DateManager startdate={startdate} onDateChange={changeDate} onFinalDateChange={finalChangeDate} animated={searching}/> */}
                <CDateManager/>
                <CDateController/>
                <ControlPanel active="true">
                <CMissionSelector></CMissionSelector>
                <CMapSelector ></CMapSelector>
                </ControlPanel>
                <div className='MissionLabel'>{mission}</div>
            </Fullscreen>
        </div>
    )
}

export default App;

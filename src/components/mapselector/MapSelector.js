import React, { useState, useEffect } from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import './MapSelector.css'


// should use a prop

function MapSelector({toggleAtmosphere, toggleStarfield, toggleNames}) {


    // const [map, setMap] = useState({starfield: true, names: true, atmosphere: true})
    
    // useHotkeys("1",()=>{setMission('S1')}) 
    // useHotkeys("2",()=>{setMission('S2')}) 
    // useHotkeys("3",()=>{setMission('S3')}) 
    // useHotkeys("5",()=>{setMission('S5P')}) 
    // useHotkeys("6",()=>{setMission('ENVISAT')})

    // useEffect(() => {
    //     console.log('Map changed to: '+ map)
    //     onMapChange(map)
    // }, [map]);
    
    
    //console.log('mission rendering')
    return (
        <div className='MapSelector'>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/atmosphere.png' alt='' onClick={toggleAtmosphere} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/starfield.png' alt='' onClick={toggleStarfield} /></div>
            <div className='CircleButton'><img className='MapIcon' draggable="false" src='./images/names.png' alt='' onClick={toggleNames} /></div>
           
        </div>
    )
}

export default MapSelector;

import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'






function Earth({ viewdate, id, clat, clon, alt, starfield, atmosphere, names }) {

    const {
        ewwstate,
        addGeojson,
        removeGeojson,
        addWMS,
        toggleProjection,
        toggleAtmosphere,
        toggleStarfield,
        toggleNames,
        toggleBg,
        setTime,
        northUp
    } = useEww({
        id: id,
        clat: clat,
        clon: clon,
        alt: alt,
        starfield: starfield,
        atmosphere: atmosphere,
        names: names
    })

    useHotkeys("p",toggleProjection)  
    useHotkeys("a",toggleAtmosphere)  
    useHotkeys("s",toggleStarfield)  
    useHotkeys("n",toggleNames)  
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",toggleBg)

    useEffect(() => {
        setTime(viewdate.getTime())
    },[viewdate])



    let globeStyle = {
        background: 'inherit',
        position: "fixed",
        left: 0,
        width: '100%',
        height: '100%'
    };
        
    return (
            <canvas id={id} style={globeStyle} />
    );
}

export default Earth

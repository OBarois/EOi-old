import React, { useEffect} from 'react'
import './Earth.css'
import { useEww } from "./useEww"
import { useHotkeys } from 'react-hotkeys-hook'






const Earth = ({ viewdate, id, clat, clon, alt, starfield, atmosphere, names }) =>  {
console.log("render Earth")

    const {
        ewwstate,
        addGeojson,
        removeGeojson,
        addWMS,
        toggleProjection,
        setAtmosphere,
        setStarfield,
        setNames,
        toggleBg,
        toggleModel,
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
    useHotkeys("c",removeGeojson)
    useHotkeys("u",northUp)
    useHotkeys("b",toggleBg)
    useHotkeys("m",toggleModel)

    useEffect(() => {
        setTime(viewdate.getTime())
    },[viewdate, setTime])

    useEffect(() => {
        setStarfield(starfield)
    },[starfield])

    useEffect(() => {
        setNames(names)
    },[names])

    useEffect(() => {
        setAtmosphere(atmosphere)
    },[atmosphere])



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

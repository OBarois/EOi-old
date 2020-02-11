import React, {  useGlobal } from 'reactn';

import MapSelector from "../components/mapselector"

function CMapSelector() {

    // const [starfield, setStarfield] = useGlobal('starfield')
    // const [atmosphere, setAtmosphere] = useGlobal('atmosphere')
    // const [names, setNames] = useGlobal('names')

    const [, setMapSettings] = useGlobal('mapSettings')

    return (
        <MapSelector onMapSettingsChange={setMapSettings}></MapSelector> 
     )
}

export default CMapSelector;

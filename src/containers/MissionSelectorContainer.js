import React, {  useGlobal } from 'reactn';

import MissionSelector from "../components/missionselector"

function CMissionSelector() {

    const [mission, setMission] = useGlobal('mission')

    return (
        <MissionSelector initialmission={mission} onMissionChange={setMission}></MissionSelector> 
     )
}

export default CMissionSelector;

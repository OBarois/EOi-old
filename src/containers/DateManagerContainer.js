
import React, {  useGlobal, useState, useEffect } from 'reactn';

import DateManager from "../components/datemanager"

function CDateManager() {

    const [viewDate, setViewDate] = useGlobal('viewDate')
    const [searchDate, setSearchDate] = useGlobal('searchDate')
    const [searching, setSearching] = useGlobal('searching')
    const [increment, ] = useGlobal('increment')
    const [incrementSpeed, ] = useGlobal('incrementSpeed')
    const [dateManagerDate, setDdateManagerDate] = useGlobal('dateManagerDate')


    return (
        <DateManager startdate={dateManagerDate} increment={increment} incrementSpeed={incrementSpeed} onDateChange={setViewDate} onFinalDateChange={setSearchDate} animated={searching}/>
     )
}

export default CDateManager;


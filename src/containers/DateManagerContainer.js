
import React, {  useGlobal, useState, useEffect } from 'reactn';

import DateManager from "../components/datemanager"

function CDateManager() {

    const [viewDate, setViewDate] = useGlobal('viewDate')
    const [searchDate, setSearchDate] = useGlobal('searchDate')
    const [searching, setSearching] = useGlobal('searching')
    const [dateManagerDate, setDdateManagerDate] = useGlobal('dateManagerDate')


    return (
        <DateManager startdate={dateManagerDate} onDateChange={setViewDate} onFinalDateChange={setSearchDate} animated={searching}/>
     )
}

export default CDateManager;


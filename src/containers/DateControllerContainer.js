
import React, {  useGlobal, useState, useEffect } from 'reactn';

import DateController from "../components/datecontroller"

function CDateController() {

    const [viewDate, setViewDate] = useGlobal('viewDate')
    const [dateManagerDate, setDateManagerDate] = useGlobal('dateManagerDate')
    const [searchDate, setSearchDate] = useGlobal('searchDate')
    const [searching, setSearching] = useGlobal('searching')

    const [dateControllerDate, setDateControllerDate] = useState(searchDate)

    useEffect(() => {
        console.log("initdate changed: "+searchDate.toJSON())
        setDateControllerDate(searchDate)
    },[searchDate]);

    const handleControllerDateChange = (date) => {
        setDateManagerDate(date)
        // setDateControllerDate(date)
    }


    return (
        <DateController initdate={dateControllerDate} onDateChange={handleControllerDateChange}/>
     )
}

export default CDateController;


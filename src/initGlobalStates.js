import { setGlobal } from 'reactn';


export  function initGlobalStates() {
    console.log("init global: "+(new Date()).getTime())

    // Set current time as global state
    // setGlobal({appdate: ((new Date()).getTime())})
    // setGlobal({searchepoch: ((new Date()).getTime())})
    // setGlobal({mission: 'S1'})
    // setGlobal({searching: false})
    // setGlobal({apppolygon: ''})
    // setGlobal({replace: true})
    // setGlobal({startend: {start:0, end:0}})
    // setGlobal({setApppickeditems: []})


    setGlobal({
        mission: 'S1',
        mapSettings: {
            atmosphere: true,
            starfield: true,
            names: true
        },
        viewDate: new Date(),
        searchDate: new Date(),
        controllerDate: new Date(),
        dateManagerDate: new Date(),
        incrementSpeed: 1,
        increment: false
    })
    
}
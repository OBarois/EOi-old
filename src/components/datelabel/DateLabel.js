import React from 'react';
import dateFormat from "dateformat"
import './DateLabel.css';

function DateLabel({viewdate, highlight, searching}) {

    const handleClick = () => {

    }

    return (
        <div className='LabelContainer' >
            <div className='Date'>
                <div className={highlight==='day' || highlight==='none'?'DayLabel':'DayLabel Greyedout'}  key='day'  >{dateFormat(viewdate,'UTC:dd')}</div>
                <div className='YearMonth'>
                    <div className={highlight==='month' || highlight==='none'?'MonthLabel ':'MonthLabel  Greyedout'}  key='month' >{dateFormat(viewdate,'UTC:mmm').toUpperCase()}</div>
                    <div className={highlight==='year' || highlight==='none'?'YearLabel ':'YearLabel Greyedout'}  key='year' >{viewdate.getUTCFullYear()}</div>
                </div>
            </div>
            <div className={searching?'Line  Line-active':'Line'} key='line' ></div>
            <div className={highlight==='time' || highlight==='none'?'TimeLabel ':'TimeLabel Greyedout'} key='time' >{dateFormat(viewdate,'UTC:HH:MM:ss')}</div>
        </div>
    )
}
export default DateLabel

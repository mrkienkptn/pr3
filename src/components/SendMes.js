import React from 'react';
import './Message.css'
const SendMes = (props) => {
    let {content} = props
    return (
        <div className="msg-box" >
            <div className="msg-right">
                <div></div>
                <div className="text-content">
                    <p>{content}</p>
                </div>
            </div>
        </div>
    )
}

export default SendMes;

import React from 'react';
import './Message.css'
const SendMesGroup = (props) => {
    return (
        <div className="msg-box" >
            <div className="msg-right">
                <div></div>
                <div className="text-content">
                    <p>{props.content}</p>
                </div>
            </div>
        </div>
    )
}

export default SendMesGroup;

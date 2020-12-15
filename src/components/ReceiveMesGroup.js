import React from 'react';
import './Message.css'
const ReceiveMesMesGroup = (props) => {
    let { content } = props
    return (
        <div className="msg-box" >
            <div className="msg-left">                
                <div className="text-content">
                    <p><span className="font-weight-bold text-dark">{props.name} : </span>{content}</p>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default ReceiveMesMesGroup;

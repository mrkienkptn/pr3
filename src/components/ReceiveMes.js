import React from 'react';
import './Message.css'
const ReceiveMes = (props) => {
    let { content } = props
    return (
        <div className="msg-box" >
            <div className="msg-left">                
                <div className="text-content">
                    <p>{content}</p>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default ReceiveMes;

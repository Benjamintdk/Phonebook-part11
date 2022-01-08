import React from 'react'

const Notification = ({ message }) => {
    if (message === null) return null
    if (message.type === "success") {
        return (
            <div className="success">
                {message.notif}
            </div>
        )
    }
    else {
        return (
            <div className="error">
                {message.notif}
            </div>
        )
    }
}

export default Notification
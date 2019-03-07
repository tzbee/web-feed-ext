import './NewItemCounter.scss';
import * as React from 'react';

export default ({ counter, markAsRead }) => {
    const handleMarkAsRead = e => {
        e.stopPropagation();
        markAsRead && markAsRead();
    };

    const counterDisplay = ((counter && counter > 0) ? `${counter} ` : '') + 'NEW';

    return <div className='NewItemNotification' onClick={handleMarkAsRead}>
                <div className='NewItemNotification-count NewItemNotification-elt'>
                    {counterDisplay}
                </div>
                <a className='NewItemNotification-markAsReadBtn NewItemNotification-elt' href='#'>
                </a>
            </div>;
};
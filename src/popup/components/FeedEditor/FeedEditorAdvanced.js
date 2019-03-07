import './FeedEditor.scss';

import * as React from 'react';
import QueryEditor from '../QueryEditor/QueryEditor';

export default ({ feed, setEditedFeed }) => {
    const {
        id,
        query,
        updateTimer,
        dataFields,
    } = feed;

    const handleUpdateTimerChange = e => {
        const newUpdateTimer = parseInt(e.target.value);

        if (!isNaN(newUpdateTimer)) {
            setEditedFeed(Object.assign({}, feed, { updateTimer: newUpdateTimer }));
        }
    };

    return <div className='FeedEditor FeedEditorAdvanced'>
		<h3>updateTimer Timer(ms)</h3>

		<input 
			type='text' 
			value={updateTimer}
			onChange={handleUpdateTimerChange}
			placeholder='Update Timer'
		/>

		<h3>Banned items</h3>
		<div className='FeedEditor-bannedItems'>
			{feed &&  feed.bannedIDs && feed.bannedIDs.join(', ')}
		</div>
    </div>;
};
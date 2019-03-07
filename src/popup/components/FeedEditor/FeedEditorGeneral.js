import './FeedEditor.scss';

import * as React from 'react';

export default ({ feed, setEditedFeed }) => {
    if (!feed) return (<div className='FeedEditor'>Wrong feed id</div>);

    const {
        title,
        description
    } = feed;

    setEditedFeed = setEditedFeed || (() => {});

    const handleTitleChange = e => {
        setEditedFeed(Object.assign({}, feed, { title: e.target.value }));
    };

    const handleDescriptionChange = e => {
        setEditedFeed(Object.assign({}, feed, { description: e.target.value }));
    };

    return <div className='FeedEditor FeedEditorGeneral'>
                <div className='FeedEditor-title FeedEditor-prop'>
                    <h3>Title</h3>
                    <input value={title} onChange={handleTitleChange} placeholder='Title' />
                </div>

                <div className='FeedEditor-desc FeedEditor-prop'>
                    <h3>Description</h3>
                    <textarea rows='3' value={description} onChange={handleDescriptionChange} placeholder='Description' />
                </div>
            </div>;
};
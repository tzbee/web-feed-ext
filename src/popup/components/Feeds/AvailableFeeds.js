import './AvailableFeeds.scss';

import * as React from 'react';

import Feeds from './Feeds';

export default ({ feeds: { availableFeeds, inFollowedFeeds }, unfollowFeed, followFeed, ...others }) => {

    const createdFeeds = availableFeeds.map(feed => {
        return Object.assign({}, feed, { title: feed.parser.title, description: feed.parser.description });
    });

    return <div className='AvailableFeeds'>
		<Feeds feeds={createdFeeds} followFeed={followFeed}/>
		<h3>Available in followed</h3>
		<Feeds feeds={inFollowedFeeds} {...others}/>
	</div>;
};
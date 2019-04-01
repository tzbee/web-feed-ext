import * as React from 'react';

import FeedItems from './FeedItems';
import SearchBar from '../SearchBar/SearchBar';

export default ({ filterValue, onFilterChange, ...feedItemsProps }) => {
	return (
		<div className="FeedItemsTab">
			<SearchBar filterValue={filterValue} onChange={onFilterChange} />
			<FeedItems {...feedItemsProps} />
		</div>
	);
};

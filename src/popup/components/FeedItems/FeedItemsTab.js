import * as React from 'react';

import FeedItems from './FeedItems';
import FilterBar from '../FilterBar/FilterBar';

export default ({ filterValue, onFilterChange, ...feedItemsProps }) => {
	return (
		<div className="FeedItemsTab">
			<FilterBar filterValue={filterValue} onChange={onFilterChange} />
			<FeedItems {...feedItemsProps} />
		</div>
	);
};

import * as React from 'react';
import './SearchBar.scss';

export default ({ filterValue, onChange }) => {
	const handleFilterChange = e => {
		e.stopPropagation();
		onChange(e.target.value);
	};

	return (
		<div className="SearchBar">
			<input
				type="text"
				value={filterValue}
				onChange={handleFilterChange}
				placeholder="Search"
			/>
		</div>
	);
};

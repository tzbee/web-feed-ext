import * as React from 'react';

export default ({ filterValue, onChange }) => {
	const handleFilterChange = e => {
		e.stopPropagation();
		onChange(e.target.value);
	};

	return (
		<div className="FilterBar">
			<input
				type="text"
				value={filterValue}
				onChange={handleFilterChange}
				placeholder="Filter items"
			/>
		</div>
	);
};

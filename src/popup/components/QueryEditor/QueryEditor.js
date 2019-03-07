import './QueryEditor.scss';

import * as React from 'react';
import QueryBuilder from 'react-querybuilder';

const operators = [
    { name: '=', label: '=' },
    { name: '<', label: '<' },
    { name: '>', label: '>' },
    { name: 'contains', label: 'Contains' },
    { name: 'notContains', label: 'NotContains' },
];

const QueryEditor = ({ id, query, dataFields, onQueryChange }) => {
    const handleQueryChange = onQueryChange || (() => null);
    const normalizedQuery = (query && Object.keys(query).length > 0) ? query : null;

    return <div className='QueryEditor'>
                <QueryBuilder 
                    key={'q-'+id}
                    fields={dataFields} 
                    operators={operators} 
                    query={normalizedQuery} 
                    onQueryChange={handleQueryChange} 
                />
            </div>;
};

export default QueryEditor;
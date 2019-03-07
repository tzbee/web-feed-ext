const URLEditor = ({ urls, onURLsChange }) => {

    urls = urls || [];

    const handleRemoveClick = url => {
        const urlMap = urls.reduce((urlMap, url) => (urlMap[url] = true) && urlMap, {});
        delete urlMap[url];
        onURLsChange(Object.keys(urlMap));
    };

    const handleURLChange = (oldURL, newURL) => {
        const urlMap = urls.reduce((urlMap, url) => (urlMap[url] = true) && urlMap, {});
        delete urlMap[oldURL];
        urlMap[newURL] = true;
        onURLsChange(Object.keys(urlMap));
    };

    const handleAddURL = () => {
        if (urls.indexOf('') === -1) {
            onURLsChange(urls.concat(''));
        }
    };

    return <ul className='URLEditor'>
                {
                    urls.map(url=><URLEditorItem 
                                        key={'uei-'+url}
                                        url={url} 
                                        onRemoveClick={handleRemoveClick}
                                        onURLChange={handleURLChange} 
                            />)
                }
                <div className='FeedEditor-add'>
                    <button onClick={handleAddURL}>Add</button>
                </div>
            </ul>;
};

const URLEditorItem = ({ url, onRemoveClick, onURLChange }) => {

    const handleURLChange = e => {
        e.preventDefault();
        const newURL = e.target.value;
        onURLChange(url, newURL);
    };

    const handleRemoveClick = () => onRemoveClick(url);

    return <li className='FeedEditor-url'>
                <input value={url} onChange={handleURLChange} placeholder='URL' />
                <button onClick={handleRemoveClick}>X</button>
            </li>;
};
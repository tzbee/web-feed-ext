import * as React from 'react';

export default ({ options, setOptions }) => {
    const handleSetValue = (key, value) => {
        const newOptions = options.map(option => option.key === key ? ({ key, value }) : option);
        setOptions(newOptions);
    };
    return <div className='CommandOptions'>
    		{options && options.map(option=>{
    			return <CommandOption key={'co-'+option.key} optKey={option.key} value={option.value} setValue={handleSetValue}/>;	
    		})}
    	</div>;
};

const CommandOption = ({ optKey, value, setValue }) => {
    const handleValueChanged = e => {
        setValue && setValue(optKey, e.target.value);
    };
    return <div className='CommandOption'>
    	<label>
    		{optKey}
    		<input type='text' value={value} onChange={handleValueChanged}/>
    	</label>
    </div>;
};
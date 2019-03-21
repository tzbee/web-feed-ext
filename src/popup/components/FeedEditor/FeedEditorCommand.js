import './FeedEditor.scss';

import * as React from 'react';
import QueryEditor from '../QueryEditor/QueryEditor';

export default ({ feed = {}, commandIDs, setEditedFeed }) => {
    const { id, commandID, args } = feed;

    const handleCommandSelectionChange = commandID => {
        setEditedFeed(Object.assign({}, feed, { commandID }));
    };

    const handleArgsChange = args => {
        setEditedFeed(Object.assign({}, feed, { args }));
    };

    return (
        <div className="FeedEditor FeedEditorCommand">
            <div className="FeedEditor-pluginID FeedEditor-prop">
                <h3>Commands</h3>
                <CommandSelection
                    commandIDs={commandIDs}
                    selectedCommand={commandID}
                    selectCommand={handleCommandSelectionChange}
                />
            </div>
            <div className="FeedEditor-prop">
                <CommandArgs id={id} args={args} onChange={handleArgsChange} />
            </div>
        </div>
    );
};

const CommandSelection = ({ commandIDs, selectedCommand, selectCommand }) => {
    const handleSelectionChange = e => {
        selectCommand(e.target.value);
    };

    return (
        <div className="CommandSelection">
            {commandIDs && commandIDs.length > 0 ? (
                <select
                    value={selectedCommand}
                    onChange={handleSelectionChange}
                >
                    {commandIDs &&
                        commandIDs.map(commandID => (
                            <CommandSelectionItem
                                key={'c-' + commandID}
                                commandID={commandID}
                            />
                        ))}
                </select>
            ) : null}
        </div>
    );
};

const CommandSelectionItem = ({ commandID }) => {
    return <option value={commandID}>{commandID}</option>;
};

const CommandArgs = ({ id, args = [], onChange }) => {
    const handleArgChange = newArg => {
        onChange(args.map(arg => (arg.key === newArg.key ? newArg : arg)));
    };

    return (
        <div className="CommandArgs">
            {args &&
                args.map &&
                args.map(arg => (
                    <CommandArgItem
                        id={id}
                        key={arg.key}
                        arg={arg}
                        onChange={handleArgChange}
                    />
                ))}
        </div>
    );
};

const CommandArgItem = ({ id, arg, onChange }) => {
    const { key, value, title, type, values } = arg;
    const valueID = 'cai-' + key + '-' + id;

    const handleArgChange = newValue => {
        onChange && onChange(Object.assign({}, arg, { value: newValue }));
    };

    return (
        <div className="CommandArgItem">
            <label htmlFor={id}>
                <h3>{title}</h3>
                <CommandArgValue
                    id={valueID}
                    type={type}
                    value={value}
                    values={values}
                    onChange={handleArgChange}
                />
            </label>
        </div>
    );
};

const CommandArgValue = ({ id, type, value, onChange, values }) => {
    const typeMap = {
        Array: <ListInput onChange={onChange} value={value} />,
        Selection: (
            <SelectionInput
                onChange={onChange}
                selectedValues={value}
                selectOptions={values}
            />
        ),
        Query: (
            <QueryEditor
                id={id}
                query={value}
                dataFields={values}
                onQueryChange={onChange}
            />
        )
    };

    return (
        typeMap[type] || <TextInput id={id} onChange={onChange} value={value} />
    );
};

const TextInput = ({ id, value, onChange }) => {
    const handleInputChange = e => onChange(e.target.value);
    return (
        <div className="TextInput">
            <input
                id={id || null}
                type="text"
                value={value}
                onChange={handleInputChange}
            />
        </div>
    );
};

const ListInput = ({ id, value, onChange }) => {
    const handleListChange = (index, newValue) => {
        const listCopy = value.slice();
        listCopy[index] = newValue;
        onChange(listCopy);
    };

    const addItem = () => {
        const listCopy = value.slice();
        listCopy.push('');
        onChange(listCopy);
    };

    const removeItem = index => {
        const listCopy = value.slice();
        listCopy.splice(index, 1);
        onChange(listCopy);
    };

    if (!value || value.constructor.name !== 'Array') {
        value = [''];
    }

    return (
        <ul id={id} className="ListInput">
            {value &&
                value.map((item, i) => {
                    return (
                        <li className="ListInput-item" key={'lii-' + i}>
                            <TextInput
                                id={'li-' + i}
                                value={item}
                                onChange={newValue =>
                                    handleListChange(i, newValue)
                                }
                            />
                            <button type="button" onClick={() => removeItem(i)}>
                                X
                            </button>
                        </li>
                    );
                })}
            <button type="button" onClick={addItem}>
                Add
            </button>
        </ul>
    );
};

const SelectionInput = ({ id, selectedValues, selectOptions, onChange }) => {
    const handleSelectionChange = e => {
        const id = e.target.value;
        const newSelectedValue = e.target.checked;

        selectedValues = selectedValues || [];

        const oldSelectedValuesMap = selectedValues.reduce(
            (map, value) => (map[value] = true) && map,
            {}
        );

        if (newSelectedValue) {
            oldSelectedValuesMap[id] = true;
        } else {
            delete oldSelectedValuesMap[id];
        }

        onChange(Object.keys(oldSelectedValuesMap));
    };

    return (
        <div className="SelectionInput">
            {selectOptions.map(({ id, label }) => {
                const selected = selectedValues.indexOf(id) !== -1;
                return (
                    <label htmlFor={'arg-select-' + id}>
                        {label}
                        <input
                            id={'arg-select-' + id}
                            type="checkBox"
                            value={id}
                            checked={selected}
                            onChange={handleSelectionChange}
                        />
                    </label>
                );
            })}
        </div>
    );
};

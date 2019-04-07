import * as React from 'react';

export default ({ tabs, selectedTabID, selectTab, classMap = {} }) => {
    const {
        tabNav: tabNavClasses = '',
        tabNavItem: TabNavItemClasses = ''
    } = classMap;

    return (
        <ul className={`TabNav ${tabNavClasses}`}>
            {tabs.map((tab, i) => (
                <TabNavItem
                    key={tab.id}
                    navItem={tab}
                    selected={selectedTabID === tab.id}
                    first={i === 0}
                    last={i === tabs.length - 1}
                    selectNavItem={selectTab}
                    classNames={TabNavItemClasses}
                />
            ))}
        </ul>
    );
};

const TabNavItem = ({
    navItem: { id, title },
    selected,
    selectNavItem,
    first,
    last,
    classNames = ''
}) => {
    const positionClass = first
        ? 'TabNavItem-left'
        : last
        ? 'TabNavItem-right'
        : '';
    const selectedClass = selected ? 'TabNavItem-selected' : '';

    const handleNavItemClick = () => selectNavItem && selectNavItem(id);

    return (
        <li
            className={`TabNavItem ${positionClass} ${selectedClass} vertical-centered-container ${classNames}`}
            onClick={handleNavItemClick}
        >
            <span
                href="#"
                className="TabNavItem-text vertical-centered-content"
            >
                {title}
            </span>
        </li>
    );
};

import * as React from 'react';
import TabNav from './TabNav';

import './Tabs.scss';

const DEFAULT_CLASS_MAP = {
    main: '',
    tabNav: '',
    tabNavItem: '',
    tab: ''
};

const Tab = ({ active, children, classNames = '' }) => {
    const activeClass = active ? 'Tab-active' : 'Tab-inactive';
    return <div className={`Tab ${activeClass} ${classNames}`}>{children}</div>;
};

export default ({
    tabs,
    selectedTabID,
    children,
    selectTabID,
    classMap = DEFAULT_CLASS_MAP
}) => {
    const renderTabContent = (classNames = '') => {
        return React.Children.map(children, (child, i) => {
            const { id, data } = tabs[i];
            return (
                <Tab active={id === selectedTabID} classNames={classNames}>
                    {React.cloneElement(child, { ...data })}
                </Tab>
            );
        });
    };

    // Only the tabs with a title are navigable
    const navigableTabs = tabs.filter(tab => 'title' in tab);

    const {
        main: mainClasses = '',
        tabNav,
        tabNavItem = '',
        tab: tabClasses = ''
    } = classMap;

    return (
        <div className={`TabPanel ${mainClasses}`}>
            <div className="TabPanel-tabNav">
                <TabNav
                    tabs={navigableTabs}
                    selectedTabID={selectedTabID}
                    selectTab={selectTabID}
                    classMap={{ tabNav, tabNavItem }}
                />
            </div>
            <div className="TabPanel-midBanner" />
            <div className="TabPanel-content">
                {renderTabContent(tabClasses)}
            </div>
        </div>
    );
};

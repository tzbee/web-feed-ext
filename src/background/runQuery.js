import log from './log';

/*
    Run a serializable query on feed items data
    Returns a filtered copy of the feed items 
*/

module.exports = (query, feedItems) => {
    if (!query) {
        log('No query to run');
        return feedItems;
    }

    log(`Running query on ${feedItems.length} items`);
    const filterFn = createFilterFn(query);
    return feedItems.filter(({ data }) => filterFn(data));
};

/*
    === Query props ===

    {Query}
        {RuleGroup}
    {RuleGroup}
        combinator: <string> enum [and, or]
        rules: {Array} of {RuleNode}
    {RuleNode}
        {Rule} | {RuleGroup}
    {Rule}
        field: <string> enum from the parser's data fields
        operator: <string> enum [<, >, =]
        value: <string>
*/

function createFilterFn(queryData) {
    return parseRuleGroup(queryData);
}

function isRule(ruleNode) {
    return 'field' in ruleNode && 'operator' in ruleNode && 'value' in ruleNode;
}

function isRuleGroup(ruleNode) {
    return 'combinator' in ruleNode && 'rules' in ruleNode;
}

function getCombinatorNeutralFn(combinator) {
    switch (combinator) {
        case 'and':
            return () => true;
        case 'or':
            return () => false;
    }
}

function parseRuleGroup(ruleGroup) {
    const { combinator, rules } = ruleGroup;
    if (!rules || rules.length === 0) return () => true;
    const combinatorFn = createCombinatorFn(combinator);
    const neutralFn = getCombinatorNeutralFn(combinator);

    return rules.reduce((filterFn, ruleNode) => {
        return obj => combinatorFn(filterFn(obj), parseRuleNode(ruleNode)(obj));
    }, neutralFn);
}

function parseRuleNode(ruleNode) {
    if (isRule(ruleNode)) {
        return parseRule(ruleNode);
    } else if (isRuleGroup(ruleNode)) {
        return parseRuleGroup(ruleNode);
    } else {
        throw new Error(`Wrong argument ${ruleNode}`);
    }
}

function parseRule(rule) {
    const { field, operator, value } = rule;
    const operatorFn = createOperatorFn(operator);
    return obj => {
        if (!(field in obj)) return false;
        const objPropValue = obj[field];
        return operatorFn(objPropValue, value);
    };
}

function createCombinatorFn(combinator) {
    switch (combinator) {
        case 'and':
            return (arg1, arg2) => arg1 && arg2;
        case 'or':
            return (arg1, arg2) => arg1 || arg2;
    }
}

function createOperatorFn(operator) {
    switch (operator) {
        case '<':
            return (arg1, arg2) => arg1 < arg2;
        case '=':
            return (arg1, arg2) => equalityFn(arg1, arg2);
        case '!=':
            return (arg1, arg2) => arg1 !== arg2;
        case '>':
            return (arg1, arg2) => arg1 > arg2;
        case 'contains':
            return (arg1, arg2) => new RegExp(arg2, 'i').test(arg1);
        case 'notContains':
            return (arg1, arg2) => !new RegExp(arg2, 'i').test(arg1);
        default:
            return (arg1, arg2) => arg1 === arg2;
    }
}

function equalityFn(arg1, arg2) {
    if (isBoolean(arg1)) {
        arg1 = booleanToString(arg1);
    }
    if (isBoolean(arg2)) {
        arg2 = booleanToString(arg2);
    }

    return arg1 === arg2;
}

function isBoolean(arg) {
    return typeof arg === 'boolean';
}

function booleanToString(b) {
    const map = { true: 'true', false: 'false' };
    return map[b];
}
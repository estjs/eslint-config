import order from './rules/order';
import configsRecommended from './configs/recommended';
import orderAttributify from './rules/order-attributify';
import enforcesShorthand from './rules/enforces-shorthand';
import noArbitraryValue from './rules/no-arbitrary-value';

export default {
  rules: {
    order,
    'order-attributify': orderAttributify,
    'enforces-shorthand': enforcesShorthand,
    'no-arbitrary-value': noArbitraryValue,
  },
  configs: {
    recommended: configsRecommended,
  },
};

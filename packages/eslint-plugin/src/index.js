import order from './rules/order';
import configsRecommended from './configs/recommended';
import orderAttributify from './rules/order-attributify';
import enforcesShorthand from './rules/enforces-shorthand';
import noArbitraryValue from './rules/no-arbitrary-value';
import horthand from './rules/shorthand';

export default {
  rules: {
    order,
    'order-attributify': orderAttributify,
    'shorthand': horthand,
  },
  configs: {
    recommended: configsRecommended,
  },
};

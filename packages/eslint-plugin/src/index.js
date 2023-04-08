import order from './rules/order';
import configsRecommended from './configs/recommended';
import orderAttributify from './rules/order-attributify';
import shorthand from './rules/shorthand';
import unocssShort from './rules/unocss-short';

export default {
  rules: {
    order,
    'order-attributify': orderAttributify,
    'shorthand': shorthand,
    'unocss-short': unocssShort
  },
  configs: {
    recommended: configsRecommended,
  },
};

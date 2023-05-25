import order from './rules/order';
import configsRecommended from './configs/recommended';
import orderAttributify from './rules/orderAttributify';
import shorthand from './rules/shorthand';
import unocssShorthand from './rules/unocssShorthand';

export default {
  rules: {
    order,
    'order-attributify': orderAttributify,
    'shorthand': shorthand,
    'unocss-shorthand': unocssShorthand
  },
  configs: {
    recommended: configsRecommended,
  },
};

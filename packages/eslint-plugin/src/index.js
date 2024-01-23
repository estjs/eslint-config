import configsRecommended from './configs/recommended';
import AtomicOrder from './rules/atomic-order';
import Shorthand from './rules/atomic-shorthand';

export default {
	rules: {
		'atomic-order': AtomicOrder,
		'atomic-shorthand': Shorthand,
	},
	configs: {
		recommended: configsRecommended,
	},
};

import configsRecommended from './configs/recommended';
import AtomicOrder from './rules/atomic-order';
import Shorthand from './rules/atomic-shorthand';

// import UnocssShorthand from './rules/unocss-shorthand';
// import UnocssOrder from './rules/unocss-order';

export default {
	rules: {
		// 'unocss-order': UnocssOrder,
		'atomic-order': AtomicOrder,
		'atomic-shorthand': Shorthand,
		// 'unocss-shorthand': UnocssShorthand,
	},
	configs: {
		recommended: configsRecommended,
	},
};

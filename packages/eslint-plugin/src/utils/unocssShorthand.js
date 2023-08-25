import { runAsWorker } from 'synckit';
import { collapseVariantGroup } from '@unocss/core';

// 支持简写的 token
const shortTokens = [
	'dark:',
	'flex-',
	'grid-',
	'text-',
	'bg-',
	'border-',
	'ring-',
	'm',
	'p',
	'b-',
	'rd-',
	'rounded-',
];

runAsWorker(async classList => {
	// 用于存储已使用过的类名
	const used = [];
	// 用于存储未使用过的类名
	const unused = [];
	// 用于存储生成的类名
	const generated = [];

	for (const className of classList) {
		// 如果已经使用过这个类名，则跳过
		if (used.includes(className)) {
			continue;
		}

		// 初始化 token 为空字符串
		let token = '';
		// 检查是否是支持的简写 token
		const isShortToken = shortTokens.some(i => {
			if (className.startsWith(i)) {
				// 如果是简写 token，则设置 token 并返回 true
				token = i;
				return true;
			}
			return false;
		});

		if (isShortToken) {
			// 找出与当前类名具有相同 token 前缀的类名
			const equalClasses = classList.filter(i => i.startsWith(token) && i !== className);

			if (equalClasses.length) {
				// 将当前类名标记为已使用
				used.push(className);
				// 将当前类名添加到相同 token 的类名列表中
				equalClasses.push(className);
				// 将相同 token 的所有类名标记为已使用
				equalClasses.forEach(equalClass => used.push(equalClass));
				// 将相同 token 的类名组合并生成优化后的类名
				const generatedClass = collapseVariantGroup(equalClasses.join(' '), [token]);

				// 将生成的类名添加到生成列表中
				generated.push(generatedClass);
			} else {
				// 如果没有相同 token 的类名，则将当前类名标记为未使用
				unused.push(className);
			}
		} else {
			// 如果不是简写 token，则将当前类名标记为未使用
			unused.push(className);
		}
	}

	// 返回未使用、已使用和生成的类名列表
	return {
		unused,
		used,
		generated,
	};
});

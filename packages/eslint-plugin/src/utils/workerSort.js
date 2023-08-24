import { loadConfig } from '@unocss/config';
import { collapseVariantGroup, createGenerator, notNull, parseVariantGroup } from '@unocss/core';
import { runAsWorker } from 'synckit';

let promise = null;

// 异步函数，用于获取 Unocss 生成器
async function getGenerator() {
	if (!promise) {
		const { config } = await loadConfig();
		promise = createGenerator(config);
	}
	return promise;
}

// 运行 worker，处理类名
runAsWorker(async classes => {
	const uno = await getGenerator();
	return await sortRules(classes, uno);
});

// 排序规则
async function sortRules(rules, uno) {
	const unknown = []; // 存储未知的规则（无法解析的类名）

	if (!uno.config.details) {
		uno.config.details = true;
	}
	const expandedResult = parseVariantGroup(rules); // 解析和展开规则
	rules = expandedResult.expanded;

	const result = await Promise.all(
		rules.split(/\s+/g).map(async i => {
			const token = await uno.parseToken(i); // 解析类名为 token
			if (token == null) {
				unknown.push(i);
				return undefined;
			}
			// 计算变体处理程序权重
			const variantRank = (token[0][5]?.variantHandlers?.length || 0) * 100_000;
			const order = token[0][0] + variantRank;
			return [order, i];
		}),
	);

	const sorted = result
		.filter(element => notNull(element))
		.sort((a, b) => {
			let result = a[0] - b[0];
			if (result === 0) {
				result = a[1].localeCompare(b[1]);
			}
			return result;
		})
		.map(i => i[1])
		.join(' ');

	let combined = sorted;

	if (expandedResult?.prefixes.length) {
		combined = collapseVariantGroup(sorted, expandedResult.prefixes);
	}

	return [...unknown, combined].join(' ').trim();
}

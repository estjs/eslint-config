import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';
import { runAsWorker } from 'synckit';
import customUnoConfig from "../../unocss.config"

/**
 * TODO:
 *    合并 shortcuts 配置的css属性到short
 * 		自动把和theme相同的值，使用theme的值
 * 		更多
 */
// 有效的方向值
const dirVal = ['x', 'y', 'a'];

// 方向值到对应方向的映射
const dirMap = {
	x: ['l', 'r'],
	y: ['t', 'b'],
	a: ['x', 'y'],
};

// 函数：检查两个方向是否可以合并成一个方向
function isDirection(dir1, dir2) {
	for (const dir of dirVal) {
		if (dirMap[dir].includes(dir1) && dirMap[dir].includes(dir2)) {
			return dir;
		}
	}
	return null;
}

// 异步
async function getGenerator() {
	const { config } = await loadConfig();
	return createGenerator(config || customUnoConfig);
}

// 初始化一个 Promise 用于保存生成器
let promise;

// 异步函数：使用 UNO CSS 解析token
async function parseToken(token) {
	promise = promise || getGenerator();
	const uno = await promise;
	const parser = await uno.parseToken(token);
	return parser;
}

// 主要处理函数
const fn = async classList => {
	// 用于匹配类名的正则表达式
	const reg = /^((m|p)-?)?([blrtxy])(?:-?(-?.+))?$/;
	const borderReg = /^((border|b|rounded|rd)-?)?([blrtxy])(?:-(.+))?$/;

	// 函数：根据给定的类名获取适当的正则表达式
	const getReg = async className => {
		const isBorder = className.startsWith('b') || className.startsWith('r');

		const regv = isBorder ? borderReg : reg;
		const parser = await parseToken(className);
		return {
			test: regv.test(className) && parser,
			match: className.match(regv),
		};
	};

	// 用于存储已使用和生成的类名的数组
	const used = [];
	const generated = [];

	// 遍历类名列表
	for (let i = 0; i < classList.length; i++) {
		const className1 = classList[i];
		const { test, match } = await getReg(className1);

		// 检查类名是否匹配正则表达式，并且之前没有被使用过
		if (test && !used.includes(className1)) {
			const [, prefix1, , dir1, val1] = match;

			// 遍历剩余的类名以查找匹配项
			for (let j = i + 1; j < classList.length; j++) {
				const className2 = classList[j];
				const { test: test2, match: match2 } = await getReg(className2);

				// 检查第二个类名是否匹配正则表达式，并且不同于第一个类名
				if (test2 && className1 !== className2) {
					const [, prefix2, , dir2, val2] = match2;

					// 检查前缀和值是否匹配
					if (prefix1 === prefix2 && val1 === val2) {
						const combinedDir = isDirection(dir1, dir2);

						// 如果方向可以合并，生成一个新的类名
						if (combinedDir) {
							used.push(className2, className1);
							const fixedClassName = `${prefix1}${combinedDir}-${val1}`;
							generated.push(fixedClassName);
						}
					}
				}
			}
		}
	}

	// 过滤出未使用的类名
	const unused = classList.filter(i => !used.includes(i));

	return {
		unused,
		used,
		generated,
	};
};

runAsWorker(fn);
// 只是为了测试
export default fn;

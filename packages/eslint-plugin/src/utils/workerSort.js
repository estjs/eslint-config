import { runAsWorker } from 'synckit';
import { sanitizeNode, stripString } from './utils';
import orderList from './orderConfig.json';

// 边缘情况映射
const edgeCaseMap = {
	border: '(border-width)',
	outline: '(outline-style)',
	ring: '(ring-width)',
	shadow: '(box-shadow)',
};

// 特殊情况映射
const specialCaseMap = {
	'flex': '(flex-width)',
	'decoration': '(text-decoration-thickness)',
	'font': '(font-weight)',
	'bg': {
		img: '(bg-image)',
		color: '(bg-color)',
	},
	'border': '(border-width)',
	'text': '(font-size)',
	'outline': {
		width: '(outline-width)',
		color: '(outline-color)',
	},
	'ring': '(ring-width)',
	'ring-offset': '(ring-offset-width)',
	'stroke': {
		width: '(stroke-width)',
		color: '(stroke-color)',
	},
	'shadow': {
		width: '(box-shadow)',
		color: '(box-shadow-color)',
	},
	'max': '(max-width)',
	'supports': '(supports)',
	'aria': '(aria)',
	'data': '(data)',
};

// 检查立即边缘情况
function checkImmediateEdgeCases(className) {
	return edgeCaseMap[className] !== undefined
		? orderList.priority.findIndex(elem => elem.includes(edgeCaseMap[className]))
		: null;
}

// 清理任意内容
function cleanArbitraryContent(className) {
	if (className.includes('[') && className.includes(']')) {
		return className.replace(/\[.*]/, '[value]');
	}
	return className;
}

// 查找原子类
function findAtomicClass(className) {
	const regex = new RegExp(`((?!-)( |^))${className}(($| )(?!-))`, 'gm');
	return orderList.priority.findIndex(elem => regex.test(elem));
}

// 移除修饰符
function removeModifier(className) {
	if (new RegExp(/^-.*/).test(className)) {
		className = className.substr(1);
	}
	return className.replace('!', '');
}

// 检查边缘情况
function checkEdgeCases(className) {
	const edgeCase = specialCaseMap[className];
	if (edgeCase !== undefined) {
		if (typeof edgeCase === 'string') {
			return orderList.priority.findIndex(elem => elem.includes(edgeCase));
		} else if (typeof edgeCase === 'object') {
			for (const key in edgeCase) {
				if (className.includes(key)) {
					return orderList.priority.findIndex(elem => elem.includes(edgeCase[key]));
				}
			}
		}
	}

	return null;
}

// 获取类优先级
function getClassPriority(className, iteration = 0) {
	if (iteration === 0) {
		const immediateEdgeCase = checkImmediateEdgeCases(className);
		if (immediateEdgeCase !== null) {
			return immediateEdgeCase;
		}

		className = cleanArbitraryContent(className);

		if (className.includes(':')) {
			return getPrefixClassPriority(className);
		}

		className = removeModifier(className);
	}

	const classPrio = findAtomicClass(className);
	if (classPrio !== -1) {
		return classPrio;
	}

	if (iteration === 0) {
		const edgeCase = checkEdgeCases(className);
		if (edgeCase !== null) {
			return edgeCase;
		}
	}

	const strippedClassName = stripString(className, '-');
	if (strippedClassName === null) {
		return orderList.priority.indexOf('(predefined)');
	}
	return getClassPriority(strippedClassName, iteration + 1);
}

// 获取前缀类优先级
function getPrefixClassPriority(className) {
	const splitClassName = className.split(':');
	const amountPrio = splitClassName.length - 1;

	return (
		getClassPriority(splitClassName[0]) +
		amountPrio / 100 +
		getClassPriority(splitClassName[splitClassName.length - 1]) / 100000
	);
}

// 排序函数
export function order(classNames) {
	classNames = sanitizeNode(classNames);

	const sortedClassNames = Array.from(classNames).sort((a, b) => {
		const aPrio = getClassPriority(a);
		const bPrio = getClassPriority(b);
		if (aPrio < bPrio) {
			return -1;
		}
		if (aPrio > bPrio) {
			return 1;
		}
		return 0;
	});

	return {
		isSorted: sortedClassNames.join(' ') === classNames.join(' '),
		orderedClassNames: sortedClassNames,
	};
}

// 运行 worker 处理类名
runAsWorker(async classes => {
	return await order(classes);
});

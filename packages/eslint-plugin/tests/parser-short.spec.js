import { describe, expect, it } from 'vitest';
import parseShort from '../src/utils/parserShorthand';

describe('parse class with shorthand', () => {
	it('should work with margin shorthand', async () => {
		const classX = [ 'm-l-10px', 'm-r-10px' ];
		const classY = [ 'm-t-10px', 'm-b-10px' ];
		const classA = [ 'm-x-10px', 'm-y-10px' ];

		const resultX = await parseShort(classX);
		const resultY = await parseShort(classY);
		const resultA = await parseShort(classA);

		console.log(resultX.unused);

		expect(resultX.generated).toMatchInlineSnapshot([ 'm-x-10px' ])
		expect(resultY.generated).toMatchInlineSnapshot([ 'm-y-10px' ])
		expect(resultA.generated).toMatchInlineSnapshot([ 'm-a-10px' ])

		expect(resultX.unused).toMatchInlineSnapshot([ 'm-x-10px' ])
		expect(resultY.unused).toMatchInlineSnapshot([ 'm-y-10px' ])
		expect(resultA.unused).toMatchInlineSnapshot([ 'm-a-10px' ])

	});

	it('should work with padding shorthand', async () => {
		const classX = [ 'p-l-10px', 'p-r-10px' ];
		const classY = [ 'p-t-10px', 'p-b-10px' ];
		const classA = [ 'p-x-10px', 'p-y-10px' ];

		const resultX = await parseShort(classX);
		const resultY = await parseShort(classY);
		const resultA = await parseShort(classA);

		expect(resultX.generated).toMatchInlineSnapshot([ 'p-x-10px' ])
		expect(resultY.generated).toMatchInlineSnapshot([ 'p-y-10px' ])
		expect(resultA.generated).toMatchInlineSnapshot([ 'p-a-10px' ])

		expect(resultX.unused).toMatchInlineSnapshot([ 'm-x-10px' ])
		expect(resultY.unused).toMatchInlineSnapshot([ 'm-y-10px' ])
		expect(resultA.unused).toMatchInlineSnapshot([ 'm-a-10px' ])
	});
	it('should work with border shorthand', async () => {
		const classX = [ 'b-l-10px', 'b-r-10px' ];
		const classY = [ 'b-t-10px', 'b-b-10px' ];
		const classA = [ 'b-x-10px', 'b-y-10px' ];

		const resultX = await parseShort(classX);
		const resultY = await parseShort(classY);
		const resultA = await parseShort(classA);

		expect(resultX.generated).toMatchInlineSnapshot([ "b-x-10px" ])
		expect(resultY.generated).toMatchInlineSnapshot([ 'b-y-10px' ])
		expect(resultA.generated).toMatchInlineSnapshot([ 'b-a-10px' ])

		expect(resultX.unused).toMatchInlineSnapshot([ 'm-x-10px' ])
		expect(resultY.unused).toMatchInlineSnapshot([ 'm-y-10px' ])
		expect(resultA.unused).toMatchInlineSnapshot([ 'm-a-10px' ])
	});

});

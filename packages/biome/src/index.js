import { Biome, Distribution } from '@biomejs/js-api';

const biome = await Biome.create({
	distribution: Distribution.NODE, // Or BUNDLER / WEB depending on the distribution package you've installed
});

const formatted = biome.formatContent('function f   (a, b) { return a == b; }', {
	filePath: 'example.js',
});

console.log('Formatted content: ', formatted.content);

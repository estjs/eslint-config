import removeDuplicatesFromArray from '../removeDuplicatesFromArray';

// Units
export const fontUnits = ['cap', 'ch', 'em', 'ex', 'ic', 'lh', 'rem', 'rlh'];
export const viewportUnits = ['vb', 'vh', 'vi', 'vw', 'vmin', 'vmax'];
export const absoluteUnits = ['px', 'mm', 'cm', 'in', 'pt', 'pc'];
export const perInchUnits = ['lin', 'pt', 'mm'];
export const otherUnits = ['%'];
export const mergedUnits = removeDuplicatesFromArray([
  ...fontUnits,
  ...viewportUnits,
  ...absoluteUnits,
  ...perInchUnits,
  ...otherUnits,
]);
export const selectedUnits = mergedUnits.filter((el) => {
  return !['cap', 'ic', 'vb', 'vi'].includes(el);
});

export const absoluteValues = ['0', 'xx\\-small', 'x\\-small', 'small', 'medium', 'large', 'x\\-large', 'xx\\-large'];
export const relativeValues = ['larger', 'smaller'];
export const globalValues = ['inherit', 'initial', 'unset'];
export const mergedValues = [...absoluteValues, ...relativeValues, ...globalValues];
export const mergedLengthValues = [`\\-?\\d*\\.?\\d*(${mergedUnits.join('|')})`, ...mergedValues];
mergedLengthValues.push('length\\:var\\(\\-\\-[a-z\\-]{1,}\\)');

export const mergedUnitsRegEx = `\\[(\\d{1,}(\\.\\d{1,})?|(\\.\\d{1,})?)(${mergedUnits.join('|')})\\]`;

export const selectedUnitsRegEx = `\\[(\\d{1,}(\\.\\d{1,})?|(\\.\\d{1,})?)(${selectedUnits.join('|')})\\]`;
export const anyCalcRegEx = '\\[calc\\(.{1,}\\)\\]';

// Ambiguous values
// ================
// Supported hints: length, color, angle, list
// -------------------------------------------
// border-[color/width]
// text-[color/size]
// ring-[color/width]
// ring-offset-[color/width]
// stroke-[current/width]
// bg-[color/(position/size)]
//
// font-[family/weight]

import { mergedAngleValues } from './constants/angle';
import { mergedColorValues, RGBAPercentages, optionalColorPrefixedVar, notHSLAPlusWildcard, mandatoryColorPrefixed } from './constants/color';
import { anyCalcRegEx, mergedUnitsRegEx, selectedUnits, selectedUnitsRegEx } from './constants/length';

/**
 * Escape special chars for regular expressions
 *
 * @param {String} str Regular expression to be escaped
 * @returns {String} Escaped version
 */
export function escapeSpecialChars(str) {
  return str.replaceAll(/\W/g, '\\$&');
}

/**
 * Generates the opacity suffix based on config
 *
 * @param {Object} config Tailwind CSS Config
 * @returns {String} The suffix or an empty string
 */
export function generateOptionalOpacitySuffix(config) {
  const opacityKeys = !config.theme['opacity'] ? [] : Object.keys(config.theme['opacity']);
  opacityKeys.push('\\[(\\d*\\.?\\d*)%?\\]');
  return `(\\/(${opacityKeys.join('|')}))?`;
}

/**
 * Generate the possible options for the RegEx
 *
 * @param {String} propName The name of the prop e.g. textColor
 * @param {Array} keys Keys to be injected in the options
 * @param {Object} config Tailwind CSS Config
 * @param {Boolean} isNegative If the value is negative
 * @returns {String} Generated part of regex exposing the possible values
 */
export function generateOptions(propName, keys, config) {
  const opacitySuffixes = generateOptionalOpacitySuffix(config);
  const genericArbitraryOption = '\\[(.*)\\]';
  const defaultKeyIndex = keys.indexOf('DEFAULT');
  if (defaultKeyIndex > -1) {
    keys.splice(defaultKeyIndex, 1);
  }
  const escapedKeys = keys.map(k => escapeSpecialChars(k));
  if (propName === 'dark') {
    // Optional `dark` class
    if (config.darkMode === 'class') {
      return 'dark';
    } else if (Array.isArray(config.darkMode) && config.darkMode.length === 2 && config.darkMode[0] === 'class') {
      // https://tailwindcss.com/docs/dark-mode#customizing-the-class-name
      // For the sake of simplicity we only support a single class name
      let value = '';
      const res = /^\.(?<classnameValue>[\w:[\]\-]*)$/gi.exec(config.darkMode[1]);
      if (res && res.groups && res.groups.classnameValue) {
        value = res.groups.classnameValue;
      }
      return value;
    } else {
      return '';
    }
  } else if (propName === 'arbitraryProperties') {
    escapedKeys.push(genericArbitraryOption);
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'accentColor' || propName === 'backgroundColor' || propName === 'borderColor' || propName === 'boxShadowColor' || propName === 'caretColor' || propName === 'divideColor' || propName === 'fill' || propName === 'outlineColor' || propName === 'ringColor' || propName === 'ringOffsetColor' || propName === 'textColor' || propName === 'textDecorationColor' || propName === 'stroke' || propName === 'gradientColorStops') {
    {
      // Colors can use segments like 'indigo' and 'indigo-light'
      // https://tailwindcss.com/docs/customizing-colors#color-object-syntax
      const options = [];
      keys.forEach((k) => {
        const color = config.theme[propName][k] || config.theme.colors[k];
        if (typeof color === 'string') {
          options.push(escapeSpecialChars(k) + opacitySuffixes);
        } else {
          const variants = Object.keys(color).map(colorKey => escapeSpecialChars(colorKey));
          const defaultIndex = variants.indexOf('DEFAULT');
          const hasDefault = defaultIndex > -1;
          if (hasDefault) {
            variants.splice(defaultIndex, 1);
          }
          options.push(k + '(\\-(' + variants.join('|') + '))' + (hasDefault ? '?' : '') + opacitySuffixes);
        }
      });
      const arbitraryColors = [...mergedColorValues];
      switch (propName) {
        case 'fill':
          // Forbidden prefixes
          arbitraryColors.push('(?!(angle|length|list)\:).{1,}');
          break;
        case 'gradientColorStops':
          arbitraryColors.push(RGBAPercentages, optionalColorPrefixedVar, notHSLAPlusWildcard);
          break;
        case 'textColor':
          arbitraryColors.push(RGBAPercentages, mandatoryColorPrefixed);
          break;
        default:
          arbitraryColors.push(mandatoryColorPrefixed);
      }
      options.push(`\\[(${arbitraryColors.join('|')})\\]`);
      return '(' + options.join('|') + ')';
    }
  } else if (propName === 'borderSpacing' || propName === 'borderWidth' || propName === 'divideWidth' || propName === 'fontSize' || propName === 'outlineWidth' || propName === 'outlineOffset' || propName === 'ringWidth' || propName === 'ringOffsetWidth' || propName === 'textUnderlineOffset') {
    escapedKeys.push(selectedUnitsRegEx, anyCalcRegEx, '\\[length\\:.{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'strokeWidth') {
    escapedKeys.push(selectedUnitsRegEx, anyCalcRegEx, '\\[length\\:calc\\(.{1,}\\)\\]', `\\[length\\:(.{1,})(${selectedUnits.join('|')})?\\]`);
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'gap' || propName === 'height' || propName === 'lineHeight' || propName === 'maxHeight' || propName === 'maxWidth' || propName === 'minHeight' || propName === 'minWidth' || propName === 'padding' || propName === 'width' || propName === 'blur' || propName === 'brightness' || propName === 'contrast' || propName === 'grayscale' || propName === 'invert' || propName === 'saturate' || propName === 'sepia' || propName === 'backdropBlur' || propName === 'backdropBrightness' || propName === 'backdropContrast' || propName === 'backdropGrayscale' || propName === 'backdropInvert' || propName === 'backdropOpacity' || propName === 'backdropSaturate' || propName === 'backdropSepia' || propName === 'transitionDuration' || propName === 'transitionTimingFunction' || propName === 'transitionDelay' || propName === 'animation' || propName === 'transformOrigin' || propName === 'scale' || propName === 'cursor' || propName === 'backdropHueRotate' || propName === 'hueRotate' || propName === 'inset' || propName === 'letterSpacing' || propName === 'margin' || propName === 'scrollMargin' || propName === 'skew' || propName === 'space' || propName === 'textIndent' || propName === 'translate') { // All units
    escapedKeys.push(mergedUnitsRegEx, '\\[(?!(angle|color|length|list)\:).{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'backgroundOpacity' || propName === 'borderOpacity' || propName === 'opacity' || propName === 'ringOpacity') { // 0 ... .5 ... 1
    escapedKeys.push('\\[(0(\\.\\d{1,})?|\\.\\d{1,}|1)\\]', anyCalcRegEx, '\\[var\\(\\-\\-[A-Za-z\\-]{1,}\\)\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'rotate') {
    escapedKeys.push(`\\[(${mergedAngleValues.join('|')})\\]`);
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'gridTemplateColumns' || propName === 'gridColumn' || propName === 'gridColumnStart' || propName === 'gridColumnEnd' || propName === 'gridTemplateRows' || propName === 'gridRow' || propName === 'gridRowStart' || propName === 'gridRowEnd' || propName === 'gridAutoColumns' || propName === 'gridAutoRows') { // Forbidden prefixes
    escapedKeys.push('\\[(?!(angle|color|length)\:).{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'listStyleType') { // Forbidden prefixes
    escapedKeys.push('\\[(?!(angle|color|length|list)\:).{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'objectPosition') { // Forbidden prefixes
    escapedKeys.push('\\[(?!(angle|color|length)\:).{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'backgroundPosition' || propName === 'boxShadow' || propName === 'dropShadow' || propName === 'transitionProperty') { // Forbidden prefixes
    escapedKeys.push('\\[(?!((angle|color|length|list)\:)|var\\().{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'backgroundSize') { // Forbidden prefixes
    escapedKeys.push('\\[length\:.{1,}\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'backgroundImage') { // Forbidden prefixes
    escapedKeys.push('\\[url\\(.{1,}\\)\\]');
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'order' || propName === 'zIndex') {
    escapedKeys.push(genericArbitraryOption);
    return '(' + escapedKeys.join('|') + ')';
  } else if (propName === 'fontWeight' || propName === 'typography' || propName === 'lineClamp') { // Cannot be arbitrary?
    return '(' + escapedKeys.join('|') + ')';
  } else {
    escapedKeys.push(genericArbitraryOption);
    return '(' + escapedKeys.join('|') + ')';
  }
}

const cachedRegexes = new WeakMap();

/**
 * Customize the regex based on config
 *
 * @param {String} re Regular expression
 * @param {Object} config The merged Tailwind CSS config
 * @returns {String} Patched version with config values and additional parameters
 */
export function patchRegex(re, config) {
  if (!cachedRegexes.has(config)) {
    cachedRegexes.set(config, {});
  }
  const cache = cachedRegexes.get(config);
  if (re in cache) {
    return cache[re];
  }
  let patched = '\\!?';
  // Prefix
  if (config.prefix.length) {
    patched += escapeSpecialChars(config.prefix);
  }
  // Props
  let replaced = re;
  const propsRe = /\${(-?[a-z]*)}/gi;
  const res = replaced.matchAll(propsRe);
  const resArray = [...res];
  const props = resArray.map(arr => arr[1]);
  if (props.length === 0) {
    return (cache[re] = `${patched}(${replaced})`);
  }
  // e.g. backgroundColor, letterSpacing, -margin...
  props.forEach((prop) => {
    const token = new RegExp('\\$\\{' + prop + '\\}');
    const isNegative = prop.slice(0, 1) === '-';
    const absoluteProp = isNegative ? prop.slice(1) : prop;
    if (prop === 'dark') {
      // Special case, not a default property from the theme
      replaced = replaced.replace(token, generateOptions(absoluteProp, [], config, isNegative));
      return `${patched}(${replaced})`;
    } else if (prop === 'arbitraryProperties') {
      // Special case
      replaced = replaced.replace(
        new RegExp('\\$\\{' + absoluteProp + '\\}'),
        generateOptions(absoluteProp, [], config, isNegative)
      );
      return `${patched}(${replaced})`;
    } else if (!config.theme || !config.theme[absoluteProp]) {
      // prop not found in config
      return;
    }
    // Normal scenario
    const keys = Object.keys(config.theme[absoluteProp])
      .filter((key) => {
        if (isNegative) {
          // Negative prop cannot support NaN values and inherits positive values
          const val = config.theme[absoluteProp][key];
          const isCalc = typeof val === 'string' && val.indexOf('calc') === 0;
          const num = Number.parseFloat(val);
          if (isCalc) {
            return true;
          }
          if (Number.isNaN(num)) {
            return false;
          }
        } else if (key[0] === '-') {
          // Positive prop cannot use key starting with '-'
          return false;
        }
        return true;
      })
      .map((key) => {
        if (isNegative && key[0] === '-') {
          return key.slice(1);
        }
        return key;
      });
    if (keys.length === 0 || replaced.match(token) === null) {
      // empty array
      return;
    }
    const opts = generateOptions(absoluteProp, keys, config, isNegative);
    replaced = replaced.replace(token, opts);
  });
  return (cache[re] = `${patched}(${replaced})`);
}

/**
 * Generates a flatten array from the groups config
 *
 * @param {Array} groupsConfig The array of objects containing the regex
 * @param {Object} twConfig The merged config of Tailwind CSS
 * @returns {Array} Flatten array
 */
export function getGroups(groupsConfig, twConfig = null) {
  const groups = [];
  groupsConfig.forEach((group) => {
    // e.g. SIZING or SPACING
    group.members.forEach((prop) => {
      // e.g. Width or Padding
      if (typeof prop.members === 'string') {
        // Unique property, like `width` limited to one value
        groups.push(prop.members);
      } else {
        // Multiple properties, like `padding`, `padding-top`...
        prop.members.forEach((subprop) => {
          groups.push(subprop.members);
        });
      }
    });
  });
  if (twConfig === null) {
    return groups;
  }
  return groups.map(re => patchRegex(re, twConfig));
}

/**
 * Generates an array of empty arrays prior to grouping
 *
 * @param {Array} groups The array of objects containing the regex
 * @returns {Array} Array of empty arrays
 */
export function initGroupSlots(groups) {
  const slots = [];
  groups.forEach(() => slots.push([]));
  return slots;
}

/**
 * Searches for a match between classname and Tailwind CSS group
 *
 * @param {Array} name The target classname
 * @param {Array} arr The flatten array containing the regex
 * @param {String} separator The delimiter to be used between variants
 * @returns {Array} Array of empty arrays
 */
export function getGroupIndex(name, arr, separator = ':') {
  const classSuffix = getSuffix(name, separator);
  const idx = arr.findIndex((pattern) => {
    const classRe = new RegExp(`^(${pattern})$`);
    return classRe.test(classSuffix);
  });
  return idx;
}

/**
 * Returns the prefix (variants) of a className including the separator or an empty string if none
 *
 * @param {String} name Classname to be parsed
 * @param {String} separator The separator character as in config
 * @returns {String} The prefix
 */
export function getPrefix(name, separator) {
  const rootSeparator = String.raw`(?<!\[[a-z0-9\-]*)(${separator})(?![a-z0-9\-]*\])`;
  const rootSeparatorRegex = new RegExp(rootSeparator);
  let classname = name;
  let index = 0;
  const results = rootSeparatorRegex.exec(classname);
  while (results !== null) {
    const newIndex = results.index + separator.length;
    index += newIndex;
    classname = classname.slice(Math.max(0, newIndex));
  }

  return index ? name.slice(0, Math.max(0, index)) : '';
}

/**
 * Returns the arbitrary property of className without the separator or an empty string if none
 * e.g. "[mask-type:luminance]" => "mask-type"
 *
 * @see https://tailwindcss.com/docs/adding-custom-styles#arbitrary-properties
 * @param {String} name Classname suffix (without it variants) to be parsed
 * @param {String} separator The separator character as in config
 * @returns {String} The arbitrary property
 */
export function getArbitraryProperty(name, separator) {
  const arbitraryPropPattern = String.raw`^\[([a-z\-]*)${separator}\.*`;
  const arbitraryPropRegExp = new RegExp(arbitraryPropPattern);
  const results = arbitraryPropRegExp.exec(name);
  return results === null ? '' : results[1];
}

/**
 * Get the last part of the full classname
 * e.g. "lg:w-[100px]" => "w-[100px]"
 *
 * @param {String} className The target classname
 * @param {String} separator The delimiter to be used between variants
 * @returns {String} The classname without its variants
 */
export function getSuffix(className, separator = ':') {
  const prefix = getPrefix(className, separator);
  return className.slice(prefix.length);
}

/**
 * Find the group of a classname
 *
 * @param {String} name Classname to be find using patterns
 * @param {Array} group The group bein tested
 * @param {Object} config Tailwind CSS config
 * @param {String} parentType The name of the parent group
 * @returns {Object} The infos
 */
function findInGroup(name, group, config, parentType = null) {
  if (typeof group.members === 'string') {
    const pattern = patchRegex(group.members, config);
    const classRe = new RegExp(`^(${pattern})$`);
    if (classRe.test(name)) {
      const res = classRe.exec(name);
      let value = '';
      if (res && res.groups) {
        if (res.groups.value) {
          value = res.groups.value;
        }
        if (res.groups.negativeValue) {
          value = '-' + res.groups.negativeValue;
        }
      }
      return {
        group: parentType,
        ...group,
        value,
      };
    } else {
      return null;
    }
  } else {
    const innerGroup = group.members.find(v => findInGroup(name, v, config, group.type));
    if (!innerGroup) {
      return null;
    } else {
      return findInGroup(name, innerGroup, config, group.type);
    }
  }
}

/**
 * Returns an object with parsed properties
 *
 * @param {String} name Classname to be parsed
 * @param {Array} arr The flatten array containing the regex
 * @param {Object} config The Tailwind CSS config
 * @param {Number} index The index
 * @returns {Object} Parsed infos
 */
export function parseClassname(name, arr, config, index = null) {
  const leadingRe = new RegExp('^(?<leading>\\s*)');
  const trailingRe = new RegExp('(?<trailing>\\s*)$');
  let leading = '';
  let core = '';
  let trailing = '';
  const leadingRes = leadingRe.exec(name);
  if (leadingRes && leadingRes.groups) {
    leading = leadingRes.groups.leading || '';
  }
  const trailingRes = trailingRe.exec(name);
  if (trailingRes && trailingRes.groups) {
    trailing = trailingRes.groups.trailing || '';
  }
  // eslint-disable-next-line unicorn/prefer-string-slice
  core = name.substring(leading.length, name.length - trailing.length);
  const variants = getPrefix(core, config.separator);
  const classSuffix = getSuffix(core, config.separator);
  let slot = null;
  arr.forEach((group) => {
    if (slot === null) {
      const found = findInGroup(classSuffix, group, config);
      if (found) {
        slot = found;
      }
    }
  });
  const value = slot ? slot.value : '';
  const isNegative = value[0] === '-';
  const off = isNegative ? 1 : 0;
  const body = core.slice(0, Math.max(0, core.length - value.length + off)).slice(variants.length + off);
  return {
    index,
    name: core,
    variants,
    parentType: slot ? slot.group : '',
    body,
    value,
    shorthand: slot && slot.shorthand ? slot.shorthand : '',
    leading,
    trailing,
    important: body.slice(0, 1) === '!',
  };
}


import chroma from 'chroma-js';

import { darken, lighten } from './util';

const brand = {
  primary: '#ff3633',
  secondary: '#fff',
  tertiary: '#1f1f1f',
};

const global = {
  background: '#222',
  contentBackground: '#303030',
  link: '#00bc8c',
  textAlt: '#888',
  textDefault: '#fff',
};

global.linkHover = chroma(global.link).darken(1).hex();

const grayScale = chroma.scale([global.textDefault, global.textAlt]).colors(10);
const gray = {};

grayScale.forEach((tint, index) => {
  const key = (index + 1) * 10;

  gray[key] = tint;
});

const variant = {
  danger: '#E74C3C',
  default: '#595959',
  info: '#3498DB',
  primary: '#375a7f',
  success: '#00bc8c',
  warning: '#F39C12',
  lightest: {},
  lighter: {},
  light: {},
  dark: {},
  darker: {},
  darkest: {},
};

Object.keys(variant).forEach((name) => {
  if (typeof variant[name] === 'string') {
    variant.light[name] = darken(variant[name], 0.15);
    variant.lighter[name] = darken(variant[name], 0.5);
    variant.lightest[name] = darken(variant[name], 0.85);

    variant.dark[name] = lighten(variant[name], 0.15);
    variant.darker[name] = lighten(variant[name], 0.5);
    variant.darkest[name] = lighten(variant[name], 0.85);
  }
});

const table = {
  background: lighten(variant.default, 0.95),
  backgroundAlt: lighten(variant.default, 0.85),
  backgroundHover: lighten(variant.default, 0.9),
  variant: {
    danger: lighten(variant.danger, 0.75),
    active: lighten(variant.default, 0.75),
    info: lighten(variant.info, 0.75),
    primary: lighten(variant.primary, 0.75),
    success: lighten(variant.success, 0.75),
    warning: lighten(variant.warning, 0.75),
  },
  variantHover: {
    danger: variant.lighter.danger,
    active: variant.lighter.default,
    info: variant.lighter.info,
    primary: variant.lighter.primary,
    success: variant.lighter.success,
    warning: variant.lighter.warning,
  },
};

const input = {
  background: global.contentBackground,
  backgroundDisabled: darken(global.contentBackground, 0.25),
  border: variant.light.default,
  borderFocus: variant.light.info,
  boxShadow: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px ${chroma(variant.dark.info).alpha(0.4).css()}`,
  color: global.textDefault,
  colorDisabled: gray[60],
  placeholder: gray[60],
};

/* eslint-disable prefer-destructuring */
global.navigationBackground = global.contentBackground;
global.navigationBoxShadow = chroma(gray[100]).alpha(0.1).css();
/* eslint-enable prefer-destructuring */

const teinte = {
  brand,
  global,
  gray,
  input,
  table,
  variant,
};

export default teinte;

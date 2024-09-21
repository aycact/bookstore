import { darken, lighten } from 'polished';

export const textColor = darken(0.1, '#973131');
export const boldTextColor = darken(0.2, '#973131');

// color
export const primaryBgColor = '#973131';
export const primaryBgColorHover = darken(0.1,'#973131');


export const secondaryBgColor = '#e0a75e';
export const secondaryBgColorHover = darken(0.1, '#e0a75e');

export const tertiaryBgColor = '#f9d689';
export const tertiaryBgColorHover = darken(0.1, '#f9d689');

export const quaternaryBgColor = '#f5e7b2';
export const quaternaryBgColorHover = darken(0.1, '#f5e7b2');
export const quaternaryBgColorLight = lighten(0.1, '#f5e7b2');

// letter
export const headingFont = "'Roboto Condensed', Sans-Serif";
export const bodyFont = "'Cabin', Sans-Serif";
export const smallText = '0.875rem';
export const extraSmallText = '0.7em';

/* box shadow*/
export const shadow1 = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
export const shadow2 = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
export const shadow3 = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
export const shadow4 = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

// transition
export const transition = '0.3s ease-in-out all';
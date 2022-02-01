export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);
export const $closest = (e, selector) => e.target.closest(selector);
export const $$currentTarget = (e, selector) =>
  e.currentTarget.querySelectorAll(selector);

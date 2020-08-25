export const addBindingAttr = (attr: string, event: keyof HTMLElementEventMap, callback: (attr: string) => any): void => {
  const bindings = document.querySelectorAll(`[${attr}]`);

  bindings.forEach(element => {
    const value = element.getAttribute('clickAndGo');

    value && element.addEventListener(event, () => callback(value));
  });
};
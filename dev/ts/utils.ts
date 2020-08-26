export const handleBindingAttr = (attr: string, callback: (element: Element, value: string) => any): void => {
  const bindings = document.querySelectorAll(`[${attr}]`);
  
  bindings.forEach(element => {
    const value = element.getAttribute('clickAndGo');
    callback(element, value);
  });
};
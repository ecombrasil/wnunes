const clickAndGo = (): void => {
  const bindings = document.querySelectorAll('[clickAndGo]');
  
  bindings.forEach(element => {
    const attr = element.getAttribute('clickAndGo');
    
    if (attr)
      element.addEventListener('click', () => window.location.href = attr);
  });
};

clickAndGo();
const focusClasses = (smaller = false) =>
  `focus:ring-primary focus:outline-none ${smaller ? 'focus:ring-2' : 'focus:ring-4'} focus:ring-offset-2`;

const hoverClasses = (smaller = false) =>
  `hover:ring-primary hover:outline-none ${smaller ? 'hover:ring-2' : 'hover:ring-4'} hover:ring-offset-2`;

const ariaClasses = (smaller = false) => `${focusClasses(smaller)} ${hoverClasses(smaller)}`;

export { focusClasses, hoverClasses, ariaClasses };

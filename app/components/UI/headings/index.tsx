type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

type Heading = React.FC<HeadingProps>;

const H1: Heading = ({ className = '', children, ...props }) => (
  <h1 {...props} className={`text-black font-light text-3xl xl:text-6xl ${className}`}>
    {children}
  </h1>
);

const H2: Heading = ({ className = '', children, ...props }) => (
  <h2 {...props} className={`text-black font-light text-2xl xl:text-4xl ${className}`}>
    {children}
  </h2>
);

const H3: Heading = ({ className = 'text-black font-medium', children, ...props }) => (
  <h3 {...props} className={`${className}`}>
    {children}
  </h3>
);

export { H1, H2, H3 };

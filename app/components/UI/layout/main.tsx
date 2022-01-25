type MainProps = React.HTMLAttributes<HTMLElement>;

const Main: React.FC<MainProps> = ({ className = '', children, ...props }) => (
  <main {...props} className={`w-full flex flex-col items-center gap-10 xl:gap-12 ${className}`}>
    {children}
  </main>
);

export { Main };

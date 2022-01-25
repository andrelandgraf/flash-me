type SectionProps = React.HTMLAttributes<HTMLElement>;

const Section: React.FC<SectionProps> = ({ className = '', children, ...props }) => (
  <section {...props} className={`w-full flex flex-col gap-5 ${className}`}>
    {children}
  </section>
);

export { Section };

import type { PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import type { LinkProps } from '../links';
import { UnstyledLink } from '../links';
import { getNavLinkClasses, ariaClasses } from '~/utilities';

type ButtonProps = PropsWithoutRef<
  {
    primary?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

type ButtonLinkProps = PropsWithoutRef<
  {
    primary?: boolean;
    disabled?: boolean;
  } & LinkProps
>;

const getClasses = (primary: boolean, className: string, disabled: boolean) => {
  // inherited by all buttons
  const base = `flex gap-2 justify-center items-center mobile:w-full transform motion-safe:active:translate-y-px text-center font-semibold mobile:text-xs shadow-lg rounded-lg px-4 py-2 leading-relaxed
  ${disabled ? 'bg-gray-100 text-gray-700 pointer-events-none' : ariaClasses()}`;
  // for normal button => will be overriden below (not inherited like base)
  let style = ``;
  if (primary) {
    style = 'bg-secondary';
  } else {
    style = 'bg-white';
  }
  // inherited + button type + custom
  return `${base} ${style} ${className}`;
};

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, primary = false, disabled = false, to, className = '', ...props }, ref) => {
    return (
      <UnstyledLink
        {...props}
        ref={ref}
        to={to}
        aria-disabled={disabled}
        className={getClasses(primary, getNavLinkClasses(className, false), disabled)}
      >
        {children}
      </UnstyledLink>
    );
  },
);
ButtonLink.displayName = 'ButtonLink';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = 'button', primary = false, disabled = false, className = '', ...props }, ref) => {
    return (
      <button {...props} ref={ref} type={type} disabled={disabled} className={getClasses(primary, className, disabled)}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, ButtonLink };

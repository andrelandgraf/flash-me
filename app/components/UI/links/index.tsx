import type { FC, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { useMemo } from 'react';
import type { NavLinkProps } from 'remix';
import { NavLink, useLocation } from 'remix';
import { getNavLinkClasses, toToUrlStr, removeHostFromTo, isExternalLink, ariaClasses } from '~/utilities';
import { useEnv } from '~/hooks';

interface UnstyledLinkProps extends PropsWithoutRef<NavLinkProps> {
  asExternal?: boolean;
  overrideAriaClasses?: boolean;
}

const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ to, className = '', asExternal = false, overrideAriaClasses = false, children, ...props }, ref) => {
    const { host } = useEnv();
    const location = useLocation();

    // used for internal links
    const sanitizedTo = useMemo(() => {
      // in the docs, we have our own host in the link, so we need to remove it
      return removeHostFromTo(to, host);
    }, [to, host]);

    // used for external links
    const href = useMemo(() => {
      return toToUrlStr(to, host, location.pathname);
    }, [to, host, location.pathname]);

    const isExternal = useMemo(() => isExternalLink(href, host), [href, host]);

    return (
      <>
        {isExternal || asExternal ? (
          <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${overrideAriaClasses ? '' : ariaClasses(false)} ${getNavLinkClasses(className, false)}`}
          >
            {children}
          </a>
        ) : (
          <NavLink
            {...props}
            ref={ref}
            to={sanitizedTo}
            className={({ isActive }) =>
              `${overrideAriaClasses ? '' : ariaClasses(false)} ${getNavLinkClasses(className, isActive)}`
            }
            prefetch={props.prefetch || 'intent'}
            end
          >
            {children}
          </NavLink>
        )}
      </>
    );
  },
);
UnstyledLink.displayName = 'UnstyledLink';

interface StyledLinkProps extends UnstyledLinkProps {
  shouldStyleActive?: boolean;
}

const StyledLink: FC<StyledLinkProps> = ({ className = '', shouldStyleActive = true, children, ...props }) => {
  return (
    <UnstyledLink
      {...props}
      overrideAriaClasses={true}
      className={({ isActive }) =>
        `rounded-lg font-semibold underline underline-offset-2 hover:underline-offset-8 focus:underline-offset-8 decoration-primary decoration-8 ${
          isActive && shouldStyleActive ? 'text-gray-700 pointer-events-none no-underline' : ''
        } ${ariaClasses(true)} ${getNavLinkClasses(className, isActive)}`
      }
    >
      {children}
    </UnstyledLink>
  );
};

export type { UnstyledLinkProps as LinkProps, StyledLinkProps };

export { StyledLink, UnstyledLink };

export default StyledLink;

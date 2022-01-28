import invariant from 'tiny-invariant';
import { ariaClasses } from '~/utilities';
import { UnstyledLink } from '../links';
import type { LinkProps } from '../links';

const defaultIconClassName = 'shadow-lg rounded-lg';

/**
 * Make sure every icon is aria-hidden="true" by default
 */
type SvgProps = React.SVGAttributes<SVGElement> & {
  title?: string;
  description?: string;
};
type SvgFC = (props: SvgProps) => React.ReactElement;

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label?: string;
}

interface IconLinkProps extends Omit<LinkProps, 'children'> {
  label?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ label, className = '', children, ...props }) => {
  invariant(label, 'IconButton must have a label');
  return (
    <button {...props} aria-label={label} className={`${ariaClasses(true)} ${className}`}>
      {children}
    </button>
  );
};

const IconLink: React.FC<IconLinkProps> = ({ label, children, ...props }) => {
  invariant(label, 'IconLink must have a label');
  return (
    <UnstyledLink {...props} aria-label={label}>
      {children}
    </UnstyledLink>
  );
};

type IconButtonFC = (
  props: Partial<IconButtonProps> & {
    svgProps?: SvgProps;
  },
) => React.ReactElement;

type IconLinkFC = (
  props: Partial<IconLinkProps> & {
    svgProps?: SvgProps;
  },
) => React.ReactElement;

export type { SvgFC, IconButtonFC, IconLinkFC };

export { IconButton, IconLink, defaultIconClassName };

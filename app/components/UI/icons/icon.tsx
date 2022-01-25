import invariant from 'tiny-invariant';
import { ariaClasses } from '~/utilities';
import { UnstyledLink } from '../links';
import type { LinkProps } from '../links';

type SvgProps = Omit<React.SVGAttributes<SVGElement>, 'children'>;

interface IconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  descriptionId: string;
  svgDescription?: string;
}

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  descriptionId: string;
  label?: string;
  svgDescription?: string;
}

interface IconLinkProps extends Omit<LinkProps, 'children'> {
  descriptionId: string;
  label?: string;
  svgDescription?: string;
}

const Icon: React.FC<IconProps> = ({ descriptionId, svgDescription, children }) => {
  invariant(descriptionId, 'Icon must have a descriptionId');
  invariant(svgDescription, 'Icon must have a svgDescription');
  return (
    <div role="image" aria-describedby={descriptionId} className="shadow-lg">
      <span id={descriptionId} className="sr-only">
        {svgDescription}
      </span>
      {children}
    </div>
  );
};

const IconButton: React.FC<IconButtonProps> = ({
  label,
  descriptionId,
  svgDescription,
  className = '',
  children,
  ...props
}) => {
  invariant(label, 'IconButton must have a label');
  invariant(descriptionId, 'IconButton must have a descriptionId');
  invariant(svgDescription, 'IconButton must have a svgDescription');
  return (
    <button aria-label={label} {...props} className={`shadow-lg rounded-lg ${ariaClasses(true)} ${className}`}>
      <span id={descriptionId} className="sr-only">
        {svgDescription}
      </span>
      <div role="image" aria-describedby={descriptionId}>
        {children}
      </div>
    </button>
  );
};

const IconLink: React.FC<IconLinkProps> = ({ label, descriptionId, svgDescription, children, ...props }) => {
  invariant(label, 'IconLink must have a label');
  invariant(descriptionId, 'IconLink must have a descriptionId');
  invariant(svgDescription, 'IconLink must have a svgDescription');
  return (
    <UnstyledLink aria-label={label} {...props}>
      <span id={descriptionId} className="sr-only">
        {svgDescription}
      </span>
      <div role="image" aria-describedby={descriptionId}>
        {children}
      </div>
    </UnstyledLink>
  );
};

interface IconImplProps extends IconProps {
  svgProps?: SvgProps;
}
type IconImplementation = React.FC<IconImplProps>;

interface IconButtonImplProps extends IconButtonProps {
  svgProps?: SvgProps;
}
type IconButtonImplementation = React.FC<IconButtonImplProps>;

interface IconLinkImplProps extends IconLinkProps {
  svgProps?: SvgProps;
}
type IconLinkImplementation = React.FC<IconLinkImplProps>;

export type {
  SvgProps,
  IconProps,
  IconButtonProps,
  IconLinkProps,
  IconImplementation,
  IconLinkImplementation,
  IconButtonImplementation,
};

export { Icon, IconButton, IconLink };

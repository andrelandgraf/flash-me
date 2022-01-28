import type { HTMLAttributes } from 'react';
import MarkdownContainer from '../UI/markdown';

/**
 * Flashcards support markup but we shouldn't allow H1 & H2 tags to save our SEO score and improve accessibility.
 */
const H1: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h3 className="text-2xl font-medium" {...props}>
    {children}
  </h3>
);

/**
 * Flashcards support markup but we shouldn't allow H1 & H2 tags to save our SEO score and improve accessibility.
 */
const H2: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h4 className="text-xl font-medium" {...props}>
    {children}
  </h4>
);

const H3: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h5 className="text-lg font-semibold" {...props}>
    {children}
  </h5>
);

const H456: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h6 className="text-lg font-medium" {...props}>
    {children}
  </h6>
);

const UL: React.FC<HTMLAttributes<HTMLUListElement>> = ({ children, ...props }) => (
  <ul className="list-inside list-disc" {...props}>
    {children}
  </ul>
);

const OL: React.FC<HTMLAttributes<HTMLOListElement>> = ({ children, ...props }) => (
  <ol className="list-inside list-decimal" {...props}>
    {children}
  </ol>
);

interface FlashcardViewProps extends HTMLAttributes<HTMLDivElement> {
  source: string;
}

const FlashcardView = ({ source, className = '' }: FlashcardViewProps): React.ReactElement => {
  return (
    <MarkdownContainer
      className={`flex flex-col gap-2 ${className}`}
      source={source}
      options={{
        components: {
          h1: H1,
          h2: H2,
          h3: H3,
          h4: H456,
          h5: H456,
          h6: H456,
          ul: UL,
          ol: OL,
        },
      }}
    />
  );
};

export default FlashcardView;

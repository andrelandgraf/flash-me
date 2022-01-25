import { forwardRef } from 'react';

interface MessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  type: 'error' | 'success' | 'hidden';
}

const Message = forwardRef<HTMLParagraphElement, MessageProps>(
  ({ type, className = '', children, ...props }, forwardedRef) => (
    <p
      {...props}
      ref={forwardedRef}
      aria-disabled={type === 'hidden'}
      className={`${type === 'hidden' ? 'opacity-0' : 'border-2 opacity-100'} ${
        type === 'error' ? 'border-red-500 bg-red-300' : type === 'success' ? 'border-green-500 bg-green-300' : ''
      } p-3 my-5 m-auto max-w-xl transition ease-in-out ${className}`}
    >
      {children}
    </p>
  ),
);
Message.displayName = 'Message';

export { Message };

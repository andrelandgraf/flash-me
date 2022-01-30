import type { ButtonHTMLAttributes } from 'react';
import React, { useCallback, useState } from 'react';
import { WithTooltip } from '../tooltip';
import { ClipboardButton } from '../icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
  content: string;
}

const CopyClipboardButton: React.FC<ButtonProps> = ({ content, label, className = '', ...props }) => {
  const [text, setText] = useState('Copy');

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(content);
    setText('Copied!');
    setTimeout(() => {
      setText('Copy');
    }, 1000);
  }, [content]);

  return (
    <WithTooltip text={text} className={className}>
      <ClipboardButton {...props} type="button" label={label} onClick={handleClick} />
    </WithTooltip>
  );
};

export default CopyClipboardButton;

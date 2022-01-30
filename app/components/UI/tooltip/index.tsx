import { useState } from 'react';

export interface TooltipProps {
  text: string;
  className?: string;
}

const WithTooltip: React.FC<TooltipProps> = ({ text, className = '', children }) => {
  const [show, setShow] = useState(false);

  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className={`relative ${className}`}>
      <div
        aria-hidden={!show}
        className={`${
          show ? 'opacity-100' : 'opacity-0'
        } absolute transform -translate-y-2 bottom-full transition delay-100 duration-300 ease-in-out`}
      >
        <div className="bg-black flex relative shadow-xl text-xs rounded-md py-1">
          <p className="text-white text-xs font-semibold py-1 px-2 w-full whitespace-nowrap">{text}</p>
          <svg
            className="absolute text-gray-900 transform translate-x-full h-2 top-full shadow-xl"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xmlSpace="preserve"
            aria-hidden="true"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
};

export { WithTooltip };

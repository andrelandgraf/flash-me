import type { FC, HTMLAttributes, ReactElement } from 'react';
import { Children } from 'react';
import invariant from 'tiny-invariant';
import type { Language } from 'prism-react-renderer';
import Highlight, { defaultProps } from 'prism-react-renderer';
import CopyClipboardButton from '../buttons/copyClipboard';

function getLanguageFromClassName(className: string) {
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : '';
}

function isLanguageSupported(lang: string): lang is Language {
  return (
    lang === 'markup' ||
    lang === 'bash' ||
    lang === 'clike' ||
    lang === 'c' ||
    lang === 'cpp' ||
    lang === 'css' ||
    lang === 'javascript' ||
    lang === 'jsx' ||
    lang === 'coffeescript' ||
    lang === 'actionscript' ||
    lang === 'css-extr' ||
    lang === 'diff' ||
    lang === 'git' ||
    lang === 'go' ||
    lang === 'graphql' ||
    lang === 'handlebars' ||
    lang === 'json' ||
    lang === 'less' ||
    lang === 'makefile' ||
    lang === 'markdown' ||
    lang === 'objectivec' ||
    lang === 'ocaml' ||
    lang === 'python' ||
    lang === 'reason' ||
    lang === 'sass' ||
    lang === 'scss' ||
    lang === 'sql' ||
    lang === 'stylus' ||
    lang === 'tsx' ||
    lang === 'typescript' ||
    lang === 'wasm' ||
    lang === 'yaml'
  );
}

const CodeBlock: FC<HTMLAttributes<HTMLPreElement>> = ({ children }) => {
  invariant(!!children, 'children is required');
  const childrenArray = Children.toArray(children);
  const codeElement = childrenArray[0] as ReactElement;
  const className = codeElement?.props?.className || '';
  const userLang = getLanguageFromClassName(className);
  const lang = isLanguageSupported(userLang) ? userLang : 'bash';
  const code = codeElement.props.children[0] || '';
  const identifier = code;
  return (
    <div className="w-full">
      <Highlight {...defaultProps} code={code.trim()} language={lang || 'bash'}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div className="p-2 rounded-md font-normal text-sm md:text-base w-full bg-bgCodeBlock border border-gray-900">
            <div className="flex justify-end">
              <p className="mr-2">{lang || 'text'}</p>
              <CopyClipboardButton label="Copy code" content={code} id={identifier} />
            </div>
            <pre className={`overflow-scroll ${className}`} style={{}}>
              <code className={className} style={{}}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })} style={{}}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} style={{}} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;

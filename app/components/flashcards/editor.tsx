import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormProps } from 'remix';
import { useSearchParams } from 'remix';
import { Form, useActionData, useTransition } from 'remix';
import type { ActionData } from '~/actions/types';
import { ariaClasses } from '~/utilities';
import MarkdownContainer from '../UI/markdown';
import { H3 } from '~/components/UI/headings';
import { Button } from '~/components/UI/buttons';
import { GitHubSignInButton } from '~/components/UI/buttons/github';
import { Message } from '../UI/message';
import { useUser } from '~/hooks';

enum EditorStates {
  idle = 'idle',
  submitting = 'submitting',
  success = 'success',
  error = 'error',
}

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
}

const TextField: React.FC<TextFieldProps> = ({ id, name, label, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  const [dragValue, setDragValue] = useState(defaultValue);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDragValue(value), 1000);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <section className="w-screen m-auto max-w-xl xl:max-w-2xl 2xl:max-w-3xl flex flex-col 2xl:flex-row items-start justify-center gap-5 text-left">
      <div className="w-full flex flex-col items-center justify-center gap-1">
        <label htmlFor={id} className="self-start">{`${label} (Markdown Supported)`}</label>
        <textarea
          id={id}
          name={name}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`w-full p-2 ${ariaClasses()}`}
          rows={6}
          required
          maxLength={3000}
        />
      </div>
      <div className="w-full flex flex-col gap-1 h-full">
        <H3>Preview</H3>
        {dragValue && (
          <div className="w-full h-full flex-grow bg-white border p-2">
            <MarkdownContainer source={dragValue} />
          </div>
        )}
      </div>
    </section>
  );
};

interface EditorProps extends FormProps {
  id?: string;
  front?: string;
  back?: string;
  isPublic?: boolean;
}

const Editor: React.FC<EditorProps> = ({ id, front = '', back = '', isPublic = false, className = '', ...props }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [searchParams] = useSearchParams();
  const user = useUser();
  const action = useMemo(() => (!!id ? `/flashcard/${id}` : `/create`), [id]);
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  useEffect(() => {
    if (actionData?.error) {
      if (messageRef.current) {
        messageRef.current.focus();
      }
    }
  }, [actionData]);

  const editorState: EditorStates = useMemo(() => {
    if (transition.submission && transition.submission.action === action) return EditorStates.submitting;
    if (searchParams.get('success')) return EditorStates.success;
    if (actionData?.error) return EditorStates.error;
    return EditorStates.idle;
  }, [transition.submission, action, actionData, searchParams]);

  return (
    <Form {...props} ref={formRef} className={`w-full ${className}`} method="post" action={action}>
      <fieldset
        disabled={editorState === EditorStates.submitting}
        className="relative w-full mx-2 lg:mx-5 flex flex-col items-center justify-center gap-10"
      >
        <legend className="sr-only">
          {id
            ? 'Edits to your flashcard.'
            : 'Add a front and a back side to your flashcard. Pick if you want other people to see the flashcard.'}
        </legend>
        <input type="hidden" name="id" value={id} />
        <TextField id="textfield-front" label="Front of the card" name="front" defaultValue={front} />
        <TextField id="textfield-back" label="Back of the card" name="back" defaultValue={back} />
        <section className="w-screen m-auto max-w-xl xl:max-w-2xl 2xl:max-w-3xl inline-flex items-center gap-2 text-xl">
          <input
            id="checkbox-isPublic"
            type="checkbox"
            name="isPublic"
            defaultChecked={isPublic}
            className={`w-5 h-5 ${ariaClasses(true)}`}
          />
          <label htmlFor="checkbox-isPublic">Public</label>
        </section>
        {!!user ? (
          <div className="flex flex-col items-center justify-center gap-1">
            {actionData?.error && (
              <Message ref={messageRef} type="error" id="message">
                {actionData.error}
              </Message>
            )}
            <Button type="submit" aria-describedby="message" primary>
              {editorState === EditorStates.submitting ? 'Saving Flashcard...' : 'Save Flashcard'}
            </Button>
          </div>
        ) : (
          <GitHubSignInButton primary />
        )}
      </fieldset>
    </Form>
  );
};

export default Editor;

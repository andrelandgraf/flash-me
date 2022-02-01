import { useState, useRef } from 'react';
import { Form } from 'remix';
import type { Flashcard } from '@prisma/client';
import { useIsomorphicLayoutEffect } from '~/hooks';
import FlashcardView from './markdown';
import { Button, ButtonLink } from '~/components/UI/buttons';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  flashcard: Flashcard;
  toNext: string;
  toPrev: string;
  showPrevNext: boolean;
  canControl?: boolean;
  isBeingDeleted?: boolean;
}

const StackedCard: React.FC<StackProps> = ({
  flashcard,
  toNext,
  toPrev,
  canControl = false,
  isBeingDeleted = false,
  showPrevNext = true,
  className = '',
  ...props
}) => {
  const [showFront, setShowFront] = useState(true);

  /*
   * This useLayoutEffect is safe because
   * the inital server-state = true and useLayoutEffect sets it to true,
   * so there is no mismatch between first server and client render.
   */
  useIsomorphicLayoutEffect(() => {
    setShowFront(true);
  }, [flashcard]);

  const nextBtnRef = useRef<HTMLAnchorElement>(null);
  return (
    <div {...props} className={`relative w-full xl:max-w-3xl 2xl:max-w-5xl ${className}`} style={{ height: '50vh' }}>
      {canControl && (
        <div
          className="hidden xl:flex xl:absolute -top-2 -left-1/4 w-full xl:max-w-3xl 2xl:max-w-5xl items-start justify-start bg-teal-300 border border-white shadow-lg transform -rotate-6"
          style={{ height: '50vh' }}
        >
          <ButtonLink to="/create" className="m-2">
            Add new Flashcard
          </ButtonLink>
        </div>
      )}
      <div className="absolute -top-4 -bottom-1 right-0 left-0 border border-white bg-gray-300 shadow-lg transform rotate-1" />
      <div className="absolute -top-2 -bottom-4 right-0 left-0 border border-white bg-blue-300 shadow-lg transform -rotate-2" />
      <div className="absolute top-0 -bottom-3 -right-4 left-0 border border-white bg-yellow-300 shadow-lg transform rotate-1" />
      <div className="absolute -top-4 -bottom-1 right-0 left-0 border border-white bg-red-300 shadow-lg transform rotate-1" />
      <div className="absolute top-0 -bottom-3 -right-3 -left-1 border border-white bg-lime-300 shadow-lg" />
      <div className="absolute top-0 bottom-0 -right-2 left-0 border border-white bg-red-300 shadow-lg" />
      <div className="absolute -top-1 -bottom-2 left-0 border border-white bg-blue-300 shadow-lg" />
      <div className="absolute top-0 -bottom-1 -right-1 left-0 border border-white bg-indigo-300 shadow-lg" />
      <div className="absolute top-0 -bottom-1 right-0 -left-1 border border-white bg-orange-300 shadow-lg" />
      <div className="absolute -top-3 bottom-0 -right-1 left-0 border border-white bg-indigo-300 shadow-lg" />
      <div className="absolute -top-2 bottom-0 right-0 -left-1 border border-white bg-yellow-300 shadow-lg" />
      <div className="absolute -top-1 bottom-0 right-0 -left-1 border border-white bg-amber-300 shadow-lg" />
      <div className="absolute -top-1 bottom-0 -right-1 left-0 border border-white bg-blue-300 shadow-lg" />
      <div className="absolute top-0 -bottom-1 right-0 left-0 border border-white bg-red-300 shadow-lg" />
      <div className="relative h-full w-full bg-green-300 border border-white shadow-lg z-20">
        <FlashcardView
          id="flashcard-content"
          source={showFront ? flashcard.front : flashcard.back}
          className="relative h-full w-full overflow-y-scroll py-14 px-2 lg:py-20 lg:px-5"
        />
        <nav className="absolute top-2 left-2 right-2 flex flex-col">
          {showPrevNext ? (
            <div className="w-full flex gap-2">
              <ButtonLink to={toPrev}>Previous</ButtonLink>
              <Button
                className="ml-auto"
                primary={showFront}
                aria-describedby="flashcard-content"
                onClick={() => {
                  setShowFront((show) => !show);
                  if (nextBtnRef.current && showFront) {
                    nextBtnRef.current.focus();
                  }
                }}
              >
                {showFront ? 'Reveal' : 'Show Front'}
              </Button>
              <ButtonLink ref={nextBtnRef} to={toNext} primary={!showFront}>
                Next
              </ButtonLink>
            </div>
          ) : (
            <Button
              className="ml-auto"
              aria-describedby="flashcard-content"
              primary={showFront}
              onClick={() => setShowFront((show) => !show)}
            >
              {showFront ? 'Reveal' : 'Show Front'}
            </Button>
          )}
        </nav>
        <nav className="absolute bottom-2 left-2 right-2 flex flex-col">
          {canControl && (
            <>
              <div className="ml-auto mt-auto flex flex-row gap-2">
                <ButtonLink to={`/flashcard/${flashcard.id}`}>Edit</ButtonLink>
                <Form method="delete" action="/?index">
                  <fieldset disabled={isBeingDeleted}>
                    <input type="hidden" name="id" value={flashcard.id} />
                    <Button type="submit">{isBeingDeleted ? 'Deleting...' : 'Delete'}</Button>
                  </fieldset>
                </Form>
              </div>
            </>
          )}
        </nav>
      </div>
      {canControl && (
        <div
          className="flex xl:hidden w-full xl:max-w-3xl 2xl:max-w-5xl items-start justify-start bg-teal-300 border border-white shadow-lg transform -translate-y-3/4 -mt-5 -rotate-3"
          style={{ height: '50vh' }}
        >
          <ButtonLink to="/create" className="mt-auto m-2">
            Add new Flashcard
          </ButtonLink>
        </div>
      )}
    </div>
  );
};

export default StackedCard;

import { useMemo } from 'react';
import type { ActionFunction, LoaderFunction } from 'remix';
import { useActionData, useLoaderData, useTransition } from 'remix';
import type { Flashcard, User } from '@prisma/client';
import type { ActionData } from '~/actions/types';
import { deleteFlashcard, DeleteFlashcardResState } from '~/actions/flashcard';
import { db } from '~/db.server';
import { getUserSession } from '~/session.server';
import { useUser } from '~/hooks';
import { Section } from '~/components/UI/layout';
import { H1, H2 } from '~/components/UI/headings';
import StackedCard from '~/components/flashcards/stack';
import { ButtonLink } from '~/components/UI/buttons';

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
  const session = await getUserSession(request);
  if (!session) {
    return {
      ok: false,
      error: 'You have to be signed in to do that',
    };
  }
  const formData = await request.formData();
  const [status, state] = await deleteFlashcard(formData, session.user);
  if (status !== 200) {
    switch (state) {
      case DeleteFlashcardResState.bad_input:
        return { ok: false, error: 'Bad input.' };
      case DeleteFlashcardResState.not_authorized:
      case DeleteFlashcardResState.not_found:
        return { ok: false, error: 'Flashcard not found.' };
      default:
        return { ok: false, error: 'Internal error.' };
    }
  }
  return { ok: true };
};

interface LoaderData {
  flashcards: Flashcard[];
  index: number;
  publicFlashcards: Flashcard[];
  publicIndex: number;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const session = await getUserSession(request);

  let index = 0;
  let publicIndex = 0;
  try {
    const url = new URL(request.url);
    index = parseInt(url.searchParams.get('index') || '0', 10);
    publicIndex = parseInt(url.searchParams.get('publicIndex') || '0', 10);
  } catch (error) {
    console.log(error);
  }

  let flashcards: Flashcard[] = [];
  if (session) {
    flashcards = await db.flashcard.findMany({ where: { user: { id: session.user.id } } });
  }
  const publicFlashcards = await db.flashcard.findMany({
    where: { isPublic: true, NOT: { userId: session?.user.id } },
  });
  return { flashcards, index, publicFlashcards, publicIndex };
};

export default function Index() {
  const { user } = useUser();
  const transition = useTransition();
  const { flashcards, publicFlashcards, index, publicIndex } = useLoaderData<LoaderData>();
  const flashcard = useMemo(() => flashcards[index], [flashcards, index]);
  const publicFlashcard = useMemo(() => publicFlashcards[publicIndex], [publicFlashcards, publicIndex]);
  const actionData = useActionData<ActionData>();

  const currDeleteId = useMemo(() => {
    if (!transition.submission || transition.submission.action !== '/?index') return undefined;
    return transition.submission.formData.get('id');
  }, [transition]);

  const publicToNext = useMemo(() => {
    if (!publicFlashcards.length) return '/';
    const nextIndex = (publicIndex + 1) % publicFlashcards.length;
    return `/?index=${index}&publicIndex=${nextIndex}`;
  }, [publicFlashcards, publicIndex, index]);

  const publicToPrev = useMemo(() => {
    if (!publicFlashcards.length) return '/';
    const prevIndex = (publicIndex + publicFlashcards.length - 1) % publicFlashcards.length;
    return `/?index=${index}&publicIndex=${prevIndex}`;
  }, [publicFlashcards, publicIndex, index]);

  const toNext = useMemo(() => {
    if (!flashcards.length) return '/';
    const nextIndex = (index + 1) % flashcards.length;
    return `/?index=${nextIndex}&publicIndex=${publicIndex}`;
  }, [flashcards, index, publicIndex]);

  const toPrev = useMemo(() => {
    if (!flashcards.length) return '/';
    const prevIndex = (index + flashcards.length - 1) % flashcards.length;
    return `/?index=${prevIndex}&publicIndex=${publicIndex}`;
  }, [flashcards, index, publicIndex]);

  return (
    <>
      <div className="w-full flex flex-col gap-1 text-center">
        <H1>{user ? `Hey, ${user.name}!` : 'Welcome to Flash Me!'}</H1>
        <p className="font-light">Learn through rehearsal. Create and study with flashcards online.</p>
      </div>
      {!!flashcards.length ? (
        <Section className="justify-center items-center">
          <H2 className="mb-10 z-20">Your Flashcards</H2>
          {actionData?.error && <p className="border-red-500 p-5 z-20">{actionData.error}</p>}
          <StackedCard
            flashcard={flashcard}
            toPrev={toPrev}
            toNext={toNext}
            showPrevNext={flashcards.length > 1}
            isBeingDeleted={flashcard.id === currDeleteId}
            canControl
          />
        </Section>
      ) : (
        !!user && <ButtonLink to="/create">Create Flashcard!</ButtonLink>
      )}
      {!!publicFlashcards.length && (
        <Section className="justify-center items-center">
          <H2 className="mb-10">Public Flashcards</H2>
          <StackedCard
            flashcard={publicFlashcard}
            toPrev={publicToPrev}
            toNext={publicToNext}
            showPrevNext={publicFlashcards.length > 1}
          />
        </Section>
      )}
    </>
  );
}

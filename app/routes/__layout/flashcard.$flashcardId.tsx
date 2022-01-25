import type { ActionFunction, LoaderFunction } from 'remix';
import { useLoaderData, useSearchParams, redirect } from 'remix';
import type { Flashcard } from '@prisma/client';
import { updateFlashcard, UpdateFlashcardResState } from '~/actions/flashcard';
import type { ActionData } from '~/actions/types';
import { getUserSession } from '~/session.server';
import { db } from '~/db.server';
import Editor from '~/components/flashcards/editor';
import { Section } from '~/components/UI/layout';
import { H1 } from '~/components/UI/headings';
import StyledLink from '~/components/UI/links';

export const action: ActionFunction = async ({ request, params }): Promise<ActionData> => {
  const session = await getUserSession(request);
  if (!session) {
    return {
      ok: false,
      error: 'You have to be signed in to do that.',
    };
  }
  const formData = await request.formData();
  const [status, state] = await updateFlashcard(formData, session.user);
  if (status !== 200) {
    console.error(`Update error ${status}: ${state}`);
    switch (state) {
      case UpdateFlashcardResState.bad_input:
        return { ok: false, error: 'Bad input.' };
      case UpdateFlashcardResState.not_found:
        return { ok: false, error: 'Flashcard not found. Did you maybe delete it?' };
      case UpdateFlashcardResState.missing_back:
        return { ok: false, error: 'Please provide a value for the back of your card.' };
      case UpdateFlashcardResState.missing_front:
        return { ok: false, error: 'Please provide a value for the front of your card.' };
      default:
        return { ok: false, error: 'Internal error.' };
    }
  }
  return redirect(`/flashcard/${params.flashcardId}?success=true`);
};

interface LoaderData {
  flashcard: Flashcard;
}

export const loader: LoaderFunction = async ({ request, params }): Promise<Response | LoaderData> => {
  const session = await getUserSession(request);
  if (!session) {
    return redirect('/');
  }
  const { flashcardId } = params;
  const flashcard = await db.flashcard.findUnique({ where: { id: flashcardId } });
  if (!flashcard) {
    return redirect('/');
  }
  return { flashcard };
};

export default function Flashcard() {
  const { flashcard } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  return (
    <Section className="justify-center items-center text-center">
      <H1>{searchParams.get('success') ? 'Flashcard Updated!' : 'Update your Flashcard'}</H1>
      {!searchParams.get('success') && <p>Provide a front (question) and a back (answer) for your flashcard.</p>}
      {searchParams.get('success') ? (
        <nav className="w-full inline-flex gap-5 text-center justify-center items-center">
          <span>
            <StyledLink to="/">Back to Homepage</StyledLink>
          </span>
          <span>or</span>
          <span>
            <StyledLink to={`/flashcard/${flashcard.id}`} shouldStyleActive={false}>
              Keep editing!
            </StyledLink>
          </span>
        </nav>
      ) : (
        <Editor id={flashcard.id} front={flashcard.front} back={flashcard.back} isPublic={flashcard.isPublic} />
      )}
    </Section>
  );
}

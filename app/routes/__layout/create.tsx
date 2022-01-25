import type { ActionFunction } from 'remix';
import { useSearchParams } from 'remix';
import { redirect } from 'remix';
import { createFlashcard, CreateFlashcardResState } from '~/actions/flashcard';
import type { ActionData } from '~/actions/types';
import { getUserSession } from '~/session.server';
import Editor from '~/components/flashcards/editor';
import { Section } from '~/components/UI/layout';
import { H1 } from '~/components/UI/headings';
import StyledLink from '~/components/UI/links';

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
  const session = await getUserSession(request);
  if (!session) {
    return {
      ok: false,
      error: 'You have to be signed in to do that.',
    };
  }
  const formData = await request.formData();
  const [status, state] = await createFlashcard(formData, session.user);
  if (status !== 200) {
    console.error(`Create error ${status}: ${state}`);
    switch (state) {
      case CreateFlashcardResState.bad_input:
        return { ok: false, error: 'Bad input.' };
      case CreateFlashcardResState.missing_back:
        return { ok: false, error: 'Please provide a value for the back of your card.' };
      case CreateFlashcardResState.missing_front:
        return { ok: false, error: 'Please provide a value for the front of your card.' };
      default:
        return { ok: false, error: 'Internal error.' };
    }
  }
  return redirect('/create?success=true');
};

export default function CreateFlashcard() {
  const [searchParams] = useSearchParams();
  return (
    <Section className="justify-center items-center text-center">
      <H1>{searchParams.get('success') ? 'Flashcard Created!' : 'Create a new Flashcard'}</H1>
      {!searchParams.get('success') && <p>Provide a front (question) and a back (answer) for your new flashcard.</p>}
      {searchParams.get('success') ? (
        <nav className="w-full inline-flex gap-5 text-center justify-center items-center">
          <span>
            <StyledLink to="/">Back to Homepage</StyledLink>
          </span>
          <span>or</span>
          <span>
            <StyledLink to="/create" shouldStyleActive={false}>
              Add another one!
            </StyledLink>
          </span>
        </nav>
      ) : (
        <Editor />
      )}
    </Section>
  );
}

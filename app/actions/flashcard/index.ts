import type { User } from '@prisma/client';
import type { ActionResult } from '../types';
import { db } from '~/db.server';

enum CreateFlashcardResState {
  missing_front = 'missing_front',
  missing_back = 'missing_back',
  bad_input = 'bad_input',
  internal_error = 'internal_error',
  success = 'success',
}

enum UpdateFlashcardResState {
  missing_front = 'missing_front',
  missing_back = 'missing_back',
  bad_input = 'bad_input',
  internal_error = 'internal_error',
  not_found = 'not_found',
  success = 'success',
}

enum DeleteFlashcardResState {
  id_required = 'id_required',
  bad_input = 'bad_input',
  not_found = 'not_found',
  not_authorized = 'not_authorized',
  internal_error = 'internal_error',
  success = 'success',
}

async function createFlashcard(formData: FormData, user: User): Promise<ActionResult<CreateFlashcardResState, null>> {
  const front = formData.get('front');
  const back = formData.get('back');
  const isPublic = formData.get('isPublic') === 'on';
  if (!front) {
    return [400, CreateFlashcardResState.missing_front, undefined];
  }
  if (!back) {
    return [400, CreateFlashcardResState.missing_back, undefined];
  }
  if (typeof front !== 'string' || typeof back !== 'string') {
    return [400, CreateFlashcardResState.bad_input, undefined];
  }
  try {
    await db.flashcard.create({
      data: { front, back, user: { connect: { id: user.id } }, isPublic },
    });
    return [200, CreateFlashcardResState.success, null];
  } catch (error) {
    console.error(error);
    return [500, CreateFlashcardResState.internal_error, undefined];
  }
}

async function updateFlashcard(formData: FormData, user: User): Promise<ActionResult<UpdateFlashcardResState, null>> {
  const id = formData.get('id');
  const front = formData.get('front');
  const back = formData.get('back');
  const isPublic = formData.get('isPublic') === 'on';
  if (!id || typeof id !== 'string') {
    return [400, UpdateFlashcardResState.bad_input, undefined];
  }
  if (!front) {
    return [400, UpdateFlashcardResState.missing_front, undefined];
  }
  if (!back) {
    return [400, UpdateFlashcardResState.missing_back, undefined];
  }
  if (typeof front !== 'string' || typeof back !== 'string') {
    return [400, UpdateFlashcardResState.bad_input, undefined];
  }
  try {
    const updated = await db.flashcard.updateMany({
      where: { id, userId: user.id },
      data: { front, back, isPublic },
    });
    if (updated.count === 0) {
      return [404, UpdateFlashcardResState.not_found, undefined];
    }
    return [200, UpdateFlashcardResState.success, null];
  } catch (error) {
    console.error(error);
    return [500, UpdateFlashcardResState.internal_error, undefined];
  }
}

async function deleteFlashcard(formData: FormData, user: User): Promise<ActionResult<DeleteFlashcardResState, null>> {
  const id = formData.get('id');
  if (!id) {
    return [400, DeleteFlashcardResState.id_required, undefined];
  }
  if (typeof id !== 'string') {
    return [400, DeleteFlashcardResState.bad_input, undefined];
  }
  try {
    const flashcard = await db.flashcard.findUnique({ where: { id } });
    if (!flashcard) {
      return [404, DeleteFlashcardResState.not_found, undefined];
    }
    if (flashcard.userId !== user.id) {
      return [403, DeleteFlashcardResState.not_authorized, undefined];
    }
    await db.flashcard.delete({ where: { id } });
    return [200, DeleteFlashcardResState.success, null];
  } catch (error: unknown) {
    console.error(error);
    return [500, DeleteFlashcardResState.internal_error, undefined];
  }
}

export {
  CreateFlashcardResState,
  createFlashcard,
  UpdateFlashcardResState,
  updateFlashcard,
  DeleteFlashcardResState,
  deleteFlashcard,
};

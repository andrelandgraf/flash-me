import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const user = await db.user.create({ data: getUser() });
  console.log('User created:', user);
  await db.tag.createMany({ data: getTags() });
  const cards = getFlashcards();
  for (const card of cards) {
    await db.flashcard.create({
      data: {
        front: card.front,
        back: card.back,
        user: { connect: { id: user.id } },
        isPublic: true,
      },
    });
  }
  const tags = await db.tag.findMany();
  console.log('Tags created:', tags);
  const flashcards = await db.flashcard.findMany();
  console.log('Flashcards created:', flashcards);
  for (const flashcard of flashcards) {
    const tagStrings = cards.find((card) => card.front === flashcard.front)?.tags || [];
    const assignedTags = tags.filter((tag) => tagStrings.includes(tag.name));
    await db.flashcard.update({
      where: { id: flashcard.id },
      data: {
        tags: { set: assignedTags.map((tag) => ({ id: tag.id })) },
      },
    });
  }
}

seed();

function getUser() {
  return {
    email: 'andre.timo.landgraf@gmail.com',
    name: 'Andre Landgraf',
  };
}

function getTags() {
  return [
    {
      name: 'Web Development',
    },
    {
      name: 'HTML',
    },
    {
      name: 'CSS',
    },
    {
      name: 'Tailwindcss',
    },
    {
      name: 'JavaScript',
    },
    {
      name: 'TypeScript',
    },
    {
      name: 'React',
    },
    {
      name: 'Node',
    },
    {
      name: 'Remix.run',
    },
    {
      name: 'Algorithms and Data Structures',
    },
    {
      name: 'Systems Design',
    },
  ];
}

function getFlashcards() {
  return [
    {
      front: 'Throttle vs. Debounce',
      back: 'Debounce postpones execution until there is no input change for the delay period of time. If a change occurs, cancel the previously scheduled execution and create a new schedule. Throttling is a way to limit the number of times a function can be called. Perform a function, then drop all the function calls until a certain period of time.',
      tags: ['Web Development'],
    },
    {
      front: 'How to disable several inputs of a form?',
      back: 'A fieldset is a group of related form elements. To disable all the inputs of a fieldset, you can use the disabled attribute on the fieldset element.',
      tags: ['Web Development', 'HTML'],
    },
    {
      front: 'tabIndex=0 vs tabIndex=-1',
      back: "A negative value (usually tabindex='-1' ) means that the element is not reachable via sequential keyboard navigation, but could be focused with JavaScript or visually by clicking with the mouse. It's mostly useful to create accessible widgets with JavaScript. tabindex='0' means that the element should be focusable in sequential keyboard navigation, after any positive tabindex values and its order is defined by the document's source order.",
      tags: ['Web Development', 'HTML'],
    },
    {
      front: 'How to make a error or success message that belongs to an input field accessible to screen readers?',
      back: 'Use aria-label or aria-labelledby to label the input field. To make the error or success message accessible to screen readers, use aria-describedby to link the error or success message to the input field.',
      tags: ['Web Development', 'HTML'],
    },
  ];
}

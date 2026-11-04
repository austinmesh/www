import { type CollectionEntry, getCollection, render } from 'astro:content';

/**
 * FAQ categories, in the order they appear on /faq/. `id` is both the folder name under
 * src/content/faq/ and the category's anchor (/faq/#<id>). A category with no questions
 * yet is left off the page, so it's safe to add one here before writing its questions.
 */
export const faqCategories: readonly { id: string; title: string }[] = [
  { id: 'getting-started', title: 'Getting started' },
  { id: 'is-it-working', title: 'Is it working?' },
  { id: 'coverage-and-range', title: 'Coverage and range' },
  { id: 'hardware-and-installs', title: 'Hardware and installs' },
  { id: 'running-a-repeater', title: 'Running a repeater' },
  { id: 'community-and-rules', title: 'Community and rules' },
  { id: 'property-owners', title: 'For property owners' },
];

// Ids BaseLayout already puts on every page. A question or category using one would
// produce a duplicate id, and its deep link would land on the wrong element.
const RESERVED_IDS = new Set(['event']);

const SORT_LAST = Number.MAX_SAFE_INTEGER;

export interface FaqQuestion {
  anchor: string;
  entry: CollectionEntry<'faq'>;
  Content: Awaited<ReturnType<typeof render>>['Content'];
}

export interface FaqSection {
  id: string;
  title: string;
  questions: FaqQuestion[];
}

/**
 * Every FAQ question, grouped by category and sorted for display. Fails the build
 * (rather than shipping a broken deep link) on a question outside a known category
 * folder, on an anchor used twice, or on markdown headings inside an answer.
 */
export async function getFaqSections(): Promise<FaqSection[]> {
  const sections = new Map<string, FaqSection>(
    faqCategories.map((c) => [c.id, { ...c, questions: [] }]),
  );
  // anchor -> where it's already used, for the duplicate-anchor error message
  const claimed = new Map<string, string>(
    faqCategories.map((c) => [c.id, `the "${c.title}" category`]),
  );
  for (const id of RESERVED_IDS) claimed.set(id, 'an id the site layout uses on every page');

  for (const entry of await getCollection('faq')) {
    const file = entry.filePath ?? entry.id;
    const parts = entry.id.split('/');
    if (parts.length !== 2) {
      throw new Error(
        `FAQ question ${file} must sit directly inside a category folder, e.g. src/content/faq/${faqCategories[0]?.id ?? 'general'}/my-question.md`,
      );
    }
    const [categoryId, anchor] = parts;
    const section = sections.get(categoryId);
    if (!section) {
      throw new Error(
        `FAQ question ${file} is in unknown category folder "${categoryId}". Add it to faqCategories in src/lib/faq.ts or move the file.`,
      );
    }
    const clash = claimed.get(anchor);
    if (clash) {
      throw new Error(`FAQ question ${file} would use anchor #${anchor}, which is already ${clash}. Rename the file.`);
    }
    claimed.set(anchor, `used by ${file}`);

    const { Content, headings } = await render(entry);
    if (headings.length > 0) {
      throw new Error(
        `FAQ answer ${file} contains a markdown heading ("${headings[0].text}"). Answers sit under the question's own heading, so extra headings break the page outline and search results. Use bold text, or move long content to its own page and link to it.`,
      );
    }
    section.questions.push({ anchor, entry, Content });
  }

  for (const section of sections.values()) {
    section.questions.sort(
      (a, b) =>
        (a.entry.data.order ?? SORT_LAST) - (b.entry.data.order ?? SORT_LAST) ||
        a.entry.data.question.localeCompare(b.entry.data.question),
    );
  }
  return [...sections.values()].filter((s) => s.questions.length > 0);
}

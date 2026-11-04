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

const FAQ_DIR = 'src/content/faq/';
// A filename is used as-is for the question's link, so keep it to URL-safe characters.
const ANCHOR_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Any heading in an answer's HTML, whether written in markdown (## ...) or raw HTML.
const HEADING_HTML = /<h[1-6][\s>][\s\S]*?<\/h[1-6]>/i;

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
 * folder, a non-.md file, a filename that isn't a clean anchor, an anchor used twice,
 * or a heading inside an answer.
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
    // Category and anchor come from the file path itself, not entry.id: the glob loader
    // slugifies ids and honors a frontmatter `slug:`, either of which would quietly make
    // the link differ from the filename.
    const file = entry.filePath ?? `${FAQ_DIR}${entry.id}.md`;
    const parts = (file.startsWith(FAQ_DIR) ? file.slice(FAQ_DIR.length) : file).split('/');
    if (parts.length !== 2) {
      throw new Error(
        `FAQ question ${file} must sit directly inside a category folder, e.g. ${FAQ_DIR}${faqCategories[0]?.id ?? 'general'}/my-question.md`,
      );
    }
    const [categoryId, fileName] = parts;
    if (!fileName.endsWith('.md')) {
      throw new Error(`FAQ question ${file} must be a .md file. MDX isn't supported for FAQ answers.`);
    }
    const anchor = fileName.slice(0, -'.md'.length);
    if (!ANCHOR_PATTERN.test(anchor)) {
      const suggestion = anchor
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      throw new Error(
        `FAQ question ${file}: the filename becomes the question's link (/faq/#${anchor}), so it may only use lowercase letters, digits, and hyphens. Rename it to ${suggestion}.md.`,
      );
    }
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
    const htmlHeading = entry.rendered?.html.match(HEADING_HTML)?.[0];
    if (headings.length > 0 || htmlHeading) {
      const text = headings[0]?.text ?? htmlHeading?.replace(/<[^>]+>/g, '').trim();
      throw new Error(
        `FAQ answer ${file} contains a heading ("${text}"). Answers sit under the question's own heading, so extra headings break the page outline and search results. Use bold text, or move long content to its own page and link to it.`,
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

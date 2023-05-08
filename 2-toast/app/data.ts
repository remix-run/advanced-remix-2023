////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-ignore - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

export type TalkMutation = {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  github?: string;
  notes?: string;
  favorite?: boolean;
};

export type TalkRecord = TalkMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeTalks = {
  records: {} as Record<string, TalkRecord>,

  async getAll(): Promise<TalkRecord[]> {
    return Object.keys(fakeTalks.records).map((key) => fakeTalks.records[key]);
  },

  async get(id: string): Promise<TalkRecord | null> {
    return fakeTalks.records[id] || null;
  },

  async create(values: TalkMutation): Promise<TalkRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newTalk = { id, createdAt, ...values };
    fakeTalks.records[id] = newTalk;
    return newTalk;
  },

  async set(id: string, values: TalkMutation): Promise<TalkRecord> {
    const talk = await fakeTalks.get(id);
    invariant(talk, `No contact found for ${id}`);
    const updatedContact = { ...talk, ...values };
    fakeTalks.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): TalkRecord {
    let talk = fakeTalks.records[id];
    delete fakeTalks.records[id];
    return talk;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getTalks(query?: string) {
  let talks = await fakeTalks.getAll();
  if (query) {
    talks = matchSorter(talks, query, {
      keys: ["firstName", "lastName"],
    });
  }
  return talks.sort(sortBy("last", "createdAt"));
}

export async function createTalk(params: TalkMutation = {}) {
  const talk = await fakeTalks.create(params);
  return talk;
}

export async function getTalk(id: string) {
  return fakeTalks.get(id);
}

export async function updateTalk(id: string, updates: TalkMutation) {
  const talk = await fakeTalks.get(id);
  if (!talk) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeTalks.set(id, { ...talk, ...updates });
  return talk;
}

export async function deleteTalk(id: string) {
  let talk = fakeTalks.destroy(id);
  return talk;
}

[
  {
    firstName: "Dennis",
    lastName: "Beatty",
    avatar: "https://remix.run/conf-images/speakers/dennis.jpg",
  },
  {
    firstName: "Greg",
    lastName: "Brimble",
    avatar: "https://remix.run/conf-images/speakers/greg.jpg",
  },
  {
    firstName: "Ryan",
    lastName: "Dahl",
    avatar: "https://remix.run/conf-images/speakers/ryan.jpg",
  },
  {
    firstName: "Sarah",
    lastName: "Dayan",
    avatar: "https://remix.run/conf-images/speakers/sarah.jpg",
  },
  {
    firstName: "Ceora",
    lastName: "Ford",
    avatar: "https://remix.run/conf-images/speakers/ceora.jpg",
  },
  {
    firstName: "Anthony",
    lastName: "Frehner",
    avatar: "https://remix.run/conf-images/speakers/anthony.jpg",
  },
  {
    firstName: "Arisa",
    lastName: "Fukuzaki",
    avatar: "https://remix.run/conf-images/speakers/arisa.jpg",
  },
  {
    firstName: "Henri",
    lastName: "Helvetica",
    avatar:
      "https://pbs.twimg.com/profile_images/960605708202004481/MMNCgNgM_400x400.jpg",
    github: "@HenriHelvetica",
    favorite: !0,
    notes: "How To WebPageTest",
  },
  {
    firstName: "Michael",
    lastName: "Jackson",
    github: "mjackson",
    avatar:
      "https://pbs.twimg.com/profile_images/1529950053317505024/D2kf-q6Q_400x400.jpg",
  },
].forEach((contact) => {
  let id = `${contact.firstName}-${contact.lastName}`.toLowerCase();
  fakeTalks.create({ id, favorite: false, ...contact });
});

## Fetching Heck!

- No concurrency: click two "add to cart", spinner teleports!
- Causes navigations, which isn't really the semantic with this UI
- We've got pending UI, but optimistic UI is even better.
- Best to start this way though, ensures you have the core feature done without any extra "frontend stuff" (aka unnecessary caches and synchronization: aka useState)

## Tasks

- ✅ Add ability to have concurrent mutations
- ✅ Avoid navigation on form submissions
- ✅ Add optimistic UI to:
  - add
  - update
  - cart count at the top

## Ryan's Notes

- start with two fetchers, works great!
  - especially the 0 quantity thing "just works"
- slow network
  - this sucks!
  - add pending UI ... still sucks!
- optimistic UI
  - awesome!
  - what about the 0 case?
  - lol this sucks!
- PROBLEM: the conditional rendering doesn't know the optimistic values
- SOLUTION: move the fetcher up, pass it down
  - oh crap, race conditions on quantity vs. add
  - hard to cause, probably need to force it with backend setTimeouts
- just use a single fetcher, then state for both intents are shared
- keep total count in the header up to date
  - make it optimistic with useFetchers
  - embrace `let`!

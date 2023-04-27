## Fetching Heck!

## 💻 Warm up!

Make the buttons work!

- [ ] Make the "Add to cart" button work with `cart.add()`
- [ ] Turn on network throttling in your browser dev tools
- [ ] Make `isBusy` work to show the `<Spinner />` when adding to the cart
- [ ] Make the `<QuantityPicker>` work with `cart.update()`
- [ ] Make the `<Spinner />` render when updating the quantity

## Discussion

- No concurrency: click two "add to cart", spinner teleports!
- Causes navigations, which isn't really the semantic with this UI
- We've got pending UI, but optimistic UI is even better.
- Best to start this way though, ensures you have the core feature done without any extra "frontend stuff" (aka unnecessary caches and synchronization: aka useState)

## 💻 Fetchers and Optimistic UI!

Switch to fetchers for concurrent mutations and avoiding navigation.

- [ ] Change `<Form>` to `<fetcher.Form>`
- [ ] Add optimistic UI for the "add" action
- [ ] Add optimistic UI for the "update" action
- [ ] Add optimistic UI for the cart count at the top with `useFetchers`

# Toast Messages!

Most toast message abstractions in React focus on the frontend and use events/effects to trigger them.

With Remix we can use more "traditional" toast messages (aka "flash messages") with serverside sessions and then add add a little pizzazz on the front end, but trigger them on the back end with route actions instead of client side events and effects.

Once the plumbing is done from the root loader and the `<Toast>` component, adding messages is as simple as calling a function in your `action`.

## 💻 Implement Toast Messages Basics

Open up `toast/toast.server.ts` and check out the session storage created there. You can implement the interfaces already defined there, or scrap it and do it however you want! Just make sure to use the session.

Sessions Reference: https://remix.run/docs/en/main/utils/sessions#session-api

- [ ] Read the toast messages from the toast session in the root route (might want to hard code some initially to get the rendering working)
  - [ ] Don't forget to commit the session in the `Set-Cookie` header!
- [ ] Pass the messages to the `<Toast />` component in the root route
- [ ] Add a toast message in the `edit` route action.
  - [ ] Edit a record and see if it works!
  - [ ] Don't forget to commit the session in the `Set-Cookie` header!

## 💻 Implement Frontend goodies

Open up `toast/toast.tsx`, right now it's just some basic markup, but we can introduce some frontend stuff like useState to animate the messages and remove them after a timeout. The `use-timeout.tsx` is there for you to use as well.

- [ ] Get the toast to animate in
  - toggling from `<li hidden={true}>` to `<li hidden={false}>` will get the CSS to animate in and out
- [ ] Have the message auto-hide after 6 seconds
- [ ] Let the user click the close button to hide messages sooner
- [ ] If you edit/delete multiple records quickly, do all of the messages persist? If not, can you figure out how to get them to? Protip: you can do this all in the frontend, no need to mess with the session.

## 💻 Super easy!

Now that everything is set up, you can `addToast` in any action.

- [ ] Add a toast message to the `destroy` route action.
- [ ] BONUS: ensure it works without JavaScript (just for fun)

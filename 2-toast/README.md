# Toast Messages!

Most toast message abstractions in React focus on the frontend and use events/effects to trigger them.

With Remix we can use more "traditional" toast messages (aka "flash messages") with serverside sessions and then add add a little pizzazz on the front end, but trigger them on the back end with route actions instead of client side events and effects.

Once the plumbing is done from the root loader and the `<Toast>` component, adding messages is as simple as calling a function in your `action`.

## 💻 Implement Toast Messages Basics

- [ ] Create a cookie session to add messages to in `toast/toast.server.ts`
- [ ] Read the messages from the toast session in the root route (might want to hard code some initially to get the rendering working)
  - Don't forget to commit the session in the `Set-Cookie` header!
- [ ] Pass the messages to the `<Toast />` component in the root route
- [ ] Add a toast message in the `edit` route action.
  - Don't forget to commit the session in the `Set-Cookie` header!
- [ ] Add a toast message to the `destroy` route action.

## 💻 Implement Frontend goodies

- [ ] Get the toast to animate in
  - toggling from `<li hidden={true}>` to `<li hidden={false}>` will get the CSS to animate in and out
- [ ] Have the message auto-hide after 6 seconds
- [ ] Let the user click the close button to hide messages sooner
- [ ] BONUS: ensure it works without JavaScript (just for fun)

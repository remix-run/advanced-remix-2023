# Caching!

For the end of this exercise you'll need Redis installed. If you'd rather not, that's fine, but it's not usually difficult to get running locally.

## Redis with Docker

Docker is the easiest way to run redis. If you don't have docker installed, Docker Desktop is a pretty easy, non-intrusive way to run it.

- [Windows](https://docs.docker.com/desktop/install/windows-install/)
- [MacOS](https://docs.docker.com/desktop/install/mac-install/)

Once docker is installed and running, you should be able to run this from the command line:

```sh
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

## Installing Redis Directly

If you'd rather not use docker, you can install redis directly:

- [Redis Installation Instructions](https://developer.redis.com/develop/node/gettingstarted/)

## 💻 Add different types of caching!

If the requests to github start failing, go get a token and add it to your `.env` file:

You can get a token here: https://github.com/settings/tokens

### HTTP Cache Control

- [ ] Add cache-control headers to the responses
- Check the network tab to see when they come from cache
- [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

### Memory

- [ ] Implement the interface in the `cache.memory.ts` file and use it in loaders instead of cache headers.
- What kind of object/constructor does JavaScript provide for key:value storage?

### LRU Cache (also memory)

- [ ] Implement `cache.lru.ts` and use that in loaders
- [lru-cache docs](https://github.com/isaacs/node-lru-cache)

### Redis

- [ ] Implement `cache.redis.ts`
- [node redis docs](https://redis.js.org/)
- Honestly, the type hints are probably easier to figure out how to use it 😅

## Discussion

What are the different tradeoffs between these kinds of caches?

- How many users get to use the cache?
- What happens when the server restarts
- What if you're using serverless deployment vs. long running apps?
- What would introducing a CDN effect?

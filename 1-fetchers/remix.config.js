/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "./final",
  serverModuleFormat: "cjs",
  tailwind: true,
  future: {
    unstable_dev: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("drip", "./store/route.tsx");
    });
  },
};

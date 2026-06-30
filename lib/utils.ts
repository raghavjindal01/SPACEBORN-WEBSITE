export const optimizeCloudinary = (url: string) =>
  url.replace(
    "/video/upload/",
    "/video/upload/f_auto,q_auto:good/"
  );

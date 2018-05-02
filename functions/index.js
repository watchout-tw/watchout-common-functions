export function getPlatformShareURLs(url) {
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}`,
    line: `https://social-plugins.line.me/lineit/share?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
  }
}

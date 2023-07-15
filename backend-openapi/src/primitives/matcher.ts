/**
 * Matches URLs with http(s) protocol.
 */
export class HttpUrlMatcher {

  private static readonly regexp: RegExp = new RegExp(/^https?:\/\//i);

  public match(url: string): boolean { return HttpUrlMatcher.regexp.test(url); }
}

/**
 * Matches URLs based on a user-defined pattern.
 */
export class BoundaryUrlMatcher {

  private readonly url: string;
  private readonly regexp: RegExp;

  constructor(url: string, regexp: string) {
    this.url = url;
    this.regexp = new RegExp(regexp, "i");
  }

  public match(url: string): boolean {
    return url === this.url || this.regexp.test(url);
  }
}

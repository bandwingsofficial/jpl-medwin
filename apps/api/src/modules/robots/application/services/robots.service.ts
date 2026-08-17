import { Injectable } from '@nestjs/common';

@Injectable()
export class RobotsService {
  private readonly baseUrl = 'https://jplmedwin.com';

  generate(): string {
    return `User-agent: *
Allow: /

# Private / authenticated pages
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /wishlist/
Disallow: /login/
Disallow: /verify-otp/
Disallow: /search/

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml
`;
  }
}
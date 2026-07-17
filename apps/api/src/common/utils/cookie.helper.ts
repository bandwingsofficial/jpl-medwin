// import { Response as ExpressResponse } from 'express';

// type TokenPayload = {
//   accessToken: string;
//   refreshToken: string;
// };

// export class CookieHelper {
//   static setAuthCookies(
//     res: ExpressResponse,
//     tokens: TokenPayload,
//   ) {
//     const isProd = process.env.NODE_ENV === 'production';

//     res.cookie('accessToken', tokens.accessToken, {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: 'lax',
//       maxAge: 15 * 60 * 1000,
//     });

//     res.cookie('refreshToken', tokens.refreshToken, {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//   }

//   static clearAuthCookies(res: ExpressResponse) {
//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');
//   }
// }

import { Response as ExpressResponse } from 'express';

type TokenPayload = {
  accessToken: string;
  refreshToken: string;
};

export class CookieHelper {
  static setAuthCookies(res: ExpressResponse, tokens: TokenPayload) {
    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,

      secure: isProd,

      sameSite: isProd ? ('none' as const) : ('lax' as const),

      path: '/',

      // OPTIONAL
      // helps consistency
      domain: undefined,
    };

    // ACCESS TOKEN
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,

      maxAge: 15 * 60 * 1000,
    });

    // REFRESH TOKEN
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clearAuthCookies(res: ExpressResponse) {
    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,

      secure: isProd,

      sameSite: isProd ? ('none' as const) : ('lax' as const),

      path: '/',
    };

    res.clearCookie('accessToken', cookieOptions);

    res.clearCookie('refreshToken', cookieOptions);
  }
}

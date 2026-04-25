import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/reglas'],
        disallow: [
          '/liga/',
          '/jornada/',
          '/clasificacion/',
          '/grupos/',
          '/resultados/',
          '/perfil/',
          '/onboarding/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://furvo.com/sitemap.xml',
  }
}

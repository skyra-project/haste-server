process.env.NODE_ENV ??= 'development';

import '@nuxt/fonts';
import '@vite-pwa/nuxt';
import 'nuxt';
import 'nuxt-rate-limit';

import { envParseInteger, envParseString } from '@skyra/env-utilities';

const description = 'Hastebin for developers, by developers.';

const manifestIcons = [
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-36x36.png', sizes: '36x36', type: 'image/png', purpose: 'any badge' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-48x48.png', sizes: '48x48', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-72x72.png', sizes: '72x72', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-96x96.png', sizes: '96x96', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-144x144.png', sizes: '144x144', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-256x256.png', sizes: '256x256', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-384x384.png', sizes: '384x384', type: 'image/png' },
	{ src: 'https://hastebin.skyra.pw/seo/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
];

// const staticDocuments = {
// 	about: new URL('../README.md', import.meta.url)
// };

// async function loadStaticDocuments() {
// 	const loadedDocuments = [];
// 	for (const [name, path] of Object.entries(staticDocuments)) {
// 		const data = await readFile(path, 'utf-8');

// 		if (data) {
// 			loadedDocuments.push({ name, data });
// 		}
// 	}

// 	return loadedDocuments;
// }

export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/fonts', '@vite-pwa/nuxt', 'nuxt-rate-limit', '@nuxt/ui'],
	css: ['~/assets/css/main.css'],
	fonts: {
		families: [
			{ name: 'Fira Code', provider: 'google' },
			{ name: 'Roboto', provider: 'google', weights: [400, 500] }
		],
		priority: ['bunny', 'google'],
		experimental: {
			addPreloadLinks: true
		}
	},
	runtimeConfig: {
		keyLength: 10,
		maxLength: 400_000,
		rateLimits: {
			max: 500,
			timeWindow: '1 minute'
		},
		redisExpire: undefined
	},
	nuxtRateLimit: {
		routes: {
			'/*': {
				maxRequests: envParseInteger('RATE_LIMIT_MAX', 500),
				intervalSeconds: envParseInteger('RATE_LIMIT_INTERVAL_SECONDS', 60)
			}
		}
	},
	pwa: {
		registerType: 'autoUpdate',
		includeManifestIcons: false,
		devOptions: {
			enabled: false,
			type: 'module'
		},
		manifest: {
			background_color: '#282C34',
			categories: ['haste', 'bin', 'skyra', 'hastebin', 'paste', 'pastebin'],
			description,
			display: 'minimal-ui',
			lang: 'en',
			name: 'Hastebin',
			orientation: 'portrait-primary',
			scope: '/',
			short_name: 'Hastebin',
			start_url: '/',
			theme_color: '#282C34',
			icons: manifestIcons,
			shortcuts: [
				{
					name: 'Hastebin Home',
					short_name: 'Hastebin',
					description: 'Go to Hastebin',
					url: '/',
					icons: manifestIcons
				}
			]
		}
	},
	typescript: {
		shim: false
	},
	nitro: {
		storage: {
			redis: {
				driver: 'redis',
				host: envParseString('REDIS_HOST', '127.0.0.1'),
				port: envParseInteger('REDIS_PORT', 6379),
				password: envParseString('REDIS_PASSWORD', null),
				db: envParseInteger('REDIS_DB', 0)
			}
		}
	},
	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Hastebin',
			htmlAttrs: { lang: 'en' },
			link: [
				{ rel: 'manifest', href: '/seo/site.webmanifest' },
				{ rel: 'alternate', href: 'https://hastebin.skyra.pw' },
				{ rel: 'canonical', href: 'https://hastebin.skyra.pw' },
				{ rel: 'apple-touch-icon', href: '/seo/apple-touch-icon.png' },
				{ rel: 'apple-touch-startup-image', href: '/seo/apple-startup.png' },
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'icon', href: '/seo/favicon-16x16.png' },
				{ rel: 'icon', href: '/seo/android-chrome-192x192.png' },
				{ rel: 'icon', href: '/seo/favicon-32x32.png' },
				{ rel: 'mask-icon', href: '/seo/safari-pinned-tab.svg' },
				{ rel: 'shortcut icon', href: '/favicon.ico' }
			],
			meta: [
				{ 'http-equiv': 'Cache-Control', content: '1y' },
				{ 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
				{ 'http-equiv': 'Expires', content: '1y' },
				{ 'http-equiv': 'Page-Enter', content: 'RevealTrans(Duration=2.0,Transition=2)' },
				{ 'http-equiv': 'Page-Exit', content: 'RevealTrans(Duration=3.0,Transition=12)' },
				{ 'http-equiv': 'Pragma', content: '1y' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
				{ name: 'apple-mobile-web-app-title', content: 'Hastebin' },
				{ name: 'application-name', content: 'Hastebin' },
				{ name: 'audience', content: 'all' },
				{ name: 'author', content: `Skyra Project, contact@skyra.pw` },
				{ name: 'coverage', content: 'Worldwide' },
				{ name: 'description', content: description },
				{ name: 'designer', content: `Skyra Project, contact@skyra.pw` },
				{ name: 'distribution', content: 'Global' },
				{ name: 'googlebot', content: 'index,follow' },
				{ name: 'HandheldFriendly', content: 'True' },
				{ name: 'identifier-URL', content: 'https://hastebin.skyra.pw' },
				{ name: 'keywords', content: 'haste, bin, skyra, hastebin, paste, pastebin' },
				{ name: 'msapplication-config', content: '/seo/browserconfig.xml' },
				{ name: 'msapplication-TileColor', content: '#282C34' },
				{ name: 'msapplication-TileImage', content: '/seo/mstile-144x144.png' },
				{ name: 'owner', content: `Skyra Project, contact@skyra.pw` },
				{ name: 'rating', content: 'safe for kids' },
				{ name: 'reply-to', content: 'contact@skyra.pw' },
				{ name: 'revisit-after', content: '7 days' },
				{ name: 'robots', content: 'archive,follow,imageindex,index,odp,snippet,translate' },
				{ name: 'shortlink', content: 'https://hastebin.skyra.pw' },
				{ name: 'subject', content: description },
				{ name: 'summary', content: description },
				{ name: 'target', content: 'all' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:creator', content: '@Favna_' },
				{ name: 'twitter:image', content: 'https://hastebin.skyra.pw/seo/apple-touch-icon-180x180.png' },
				{ name: 'twitter:site', content: '@Favna_' },
				{ name: 'url', content: 'https://hastebin.skyra.pw' },
				{ property: 'og:description', content: description },
				{ property: 'og:email', content: 'contact@skyra.pw' },
				{ property: 'og:image:alt', content: 'OpenGraphImage' },
				{ property: 'og:image', content: 'https://hastebin.skyra.pw/seo/apple-touch-icon-180x180.png' },
				{ property: 'og:image:height', content: '180' },
				{ property: 'og:image:width', content: '180' },
				{ property: 'og:locale', content: 'en' },
				{ property: 'og:site_name', content: 'Hastebin' },
				{ property: 'og:title', content: 'Hastebin' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://hastebin.skyra.pw' }
			]
		}
	}
});

import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import './index.css';
import './lib/hljsConfig.js';

import { Haste } from './lib/Haste.js';

const app = new Haste('Hastebin');

async function handleInitialiseState(shouldPushRouteState = true) {
	const path = window.location.pathname;
	if (path === '/') {
		app.newDocument();

		if (shouldPushRouteState) {
			app.pushRouteState();
		}
	} else {
		await app.loadDocument(path.substring(1, path.length));
	}
}

void handleInitialiseState();

window.addEventListener('popstate', () => handleInitialiseState(false));

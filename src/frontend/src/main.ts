import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import './index.css';
import './lib/hljsConfig.js';

import { Haste } from './lib/Haste.js';

const app = new Haste('hastebin');

const handlePop = async () => {
	const path = window.location.pathname;
	if (path === '/') {
		app.newDocument();
	} else {
		await app.loadDocument(path.substring(1, path.length));
	}
};

void handlePop();

import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { Haste } from './lib/Haste';
import './lib/hljsConfig';

const app = new Haste('hastebin');

const handlePop = () => {
	const path = window.location.pathname;
	if (path === '/') {
		app.newDocument();
	} else {
		app.loadDocument(path.substring(1, path.length));
	}
};

handlePop();

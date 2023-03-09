import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import 'regenerator-runtime/runtime';
import { Haste } from './scripts/Haste';
import './scripts/hljsConfig';
import './styles/application.scss';

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

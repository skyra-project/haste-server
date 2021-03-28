import '@pnotify/core/dist/PNotify.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import 'regenerator-runtime/runtime';
import { Haste } from './scripts/Haste';
import './styles/application.scss';

const app = new Haste('hastebin');

const handlePop = () => {
	const path = window.location.pathname;
	if (path === '/') {
		app.newDocument(true);
	} else {
		app.loadDocument(path.substring(1, path.length));
	}
};

handlePop();

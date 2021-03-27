import 'regenerator-runtime/runtime';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import './styles/application.scss';
import { Haste } from './scripts/Haste';

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

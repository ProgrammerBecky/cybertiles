import { TextureLoader, ImageLoader } from 'three';
import './polyfill.js'
import { worldAnalyse } from './workerUtils/worldAnalyse.js';
import { worldLoad } from './workerUtils/worldLoad.js';

self.onmessage = (e) => {
	const type = e.data.type;
	if( type === 'world-analyse' ) {
		worldAnalyse( e.data.canvas );
	}
	else if( type === 'world-load' ) {
		worldLoad();
	}
};

self.postMessage({type: 'ready'});
import { analyseMap } from './workerUtils/analyseMap.js';
import { buildGeo } from './workerUtils/buildGeo.js';

self.onmessage = (e) => {
	const type = e.data.type;
	
	if( type === 'mapdata' ) {
		buildGeo( analyseMap( e.data.data ) );
	}
};

console.log( 'worker' );
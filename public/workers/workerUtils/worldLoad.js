import {
	BufferGeometry,
} from 'three';

export const worldLoad = async () => {
	
	for( let id=1 ; id<=18 ; id++ ) {
		
		const xhttp = new XMLHttpRequest();
		xhttp.open( 'GET', `/3d/city/City-${id}.json` );
		xhttp.onreadystatechange = () => {
			if( xhttp.readyState === 4 && xhttp.status === 200 ) {
				createMeshes( JSON.parse( xhttp.responseText ) );
			}
		}
		xhttp.send( null );
	}
	
}
export const createMeshes = ( objects ) => {
	
	objects.forEach( object => {
		self.postMessage({
			type: 'object-load',
			objectData: object,
		});
	});
	
}

self.postMessage({
	type: 'init',
});

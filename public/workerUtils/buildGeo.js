import {
	Shape,
	ExtrudeGeometry,
} from './../node_modules/three/src/Three.js';

export const buildGeo = ( areaMatrix ) => {

	areaMatrix.forEach( (areas,terrainType) => {
		if( terrainType === 0 ) {
			buildFloor( areas );
		}
		else if( terrainType === 1 ) {
			buildWalls( areas );
		}
		
	});
	
}

const buildWalls = ( areas ) => {
	for( let materialIndex=1 ; materialIndex<=255 ; materialIndex++ ) {

		const vertices = new Array();
		
		areas.filter( area => area.tile === materialIndex ).forEach( area => {
	
			vertices.push( area.startX , 0 , area.startZ );
			vertices.push( area.startX , 5 , area.startZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ );

			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			vertices.push( area.startX , 5 , area.startZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ );
			
			vertices.push( area.startX , 0 , area.startZ );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX , 5 , area.startZ );
			
			vertices.push( area.startX , 5 , area.startZ );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX , 5 , area.startZ+area.sizeZ );
			
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX , 5 , area.startZ+area.sizeZ );
			
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ+area.sizeZ );			
			vertices.push( area.startX , 5 , area.startZ+area.sizeZ );

			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			
			vertices.push( area.startX+area.sizeX , 5 , area.startZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			
			vertices.push( area.startX+area.sizeX , 5 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ );
			vertices.push( area.startX , 5 , area.startZ );
			
			vertices.push( area.startX , 5 , area.startZ );
			vertices.push( area.startX , 5 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 5 , area.startZ+area.sizeZ );
		});
		
		if( vertices.length > 0 ) {
			self.postMessage({
				type: 'tileSurface',
				vertices,
				materialIndex,
			});
		}
	}
}

const buildFloor = ( areas ) => {
	for( let materialIndex=0 ; materialIndex<=255 ; materialIndex++ ) {

		const vertices = new Array();
		
		areas.filter( area => area.tile === materialIndex ).forEach( area => {
			
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			vertices.push( area.startX , 0 , area.startZ );
			
			vertices.push( area.startX , 0 , area.startZ );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );

		});
		
		if( vertices.length > 0 ) {
			self.postMessage({
				type: 'tileSurface',
				vertices,
				materialIndex,
			});
		}
	}

}

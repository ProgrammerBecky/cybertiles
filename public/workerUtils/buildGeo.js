const CELL_SIZE = 0.5;
const CELL_HEIGHT = 10;
const UV_SCALE = 1/16;


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
		const uv = new Array();
		
		areas.filter( area => area.tile === materialIndex ).forEach( area => {
	
			//x-axis , y-axis
			vertices.push( area.startX , 0 , area.startZ );
			uv.push( area.startX , 0 );
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startX , CELL_HEIGHT );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			uv.push( area.startX+area.sizeX , 0 );

			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			uv.push( area.startX+area.sizeX , 0 );
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startX , CELL_HEIGHT );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ );
			uv.push( area.startX+area.sizeX , CELL_HEIGHT );
			
			//z-axis, y-axis
			vertices.push( area.startX , 0 , area.startZ );
			uv.push( area.startZ , 0 );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , 0 );
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startZ , CELL_HEIGHT );
			
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startZ , CELL_HEIGHT );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , 0 );
			vertices.push( area.startX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , CELL_HEIGHT );
			
			//x-axis , y-axis
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX , 0 );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , 0 );
			vertices.push( area.startX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX , CELL_HEIGHT );
			
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , 0 );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , CELL_HEIGHT );
			vertices.push( area.startX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX , CELL_HEIGHT );

			//z-axis, y-axis
			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			uv.push( area.startZ , 0 );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ );
			uv.push( area.startZ , CELL_HEIGHT );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , 0 );
			
			vertices.push( area.startX+area.sizeX , 1 , area.startZ );
			uv.push( area.startZ , CELL_HEIGHT );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , CELL_HEIGHT );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startZ+area.sizeZ , 0 );
			
			//x-axis, z-axis
			vertices.push( area.startX+area.sizeX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ );
			uv.push( area.startX+area.sizeX , area.startZ );
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startX , area.startZ );
			
			vertices.push( area.startX , 1 , area.startZ );
			uv.push( area.startX , area.startZ );
			vertices.push( area.startX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 1 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
		});
		
		if( vertices.length > 0 ) {
			self.postMessage({
				type: 'tileSurface',
				vertices: applyVerticesScale( vertices ),
				uv: applyUvScale( uv ),
				materialIndex,
			});
		}
	}
}

const buildFloor = ( areas ) => {
	for( let materialIndex=0 ; materialIndex<=255 ; materialIndex++ ) {

		const vertices = new Array();
		const uv = new Array();
		
		areas.filter( area => area.tile === materialIndex ).forEach( area => {
			
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ );
			uv.push( area.startX+area.sizeX , area.startZ );
			vertices.push( area.startX , 0 , area.startZ );
			uv.push( area.startX , area.startZ );
			
			vertices.push( area.startX , 0 , area.startZ );
			uv.push( area.startX , area.startZ );
			vertices.push( area.startX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX , area.startZ+area.sizeZ );
			vertices.push( area.startX+area.sizeX , 0 , area.startZ+area.sizeZ );
			uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
			
		});
		
		if( vertices.length > 0 ) {
			self.postMessage({
				type: 'tileSurface',
				vertices: applyVerticesScale( vertices ),
				uv: applyUvScale( uv ),
				materialIndex,
			});
		}
	}

}

const applyVerticesScale = ( vertices ) => {
	for( let i=0 ; i<vertices.length ; i+=3 ) {
		vertices[i+0] *= CELL_SIZE;
		vertices[i+1] *= CELL_HEIGHT;
		vertices[i+2] *= CELL_SIZE;
	}
	return vertices;
}

const applyUvScale = ( uv ) => {
	return uv.map( uv => uv *= UV_SCALE );
}
const CELL_SIZE = 0.25;
const CELL_HEIGHT = 10;
const UV_SCALE = 1/16;


export const buildGeo = ( areaMatrix ) => {

	areaMatrix.forEach( (areas,terrainType) => {
		if( terrainType === 0 ) {
			buildFloor( areas );
		}
		else if( terrainType === 1 ) {
			buildPatternWalls( areas );
			//buildWalls( areas );
		}
		
	});
	
}

const buildPatternWalls = ( areas ) => {
	for( let materialIndex=0; materialIndex<=255 ; materialIndex++ ) {
	
		let vertices = new Array();
		let uv = new Array();
		
		areas.filter( area => area.tile === materialIndex ).forEach( area => {
			
			const pattern = area.pattern;
			console.log( 'PATTERN', pattern );
			
			const blocks = [
				( pattern & 1 ) !== 0,
				( pattern & 2 ) !== 0,
				( pattern & 4 ) !== 0,
				( pattern & 8 ) !== 0,
				( pattern & 16 ) !== 0,
				( pattern & 32 ) !== 0,
				( pattern & 64 ) !== 0,
				( pattern & 128 ) !== 0
			];
			
			const strips = [];
			blocks.forEach( (block,index) => {
				if( block ) {
					if( strips.length > 0 && strips[ strips.length -1 ].end === index -1 ) {
						strips[ strips.length - 1 ].end = index;
					}
					else {
						strips.push({
							start: index,
							end: index,
						});
					}
				}
			});
			
			strips.forEach( strip => {
				const { modifiedUv, modifiedVertices } = buildWallBlock( area , strip.start/8 , (1+strip.end)/8 , vertices , uv );
				uv = modifiedUv;
				vertices = modifiedVertices;
			});
			console.log( 'blocks', blocks , strips );
			
		});
		
		//return buildWalls( areas );
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
const buildWallBlock = ( area , minHeight , maxHeight , vertices , uv ) => {

	const uvMinHeight = minHeight * CELL_HEIGHT;
	const uvMaxHeight = maxHeight * CELL_HEIGHT;
	
	//x-axis , y-axis
	vertices.push( area.startX , minHeight , area.startZ );
	uv.push( area.startX , uvMinHeight );
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startX , uvMaxHeight );
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ );
	uv.push( area.startX+area.sizeX , uvMinHeight );

	vertices.push( area.startX+area.sizeX , minHeight , area.startZ );
	uv.push( area.startX+area.sizeX , uvMinHeight );
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startX , uvMaxHeight );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ );
	uv.push( area.startX+area.sizeX , uvMaxHeight );
	
	//z-axis, y-axis
	vertices.push( area.startX , minHeight , area.startZ );
	uv.push( area.startZ , uvMinHeight );
	vertices.push( area.startX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMinHeight );
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startZ , uvMaxHeight );
	
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startZ , uvMaxHeight );
	vertices.push( area.startX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMinHeight );
	vertices.push( area.startX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMaxHeight );
	
	//x-axis , y-axis
	vertices.push( area.startX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startX , uvMinHeight );
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startX+area.sizeX , uvMinHeight );
	vertices.push( area.startX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX , uvMaxHeight );
	
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startX+area.sizeX , uvMinHeight );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX+area.sizeX , uvMaxHeight );
	vertices.push( area.startX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX , uvMaxHeight );

	//z-axis, y-axis
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ );
	uv.push( area.startZ , uvMinHeight );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ );
	uv.push( area.startZ , uvMaxHeight );
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMinHeight );
	
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ );
	uv.push( area.startZ , uvMaxHeight );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMaxHeight );
	vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
	uv.push( area.startZ+area.sizeZ , uvMinHeight );

	//x-axis, z-axis	
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ );
	uv.push( area.startX+area.sizeX , area.startZ );
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startX , area.startZ );
	
	vertices.push( area.startX , maxHeight , area.startZ );
	uv.push( area.startX , area.startZ );
	vertices.push( area.startX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX , area.startZ+area.sizeZ );
	vertices.push( area.startX+area.sizeX , maxHeight , area.startZ+area.sizeZ );
	uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );

	//x-axis, z-axis	
	if( minHeight > 0 ) {
		vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
		uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
		vertices.push( area.startX , minHeight , area.startZ );
		uv.push( area.startX , area.startZ );
		vertices.push( area.startX+area.sizeX , minHeight , area.startZ );
		uv.push( area.startX+area.sizeX , area.startZ );
		
		vertices.push( area.startX , minHeight , area.startZ );
		uv.push( area.startX , area.startZ );
		vertices.push( area.startX+area.sizeX , minHeight , area.startZ+area.sizeZ );
		uv.push( area.startX+area.sizeX , area.startZ+area.sizeZ );
		vertices.push( area.startX , minHeight , area.startZ+area.sizeZ );
		uv.push( area.startX , area.startZ+area.sizeZ );
	}
	
	return { modifiedUv: uv, modifiedVertices: vertices };
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
export const buildGeo = ( areaMatrix ) => {

	areaMatrix.forEach( (areas,terrainType) => {
		
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
					terrainType,
					materialIndex,
				});
			}
		}
		
	});

}

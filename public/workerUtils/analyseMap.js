
let areaCoverage = [[],[],[]];

const analyseMap = ( image ) => {
	areaCoverage = [[],[],[]];
	
	for( let x=0 ; x<image.width ; x++ ) {
		for( let z=0 ; z<image.height ; z++ ) {
			const index = ((z*image.width)+x)*4;
			const floor = image.data[ index + 0 ];
			const wall = image.data[ index + 1 ];
			const pattern = image.data[ index + 2 ];
			
			const walls = getWalls( image , index );
			
			getColourSize( image, floor , 0 , x , z , undefined , undefined );
			getColourSize( image, wall , 1 , x , z , pattern , walls);
		}
	}
	
	return areaCoverage;
}

const getColourSize = ( image, matchValue , offset , startX , startZ, pattern, walls ) => {
	
	if( isInCoverage( offset, startX, startZ ) ) return false;

	let size = 1;
	while( checkBoxStrips( image, matchValue, offset, startX, startZ , size , size, pattern, walls ) ) {
		size++;
	}
	
	let sizeX = size;
	let sizeZ = size;
	
	while( checkZstrips( image, matchValue, offset, startX+sizeX, startZ , sizeZ -1, pattern, walls ) ) {
		sizeX++;
	}

	while( checkXstrips( image, matchValue, offset, startX, startZ+sizeZ , sizeX -1, pattern, walls ) ) {
		sizeZ++;
	}
	
	areaCoverage[ offset ].push({
		startX,
		startZ,
		sizeX,
		sizeZ,
		pattern,
		tile: matchValue,
		walls,
	});
	
}

const checkXstrips = ( image, matchValue , offset , startX , startZ , size, pattern, walls ) => {
	
	for( let x=startX ; x<=startX+size ; x++ ) {
		const z = startZ;
		
		if( x >= image.width ) return false;
		if( z >= image.height ) return false;
	
		if( isInCoverage(offset,x,z) ) return false;

		const index = ((z*image.width)+x)*4;
		const tile = image.data[ index+offset ];
		if( tile !== matchValue ) return false;
		
		if( pattern ) {
			const targetPattern = image.data[ index+2 ];
			if( pattern !== targetPattern ) return false;
		}
		
		if( walls ) {
			const localWalls = getWalls( image, index );
			if( localWalls[0] !== walls[0] ) return false;
			if( localWalls[1] !== walls[1] ) return false;
			if( localWalls[2] !== walls[2] ) return false;
			if( localWalls[3] !== walls[3] ) return false;
		}
	}	
	
	return true;
}

const checkZstrips = ( image, matchValue , offset , startX , startZ , size, pattern, walls ) => {

	for( let z=startZ ; z<=startZ+size ; z++ ) {
		const x = startX;
		
		if( x >= image.width ) return false;
		if( z >= image.height ) return false;
		
		if( isInCoverage(offset,x,z) ) return false;

		const index = ((z*image.width)+x)*4;
		const tile = image.data[ index+offset ];
		if( tile !== matchValue ) return false;
		
		if( pattern ) {
			const targetPattern = image.data[ index+2 ];
			if( pattern !== targetPattern ) return false;
		}
		
		if( walls ) {
			const localWalls = getWalls( image, index );
			if( localWalls[0] !== walls[0] ) return false;
			if( localWalls[1] !== walls[1] ) return false;
			if( localWalls[2] !== walls[2] ) return false;
			if( localWalls[3] !== walls[3] ) return false;
		}
		
	}
	
	return true;
}

const checkBoxStrips = ( image, matchValue , offset , startX , startZ , sizeX , sizeZ, pattern, walls ) => {
	
	if( checkXstrips( image, matchValue , offset , startX , startZ+sizeZ , sizeX, pattern, walls ) ) {
		if( checkZstrips( image, matchValue , offset , startX+sizeX , startZ , sizeX, pattern, walls ) ) {
			return true;
		}
	}
	
	return false;
}

const isInCoverage = ( offset,x,z ) => {
	const isCovered = areaCoverage[offset].find( (area) => {
		if(
			area.startX <= x &&
			area.startX+area.sizeX > x &&
			area.startZ <= z &&
			area.startZ+area.sizeZ > z
		) {
			return true;
		}
	});

	if( isCovered ) return true;	
	return false;
}

const getWalls = ( image , index ) => {
	let wallN = false, wallE = false, wallS = false, wallW = false;
	
	const indexN = index-image.width*4;
	if( indexN>=0 ) {
		wallN = image.data[ indexN+2 ] === 255;
	}
	
	const indexE = index + 4;
	if( indexE < image.width ) {
		wallE = image.data[ indexE+2 ] === 255;
	}
	
	const indexS = index+image.width*4;
	if( indexS>=0 ) {
		wallS = image.data[ indexS+2 ] === 255;
	}
	
	const indexW = index - 4;
	if( indexW>=0 ) {
		wallW = image.data[ indexW+2 ] === 255;
	}
	
	return [ wallN,wallE,wallS,wallW ];	
}

export { analyseMap };
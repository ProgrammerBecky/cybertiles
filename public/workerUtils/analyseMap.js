
let areaCoverage = [[],[],[]];

const analyseMap = ( image ) => {
	areaCoverage = [[],[],[]];
	
	for( let x=0 ; x<image.width ; x++ ) {
		for( let z=0 ; z<image.height ; z++ ) {
			const index = ((z*image.width)+x)*4;
			const floor = image.data[ index + 0 ];
			const wall = image.data[ index + 1 ];
			const object = image.data[ index + 2 ];
			
			getColourSize( image, floor , 0 , x , z );
			getColourSize( image, wall , 1 , x , z );
		}
	}
	
	return areaCoverage;
}

const getColourSize = ( image, matchValue , offset , startX , startZ ) => {
	
	if( isInCoverage( offset, startX, startZ ) ) return false;

	let size = 1;
	while( checkBoxStrips( image, matchValue, offset, startX, startZ , size , size ) ) {
		size++;
	}
	
	let sizeX = size;
	let sizeZ = size;
	
	while( checkZstrips( image, matchValue, offset, startX+sizeX, startZ , sizeZ -1 ) ) {
		sizeX++;
	}

	while( checkXstrips( image, matchValue, offset, startX, startZ+sizeZ , sizeX-1 ) ) {
		sizeZ++;
	}
	
	
	areaCoverage[ offset ].push({
		startX,
		startZ,
		sizeX,
		sizeZ,
		tile: matchValue,
	});
	
}

const checkXstrips = ( image, matchValue , offset , startX , startZ , size ) => {
	
	for( let x=startX ; x<=startX+size ; x++ ) {
		const z = startZ;
		
		if( x >= image.width ) return false;
		if( z >= image.height ) return false;
	
		if( isInCoverage(offset,x,z) ) return false;

		const index = ((z*image.width)+x)*4;
		const tile = image.data[ index+offset ];
		if( tile !== matchValue ) return false;
	}	
	
	return true;
}

const checkZstrips = ( image, matchValue , offset , startX , startZ , size ) => {

	for( let z=startZ ; z<=startZ+size ; z++ ) {
		const x = startX;
		
		if( x >= image.width ) return false;
		if( z >= image.height ) return false;
		
		if( isInCoverage(offset,x,z) ) return false;

		const index = ((z*image.width)+x)*4;
		const tile = image.data[ index+offset ];
		if( tile !== matchValue ) return false;
	}
	
	return true;
}

const checkBoxStrips = ( image, matchValue , offset , startX , startZ , sizeX , sizeZ ) => {
	
	if( checkXstrips( image, matchValue , offset , startX , startZ+sizeZ , sizeX ) ) {
		if( checkZstrips( image, matchValue , offset , startX+sizeX , startZ , sizeX ) ) {
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

export { analyseMap };
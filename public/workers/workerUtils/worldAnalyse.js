import {
	Vector3,
	Quaternion,
	Scene,
} from 'three';
import { FBXLoader } from 'jsm/loaders/FBXLoader.js';

let objects = {};

export const worldAnalyse = () => {
	
	const fbx = new FBXLoader();
	fbx.load( './../../3d/source/City-Maker.fbx' , result => {
		objects = [];
		const scene = new Scene();
		scene.add( result );
		scene.updateWorldMatrix( true , true );
		scanObject( result );
		despatchFilesToSave( objects );
		scene.remove( result );
	});
}

const scanObject = (parent) => {
	parent.traverse( child => {
		if( child , child.isMesh ) {
			addToObjects( child );
		}
	});
}

const addToObjects = ( child ) => {

	child.updateMatrixWorld( true );
	child.updateMatrix();

	const position = child.geometry.getAttribute( 'position' );
	const uv = child.geometry.getAttribute( 'uv' );
	const normal = child.geometry.getAttribute( 'normal' );

	let checksum;
	if( uv && normal && child.name.indexOf( 'Collider') === -1 ) {
		checksum = position.count + uv.count + normal.count
			+ position.array[0] + position.array[ position.array.length - 1 ]
			+ uv.array[0] + uv.array[ uv.array.length - 1 ]
			+ normal.array[0] + normal.array[ normal.array.length - 1 ];
	}
	else if( position.count > 0 ) {
		checksum = position.count
			+ position.array[0] + position.array[ position.array.length - 1 ];
	}
	else {
		return;
	}

	if( ! objects[ checksum ] ) {	
		objects[ checksum ] = {
			name: child.name,
			position,
			uv,
			uv1: child.geometry.getAttribute( 'uv1' ),
			normal,
			material: Array.isArray( child.material ) ? child.material.map( mat => mat.name ) : [ child.material.name ],
			instances: [],
		};
	}

	let worldPos = new Vector3();
	worldPos = child.getWorldPosition( worldPos );

	let worldScale = new Vector3();
	worldScale = child.getWorldScale( worldScale );
	
	let worldQuaternion = new Quaternion();
	worldQuaternion = child.getWorldQuaternion( worldQuaternion );

	objects[ checksum ].instances.push(
		{
			position: worldPos,
			rotation: worldQuaternion,
			scale: worldScale,
		}
	);
}

export const despatchFilesToSave = ( collection ) => {
	
	let sendObj = [];
	
	for( let i in collection ) {
		
		if( sendObj.length >= 50 ) {
			self.postMessage({
				type: 'download-city',
				fileData: JSON.stringify( sendObj ),
			});
			sendObj = [];
		}
		
		sendObj.push( collection[i] );
	}
	
	if( sendObj.length > 0 ) {
		self.postMessage({
			type: 'download-city',
			fileData: JSON.stringify( sendObj ),
		});		
	}
}
import {
	Matrix4,
	BufferAttribute,
	BufferGeometry,
	Mesh,
	InstancedMesh,
	Object3D,
	MeshStandardMaterial,
} from 'three';
import { G } from './G.js';

export class World {
	
	downloadId = 0;
	
	constructor() {

		this.worker = new Worker( 'workers/WorldWorker.js');
		this.worker.onmessage = (e) => {
			const type = e.data.type;
			
			if( type === 'object-load' ) {
				this.loadObject( e.data.objectData );
			}
			else if( type === 'download-city' ) {
				
				this.downloadId++;
				
				const link = document.createElement( 'a' );
				link.setAttribute( 'download', `City-${this.downloadId}.json` );
				link.href = `data:text/json;charset-utf-8,${encodeURIComponent(e.data.fileData)}`;
				document.body.appendChild( link );
				link.click();
				link.remove();
				
			}
			else if( type === 'init' ) {
				this.worker.postMessage({
					type: 'world-load',
				});				
			}
		}
		
		/* Convert FBX to JSON
		this.worker.postMessage({
			type: 'world-analyse',
		});
		//*/
		//* World Load
		//*/

	}
	
	loadObject( object ) {
			
		const geo = new BufferGeometry();

		if( object.position ) geo.setAttribute(
			'position',
			new BufferAttribute(
				new Float32Array( object.position.array ),
				object.position.itemSize
			)
		);

		if( object.normal ) geo.setAttribute(
			'normal',
			new BufferAttribute(
				new Float32Array( object.normal.array ),
				object.normal.itemSize
			)
		);				
		
		if( object.uv ) geo.setAttribute(
			'uv',
			new BufferAttribute(
				new Float32Array( object.uv.array ),
				object.uv.itemSize
			)
		);
		
		if( object.uv1 ) geo.setAttribute(
			'uv1',
			new BufferAttribute(
				new Float32Array( object.uv1.array ),
				object.uv1.itemSize
			)
		);
		
		const mat = new MeshStandardMaterial({ color: 0x008800 });
		
		const dummy = new Object3D();
		const instance = new InstancedMesh( geo , mat , object.instances.length );
		instance.frustumCulled = false;
		object.instances.forEach( (objectInstance , index) => {
			const scale = 0.01;
			dummy.position.set(
				objectInstance.position.x * scale,
				objectInstance.position.y * scale,
				objectInstance.position.z * scale
			);
			dummy.quaternion.set(
				objectInstance.rotation[0],
				objectInstance.rotation[1],
				objectInstance.rotation[2],
				objectInstance.rotation[3]
			);
			dummy.scale.set(
				objectInstance.scale.x * scale,
				objectInstance.scale.y * scale,
				objectInstance.scale.z * scale
			);
			dummy.updateMatrix();
			instance.setMatrixAt( index , dummy.matrix.clone() );
		});
		
		/*
		object.instances.forEach( objectInstance => {
			const mesh = new Mesh( geo , mat );
			mesh.position.set( objectInstance.position.x , objectInstance.position.y , objectInstance.position.z );
			mesh.quaternion.set( objectInstance.rotation[0] , objectInstance.rotation[1] , objectInstance.rotation[2] , objectInstance.rotation[3] );
			mesh.scale.set( objectInstance.scale.x , objectInstance.scale.y , objectInstance.scale.z );		
			G.scene.add( mesh );
		});
		*/
		
		G.scene.add( instance );
	}
	
}

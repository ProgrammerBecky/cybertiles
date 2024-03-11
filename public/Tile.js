import {
	BufferAttribute, 
	BufferGeometry,
	
	MeshBasicMaterial,
	Mesh,
} from 'three';

import { G } from './../G.js';

export class Tile {

	constructor( x,z ) {
		this.x = x;
		this.z = z;
		this.worker = new Worker( 'TileWorker.js' , {
			type: 'module'
		});
		this.worker.onmessage = (e) => {
			if( e.data.type === 'tileSurface' ) {
				this.buildSurface(e.data.materialIndex , e.data.vertices);
			}
		}
		
		this.map = new Image();
		this.map.onload = () => {
			const canvas = document.createElement( 'canvas' );
			canvas.width = this.map.width;
			canvas.height = this.map.height;
			const context = canvas.getContext('2d');
			context.drawImage( this.map , 0 , 0 );
			this.worker.postMessage({
				type: 'mapdata',
				data: context.getImageData(0,0,canvas.width,canvas.height),
			});
		}
		this.map.src = `maps/tile-${this.x}-${this.z}.png`;
	}
	
	buildSurface( materialIndex , vertices) {
		
		const position = new BufferAttribute( new Float32Array(vertices) , 3 )
		const geo = new BufferGeometry();
		geo.setAttribute( 'position' , position );
		
		const mat = new MeshBasicMaterial({
			color: materialIndex === 0 ? 0x000000 : 0xff0000,
			wireframe: false,
		});
		
		const mesh = new Mesh( geo , mat );
		mesh.position.set( this.x , 0 , this.z );
		G.scene.add( mesh );
		console.log( geo );
		
	}

}
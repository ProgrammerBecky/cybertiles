import {
	MeshStandardMaterial,
	RepeatWrapping,
} from 'three';
import { G } from './../G.js';

const white = 0xffffff;

export class MaterialCache {

	cache = {};
	materialSources = [
		'concrete/clean-concrete',
		'concrete/old-concrete',
		'concrete/dirty-concrete',
		'concrete/aged-concrete',
	]

	index( id ) {
		if( ! this.cache[id] ) {
			this.loadMaterial( id );
		}
		return this.cache[id];
	}
	
	loadMaterial( id ) {
		if( this.materialSources[id] ) {
			
			const albedo = G.texture.load(`materials/${this.materialSources[id]}.jpg`);
			albedo.wrapS = albedo.wrapT = RepeatWrapping;
			
			const normal = G.texture.load(`materials/${this.materialSources[id]}N.png`);
			normal.wrapS = normal.wrapT = RepeatWrapping;
			
			this.cache[id] = new MeshStandardMaterial({
				color: white,
				map: albedo,
				normalMap: normal,
				envMap: G.environmentMap,
			});
		}
		else {
			this.cache[id] = new MeshStandardMaterial({
				color: id * 128 * 64,
			});
		}
	}
	
}
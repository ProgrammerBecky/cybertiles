import {
	MeshStandardMaterial,
	RepeatWrapping,
} from 'three';
import { G } from './../G.js';

const white = 0xffffff;

export class MaterialCache {

	cache = {};
	materialSources = [
		['grass/neat-grass',.5,.8],
		['concrete/clean-concrete',.3,.8],
		['concrete/old-concrete',.3,.8],
		['concrete/dirty-concrete',.3,.8],
		['concrete/aged-concrete',.3,.8],
		['brick/old-brick',.1,.8],
		['drywall/clean-drywall',.45,.7],
	]

	index( id ) {
		if( ! this.cache[id] ) {
			this.loadMaterial( id );
		}
		return this.cache[id];
	}
	
	loadMaterial( id ) {
		if( this.materialSources[id] ) {
			
			const albedo = G.texture.load(`materials/${this.materialSources[id][0]}.jpg`);
			albedo.wrapS = albedo.wrapT = RepeatWrapping;
			
			const normal = G.texture.load(`materials/${this.materialSources[id][0]}N.png`);
			normal.wrapS = normal.wrapT = RepeatWrapping;
			
			this.cache[id] = new MeshStandardMaterial({
				color: white,
				map: albedo,
				normalMap: normal,
				envMap: G.environmentMap,
				metalness: this.materialSources[id][1],
				roughness: this.materialSources[id][2],
				wireframe: false,
			});
		}
		else {
			this.cache[id] = new MeshStandardMaterial({
				color: id * 128 * 64,
				wireframe: false,
			});
		}
	}
	
}
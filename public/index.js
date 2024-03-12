import {
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    TextureLoader,
    WebGLRenderer,
    Clock,
    Scene,
    LinearMipMapLinearFilter,
    LinearFilter,
    CubeRefractionMapping,
    CubeTextureLoader,
} from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

import { G } from './G.js';
import { Tile } from './Tile.js';
import { MaterialCache } from './materials/MaterialCache.js';

const init3d = async () => {
    
    G.camera = new PerspectiveCamera( 45 , window.innerWidth / window.innerHeight , 1 , 768 );
    G.camera.position.y = 100;
    
    G.scene = new Scene();
    
    const cubeTextureLoader = new CubeTextureLoader();
    cubeTextureLoader.setPath( '/sky/' );
    G.environmentMap = cubeTextureLoader.load([
        'posx.jpg',
        'negx.jpg',
        'posy.jpg',
        'negy.jpg',
        'posz.jpg',
        'negz.jpg'
    ]);
    
    G.environmentMap.mapping = CubeRefractionMapping;
    G.environmentMap.magFilter = LinearFilter;
    G.environmentMap.minFilter = LinearMipMapLinearFilter;
    G.scene.background = G.environmentMap;
    
    G.ambientLight = new AmbientLight( 0xaaaaaa , 1.5 );
    G.scene.add( G.ambientLight );
    
    G.sunLight = new DirectionalLight( 0xffffff , 0.5 );
    G.sunLight.position.set( 1,1,0.5 );
    G.scene.add( G.sunLight );
    
    G.texture = new TextureLoader();
    G.gltf = new GLTFLoader();
        
	G.materialCache = new MaterialCache();
	G.tile = new Tile(0,0);	
		
    G.renderer = new WebGLRenderer({ antialias: true, canvas: document.getElementById('ThreeD') });
    G.renderer.setPixelRatio( window.devicePixelRatio );
    G.renderer.setSize( window.innerWidth , window.innerHeight );
 
    G.controls = new OrbitControls( G.camera , G.renderer.domElement );
 
    window.addEventListener( 'resize' , () => {
        G.camera.aspect = window.innerWidth / window.innerHeight;
        G.camera.updateProjectionMatrix();
        G.renderer.setSize( window.innerWidth , window.innerHeight );
    });
 
    G.clock = new Clock();
    G.clock.start();

    animate();
    
}

let elapsed = 0;
const animate = () => {
    requestAnimationFrame( animate );
    
    const delta = G.clock.getDelta();
    elapsed += delta;
    
    G.controls.update();
    G.renderer.render( G.scene , G.camera );
    
    if( Math.random() < 0.002 ) {
        console.log( G.renderer.info.render , G.renderer.memory , G.camera.position, `${(1 / delta).toFixed(2)} fps` );
    }
}

init3d();

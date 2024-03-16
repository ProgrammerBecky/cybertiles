import { ImageLoader } from 'three'
import { FBXLoader } from 'jsm/loaders/FBXLoader.js'

ImageLoader.prototype.load = (url, onLoad, onProgress, onError) => {
	if( typeof this === 'undefined' ) return;
    if (this.path) url = this.path + url

    if (this.fileLoader === undefined) {
        this.fileLoader = new FileLoader(this.manager)
        this.fileLoader.setResponseType('blob')
    }

    const onFileLoad = (blob) => {
        createImageBitmap(blob).them((image) => {
            onLoad(image)
        })
    }

    this.fileLoader.load(url, onFileLoad, onProgress, onError)
}

FBXLoader.prototype.createCamera = (relationships) => {}

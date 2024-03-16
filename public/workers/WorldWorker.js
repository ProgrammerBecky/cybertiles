const shimCodeUrl = "https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.wasm.js"
const importMap = {
	"imports": {
		"three": "./../node_modules/three/build/three.module.js",
		"jsm/": "./../node_modules/three/examples/jsm/"
	}
}
importScripts(shimCodeUrl);
importShim.addImportMap(importMap);
importShim("./WorldWorker.module.js").then((res) => {
	console.log("World Worker Loaded");
})
.catch(e => setTimeout(() => { throw e; }));

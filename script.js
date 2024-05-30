// シーン、カメラ、レンダラーの初期設定

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    canvas:this.document.querySelector('#canvas1'),
    aopha : true
})


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let monkey = new THREE.Mesh();

const loader2 = new THREE.GLTFLoader();
loader2.load('redmonkey.glb', function(object){
    monkey = object.scene;
    scene.add(monkey);
});




// 照明の追加


const light3 = new THREE.DirectionalLight(0xffffff, 1.5);
light3.position.set(5, 10, 7.5);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0x00ffff, 3);
light4.position.set(0, 0, -4);
scene.add(light4);


let alpha, beta, gamma;

window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;
}



// アニメーションループの作成
function animate() {

    requestAnimationFrame(animate);

    let v1 = new THREE.Vector3(0, 3, 0);
    //let el = new THREE.Euler(rx, rz, -ry, 'YXZ');
    let el = new THREE.Euler(gamma, beta, alpha, 'ZYX');
    v1.applyEuler(el);

    camera.position.x = v1.x;
    camera.position.y = v1.y;
    camera.position.z = v1.z;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
animate();

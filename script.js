let sensoractive = false;

function post_function( result_string ) {
    if ( result_string === "granted" ) {
        sensoractive = true;
    }
    else if ( result_string === "denied" ) {
// ユーザが拒否した場合、文字列"denied"が返る
    }
}
function permission_request() {
    if ( DeviceOrientationEvent
        && DeviceOrientationEvent.requestPermission
        && typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
DeviceMotionEvent.requestPermission().then( post_function );
window.addEventListener( "devicemotion", function(e) {
            // 何らかの処理
        }, false );
    }
    if ( DeviceOrientationEvent
        && DeviceOrientationEvent.requestPermission
        && typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
        DeviceOrientationEvent.requestPermission().then( postf_unction );
window.addEventListener( "deviceorientation", function(e) {
            // 何らかの処理
        }, false );
    }
}



const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');


const slider1 = document.getElementById('slider1');


let alpha=0, beta=Math.PI/2, gamma=0;

window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
    if(sensoractive){

        alpha = event.alpha;
        beta = event.beta;
        gamma = event.gamma;

        text1.innerHTML = 'alpha-z = ' + int(Number(alpha));
        text2.innerHTML = 'beta-x = ' + int(Number(beta));
        text3.innerHTML = 'gamma-y = ' + int(Number(gamma));

        alpha = Number(alpha)/180*Math.PI;
        beta = Number(beta)/180*Math.PI;
        gamma = Number(gamma)/180*Math.PI;

    }
}







// シーン、カメラ、レンダラーの初期設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    canvas:this.document.querySelector('#canvas1'),
    alpha : true
})


let width = window.innerWidth;
let height = window.innerHeight;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(Math.min(width,height), Math.min(width,height));


let monkey = new THREE.Mesh();

const loader2 = new THREE.GLTFLoader();
loader2.load('redmonkey.glb', function(object){
    monkey = object.scene;
    scene.add(monkey);

});



const light3 = new THREE.DirectionalLight(0xffffff, 1.5);
light3.position.set(5, 10, 7.5);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0x00ffff, 3);
light4.position.set(0, 0, -4);
scene.add(light4);


const lighta = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(lighta);






// アニメーションループの作成
function animate() {

    requestAnimationFrame(animate);

    let v1 = new THREE.Vector3(0, 3, 0);
    let el = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
    v1.applyEuler(el);



    let theta1, phi1;

    theta1 = Math.atan2(v1.y, Math.sqrt(v1.x**2 + v1.z**2));
    phi1 = Math.atan2(v1.z, v1.x) - Math.PI/2;

    

    let multi = Number(slider1.value)/100;  //角度倍率

    camera.position.x = v1.x;
    camera.position.y = v1.y;
    camera.position.z = v1.z;

    camera.position.x = 3 * Math.cos(theta1*multi) * Math.cos(phi1*multi+Math.PI/2);
    camera.position.y = 3 * Math.sin(theta1*multi);
    camera.position.z = 3 * Math.cos(theta1*multi) * Math.sin(phi1*multi+Math.PI/2);

    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}


animate();





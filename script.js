// シーン、カメラ、レンダラーの初期設定

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);


const renderer2 = new THREE.WebGLRenderer({
    canvas:this.document.querySelector('#canvas2'),
    aopha : true
})


renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(window.innerWidth, window.innerHeight);



// ジオメトリ、マテリアル、メッシュの作成
//let line1 = new THREE.LineBasicMaterial({color:0x000000});



let object2 = new THREE.Mesh();
let object3 = new THREE.Mesh();

const loader2 = new THREE.GLTFLoader();
loader2.load('redmonkey.glb', function(object){
    object2 = object.scene;
    scene2.add(object2);
});




// 照明の追加


const light3 = new THREE.DirectionalLight(0xffffff, 1.5);
light3.position.set(5, 10, 7.5);
scene2.add(light3);

const light4 = new THREE.DirectionalLight(0x00ffff, 3);
light4.position.set(0, 0, -4);
scene2.add(light4);


let rx=0, ry=0, rz=0;


// アニメーションループの作成
function animate() {
    requestAnimationFrame(animate);

    


    let v1 = new THREE.Vector3(0, 3, 0);
    let el = new THREE.Euler(rx, ry, rz, 'ZYX');
    v1.applyEuler(el);

    camera2.position.x = v1.x;
    camera2.position.y = v1.y;
    camera2.position.z = v1.z;

    camera2.lookAt(0, 0, 0);

    renderer2.render(scene2, camera2);
}
animate();



function receive(arg){
    arg = arg.split(',');
    ax = Number(arg[0])/360*2*Math.PI;
    ay = Number(arg[1])/360*2*Math.PI;
    az = Number(arg[2])/360*2*Math.PI;
}



window.addEventListener("deviceorientation", (dat) => {
    rz = dat.alpha/360*2*Math.PI;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    rx = dat.beta/360*2*Math.PI;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    ry = dat.gamma/360*2*Math.PI;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
});
 
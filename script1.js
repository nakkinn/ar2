const hypercubevts = [
    [1,1,1,1],
    [1,1,1,-1],
    [1,1,-1,1],
    [1,1,-1,-1],
    [1,-1,1,1],
    [1,-1,1,-1],
    [1,-1,-1,1],
    [1,-1,-1,-1],
    [-1,1,1,1],
    [-1,1,1,-1],
    [-1,1,-1,1],
    [-1,1,-1,-1],
    [-1,-1,1,1],
    [-1,-1,1,-1],
    [-1,-1,-1,1],
    [-1,-1,-1,-1]
];

const hypercubeedge = [
    [0,1], [2,3], [4,5], [6,7], [8,9], [10,11], [12,13], [14,15],
    [0,2], [1,3], [4,6], [5,7], [8,10], [9,11], [12,14], [13,15],
    [0,4], [1,5], [2,6], [3,7], [8,12], [9,13], [10,14], [11, 15],
    [0,8], [1,9], [2,10], [3,11], [4,12], [5,13], [6,14], [7,15],

];






let inputtouch = false;


const canvas1 = document.getElementById('canvas1');
canvas1.style.touchAction = 'none';


canvas1.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});



const label1 = document.getElementById('label1');


const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');
const slider3 = document.getElementById('slider3');

slider1.style.touchAction = 'none';
slider2.style.touchAction = 'none';
slider3.style.touchAction = 'none';;


slider1.addEventListener('input',(event)=>{
    scene1.remove(meshgroup);
    main();
    scene1.add(meshgroup);
});

slider2.addEventListener('input',(event)=>{
    scene1.remove(meshgroup);
    main();
    scene1.add(meshgroup);
});

slider3.addEventListener('input',(event)=>{
    scene1.remove(meshgroup);
    main();
    scene1.add(meshgroup);
});

slider1.addEventListener('pointerdown',()=>{inputtouch = true;});
slider2.addEventListener('pointerdown',()=>{inputtouch = true;});
slider3.addEventListener('pointerdown',()=>{inputtouch = true;});
slider1.addEventListener('pointerup',()=>{inputtouch = false;});
slider2.addEventListener('pointerup',()=>{inputtouch = false;});
slider3.addEventListener('pointerup',()=>{inputtouch = false;});



let angle_switch = 2;
let rotate_angle = -Math.PI/angle_switch/500*Number(slider1.value);
let tube_thick = 0.15/100*Number(slider2.value);
let tube_length = Number(slider3.value)/100;

//シーン
const scene1 = new THREE.Scene();


// レンダラー
const renderer1 = new THREE.WebGLRenderer({
    canvas:canvas1,   //描画するキャンバスをID指定
    antialias: true
});
renderer1.setSize(window.innerWidth, window.innerHeight*0.6); //キャンバスサイズ
renderer1.setClearColor(0xeeeeee);   //背景色




// カメラ
const camera1 = new THREE.OrthographicCamera(-canvas1.width/150, canvas1.width/150, canvas1.height/150, -canvas1.height/150, 0.1, 100);   //直交投影カメラ
//const camera1 = new THREE.PerspectiveCamera(60, canvas1.width/canvas1.height, 0.1, 500);  //透視投影カメラ
camera1.position.set(0,0,20);  //カメラ初期位置


camera1.zoom = 1.5;
camera1.updateProjectionMatrix();


//画面サイズが変わったとき
window.addEventListener('resize',()=>{
    renderer1.setSize(window.innerWidth, window.innerHeight*0.6);
    camera1.aspect = window.innerWidth / (window.innerHeight*0.6);

    camera1.left = -canvas1.width / 150;
    camera1.right = canvas1.width / 150;
    camera1.top = canvas1.height / 150;
    camera1.bottom = -canvas1.height / 150;

    camera1.updateProjectionMatrix();
});


//環境光ライト
const lighta = new THREE.AmbientLight(0xffffff, 0.3);   //第1引数：光の色, 第2引数：光の強さ
scene1.add(lighta);

const light1 = new THREE.DirectionalLight(0xffffff, 0.7);
light1.position.set(1,1,1).normalize();
scene1.add(light1);


//マウスドラッグによる視点操作（カメラが動く、ライブラリに備わっている機能を使用）
//const controls = new THREE.OrbitControls(camera1, renderer1.domElement);



//オブジェクト

let dummymesh = new THREE.Mesh();
dummymesh.rotation.set(0.25, 0.4, 0);





// パス（スプライン）を作成
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
]);

// TubeGeometryを作成
const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.2, 8, true);

// マテリアルを作成
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });

// メッシュを作成
const tube = new THREE.Mesh(tubeGeometry, material);

tube.position.set(1,0,1);
tube.rotation.set(1,4,2);

// scene1.add(tube);




let meshgroup;



function addtube(v1, v2, r1, ci){

    let tube_material = [
        new THREE.MeshLambertMaterial({ color: 0xff7700, side:THREE.DoubleSide}),
        new THREE.MeshLambertMaterial({ color: 0xff40cc, side:THREE.DoubleSide}),
        new THREE.MeshLambertMaterial({ color: 0xf4ff1f, side:THREE.DoubleSide}),
        new THREE.MeshLambertMaterial({ color: 0x77ff00, side:THREE.DoubleSide}),
        new THREE.MeshLambertMaterial({ color: 0x0077ff, side:THREE.DoubleSide}),
        new THREE.MeshLambertMaterial({ color: 0x7700ff, side:THREE.DoubleSide})
    ]

    let tube_path = new THREE.CatmullRomCurve3([v1, v2]);
    let tube_geomtry = new THREE.TubeGeometry(tube_path, 8, r1, 16, false);
    let tube = new THREE.Mesh(tube_geomtry, tube_material[ci]);
    meshgroup.add(tube); 


    let sphere_geometry, sphere1, sphere2;

    sphere_geometry = new THREE.SphereGeometry(r1, 16, 8);
    sphere1 = new THREE.Mesh(sphere_geometry, tube_material[ci]);
    sphere1.position.copy(v1);
    sphere2 = sphere1.clone();
    sphere2.position.copy(v2);
    meshgroup.add(sphere1);
    meshgroup.add(sphere2);
}



function main(){

    meshgroup = new THREE.Group();


    let vts4 = new Array(hypercubevts.length);
    for(let i=0; i<vts4.length; i++)    vts4[i] = hypercubevts[i].concat();

    //4次元回転

    let angle1 = Math.PI/200*Number(slider1.value);
    for(let i=0; i<vts4.length; i++){
        let tmpx = vts4[i][0];
        let tmpw = vts4[i][3];
        vts4[i][0] = tmpx*Math.cos(angle1) - tmpw*Math.sin(angle1);
        vts4[i][3] = tmpx*Math.sin(angle1) + tmpw*Math.cos(angle1);
    }

    // let angle2 = Math.PI/200*Number(slider2.value);
    // for(let i=0; i<vts4.length; i++){
    //     let tmpx = vts4[i][1];
    //     let tmpw = vts4[i][3];
    //     vts4[i][1] = tmpx*Math.cos(angle2) - tmpw*Math.sin(angle2);
    //     vts4[i][3] = tmpx*Math.sin(angle2) + tmpw*Math.cos(angle2);
    // }

    // let angle3 = Math.PI/200*Number(slider3.value);
    // for(let i=0; i<vts4.length; i++){
    //     let tmpx = vts4[i][2];
    //     let tmpw = vts4[i][3];
    //     vts4[i][2] = tmpx*Math.cos(angle3) - tmpw*Math.sin(angle3);
    //     vts4[i][3] = tmpx*Math.sin(angle3) + tmpw*Math.cos(angle3);
    // }


    let vts3 = new Array(hypercubevts.length);

    for(let i=0; i<hypercubevts.length; i++){

        let x1, y1, z1, w1;

        x1 = vts4[i][0];
        y1 = vts4[i][1];
        z1 = vts4[i][2];
        w1 = vts4[i][3];

        vts3[i] = [x1/(2.01-w1), y1/(2.01-w1), z1/(2.01-w1)]
    }


    for(let i=0; i<hypercubeedge.length; i++){
        let v1 = new THREE.Vector3(vts3[hypercubeedge[i][0]][0], vts3[hypercubeedge[i][0]][1], vts3[hypercubeedge[i][0]][2]);
        let v2 = new THREE.Vector3(vts3[hypercubeedge[i][1]][0], vts3[hypercubeedge[i][1]][1], vts3[hypercubeedge[i][1]][2]);

        if(i<4 || (i>=8&&i<12) || (i>=16&&i<20)) addtube(v1, v2, 0.105, 3);
        else    addtube(v1, v2, 0.1, 4);
        

    }


    scene1.add(meshgroup);

}



main();



//マウスイベント
let mouseIsPressed = false;
canvas1.addEventListener('pointerdown',()=>{mouseIsPressed = true;});
canvas1.addEventListener('pointerup',()=>{mouseIsPressed = false;});

let mousemovementX=0, mousemovementY=0;
canvas1.addEventListener('pointermove',(event)=>{
    mousemovementX = event.movementX;
    mousemovementY = event.movementY;
});

let angularvelocity = new THREE.Vector3(0,0,0);


//2本指操作
let mpx1=-1, mpy1=-1, mpx2=-1, mpy2=-1; 
let twofinger = false;

//document.addEventListener('touchstart', handleTouchStart, false);
canvas1.addEventListener('touchmove', handleTouchMove, false);
canvas1.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event){
    if(event.touchs.length==2){
        mpx1 = event.touches[0].clientX;
        mpy1 = event.touches[0].clientY;
        mpx2 = event.touches[1].clientX;
        mpy2 = event.touches[1].clientY;
    }
}

function handleTouchMove(event){

    if(event.touches.length==2){

        inputtouch = true;

        if(mpx1==-1 || mpy1==-1 || mpx2==-1 || mpy2==-1){

            mpx1 = event.touches[0].clientX;
            mpy1 = event.touches[0].clientY;
            mpx2 = event.touches[1].clientX;
            mpy2 = event.touches[1].clientY;

        }else{

            let mx1, my1, mx2, my2;
            mx1 = event.touches[0].clientX;
            my1 = event.touches[0].clientY;
            mx2 = event.touches[1].clientX;
            my2 = event.touches[1].clientY;

            let d1, d2;
            d1 = Math.sqrt((mpx1-mpx2)**2+(mpy1-mpy2)**2);
            d2 = Math.sqrt((mx1-mx2)**2+(my1-my2)**2);

            let v1l = camera1.zoom;

            v1l = Math.min(Math.max(v1l +(d2-d1)*0.004, 0.3),3);
            
            camera1.zoom = v1l;
            camera1.updateProjectionMatrix();

            mpx1 = mx1;
            mpy1 = my1;
            mpx2 = mx2;
            mpy2 = my2;

        }

    }else if(event.touches.length==1){
        if(mpx1==-1 || mpy1==-1){
            mpx1 = event.touches[0].clientX;
            mpy1 = event.touches[0].clientY;
        }else{
            mousemovementX = event.touches[0].clientX - mpx1;
            mousemovementY = event.touches[0].clientY - mpy1;
            mpx1 = event.touches[0].clientX;
            mpy1 = event.touches[0].clientY;
        }
    }
}


function handleTouchEnd(event){
    mpx1 = -1;
    mpy1 = -1;
    mpx2 = -1;
    mpy2 = -1;
    inputtouch = false;
}


//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    if(mouseIsPressed)  angularvelocity.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    if(inputtouch)  angularvelocity.set(0,0,0);
    
    let axis = angularvelocity.clone().normalize();
    let rad = angularvelocity.length()*0.005;

    mousemovementX = 0;
    mousemovementY = 0;

    //meshgroup.rotateOnWorldAxis(axis, rad);
    dummymesh.rotateOnWorldAxis(axis, rad);
    
    meshgroup.rotation.copy(dummymesh.rotation);



    renderer1.render(scene1, camera1);  //レンダリング（CG描画）
}
animate();




// グループに含まれる全ての子要素のジオメトリとマテリアルを破棄する関数
function disposeGroup(group) {
    group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // メッシュのジオメトリとマテリアルを破棄
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                // マテリアルがArrayの場合はそれぞれ破棄する
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
}



// マウスホイールイベントのリスナーを追加
document.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
        camera1.zoom = Math.min(Math.max(camera1.zoom-0.1, 0.3),3)
    } else {
        camera1.zoom = Math.min(Math.max(camera1.zoom+0.1, 0.3),3);
    }
    camera1.updateProjectionMatrix();
});
let tubecolor1 = 0x0099ff;  //tubeの色　uカーブ
let tubecolor2 = 0xff3300;  //tubeの色　vカーブ
let surfacecolor = 0xd9ee85;    //曲面の色
let surfacealpha = 1; //曲面の透明度
let backgroundcolor = 0xeeeeee; //背景色



const canvas1 = document.getElementById('canvas1');

canvas1.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});




//シーン
const scene1 = new THREE.Scene();


// レンダラー
const renderer1 = new THREE.WebGLRenderer({
    canvas:canvas1,   //描画するキャンバスをID指定
    antialias: true
});
renderer1.setSize(window.innerWidth, window.innerHeight*0.76); //キャンバスサイズ
renderer1.setClearColor(backgroundcolor);   //背景色



console.log(JSON.stringify(indexcut.slice(0,10)));




// カメラ
//const camera1 = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 10);   //直交投影カメラ
const camera1 = new THREE.PerspectiveCamera(60, canvas1.width/canvas1.height, 0.1, 500);  //透視投影カメラ
camera1.position.set(0,0,25);  //カメラ初期位置

//画面サイズが変わったとき
window.addEventListener('resize',()=>{
    renderer1.setSize(window.innerWidth, window.innerHeight*0.76);
    camera1.aspect = window.innerWidth / (window.innerHeight*0.76);
    camera1.updateProjectionMatrix();
});



//環境光ライト
const lighta = new THREE.AmbientLight(0xffffff, 0.6);   //第1引数：光の色, 第2引数：光の強さ
scene1.add(lighta);


//指向性ライト
const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
light1.position.set(1,1,1);
scene1.add(light1);


const light2 = new THREE.DirectionalLight(0xffffff, 0);
light2.position.set(-1,-1,1);
scene1.add(light2);


//マウスドラッグによる視点操作（カメラが動く、ライブラリに備わっている機能を使用）
//const controls = new THREE.OrbitControls(camera1, renderer1.domElement);



//オブジェクト

//回転姿勢を記録するためのダミーオブジェクト
let dummymesh = new THREE.Mesh();
dummymesh.rotation.set(1.4, 0, 0);  //初期姿勢　x-y-z系のオイラー角　引数：(x軸回転, y軸回転, z軸回転)


let path, geometry, mesh, mesh_tube_group, index=9;

let tubematerial1 = new THREE.MeshLambertMaterial({ color: tubecolor1, side:THREE.DoubleSide});
let tubematerial2 = new THREE.MeshLambertMaterial({ color: tubecolor2, side:THREE.DoubleSide});

mesh_tube_group = new Array(curve_group.length);
for(let i=0; i<mesh_tube_group.length; i++)   mesh_tube_group[i] = new THREE.Mesh();

for(let i=0; i<curve_group.length; i++){

    for(let k=0; k<curve_group[i].length; k++){
        let thick = 0.1;
        if(k==0||k==20)    thick = 0.2;
        path = new THREE.CatmullRomCurve3(veclist(curve_group[i][k],5));
        geometry = new THREE.TubeGeometry(path, 64, thick, 16, false);
        if(k<=20)   mesh = new THREE.Mesh(geometry, tubematerial1);
        else    mesh = new THREE.Mesh(geometry, tubematerial2);
        mesh_tube_group[i].add(mesh);
    }

}

//scene1.add(mesh_tube_group[index]);



let geometry_surface, material_surface, mesh_surface;
let mesh_surface_group = new Array(vts2.length);

let index0 = [];
let index2 = [];
let index3 = [];


for(let i=0; i<index1.length; i+=3){

    let a1 = 240*4;
    if(9600/2-a1<=i && i<9600/2+a1){
        index2.push(index1[i]);
        index2.push(index1[i+1]);
        index2.push(index1[i+2]);
    }


    let a2 = 240*8;
    if((a2<=i&&i<9600/2-a2) || (9600/2+a2<=i&&i<9600-a2)){
        index3.push(index1[i]);
        index3.push(index1[i+1]);
        index3.push(index1[i+2]);
    }
}




material_surface = new THREE.MeshPhongMaterial({color:surfacecolor, side:THREE.DoubleSide, transparent:true, opacity:surfacealpha});




for(let i=0; i<vtscut.length; i++){

    geometry_surface = new THREE.BufferGeometry();
    geometry_surface.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vtscut[i]), 3));
    geometry_surface.setIndex(new THREE.BufferAttribute(new Uint16Array(indexcut[i]),1));
    geometry_surface.computeVertexNormals();

    mesh_surface_group[i] = new THREE.Mesh(geometry_surface, material_surface);
    mesh_surface_group[i].scale.set(5,5,5);

}



scene1.add(mesh_surface_group[index]);



//マウスイベント
let mouseIsPressed = false;
canvas1.addEventListener('pointerdown',()=>{mouseIsPressed = true;});
canvas1.addEventListener('pointerup',()=>{mouseIsPressed = false;});

let mousemovementX=0, mousemovementY=0;
canvas1.addEventListener('pointermove',(event)=>{
    mousemovementX = event.movementX;
    mousemovementY = event.movementY;
});


//回転軸、回転速度を表すベクトル
let angularvelocity = new THREE.Vector3(0, 0.2, 0);


//2本指操作
let mpx1=-1, mpy1=-1, mpx2=-1, mpy2=-1; 
let twofinger = false;

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

        twofinger = true;

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

            let v1n = camera1.position.clone().normalize();
            let v1l = camera1.position.length();

            v1l = Math.max(v1l +(d1-d2)*0.1, 1);
            camera1.position.set(v1n.x*v1l, v1n.y*v1l, v1n.z*v1l);

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


function handleTouchEnd(){
    mpx1 = -1;
    mpy1 = -1;
    mpx2 = -1;
    mpy2 = -1;
    twofinger = false;
}



const slider1 = document.getElementById('slider1');

slider1.addEventListener('input',()=>{
    //scene1.remove(mesh_tube_group[index]);
    scene1.remove(mesh_surface_group[index]);
    index = Number(slider1.value);
    //scene1.add(mesh_tube_group[index]);
    scene1.add(mesh_surface_group[index]);
});


// const check1 = document.getElementById('check1');
// check1.addEventListener('change',(event)=>{
//     // console.log(event.target.checked);
//     // for(let i=0; i<mesh_surface_group.length; i++){
//     //     mesh_surface_group[i].visible = event.target.checked;
//     // }


//     for(let i=0; i<vts2.length; i++){
//         mesh_surface_group[i].geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(index1),1));
//         mesh_surface_group[i].geometry.computeVertexNormals();
//     }

// });


const select1 = document.getElementById('select1');
select1.value = 'option2';
select1.addEventListener('change',(event)=>{
    if(event.target.value=='option1'){
        for(let i=0; i<vts2.length; i++){
            mesh_surface_group[i].geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(index0),1));
            mesh_surface_group[i].geometry.computeVertexNormals();
        }
    }
    if(event.target.value=='option2'){
        for(let i=0; i<vts2.length; i++){
            mesh_surface_group[i].geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(index1),1));
            mesh_surface_group[i].geometry.computeVertexNormals();
            mesh_surface_group[i].material.opacity=0.7;
        }
    }
    if(event.target.value=='option3'){
        for(let i=0; i<vts2.length; i++){
            mesh_surface_group[i].geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(index2),1));
            mesh_surface_group[i].geometry.computeVertexNormals();
            mesh_surface_group[i].material.opacity=1;
        }
    }
    if(event.target.value=='option4'){
        for(let i=0; i<vts2.length; i++){
            mesh_surface_group[i].geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(index3),1));
            mesh_surface_group[i].geometry.computeVertexNormals();
            mesh_surface_group[i].material.opacity=1;
        }
    }
});



const colorpicker1 = document.getElementById('colorpicker1');
colorpicker1.addEventListener('input',(event)=>{
    surfacecolor = event.target.value;
    material_surface = new THREE.MeshPhongMaterial({color:surfacecolor, side:THREE.DoubleSide, transparent:true, opacity:surfacealpha});
    for(let i=0; i<mesh_surface_group.length; i++)    mesh_surface_group[i].material = material_surface;
});



const colorpicker2 = document.getElementById('colorpicker2');
colorpicker2.addEventListener('input',(event)=>{
    tubecolor1 = event.target.value;
    tubematerial1 = new THREE.MeshLambertMaterial({ color: tubecolor1, side:THREE.DoubleSide});
    for(let i=0; i<mesh_tube_group.length; i++){
        for(let j=0; j<mesh_tube_group[i].children.length; j++)   if(j<=20){
            mesh_tube_group[i].children[j].material = tubematerial1;
        }
    }
});

const colorpicker3 = document.getElementById('colorpicker3');
colorpicker3.addEventListener('input',(event)=>{
    tubecolor2 = event.target.value;
    tubematerial2 = new THREE.MeshLambertMaterial({ color: tubecolor2, side:THREE.DoubleSide});
    for(let i=0; i<mesh_tube_group.length; i++){
        for(let j=0; j<mesh_tube_group[i].children.length; j++)   if(j>20){
            mesh_tube_group[i].children[j].material = tubematerial2;
        }
    }
});





//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される



    if(mouseIsPressed && !twofinger)  angularvelocity.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    let axis = angularvelocity.clone().normalize(); //回転軸
    let rad = angularvelocity.length()*0.005;   //回転量　最後にかける定数を大きくするとマウスドラッグ時の回転量が大きくなる

    mousemovementX = 0;
    mousemovementY = 0;

    dummymesh.rotateOnWorldAxis(axis, rad); //ダミーオブジェクトを回転
    mesh_tube_group[index].rotation.copy(dummymesh.rotation); //チューブの姿勢をダミーオブジェクトに揃える
    mesh_surface_group[index].rotation.copy(dummymesh.rotation);    //曲面の姿勢をダミーオブジェクトに揃える  


    //キューブクリッピング
    // renderer1.clippingPlanes = [];

    // let vc1 = new THREE.Vector3(1, 0, 0);
    // let vc2 = new THREE.Vector3(-1, 0, 0);
    // let vc3 = new THREE.Vector3(0, 1, 0);
    // let vc4 = new THREE.Vector3(0, -1, 0);
    // let vc5 = new THREE.Vector3(0, 0, 1);
    // let vc6 = new THREE.Vector3(0, 0, -1);

    // vc1.applyEuler(dummymesh.rotation);
    // vc2.applyEuler(dummymesh.rotation);
    // vc3.applyEuler(dummymesh.rotation);
    // vc4.applyEuler(dummymesh.rotation);
    // vc5.applyEuler(dummymesh.rotation);
    // vc6.applyEuler(dummymesh.rotation);

    // let a1 = 20;

    // renderer1.clippingPlanes.push(new THREE.Plane(vc1, a1));
    // renderer1.clippingPlanes.push(new THREE.Plane(vc2, a1));
    // renderer1.clippingPlanes.push(new THREE.Plane(vc3, a1));
    // renderer1.clippingPlanes.push(new THREE.Plane(vc4, a1));
    // renderer1.clippingPlanes.push(new THREE.Plane(vc5, a1));
    // renderer1.clippingPlanes.push(new THREE.Plane(vc6, a1));


    //カッティングプレーン
    // let planedistance = 18; //原点とカッティングプレーンとの距離
    // renderer1.clippingPlanes = [];  //カッティングプレーンをリセット
    // for(let i=0; i<spherecut100.length; i++)    if(i%2==0 || true){ //100個のプレーンのうち偶数番目のもののみを使う（計算量削減のため）
    //     let vc1 = new THREE.Vector3(spherecut100[i][0], spherecut100[i][1], spherecut100[i][2]);    //data.js内のspherecut100を参照　100×3配列
    //     vc1.applyEuler(dummymesh.rotation); //カッティングプレーンをダミーオブジェクトに合わせて回転させる
    //     renderer1.clippingPlanes.push(new THREE.Plane(vc1,planedistance));  //レンダラーにカッティングプレーンを追加
    // }


    renderer1.render(scene1, camera1);  //レンダリング
}
animate();



function veclist(arg, sc){
    let result = [];
    for(let i=0; i<arg.length; i++){
        result.push(new THREE.Vector3(arg[i][0]*sc, arg[i][1]*sc, arg[i][2]*sc));
    }
    return result;
}


// マウスホイールイベントのリスナーを追加
document.addEventListener('wheel', function(event) {

    let v1n = camera1.position.clone().normalize();
    let v1l = camera1.position.length();

    if (event.deltaY > 0) {
        v1l = Math.min(Math.max(v1l*1.1, 1), 100);
        
    } else {
        v1l = Math.min(Math.max(v1l*0.9, 1), 100);
    }
    camera1.position.set(v1n.x*v1l, v1n.y*v1l, v1n.z*v1l);

});
//#############################################################
//グローバル変数
//#############################################################

let canvasover = false; //trueのときマウスホイール（2本指スライド）でグラフィックを拡大縮小、falseのときページスクロール
let twofinger = false;
let mpx1=-1, mpy1=-1, mpx2=-1, mpy2=-1; 



//#############################################################
//three.js関連
//#############################################################


//シーン
const scene1 = new THREE.Scene();


// レンダラー
const renderer1 = new THREE.WebGLRenderer({
    canvas:document.getElementById('canvas1'),   //描画するキャンバスをID指定
    antialias: true //境界のぎざぎざを軽減
});
renderer1.setClearColor(0xeeeeee);   //背景色






const slider1 = document.getElementById('rangeslider1');
slider1.addEventListener('input',()=>{
    updateobjects(scene1);
});

check1 = document.getElementById('check1');


const canvas1 = document.getElementById('canvas1');
//右クリックメニューを禁止（スマホを長押ししたときに余計なものが開かないようにする）
// canvas1.addEventListener('contextmenu', (event) => {
//     event.preventDefault();
// });





document.addEventListener('click', (event)=>{
    if(event.target.tagName.toLowerCase()=='canvas'){
        canvasover = true;
        disableScroll();
    }else{
        canvasover = false;
        enableScroll();
    }
})







// カメラ
//const camera1 = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 10);   //直交投影カメラ
const camera1 = new THREE.PerspectiveCamera(60, canvas1.width/canvas1.height, 0.1, 500);  //透視投影カメラ
camera1.position.set(0,0,15);  //カメラ初期位置




//環境光ライト
const lighta = new THREE.AmbientLight(0xffffff, 0.4);   //第1引数：光の色, 第2引数：光の強さ
scene1.add(lighta);


//指向性ライト
const light1 = new THREE.DirectionalLight(0xffffff, 0.7);
light1.position.set(1,1,1);
scene1.add(light1);


const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
light2.position.set(-1,-1,1);
scene1.add(light2);



//オブジェクト

let dummymesh = new THREE.Mesh();
dummymesh.rotation.set(0.3, 0, 0);


//メビウスの帯2変数関数
const mebius_func1 = function(u, v){

    let x, y, z;
    let t1 = Number(slider1.value);
    let v1 = ((1-t1)*v+t1) * 3;
    
    x = (5 + v1 * Math.cos(u/2)) * Math.cos(u);
    y = (5 + v1 * Math.cos(u/2)) * Math.sin(u);
    z = v1 * Math.sin(u/2);

    return [x, y, z];
}


const corecurve_func1 = function(u){
    let x, y, z;
    x = 5 * Math.cos(u);
    y = 5 * Math.sin(u);
    z = 0;
    return [x, y, z];
}


const boundarycurve_func1 = function(u){
    x = (5 + 3  * Math.cos(u/2)) * Math.cos(u);
    y = (5 + 3 * Math.cos(u/2)) * Math.sin(u);
    z = 3 * Math.sin(u/2);
    return [x, y, z];

}


let mebius1 = parametricmesh(mebius_func1, [0, Math.PI*4], [0, 1], {meshcolor:0xd9ee85, detailv:6, detailu:120, animation:true});
let corecurve1 = parametrictube(corecurve_func1, [0, Math.PI*2], 0.1, {meshcolor:0xff3300});
let boundarycurve1 = parametrictube(boundarycurve_func1, [0, Math.PI*4], 0.1, {meshcolor:0x0033ff, detailu:120});

scene1.add(mebius1);
scene1.add(corecurve1);
scene1.add(boundarycurve1);



check1.addEventListener('change',()=>{
    if(check1.checked){
        corecurve1.visible = true;
    }else{
        corecurve1.visible = false;
    }
});



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










//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    if(mouseIsPressed && !twofinger)  angularvelocity.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    let axis = angularvelocity.clone().normalize();
    let rad = angularvelocity.length()*0.005;

    mousemovementX = 0;
    mousemovementY = 0;


    dummymesh.rotateOnWorldAxis(axis, rad);

    scene1.traverse((object)=>{
        if(object.isMesh){
            object.rotation.copy(dummymesh.rotation);
        }
    });

    

    // mesh.rotation.copy(dummymesh.rotation);
    // tubemesh1.rotation.copy(dummymesh.rotation);
    // tubemesh2.rotation.copy(dummymesh.rotation);

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

function veclist2(arg, sc){
    let result = [];
    for(let i=0; i<arg.length; i+=3){
        result.push(new THREE.Vector3(arg[i]*sc, arg[i+1]*sc, arg[i+2]*sc));
    }
    return result;
}


// マウスホイールイベントのリスナーを追加
document.addEventListener('wheel', function(event) {

    if(canvasover){

        let v1n = camera1.position.clone().normalize();
        let v1l = camera1.position.length();

        if (event.deltaY > 0) {
            v1l = Math.min(Math.max(v1l*1.1, 1), 100);
            
        } else {
            v1l = Math.min(Math.max(v1l*0.9, 1), 100);
        }
        camera1.position.set(v1n.x*v1l, v1n.y*v1l, v1n.z*v1l);
    
    }

});


// スクロールを禁止する関数
function disableScroll() {
    document.body.style.overflow = 'hidden';
}

// スクロールを有効にする関数
function enableScroll() {
    document.body.style.overflow = '';
}





//自作関数


//パラメトリックプロット　チューブ ver1.0
function parametrictube(func, urange, radius, option1){

    const defaultoption = {detailu:40, meshcolor:0xffffff, opacity:1, radialsegments:8, scale:1, animation:false};
    option1 = {...defaultoption, ...option1};

    let umin = urange[0];
    let umax = urange[1];

    let vts1 = [];
    for(let i=0; i<=option1.detailu; i++){
        let u = umin + (umax - umin) / option1.detailu * i;
        let tmp = func(u);
        vts1.push(new THREE.Vector3(tmp[0], tmp[1], tmp[2]));
    }

    let path1 = new THREE.CatmullRomCurve3(vts1);
    
    let geometry1 = new THREE.TubeGeometry(path1, option1.detailu, radius, option1.radialsegments, false);
    
    let material1;
    if(option1.opacity==1)    material1 = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:option1.meshcolor});
    else    material1 = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:option1.meshcolor, transparent:true, opacity:option1.opacity});

    let mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.scale.set(option1.scale, option1.scale, option1.scale);

    mesh1.umin = umin;
    mesh1.umax = umax;
    mesh1.detailu = option1.detailu;

    mesh1.radius = radius;
    mesh1.radialsegments = option1.radialsegments;

    mesh1.vtsfunc = func;
    mesh1.class = 'myparametrictube';
    mesh1.animation = option1.animation;

    return mesh1;
}


//パラメトリックプロット　曲面　ver1.0
function parametricmesh(func, urange, vrange, option1){

    const defaultoption = {detailu:40, detailv:40, meshcolor:0xffffff, scale:1, opacity:1, animation:false};
    option1 = {...defaultoption, ...option1};

    let umin = urange[0];
    let umax = urange[1];
    let vmin = vrange[0];
    let vmax = vrange[1];

    let vts1 = [];
    let index1 = [];

    
    for(let i=0; i<=option1.detailu; i++)    for(let j=0; j<=option1.detailv; j++){
    
        let u = umin + (umax - umin) / option1.detailu * i;
        let v = vmin + (vmax - vmin) / option1.detailv * j;
    
        vts1 = vts1.concat(func(u,v));
    }

    
    for(let i=0; i<option1.detailu; i++){
        for(let j=0; j<option1.detailv; j++){
            index1.push(i*(option1.detailv+1)+j, i*(option1.detailv+1)+(j+1), (i+1)*(option1.detailv+1)+j, (i+1)*(option1.detailv+1)+(j+1), (i+1)*(option1.detailv+1)+j, i*(option1.detailv+1)+(j+1));
        }
    }
    
    
    let geometry1 = new THREE.BufferGeometry();
    geometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vts1), 3));
    geometry1.setIndex(new THREE.BufferAttribute(new Uint16Array(index1),1));
    geometry1.computeVertexNormals();
    
    let material1;
    if(option1.opacity==1)    material1 = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:option1.meshcolor});
    else    material1 = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:option1.meshcolor, transparent:true, opacity:option1.opacity});

    let mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.scale.set(option1.scale, option1.scale, option1.scale);

    mesh1.umin = umin;
    mesh1.umax = umax;
    mesh1.vmin = vmin;
    mesh1.vmax = vmax;

    mesh1.detailu = option1.detailu;
    mesh1.detailv = option1.detailv;

    mesh1.vtsfunc = func;
    mesh1.class = 'myparametricmesh';
    mesh1.animation = option1.animation;

    return mesh1;
}


//更新　ver1.0
function updateobjects(scene){

    scene.traverse((object)=>{
        if(object.isMesh){

            if(object.class == 'myparametricmesh' && object.animation){

                let list1 = [];
                for(let i=0; i<=object.detailu; i++)    for(let j=0; j<=object.detailv; j++){
                    let u = object.umin + (object.umax - object.umin) / object.detailu * i;
                    let v = object.vmin + (object.vmax - object.vmin) / object.detailv * j;
                    list1 = list1.concat(object.vtsfunc(u,v));
                }
            
                object.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(list1),3));
                object.geometry.computeVertexNormals();
                object.geometry.attributes.position.needsUpdate = true;

            }

            if(object.class == 'myparametrictube' && object.animation){

                let vts1 = [];
                for(let i=0; i<=object.detailu; i++){
                    let u = object.umin + (object.umax - object.umin) / object.detailu * i;
                    let tmp = object.vtsfunc(u);
                    vts1.push(new THREE.Vector3(tmp[0], tmp[1], tmp[2]));
                }

                let path1 = new THREE.CatmullRomCurve3(vts1);
                object.geometry.dispose();
                object.geometry = new THREE.TubeGeometry(path1, object.detailu, object.radius, object.radialsegments, false);

            }
        }
    });


}
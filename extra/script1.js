//#############################################################
//グローバル変数
//#############################################################



angularvelocity1_common = new THREE.Vector3(0,0.3,0);     //回転を表すベクトル（方向が回転軸、大きさが回転速度に比例）初期値を0ベクトル以外にするとはじめから回転する
dummymesh_common.rotation.set(-1.4, 0, 0.5);    //初期姿勢（x-y-z系オイラー角）


//#############################################################
//three.js関連
//#############################################################


//シーン
const scene1 = new THREE.Scene();


// レンダラー
const renderer1 = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas1'),   //描画するキャンバスをID指定
    antialias: true //グラフィックのぎざぎざを軽減
});
renderer1.setClearColor(0xeeeeee);   //背景色

const canvas1 = document.getElementById('canvas1')



// カメラ
const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);   //直交投影カメラ
//const camera1 = new THREE.PerspectiveCamera(60, canvas1.width/canvas1.height, 0.1, 500);  //透視投影カメラ
camera1.position.set(0,0,20);  //カメラ初期位置

let ratio = canvas1.width/canvas1.height;

if(canvas1.width>canvas1.height){
    camera1.left = -5*ratio;
    camera1.right = 5*ratio;
    camera1.top = 5;
    camera1.bottom = -5;
}else{
    camera1.left = -5;
    camera1.right = 5;
    camera1.top = 5 / ratio;
    camera1.bottom = -5 / ratio;
}

camera1.zoom = 0.04;
camera1.updateProjectionMatrix();


//環境光ライト
const lighta = new THREE.AmbientLight(0xffffff, 0.6);   //第1引数：光の色, 第2引数：光の強さ
scene1.add(lighta);


//指向性ライト
const light1 = new THREE.DirectionalLight(0xffffff, 0.4);
light1.position.set(1,1,1);
scene1.add(light1);


const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
light2.position.set(-1,-1,1);
scene1.add(light2);


//#############################################################
//表示するグラフィック
//#############################################################

const tetra_vts = [[2, 2, 2], [-2, -2, 2], [2, -2, -2], [-2, 2, -2]];
const tetra_edge = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

const cube_vts = [[2, 2, 2], [2, -2, 2], [-2, -2, 2], [-2, 2, 2], [2, 2, -2], [2, -2, -2], [-2, -2, -2], [-2, 2, -2]];
const cube_edge = [[0,1],[0,3],[0,4],[1,2],[1,5],[2,3],[2,6],[3,7],[4,5],[4,7],[5,6],[6,7]];

const ico_vts = [[3.23607, 2., 0.], [3.23607, -2., 0.], [-3.23607, -2., 0.], [-3.23607, 2., 0.], [0., 3.23607, 2.], [0., 3.23607, -2.], [0., -3.23607, -2.], [0., -3.23607, 2.], [2., 0., 3.23607], [-2., 0., 3.23607], [-2., 0., -3.23607], [2., 0., -3.23607]];
const ico_edge = [[0,1],[0,4],[0,5],[0,8],[0,11],[1,6],[1,7],[1,8],[1,11],[2,3],[2,6],[2,7],[2,9],[2,10],[3,4],[3,5],[3,9],[3,10],[4,5],[4,8],[4,9],[5,10],[5,11],[6,7],[6,10],[6,11],[7,8],[7,9],[8,9],[10,11]]

let vts = [];
let edge = [];

vts = new Array(ico_vts.length);
for(let i=0; i<vts.length; i++) vts[i] = ico_vts[i].concat();
edge = new Array(ico_edge.length);
for(let i=0; i<edge.length; i++)    edge[i] = ico_edge[i].concat();


const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');
const slider3 = document.getElementById('slider3');

const select1 = document.getElementById('select1');
const select2 = document.getElementById('select2');
const select3 = document.getElementById('select3');

select1.value = 'option2';
select2.value = 'option2';

let slider1_max_ratio = 1;

let rotate_angle = -Math.PI/2*Number(slider1.value) * slider1_max_ratio;
let tube_thick = Number(slider2.value)*0.6 + 0.1;
let tube_length = Number(slider3.value)*5;


let tube_material = [
    new THREE.MeshLambertMaterial({ color: 0xff7700, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xff40cc, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xf4ff1f, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x77ff00, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x0077ff, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x7700ff, side:THREE.DoubleSide})
]

let meshgroup;



function addtube(v1, v2, r1, ci){

    let tube_path = new THREE.CatmullRomCurve3([v1, v2]);
    let tube_geomtry = new THREE.TubeGeometry(tube_path, 4, r1, 16, false);
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


main();

function main(){

    meshgroup = new THREE.Group();

    for(let i=0; i<edge.length; i++){

        let x1, y1, z1, x2, y2, z2;
        x1 = vts[edge[i][0]][0];
        y1 = vts[edge[i][0]][1];
        z1 = vts[edge[i][0]][2];
        x2 = vts[edge[i][1]][0];
        y2 = vts[edge[i][1]][1];
        z2 = vts[edge[i][1]][2];

        let v1a = new THREE.Vector3(x1, y1, z1);
        let v2a = new THREE.Vector3(x2, y2, z2);

        let va = new THREE.Vector3((x1+x2)/2, (y1+y2)/2, (z1+z2)/2);    //辺の重心

        let v1b, v2b, v1c, v2c;

        v1b = v1a.clone().sub(va);
        v1b.applyAxisAngle(va.clone().normalize(), rotate_angle);
        v1b.add(va);

        v2b = v2a.clone().sub(va);
        v2b.applyAxisAngle(va.clone().normalize(), rotate_angle);
        v2b.add(va);

        v1c = new THREE.Vector3((-tube_length+1)*va.x+tube_length*v1b.x, (-tube_length+1)*va.y+tube_length*v1b.y, (-tube_length+1)*va.z+tube_length*v1b.z);
        v2c = new THREE.Vector3((-tube_length+1)*va.x+tube_length*v2b.x, (-tube_length+1)*va.y+tube_length*v2b.y, (-tube_length+1)*va.z+tube_length*v2b.z);
    
        let cl=0;

        if(select1.value=='option1' || select2.value=='option1'){
            cl = 4;
        }else if(select2.value=='option2'){
            cl = 0;
            if(i==0 || i==9 || i==18 || i==23 || i==28 || i==29)  cl=1;
            if(i==1 || i==10 || i==21 || i==26 || i==8 || i==16)  cl=2;
            if(i==2 || i==11 || i==7 || i==17 || i==20 || i==25)  cl=3;
            if(i==3 || i==13 || i==22 || i==27 || i==5 || i==14)  cl=4;
        }else{
            cl = 5;
            if(i==0 || i==22 || i==17 || i==12 || i==26)    cl=0;
            if(i==1 || i==15 || i==13 || i==23 || i==7)    cl=1;
            if(i==2 || i==29 || i==10 || i==27 || i==19)    cl=2;
            if(i==3 || i==8 || i==24 || i==9 || i==20)    cl=3;
            if(i==4 || i==5 || i==11 || i==16 || i==18)    cl=4;
        }
        

        addtube(v1c, v2c, tube_thick, cl);
    }

    scene1.add(meshgroup);

}




//#############################################################
//入力や操作に関する処理
//#############################################################



const label1 = document.getElementById('label1');


slider1.addEventListener('input',(event)=>{
    rotate_angle = -Math.PI/2*Number(slider1.value) * slider1_max_ratio;
    disposeGroup(meshgroup);
    scene1.remove(meshgroup);
    main();
    select3.value = 'option7';
    let kakudo = -rotate_angle / Math.PI * 180;
    label1.textContent = Math.round(kakudo) + '度';
});

slider2.addEventListener('input',(event)=>{
    tube_thick = Number(slider2.value)*0.6 + 0.1;
    disposeGroup(meshgroup);
    scene1.remove(meshgroup);
    main();
    select3.value = 'option7';
});

slider3.addEventListener('input',(event)=>{
    tube_length = Number(slider3.value)*5;
    disposeGroup(meshgroup);
    scene1.remove(meshgroup);
    main();
    select3.value = 'option7';
});



select1.addEventListener('change',(event)=>{
    if(event.target.value=='option1'){
        vts = new Array(cube_vts.length);
        for(let i=0; i<vts.length; i++) vts[i] = cube_vts[i].concat();
        edge = new Array(cube_edge.length);
        for(let i=0; i<edge.length; i++)    edge[i] = cube_edge[i].concat();
        disposeGroup(meshgroup);
        scene1.remove(meshgroup);
        main();
        camera1.zoom *= 1.25;
        camera1.updateProjectionMatrix();

        select2.style.visibility = 'hidden';
        select3.style.visibility = 'hidden';
    }else{
        vts = new Array(ico_vts.length);
        for(let i=0; i<vts.length; i++) vts[i] = ico_vts[i].concat();
        edge = new Array(ico_edge.length);
        for(let i=0; i<edge.length; i++)    edge[i] = ico_edge[i].concat();
        disposeGroup(meshgroup);
        scene1.remove(meshgroup);
        main();
        camera1.zoom *= 0.8;
        camera1.updateProjectionMatrix();

        select2.style.visibility = 'visible';
        select3.style.visibility = 'visible';
    }
});





select2.addEventListener('change',()=>{
    disposeGroup(meshgroup);
    scene1.remove(meshgroup);
    main();
});



select3.addEventListener('input',()=>{

    if(select3.value=='option1'){
        slider1_max_ratio = 1;
        slider1.value = 0;
        slider2.value = 0.16;
        slider3.value = 0.18;
        check1.checked = false;
        update1();
    }

    if(select3.value=='option2'){
        slider1_max_ratio = 3;
        slider1.value = 0.552;
        slider2.value = 0.35;
        slider3.value = 0.26;
        select2.value = 'option3';
        check1.checked = true;
        update1();
    }

    if(select3.value=='option3'){
        slider1_max_ratio = 1;
        slider1.value = 0.648;
        slider2.value = 0.26;
        slider3.value = 0.23;
        select2.value = 'option3';
        check1.checked = false;
        update1();
    }

    if(select3.value=='option4'){
        slider1_max_ratio = 1;
        slider1.value = 0.648;
        slider2.value = 0.26;
        slider3.value = 0.98;
        select2.value = 'option3';
        check1.checked = false;
        update1();
    }

    if(select3.value=='option5'){
        slider1_max_ratio = 1;
        slider1.value = 0.768;
        slider2.value = 0.2;
        slider3.value = 0.26;
        check1.checked = false;
        update1();
    }

    if(select3.value=='option6'){
        slider1_max_ratio = 1;
        slider1.value = 0.5;
        slider2.value = 0.23;
        slider3.value = 0.45;
        check1.checked = false;
        update1();
    }

    if(select3.value=='option7'){
        console.log(123);
        slider1_max_ratio = 1;
        slider1.value = 1;
        slider2.value = 0.18;
        slider3.value = 0.12;
        select2.value = 'option2';
        check1.checked = false;
        update1();
    }

});


function update1(){
    rotate_angle = -Math.PI/2*Number(slider1.value) * slider1_max_ratio
    tube_thick = Number(slider2.value)*0.6 + 0.1;
    tube_length = Number(slider3.value)*5;
    disposeGroup(meshgroup);
    scene1.remove(meshgroup);
    main();
    let kakudo = -rotate_angle / Math.PI * 180;
    label1.textContent = Math.round(kakudo) + '度';
}


//要素を長押し時、右クリックメニューが出ないようにする
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('html, body').forEach((element) => {
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.mozUserSelect = 'none';
    });
});




//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    rotateobjects_common(scene1, camera1);  //scene1に含まれる全てのオブジェクトを回転

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



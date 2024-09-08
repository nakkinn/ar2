let tubecolor1 = 0x0099ff;  //tubeの色　uカーブ
let tubecolor2 = 0xff3300;  //tubeの色　vカーブ
let surfacecolor = 0xd9ee85;    //曲面の色
let surfacealpha = 0.7; //曲面の透明度
let backgroundcolor = 0xeeeeee; //背景色

angularvelocity1_common = new THREE.Vector3(0, 0.2, 0);    //回転を表すベクトル（方向が回転軸、大きさが回転速度に比例）初期値を0ベクトル以外にするとはじめから回転する
dummymesh_common.rotation.set(-1.5, 0, 0);  //初期姿勢（x-y-z系オイラー角）

const spherecut_radius = 4; //球面カット半径

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

let width1, height1;    //キャンバスサイズ
width1 = renderer1.domElement.width;    //キャンバスサイズの取得（カメラ設定に使う）
height1 = renderer1.domElement.height;


// カメラ
const camera1 = new THREE.PerspectiveCamera(60, canvas1.width/canvas1.height, 0.1, 500);  //透視投影カメラ
camera1.position.set(0,0,5);  //カメラ初期位置
camera1.zoom = 1;   //カメラズーム量（オブジェクトが画面に表示されない場合は、これを調整すると表示されることがある）
camera1.updateProjectionMatrix(); //カメラの設定適用


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



//#############################################################
//表示するグラフィック　
//#############################################################
console.log(curve_group);
let path, geometry, mesh, mesh_tube_group;
let index=10;   //複数個あるグラフィックのうち何番目のグラフィックを表示するか（スライダーで変更）
let cutsurface;
let cuttube;

//チューブのマテリアル2種
let tubematerial1 = new THREE.MeshLambertMaterial({ color: tubecolor1, side:THREE.DoubleSide});
let tubematerial2 = new THREE.MeshLambertMaterial({ color: tubecolor2, side:THREE.DoubleSide, flatShading:true});

mesh_tube_group = new Array(curve_group.length);
for(let i=0; i<mesh_tube_group.length; i++)   mesh_tube_group[i] = [];

//チューブ群のメッシュの生成　data.jsのcurve_groupを参照
for(let i=0; i<curve_group.length; i++){
    for(let k=0; k<curve_group[i].length; k++){
        let thick = 0.02;
        if(k==0||k==20)    thick = 0.04;

        //path = new THREE.CatmullRomCurve3(veclist(curve_group[i][k]));
        //geometry = new THREE.TubeGeometry(path, curve_group[i][k].length*2, thick, 16, false);
        geometry = makeTubeC(curve_group[i][k], thick, 8);

        if(k<=20)   mesh = new THREE.Mesh(geometry, tubematerial1);
        else    mesh = new THREE.Mesh(geometry, tubematerial2);

        mesh_tube_group[i].push(mesh);
    }
}

//ポイントリストからチューブのジオメトリを生成
function makeTubeC(plist, radius, n){

    let vts = [];
    let index = [];

    let ring = new Array(n);

    let x1 = plist[0][0];
    let y1 = plist[0][1];
    let z1 = plist[0][2];
    let x2 = plist[1][0];
    let y2 = plist[1][1];
    let z2 = plist[1][2];

    let vr = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    let v1 = new THREE.Vector3(x2-x1, y2-y1, z2-z1);
    let v2 = v1.clone().cross(vr).normalize().multiplyScalar(radius);

    for(let i=0; i<n; i++){
        let v3 = v2.clone().applyAxisAngle(v1.clone().normalize(), 2*Math.PI/n*i);
        ring[i] = new THREE.Vector3(v3.x, v3.y, v3.z);
    }


    for(let i=0; i<ring.length; i++){
        vts.push(ring[i].x+x1, ring[i].y+y1, ring[i].z+z1);
    }


    for(let k=0; k<plist.length-2; k++){

        let x1 = plist[k][0];
        let y1 = plist[k][1];
        let z1 = plist[k][2];
        let x2 = plist[k+1][0];
        let y2 = plist[k+1][1];
        let z2 = plist[k+1][2];
        let x3 = plist[k+2][0];
        let y3 = plist[k+2][1];
        let z3 = plist[k+2][2];


        let v12 = new THREE.Vector3(x1-x2, y1-y2, z1-z2);
        let v32 = new THREE.Vector3(x3-x2, y3-y2, z3-z2);
        let vc = v12.clone().cross(v32).normalize();

        let angle = v12.angleTo(v32);
        if(angle>Math.PI/2)   angle = Math.PI - angle;
        
        for(let i=0; i<ring.length; i++){
            ring[i].applyAxisAngle(vc, -angle/2);
            vts.push(ring[i].x+x2, ring[i].y+y2, ring[i].z+z2);
            ring[i].applyAxisAngle(vc, -angle/2);
        }
    }

    for(let i=0; i<ring.length; i++){
        vts.push(ring[i].x+plist[plist.length-1][0], ring[i].y+plist[plist.length-1][1], ring[i].z+plist[plist.length-1][2]);
    }


    for(let i=0; i<plist.length-1; i++) for(let j=0; j<n; j++){
        index.push(n*i+j, n*i+(j+1)%n, n*(i+1)+j, n*(i+1)+(j+1)%n, n*(i+1)+j, n*i+(j+1)%n);
    }

    let geometry1 = new THREE.BufferGeometry();
    geometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vts),3));
    geometry1.computeVertexNormals();
    geometry1.setIndex(new THREE.BufferAttribute(new Uint16Array(index),1));
    geometry1.computeVertexNormals();

    //let material1 = new THREE.MeshNormalMaterial({side:THREE.DoubleSide, flatShading:false});

    //let mesh1 = new THREE.Mesh(geometry1, material1);

    return geometry1;

}


let geometry_surface, material_surface, mesh_surface;
let mesh_surface_group = new Array(vts2.length);

let index0 = [];    //空のポリゴンインデックス
let index2 = [];    //標準メビウスの帯のポリゴンインデックス
let index3 = [];    //中央で割いた標準メビウスの帯のポリゴンインデックス

console.log(index1.length/10);
let a2 = 240*8*4;
console.log(9600/2*4+a2);
console.log(9600*4-a2);

for(let i=0; i<index1.length; i+=3){

    //標準メビウスの帯のポリゴンインデックス設定
    if(index1.length*0.4<=i && i<index1.length*0.6){
        index2.push(index1[i]);
        index2.push(index1[i+1]);
        index2.push(index1[i+2]);
    }

    //中央で割いた標準メビウスの帯のポリゴンインデックス設定
    let a2 = 240*8*4;
    if((index1.length*0.2<=i&&i<index1.length*0.3) || (index1.length*0.7<=i&&i<index1.length*0.8)){
        index3.push(index1[i]);
        index3.push(index1[i+1]);
        index3.push(index1[i+2]);
    }
}


//曲面のマテリアル
material_surface = new THREE.MeshPhongMaterial({color:surfacecolor, side:THREE.DoubleSide, transparent:true, opacity:surfacealpha});


//曲面のメッシュの生成（21種類）
for(let i=0; i<vts2.length; i++){

    geometry_surface = new THREE.BufferGeometry();
    geometry_surface.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vts2[i]), 3));
    geometry_surface.setIndex(new THREE.BufferAttribute(new Uint16Array(index1),1));
    geometry_surface.computeVertexNormals();

    mesh_surface_group[i] = new THREE.Mesh(geometry_surface, material_surface);

}

//scene1にindex番目の曲面を追加
scene1.add(mesh_surface_group[index]);

//scene1にindex番目のチューブ群を追加
for(let i=0; i<mesh_tube_group[index].length; i++){
    scene1.add(mesh_tube_group[index][i]);
}



//#############################################################
//入力や操作に関する処理
//#############################################################


slidera.func = () =>{
    disposeSceneMeshes(scene1); //scene1からメッシュのマテリアル・ジオメトリを破棄した後、メッシュをscene1から取り除く
    index = Math.round(Number(slidera.value)*(mesh_surface_group.length-1));    //スライダーの値からindexを決定
    scene1.add(spherecut(mesh_surface_group[index], spherecut_radius)); //index番目の曲面に対してspherecutを行い、scene1に追加
    for(let i=0; i<mesh_tube_group[index].length; i++){ //index番目のチューブ群に対して、spherecutを行い、scene1に追加
        scene1.add(spherecut(mesh_tube_group[index][i], spherecut_radius));
    }
}


const select1 = document.getElementById('select1'); //曲面の種類を選択するセレクトボックス
select1.value = 'option2';  //セレクトボックスの初期値を「曲面全体」にする

//セレクトボックス変更時の処理
select1.addEventListener('change',(event)=>{

    //ポリゴンインデックスをindex0に設定し、ジオメトリを設定しなおす
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


    disposeSceneMeshes(scene1); //scene1からメッシュ及びそのジオメトリ、マテリアルを破棄する
    index = Math.round(Number(slidera.value)*(mesh_surface_group.length-1));    //スライダー値からindexを再設定

    //曲面・チューブ群をそれぞれ球面カットしたものをscene1に追加する
    scene1.add(spherecut(mesh_surface_group[index], spherecut_radius));    
    for(let i=0; i<mesh_tube_group[index].length; i++){
        scene1.add(spherecut(mesh_tube_group[index][i], spherecut_radius));
    }
    
});




//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    rotateobjects_common(scene1, camera1);

    renderer1.render(scene1, camera1);  //レンダリング
}
animate();




//ポイントリストをthree.vectorのリストに変換する
function veclist(arg){
    let result = [];
    for(let i=0; i<arg.length; i++){
        result.push(new THREE.Vector3(arg[i][0], arg[i][1], arg[i][2]));
    }
    return result;
}




//メッシュと球の半径を入力　入力したメッシュを球面カットしたメッシュを出力する
function spherecut(mesh1, r1){

    let vtsa;
    let indexa;

    vtsa = Array.from( mesh1.geometry.attributes.position.array );
    indexa = mesh1.geometry.index.array;
    
    let vtsr = vtsa.concat();
    let indexr = [];

    let lista = [];

    for(let i=0; i<indexa.length; i+=3){

        let x1, x2, x3, y1, y2, y3, z1, z2, z3;
    
        x1 = vtsa[indexa[i]*3];
        y1 = vtsa[indexa[i]*3+1];
        z1 = vtsa[indexa[i]*3+2];
        x2 = vtsa[indexa[i+1]*3];
        y2 = vtsa[indexa[i+1]*3+1];
        z2 = vtsa[indexa[i+1]*3+2];
        x3 = vtsa[indexa[i+2]*3];
        y3 = vtsa[indexa[i+2]*3+1];
        z3 = vtsa[indexa[i+2]*3+2];
    
        let flag1 = x1*x1 + y1*y1 + z1*z1 <= r1*r1;
        let flag2 = x2*x2 + y2*y2 + z2*z2 <= r1*r1;
        let flag3 = x3*x3 + y3*y3 + z3*z3 <= r1*r1;

        if(((x1-x2)**2 + (y1-y2)**2 + (z1-z2)**2 < r1*r1) && ((x2-x3)**2 + (y2-y3)**2 + (z2-z3)**2 < r1*r1) && ((x3-x1)**2 + (y3-y1)**2 + (z3-z1)**2 < r1*r1)){
        
            if( (flag1&&!flag2&&!flag3) || (!flag1&&flag2&&flag3)){
        
                let ta = f1(x1, y1, z1, x2, y2, z2, r1);
                let tb = f1(x1, y1, z1, x3, y3, z3, r1);
        
                let m1=-1, m2=-1;
        
                for(let j=0; j<lista.length; j++){
                    if( (lista[j][0]==indexa[i]&&lista[j][1]==indexa[i+1]) || (lista[j][0]==indexa[i+1]&&lista[j][1]==indexa[i])){
                        m1 = lista[j][2];
                    }
                    if( (lista[j][0]==indexa[i]&&lista[j][1]==indexa[i+2]) || (lista[j][0]==indexa[i+2]&&lista[j][1]==indexa[i]) ){
                        m2 = lista[j][2];
                    }
                }

                if(m1==-1){
                    m1 = vtsr.length/3;
                    vtsr.push(x1*ta+x2*(1-ta), y1*ta+y2*(1-ta), z1*ta+z2*(1-ta));
                    lista.push([indexa[i], indexa[i+1], m1]);
                }
                if(m2==-1){
                    m2 = vtsr.length/3;
                    vtsr.push(x1*tb+x3*(1-tb), y1*tb+y3*(1-tb), z1*tb+z3*(1-tb));
                    lista.push([indexa[i], indexa[i+2], m2]);
                }
                
                if(flag1)   indexr.push(indexa[i], m1, m2);
                else    indexr.push(m1, indexa[i+1], indexa[i+2], m2, m1, indexa[i+2]);
            }
        
            if( (!flag1&&flag2&&!flag3) || (flag1&&!flag2&&flag3) ){
        
                let ta = f1(x2, y2, z2, x1, y1, z1, r1);
                let tb = f1(x2, y2, z2, x3, y3, z3, r1);
        
                let m1 = -1, m2 = -1;
        
                for(let j=0; j<lista.length; j++){
                    if( (lista[j][0]==indexa[i]&&lista[j][1]==indexa[i+1]) || (lista[j][0]==indexa[i+1]&&lista[j][1]==indexa[i]) ){
                        m1 = lista[j][2];
                    }
                    if( (lista[j][0]==indexa[i+1]&&lista[j][1]==indexa[i+2]) || (lista[j][0]==indexa[i+2]&&lista[j][1]==indexa[i+1])){
                        m2 = lista[j][2];
                    }
                }
        
                if(m1==-1){
                    m1 = vtsr.length/3;
                    vtsr.push(x2*ta+x1*(1-ta), y2*ta+y1*(1-ta), z2*ta+z1*(1-ta));
                    lista.push([indexa[i], indexa[i+1], m1]);
                }
                if(m2==-1){
                    m2 = vtsr.length/3;
                    vtsr.push(x2*tb+x3*(1-tb), y2*tb+y3*(1-tb), z2*tb+z3*(1-tb));
                    lista.push([indexa[i+1], indexa[i+2], m2]);
                }
                
                if(flag2)   indexr.push(m1, indexa[i+1], m2);
                else    indexr.push(indexa[i], m1, indexa[i+2], m1, m2, indexa[i+2]);
            }
        
            if( (!flag1&&!flag2&&flag3) || (flag1&&flag2&&!flag3) ){
                let ta = f1(x3, y3, z3, x1, y1, z1, r1);
                let tb = f1(x3, y3, z3, x2, y2, z2, r1);
        
                let m1 = -1, m2 = -1;
        
                for(let j=0; j<lista.length; j++){
                    if( (lista[j][0]==indexa[i]&&lista[j][1]==indexa[i+2]) || (lista[j][0]==indexa[i+2]&&lista[j][1]==indexa[i])){
                        m1 = lista[j][2];
                    }
                    if( (lista[j][0]==indexa[i+1]&&lista[j][1]==indexa[i+2]) || (lista[j][0]==indexa[i+2]&&lista[j][1]==indexa[i+1])){
                        m2 = lista[j][2];
                    }
                }
        
                if(m1==-1){
                    m1 = vtsr.length/3;
                    vtsr.push(x3*ta+x1*(1-ta), y3*ta+y1*(1-ta), z3*ta+z1*(1-ta));
                    lista.push([indexa[i], indexa[i+2], m1]);
                }
                if(m2==-1){
                    m2 = vtsr.length/3;
                    vtsr.push(x3*tb+x2*(1-tb), y3*tb+y2*(1-tb), z3*tb+z2*(1-tb));
                    lista.push([indexa[i+1], indexa[i+2], m2]);
                }
                
                if(flag3)   indexr.push(m1, m2, indexa[i+2]);
                else   indexr.push(indexa[i], indexa[i+1], m1, m2, m1, indexa[i+1])
            }
        
            if(flag1 && flag2 && flag3){        
                indexr.push(indexa[i], indexa[i+1], indexa[i+2]);
            }

        }
    
    }

    
    function f1(x1, y1, z1, x2, y2, z2, r1){
        let t1, t2;

        t1 = (-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2 - Math.sqrt(-4*(- (r1**2) + x2**2 + y2**2 + z2**2)*(x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2) + 4*(-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2)**2)/2)/
        (x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2);

        t2 = (-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2 + Math.sqrt(-4*(- (r1**2) + x2**2 + y2**2 + z2**2)*(x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2) + 4*(-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2)**2)/2)/
        (x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2);
        
        if(0<=t1 && t1<=1)  return t1;
        else    return t2;
    }



    let geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vtsr), 3));
    geometry2.setIndex(new THREE.BufferAttribute(new Uint16Array(indexr),1));
    geometry2.computeVertexNormals();

    return new THREE.Mesh(geometry2, mesh1.material.clone());
}


//シーンに含まれる全てのメッシュのジオメトリ・マテリアルを破棄した後、メッシュを取り除く
function disposeSceneMeshes(scene) {
    

    const meshesToRemove = [];

    scene.traverse((object) => {
        if (object.isMesh) {
            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => {
                        material.dispose();
                    });
                } else {
                    object.material.dispose();
                }
            }

            meshesToRemove.push(object);
        }
    });

    meshesToRemove.forEach((mesh) => {
        scene.remove(mesh);
    });
}
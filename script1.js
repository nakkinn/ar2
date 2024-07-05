//#############################################################
//グローバル変数
//#############################################################

let canvasover = false; //trueのときマウスホイール（2本指スライド）でグラフィックを拡大縮小、falseのときページスクロール
let twofinger = false;  //タッチパッドで2本指操作しているときtrue, そのとき回転軸を維持する
let mouseIsPressed = false; //マウスが押されている（タップ）状態か否か
let pmouseX1=-1, pmouseY1=-1, pmouseX2=-1, pmouseY2=-1; //1フレーム前のマウス（タッチ）座標
let mousemovementX=0, mousemovementY=0; //マウス移動量

let width1, height1;    //キャンバスサイズ
let angularvelocity1 = new THREE.Vector3(0,0,0);    //オブジェクトの回転軸　大きさが回転速度に比例する　（初めから回転させることも可能）



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

width1 = renderer1.domElement.width;    //キャンバスサイズ（カメラ設定に使う）
height1 = renderer1.domElement.height;


// カメラ
//透視投影
const camera1 = new THREE.PerspectiveCamera(60, width1 / height1, 0.01, 50);    //最後の2つの引数は描画範囲（最も近い距離、最も遠い距離）

//直交投影
// const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
// let aspectratio1 = width1 / height1;
// if(width1 > height1){   //直交投影の描画範囲指定（縦長、横長で場合分け）
//     camera1.left = -aspectratio1;
//     camera1.right = aspectratio1;
//     camera1.top = 1;
//     camera1.bottom = -1;
// }else{
//     camera1.left = -1;
//     camera1.right = 1;
//     camera1.top = 1 / aspectratio1;
//     camera1.bottom = -1 / aspectratio1;
// }

camera1.position.set(0,0,15);  //カメラ初期位置
camera1.zoom = 1;   //カメラズーム量（オブジェクトが画面に表示されない場合は、これを調整すると表示されることがある）
camera1.updateProjectionMatrix(); //カメラの設定適用


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


//姿勢更新のためのダミーオブジェクト
let dummymesh = new THREE.Mesh();   //マウスドラッグ時これを回転させて、他のオブジェクトの姿勢をダミーオブジェクトの姿勢と一致させる
dummymesh.rotation.set(0.3, 0, 0);  //初期姿勢 x-y-z系オイラー角



//#############################################################
//表示するグラフィック　・　パラメータとして使うスライダー
//#############################################################


const slider1 = document.getElementById('rangeslider1');    //スライダー1 Number(slider1.value)でこのスライダーの出力値が数値として取得できる
slider1.addEventListener('input',()=>{  //スライダーのつまみが動かされた時の処理
    updateobjects(scene1);  //引数のシーンに含まれる全てのオブジェクトの頂点座標を更新する（自作関数parametricmesh, parametrictubeで作られたものに限る）
});


//メビウスの帯2変数関数
const mebius_func1 = function(u, v){
    let x, y, z;
    let t1 = Number(slider1.value);
    let v1 = ((1-t1)*v+t1) * 3; //スライダーを動かすと中央線から裂ける
    
    x = (5 + v1 * Math.cos(u/2)) * Math.cos(u);
    y = (5 + v1 * Math.cos(u/2)) * Math.sin(u);
    z = v1 * Math.sin(u/2);

    return [x, y, z];
}

//メビウスの帯　中央線
const corecurve_func1 = function(u){
    let x, y, z;
    x = 5 * Math.cos(u);
    y = 5 * Math.sin(u);
    z = 0;
    return [x, y, z];
}

//メビウスの帯　境界線
const boundarycurve_func1 = function(u){
    x = (5 + 3  * Math.cos(u/2)) * Math.cos(u);
    y = (5 + 3 * Math.cos(u/2)) * Math.sin(u);
    z = 3 * Math.sin(u/2);
    return [x, y, z];
}

//曲面・チューブの生成
let mebius1 = parametricmesh(mebius_func1, [0, Math.PI*4], [0, 1], {meshcolor:0xd9ee85, detailv:6, detailu:120, animation:true});
let corecurve1 = parametrictube(corecurve_func1, [0, Math.PI*2], 0.1, {meshcolor:0xff3300});
let boundarycurve1 = parametrictube(boundarycurve_func1, [0, Math.PI*4], 0.1, {meshcolor:0x0033ff, detailu:120});
/*
・parametciemesh
第1引数：u,vを入力, [x,y,z]を出力とする曲面を表す2変数関数
第2,3引数：u,vの範囲
第4引数：オプション（省略可）
　meshcolor:色, detailu:u曲線の分割数, detailv:v曲線の分割数, scale:スケール, animation:スライダーで動かす場合trueにする, opacity:透明度(0~1)

・parametrictube
第1引数：uを入力, [x,y,z]を出力とする曲線を表す1変数関数
第2引数：uの範囲
第3引数：チューブの太さ
第4引数：オプション（省略可）
　meshcolor:色, detailu:u曲線の分割数, scale:スケール, animation:スライダーで動かす場合trueにする, opacity:透明度(0~1), 
*/

scene1.add(mebius1);    //シーンに追加
scene1.add(corecurve1);
scene1.add(boundarycurve1);



//#############################################################
//入力や操作に関する処理
//#############################################################

const check1 = document.getElementById('checkbox1');    //中央線の表示・非表示を切り替えるチェックボックス
check1.addEventListener('change',()=>{  //チェックボックスの値が切り替わったときの処理
    if(check1.checked){ //チェックボックスにチェックが入っている場合
        corecurve1.visible = true;  //中央線チューブを表示する
    }else{  //チェックボックスにチェックが入っていない場合
        corecurve1.visible = false; //中央線チューブを非表示にする
    }
});


//キャンバス上で操作しているか否かの切り替え
document.addEventListener('click', (event)=>{   //第1引数　'click'：ページをクリックすると発火, 'mousemove'：異なる要素にマウスが移動すると発火
    if(event.target.tagName.toLowerCase()=='canvas'){   //クリック位置（移動先）がキャンバス要素のとき
        canvasover = true;  //キャンバス操作オン
        document.body.style.overflow = 'hidden';    //スクロール無効にする
    }else{   //クリック位置（移動先）がキャンバス要素でないとき
        canvasover = false;  //キャンバス操作オフ
        document.body.style.overflow = '';  //スクロール有効にする
    }
})


//マウスホイールイベント
document.addEventListener('wheel', function(event) {
    if(canvasover){ //キャンバス操作モードのときカメラズームを調整
        if(event.deltaY > 0) camera1.zoom *= 0.8;
        else camera1.zoom *= 1.25;
        camera1.updateProjectionMatrix();
    }
});


//マウスイベント
//マウスプレス・リリース時にmouseIsPressedを切り替え
renderer1.domElement.addEventListener('pointerdown',()=>{mouseIsPressed = true;});
document.addEventListener('pointerup',()=>{mouseIsPressed = false;});
//マウス移動量の更新
renderer1.domElement.addEventListener('pointermove',(event)=>{
    mousemovementX = event.movementX;
    mousemovementY = event.movementY;
});


//タッチイベント
renderer1.domElement.addEventListener('touchmove', handleTouchMove, false);
renderer1.domElement.addEventListener('touchend', handleTouchEnd, false);

//画面（タッチパッド）を指でなぞったときの処理
function handleTouchMove(event){

    if(event.touches.length==2){    //指2本で触れている

        twofinger = true;

        if(pmouseX1==-1 || pmouseY1==-1 || pmouseX2==-1 || pmouseY2==-1){   //1フレーム前は2本指でないとき

            pmouseX1 = event.touches[0].clientX;
            pmouseY1 = event.touches[0].clientY;
            pmouseX2 = event.touches[1].clientX;
            pmouseY2 = event.touches[1].clientY;

        }else{  //1フレーム前も2本指のとき

            let mx1, my1, mx2, my2;
            mx1 = event.touches[0].clientX;
            my1 = event.touches[0].clientY;
            mx2 = event.touches[1].clientX;
            my2 = event.touches[1].clientY;

            let d1, d2; 
            d1 = Math.sqrt((pmouseX1-pmouseX2)**2+(pmouseY1-pmouseY2)**2);  //1フレーム前の2つのタップ箇所の距離
            d2 = Math.sqrt((mx1-mx2)**2+(my1-my2)**2);  //現在の2つのタップ箇所の距離

            camera1.zoom *= d2 / d1 * 0.5;  //カメラのズーム量を変更
            camera1.updateProjectionMatrix();

            pmouseX1 = mx1;
            pmouseY1 = my1;
            pmouseX2 = mx2;
            pmouseY2 = my2;

        }

    }else if(event.touches.length==1){  //指1本で触れている
        pmouseX1 = event.touches[0].clientX;
        pmouseY1 = event.touches[0].clientY;
    }
}

//画面（タッチパッド）から指を離したときの処理
function handleTouchEnd(){
    pmouseX1 = -1;
    pmouseY1 = -1;
    pmouseX2 = -1;
    pmouseY2 = -1;
    twofinger = false;
}



//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことでこの関数内の処理が繰り返される

    //キャンバスを1点でプレスしているとき回転ベクトルを更新
    if(mouseIsPressed && !twofinger)  angularvelocity1.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    let axis = angularvelocity1.clone().normalize();    //回転軸
    let rad = angularvelocity1.length()*0.005;  //回転量

    dummymesh.rotateOnWorldAxis(axis, rad); //ダミーメッシュを回転

    scene1.traverse((object)=>{ //scene1に含まれる全てのメッシュの姿勢をダミーメッシュと一致させる
        if(object.isMesh){
            object.rotation.copy(dummymesh.rotation);
        }
    });

    mousemovementX = 0; //マウス移動量を初期化
    mousemovementY = 0;

    renderer1.render(scene1, camera1);  //レンダリング
}
animate();



//#############################################################
//自作関数
//#############################################################


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


//parametricmesh及びparametrictubeで生成したオブジェクトの座標更新　ver1.0
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
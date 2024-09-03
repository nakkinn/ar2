angularvelocity1_common = new THREE.Vector3(0, 0, 0);    //回転を表すベクトル（方向が回転軸、大きさが回転速度に比例）初期値を0ベクトル以外にするとはじめから回転する
dummymesh_common.rotation.set(0.4, 0.2, 0); //初期姿勢（x-y-z系オイラー角）


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
const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);   //直交投影カメラ

camera1.position.set(0,0,20);  //カメラ初期位置

let aspectratio1 = width1 / height1;

if(width1 > height1){
    camera1.left = -5*aspectratio1;
    camera1.right = 5*aspectratio1;
    camera1.top = 5;
    camera1.bottom = -5;
}else{
    camera1.left = -5;
    camera1.right = 5;
    camera1.top = 5 / aspectratio1;
    camera1.bottom = -5 / aspectratio1;
}

camera1.zoom = 1;
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

//立方体　頂点座標・辺の頂点番号リスト
const cube_vts = [[2, 2, 2], [2, -2, 2], [-2, -2, 2], [-2, 2, 2], [2, 2, -2], [2, -2, -2], [-2, -2, -2], [-2, 2, -2]];  
const cube_edge = [[0,1],[0,3],[0,4],[1,2],[1,5],[2,3],[2,6],[3,7],[4,5],[4,7],[5,6],[6,7]];

//正二十面体　頂点座標・辺の頂点番号リスト
const ico_vts = [[3.23607, 2., 0.], [3.23607, -2., 0.], [-3.23607, -2., 0.], [-3.23607, 2., 0.], [0., 3.23607, 2.], [0., 3.23607, -2.], [0., -3.23607, -2.], [0., -3.23607, 2.], [2., 0., 3.23607], [-2., 0., 3.23607], [-2., 0., -3.23607], [2., 0., -3.23607]];
const ico_edge = [[0,1],[0,4],[0,5],[0,8],[0,11],[1,6],[1,7],[1,8],[1,11],[2,3],[2,6],[2,7],[2,9],[2,10],[3,4],[3,5],[3,9],[3,10],[4,5],[4,8],[4,9],[5,10],[5,11],[6,7],[6,10],[6,11],[7,8],[7,9],[8,9],[10,11]]


let vts = [];   //頂点座標
let edge = [];  //辺の頂点番号

//はじめは正二十面体のデータを使う
vts = new Array(ico_vts.length);
for(let i=0; i<vts.length; i++) vts[i] = ico_vts[i].concat();
edge = new Array(ico_edge.length);
for(let i=0; i<edge.length; i++)    edge[i] = ico_edge[i].concat();


const slider1 = document.getElementById('slider1');     //角度スライダー
const slider2 = document.getElementById('slider2');     //太さスライダー
const slider3 = document.getElementById('slider3');     //長さスライダー


const select1 = document.getElementById('select1');     //基本となる多面体セレクトボックス
const select2 = document.getElementById('select2');     //配色セレクトボックス
const select3 = document.getElementById('select3');     //顕著な図形セレクトボックス

select1.value = 'option2';  //基本となる多面体の初期値を正二十面体から正十二面体にする（2つ目の選択肢）
select2.value = '6cola';    //配色の初期値


//角度・太さ・長さの変数定義　初期値をスライダーの値を使って決定
let rotate_angle = -Math.PI/2*Number(slider1.value);
let tube_thick = Number(slider2.value)*0.6 + 0.1;
let tube_length = Number(slider3.value)*5;


//10種類のマテリアル
let tube_material = [
    new THREE.MeshLambertMaterial({ color: 0xff7700, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xff40cc, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xf4ff1f, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x77ff00, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x0077ff, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x7700ff, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xff2200, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x00aa22, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0x2200cc, side:THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side:THREE.DoubleSide}),
];



let meshgroup = new THREE.Group();  //全てのチューブを１つにまとめたグループ　マウスドラッグ時、グループごと回転させる
scene1.add(meshgroup);



//meshgroupにv1とv2を結ぶ半径r1のチューブを追加　マテリアルの種類をciで指定
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


//すでにあるmeshgroupを破棄、角度・太さ・長さを更新した後、meshgroupを生成し直す
function main(){

    disposeSceneMeshes(scene1, meshgroup);  //meshgroupのジオメトリ・マテリアルを破棄した後、scene1からmeshgroupを取り除く

    meshgroup = new THREE.Group();  //meshgroupを再定義

    rotate_angle = -Math.PI/2*Number(slider1.value);    //角度・太さ・長さを更新　Number(slider.value)は0から1の値
    tube_thick = Number(slider2.value)*0.6 + 0.1;
    tube_length = Number(slider3.value)*5;


    //多面体の辺の数だけループを回してチューブを生成する
    for(let i=0; i<edge.length; i++){

        let x1, y1, z1, x2, y2, z2;
        x1 = vts[edge[i][0]][0];
        y1 = vts[edge[i][0]][1];
        z1 = vts[edge[i][0]][2];
        x2 = vts[edge[i][1]][0];
        y2 = vts[edge[i][1]][1];
        z2 = vts[edge[i][1]][2];

        let v1a = new THREE.Vector3(x1, y1, z1);    //辺の片側の頂点位置
        let v2a = new THREE.Vector3(x2, y2, z2);    //辺の片側の頂点位置

        let va = new THREE.Vector3((x1+x2)/2, (y1+y2)/2, (z1+z2)/2);    //辺の中点

        let v1b, v2b, v1c, v2c;

        //辺の2頂点を中点を中心にrotate_angleだけ回転させる
        v1b = v1a.clone().sub(va);
        v1b.applyAxisAngle(va.clone().normalize(), rotate_angle);
        v1b.add(va);

        v2b = v2a.clone().sub(va);
        v2b.applyAxisAngle(va.clone().normalize(), rotate_angle);
        v2b.add(va);

        v1c = new THREE.Vector3((-tube_length+1)*va.x+tube_length*v1b.x, (-tube_length+1)*va.y+tube_length*v1b.y, (-tube_length+1)*va.z+tube_length*v1b.z);
        v2c = new THREE.Vector3((-tube_length+1)*va.x+tube_length*v2b.x, (-tube_length+1)*va.y+tube_length*v2b.y, (-tube_length+1)*va.z+tube_length*v2b.z);
    
        let cl=0;

        //辺番号と配色のセレクトボックスの値で辺の色を決定する
        if(select1.value=='option1' || select2.value=='option1'){   //立方体モードまたは単色モードのとき

            cl = 4;

        }else if(select2.value=='6cola'){

            //5本平行棒
            if(i==0 || i==13 || i==16 || i==19 || i==25)    cl = 0;
            if(i==1 || i==11 || i==22 || i==24 || i==28)    cl = 1;
            if(i==2 || i==8 || i==12 || i==14 || i==23)    cl = 2;
            if(i==3 || i==6 || i==10 || i==17 || i==18)    cl = 3;
            if(i==4 || i==7 || i==9 || i==21 || i==27)    cl = 4;
            if(i==5 || i==15 || i==20 || i==26 || i==29)    cl = 5;
            
        }else if(select2.value == '6colb'){

            //5角形6個
            cl = 5;
            if(i==0 || i==22 || i==17 || i==12 || i==26)    cl=0;
            if(i==1 || i==15 || i==13 || i==23 || i==7)    cl=1;
            if(i==2 || i==29 || i==10 || i==27 || i==19)    cl=2;
            if(i==3 || i==8 || i==24 || i==9 || i==20)    cl=3;
            if(i==4 || i==5 || i==11 || i==16 || i==18)    cl=4;

        }else if(select2.value=='5col'){

            //正四面体5個
            cl = 0;
            if(i==0 || i==9 || i==18 || i==23 || i==28 || i==29)  cl=1;
            if(i==1 || i==10 || i==21 || i==26 || i==8 || i==16)  cl=2;
            if(i==2 || i==11 || i==7 || i==17 || i==20 || i==25)  cl=3;
            if(i==3 || i==13 || i==22 || i==27 || i==5 || i==14)  cl=4;

        }else if(select2.value == '10cola'){

            //正三角形10個
            if(i==1 || i==5 || i==9)    cl = 1;
            if(i==2 || i==13 || i==26)  cl = 2;
            if(i==3 || i==12 || i==29)  cl = 3;
            if(i==4 || i==10 || i==20)  cl = 4;
            if(i==6 || i==16 || i==22)  cl = 5;
            if(i==7 || i==14 || i==24)  cl = 6;
            if(i==8 || i==17 || i==28)  cl = 7;
            if(i==11 || i==0 || i==15)  cl = 8;
            if(i==19 || i==21 || i==23)  cl = 9;
            
        }else if(select2.value == '10colb'){
            
            //3本平行棒
            if(i==0 || i==10 || i==14)    cl = 1;
            if(i==1 || i==12 || i==25)    cl = 2;
            if(i==2 || i==6 || i==9)      cl = 3;
            if(i==3 || i==11 || i==21)    cl = 4;
            if(i==4 || i==13 || i==28)    cl = 5;
            if(i==5 || i==17 || i==19)    cl = 6;
            if(i==7 || i==16 || i==29)    cl = 7;
            if(i==8 || i==15 || i==27)    cl = 8;
            if(i==18 || i==24 || i==26)    cl = 9;
        }
        

        addtube(v1c, v2c, tube_thick, cl);  //meshgroupにチューブを追加する
    }

    scene1.add(meshgroup);  //sceneにmeshgroupを追加する

    let kakudo = -rotate_angle / Math.PI * 180; //角度（度数法）
    document.getElementById('label1').textContent = Math.round(kakudo) + '度'; //表示する角度の値を更新

}


main();


//#############################################################
//入力や操作に関する処理
//#############################################################

const label1 = document.getElementById('label1');


//角度スライダー
slider1.addEventListener('input',()=>{
    main();
    select3.value = 'null'; //顕著な図形セレクトボックスの値をからの要素に変更する
});

//太さスライダー
slider2.addEventListener('input',()=>{
    main();
    select3.value = 'null';
});

//長さスライダー
slider3.addEventListener('input',()=>{
    main();
    select3.value = 'null';
});



//基本となる多面体を変更時の処理
select1.addEventListener('change',()=>{

    if(select1.value=='option1'){   //基本となる多面体が立方体

        //頂点リスト・辺インデックスリストを立方体のものに置き換える
        vts = new Array(cube_vts.length);
        for(let i=0; i<vts.length; i++) vts[i] = cube_vts[i].concat();
        edge = new Array(cube_edge.length);
        for(let i=0; i<edge.length; i++)    edge[i] = cube_edge[i].concat();

        main(); //チューブの再生成

        camera1.zoom *= 1.25;   //大きめに表示
        camera1.updateProjectionMatrix();   //カメラ情報の変更を適用

        let hide_elements_array = document.getElementsByClassName("hideElement");   //classが"hideElement"のhtml要素のリストを取得する
        for(let i=0; i<hide_elements_array.length; i++){
            hide_elements_array[i].hidden = true;   //classが"hideElement"のhtml要素を非表示にする
        }

    }else{  //基本となる多面体が正二十面体

        //頂点リスト・辺インデックスリストを正二十面体のものに置き換える
        vts = new Array(ico_vts.length);
        for(let i=0; i<vts.length; i++) vts[i] = ico_vts[i].concat();
        edge = new Array(ico_edge.length);
        for(let i=0; i<edge.length; i++)    edge[i] = ico_edge[i].concat();

        main(); 

        camera1.zoom *= 0.8;
        camera1.updateProjectionMatrix();   

        let hide_elements_array = document.getElementsByClassName("hideElement");   
        for(let i=0; i<hide_elements_array.length; i++){
            hide_elements_array[i].hidden = false;  //classが"hideElement"のhtml要素を表示する
        }
    }
});



//色セレクトボックス変更時の処理
select2.addEventListener('change',()=>{
    main(); //チューブの再生成
});



//顕著に表れる図形セレクトボックス変更時の処理
select3.addEventListener('input',()=>{

    //スライダーの値を更新
    if(select3.value=='ico'){
        slider1.value = 0;
        slider2.value = 0.16;
        slider3.value = 0.18;
        main();
    }

    if(select3.value=='triangle'){
        slider1.value = 0.232;
        slider2.value = 0.2;
        slider3.value = 0.56;
        select2.value = '10cola';
        main();
    }

    if(select3.value=='5parallel'){
        slider1.value = 0.348;
        slider2.value = 0.35;
        slider3.value = 0.26;
        select2.value = '6cola';
        main();
    }

    if(select3.value=='pentagon'){
        slider1.value = 0.648;
        slider2.value = 0.26;
        slider3.value = 0.23;
        select2.value = '6colb';
        main();
    }

    if(select3.value=='star'){
        slider1.value = 0.648;
        slider2.value = 0.26;
        slider3.value = 0.98;
        select2.value = '6colb';
        main();
    }

    if(select3.value=='3parallel'){
        slider1.value = 0.768;
        slider2.value = 0.2;
        slider3.value = 0.26;
        select2.value = '10colb';
        main();
    }

    if(select3.value=='tetra'){
        slider1.value = 0.5;
        slider2.value = 0.23;
        slider3.value = 0.45;
        select2.value = '5col';
        main();
    }

    if(select3.value=='dodeca'){
        slider1.value = 1;
        slider2.value = 0.18;
        slider3.value = 0.12;
        main();
    }

});




//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    rotateobjects_common(scene1, camera1);  //オブジェクトの回転

    renderer1.render(scene1, camera1);  //レンダリング（CG描画）
}
animate();




//シーンに含まれる全てのメッシュのジオメトリ・マテリアルを破棄した後、メッシュを取り除く
function disposeSceneMeshes(scene, group) {
  // グループ内の全てのメッシュを削除
  group.children.forEach((mesh) => {
    if (mesh.geometry) {
      mesh.geometry.dispose(); // ジオメトリを削除
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        // マルチマテリアルの場合
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose(); // マテリアルを削除
      }
    }
  });

  // グループをシーンから削除
  scene.remove(group);
}


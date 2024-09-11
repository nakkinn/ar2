//4つのCG表示プログラム　共有スクリプト
//マウス・タッチ操作に関する処理

//この共有スクリプトと個別のスクリプト両方で使う変数や関数の名前の後ろに「_common」と付けている

//#############################################################
//グローバル変数

//#############################################################

let canvasover = false; //trueのときマウスホイール（2本指スライド）でグラフィックを拡大縮小、falseのときページスクロール
let twofinger = false;  //タッチパッドで2本指操作しているときtrue, そのとき回転軸を維持する
let mouseIsPressed = false; //マウスが押されている（タップ）状態か否か
let pmouseX1=-1, pmouseY1=-1, pmouseX2=-1, pmouseY2=-1; //1フレーム前のマウス（タッチ）座標　1フレーム前タッチされていなければ-1とする
let mousemovementX=0, mousemovementY=0; //マウス移動量

let angularvelocity1_common = new THREE.Vector3(0, 0, 0);   //オブジェクトの回転軸　大きさが回転速度に比例する
let dummymesh_common = new THREE.Mesh();    //ダミーオブジェクト（これの姿勢を他のオブジェクトにコピーする）

//#############################################################
//入力や操作に関する処理
//#############################################################


document.querySelectorAll('input[type="range"]').forEach(function(input) {  //スライダー操作時、画面スクロールが起きないようにする
    input.style.touchAction = 'none';
});

document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });   //スマホのダブルタップで拡大鏡が開くのを禁止する


//キャンバス要素
const mycanvas = document.getElementById("canvas1");    //idからhtmlファイルで生成したキャンバス要素を取得（htmlファイルではキャンバスのidを"canvas1"と設定する）
mycanvas.style.touchAction = "none";    //キャンバスをタッチ時スクロールや拡大縮小が起きないようにする


//スマホ操作時、左端からスワイプした際ブラウザバッグしないようにする・iphoneで長押し時拡大鏡が出ないようにする
document.getElementById("canvas1").addEventListener("touchmove",(event)=>{event.preventDefault();},{passive:false});    


//マウスホイールイベント　カメラのズーム値を変更
document.addEventListener('wheel', function(event) {

    if(canvasover){ //キャンバス操作モードのときカメラズームを調整

        //ズーム値を0.8倍または1.25倍する（0より大きい範囲で変わる）
        // if(event.deltaY > 0) camera1.zoom *= 0.8;    
        // else camera1.zoom *= 1.25;

        //ズーム値を+0.1または-0.1する（値が負になり得る。負のときオブジェクトは鏡像に見える）
        if(event.deltaY > 0) camera1.zoom -= 0.1;
        else camera1.zoom += 0.1;

        camera1.updateProjectionMatrix();
    }

});


//キャンバス上で操作しているか否かの切り替え
document.addEventListener('mousemove', (event)=>{   //第1引数　'click'：ページをクリックすると発火, 'mousemove'：異なる要素にマウスが移動すると発火
    if(event.target.tagName.toLowerCase()=='canvas'){   //クリック位置（移動先）がキャンバス要素のとき
        canvasover = true;  //キャンバス操作オン
        document.body.style.overflow = 'hidden';    //スクロール無効にする
    }else{   //クリック位置（移動先）がキャンバス要素でないとき
        canvasover = false;  //キャンバス操作オフ
        document.body.style.overflow = '';  //スクロール有効にする
    }
})


//マウスイベント
//マウスプレス・リリース時にmouseIsPressedを切り替え
mycanvas.addEventListener('pointerdown',()=>{mouseIsPressed = true;});
document.addEventListener('pointerup',()=>{mouseIsPressed = false;});

//マウス移動量の更新
mycanvas.addEventListener('pointermove',(event)=>{
    mousemovementX = event.movementX;
    mousemovementY = event.movementY;
});


//タッチイベント（スマホ画面やタッチパッドの操作）
mycanvas.addEventListener('touchmove', handleTouchMove, false); //タッチデバイスをなぞったときhandleTouchMoveを発火
mycanvas.addEventListener('touchend', handleTouchEnd, false);   //タッチデバイスから指を離したときhandleTouchEndを発火


//タッチデバイスを指でなぞったときの処理
function handleTouchMove(event){

    if(event.touches.length==2){    //指2本で触れている

        twofinger = true;

        if(pmouseX1==-1 || pmouseY1==-1 || pmouseX2==-1 || pmouseY2==-1){   //1フレーム前は2本指でないとき、1フレーム前の2点の座標を更新

            pmouseX1 = event.touches[0].clientX;
            pmouseY1 = event.touches[0].clientY;
            pmouseX2 = event.touches[1].clientX;
            pmouseY2 = event.touches[1].clientY;

        }else{  //1フレーム前も2本指のとき、1フレーム前と現在の2点分のタッチ座標を使ってズーム値を変更し、1フレーム前の座標を更新

            let mx1, my1, mx2, my2;
            mx1 = event.touches[0].clientX;
            my1 = event.touches[0].clientY;
            mx2 = event.touches[1].clientX;
            my2 = event.touches[1].clientY;

            let d1, d2; 
            d1 = Math.sqrt((pmouseX1-pmouseX2)**2+(pmouseY1-pmouseY2)**2);  //1フレーム前の2つのタップ箇所の距離
            d2 = Math.sqrt((mx1-mx2)**2+(my1-my2)**2);  //現在の2つのタップ箇所の距離

            camera1.zoom += ( d2 / d1 - 1) * 1; //最後の定数を大きくすると変化が大きくなる
            
            camera1.updateProjectionMatrix();

            pmouseX1 = mx1;
            pmouseY1 = my1;
            pmouseX2 = mx2;
            pmouseY2 = my2;

        }

    }else if(event.touches.length==1){  //指1本で触れている、1フレーム前の座標を1点分のみ更新

        if(pmouseX1==-1 || pmouseY1==-1){
            pmouseX1 = event.touches[0].clientX;
            pmouseY1 = event.touches[0].clientY;
        }else{
            mousemovementX = event.touches[0].clientX - pmouseX1;
            mousemovementY = event.touches[0].clientY - pmouseY1;
            pmouseX1 = event.touches[0].clientX;
            pmouseY1 = event.touches[0].clientY;
        }

    }
}


//タッチデバイスから指を離したときの処理
function handleTouchEnd(){
    pmouseX1 = -1;
    pmouseY1 = -1;
    pmouseX2 = -1;
    pmouseY2 = -1;
    twofinger = false;
}


//要素を長押し時、右クリックメニューが出ないようにする
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('html, body').forEach((element) => {
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.mozUserSelect = 'none';
    });
});



//#############################################################
//3Dオブジェクトの回転
//#############################################################

//sceneaに含まれるオブジェクトを回転
function rotateobjects_common(scenea, cameraa){

    //キャンバスを1点でプレスしているとき回転ベクトルを更新
    if(mouseIsPressed && !twofinger)  angularvelocity1_common.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    let axis = angularvelocity1_common.clone().normalize();    //回転軸
    let rad = angularvelocity1_common.length()*0.005;  //回転量（最後の定数を大きくすると動きが大きくなる）

    if(cameraa.zoom<0)  rad*=-1;    //ズーム値がマイナスのとき座標系が反転するため、回転方向を逆にする

    dummymesh_common.rotateOnWorldAxis(axis, rad); //ダミーメッシュを回転

    scenea.traverse((object)=>{ //scene1に含まれる全てのメッシュの姿勢をダミーメッシュと一致させる
        if(object.parent===scenea && (object.isMesh || object.isGroup)){
            object.rotation.copy(dummymesh_common.rotation);
        }
    });

    mousemovementX = 0; //マウス移動量を初期化
    mousemovementY = 0;

}
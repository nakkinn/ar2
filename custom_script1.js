//オブジェクトの回転ベクトルを設定（ベクトルの向き：回転軸, ベクトルの大きさ：回転速度に比例）
setAngularVelocityC(0, 0, 0);     


//キャンバスの背景色
setBackgroundColorC(0xeeeeee);   


// カメラ（必須）
addPerspectiveCameraC({fov:40});  //投射投影カメラ
//addOrthographicCameraC();   //平行投影カメラ


//環境光ライト
addAmbientLightC(0xffffff, 0.5);   //第1引数：光の色, 第2引数：光の強さ


//指向性ライト
addDirectionalLightC(0xffffff, 0.7, 1, 1, 1);   //第1引数：光の色, 第2引数：光の強さ, 第3,4,5引数：ライト位置(x,y,z), (x,y,z)から(0,0,0)に向かう方向にライトを当てる
addDirectionalLightC(0xffffff, 0.3, -1, -2, 1);


//オブジェクトの追加
let sc1 = 1.3;  //スケール

addTubeC(vts2, index_boundary1, 0.03, {color:0x0044ff, scale:sc1}); //境界チューブ

addTubeC(vts2, index_ucurve1, 0.015, {color:0xffaa69, scale:sc1});  //境界線に垂直に交わるカーブ

addTubeC(vts2, index_vcurve2, 0.015, {color:0x96e3ff, scale:sc1});  //境界線に平行なカーブ

addMeshC(vts2, index1, {color:0xd9ee85, opacity:0.8, scale:sc1});   //曲面




//レンダリング（必須）
animateC();

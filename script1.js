
//スライダー
const slider1 = document.getElementById('rangeslider1');
const slider2 = document.getElementById('rangeslider2');




//シーン
const scene1 = new THREE.Scene();


// レンダラー
const renderer1 = new THREE.WebGLRenderer({
    canvas:document.getElementById('canvas1'),   //描画するキャンバスをID指定（htmlファイルで設定したID）
    antialias: true //輪郭をスムーズにする
});
//renderer1.setSize(600, 400);    //キャンバスサイズを数値で指定
renderer1.setSize(window.innerWidth, window.innerHeight); //キャンバスをウィンドウフルサイズにする
renderer1.setClearColor(0xeeeeee);   //キャンバスの背景色



// カメラ
const camera1 = new THREE.PerspectiveCamera(60, renderer1.domElement.width / renderer1.domElement.height, 0.1, 500);  //透視投影カメラ
//const camera1 = new THREE.OrthographicCamera(-renderer1.domElement.width/2/20, renderer1.domElement.width/2/20, renderer1.domElement.height/2/20, -renderer1.domElement.height/2/20, 1, 100);   //直交投影カメラ
camera1.position.set(0, 0, 15);  //カメラ初期位置
//camera1.zoom = 1; //カメラの初期ズーム
//camera1.updateProjectionMatrix(); //ズームの変更を適用



//環境光ライト
const lighta = new THREE.AmbientLight(0xffffff, 0.4);   //第1引数：光の色, 第2引数：光の強さ
scene1.add(lighta);
//指向性ライト
const light1 = new THREE.DirectionalLight(0xffffff, 0.7);
light1.position.set(1,1,1);
scene1.add(light1);



//オブジェクト

let geometry_box = new THREE.BoxGeometry();
let material_blue = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:0x0044ff});
let material_red = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:0xff4400, wireframe:false});
let mesh_box = new THREE.Mesh(geometry_box, material_blue);




// let vts1 = [];
// let index1 = [];
// for(let i=0; i<=32; i++) for(let j=0; j<=32; j++){
//     vts1.push((i-16), (j-16), (i-16)*(i-16)*0.06);
    
// }

// for(let i=0; i<32; i++) for(let j=0; j<32; j++){
//     //index1.push(i*33+j, i*33+j+1, (i+1)*33+j);
//     index1.push(i*33+j, i*33+j+1, (i+1)*33+j, (i+1)*33+j+1, (i+1)*33+j, i*33+j+1);
// }

let geometry_custom1 = new THREE.BufferGeometry();
geometry_custom1.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vts1), 3));
geometry_custom1.setIndex(new THREE.BufferAttribute(new Uint16Array(index1),1));
geometry_custom1.computeVertexNormals();

let mesh_custom1 = new THREE.Mesh(geometry_custom1, material_blue);
mesh_custom1.scale.set(0.5, 0.5, 0.5);

//scene1.add(mesh_custom1);


let vts2 = [];
let index2 = [];

let vts3 = [];
let index3 = [];

vts3 = vts1.concat();


let cou = 0;

let r1 = 5;

let lista = [];

for(let i=0; i<index1.length; i+=3){

    let x1, x2, x3, y1, y2, y3, z1, z2, z3;

    x1 = vts1[index1[i]*3];
    y1 = vts1[index1[i]*3+1];
    z1 = vts1[index1[i]*3+2];
    x2 = vts1[index1[i+1]*3];
    y2 = vts1[index1[i+1]*3+1];
    z2 = vts1[index1[i+1]*3+2];
    x3 = vts1[index1[i+2]*3];
    y3 = vts1[index1[i+2]*3+1];
    z3 = vts1[index1[i+2]*3+2];

    

    let flag1 = x1*x1 + y1*y1 + z1*z1 <= r1*r1;
    let flag2 = x2*x2 + y2*y2 + z2*z2 <= r1*r1;
    let flag3 = x3*x3 + y3*y3 + z3*z3 <= r1*r1;

    if( (flag1&&!flag2&&!flag3) || (!flag1&&flag2&&flag3) ){

        let ta = f1(x1, y1, z1, x2, y2, z2, r1);
        let tb = f1(x1, y1, z1, x3, y3, z3, r1);

        // vts2.push(x1, y1, z1);
        // vts2.push(x1*ta+x2*(1-ta), y1*ta+y2*(1-ta), z1*ta+z2*(1-ta));
        // vts2.push(x1*tb+x3*(1-tb), y1*tb+y3*(1-tb), z1*tb+z3*(1-tb));
        // index2.push(cou, cou+1, cou+2);
        // cou += 3;

        let m1=-1, m2=-1;

        for(let j=0; j<lista.length; j++){
            if( (lista[j][0]==index1[i]&&lista[j][1]==index1[i+1]) || (lista[j][0]==index1[i+1]&&lista[j][1]==index1[i])){
                m1 = lista[j][2];
                console.log('abc')
            }
            if( (lista[j][0]==index1[i]&&lista[j][1]==index1[i+2]) || (lista[j][0]==index1[i+2]&&lista[j][1]==index1[i]) ){
                m2 = lista[j][2];
            }
        }
        if(m1!=-1 || m2!=-1)    console.log('recicle');
        if(m1==-1){
            m1 = vts3.length/3;
            vts3.push(x1*ta+x2*(1-ta), y1*ta+y2*(1-ta), z1*ta+z2*(1-ta));
            lista.push([index1[i], index1[i+1], m1]);
        }
        if(m2==-1){
            m2 = vts3.length/3;
            vts3.push(x1*tb+x3*(1-tb), y1*tb+y3*(1-tb), z1*tb+z3*(1-tb));
            lista.push([index1[i], index1[i+2], m2]);
        }
        
        if(flag1)   index3.push(index1[i], m1, m2);
        else    index3.push(m1, index1[i+1], index1[i+2], m2, m1, index1[i+2]);
    }

    if( (!flag1&&flag2&&!flag3) || (flag1&&!flag2&&flag3) ){

        let ta = f1(x2, y2, z2, x1, y1, z1, r1);
        let tb = f1(x2, y2, z2, x3, y3, z3, r1);

        let m1 = -1, m2 = -1;

        for(let j=0; j<lista.length; j++){
            if( (lista[j][0]==index1[i]&&lista[j][1]==index1[i+1]) || (lista[j][0]==index1[i+1]&&lista[j][1]==index1[i]) ){
                m1 = lista[j][2];
            }
            if( (lista[j][0]==index1[i+1]&&lista[j][1]==index1[i+2]) || (lista[j][0]==index1[i+2]&&lista[j][1]==index1[i+1])){
                m2 = lista[j][2];
            }
        }
        if(m1!=-1 || m2!=-1)    console.log('recicle');
        if(m1==-1){
            m1 = vts3.length/3;
            vts3.push(x2*ta+x1*(1-ta), y2*ta+y1*(1-ta), z2*ta+z1*(1-ta));
            lista.push([index1[i], index1[i+1], m1]);
        }
        if(m2==-1){
            m2 = vts3.length/3;
            vts3.push(x2*tb+x3*(1-tb), y2*tb+y3*(1-tb), z2*tb+z3*(1-tb));
            lista.push([index1[i+1], index1[i+2], m2]);
        }
        
        if(flag2)   index3.push(m1, index1[i+1], m2);
        else    index3.push(index1[i], m1, index1[i+2], m1, m2, index1[i+2]);
    }

    if( (!flag1&&!flag2&&flag3) || (flag1&&flag2&&!flag3) ){
        let ta = f1(x3, y3, z3, x1, y1, z1, r1);
        let tb = f1(x3, y3, z3, x2, y2, z2, r1);

        let m1 = -1, m2 = -1;

        for(let j=0; j<lista.length; j++){
            if( (lista[j][0]==index1[i]&&lista[j][1]==index1[i+2]) || (lista[j][0]==index1[i+2]&&lista[j][1]==index1[i])){
                m1 = lista[j][2];
            }
            if( (lista[j][0]==index1[i+1]&&lista[j][1]==index1[i+2]) || (lista[j][0]==index1[i+2]&&lista[j][1]==index1[i+1])){
                m2 = lista[j][2];
            }
        }

        if(m1==-1){
            m1 = vts3.length/3;
            vts3.push(x3*ta+x1*(1-ta), y3*ta+y1*(1-ta), z3*ta+z1*(1-ta));
            lista.push([index1[i], index1[i+2], m1]);
        }
        if(m2==-1){
            m2 = vts3.length/3;
            vts3.push(x3*tb+x2*(1-tb), y3*tb+y2*(1-tb), z3*tb+z2*(1-tb));
            lista.push([index1[i+1], index1[i+2], m2]);
        }
        
        if(flag3)   index3.push(m1, m2, index1[i+2]);
        else   index3.push(index1[i], index1[i+1], m1, m2, m1, index1[i+1])
    }



    if(flag1 && flag2 && flag3){

        vts2.push(x1, y1, z1);
        vts2.push(x2, y2, z2);
        vts2.push(x3, y3, z3);

        index2.push(cou, cou+1, cou+2);
        cou += 3;

        index3.push(index1[i], index1[i+1], index1[i+2]);
    }

}


console.log(lista);




function f1(x1, y1, z1, x2, y2, z2, r1){
    let t1, t2;

    t1 = (-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2 - Math.sqrt(-4*(- (r1**2) + x2**2 + y2**2 + z2**2)*(x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2) + 4*(-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2)**2)/2)/
    (x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2);

    t2 = (-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2 + Math.sqrt(-4*(- (r1**2) + x2**2 + y2**2 + z2**2)*(x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2) + 4*(-(x1*x2) + x2**2 - y1*y2 + y2**2 - z1*z2 + z2**2)**2)/2)/
    (x1**2 - 2*x1*x2 + x2**2 + y1**2 - 2*y1*y2 + y2**2 + z1**2 - 2*z1*z2 + z2**2);
    
    if(0<=t1 && t1<=1)  return t1;
    else    return t2;
}



let geometry_custom2 = new THREE.BufferGeometry();
geometry_custom2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vts3), 3));
geometry_custom2.setIndex(new THREE.BufferAttribute(new Uint16Array(index3),1));
geometry_custom2.computeVertexNormals();

let mesh_custom2 = new THREE.Mesh(geometry_custom2, material_red);
mesh_custom2.scale.set(0.5, 0.5, 0.5);

scene1.add(mesh_custom2);

//マウスイベント
let mouseIsPressed = false;
renderer1.domElement.addEventListener('pointerdown',()=>{mouseIsPressed = true;});
renderer1.domElement.addEventListener('pointerup',()=>{mouseIsPressed = false;});

let mousemovementX=0, mousemovementY=0;
renderer1.domElement.addEventListener('pointermove',(event)=>{
    mousemovementX = event.movementX;
    mousemovementY = event.movementY;
});

let angularvelocity = new THREE.Vector3(0,0,0);


//レンダリングを繰り返す
function animate(){

    requestAnimationFrame(animate); //この関数自身を呼び出すことで関数内の処理が繰り返される

    if(mouseIsPressed)  angularvelocity.lerp(new THREE.Vector3(mousemovementY,mousemovementX, 0),0.2);
    let axis = angularvelocity.clone().normalize();
    let rad = angularvelocity.length()*0.007;

    mousemovementX = 0;
    mousemovementY = 0;

    scene1.traverse((object)=>{
        if(object.isMesh){
            object.rotateOnWorldAxis(axis, rad);
        }
    });


    updateobjects(scene1);  //頂点座標の更新

    renderer1.render(scene1, camera1);  //レンダリング
}
animate();









// マウスホイールイベント（カメラのズームイン・アウト）
renderer1.domElement.addEventListener('wheel', function(event){
    if(event.deltaY > 0){
        camera1.zoom *= 0.8;
    }else{
        camera1.zoom *= 1.25;
    }
    camera1.updateProjectionMatrix();
});



//自作関数


//パラメトリックプロット　チューブ
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


//パラメトリックプロット　曲面　改良版
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
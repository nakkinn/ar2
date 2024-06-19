//2本指チェック用

let mx1=0, mx2=0, my1=0, my2=0;
let mess = 'null';

function setup(){
    createCanvas(windowWidth, windowHeight);
}

function draw(){
    background(255);

    textSize(30);

    noStroke(0);
    text(mx1, 80, 80);
    text(my1, 80, 120);
    text(mx2, 80, 160);
    text(my2, 80, 200);

    text(mess, 80, 280);
}


document.addEventListener('touchmove',handleTouchMove,false);

function handleTouchMove(event){
    mess = 'move';

    if(event.touches.length==2){
        mx1 = event.touches[0].clientX;
        my1 = event.touches[0].clientX;
        mx2 = event.touches[1].clientY;
        my2 = event.touches[1].clientY;
    }
}
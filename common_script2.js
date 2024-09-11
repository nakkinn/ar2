//折りたたみ要素の文字を「説明を閉じる」と「説明を開く」とで切り替える

//detail要素のidを 'mydetail', summaryタグの要素をsummary_labelとする

let counter_detail = 0;

document.getElementById('mydetail').addEventListener('toggle',(target)=>{
    if(counter_detail%2==0) document.getElementById('summary_label').textContent = '説明を閉じる'
    else  document.getElementById('summary_label').textContent = '説明を開く';
    counter_detail ++;
});
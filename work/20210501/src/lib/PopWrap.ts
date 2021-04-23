import query from "./query";

export default class Pop{

    private static instance;

    private PopEle:HTMLDivElement;

    private Popwrap:HTMLDivElement;

    protected clickStaus:boolean;

    constructor(){

        //判断是否存在实例
        if(Pop.instance){

            return Pop.instance;
        }

        this.clickStaus = false;

        this.create();

        //缓存
       Pop.instance = this;

    }

    private create(){


        const doc = document;

        this.PopEle = doc.createElement('div');

        this.PopEle.className = 'pop-mask hidden';


        this.Popwrap = doc.createElement('div');

        this.Popwrap.className = 'pop-wrap';



        this.PopEle.appendChild(this.Popwrap);


        doc.body.appendChild(this.PopEle);



        query.add(this.Popwrap,'click',event =>{

            const target = query.getTarget(event);

            //关闭弹窗操作
            if(target.className == 'pop-close'){

                this.hiddenFun();

                return;
            }


            if(target.className == 'copy-btn'){

                this.copyToClipboard(target.parentNode);

                return;

            }
           
        });

    

    }



    private copyToClipboard(target:HTMLElement){

        var win = window,
            doc = document,
            ele = query.getByClass('copy-txt',target)[0],
            txt = ele.value;
            
        if(win['clipboardData']){//IE浏览器
            win['clipboardData'].clearData();
            win['clipboardData'].setData("Text", txt);
            alert("复制成功！");
            return;
        }

        if(ele.select && doc.execCommand){
           ele.select();//首先要选中要复制的内容
            ele.setSelectionRange(0, ele.value.length);
            //doc.execCommand('Copy')返回值如果是 false 则表示操作不被支持或未被启用
            if( doc.execCommand('Copy') ){
                alert("复制成功！");
            }else{
                alert("复制操作不被支持，请双击内容复制！");
            }
        }
    }

    //失败，未在活动时间内或其他异常弹窗
    public tipsFun(msg:string){
        this.Popwrap.innerHTML = `<i class="pop-close"></i>
        <p class="pop-tipsfont">${msg}</p>`;
        this.show();
    }

    //实物奖励弹窗
    public tipWin(code){
        this.Popwrap.innerHTML = `<i class="pop-close"></i>
            <div class="pop-kama">您的礼包码：
                <p>
                    <input value="${code}" class="copy-txt" readonly>
                    <span class="copy-btn">复制</span>
                </p>
                <div class="pop-tips">温馨提示：请于游戏内激活领取</div>
            </div>`;
        this.show();
    }


    // 隐藏弹窗功能
    private hiddenFun(){

        this.Popwrap.innerHTML = '';

        query.addClass(this.PopEle,'hidden');
        
    }


    // 弹窗显示功能
    private show(){
        
        query.removeClass(this.PopEle,'hidden');

    }


    // 输出弹窗奖品记录功能
    public getItem( data:any){

        let str = '';

        query.forEach(data,item=>{

            const {create_time,type,name,code} = item;

            if(type){

                str += `<li>${create_time}<i>领取了</i>${name}<i>${code}</i></li>`;

            }else{

                str += `<li>${create_time}<i>领取了</i>${name}
                    <p>
                        <input value="${code}" class="copy-txt" readonly>
                        <span class="copy-btn">复制</span>
                    </p>
                </li>`;
            }

         
        });

        this.Popwrap.innerHTML = `<i class="pop-close"></i>
        <ul class="kama-item">
        ${str}
        </ul>
        <div class="pop-tips">温馨提示：礼包码请于游戏内激活领取</div>`;

        this.show();
    }

}

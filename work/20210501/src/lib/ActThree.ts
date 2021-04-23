import { UserInfoFace, ajaxUrl } from './Util';
import Pop from './PopWrap';
import query from './query';
import { jsonp } from './IO';

const pop = new Pop();

const style = ['transform','webkitTransform','MozTransform','OTransform','msTransform'];

const HTMLEle = document.documentElement;

const prefixStyle = function(){

    let key = '';

    for (let index = 0,len = style.length; index < len; index++){

        if(HTMLEle.style[style[index]] !== undefined){

            key = style[index];

            break;
        }
        
    }

    return key;

}();

const Emitter = require('tiny-emitter');


export default class extends Emitter{

    private wrap:HTMLElement;

    private userInfo:UserInfoFace;

    private clickStaus:boolean;

    private turntableBtn:HTMLLinkElement;

    private x:number;

    constructor(){

        super();

        this.userInfo = {
            id:''
        };

        this.x = 1;

        this.init(); 
    }



    private init(){


        this.wrap = query.getByClass('actThree')[0];

        this.turntableBtn = query.getByClass('turntableBtn',this.wrap)[0];


        query.add(this.wrap,'click',event=>{

            const target = query.getTarget(event);

            //点击领取
            if(target.className == 'turntableBtn'){

                query.preventDefault(event);

                if(!this.userInfo.id){

                    _jsiframeShow(0);

                    return;
                }

                this.achieveGift();

                return;

            }

        });

    }



    private showPop(data){

        this.clickStaus = false;
        
        const {type,msg} = data;

        /**
         * 谢谢参与
         */
        if(type == -1){

            pop.tipsFun(msg);

            return;
        }
        
        /**
         * 卡码
         */
        if(type == 0){

            pop.tipWin(data);

            return;
        }
        
        // /**
        //  * 实物
        //  */
        // if(type == 1){
            
        //     pop.tipsFun(msg,'恭喜您获得');

        // }

    }

    private async achieveGift(){

        if(this.clickStaus) return;

        this.clickStaus = true;

        const data = await jsonp(`${ajaxUrl}NationalDay2020/lottery?act_id=880`);
    
        if(data.status == 0){

            if(prefixStyle){

                let defaultNum = 1800;

                const style = this.turntableBtn.style[prefixStyle];

                if( style )  defaultNum = style.match(/(\d+)/)[0] - 0 + defaultNum;


                //this.turntableBtn.style[prefixStyle] = data.id * 60 + 1800;
                const {x} = this;

                const {id} = data;

                const deg = 60;

                const turns = 6;

                let z:number;

                if(id >= x){

                    z = (id - x)*deg;

                }

                if(id < x){

                    z = ( turns - ( this.x - data.id ) ) * deg;
                }

                this.x = id;

                this.turntableBtn.style[prefixStyle] = `rotate(${z + defaultNum}deg)`;

                setTimeout(()=>{

                    this.showPop(data);

                },2100);

                return;
            }


            this.showPop(data);

            this.clickStaus = false;

            return;
        }
        



        this.clickStaus = false;

        pop.tipsFun(data.msg);
        
    }



    public checkIn(data){

        this.userInfo = data;

    }

    public checkOut(){

        this.userInfo.id = '';

    }



}

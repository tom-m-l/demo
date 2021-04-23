import { UserInfoFace, ajaxUrl, topScroll } from './Util';
import Pop from './PopWrap';
import query from './query';
import { jsonp } from './IO';

const pop = new Pop();

export default class{

    private wrap:HTMLElement;

    private userInfo:UserInfoFace;

    private clickStaus:boolean;

    constructor(){

        this.userInfo = {
            id:''
        };


        this.init(); 
    }



    private init(){

        this.getRedItem();
        

        this.wrap = query.getByClass('actTwo')[0];


        query.add(this.wrap,'click',event=>{

            const target = query.getTarget(event);

            //点击领取
            if(target.className == 'redBtn'){

                query.preventDefault(event);

                if(!this.userInfo.id){

                    _jsiframeShow(0);

                    return;
                }

                this.getRed();

                return;

            }

        });

    }

    private async getRedItem(){

        const {data} = await jsonp(`${ajaxUrl}actQuery/actlog?act_id=878&user_log=0`);

        let str = '';

        query.forEach(data,item=>{

            str += `<li title="${`恭喜${item.username}获得${item.name}`}">
                恭喜${item.username} 获得 <em>${item.name}</em>
            </li>`;

        });

        const wrap = query.getByClass('recordTwo',this.wrap)[0];

        wrap.innerHTML = str;

        if(data.length > 18) topScroll( wrap.parentNode );
        
    }

    private async getRed(){

        if(this.clickStaus) return;

        this.clickStaus = true;
        
        const {status,msg,name} = await jsonp(`${ajaxUrl}actCommon/standardLottery?act_id=878`);

        this.clickStaus = false;

        if(status != 0){

            pop.tipsFun(msg);

            return;
        }

        pop.tipsFun(`恭喜您获得<b>${name}</b>`);

        this.getRedItem();
    }


    public checkIn(data){

        this.userInfo = data;

    }

    public checkOut(){

        this.userInfo.id = '';

    }



}

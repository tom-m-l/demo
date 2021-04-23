import { UserInfoFace, ajaxUrl } from './Util';
import Pop from './PopWrap';
import query from './query';
import { jsonp } from './IO';

const pop = new Pop();

export default class {

    private userInfo: UserInfoFace;

    private gameWrap: HTMLElement;

    private signWrap: HTMLElement;

    private giftWrap: HTMLElement;

    private giftId: number[];

    constructor() {

        this.userInfo = {
            id: ''
        };

        this.giftId = [902, 903, 904, 905, 906];

        this.init();

    }

    private init() {

        this.gameWrap = query.getByClass('gameItem')[0];
        this.signWrap = query.getByClass('signItem')[0];
        this.giftWrap = query.getByClass('giftItem')[0];

        this.gameList();

        this.actinfo();

        // game 领取游戏礼包
        query.add(this.gameWrap, 'click', el => {
            // pop.tipsFun('请先登录');
            const target = query.getTarget(el);
            if (target.className == 'game-btn') {

                this.getCardRepeat(target);

                return;

            }
        });

        // sign 签到
        query.add(this.signWrap, 'click', el => {

            const target = query.getTarget(el);

            if (target.className == 'sign-btn') {

                this.getCardRepeat(target);

                return;

            }

        });

        // exchange 积分兑换
        query.add(this.giftWrap, 'click', el => {

            const target = query.getTarget(el);

            if (target.className == 'gift-btn') {

                this.exchange(target.getAttribute('data-id'));

                return;

            }

        });

    }

    private async actinfo() {

        const { status, chance, check_id_data_arr, exchange_data_arr } = await jsonp(`${ajaxUrl}labourDay2021/actinfo?act_id=894`);

        if (status != 0) return;

        this.signList(check_id_data_arr);

        this.giftList(exchange_data_arr);

        query.getByClass('chance')[0].innerHTML = chance;

    }

    private gameList() {

        const name = ['水煮三国', '传奇霸主', '战龙归来', '盛世遮天', '裁决战歌', '斗罗大陆', '战神觉醒', '大城主'];

        let ls = '';

        for (const i in name) {
            ls += `
            <li>
                <i></i>
                <p class="game-btn" data-id="${Number(i) + 1}">${name[i]}</p>
            </li>`;
        }

        this.gameWrap.innerHTML = ls;

    }

    private signList(data: any) {

        // status 1是 0否 -1已结束 -2敬请期待
        let ls = '';

        function checkStatus(status) {
            const statusData = {
                className: '',
                tips: ''
            };
            if (status == -1) {
                statusData.className = 'end';
                statusData.tips = '已结束';
            }
            if (status == -2) {
                statusData.className = '';
                statusData.tips = '未开始';
            }
            if (status == 0) {
                statusData.className = 'ing';
                statusData.tips = '进行中';
            }
            if (status == 1) {
                statusData.className = 'ing';
                statusData.tips = '已领取';
            }
            return statusData;
        }

        query.forEach(data, (value, index) => {

            if (value.activity_id == 901) {
                ls += `
                <li class="signThree ing">
                    <p>累计签到 3 天</p>
                    <div class="bxItem">
                        <i></i>
                    </div>
                    <span class="sign-btn" data-id="${value.activity_id}"></span>
                </li>`;
            } else {
                ls += `
                <li class="${checkStatus(value.status).className}">
                    <p>5月${index + 1}号 ${checkStatus(value.status).tips}</p>
                    <div class="bxItem">
                        <i></i>
                    </div>
                    <span class="sign-btn" data-id="${value.activity_id}"></span>
                </li>`;
            }

        });

        this.signWrap.innerHTML = ls;

    }

    private giftList(data: any) {

        const { giftId } = this;

        let ls = '';

        query.forEach(data, (value, index) => {

            ls += `
            <li>
                <div class="gift-info">
                    <i></i>
                    <p class="gift-name">${value.name}</p>
                    <p class="gift-num">剩余数量：${value.surplus} <br>所需积分：${value.need_chances}</p>
                </div>
                <span class="gift-btn" data-id="${giftId[index]}"></span>
            </li>`;

        });

        this.giftWrap.innerHTML = ls;

    }

    private async getCardRepeat(target) {

        let act_id = 895, id = 1;

        if (target.className == 'game-btn') {
            id = target.getAttribute('data-id');
        }
        if (target.className == 'sign-btn') {
            act_id = target.getAttribute('data-id');
        }

        const { status, msg, name, code } = await jsonp(`${ajaxUrl}actCommon/getCardRepeat?act_id=${act_id}&id=${id}`);

        if (status == 0) {
            pop.tipWin(code);
            return;
        }

        pop.tipsFun(msg);

    }

    private async exchange(id) {

        const { status, msg, name, code } = await jsonp(`${ajaxUrl}labourDay2021/exchange?act_id=${id}`);

        if (status == 0) {
            pop.tipWin(code);
            return;
        }

        pop.tipsFun(msg);

    }


    public checkIn(data) {

        this.userInfo = data;

    }

    public checkOut() {

        //用户Id重置
        this.userInfo.id = '';

    }
}

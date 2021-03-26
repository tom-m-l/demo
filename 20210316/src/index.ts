import "./sass/index.scss";
import { Server } from '@flash-center/common';
import { jsonp } from "./lib/IO";

new class {
    private reward: HTMLElement;
    private gameWrap: HTMLElement;
    private winNews: HTMLElement;
    private oneBtn: HTMLElement;
    private threeBtn: HTMLElement;
    private gameItem: HTMLElement;
    private cardWrap: HTMLElement;
    private cardLs: HTMLElement;
    private gameData: any[];
    private cardData: any[];
    private PopEle: HTMLElement;
    private popInner: HTMLElement;

    constructor() {

        this.gameData = [
            {
                id: 1,
                name: '斗'
            }, {
                id: 2,
                name: '热门游戏礼包（五选一）'
            }, {
                id: 3,
                name: '罗'
            }, {
                id: 4,
                name: '盲盒周边'
            }, {
                id: 5,
                name: '万能卡'
            }, {
                id: 6,
                name: '谢谢参与'
            }, {
                id: 7,
                name: '陆'
            }, {
                id: 8,
                name: '京东卡50元'
            }, {
                id: 9,
                name: '大'
            }, {
                id: 10,
                name: '斗罗游戏包'
            }
        ];

        this.cardData = [
            {
                id: 1,
                name: 'dou'
            }, {
                id: 2,
                name: 'luo'
            }, {
                id: 3,
                name: 'da'
            }, {
                id: 4,
                name: 'lu'
            }, {
                id: 5,
                name: 'all'
            },
        ];

        this.init();

    }

    private init() {

        const doc = document;

        // 用户信息
        this.reward = doc.querySelector('.btn-reward');

        // 游戏 game-wrap
        this.gameWrap = doc.querySelector('.game-wrap');
        // win-news btn-one btn-three game-item
        this.winNews = this.gameWrap.querySelector('.win-news');
        this.oneBtn = this.gameWrap.querySelector('.btn-one');
        this.threeBtn = this.gameWrap.querySelector('.btn-three');
        this.gameItem = this.gameWrap.querySelector('.game-item');

        // card-wrap
        this.cardWrap = doc.querySelector('.card-wrap');
        this.cardLs = this.cardWrap.querySelector('.card-list');

        // pop wrap
        this.PopEle = doc.querySelector('.pop-mask');
        this.popInner = this.PopEle.querySelector('.pop-inner');
        this.PopEle.onclick = (e) => {
            const target = e.target as Element;
            if (target.className == 'pop-mask' || target.className == 'pop-close') {
                this.popClose();
            }
        };

        // 页面信息
        this.getUser();

        this.reward.onclick = () => {

            const giftData = {
                name: 'jd',
                code: '55555555555555'
            };

            const str = `x${giftData.name}xxxxx`;

            this.popShow(str, 'error');
        };

        this.oneBtn.onclick = () => {
            // 抽一次
            this.playGame(1);
        };

        this.threeBtn.onclick = () => {
            // 抽三次
            // this.playGame(3);
            this.popShow(this.gameData, 'reward');
        };

    }

    private async getUser() {

        // const data = await Server.fetchUserInfo(); ${data.username}

        this.winNews.innerHTML = `恭喜<span> xxx </span>抽中<span> 10 </span>星星`;
        let gameStr = '';
        let cardStr = '';

        for (const i of this.gameData) {
            gameStr += `<li data-id="${i.id}"><i></i><p>${i.name}</p></li>`;
        }
        for (const i of this.cardData) {
            cardStr += `<li data-id="${i.id}"></li>`;
        }
        this.gameItem.innerHTML = gameStr;
        this.cardLs.innerHTML = cardStr;

    }

    private async playGame(gift) {

        const data = await jsonp(`//apifc.flash.cn/huodong/zhuanpan?num=${gift}`);

        console.log(data);

        if (data.success == 1 || data[0].success == 1) {

            if (data.code && data.code.type == 4) {
                this.popShow(data.code.note, 'error');
                return;
            }

            if (data[0].code.type == 0) {
                console.log(data[0].code.note);
            }
            if (data[0].code.type == 1) {
                console.log('1，游戏礼包');
            }
            if (data[0].code.type == 2) {
                console.log('2，京东卡');
            }
            if (data[0].code.type == 3) {
                console.log('3，盲盒周边');
            }
            if (data[0].code.type == 5) {
                if (data[0].code.note == '斗') {
                    console.log('5，斗罗大陆字');
                }
                if (data[0].code.note == '罗') {
                    console.log('5，斗罗大陆字');
                }
                if (data[0].code.note == '大') {
                    console.log('5，斗罗大陆字');
                }
                if (data[0].code.note == '陆') {
                    console.log('5，斗罗大陆字');
                }
            }
            if (data[0].code.type == 6) {
                console.log('6，万能卡');
            }

            return;
        }

        this.popShow(data.msg, 'error');

        return;
        const gamels = this.gameItem.querySelectorAll('li');

        let num = 0;
        let time = (200 * gamels.length) * 2 + (gift * 200);

        const play = setInterval(() => {
            num++;
            if (num > gamels.length - 1) {
                num = 0;
            }
            for (const key in gamels) {
                if (Object.prototype.hasOwnProperty.call(gamels, key)) {
                    const element = gamels[key];
                    element.className = '';
                }
            }
            gamels[num].className = 'cur';

        }, 200);

        setTimeout(() => {
            clearInterval(play);
        }, time);

        this.showCard(3);

    }

    private showCard(card) {

        const list = this.cardWrap.querySelectorAll('.card-list li');

        for (const key in list) {
            if (Object.prototype.hasOwnProperty.call(list, key)) {
                const element = list[key];
                if (card == element.getAttribute('data-id')) {
                    element.className = 'cur';
                }
            }
        }
    }

    private popShow(msg, type) {

        let str = '';

        if (type == 'error') {
            str = `<div class="pop-error"><h2>温馨提示</h2><p>${msg}</p></div>`;
        }
        if (type == 'reward') {
            console.log(msg);
        }

        this.popInner.innerHTML = str;

        this.PopEle.classList.remove('hidden');
    }

    private popClose() {

        this.PopEle.classList.add('hidden');

    }

}
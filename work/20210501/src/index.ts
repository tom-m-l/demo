import "./sass/index.scss";
import query from "./lib/query";
import User from "./lib/User";
import ActOne from "./lib/ActOne";
// import ActTwo from "./lib/ActTwo";
// import ActThree from "./lib/ActThree";


/**
* 游戏礼包
*/
const actOne = new ActOne();


/**
* 签到
*/
// const actTwo = new ActTwo();


/**
* 积分礼物
*/
// const actThree = new ActThree();


/**
 * 用户基本信息
 */
const user = new User(query.getByClass('userInfor')[0]);

user.on('loginWinner', data => {

    actOne.checkIn(data);

    // actTwo.checkIn(data);

    // actThree.checkIn(data);

});

user.on('logOut', () => {

    actOne.checkOut();

    // actTwo.checkOut();

    // actThree.checkOut();

});
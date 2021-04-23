import query from "./query";

export const ajaxUrl = `//hd.2144.cn/`;

export interface UserInfoFace {
    [propName: string]: any;
}

export const topScroll = function(wrap){

    const height = wrap.offsetHeight;

    const chilrenEles = wrap.children;

    const ulOne = chilrenEles[0];

    const ulTwo = chilrenEles[1];

    let handle = 0;

    const fn = function(){
         // scrollTop：元素中的内容超出元素上边界的那一部分的高度
        // 判断scrollTwo的可视高度是否小于或等于recordDiv的scrollTop
        
        if(ulTwo.offsetHeight - wrap.scrollTop <= 0){            

            wrap.scrollTop -= ulOne.offsetHeight;

            return;

        }
        wrap.scrollTop++;
    };

    //可视高度小于显示框的高度时
    if(ulOne.offsetHeight <= height) return;

    ulTwo.innerHTML = ulOne.innerHTML;

    handle = window.setInterval(fn,90);

    query.add(wrap,'mouseover',() =>{

        clearInterval(handle);

    });

    query.add(wrap,'mouseout',() =>{

        handle = window.setInterval(fn,90);
        
    });

    return{
        clearTime:function(){
            clearInterval(handle);
        }
    }

}
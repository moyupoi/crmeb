export default function useScrollHeight(){
    const getScrollTop = () => {
        if(process.client){
            let scrollTop: number = 0,
                bodyScrollTop: number = 0,
                documentScrollTop: number = 0
            if (document.body) {
                bodyScrollTop = document.body.scrollTop
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop
            }
            scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
            return scrollTop
        }

    }
    //浏览器视口滚动的高度
    const getScrollHeight = () => {
        if(process.client){
            let scrollHeight: number = 0,
                bodyScrollHeight: number = 0,
                documentScrollHeight: number = 0
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight
            }
            scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight
            return scrollHeight
        }

    }
    //浏览器视口的高度
    const getWindowHeight = () => {
        if(process.client){
            let windowHeight: number = 0
            if (document.compatMode == 'CSS1Compat') {
                windowHeight = document.documentElement.clientHeight
            } else {
                windowHeight = document.body.clientHeight
            }
            return windowHeight
        }

    }
    return {
        getScrollTop,
        getScrollHeight,
        getWindowHeight,
    }
}
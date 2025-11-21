
export default function useRouterItem() {
    const route = useRoute()

    //获取浏览器传值
    const routeQuery = route.query

    return {
        routeQuery
    }
}

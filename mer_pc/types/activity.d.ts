import {PageQuery} from "~/types/global";

/**
 * 秒杀商品列表
 */
export interface SeckillListQuery extends PageQuery {
    date: string
    endTime: string
    startTime: string
}
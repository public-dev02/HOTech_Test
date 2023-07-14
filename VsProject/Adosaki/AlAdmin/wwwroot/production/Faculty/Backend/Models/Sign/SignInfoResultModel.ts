import { ShopInfo } from '@/Faculty/Backend/ModelsDB/ShopInfo';

/** 사인인이 성공하였을때 전달되는 정보(자바스크립트 전달용) */
export interface SignInfoResultModel 
{
    /** 검색된 매장 정보 */
    ShopInfo: ShopInfo,
    InfoCode: string,
    Message: string,
}
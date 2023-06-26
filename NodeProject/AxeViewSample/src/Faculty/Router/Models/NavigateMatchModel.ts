/** 데이터가 매치 됐을때 넘어오는 데이터  */
export interface NavigateMatchModel
{
    /** 추출된 URL */
    url: string;
    /** 추출된 쿼리 문자열*/
    queryString: string;
    /** 추출된 해쉬 문자열*/
    hashString: string;

    /** 판단된 데이터 리스트*/
    data: NavigateMatchDataModel[];
}

/** 판단된 데이터*/
export interface NavigateMatchDataModel
{
    /** 
     * 데이터 구분용 키. 
     * 없는 경우 ""값으로 주고 데이터 순서로만 판단한다.
     *   */
    key: string,
    /** 전달된 파라메타 */
    param: string,
}

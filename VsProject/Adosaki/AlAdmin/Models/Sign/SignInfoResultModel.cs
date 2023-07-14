using ApiResult;
using ModelsDB;

namespace AlAdmin.Models.Sign
{
    /// <summary>
    /// 사인인이 성공하였을때 전달되는 정보(자바스크립트 전달용)
    /// </summary>
	public class SignInfoResultModel : ApiResultBaseModel
    {
        /// <summary>
        /// 검색된 매장 정보
        /// </summary>
        public ShopInfo? ShopInfo { get; set; }


    }
}

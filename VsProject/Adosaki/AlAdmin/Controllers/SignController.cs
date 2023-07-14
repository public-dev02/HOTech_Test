using AlAdmin.Models.Sign;
using ApiResult;
using DGAuthServer.AuthAttribute;
using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Mvc;
using ModelsDB;

namespace AlAdmin.Controllers;


/// <summary>
/// 사인, 회원 관리 관련 컨트롤러
/// </summary>
[Route("api/[controller]/[action]")]
[ApiController]
public class SignController : Controller
{
    /// <summary>
    /// 사인 인
    /// </summary>
    /// <param name="sSignName"></param>
    /// <param name="sPassword"></param>
    /// <returns></returns>
    [HttpPut]
    [AllowAnonymous]
    public ActionResult<SignInfoResultModel> SignIn(
        [FromForm] string sSignName
        , [FromForm] string sPassword)
    {
        //로그인 처리용 모델
        ApiResultReady arReturn = new ApiResultReady(this);
        SignInfoResultModel rmReturn = new SignInfoResultModel();
        arReturn.ResultObject = rmReturn;

        DateTime dtNow = DateTime.Now;


        //유저 정보를 찾는다.
        long? idUser = DGAuthServerCookieGlobal.Service
                        .ClaimDataGet(this.HttpContext.User);

        if (null == idUser
            || 0 >= idUser)
        {
        }
        else
        {
            arReturn.InfoCode = "-10";
            arReturn.Message = "사인 인 상태에서는 사인인할 수 없습니다.";
        }

        if (true == arReturn.IsSuccess())
        {

            //자동 사인인 사용여부
            //쿠키 버전은 리플레시 토큰을 생성할때 자동으로 쿠키에 저장하므로
            //여기서는 별도의 관리를 하지 않는다.

            using (ModelsDbContext db1 = new ModelsDbContext())
            {
                Shop? findShop
                = db1.Shop.Where(w =>
                        w.SignName == sSignName
                        && w.PasswordHash == sPassword)
                .FirstOrDefault();

                if (null != findShop)
                {//매장 찾음

                    
                    //리플레시 토큰 생성
                    string st = string.Empty;

                    //엑세스 토큰 생성
                    string at
                        = DGAuthServerCookieGlobal.Service
                            .AccessTokenGenerate(
                                findShop.idShop
                                , true
                                , true
                                , this.Request
                                , this.Response
                                , out st);

                    //매장 정보 검색
                    ShopInfo findSI
                        = db1.ShopInfo
                            .Where(w => w.idShop == findShop.idShop)
                            .First();

                    rmReturn.ShopInfo = findSI;
                }
                else
                {
                    arReturn.ApiResultInfoSet("-1", "'아이디'나 비밀번호가 틀렸습니다.");
                }
            }//end using db1
        }

        return arReturn.ToResult();
    }

    /// <summary>
	/// 액세스 토큰으로 정보를 읽는다.
	/// </summary>
	/// <remarks>
	/// 액세스 토큰이 죽었다면 리플레시 토큰을 이용하여 갱신한다.
	/// </remarks>
	/// <returns></returns>
	[HttpGet]
    [AnonymousAndAuthorize]
    public ActionResult<SignInfoResultModel> AccessToUserInfo()
    {
        //로그인 처리용 모델
        ApiResultReady arReturn = new ApiResultReady(this);
        SignInfoResultModel rmReturn = new SignInfoResultModel();
        arReturn.ResultObject = rmReturn;


        //유저 정보를 찾는다.
        long? idUser = DGAuthServerCookieGlobal.Service.ClaimDataGet(HttpContext.User);

        //if (null == idUser
        //    || 0 >= idUser)
        //{
        //    arReturn.InfoCode = "-11";
        //    arReturn.Message = "사인인 하지 않았습니다.";
        //}
        //else
        //{
        //    using (ModelsDbContext db1 = new ModelsDbContext())
        //    {
        //        User? findUser
        //        = db1.User.Where(w => w.idUser == idUser)
        //            .FirstOrDefault();

        //        if (null != findUser)
        //        {//유저 찾음

        //            rmReturn.idUser = findUser.idUser;

        //            //리플레시 토큰 생성
        //            string st = string.Empty;

        //            //엑세스 토큰 생성
        //            string at
        //                = DGAuthServerCookieGlobal.Service
        //                    .AccessTokenGenerate(
        //                        findUser.idUser
        //                        , true
        //                        , true
        //                        , Request
        //                        , Response
        //                        , out st);

        //            //새로운 토큰 생성
        //            //rmReturn.AccessToken = at;
        //            //rmReturn.RefreshToken = st;

        //            //유저 정보 검색
        //            UserInfo1 findUI
        //                = db1.UserInfo1
        //                    .Where(w => w.idUser == findUser.idUser)
        //                    .First();

        //            rmReturn.ViewName = findUI.ViewName;
        //            rmReturn.ProfileImgNumUrl = findUI.ProfileImageUrlGet();
        //        }
        //    }//end using db1
        //}

        return arReturn.ToResult();
    }
}

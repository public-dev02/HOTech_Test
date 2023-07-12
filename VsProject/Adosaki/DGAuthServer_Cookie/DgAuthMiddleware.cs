
using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace DGAuthServer;

/// <summary>
/// 인증 미들웨어
/// </summary>
/// <remarks>인</remarks>
public class DgAuthMiddleware
{
    private readonly RequestDelegate _next;

    public DgAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// 인증 전달용 미들 웨어
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task Invoke(HttpContext context)
    {
        //추출된 토큰
        string sToken = string.Empty;

        //토큰 정보를 기준으로 속성에 전달하기위한 값 처리를 한다.
        long idUser = 0;
		//토큰에서 idUser 추출
		idUser
			= DGAuthServerCookieGlobal.Service
				.AccessTokenValidate(context.Request);


        if (0 >= idUser)
        {//엑세스 토큰이 유효하지 않다.

			//리플레시 토큰으로 유저를 검색한다.
			//리플레시 토큰이 유효하지 않다면 0이 나온다.
			idUser
				= DGAuthServerCookieGlobal.Service.RefreshTokenFindUser(
                    context.Request);


            if (0 < idUser)
            {//대상 유저 찾기 성공

                //자동저장 여부
                bool bAutoSignin
                    = DGAuthServerCookieGlobal.Service
                        .Cookie_AutoSignin(context.Request);

                string sRT = string.Empty;

				//엑세스 토큰을 다시 생성해 준다.
				DGAuthServerCookieGlobal.Service.AccessTokenGenerate(
                    idUser
                    , bAutoSignin
                    , false
					, context.Request
					, context.Response
                    , out sRT);
			}
        }

        //처리된 토큰 정보를 전달한다.
        //엑세스 토큰에 데이터가 있으면 클레임데이터를 추가해 준다.
        var claims
            = new List<Claim>
                {
                        new Claim(DGAuthServerGlobal.Setting.UserIdName
                                    , idUser.ToString())
                };

        //HttpContext에 클래임 정보를 넣어준다.
        ClaimsIdentity appIdentity = new ClaimsIdentity(claims);
        context.User.AddIdentity(appIdentity);



        await _next(context);
    }
}
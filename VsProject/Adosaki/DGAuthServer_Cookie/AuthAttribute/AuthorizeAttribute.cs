

using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DGAuthServer.AuthAttribute;

/// <summary>
/// 인증 필수 속성
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    /// <summary>
    /// 인증요청이 왔다.
    /// </summary>
    /// <param name="context"></param>
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        //
        bool bAllowAnonymous 
            = context.ActionDescriptor
                    .EndpointMetadata
                    .OfType<AllowAnonymousAttribute>().Any();
        if (true == bAllowAnonymous)
        {//AllowAnonymous으로 설정되어 있다.

			//401에러
			context.Result
				= new JsonResult(new { message = "Unauthorized" })
				{ StatusCode = StatusCodes.Status401Unauthorized };
			return;
        }

		//401에러 여부
		bool b401 = false;

		//쿠키에서 토큰 구분을 받아옴
		string sClass 
			= DGAuthServerCookieGlobal.Service.CookieGet_Class(
					context.HttpContext.Request);

		//엑세스 토큰 확인
		long idUser
			= DGAuthServerCookieGlobal.Service.AccessTokenValidate(
				context.HttpContext.Request);

		if (-1 == idUser || 0 == idUser)
		{//토큰 없음
		 //유저 정보 해석불가

			//기존 리프레시토큰을 받아온다.
			string sRT_Ori
				= DGAuthServerCookieGlobal.Service.CookieGet_RefreshToken(
					context.HttpContext.Request);

			//리플레시 토큰으로 유저 확인
			idUser = DGAuthServerCookieGlobal.Service
					.RefreshTokenFindUser(context.HttpContext.Request);



			if (0 >= idUser)
			{//토큰이 유효하지 않다.
				b401 = true;
			}
			else
			{//유효한 유저 아이디

				string sRT = string.Empty;

				//엑세스 토큰을 갱신해 준다.
				string sAT
					= DGAuthServerCookieGlobal.Service.AccessTokenGenerate(
						idUser
						, true
						, false
						, context.HttpContext.Request
						, context.HttpContext.Response
						, out sRT);
			}
		}
		else
		{//정상

		}

		if (true == b401)
		{
			//401에러
			context.Result
				= new JsonResult(new { message = "Unauthorized" })
				{ StatusCode = StatusCodes.Status401Unauthorized };
		}
    }
}
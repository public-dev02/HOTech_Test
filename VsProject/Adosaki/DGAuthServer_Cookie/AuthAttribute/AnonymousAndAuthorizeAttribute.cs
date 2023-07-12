using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DGAuthServer.AuthAttribute;

/// <summary>
/// 익명을 허용하고 인증정보가 있을때는 인증정보 유효성 검사를 한다.
/// </summary>
/// <remarks>이 속성을 사용하면 인증정보가 없을때는 AllowAnonymousAttribute으로
/// 인증정보가 있을때는 AuthorizeAttribute처럼 작동한다.<br />
/// 하지만 이 속성 자체는 리플레시 토큰처리를 하지 안으므로
/// 리플레시 토큰은 있는데 엑세스토큰을 없는 상황은 처리하지 못한다.
/// </remarks>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AnonymousAndAuthorizeAttribute : Attribute, IAuthorizationFilter
{
	public AnonymousAndAuthorizeAttribute()
	{

	}

    public void OnAuthorization(AuthorizationFilterContext context)
	{

        bool bAllowAnonymous
            = context.ActionDescriptor
                    .EndpointMetadata
                    .OfType<AllowAnonymousAttribute>().Any();
        if (true == bAllowAnonymous)
        {//AllowAnonymous으로 설정되어 있다.

            //인증을 스킵한다.
            return;
        }

		//인증을 스킵하지 않으면 'AuthorizeAttribute'와 동일하게 동작한다.
		AuthorizeAttribute aaTemp
            = new AuthorizeAttribute();
		aaTemp.OnAuthorization(context);

    }
}
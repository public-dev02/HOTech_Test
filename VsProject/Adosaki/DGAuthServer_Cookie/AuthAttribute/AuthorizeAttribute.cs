

using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DGAuthServer.AuthAttribute;

/// <summary>
/// ���� �ʼ� �Ӽ�
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    /// <summary>
    /// ������û�� �Դ�.
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
        {//AllowAnonymous���� �����Ǿ� �ִ�.

			//401����
			context.Result
				= new JsonResult(new { message = "Unauthorized" })
				{ StatusCode = StatusCodes.Status401Unauthorized };
			return;
        }

		//401���� ����
		bool b401 = false;

		//��Ű���� ��ū ������ �޾ƿ�
		string sClass 
			= DGAuthServerCookieGlobal.Service.CookieGet_Class(
					context.HttpContext.Request);

		//������ ��ū Ȯ��
		long idUser
			= DGAuthServerCookieGlobal.Service.AccessTokenValidate(
				context.HttpContext.Request);

		if (-1 == idUser || 0 == idUser)
		{//��ū ����
		 //���� ���� �ؼ��Ұ�

			//���� ����������ū�� �޾ƿ´�.
			string sRT_Ori
				= DGAuthServerCookieGlobal.Service.CookieGet_RefreshToken(
					context.HttpContext.Request);

			//���÷��� ��ū���� ���� Ȯ��
			idUser = DGAuthServerCookieGlobal.Service
					.RefreshTokenFindUser(context.HttpContext.Request);



			if (0 >= idUser)
			{//��ū�� ��ȿ���� �ʴ�.
				b401 = true;
			}
			else
			{//��ȿ�� ���� ���̵�

				string sRT = string.Empty;

				//������ ��ū�� ������ �ش�.
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
		{//����

		}

		if (true == b401)
		{
			//401����
			context.Result
				= new JsonResult(new { message = "Unauthorized" })
				{ StatusCode = StatusCodes.Status401Unauthorized };
		}
    }
}
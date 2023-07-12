
using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace DGAuthServer;

/// <summary>
/// ���� �̵����
/// </summary>
/// <remarks>��</remarks>
public class DgAuthMiddleware
{
    private readonly RequestDelegate _next;

    public DgAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// ���� ���޿� �̵� ����
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task Invoke(HttpContext context)
    {
        //����� ��ū
        string sToken = string.Empty;

        //��ū ������ �������� �Ӽ��� �����ϱ����� �� ó���� �Ѵ�.
        long idUser = 0;
		//��ū���� idUser ����
		idUser
			= DGAuthServerCookieGlobal.Service
				.AccessTokenValidate(context.Request);


        if (0 >= idUser)
        {//������ ��ū�� ��ȿ���� �ʴ�.

			//���÷��� ��ū���� ������ �˻��Ѵ�.
			//���÷��� ��ū�� ��ȿ���� �ʴٸ� 0�� ���´�.
			idUser
				= DGAuthServerCookieGlobal.Service.RefreshTokenFindUser(
                    context.Request);


            if (0 < idUser)
            {//��� ���� ã�� ����

                //�ڵ����� ����
                bool bAutoSignin
                    = DGAuthServerCookieGlobal.Service
                        .Cookie_AutoSignin(context.Request);

                string sRT = string.Empty;

				//������ ��ū�� �ٽ� ������ �ش�.
				DGAuthServerCookieGlobal.Service.AccessTokenGenerate(
                    idUser
                    , bAutoSignin
                    , false
					, context.Request
					, context.Response
                    , out sRT);
			}
        }

        //ó���� ��ū ������ �����Ѵ�.
        //������ ��ū�� �����Ͱ� ������ Ŭ���ӵ����͸� �߰��� �ش�.
        var claims
            = new List<Claim>
                {
                        new Claim(DGAuthServerGlobal.Setting.UserIdName
                                    , idUser.ToString())
                };

        //HttpContext�� Ŭ���� ������ �־��ش�.
        ClaimsIdentity appIdentity = new ClaimsIdentity(claims);
        context.User.AddIdentity(appIdentity);



        await _next(context);
    }
}
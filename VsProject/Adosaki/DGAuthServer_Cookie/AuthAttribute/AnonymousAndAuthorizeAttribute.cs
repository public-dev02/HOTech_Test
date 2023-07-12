using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DGAuthServer.AuthAttribute;

/// <summary>
/// �͸��� ����ϰ� ���������� �������� �������� ��ȿ�� �˻縦 �Ѵ�.
/// </summary>
/// <remarks>�� �Ӽ��� ����ϸ� ���������� �������� AllowAnonymousAttribute����
/// ���������� �������� AuthorizeAttributeó�� �۵��Ѵ�.<br />
/// ������ �� �Ӽ� ��ü�� ���÷��� ��ūó���� ���� �����Ƿ�
/// ���÷��� ��ū�� �ִµ� ��������ū�� ���� ��Ȳ�� ó������ ���Ѵ�.
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
        {//AllowAnonymous���� �����Ǿ� �ִ�.

            //������ ��ŵ�Ѵ�.
            return;
        }

		//������ ��ŵ���� ������ 'AuthorizeAttribute'�� �����ϰ� �����Ѵ�.
		AuthorizeAttribute aaTemp
            = new AuthorizeAttribute();
		aaTemp.OnAuthorization(context);

    }
}
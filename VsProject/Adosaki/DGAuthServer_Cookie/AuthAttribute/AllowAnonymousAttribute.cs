
namespace DGAuthServer.AuthAttribute;

/// <summary>
/// �͸� ��� == ���� ��ŵ �Ӽ�
/// </summary>
/// <remarks>�� �Ӽ��� ����ϸ� AuthorizeAttribute�� ��ŵ�ǰ� �ȴ�<br />
/// ������ JwtMiddleware���� ��ū�� �ؼ��ϹǷ� ������ ������� Claim�� idUser�� ����. </remarks>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AllowAnonymousAttribute : Attribute
{ }
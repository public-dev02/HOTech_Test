using DGAuthServer.Models;
using System.Security.Cryptography;

namespace DGAuthServer_Cookie.Models;

public class DgAuthCookieSettingModel : DgAuthSettingModel
{

	#region 엑세스 토큰

	/// <summary>
	/// 엑세스 토큰 쿠키 저장사용시 사용할 쿠키 이름
	/// </summary>
	/// <remarks>다른 쿠키이름과 중복되지 않도록 한다.</remarks>
	public string AccessTokenCookieName { get; set; } = "DGAS_AccessToken";

	

	#endregion

	#region 리플레시 토큰

	/// <summary>
	/// 리플레시 토큰 쿠키 저장사용시 사용할 쿠키 이름
	/// </summary>
	/// <remarks>다른 쿠키이름과 중복되지 않도록 한다.</remarks>
	public string RefreshTokenCookieName { get; set; } = "DGAS_RefreshToken";


	#endregion

	#region 토큰 분류

	/// <summary>
	/// 토큰 분류를 자동으로 생성할지 여부(16자리 문자열이 생성됨)
	/// </summary>
	/// <remarks>
	/// ClassCookie를 사용중일때 토큰 분류 문자열을 자동으로 생성할지 여부이다.<br />
	/// 첫 RefreshToken이 생성될때 같이 생성되며 이후로는 쿠키의 정보를 그대로 사용한다.<br />
	/// 쿠키는 브라우저+사이트(같은 브라우저를 몇개를 열든 같은 사이트는 쿠키를 공유한다. 시크릿 모드 제외) 
	/// 이므로 자열스럽게 같은 브라우저에서는 중복되지 않는 동작을 보이게 된다.
	/// </remarks>
	public bool ClassCookieAutoGenerate { get; set; } = false;

	/// <summary>
	/// 토큰 분류 쿠키 저장사용시 사용할 쿠키 이름
	/// </summary>
	/// <remarks>다른 쿠키이름과 중복되지 않도록 한다.</remarks>
	public string ClassCookieName { get; set; } = "DGAS_Class";

	
	#endregion

	/// <summary>
	/// 자동 사인인을 사용할지 여부
	/// </summary>
	/// <remarks>
	/// 이 옵션을 사용하면 AutoSigninCookieName를 쿠키에서 읽어서 우선 사용한다.<br />
	/// AutoSigninCookieName에 내용이 없다면 bRefreshTokenLifetimeUse를 사용한다.
	/// </remarks>
	public bool AutoSigninCookieIs { get; set; } = false;
	/// <summary>
	/// 자동 사인인 활성화 여부가 들어있는 쿠키 이름
	/// </summary>
	/// <remarks>
	/// 값은 꼭 int로 들어 있어야 한다.<br />
	/// 0=자동 사인인 사용안함, 나머지는 사용함<br />
	/// 옵션이 다양하다면 서비스 사이트와 다르게 사용하는것을 권장함.
	/// </remarks>
	public string AutoSigninCookieName { get; set; } = "SignInAutoIs";

	/// <summary>
	/// 쿠키의 'HttpOnly'옵션 사용여부
	/// </summary>
	/// <remarks>
	/// 테스트와 배포환경에 따른 쿠키 저장/읽기가 안되는 현상을 막거나 
	/// 보안을 강화하려는 목적으로 사용됨
	/// </remarks>
	public bool Cookie_HttpOnly { get; set; } = true;
	/// <summary>
	/// 쿠키의 'Secure'옵션 사용여부
	/// </summary>
	/// <remarks>
	/// 테스트와 배포환경에 따른 쿠키 저장/읽기가 안되는 현상을 막거나 
	/// 보안을 강화하려는 목적으로 사용됨
	/// </remarks>
	public bool Cookie_Secure { get; set; } = true;

	/// <summary>
	/// 모든 데이터를 복사한다.
	/// </summary>
	/// <param name="data"></param>
	public void ToCopy(DgAuthCookieSettingModel data)
	{
		base.ToCopy(data);

		this.AccessTokenCookieName = data.AccessTokenCookieName;
		
		this.RefreshTokenCookieName = data.RefreshTokenCookieName;

		this.ClassCookieAutoGenerate = data.ClassCookieAutoGenerate;
		this.ClassCookieName = data.ClassCookieName;

		this.AutoSigninCookieIs = data.AutoSigninCookieIs;
		this.AutoSigninCookieName = data.AutoSigninCookieName;
	}
		
}

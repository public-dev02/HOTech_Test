using DGAuthServer;
using DGAuthServer.Models;
using DGAuthServer_Cookie.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;


namespace DGAuthServer_Cookie;

public static class DGAuthServerCookieGlobal
{
	/// <summary>
	/// 사용할 옵션
	/// </summary>
	//public static DgAuthCookieSettingModel Setting
	//	= new DgAuthCookieSettingModel();

	public static DgAuthCookieSettingModel Setting
	{
		get
		{
			return (DgAuthCookieSettingModel)DGAuthServerGlobal.Setting;
		}
		set
		{
			DGAuthServerGlobal.Setting = value;
		}
	}

	/// <summary>
	/// 사용할 서비스 개체
	/// </summary>
	/// <remarks>
	/// 서비스에 주입할것인가 말것인가에대한 고민을 많이하고 주입하지 않는것으로 결론을 내렸다.<br />
	/// 서비스를 주입하면 가져다 쓰는데 너무 많은 코드를 써야하는데
	/// 이 서비스는 인증관련이고 사실상 싱글톤으로 구현해도 스택틱과 동일하게 동작하게 된다.
	/// </remarks>
	public static DGAuthServerService Service
		= new DGAuthServerService();

	static DGAuthServerCookieGlobal()
	{
		DGAuthServerGlobal.Setting = new DgAuthCookieSettingModel();
	}

}

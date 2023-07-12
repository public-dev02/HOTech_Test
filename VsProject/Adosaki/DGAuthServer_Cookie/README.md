쿠키전용 버전

쿠키를 자동으로 관리하는 기능만 들어 있습니다.
모든 정보는 쿠키를 기본 저장합니다.

















using System.Security.Cryptography;

namespace DGAuthServer.Models;

public class DgAuthSettingModel
{
	/// <summary>
	/// 사용할 DB 타입
	/// </summary>
	/// <remarks>
	/// 'DbType.Memory'를 기본으로 사용한다.
	/// </remarks>
	public DGAuthDbType DbType { get; set; } = DGAuthDbType.Memory;

	/// <summary>
	/// DB 비우는 시간(초, s)
	/// <para>기본값 604800 = 7일</para>
	/// </summary>
	/// <remarks>
	/// 사용 종료된 리플레시 토큰을 DB에서 지우고
	/// 남아있는 토큰의 수명을 확인하는 주기.<br />
	/// 캐쉬를 사용하는경우 동기화도 진행된다.
	/// <para>서버 시작시간 기준으로 주기가 돌아간다.</para>
	/// </remarks>
	public int DbClearTime { get; set; } = 604800;


	/// <summary>
	/// 인증용 헤더의 이름
	/// <para>기본값 : authorization</para>
	/// </summary>
	/// <remarks>인증 토큰을 찾을때 사용하는 이름이다.</remarks>
	public string AuthHeaderName { get; set; } = "authorization";

	/// <summary>
	/// 인증 토큰의 시작 이름
	/// <para>기본값 : bearer</para>
	/// </summary>
	/// <remarks>
	/// AuthHeaderName으로 찾은 인증토큰의 값이 시작 이름이다.<br />
	/// 실제 사용되는 값은 AuthTokenStartName_Complete이고
	/// 이 값은 AuthTokenStartName_Complete를 설정하는 용도이다.<br />
	/// AuthTokenStartName_Complete에는 자동으로 뒤에 공백을 붙여서 들어가므로
	/// 뒷 공백을 넣으면 안된다.
	/// </remarks>
	public string AuthTokenStartName 
	{
		get
		{
			//뒤에 공백을 제거하고 전달
			return AuthTokenStartName_Complete.TrimEnd();
		}
		set
		{
			//뒤에 공백을 추가하고 전달
			AuthTokenStartName_Complete = value.TrimEnd() + " ";
		}
	}
	/// <summary>
	/// 인증 토큰의 시작 이름 - 실제로 사용되는 값
	/// </summary>
	public string AuthTokenStartName_Complete { get; protected set; } = "bearer ";

	/// <summary>
	/// 엑세스 토큰 생성에 사용될 시크릿 키
	/// </summary>
	/// <remarks>
	/// 이값이 null이거나 비어있으면 자동으로 생성된다.<br />
	/// 자동으로 생성된 값은 프로그램이 실행되는 동안만 유지되므로
	/// 웹사이트를 껏다키면 그전에 생성된 엑세스 토큰은 사용할 수 없게 된다.<br />
	/// <br />
	/// 이 값을 고정해야 웹사이트를 껏다켜는것과 관계없이 엑세스토큰이 유지된다.
	/// </remarks>
	public string? Secret 
	{
		get
		{
			if (null == this._secret
				|| string.Empty == this._secret)
			{//가지고 있는 값이 비어있다.

				//값을 생성한다.
				this._secret 
					= Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)); ;
			}

			return this._secret;
		}
		set
		{
			if (null == value
				|| string.Empty == value)
			{//전달되 값이 비어있다.
			 //값을 바꾸지 않는다.
			}
			else
			{
				this._secret = value;
			}
		}
	}
	/// <summary>
	/// 엑세스 토큰 생성에 사용될 시크릿 키(원본)
	/// </summary>
	private string _secret = string.Empty;

	/// <summary>
	/// 혼자 사용하는 시크릿을 사용할지 여부(개인 시크릿 키)<br />
	/// 이걸 사용하면 <see cref="this.Secret">Secret</see> 는 무시된다.
	/// </summary>
	/// <remarks>
	/// 시크릿을 혼자 사용하면 엑세스 토큰을 강제로 만료시키는 기능을 사용할 수 있다.<br />
	/// 보안상으로도 더 좋다.<br />
	/// 하지만 매번 저장소를 검색해야 하므로 자원낭비가 심하다.<br />
	/// 자신의 서비스가 동시접속자가 많다면 권장하지 않는 기능이다.
	/// </remarks>
	public bool SecretAlone { get; set; } = false;
	/// <summary>
	/// 혼자 사용하는 시크릿사용시 구분 기호
	/// </summary>
	/// <remarks>개인용 시크릿키를 검색하기위해 
	/// 엑세스토큰 맨앞에 사용자 고유번호가 붙게 된다.<br />
	/// 이때 이 고유번호를 구분하기위한 구분 기호이다.
	/// <para>
	/// 이 값은 http 해더에 들어가야 하므로 'ISO/IEC 8859-1'에 있는 값만 사용해야한다.<br />
	/// 내부적으로는 첫번째 검색된 구분자만 자르므로 엑세스 토큰에 사용되는 문자가 사용되도
	/// 큰문제는 없지만 가급적 사용되지 않는 문자를 지정하는 것이 좋다.
	/// </para>
	/// <para>
	/// 문장도 가능하지만 가능한 짧게 넣는것이 좋다.
	/// </para>
	/// </remarks>
	/// 
	public string SecretAloneDelimeter { get; set; } = "%";

	#region 엑세스 토큰
	/// <summary>
	/// 엑세스토큰 수명(초, s)
	/// <para>기본값 3600 = 1시간</para>
	/// </summary>
	public int AccessTokenLifetime { get; set; } = 3600;

	/// <summary>
	/// 엑세스 토큰 쿠키 저장 여부
	/// </summary>
	/// <remarks>엑세스 토큰을 CookieOptions으로 넘겨 자동으로 저장하고 여부이다.<br/>
	/// 이 옵션을 사용하면 엑세스 토큰이 자동으로 쿠키로 저장된다.
	/// </remarks>
	public bool AccessTokenCookie { get; set; } = true;
	/// <summary>
	/// 엑세스 토큰 사용시 쿠키만 사용할지 여부
	/// </summary>
	/// <remarks>
	/// 이 옵션을 사용하면 헤더의 인증정보를 무시하고 쿠키만 사용한다.<br />
	/// (= 헤더에 인증정보를 보내지 않아도 된다.)
	/// </remarks>
	public bool AccessTokenCookieOnly { get; set; } = false;

	/// <summary>
	/// 엑세스 토큰 쿠키 저장사용시 사용할 쿠키 이름
	/// </summary>
	/// <remarks>다른 쿠키이름과 중복되지 않도록 한다.</remarks>
	public string AccessTokenCookieName { get; set; } = "DGAS_AccessToken";

	/// <summary>
	/// 액세스 토큰을 생성할때 리플레시 토큰도 다시 생성할지 여부
	/// </summary>
	/// <remarks>
	/// 액세스 토큰을 생성할때 리플레시 토큰 생성을 요청한다.<br />
	/// RefreshTokenReUseType옵션에 따라리플레시 토큰이 재생성된다.
	/// </remarks>
	public bool AccessTokenGenerateAndRefreshTokenGenerate { get; set; } = false;

	#endregion

	#region 리플레시 토큰
	/// <summary>
	/// 리플레시 토큰의 수명(초, s)
	/// <para>기본값 1296000 = 15일</para>
	/// </summary>
	/// <remarks>
	/// 이미 발급된 토큰은 적용되지 않는다.<br />
	/// 기존 토큰에 적용하려면 DB를 갱신해야한다.
	/// </remarks>
	public int RefreshTokenLifetime { get; set; } = 1296000;


	/// <summary>
	/// 리플레시 토큰 쿠키 저장 여부
	/// </summary>
	/// <remarks>리플레시 토큰을 CookieOptions으로 넘겨 자동으로 저장할지 여부이다.<br/>
	/// 이 옵션을 사용하면 리플레시 토크이 자동으로 쿠키로 저장된다.
	public bool RefreshTokenCookie { get; set; } = true;
	/// <summary>
	/// 리플레시 토큰 사용시 쿠키만 사용할지 여부
	/// </summary>
	/// <remarks>
	/// 이 옵션을 사용하면 헤더의 인증정보를 무시하고 쿠키만 사용한다.<br />
	/// (= 헤더에 인증정보를 보내지 않아도 된다.)<br/>
	/// 이 옵션을 사용하면 엑세스 토큰이 만료되었을때 
	/// 서버에서 자동으로 엑세스 토큰을 갱신하고 
	/// 쿠키에 저장한다.
	/// </remarks>
	public bool RefreshTokenCookieOnly { get; set; } = false;

	/// <summary>
	/// 리플레시 토큰 쿠키 저장사용시 사용할 쿠키 이름
	/// </summary>
	/// <remarks>다른 쿠키이름과 중복되지 않도록 한다.</remarks>
	public string RefreshTokenCookieName { get; set; } = "DGAS_RefreshToken";


	

	/// <summary>
	/// 리플레시 토큰 다시사용여부
	/// </summary>
	/// <remarks>
	/// 리플레시 토큰이 아직 유효한경우 새로 발급하지 않고
	/// 기존 토큰을 다시 사용할지 여부이다.
	/// </remarks>
	public RefreshTokenUsageType RefreshTokenReUseType { get; set; } 
		= RefreshTokenUsageType.OneTimeOnlyDelay;
	/// <summary>
	/// RefreshTokenReUseType에서 OneTimeOnlyDelay옵션 사용시 적용되는 지연시간(초, s)<br />
	/// 기본값 : OneTimeOnlyDelay
	/// </summary>
	public int OneTimeOnlyDelayTime { get; set; } = 3;
	#endregion

	#region 토큰 분류

	/// <summary>
	/// 토큰 분류 쿠키 저장 여부
	/// </summary>
	/// <remarks>엑세스 토큰을 CookieOptions으로 넘겨 자동으로 저장할지 여부이다.<br/>
	/// 이 옵션을 사용하면 토큰 분류가 자동으로 쿠키로 저장된다.<br/>
	/// 토큰 분류의 가장 큰 용도는 리플레시 토큰이 생성될때 고유값을 저장하여 
	/// 같은 브라우저에서 접속한것인지 구분하는 용도다.<br/>
	/// (예> 쿠키를 사용할경우 크롬 브라우저에서 로그인을 했다면 크롬으로 창을 몇개를 열어도 
	/// 같은 쿠키를 사용하므로 하나의 유저임을 알 수 있다. )
	/// 토큰 분류를 사용하지 않을 예정이면 이 옵션은 사용하지 않는 것이 좋다.<br/>
	/// AccessTokenCookieOnly, RefreshTokenCookieOnly 를 사용하는 경우
	/// 이 옵션을 사용하지 않으면 자동 인증이 되지 않는다.
	/// </remarks>
	public bool ClassCookie { get; set; } = true;
	/// <summary>
	/// 토큰 분류 쿠키만 사용할지 여부
	/// </summary>
	/// 이 옵션을 사용하면 헤더의 인증정보를 무시하고 쿠키만 사용한다.<br />
	/// (= 헤더에 인증정보를 보내지 않아도 된다.)<br />
	/// 이 말은 인증속성과 관계없이 쿠키가 남아있다면 사인인 되어있는 취급을 할 수 있다는 의미다.<br />
	/// 자동로그인 여부
	public bool ClassCookieOnly { get; set; } = false;

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
	/// 유저 고유번호를 나타내는 이름
	/// </summary>
	/// <remarks>크래임을 비롯하여 토큰의 소유자를 구분하기위한 
	/// 아이디를 검색할때 사용하는 이름이다.</remarks>
	public string UserIdName { get; set; } = "idUser";
	


	/// <summary>
	/// 메모리 캐쉬 사용여부
	/// <para>물리 메모리를 사용하여 속도를 향상시킨다.</para>
	/// </summary>
	/// <remarks>
	/// ASP.NET 자체기능인 MemoryCache를 사용할지 여부다.<br />
	/// DGAuthServerGlobal.MemoryCache에 생성된다.
	/// <para>개인 시크릿 키 사용시 사용하면 좋다.</para>
	/// </remarks>
	public bool MemoryCacheIs { get; set; } = false;


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
	public void ToCopy(DgAuthSettingModel data)
	{
		this.DbType = data.DbType;
		this.DbClearTime = data.DbClearTime;

		this.AuthHeaderName = data.AuthHeaderName;
		this.AuthTokenStartName = data.AuthTokenStartName;

		this.Secret = data.Secret;
		this.SecretAlone = data.SecretAlone;
		
		this.AccessTokenLifetime = data.AccessTokenLifetime;
		this.AccessTokenCookie = data.AccessTokenCookie;
		this.AccessTokenCookieOnly = data.AccessTokenCookieOnly;
		this.AccessTokenCookieName = data.AccessTokenCookieName;
		

		this.RefreshTokenLifetime = data.RefreshTokenLifetime;
		this.RefreshTokenCookie = data.RefreshTokenCookie;
		this.RefreshTokenCookieOnly = data.RefreshTokenCookieOnly;
		this.RefreshTokenCookieName = data.RefreshTokenCookieName;
		this.RefreshTokenReUseType = data.RefreshTokenReUseType;
		this.OneTimeOnlyDelayTime = data.OneTimeOnlyDelayTime;

		this.ClassCookie = data.ClassCookie;
		this.ClassCookieOnly = data.ClassCookieOnly;
		this.ClassCookieAutoGenerate = data.ClassCookieAutoGenerate;
		this.ClassCookieName = data.ClassCookieName;

		this.UserIdName = data.UserIdName;

		this.MemoryCacheIs = data.MemoryCacheIs;

		this.AutoSigninCookieIs = data.AutoSigninCookieIs;
		this.AutoSigninCookieName = data.AutoSigninCookieName;
	}
		
}

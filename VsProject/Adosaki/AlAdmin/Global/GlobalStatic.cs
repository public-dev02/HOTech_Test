using Utility.FileAssist;

namespace AlAdmin.Global;

/// <summary>
/// 프로그램 전역 변수
/// </summary>
public class GlobalStatic
{
    #region 쿠키용 이름
    /// <summary>
    /// 자동 사인인 여부 - 쿠키이름
    /// </summary>
    /// <remarks>
    /// 프론트 엔드와 같은 문자열을 사용해야 한다.
    /// </remarks>
    public static readonly string SigninAuto_CookieName = "spa_AutoSignIn";
    #endregion

    /// <summary>
	/// 파일 변환 관련
	/// </summary>
	public static FileProcess FileProc = new FileProcess();
}

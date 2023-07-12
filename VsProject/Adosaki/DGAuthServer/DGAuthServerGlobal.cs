using DGAuthServer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace DGAuthServer;

public static class DGAuthServerGlobal
{
	/// <summary>
	/// 사용할 옵션
	/// </summary>
	public static DgAuthSettingModel Setting
		= new DgAuthSettingModel();

	/// <summary>
	/// 마지막으로 디비를 정리한 시간
	/// </summary>
	public static DateTime DbClearTime = DateTime.Now;
	/// <summary>
	/// 다음 정리 예정시간
	/// </summary>
	public static DateTime DbClearExpectedTime = DateTime.Now;

	/// <summary>
	/// DB 컨택스트의 OnConfiguring이벤트에 사용될 액션
	/// </summary>
	public static Action<DbContextOptionsBuilder>? ActDbContextOnConfiguring = null;

	/// <summary>
	/// 'ActDbContextOnConfiguring'가 Null인경우 사용할 DB 커낵트 스트링
	/// </summary>
	public static string DbConnectString = string.Empty;

	/// <summary>
	/// 메모리 캐쉬 사용시 개체
	/// </summary>
	public static IMemoryCache? MemoryCache;

}

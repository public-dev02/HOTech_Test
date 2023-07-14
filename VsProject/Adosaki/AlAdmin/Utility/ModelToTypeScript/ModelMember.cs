

namespace Utility.ModelToTypeScript;

/// <summary>
/// 모델의 멤버 정보를 검색하기 쉽게 저장한다.
/// </summary>
public class ModelMember
{
	/// <summary>
	/// 맴버 이름 
	/// </summary>
	public string Name { get; set; } = string.Empty;
	
	/// <summary>
	/// 맴버의 타입
	/// </summary>
	public string Type { get; set; } = string.Empty;
	/// <summary>
	/// 맴버 타입이 배열타입일때 배열이 가지고 있는 타입
	/// </summary>
	/// <remarks>
	/// 1개만, 1댑스까지만 관리된다.
	/// </remarks>
	public string ArrayType { get; set; } = string.Empty;
}

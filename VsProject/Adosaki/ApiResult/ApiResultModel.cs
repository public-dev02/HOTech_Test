namespace ApiResult;

/// <summary>
/// 제네릭으로 사용해볼까해서 테스트중
/// </summary>
/// <typeparam name="T"></typeparam>
public class ApiResultModel<T> where T : ApiResultBaseModel, new()
{
	/// <summary>
	/// 전달할 오브젝트
	/// </summary>
	public T ResultObject { get; set; }

	/// <summary>
	/// 기본 생성(비권장)
	/// </summary>
	/// <remarks>
	/// 스웨거용 빈생성자이다.<br />
	/// 일반적인 경우 사용하면 안된다.
	/// </remarks>
	public ApiResultModel()
		: base()
	{
		this.ResultObject = new() { };
	}

	/// <summary>
	/// 
	/// </summary>
	/// <param name="model"></param>
	public ApiResultModel(T model)
		: base()
	{
		this.ResultObject = model;
	}

}
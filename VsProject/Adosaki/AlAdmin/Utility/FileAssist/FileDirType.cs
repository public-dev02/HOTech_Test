

namespace Utility.FileAssist;

/// <summary>
/// 파일 경로 타입
/// </summary>
public enum FileDirType
{
	/// <summary>
	/// 설정없음.
	/// </summary>
	/// <remarks>
	/// ProjectRootDir와 동일
	/// </remarks>
	None = 0,

	/// <summary>
	/// 프로젝트 기준 루트 경로
	/// </summary>
	ProjectRootDir,

	/// <summary>
	/// 프로젝트 밑의 ClientApp/src 폴더 경로
	/// </summary>
	/// <remarks>
	/// 이 프로젝트를 배포할때는 wwwroot아래의 배포 폴더를 지정된다.
	/// </remarks>
	ClientAppSrcDir,

	/// <summary>
	/// 파일을 저장하고 출력할 폴더
	/// </summary>
	OutputFileDir,
}

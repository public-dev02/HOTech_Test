using System.Text;


namespace Utility.FileAssist;

/// <summary>
/// 파일 변환 관련
/// </summary>
public class FileProcess
{
	/// <summary>
	/// 프로젝트 기준 루트 경로
	/// </summary>
	public string ProjectRootDir { get; set; } = string.Empty;

	/// <summary>
	/// 프로젝트 밑의 ClientApp/src 폴더 경로
	/// </summary>
	/// <remarks>
	/// 플록시 프로젝트의 경우 플로시 프로젝트의 ClientApp 폴더를 지정한다.<br />
	/// 이 프로젝트를 배포할때는 wwwroot아래의 배포 폴더를 지정한다.<br />
	/// 여러폴더에 배포해야하는 경우(예> 홈과 어드민이 별도의 프론트엔드로 나눠있는 경우)
	/// 이 리스트에 지정된 폴더에 모두 배포된다.<br />
	/// </remarks>
	public List<string> ClientAppSrcDir { get; set; } = new List<string>();

	/// <summary>
	/// 파일을 저장하고 출력할 폴더
	/// </summary>
	/// <remarks>
	/// 배포 버전과 상관없이 파일이 출력되는 위치이다.<br />
	/// 업로드된 파일과 같이 유저가 직접올린 파일이 있는 위치이다.
	/// </remarks>
	public string OutputFileDir { get; set; } = string.Empty;


	/// <summary>
	/// 이 프로젝트의 프로젝트 Xml 파일 경로.
	/// 프로젝트 세팅에 xml 파일 출력경로와 일치시켜준다.
	/// </summary>
	/// <remarks>
	/// 플록시를 쓰는 경우 이 파일이 없어서 에러가 난다.<br />
	/// api 프로젝트에서 복사해서 넣어주자.
	/// </remarks>
	public string ProjectXmlDir { get; set; } = string.Empty;
	/// <summary>
	/// 다른 프로젝트의 Xml 파일 경로.
	/// </summary>
	/// <remarks>
	/// 다른 프로젝트의 Xml 정보가 필요하다면 넣는다.
	/// </remarks>
	public List<string> ProjectXmlDir_Other { get; set; } = new List<string>();

	/// <summary>
	/// 지정된 경로 타입 +  파일을 생성하고 내용을 저장한다.
	/// </summary>
	/// <param name="typeFileDir"></param>
	/// <param name="sFilePath">파일 이름+확장자가 포함된 경로</param>
	/// <param name="sContents"></param>
	public void FileSave(
		FileDirType typeFileDir
		, string sFilePath
		, string sContents)
	{
		switch (typeFileDir)
		{
			case FileDirType.ClientAppSrcDir:
				foreach (string sItem in this.ClientAppSrcDir)
				{
					this.FileSave(string.Format(@"{0}\{1}", sItem, sFilePath) 
									, sContents);
				}
				break;

			case FileDirType.OutputFileDir:
				this.FileSave(string.Format(@"{0}\{1}", this.OutputFileDir, sFilePath) 
								, sContents);
				break;

			default:
				this.FileSave(string.Format(@"{0}\{1}", this.ProjectRootDir, sFilePath)
								, sContents);
				break;
		}

		
	}

	/// <summary>
	/// sFullDir 경로에 파일을 생성하고 내용을 저장한다.
	/// </summary>
	/// <param name="sFullFilePath"></param>
	/// <param name="sContents"></param>
	private void FileSave(string sFullFilePath, string sContents)
	{
		string? sdirectoryPath = Path.GetDirectoryName(sFullFilePath);
		if (sdirectoryPath != null)
		{
			if (false == Directory.Exists(sdirectoryPath))
			{//디랙토리가 없다.

				//디랙토리 생성
				Directory.CreateDirectory(sdirectoryPath);
			}
		}

		using (StreamWriter stream = new(sFullFilePath, false, Encoding.UTF8))
		{
			//파일 저장
			stream.Write(sContents);
		}//end using stream
	}
}

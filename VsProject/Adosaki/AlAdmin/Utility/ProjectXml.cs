using System.Xml.Linq;

namespace Utility.ProjectXml;

/// <summary>
/// 프로젝트의 XML 출력파일을 미리 읽어들이는 클래스
/// </summary>
public class ProjectXmlAssist
{
	/// <summary>
	/// 읽어들이 xml 내용
	/// </summary>
	public List<XDocument> ProjectXml { get; private set; }
		= new List<XDocument>();

	/// <summary>
	/// 맴버 요소 미리 검색
	/// </summary>
	public List<XElement[]> Members { get; private set; }
		= new List<XElement[]>();


	/// <summary>
	/// xml을 사용할 수 있는지 여부
	/// </summary>
	public bool UseIs
	{
		get
		{
			bool bReturn = false;

			if (0 < this.Members.Count)
			{
				if (0 < this.Members.Sum(s => s.Length))
				{
					//맴버가 하나 이상있으면 사용할 수 있다.
					bReturn = true;
				}
			}

			return bReturn;
		}
	}

	/// <summary>
	/// 내용물 없이 초기화
	/// </summary>
	public ProjectXmlAssist()
	{
	}

	/// <summary>
	/// 
	/// </summary>
	/// <param name="sXmlPath">불러올 프로젝트 XML 파일 경로</param>
	public ProjectXmlAssist(string sXmlPath)
	{
		this.Add(sXmlPath);
	}

	/// <summary>
	/// 
	/// </summary>
	/// <param name="sXmlPathList">불러올 프로젝트 XML 파일 경로 리스트</param>
	public ProjectXmlAssist(string[] sXmlPathList)
	{
		this.Add(sXmlPathList);
	}

	/// <summary>
	/// 지정된 결로 배열을 읽어서 리스트에 추가한다.
	/// </summary>
	/// <param name="sXmlPath">불러올 프로젝트 XML 파일 경로</param>
	public void Add(string[] sXmlPath)
	{
		for (int i = 0; i < sXmlPath.Length; ++i)
		{
			this.Add(sXmlPath[i]);
		}
	}


	/// <summary>
	/// 지정된 한개의 xml을 읽어서 리스트에 추가한다.
	/// </summary>
	/// <param name="sXmlPathList">불러올 프로젝트 XML 파일 경로 리스트</param>
	public void Add(string sXmlPathList)
	{
		//원본을 불러온다.
		XDocument docTemp = XDocument.Load(sXmlPathList);

		//원본 저장
		this.ProjectXml.Add(docTemp);

		XElement[] elem 
			= docTemp
				.Elements("doc")
				.Elements("members")
				.Elements("member")
				.ToArray();

		//검색내용 저장
		Members.Add(elem);
	}



	/// <summary>
	/// 맴버이름으로 주석 내용을 받아온다.
	/// </summary>
	/// <remarks>
	/// 가지고있는 모든 리스트에서 검색한다.
	/// </remarks>
	/// <param name="sMemberName"></param>
	/// <returns></returns>
	public string SummaryGet(string sMemberName)
	{
		string sReturn = string.Empty;

		foreach (XElement[] item in this.Members)
		{
			XElement? findXE
			= item.Where(m => m.Attribute("name")!.Value == sMemberName)
					.FirstOrDefault();

			if (null != findXE)
			{//검색된 내용이 있다.
				sReturn = findXE.Element("summary")!.Value.Trim();
				break;
			}
		}

		return sReturn;
	}

}

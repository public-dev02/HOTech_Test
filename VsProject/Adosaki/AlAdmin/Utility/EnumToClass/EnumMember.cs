using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.EnumToClass
{
	/// <summary>
	/// 열거형 멤버의 정보를 검색하기 쉽게 저장합니다.
	/// </summary>
	public class EnumMember
	{

		/// <summary>
		/// 지정된 열겨헝 멤버
		/// </summary>
		public Enum Type { get; private set; }
		/// <summary>
		/// 지정된 열겨헝 멤버의 이름
		/// </summary>
		public string Name { get; private set; }
		/// <summary>
		/// 지정된 열겨헝 멤버의 인덱스
		/// </summary>
		public int Index { get; private set; }

#pragma warning disable CS8618 // 생성자를 종료할 때 null을 허용하지 않는 필드에 null이 아닌 값을 포함해야 합니다. null 허용으로 선언해 보세요.

		/// <summary>
		/// 사용할 열거형 멤버를 오브젝트(object)형태로 처리합니다.
		/// </summary>
		/// <param name="objData"></param>

		public EnumMember(object objData)
		{
			SetData((Enum)objData);
		}

		/// <summary>
		/// 사용할 열거형 멤버를 지정합니다.
		/// </summary>
		/// <param name="typeData"></param>
		public EnumMember(Enum typeData)
		{
			SetData(typeData);
		}

#pragma warning restore CS8618 // 생성자를 종료할 때 null을 허용하지 않는 필드에 null이 아닌 값을 포함해야 합니다. null 허용으로 선언해 보세요.

		/// <summary>
		/// 필요한 데이터를 기록 합니다.
		/// </summary>
		/// <param name="typeData"></param>
		private void SetData(Enum typeData)
		{
			this.Type = typeData;
			this.Index = this.Type.GetHashCode();
			this.Name = this.Type.ToString();
		}
	}
}

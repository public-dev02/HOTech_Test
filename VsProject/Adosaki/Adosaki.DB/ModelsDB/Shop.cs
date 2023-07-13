using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ModelsDB;

/// <summary>
/// 샆 계정
/// </summary>
public class Shop
{
    /// <summary>
    /// 샾 고유번키
    /// </summary>
    [Key]
    public int idShop { get; set; }

    /// <summary>
    /// 사인인에 사용되는 이름
    /// </summary>
    /// <remarks>프로젝트에따라 이것이 이름, 이메일 등의 다양한 값이 될 수 있으므로
    /// 네이밍을 이렇게 한다.</remarks>
    public string SignName { get; set; } = string.Empty;
    /// <summary>
    /// 단방향 암호화가된 비밀번호
    /// </summary>
    /// <remarks>
    /// json으로 변환할때 무조건 제외되야할 데이터이다.
    /// </remarks>
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;
}

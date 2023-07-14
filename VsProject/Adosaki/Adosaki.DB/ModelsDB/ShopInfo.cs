using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ModelsDB;

/// <summary>
/// 매장의 자주쓰는 정보
/// </summary>
public class ShopInfo
{
    /// <summary>
    /// 매장 정보 고유키
    /// </summary>
    [Key]
    public int idShopInfo { get; set; }

    /// <summary>
    /// 연결된 매장 고유키
    /// </summary>
    public int idShop { get; set; }

    /// <summary>
    /// 표시 이름
    /// </summary>
    public string ViewName { get; set;} = string.Empty;
}

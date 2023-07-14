using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ModelsDB;

/// <summary>
/// 매장 상세 정보1
/// </summary>
public class ShopInfo_Detail1
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
    /// 은행 이름
    /// </summary>
    public string BankName { get; set; } = string.Empty;
    /// <summary>
    /// 계좌 번호
    /// </summary>
    public string BankAccount { get; set; } = string.Empty;
}

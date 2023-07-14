using System;
using Adosaki.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ModelsDB;

/// <summary>
/// 
/// </summary>
public class ModelsDbContext : DbContext
{

#pragma warning disable CS8618 // 생성자를 종료할 때 null을 허용하지 않는 필드에 null이 아닌 값을 포함해야 합니다. null 허용으로 선언해 보세요.
	/// <summary>
	/// 
	/// </summary>
	public ModelsDbContext()
	{
	}

	/// <summary>
	/// 
	/// </summary>
	/// <param name="options"></param>
	public ModelsDbContext(DbContextOptions<ModelsDbContext> options)
		: base(options)
	{
	}
#pragma warning restore CS8618 // 생성자를 종료할 때 null을 허용하지 않는 필드에 null이 아닌 값을 포함해야 합니다. null 허용으로 선언해 보세요.

	/// <summary>
	/// 
	/// </summary>
	/// <param name="options"></param>
	protected override void OnConfiguring(DbContextOptionsBuilder options)
	{
		switch (GlobalDb.DBType)
		{
			case UseDbType.Sqlite:
				//options.UseSqlite(GlobalDb.DBString);
				break;
			case UseDbType.Mssql:
				options.UseSqlServer(GlobalDb.DBString);
				break;

			case UseDbType.Memory:
			default:
				//options.UseInMemoryDatabase("TestDb");
				break;
		}
	}


    #region 매장 관련
    /// <summary>
    /// 매장 사인인 정보
    /// </summary>
    public DbSet<Shop> Shop { get; set; }
    /// <summary>
    /// 매장의 자주쓰는 정보
    /// </summary>
    public DbSet<ShopInfo> ShopInfo { get; set; }
    /// <summary>
    /// 매장 상세 정보1
    /// </summary>
    public DbSet<ShopInfo_Detail1> ShopInfo_Detail1 { get; set; }

    #endregion

    /// <summary>
    /// 
    /// </summary>
    /// <param name="modelBuilder"></param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
        #region 매장관련
		modelBuilder.Entity<Shop>().HasData(
			new Shop
            {
				idShop = 1,
				PasswordHash = "1111",
				SignName = "root"
			}
			, new Shop
            {
                idShop = 2,
				PasswordHash = "1111",
				SignName = "admin"
			});

		modelBuilder.Entity<ShopInfo>().HasData(
			new ShopInfo
            {
                idShopInfo = 1,
                idShop = 1,
                ViewName = "개발자",
            }
			, new ShopInfo
            {
                idShopInfo = 2,
                idShop = 2,
                ViewName = "최고 관리자",
            });

        modelBuilder.Entity<ShopInfo_Detail1>().HasData(
            new ShopInfo_Detail1
            {
                idShopInfo = 1,
                idShop = 1,
                BankName = "어른이 은행",
                BankAccount = "111-333-333",
            }
            , new ShopInfo_Detail1
            {
                idShopInfo = 2,
                idShop = 2,
                BankName = "어른이 은행",
                BankAccount = "111-2222-333",
            });
        #endregion
    }
}

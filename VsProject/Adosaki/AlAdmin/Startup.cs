using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json.Serialization;

using DGAuthServer;
using DGAuthServer.Models;
using DGAuthServer_Cookie.Models;

using Adosaki.DB;
using ModelsDB;
using AlAdmin.Global;

namespace AlAdmin;

/// <summary>
/// 
/// </summary>
public class Startup
{
    /// <summary>
	/// 
	/// </summary>
	public IConfiguration Configuration { get; }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="configuration"></param>
    /// <param name="env"></param>
    public Startup(IConfiguration configuration, IHostEnvironment env)
	{
        this.Configuration = configuration;

        //DB 정보 읽기 ******************
        //DB정보 받으려는 타겟
        //string sConnectStringSelect = "Test_sqlite";
        string sConnectStringSelect = "Test_mssql";

        #region DB 설정
        //사용하려는 DB타입
        switch (Configuration[sConnectStringSelect + ":DBType"]!.ToLower())
        {
            case "sqlite":
                GlobalDb.DBType = UseDbType.Sqlite;
                break;
            case "mssql":
                GlobalDb.DBType = UseDbType.Mssql;
                break;

            default://기본
                GlobalDb.DBType = UseDbType.Memory;
                break;
        }

        //DB 커낵션
        GlobalDb.DBString = Configuration[sConnectStringSelect + ":ConnectionString"]!;


        //db 마이그레이션 적용
        switch (GlobalDb.DBType)
        {
            //case UseDbType.Sqlite:
            //    using (ModelsDbContext_Sqlite db1 = new ModelsDbContext_Sqlite())
            //    {
            //        //db1.Database.EnsureCreated();
            //        db1.Database.Migrate();
            //    }
            //    break;
            case UseDbType.Mssql:
                using (ModelsDbContext_Mssql db1 = new ModelsDbContext_Mssql())
                {
                    //db1.Database.EnsureCreated();
                    db1.Database.Migrate();
                }
                break;

            default://기본
                using (ModelsDbContext db1 = new ModelsDbContext())
                {
                    //db1.Database.EnsureCreated();
                    db1.Database.Migrate();
                }
                break;
        }

        #endregion


    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="services"></param>
    public void ConfigureServices(IServiceCollection services)
	{
        //API모델을 파스칼 케이스 유지하기
        services.AddControllers().AddNewtonsoftJson(options => { options.SerializerSettings.ContractResolver = new DefaultContractResolver(); });

        #region 인증서버 설정
        //DGAuthServer Setting 정보 전달
        //services.Configure<DgJwtAuthSettingModel>(Configuration.GetSection("JwtSecretSetting"));

        //사용할 DB 알림
        DGAuthDbType typeDgAuthServerDb = DGAuthDbType.Memory;
        Action<DbContextOptionsBuilder>? dbContextOptionsBuilder = null;
        switch (GlobalDb.DBType)
        {
            case UseDbType.Sqlite:
                typeDgAuthServerDb = DGAuthDbType.Sqlite;
                dbContextOptionsBuilder
                    = (options => options.UseSqlite(GlobalDb.DBString));
                break;
            case UseDbType.Mssql:
                typeDgAuthServerDb = DGAuthDbType.Mssql;
                dbContextOptionsBuilder
                    = (options => options.UseSqlServer(GlobalDb.DBString));
                break;
        }

        services.AddDgAuthServerBuilder(
            new DgAuthCookieSettingModel()
            {
                DbType = typeDgAuthServerDb,

                Secret = this.Configuration["JwtSecretSetting:Secret"],
                //개인 시크릿 허용
                SecretAlone = false,

                //테스트를 위해 60초로 설정
                AccessTokenLifetime = 60,

                //쿠키 의존 샘플이므로 쿠키사용 필수
                //분류 쿠키 자동생성 여부
                ClassCookieAutoGenerate = true,

                //메모리 캐쉬 사용 허용
                MemoryCacheIs = true,

                //자동 사인인 쿠키 이름
                AutoSigninCookieName = GlobalStatic.SigninAuto_CookieName
            }
            , dbContextOptionsBuilder);
        #endregion
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="app"></param>
    /// <param name="env"></param>
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
	{

	}
}

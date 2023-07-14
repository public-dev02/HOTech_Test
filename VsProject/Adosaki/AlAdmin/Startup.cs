using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json.Serialization;

using DGAuthServer;
using DGAuthServer.Models;
using DGAuthServer_Cookie.Models;

using Utility.ProjectXml;

using Adosaki.DB;
using ModelsDB;
using AlAdmin.Global;
using Utility.EnumToClass;
using Utility.ModelToTypeScript;
using Utility.FileAssist;
using AlAdmin.Models;
using AlAdmin.Models.Sign;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

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


        //로컬 경로 저장
        GlobalStatic.FileProc.ProjectRootDir = env.ContentRootPath;
        GlobalStatic.FileProc.ClientAppSrcDir.Add(
            string.Format(@"{0}\wwwroot\production"
                            , GlobalStatic.FileProc.ProjectRootDir));
        GlobalStatic.FileProc.ClientAppSrcDir.Add(
            string.Format(@"{0}\ClientApp\src"
                            , GlobalStatic.FileProc.ProjectRootDir));
        GlobalStatic.FileProc.OutputFileDir
            = string.Format(@"{0}\wwwroot\UploadFile"
                            , GlobalStatic.FileProc.ProjectRootDir);
        GlobalStatic.FileProc.ProjectXmlDir
            = string.Format(@"{0}AlAdmin.xml"
                            , System.AppDomain.CurrentDomain.BaseDirectory);
        GlobalStatic.FileProc.ProjectXmlDir_Other
            .Add(string.Format(@"{0}Adosaki.DB.xml"
                            , System.AppDomain.CurrentDomain.BaseDirectory));

        if (true == env.IsDevelopment())
        {//디버그에서만 처리해야할 내용들

            //스타트업 공통 처리사항 처리
            this.FileOut();
        }

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
                AutoSigninCookieName = GlobalStatic.SigninAuto_CookieName,

                Cookie_HttpOnly = true,
                Cookie_Secure = true,
            }
            , dbContextOptionsBuilder);
        #endregion

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		services.AddEndpointsApiExplorer();

		services.AddSwaggerGen(c=>
		{
			c.SwaggerDoc("v1"
				, new OpenApiInfo
				{
					Title = "알어드민(AlAdmin) 프로젝트 Web API"
                    , Description = "알어드민(AlAdmin) 프로젝트의 Web API"
                    , Version = "v1"
					, License = new OpenApiLicense 
					{
						Name = "MIT"
						, Url= new Uri("https://opensource.org/licenses/MIT")
					}
				});
			c.IncludeXmlComments(string.Format(@"{0}\AlAdmin.xml"
                                , System.AppDomain.CurrentDomain.BaseDirectory));
		});
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="app"></param>
    /// <param name="env"></param>
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
	{
        // Configure the HTTP request pipeline.
        if (env.IsDevelopment())
        {//개발 버전에서만 스웨거 사용
            app.UseSwagger();
            app.UseSwaggerUI();
        }


        //DGAuthServerService 빌더
        app.UseDgAuthServerAppBuilder();


        //https로 자동 리디렉션
        app.UseHttpsRedirection();

        //기본 페이지
        app.UseDefaultFiles();

        //wwwroot
        app.UseStaticFiles();
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider(
           Path.Combine(env.ContentRootPath
                           , @"wwwroot\production")),
            //RequestPath = new PathString("/home"),
        });

        //3.0 api 라우트
        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapFallbackToFile("/production/index.html");
        });
    }

    private void FileOut()
    {
        //프로젝트 xml 불러오기
        ProjectXmlAssist xml = new ProjectXmlAssist(GlobalStatic.FileProc.ProjectXmlDir);
        xml.Add(GlobalStatic.FileProc.ProjectXmlDir_Other.ToArray());

        string sTemp = string.Empty;
        //열거형을 모델로 바꾸기위한 개체
        EnumToModel etmBP_Temp = new EnumToModel(xml);

        //모델을 타입스크립트로 출력하기 위한 개체
        ModelToTs tsModel_Temp = new ModelToTs(xml);

        #region DB - 매장 관련
        //사인인 성공시 전달되는 매장 정보
        tsModel_Temp.TypeData_Set(new ShopInfo());
        sTemp = tsModel_Temp.ToTypeScriptInterfaceString(
            "");
        GlobalStatic.FileProc
            .FileSave(FileDirType.ClientAppSrcDir
                        , @"Faculty\Backend\ModelsDB\ShopInfo.ts"
                        , sTemp);
        #endregion

        #region 사인인 관련
        //사인인 성공시 전달되는 매장 정보
        tsModel_Temp.TypeData_Set(new SignInfoResultModel());
        sTemp = tsModel_Temp.ToTypeScriptInterfaceString(
            "import { ShopInfo } from '@/Faculty/Backend/ModelsDB/ShopInfo';");
        GlobalStatic.FileProc
            .FileSave(FileDirType.ClientAppSrcDir
                        , @"Faculty\Backend\Models\Sign\SignInfoResultModel.ts"
                        , sTemp);
        #endregion
    }
}

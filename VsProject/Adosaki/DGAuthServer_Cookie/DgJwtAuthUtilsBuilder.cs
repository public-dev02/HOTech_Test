
using DGAuthServer.Models;
using DGAuthServer.ModelsDB;
using DGAuthServer_Cookie;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace DGAuthServer;

/// <summary>
/// DG Auth Server Service�� ���� ���� ����
/// </summary>
public static class DgJwtAuthUtilsBuilder
{
    /// <summary>
    /// ���� ����
    /// </summary>
    /// <param name="services"></param>
    /// <param name="settingData"></param>
    /// <param name="actDbContextOnConfiguring">
    /// DB ���ý�Ʈ ������ ���� 'OnConfiguring'�׼�<br />
    /// ���� DB�� 'DGAuthServer_AccessToken'�� 'DGAuthServer_RefreshToken' ���̺��� ������
    /// �ش� ���̺��� �����ȴ�.<br />
    /// �ʿ信 ���� �ڽ��� ���ý�Ʈ(��)�� �ش� ���̺��� �����Ͽ� ������ �� �ִ�.
    /// </param>
    /// <returns></returns>
    public static IServiceCollection AddDgAuthServerBuilder(
        this IServiceCollection services
        , DgAuthSettingModel settingData
        , Action<DbContextOptionsBuilder>? actDbContextOnConfiguring)
    {

        //���� ������ ����
        DGAuthServerGlobal.Setting.ToCopy(settingData);

        //�ɼ� ����
        services.Configure<DgAuthSettingModel>(options =>
        {
            options.ToCopy(DGAuthServerGlobal.Setting);
        });

        if (DGAuthDbType.Memory == DGAuthServerGlobal.Setting.DbType
            || null == actDbContextOnConfiguring)
        {//��� db�� �޸𸮰ų� 
            //����� DB�׼��� ����.

			//��ü������ ����� ������ ���̽�
			DGAuthServerGlobal.ActDbContextOnConfiguring
				= (options => options.UseInMemoryDatabase(databaseName: "DGAuthServer_DB"));	
        }
        else
        {
			DGAuthServerGlobal.ActDbContextOnConfiguring
				= actDbContextOnConfiguring;
		}


		//���̺� ���� �� ���̱׷��̼� ���� ����
		switch (DGAuthServerGlobal.Setting.DbType)
        {
            case DGAuthDbType.Sqlite:
				using (DgAuthDbContext_Sqlite dbSqlite = new DgAuthDbContext_Sqlite())
				{
					dbSqlite.Database.Migrate();
				}
				break;
			case DGAuthDbType.Mssql:
				using (DgAuthDbContext_Mssql dbMssql = new DgAuthDbContext_Mssql())
				{
					dbMssql.Database.Migrate();
				}
				break;

			default:
				using (DgAuthDbContext db1 = new DgAuthDbContext())
				{
					//db1.Database.EnsureCreated();
					db1.Database.Migrate();
				}
				break;
        }


        //db Ŭ���� ����
        Timer timerDbClear
            = new Timer((aa) 
                =>
                {
					DGAuthServerCookieGlobal.Service.DbClear();
                });
        //Ÿ�̸� ����
        timerDbClear.Change(0, DGAuthServerGlobal.Setting.DbClearTime);

        //���� �����ð� ���
        DGAuthServerGlobal.DbClearExpectedTime
            = DGAuthServerGlobal.DbClearTime
                .AddSeconds(DGAuthServerGlobal.Setting.DbClearTime);


        //�޸� ĳ�� ��뿩�� ó�� ************************
        if (true == DGAuthServerGlobal.Setting.MemoryCacheIs)
        {//���
            DGAuthServerGlobal.MemoryCache 
                = new MemoryCache(new MemoryCacheOptions() {});
        }

        return services;
    }


    /// <summary>
    /// ���ø����̼�(�̵����) ����
    /// </summary>
    /// <param name="app"></param>
    /// <returns></returns>
    public static IApplicationBuilder UseDgAuthServerAppBuilder(
        this IApplicationBuilder app)
    {

        //JwtAuth �̵���� ����
        app.UseMiddleware<DgAuthMiddleware>();
        return app;
    }
}


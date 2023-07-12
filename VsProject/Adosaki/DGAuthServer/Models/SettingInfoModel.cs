﻿namespace EfMultiMigrations.Models;

/// <summary>
/// 이 프로젝트에서 사용할 설정 모델
/// </summary>
public class SettingInfoModel
{
	/// <summary>
	/// Sqlite에 사용할 연결 문자열
	/// </summary>
	public string ConnectionString_Sqlite { get; set; } = string.Empty;

	/// <summary>
	/// mssql에 사용할 연결 문자열
	/// </summary>
	public string ConnectionString_Mssql { get; set; } = string.Empty;
}

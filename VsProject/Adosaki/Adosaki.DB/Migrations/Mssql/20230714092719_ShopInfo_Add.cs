using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Adosaki.DB.Migrations.Mssql
{
    public partial class ShopInfo_Add : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ShopInfo",
                columns: table => new
                {
                    idShopInfo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idShop = table.Column<int>(type: "int", nullable: false),
                    ViewName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopInfo", x => x.idShopInfo);
                });

            migrationBuilder.CreateTable(
                name: "ShopInfo_Detail1",
                columns: table => new
                {
                    idShopInfo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idShop = table.Column<int>(type: "int", nullable: false),
                    BankName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BankAccount = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopInfo_Detail1", x => x.idShopInfo);
                });

            migrationBuilder.InsertData(
                table: "Shop",
                columns: new[] { "idShop", "PasswordHash", "SignName" },
                values: new object[,]
                {
                    { 1, "1111", "root" },
                    { 2, "1111", "admin" }
                });

            migrationBuilder.InsertData(
                table: "ShopInfo",
                columns: new[] { "idShopInfo", "ViewName", "idShop" },
                values: new object[,]
                {
                    { 1, "개발자", 1 },
                    { 2, "최고 관리자", 2 }
                });

            migrationBuilder.InsertData(
                table: "ShopInfo_Detail1",
                columns: new[] { "idShopInfo", "BankAccount", "BankName", "idShop" },
                values: new object[,]
                {
                    { 1, "111-333-333", "어른이 은행", 1 },
                    { 2, "111-2222-333", "어른이 은행", 2 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShopInfo");

            migrationBuilder.DropTable(
                name: "ShopInfo_Detail1");

            migrationBuilder.DeleteData(
                table: "Shop",
                keyColumn: "idShop",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Shop",
                keyColumn: "idShop",
                keyValue: 2);
        }
    }
}

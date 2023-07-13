using Microsoft.AspNetCore.Mvc;

namespace AlAdmin.Controllers;

/// <summary>
/// 
/// </summary>
public class DashBoardController : Controller
{
    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public IActionResult Index()
    {
        return View();
    }
}

using Microsoft.AspNetCore.Mvc;

namespace AlAdmin.Controllers;

public class DashBoardController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // POST: api/notifications/send-upcoming-appointment-reminders
    [HttpPost("send-upcoming-appointment-reminders")]
    public async Task<IActionResult> SendUpcomingAppointmentReminders()
    {
        var notifications = await _notificationService.SendUpcomingAppointmentRemindersAsync();
        return Ok(new { notifications });
    }

    // POST: api/notifications/send-upcoming-medication-reminders
    [HttpPost("send-upcoming-medication-reminders")]
    public async Task<IActionResult> SendUpcomingMedicationReminders()
    {
        var notifications = await _notificationService.SendUpcomingMedicationRemindersAsync();
        return Ok(new { notifications });
    }
} 
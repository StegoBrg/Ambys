using System.Net;

namespace HealthJournal_API.ErrorHandling
{
    public class ExceptionHandler
    {
        private readonly ILogger<ExceptionHandler> logger;
        private readonly RequestDelegate next;

        public ExceptionHandler(ILogger<ExceptionHandler> logger, RequestDelegate next)
        {
            this.logger = logger;
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await next(httpContext);
            }
            catch (Exception ex)
            { 
                logger.LogError(ex, ex.Message);

                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                httpContext.Response.ContentType = "application/json";

                var internalError = new
                {
                    ErrorMessage = "An internal server error has occured.",
                    Details = ex.Message
                };

                await httpContext.Response.WriteAsJsonAsync(internalError);
            }
        }
    }
}

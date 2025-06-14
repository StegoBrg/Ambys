using HealthJournal_API.ErrorHandling;
using HealthJournal_API.Mappings;
using HealthJournal_API.Models;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Repository.Interface;
using HealthJournal_API.Repository.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication;
using HealthJournal_API.Middlewares;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
}); 

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "HealthJournal API", Version = "v1" });
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = "OAuth2",
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var configuration = builder.Configuration;

// Add environment variables as source for docker configuration.
configuration.AddEnvironmentVariables();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
}
);
builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("AuthConnection"));
}
);

builder.Services.AddScoped<IDailyNoteRepository, DailyNoteRepositoryPostgres>();
builder.Services.AddScoped<INoteAttributeRepository, NoteAttributeRepositoryPostgres>();
builder.Services.AddScoped<INoteConfigurationRepository, NoteConfigurationRepositoryPostgres>();
builder.Services.AddScoped<INotebookRepository, NotebookRepositoryPostgres>();
builder.Services.AddScoped<IPageRepository, PageRepositoryPostgres>();
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepositoryPostgres>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IPersonalAccessTokenRepository, PersonalAccessTokenRepositoryPostgres>();
builder.Services.AddScoped<IUserDataRepository, UserDataRepositoryPostgres>();
builder.Services.AddScoped<IUserContext, UserContext>();
builder.Services.AddScoped<IMedicationRepository, MedicationRepositoryPostgres>();
builder.Services.AddScoped<IMedicationPlanEntryRepository, MedicationPlanEntryRepositoryPostgres>();
builder.Services.AddScoped<IHealthReportConfigRepository, HealthReportConfigRepositoryPostgres>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(typeof(AutomapperMappings));

builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("app")
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
});

// Make sure all Jwt settings are set.
var issuer = configuration["Jwt:Issuer"];
var audience = configuration["Jwt:Audience"];
var key = configuration["Jwt:Key"];
if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
{
    throw new Exception("Jwt settings are not set.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    })
    .AddScheme<AuthenticationSchemeOptions, PatAuthenticationHandler>("PersonalAccessToken", null);

// Add CORS for development.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "OpenCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
    });
});

var app = builder.Build();

// Automatically apply migration.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    var authContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    authContext.Database.Migrate();
}


app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionHandler>();

app.UseCors("OpenCorsPolicy");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

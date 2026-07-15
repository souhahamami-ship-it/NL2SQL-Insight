using NET.Services;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<DepartmentsService>();
builder.Services.AddScoped<IChatService,ChatService>();

builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var app = builder.Build();

app.UseCors("ReactPolicy");
app.MapControllers();

app.Run();
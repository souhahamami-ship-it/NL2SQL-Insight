



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHttpClient();

var app = builder.Build();






app.MapGet("/employees", async (IHttpClientFactory factory) =>
{
    var client = factory.CreateClient();

    var response = await client.GetAsync(
        "http://localhost:8000/employees"
    );

    var content = await response.Content.ReadAsStringAsync();

    return Results.Content(
        content,
        "application/json"
    );
});


app.MapGet("/employees/{employee_id}", async (
    int employee_id,
    IHttpClientFactory factory) =>
{
    var client = factory.CreateClient();

    var response = await client.GetAsync(
        $"http://localhost:8000/employees/{employee_id}"
    );

    var content = await response.Content.ReadAsStringAsync();

    return Results.Content(
        content,
        "application/json"
    );
});

app.MapGet("/departments", async (IHttpClientFactory factory) =>
{
    var client = factory.CreateClient();

    var response = await client.GetAsync(
        "http://localhost:8000/departments"
    );

    var content = await response.Content.ReadAsStringAsync();

    return Results.Content(
        content,
        "application/json"
    );
});







app.Run();




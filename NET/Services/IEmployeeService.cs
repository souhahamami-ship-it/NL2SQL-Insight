namespace NET.Services;

public interface IEmployeeService
{
    Task<string> GetEmployees();

    Task<string> GetEmployeeDetail(int id);

    Task<string> GetEmployeeDetails();
}
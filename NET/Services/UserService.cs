using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using NET.Models;

namespace NET.Services
{
    public class UserService
    {
        private readonly string _connectionString;

        public UserService(IConfiguration configuration)
        {
            // Store connection string once during injection
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = @"
                SELECT
                    Id,
                    Username,
                    PasswordHash,
                    FullName,
                    Role
                FROM Users
                WHERE Username = @Username";

            await using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Username", username);

            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return null; // User not found
            }

            var user = new User
            {
                Id = Convert.ToInt32(reader["Id"]),
                Username = reader["Username"].ToString()!,
                PasswordHash = reader["PasswordHash"].ToString()!,
                FullName = reader["FullName"].ToString()!,
                Role = reader["Role"].ToString()!
            };

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

            // Accept Success or SuccessRehashNeeded
            if (result != PasswordVerificationResult.Failed)
            {
                return user;
            }

            return null; // Wrong password
        }

        public async Task<bool> RegisterAsync(RegisterRequest request)
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Check if username already exists
            const string checkQuery = "SELECT COUNT(*) FROM Users WHERE Username = @Username";
            await using var checkCommand = new SqlCommand(checkQuery, connection);
            checkCommand.Parameters.AddWithValue("@Username", request.Username);

            int count = (int)(await checkCommand.ExecuteScalarAsync() ?? 0);
            if (count > 0)
            {
                return false; // Username already taken
            }

            var hasher = new PasswordHasher<User>();
            var user = new User
            {
                Username = request.Username,
                FullName = request.FullName,
                Role = request.Role
            };

            string hashedPassword = hasher.HashPassword(user, request.Password);

            const string insertQuery = @"
                INSERT INTO Users (Username, PasswordHash, FullName, Role)
                VALUES (@Username, @PasswordHash, @FullName, @Role)";

            await using var insertCommand = new SqlCommand(insertQuery, connection);
            insertCommand.Parameters.AddWithValue("@Username", request.Username);
            insertCommand.Parameters.AddWithValue("@PasswordHash", hashedPassword);
            insertCommand.Parameters.AddWithValue("@FullName", request.FullName);
            insertCommand.Parameters.AddWithValue("@Role", request.Role);

            await insertCommand.ExecuteNonQueryAsync();
            return true;
        }
    }
}
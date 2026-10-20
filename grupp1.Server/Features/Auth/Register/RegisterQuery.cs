using Vicaria.Server.Domain;

public record RegisterQuery(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Role
);
using System.ComponentModel.DataAnnotations;
using Vicaria.Server.Domain;

public record RegisterQuery(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Role,
    [Phone] string PhoneNumber
);
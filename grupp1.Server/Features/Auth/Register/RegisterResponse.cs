using Microsoft.AspNetCore.Identity;

public record RegisterResponse(IReadOnlyList<IdentityError> errors)
{
    public bool Succeeded => errors.Count == 0;
    public static RegisterResponse Success() => new([]); //creates with an empty list
    public static RegisterResponse Failure(IEnumerable<IdentityError> errors) => new(errors.ToList()); //creates with the errors. note: cool
}

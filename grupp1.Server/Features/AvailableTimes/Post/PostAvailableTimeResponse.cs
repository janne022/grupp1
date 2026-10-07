namespace grupp1.Server.Features.AvailableTimes.Post
{
    public sealed record PostAvailableTimeResponse
    (
        Guid Id,
        DateTime StartTime,
        DateTime EndTime,
        //Guid UserId,
        Guid[] KindergartenIds
    );
}

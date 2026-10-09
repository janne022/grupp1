# So you wish to contribute

Let these clean and cool guidelines help you help your colleagues

## Defining an Issue

An Issue should define _what_ needs to be implemented or changed, and _why._ It should not define _how_ the developer chooses to fulfill the Issue.

A well-defined Issue gives the developer the context they need to understand what the unimplemented feature or problem is, along with the expected result at the end ("the sum of the two supplied integers are returned as an integer").

Ensure you link the project and the relevant milestone before you submit your Issue.

### Issue Title

Keep the title simple and specific.

Like this:

- `Add password validation to account creation`
- `Prevent duplicate entries from being added to database`
- `Allow user to log out from the user dashboard`

And not like this:

- `Fix this bug`
- `Authentication`
- `Business logic stuff`
- `Make feature better!!`

### Issue Description

Try to keep this design as your guide, unless it is for some reason not fitting for your particular issue.

**[DESCRIPTION]**
What is the problem, need, or reason for this Issue to exist?

**[ACCEPTANCE CRITERIA]**
This describes what will be required for the Issue to be considered solved.

Assuming the current Issue is about the user registration process, it may look something like this:

- User cannot create an account with an invalid password
- Validation errors are shown to the user on the frontend
- User is sent to their dashboard when account creation is successful

**[CONTEXT]**
Add anything that may help the developer working on the issue understand the Issue. This is further description of the Issue's general context if the Description field gets too wordy describing the general context, possibly links to documentation or references to specific files. Whatever may be needed to give the developer the context they need to start working.

### Keep Issues focused

One Issue should represent _one piece of work_.

If an Issue starts containing several unrelated features, consider splitting it into multiple Issues.

### Describe _what_ needs to be done, not _how_

Issues should generally describe the desired behaviour or outcome rather than how the developer should reach this result.

For example:

> The user should be blocked from adding a duplicate database entry.

Is better than:

> Add an `CheckIfEntryExistsInDatabaseAlready()` method to `DatabaseRepository` and call it from `AddDatabaseEntry()`.

The first describes the requirement. The second unnecessarily decides the implementation before the developer has investigated the problem and thought about how to best solve the Issue.

### Issue labels

Finally, add the appropriate labels to your Issue. This allows developers to get an overview on the work being done, before they decide which Issue to take on and when going through the Project's history.

## Writing a Pull Request (PR)

If possible: when you start working on an issue, open a connected PR as a draft. This lets other developers in the team be able to watch your progress, ask clarifying questions and hold a live discussion about the solution as it is being created.

Make sure your PR has these following points ticked off, before making your draft PR into a real one:

### Lives up to the user story/connected issue

Make an extra effort to tick off each requirement in the linked user story or issue, so the change is what is expected, and the reviewer can focus on reviewing the correct implementation.

### One PR, one atomic change

Do not create insanely huge PRs with several features. Rather, make several, small PRs, where each and every PR focuses on **one change**.

### Structure your PRs

Make sure your PR follow this structure:

[TITLE]
Should explain what changed and why on one line. Not "fix bug", rather "added validation to service.jsx to mitigate error saving emails"

[DESCRIPTION]
Should have substructure such as:

- What was the issue?
- What does the change do to fix it?
- What other solutions did you (optionally) try before creating this one?
- What should the reviewer focus on/how to test the change?
- What tests have _you_ performed?
- Make sure to end your description with "Resolves/Closes #\<numberOftheIssue>"

[LABELS]

Add labels and metadata to the PR to make it easier to scan what the PR entails.
Do _not_ add project or milestone for the PR! This should already be connected to the issue itself.

## Community and general expectations a.k.a. game rules

- Treat team members with respect
- Criticise product, not the developer
- Try to embrace blame free culture (focus on _what went wrong_ and _how to prevent it_, not _who caused it_)

## Reviewing PRs

When reviewing PRs you do not need to run through the code line by line or scrutinize every detail. You should only focus on minimizing human error and asking yourself the following questions:

- Does the PR fulfill the linked Issue's Acceptance Criteria without scope creep?
- Is the code clean, readable, and structured according to project conventions?
- Are there any obvious bugs, edge cases or security vulnerabilities that have not been considered?

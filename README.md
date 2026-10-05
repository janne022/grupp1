# Vicaria: a C# sub-teacher scheduler
## Maintainers/collaborators
We are grupp1!
- @SunberryBlossom
- @janne022
- @KiddN7
- @Erik-Backdahl
- @gurrakeller
- @erkan334

A team of students from class NET25 of Chas Academy


## What is this for?
Vicaria is being made as a clean and simple substitute teacher matching calendar, where your company's personel-responsible administrators can easily filter and find those of your substitute teachers are available to work for specific dates, locations and periods. No more cold calling to try and get a match for your kindergarten or school: just log in, apply which date and school you need a sub for, and Vicaria will give you a list of available people ready to help you out.


## Configuration and installation
### Prerequisites
- Installed .NET SDK --> get it [here](https://dotnet.microsoft.com/en-us/download)
- Installed NodeJs --> get it [here](https://nodejs.org/en/download)
- Installed Docker --> get it [here](https://www.docker.com/get-started/)
- Installed Aspire CLI --> get it [here](https://aspire.dev/get-started/install-cli/)

## Installation
To take part of the bleeding-edge development version of Vicaria, follow these steps:

1. Clone the repo using your favourite technique
   1. HTTPS: ```https://github.com/janne022/grupp1.git```
   2. SSH: ```git@github.com:janne022/grupp1.git```
   3. Github CLI: ```gh repo clone janne022/grupp1```

2. Start Docker on your local machine

3. Once cloned, use Aspire CLI to run the app: ```aspire run```

4. Navigate to the now running Aspire Dashboard under the resources tab
   1. Run and interact with the frontend through _webfrontend_
   2. Run and interact with the API documentation through _scalar_
   3. Run and interact with the database through _pgadmin_

No need to manually enter environment variables, we got it covered through the Aspire orchestration

## Example

## Contribution
Do you have ideas on how Vicaria can get better? Either fork the repository and submit a Pull Request (PR), or create an Issue under the issue-tab.

_Make sure to read our CONTRIBUTING.md before opening an issue/ticket or a PR, to follow our guidelines and syntax._

### extra contrib. information
Vicaria is written in .NET10/C#14, orchestrated through Aspire, with a frontend written in React Typescript (Vite). Stick to this stack when developing new features.
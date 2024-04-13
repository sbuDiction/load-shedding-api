# Load Shedding API SA

### Introduction

This is the load-shedding API for South Africa you can use this API to search suburbs that get electricity supply from DIRECT ESKOM. 
The API provides information about Load Shedding schedules for a suburb for up to 7 days, 
It is still in development so it's not yet perfect I currently have 36095 suburbs and I will continue to add more. 
Some suburbs/Areas are not yet available because they have a different supplier for example some areas in Gauteng get their electricity via City Power Johannesburg etc... I still need to write the code to extract the areas.

### Features

* Users can search suburb/area by text
* Users can get the current Load Shedding stage status
* Users can fetch Load Shedding schedules for their suburb/area for up to 7 days in advance

### API Endpoints

| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /search?text=search_query | To search for a suburb/area |
| GET | /schedule?id=suburb_id | To get Load Shedding schedules |
| GET | /status | To get current Load Shedding stage status |

### Technologies Used

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
- ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
- ![Microsoft Excel](https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)

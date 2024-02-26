# South African Load Shedding API 1.0.0

## Featrues

- Suburb Search By Text
- Search Nearby Using GPS Coordinates (Experimental)
- Real Time Status For Load Shedding
- Real time status per Suburb, Upcoming Schedule
    

## Responses

| **HTTP Code** | **Description** |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

##
Full Documentaion Hosted on [Postman](https://documenter.getpostman.com/view/11585940/2sA2r7zi4R) 


I was curious how apps like Eskom Se Push know load-shedding schedules, at some point I thought maybe Eskom has an API where they provide load-shedding information but I was wrong I recently found out that Eskom sends out spreadsheets for each province containing load-shedding information for a whole year and then I thought to myself is it really possible to write code that can extract data from a spreadsheet and turn it into an API that can be used to develop apps for load-shedding. I answered this question by creating the API and it was a success. However, it still has some limitations like the missing areas that Direct Eskom does not supply places like in Gauteng that get power from City Power Johannesburg, etc.. At the moment the API has 36095 suburbs all from Direct Eskom I will be adding more suburbs as time goes by.



You can check the documentation here: https://documenter.getpostman.com/view/11585940/2sA2r7zi4R



Linkedin: https://lnkd.in/dsK9P7KG
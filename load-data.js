/**
 * This file is for bulk inserts in the database
 */
const SheetManager = require("./SheetManager");
const prismaClient = require("./prismaClient");

SheetManager.extractEskomDirectSuburbs().then(async suburbs => {
    console.log(suburbs.length);
    // await prismaClient.$transaction(
    //     suburbs.map((suburb) => prismaClient.suburbs.create({ data: suburb }))
    // );
})

SheetManager.extractCityPowerSuburbs().then(async suburbs => {
    console.log(suburbs.length);
    // await prismaClient.$transaction(
    //     suburbs.map((suburb) => prismaClient.suburbs.create({ data: suburb }))
    // );
})


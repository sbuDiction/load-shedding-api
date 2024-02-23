const { Prisma } = require('@prisma/client');
const prismaClient = require('../prismaClient');

class SearchController {
    static searchByText = async (req, res) => {

        try {
            const { text } = req.query;
            await prismaClient.$queryRaw`
            SELECT *
            FROM "Suburbs"
            ORDER BY SIMILARITY(name, ${text})
            DESC 
            LIMIT 5;
            `.then(data => {
                res.status(200)
                    .json({
                        suburbs: data,
                    });
            })
        } catch (error) {
            console.log('Text search controller error:', error)
        }
    }

}

module.exports = SearchController;
const { Prisma } = require('@prisma/client');
const prismaClient = require('../prismaClient');

class SearchController {
    static searchByText = async (req, res) => {

        try {
            const { text } = req.query;
            const to_tsquery = text.replace(' ', '|');
            await prismaClient.$queryRaw`
            SELECT *
            FROM "Suburbs"
            WHERE to_tsvector('english', name) @@ to_tsquery(${to_tsquery})
            ORDER BY ts_rank(to_tsvector('english', name), to_tsquery(${to_tsquery})) DESC
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
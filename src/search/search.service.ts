import { Injectable } from '@nestjs/common';
import { Suburb } from 'src/search/interfaces/suburb.interface';
import prismaClient from 'prismaClient';

@Injectable()
export class SearchService {

    findSuburb = async (suburbName: string): Promise<Suburb[]> => {
        suburbName = suburbName.replace(' ', '&');
        
        const results: Suburb[] = await prismaClient.$queryRaw`
        SELECT 
        sid, 
        name, 
        region, 
        block
        FROM "Suburbs"
        WHERE to_tsvector('english', name) @@ to_tsquery(${suburbName})
        ORDER BY ts_rank(to_tsvector('english', name), to_tsquery(${suburbName})) DESC
        `;

        return results;
    }
}

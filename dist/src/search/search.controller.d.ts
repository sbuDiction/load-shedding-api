import { SearchService } from './search.service';
import { Suburb } from 'src/search/interfaces/suburb.interface';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    searchByText(text: string): Promise<Suburb[]>;
}

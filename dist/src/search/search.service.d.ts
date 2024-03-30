import { Suburb } from 'src/search/interfaces/suburb.interface';
export declare class SearchService {
    findSuburb: (suburbName: string) => Promise<Suburb[]>;
}

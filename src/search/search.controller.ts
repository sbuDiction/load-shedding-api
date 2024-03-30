import { Controller, Get, Post, Query } from '@nestjs/common';
import prismaClient from 'prismaClient';
import { SearchService } from './search.service';
import { Suburb } from 'src/search/interfaces/suburb.interface';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) { }
    /**
     * This controller is for searching an area by text.
     */
    @Get()
    async searchByText(@Query('text') text: string): Promise<Suburb[]> {
        const searchResults: Suburb[] = await this.searchService.findSuburb(text);
        return searchResults;
    }
}

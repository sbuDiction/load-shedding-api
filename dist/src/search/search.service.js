"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prismaClient_1 = require("../../prismaClient");
let SearchService = class SearchService {
    constructor() {
        this.findSuburb = async (suburbName) => {
            suburbName = suburbName.replace(' ', '&');
            const results = await prismaClient_1.default.$queryRaw `
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
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)()
], SearchService);
//# sourceMappingURL=search.service.js.map
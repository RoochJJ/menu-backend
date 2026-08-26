import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { SpotService } from "./spot.service";
import { Spot } from "./spot.entity";
import { CreateCategoryDto } from "./Dto/update-spot.";

@Controller('categories')
export class CategoryController {

    constructor(private readonly categoryService: SpotService){} 
  


    @Get()
    findall(): Promise<Spot[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe)
        id: string) : Promise<Spot> {
        return this.categoryService.findOne(id);
}


@Post()
create( @Body()
dto: CreateCategoryDto): Promise<Spot> {

    return this.categoryService.create(dto);


}
@Patch(':id')
update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    dto: CreateCategoryDto): Promise<Spot> {
        return this.categoryService.update(id, dto);

    } 
     @Delete(':id')
     @HttpCode(204)
    delete(
        @Param('id', ParseUUIDPipe)
        id: string): Promise<void> {
            return this.categoryService.remove(id);
    }
}

import { Repository } from "typeorm";
import { Spot } from "./spot.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatespotDto, UpdatespotDto } from "./Dto/update-spot.";



@Injectable()
export class spotService {
    constructor(private readonly categoryRepository: Repository<Spot>
    ) {

    }
    findAll(): Promise<Spot[]> {
    return this.categoryRepository.find({
        order: { name: 'ASC'
        }
    
    }

    );
    
    }
   async findOne(id: string): Promise<Spot> {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException(`Categoria não encontrada!`);
        }
    
          return category;

    }
    create(dto: CreatespotDto): Promise<Spot> {
        const category = this.categoryRepository.create({
            ...dto,
            name: dto.name,
            active: true
        });

        return this.categoryRepository.save(category);

    }
    
   async update(id: string, dto: UpdatespotDto): Promise<Spot> {

        const category = await this.findOne(id);

        if(dto.name !== undefined) {
            category.name = dto.name;
        }
        if(dto.active !== undefined) {
            category.active = dto.active;
        }

        return this.categoryRepository.save(category);
    }
   async remove(id: string): Promise<void> {
    
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }

}
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { Injectable } from "@nestjs/common";

export class CategoryService {
    constructor(private readonly categoryRepository: Repository<Category>
    ) {

    }
    findAll(): Promise<Category[]> 
    return this.categoryRepository.find();{

    }
    findOne(): Promise<Category> {

    }
    create(): Promise<Category> {

    }
    update(): Promise<Category> {

    }
    remove(): Promise<void> {

    }

}
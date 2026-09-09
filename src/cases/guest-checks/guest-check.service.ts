import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GuestCheck, GuestCheckStatus } from './guest-check.entity';
import { CreateGuestCheckDto } from './dto/create-guest-check';
import { Spot } from '../spots/spot.entity';

@Injectable()
export class GuestCheckService {
  constructor(
    @InjectRepository(GuestCheck)
    private readonly guestCheckRepository: Repository<GuestCheck>,

    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,

  ) {}

  async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {
    const spot = await this.spotRepository.findOneBy({ id: dto.spotId, 
      active: true });
    if (!spot) {
      throw new NotFoundException('Não foi encontrado uma mesa ativa com este ID');
    }


    const opened = await this.guestCheckRepository.exists({
      where: {
        spot: { id: dto.spotId },
        status: GuestCheckStatus.OPENED,
      },
    });
    if (opened) {
      throw new ConflictException('Já existe uma comanda aberta para esta mesa');
    }
    
    const guestCheck = this.guestCheckRepository.create({
      spot,
      status: GuestCheckStatus.OPENED,
    });


      return this.guestCheckRepository.save(guestCheck)

  }

   async findOne(id: string): Promise<GuestCheck> {
          const guestCheck = await this.guestCheckRepository.findOneBy({ id });
  
          if (!guestCheck) {
              throw new NotFoundException(`Comanda não encontrada!`);
          }
  
              return guestCheck;
  
      }


  
 
   async close(id: string): Promise<GuestCheck> {

    const guestCheck = await this.findOne(id);


    // Regra 1: só posso fechar uma comanda que esteja aberta
    if (guestCheck.status !== GuestCheckStatus.OPENED) {
      throw new BadRequestException('A comanda já está fechada');
    }
  

  // Regra 2: Não posso fechar uma comanda com pedidos que não foram entregues  
  //TO DO: Implementar lista depois (divida técnica) 


  // se chegou aqui, deu certo!
  guestCheck.status = GuestCheckStatus.CLOSED;

  return this.guestCheckRepository.save(guestCheck);


  }
}
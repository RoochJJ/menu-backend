import { Repository } from 'typeorm';
import { GuestCheck, GuestCheckStatus } from './guest-check.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  // Soma o total de todos os pedidos da comanda
  private sumOrders(guestCheck: GuestCheck): number {
    const total = (guestCheck.orders ?? []).reduce((sum, order) => sum + Number(order.total), 0);
    return Math.round(total * 100) / 100;
  }

  async findAll(status?: GuestCheckStatus): Promise<GuestCheck[]> {
    const guestChecks = await this.guestCheckRepository.find({
      where: { ...(status && { status }) },
      relations: { spot: true, orders: true },
      order: { createdAt: 'ASC' },
    });

    // Na listagem devolvemos só o total, sem a lista de pedidos
    return guestChecks.map(({ orders, ...guestCheck }) => ({
      ...guestCheck,
      total: this.sumOrders({ ...guestCheck, orders } as GuestCheck),
    })) as GuestCheck[];
  }

  async findOne(id: string): Promise<GuestCheck> {
    const guestCheck = await this.guestCheckRepository.findOne({
      where: { id },
      relations: { spot: true, orders: { items: { product: true } } },
      order: { orders: { createdAt: 'ASC' } },
    });

    if (!guestCheck) {
      throw new NotFoundException('Comanda não encontrada');
    }

    guestCheck.total = this.sumOrders(guestCheck);
    return guestCheck;
  }

  async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {
    // Regra 1: não se abre comanda em mesa inexistente ou inativa
    const spot = await this.spotRepository.findOneBy({ id: dto.spotId, active: true });

    if (!spot) {
      throw new NotFoundException('Não foi encontrada uma mesa ativa com este ID');
    }

    // Regra 2: não se abre comanda em mesa que já tenha comanda aberta
    const opened = await this.guestCheckRepository.exists({
      where: { spot: { id: dto.spotId }, status: GuestCheckStatus.OPENED },
    });

    if (opened) {
      throw new ConflictException('A mesa já possui uma comanda em aberto');
    }

    const guestCheck = this.guestCheckRepository.create({
      spot,
      status: GuestCheckStatus.OPENED,
    });

    return this.guestCheckRepository.save(guestCheck);
  }

  async close(id: string): Promise<GuestCheck> {
    const guestCheck = await this.findOne(id);

    // Regra: só é possível fechar uma comanda aberta
    if (guestCheck.status !== GuestCheckStatus.OPENED) {
      throw new BadRequestException('A comanda não está aberta');
    }

    guestCheck.status = GuestCheckStatus.CLOSED;
    await this.guestCheckRepository.update(id, { status: GuestCheckStatus.CLOSED });

    return guestCheck;
  }

  findOpenedBySpotId(spotId: string): Promise<GuestCheck | null> {
    return this.guestCheckRepository.findOne({
      where: { spot: { id: spotId }, status: GuestCheckStatus.OPENED },
      relations: { spot: true },
    });
  }

  // Usado pelos pedidos: devolve a comanda aberta da mesa ou abre uma nova
  async findOrCreateOpened(spotId: string): Promise<GuestCheck> {
    const opened = await this.findOpenedBySpotId(spotId);

    if (opened) {
      return opened;
    }

    return this.create({ spotId });
  }
}
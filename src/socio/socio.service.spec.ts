import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        usuario: faker.internet.userName(),
        email: faker.internet.email(),
        fecha_nacimiento: faker.date.past(),
      });
      sociosList.push(socio);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(storedSocio.usuario);
    expect(socio.email).toEqual(storedSocio.email);
    expect(socio.fecha_nacimiento).toEqual(storedSocio.fecha_nacimiento);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: '',
      usuario: faker.internet.userName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(),
      clubes: [],
    };

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: newSocio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(newSocio.usuario);
    expect(storedSocio.email).toEqual(newSocio.email);
    expect(storedSocio.fecha_nacimiento).toEqual(newSocio.fecha_nacimiento);
  });

  it('create a socio with invalid email should throw an exception', async () => {
    const socio: SocioEntity = {
      id: '',
      usuario: faker.internet.userName(),
      email: 'Not an Email',
      fecha_nacimiento: faker.date.past(),
      clubes: [],
    };
    await expect(() => service.create(socio)).rejects.toHaveProperty(
      'message',
      'The given email is invalid, please check your data',
    );
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.usuario = 'New user';
    socio.email = 'newemail@example.com';
    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(socio.usuario);
    expect(storedSocio.email).toEqual(socio.email);
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio,
      usuario: 'New user',
      email: 'newemail@example.com',
    };
    await expect(() => service.update('0', socio)).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });

  it('update should throw an exception for a socio with an invalid email', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio,
      usuario: 'New user',
      email: 'Not an Email',
    };
    await expect(() => service.update(socio.id, socio)).rejects.toHaveProperty(
      'message',
      'The given email is invalid, please check your data',
    );
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });
});

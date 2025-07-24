import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { DeleteUserDto } from 'src/dto/delete-user.dto';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;
  portEnv = process.env.DB_PORT;
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB,
      password: process.env.DB_PASSWORD,
      port: this.portEnv !== undefined ? parseInt(this.portEnv, 10) : undefined, // преобразование строки в число
    });
  }

  async query<T>(text: string, params?: (string | number)[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      await client.query(`SET client_encoding TO 'LATIN9'`);
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const result = await this.query('SELECT * FROM users');
    return result;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { name, surname, age } = createUserDto;
    const result = await this.query(
      `INSERT INTO users (name, surname, age) VALUES ($1, $2, $3) RETURNING name, surname, age`,
      [name, surname, age],
    );
    return {
      result,
      message: `Пользователь ${name} ${surname} создан`,
    };
  }

  async deleteUserById(createUserDto: DeleteUserDto) {
    const { id } = createUserDto;
    const result = await this.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );

    return {
      result,
      message: `Пользователь c id ${id} удален`,
    };
  }

  async updateUserById(updateUserDto: UpdateUserDto) {
    const { id, name, surname, age } = updateUserDto;
    const result = await this.query(
      `UPDATE users SET name = $2, surname = $3, age = $4 WHERE id = $1 RETURNING *`,
      [id, name, surname, age],
    );

    return {
      result,
      message: `Пользователь ${name} ${surname} изменен`,
    };
  }
}

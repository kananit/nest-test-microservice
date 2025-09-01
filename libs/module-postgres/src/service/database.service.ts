/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import {
  CreateUserResult,
  UpdateUserResult,
  DeleteUserResult,
  CreateUserPayload,
} from '@app/module-postgres/types/user.interfaces';
import { User } from '@app/module-postgres/types/user.interfaces';
import {
  DB_USER,
  DB_HOST,
  DB,
  DB_PASSWORD,
} from 'libs/module-postgres/src/config/db.config';

@Injectable()
export class DatabaseService {
  private pool: Pool | null = null;
  portEnv = process.env.DB_PORT;

  constructor() {
    const enableDb = process.env.ENABLE_DB === 'true';
    if (!enableDb) {
      console.log('PostgreSQL локально отключён, подключение не выполняется');
      return;
    }

    if (!DB_USER || !DB_PASSWORD) {
      throw new Error('DB_USER или DB_PASSWORD не определены!');
    }

    this.pool = new Pool({
      user: DB_USER,
      host: DB_HOST,
      database: DB,
      password: DB_PASSWORD,
      port: this.portEnv ? parseInt(this.portEnv, 10) : 5432,
    });

    // Создаем таблицы при старте
    this.ensureTablesExist();
  }

  private async ensureTablesExist() {
    if (!this.pool) return; // ничего не делаем если DB отключена
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          surname VARCHAR(100) NOT NULL,
          age INT
        );
      `);
    } finally {
      client.release();
    }
  }

  async query<T>(text: string, params?: (string | number)[]): Promise<T[]> {
    if (!this.pool) return []; // игнорируем запросы если DB отключена
    const client = await this.pool.connect();
    try {
      await client.query(`SET client_encoding TO 'LATIN9'`);
      const res = await client.query(text, params);
      return res.rows as T[];
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<User[]> {
    return await this.query<User>('SELECT * FROM users');
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await this.query<User>('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return result[0] || null;
  }

  async createUser(payload: CreateUserPayload): Promise<CreateUserResult> {
    const { name, surname, age } = payload;
    const result = await this.query<User>(
      `INSERT INTO users (name, surname, age) VALUES ($1, $2, $3) RETURNING name, surname, age`,
      [name, surname, age],
    );
    return {
      result,
      message: `Пользователь создан`,
    };
  }

  async deleteUserById(id: string): Promise<DeleteUserResult> {
    const result = await this.query<User>(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    return {
      result,
      message: `Пользователь c id ${id} удален`,
    };
  }

  async updateUserById(user: User): Promise<UpdateUserResult> {
    const { id, name, surname, age } = user;
    const result = await this.query<User>(
      `UPDATE users SET name = $2, surname = $3, age = $4 WHERE id = $1 RETURNING *`,
      [id, name, surname, age],
    );

    return {
      result,
      message: `Пользователь ${name} ${surname} изменен`,
    };
  }
}

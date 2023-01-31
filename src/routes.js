import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query
      const tasks = database.select('tasks', search)
      return response.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body

      if(!title) {
        return response
          .writeHead(400)
          .end(JSON.stringify('O Título é obrigatório!'))
      }

      if(!description) {
        return response
          .writeHead(400)
          .end(JSON.stringify('A Descrição é obrigatório!'))
      }
  
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      };
  
      database.insert('tasks', task)
  
      return response
      .writeHead(201)
      .end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      database.update('tasks', id, {
        completed_at: new Date(),
        updated_at: new Date()
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      database.delete('tasks', id)

      return response.writeHead(204).end()
    }
  }
]
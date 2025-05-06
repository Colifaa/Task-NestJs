import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.schema';

@Controller('tasks') // ESTA ES MI RUTA http://localhost:3001/tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Obtener todas las tareas
  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  // Crear una nueva tarea
  @Post()
  async create(@Body() taskData: Task) {
    return this.tasksService.create(taskData);
  }

  // Actualizar una tarea
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updates: Partial<Task>) {
    return this.tasksService.update(id, updates);
  }

  // Eliminar una tarea
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
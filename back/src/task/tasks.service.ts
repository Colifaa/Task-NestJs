import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  // Obtener todas las tareas
  async findAll() {
    return this.taskModel.find().exec();
  }

  // Crear una nueva tarea
  async create(taskData: Partial<Task>) {
    const newTask = new this.taskModel(taskData);
    return newTask.save();
  }

  // Actualizar una tarea
  async update(id: string, updates: Partial<Task>) {
    return this.taskModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  // Eliminar una tarea
  async delete(id: string) {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
}
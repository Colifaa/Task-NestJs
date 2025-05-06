import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Interfaz para definir la estructura de una tarea
export interface ITarea extends Document {
  title: string; // Título de la tarea
  description: string; // Descripción de la tarea
  columnId: string; // Identificador de la columna donde está la tarea
}

// Esquema de la tarea
@Schema({ timestamps: true }) // Añade automáticamente createdAt y updatedAt
export class Task extends Document implements ITarea {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  columnId: string;
}

// Exportar el esquema generado por NestJS
export const TaskSchema = SchemaFactory.createForClass(Task);
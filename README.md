# Task-NestJs 🚀

<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</div>

## 📝 Descripción

Task-NestJs es una aplicación web moderna desarrollada con NestJS en el backend y una interfaz de usuario moderna en el frontend. Este proyecto demuestra las mejores prácticas de desarrollo y arquitectura en una aplicación full-stack.

## 🛠️ Tecnologías Utilizadas

### Backend
- NestJS
- TypeScript
- Node.js
- MongoDB
- Socket.io
- TypeORM

### Frontend
- React.js
- TypeScript
- CSS/SCSS
- Material-UI
- Socket.io-client
- React DnD (Drag and Drop)

## 🚀 Características Principales

- Arquitectura modular y escalable
- API RESTful
- Autenticación y autorización
- Gestión de tareas y proyectos
- Interfaz de usuario intuitiva y responsive
- Comunicación en tiempo real con Socket.io
- Funcionalidad de drag & drop para mover tarjetas entre columnas

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- MongoDB

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/Colifaa/Task-NestJs.git
cd Task-NestJs
```

2. Instalar dependencias del backend
```bash
cd back
npm install
```

3. Instalar dependencias del frontend
```bash
cd ../front
npm install
```

## ⚙️ Variables de Entorno

### Backend (.env)
```env
FRONTEND_URL=http://localhost:3000
PORT=4000
MONGODB_URI=mongodb://localhost:27017/task-nestjs
WS_PATH=/socket.io
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_WS_URL=ws://localhost:4000
```

## 🚀 Ejecución del Proyecto

### Backend
```bash
cd back
npm run start:dev
```

### Frontend
```bash
cd front
npm start
```

## 📦 Estructura del Proyecto

```
Task-NestJs/
├── back/           # Backend NestJS
├── front/          # Frontend React
└── README.md
```

## 👨‍💻 Autor

**Jorge Mathez**
- GitHub: [@Colifaa](https://github.com/Colifaa)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📞 Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de GitHub.

---
⭐️ From [@Colifaa](https://github.com/Colifaa) 
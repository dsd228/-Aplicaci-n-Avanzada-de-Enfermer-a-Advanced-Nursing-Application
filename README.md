# Aplicación Avanzada de Enfermería (Advanced Nursing Application)

Una aplicación integral de gestión clínica que combina una interfaz moderna con funcionalidades avanzadas de enfermería.

## 🚀 Características

### SaludPro - Sistema Integral
- **Dashboard Principal**: Vista general con métricas y alertas
- **Gestión de Pacientes**: Lista y administración de pacientes
- **Signos Vitales**: Registro y monitoreo
- **Historia Clínica**: Registros médicos completos
- **Interacciones Medicamentosas**: Base de datos de interacciones por categorías
- **Combinador de Medicamentos**: Análisis de múltiples medicamentos
- **Calculadoras Médicas**: Herramientas de cálculo clínico
- **Educación Médica**: Recursos de aprendizaje

### CareTrack Pro - Gestión de Enfermería
- **Gestión de Pacientes**: Sistema completo de administración
- **Signos Vitales**: Registro detallado con conversión de unidades
- **Medicación**: Seguimiento y programación
- **Notas de Enfermería**: Sistema de anotaciones
- **Balance Hídrico**: Control de ingresos y egresos
- **Tareas**: Lista de tareas con seguimiento
- **Búsqueda Médica**: Integración con Wikipedia
- **Exportar/Importar**: Respaldo de datos

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Estilos**: Google Material Design
- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite3
- **PWA**: Service Worker para funcionamiento offline
- **Scraping**: Puppeteer para búsquedas médicas

## 📋 Instalación

### Frontend
```bash
# Servir archivos estáticos
python3 -m http.server 8000
# o usar cualquier servidor web estático
```

### Backend (Opcional)
```bash
cd backend
npm install
npm start
```

## 🚀 Uso

1. **Abrir la aplicación**: Navegar a `http://localhost:8000`
2. **Explorar el Dashboard**: Ver métricas y alertas
3. **Gestionar Pacientes**: Usar el sistema de pacientes
4. **CareTrack Pro**: Acceder a funcionalidades avanzadas de enfermería
5. **Interacciones**: Consultar la base de datos de medicamentos

## 🔧 Configuración

### Variables de Entorno
- Puerto del servidor: `PORT=3000` (por defecto)
- Base de datos: SQLite local `caretrack.db`

### Funcionalidades Offline
- La aplicación funciona sin conexión gracias al Service Worker
- Los datos se almacenan localmente en localStorage y SQLite

## 📱 PWA (Progressive Web App)

La aplicación puede instalarse como PWA:
- Icono en el escritorio
- Funcionamiento offline
- Notificaciones (futuro)

## 🔐 Seguridad

- Validación de datos de entrada
- Sanitización de contenido
- CORS configurado para dominios específicos
- Manejo seguro de errores

## 🎯 Mejoras Implementadas

### Correcciones de Errores
- ✅ Eliminado error de Chart.js con polyfill
- ✅ Corregidas rutas del Service Worker
- ✅ Funciones faltantes en la base de datos completadas
- ✅ Integración entre interfaces mejorada
- ✅ Manejo de errores en web scraping

### Nuevas Funcionalidades
- ✅ API REST completa para todas las entidades
- ✅ Sistema de búsqueda médica robusto
- ✅ Interfaz dual (moderna + CareTrack Pro)
- ✅ Navegación mejorada entre paneles
- ✅ Sistema de configuración de unidades

### Optimizaciones
- ✅ Código más limpio y modular
- ✅ Mejor manejo de errores
- ✅ Performance mejorado
- ✅ Compatibilidad con navegadores

## 📊 Base de Datos

### Estructura de Tablas
- `patients`: Información de pacientes
- `vitals`: Signos vitales
- `meds`: Medicaciones
- `notes`: Notas clínicas
- `fluids`: Balance hídrico
- `tasks`: Tareas de enfermería

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para features (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Documentación en el código
- Comentarios inline para funciones complejas
# SaludPro - Sistema Integral de Gestión Clínica

**SaludPro** es una aplicación avanzada de gestión clínica diseñada para profesionales de la salud. Proporciona un sistema completo de gestión de pacientes, expedientes médicos electrónicos (EME), y herramientas de automatización para clínicas y centros de salud.

## 🚀 **Características Principales**

### ✅ **Sistema de Gestión de Usuarios**
- **Autenticación Segura**: Sistema de login/registro con encriptación de contraseñas
- **Roles Profesionales**: Médicos, Enfermeros, Nutricionistas, Fisioterapeutas, Psiquiatras
- **Control de Acceso**: Permisos basados en roles para proteger información sensible
- **Autenticación de Dos Factores**: Sistema 2FA para mayor seguridad (en desarrollo)

### ✅ **Gestión Avanzada de Pacientes**
- **Registro Completo**: Información demográfica, contactos de emergencia, seguros médicos
- **Asignación de Profesionales**: Vinculación de pacientes con profesionales específicos
- **Historial Médico**: Tracking completo de condiciones, alergias y tratamientos
- **Información de Emergencia**: Contactos y datos críticos fácilmente accesibles

### ✅ **Expedientes Médicos Electrónicos (EME)**
- **Consultas Médicas**: Registro detallado de síntomas, diagnósticos y tratamientos
- **Signos Vitales**: Monitoreo de temperatura, presión arterial, frecuencia cardíaca, etc.
- **Gestión de Medicamentos**: Prescripciones, dosis, rutas de administración
- **Notas Clínicas**: Observaciones y seguimiento del progreso del paciente

### ✅ **Seguridad y Cumplimiento**
- **Encriptación de Datos**: Protección de información médica sensible
- **Logs de Auditoría**: Registro completo de accesos y modificaciones
- **Control de Acceso Granular**: Permisos específicos por tipo de recurso
- **Respaldo Seguro**: Sistemas de backup y recuperación de datos

### 🔄 **En Desarrollo**
- **Sistema de Notificaciones**: Alertas automáticas para citas y medicamentos
- **Reportes y Analytics**: Análisis de datos de salud y generación de informes
- **Integración de APIs Médicas**: Conexión con bases de datos farmacológicas
- **Visualización de Datos**: Gráficos y dashboards para análisis clínico

## 🛠 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 18+ 
- NPM o Yarn
- Navegador web moderno

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application.git
cd -Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application
```

### **2. Configurar el Backend**
```bash
cd backend
npm install
cp .env.example .env
```

Editar el archivo `.env` con sus configuraciones:
```env
PORT=3000
JWT_SECRET=tu-clave-secreta-muy-segura
FRONTEND_URL=http://localhost:8000
```

### **3. Iniciar el Backend**
```bash
npm start
```

### **4. Iniciar el Frontend**
En otra terminal, desde el directorio raíz:
```bash
python3 -m http.server 8000
# O usando Node.js
npx serve -p 8000
```

### **5. Acceder a la Aplicación**
Abrir el navegador en: `http://localhost:8000`

## 👥 **Registro de Usuarios**

### **Primer Uso**
1. Ir a `http://localhost:8000/login.html`
2. Hacer clic en "Registrarse"
3. Completar el formulario con:
   - Nombre completo
   - Email profesional
   - Contraseña segura
   - Rol profesional
   - Especialidad
   - Número de licencia
   - Teléfono

### **Roles Disponibles**
- **Médico**: Acceso completo a expedientes, diagnósticos y prescripciones
- **Enfermero/a**: Gestión de signos vitales, medicamentos y tareas de cuidado
- **Nutricionista**: Acceso a datos nutricionales y planes alimentarios
- **Fisioterapeuta**: Gestión de terapias y seguimiento de rehabilitación
- **Psiquiatra**: Acceso a salud mental y tratamientos psiquiátricos

## 📱 **Uso de la Aplicación**

### **Dashboard Principal**
- **Resumen de Pacientes**: Vista general de pacientes asignados
- **Citas del Día**: Programación de consultas pendientes
- **Indicadores Clave**: Métricas de adherencia y satisfacción
- **Actividad Reciente**: Últimas acciones realizadas

### **Gestión de Pacientes**
1. **Agregar Paciente**: Botón "Nuevo Paciente" → Completar formulario
2. **Asignar Profesional**: Selección automática del usuario actual
3. **Actualizar Información**: Edición de datos demográficos y médicos
4. **Historial Clínico**: Acceso a consultas y tratamientos previos

### **Registro de Signos Vitales**
- Temperatura, Presión Arterial, Frecuencia Cardíaca
- SpO₂, Frecuencia Respiratoria, Escala de Dolor
- Escala de Coma de Glasgow (GCS)
- Notas clínicas adicionales

## 🔒 **Seguridad**

### **Características de Seguridad**
- **Encriptación bcrypt**: Contraseñas hasheadas con salt rounds
- **JWT Tokens**: Autenticación stateless con expiración
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS Protection**: Control de acceso entre dominios
- **Helmet.js**: Headers de seguridad HTTP

### **Buenas Prácticas**
- Cambiar `JWT_SECRET` en producción
- Usar HTTPS en entornos de producción
- Configurar backups regulares de la base de datos
- Implementar rotación de logs de auditoría
- Revisar accesos y permisos regularmente

## 🏗 **Arquitectura Técnica**

### **Frontend**
- **Vanilla JavaScript**: Sin frameworks pesados para máximo rendimiento
- **Progressive Web App (PWA)**: Funcionalidad offline y mobile
- **Responsive Design**: Adaptable a dispositivos móviles y de escritorio
- **Material Design**: Interfaz profesional y moderna

### **Backend**
- **Node.js + Express**: API RESTful con middleware de seguridad
- **SQLite**: Base de datos embebida para facilidad de implementación
- **JWT Authentication**: Sistema de tokens seguros
- **Role-Based Access Control**: Permisos granulares por recurso

### **Base de Datos**
```sql
-- Estructura principal
Users (autenticación y roles)
Patients (información demográfica)
Medical_Records (consultas y diagnósticos)
Vitals (signos vitales)
Medications (prescripciones)
Notifications (alertas automáticas)
Audit_Logs (trazabilidad)
```

## 🤝 **Contribución**

### **Para Desarrolladores**
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### **Reportar Issues**
- Usar GitHub Issues para bugs y sugerencias
- Incluir pasos para reproducir el problema
- Especificar versión del navegador y sistema operativo

## 📄 **Licencia**

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 **Soporte**

Para soporte técnico o consultas sobre implementación:
- **Email**: soporte@saludpro.com
- **GitHub Issues**: [Reportar problema](https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/issues)
- **Documentación**: Wiki del proyecto en GitHub

---

**⚕️ SaludPro - Transformando la atención médica con tecnología avanzada**
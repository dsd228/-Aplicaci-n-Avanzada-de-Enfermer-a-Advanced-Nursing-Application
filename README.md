# SaludPro - Aplicación Avanzada de Enfermería / Advanced Nursing Application

SaludPro es una plataforma clínica avanzada diseñada para profesionales de la salud, proporcionando acceso rápido a información crítica sobre procedimientos, enfermedades, interacciones medicamentosas y protocolos clínicos.

## ✨ Características Principales

- **Procedimientos Clínicos**: Guías paso a paso para procedimientos esenciales
- **🩺 Enfermedades y Patologías**: Base de datos completa de enfermedades categorizadas por especialidad
- **⚠️ Interacciones Medicamentosas**: Sistema de verificación de interacciones críticas
- **🧪 Combinador de Medicamentos**: Herramienta para verificar compatibilidad entre fármacos
- **📋 Protocolos Clínicos**: Protocolos estandarizados para diferentes situaciones
- **🚨 Alertas Críticas**: Notificaciones importantes para la seguridad del paciente
- **📚 Galería Educativa**: Recursos visuales para educación continua
- **🎓 Recursos Educativos**: Integración con Wikipedia para búsqueda de información médica

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Diseño**: Material Design Icons, Google Fonts
- **Arquitectura**: SPA (Single Page Application)
- **Almacenamiento**: Datos estructurados en archivos JavaScript

## 🚀 Inicio Rápido

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application.git
   cd -Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application
   ```

2. **Inicia un servidor local**:
   ```bash
   # Con Python 3
   python3 -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Abre tu navegador**:
   Navega a `http://localhost:8000`

## 📋 Funcionalidad del Botón 'Enfermedades'

### ✅ Problema Solucionado

El botón 'Enfermedades' ahora funciona correctamente después de las siguientes correcciones:

#### 🔧 Cambios Realizados

1. **Corrección del Script de Datos**:
   - Se corrigió la referencia de `data-enfermedades.js` a `datos-enfermedades.js` en `index.html`
   - El archivo contenía datos válidos pero no se estaba cargando correctamente

2. **Mejoras en el Manejo de Errores**:
   - Se agregó validación para verificar que `ENFERMEDADES` esté definido
   - Mensajes de error informativos si los datos no se cargan
   - Manejo de categorías vacías
   - Manejo de errores en imágenes con `onerror="this.style.display='none'"`

3. **Funcionalidades Implementadas**:
   - ✅ Navegación entre categorías (Crónicas, Infecciosas, Respiratorias, etc.)
   - ✅ Visualización de enfermedades con niveles de gravedad (⛔ Fatal, ⚠️ Moderado, ✅ Leve)
   - ✅ Galería de imágenes educativas
   - ✅ Enlaces a recursos externos (Freepik)
   - ✅ Botón de cierre funcional

#### 🧪 Tests Incluidos

Se ha creado un archivo de tests (`test-enfermedades.html`) que valida:

- ✅ Definición correcta del objeto `ENFERMEDADES`
- ✅ Disponibilidad de todas las categorías esperadas
- ✅ Validación de datos en la categoría 'cronicas'
- ✅ Funcionamiento correcto de la función `renderEnfermedades`

Para ejecutar los tests:
```bash
# Inicia el servidor y navega a:
http://localhost:8000/test-enfermedades.html
```

#### 📊 Categorías de Enfermedades Disponibles

- **Crónicas**: Diabetes, Hipertensión, Enfermedad renal crónica
- **Infecciosas**: COVID-19, Tuberculosis, Gripe
- **Respiratorias**: Asma, EPOC, Neumonía
- **Cardíacas**: Infarto agudo de miocardio, Arritmias
- **Neurológicas**: Epilepsia, Accidente cerebrovascular
- **Dermatológicas**: Dermatitis atópica, Melanoma
- **Oncológicas**: Cáncer de pulmón, Leucemia
- **Psiquiátricas**: Depresión mayor, Episodio psicótico agudo
- **Gastrointestinales**: Úlcera gástrica, Pancreatitis aguda
- **Genéticas**: Fibrosis quística, Síndrome de Down

## 🔒 Seguridad y Buenas Prácticas

- **Validación de datos**: Verificación de existencia de objetos antes de uso
- **Manejo de errores**: Mensajes informativos en caso de fallos
- **Escape de HTML**: Prevención de inyección de código
- **Imágenes seguras**: Manejo de errores en carga de imágenes

## 🤝 Contribución

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor:
1. Abre un issue en el repositorio
2. Proporciona detalles específicos del problema
3. Incluye pasos para reproducir el error

---

**Nota**: Esta aplicación está diseñada para uso educativo y de referencia. Siempre consulta con profesionales médicos calificados para decisiones clínicas importantes.
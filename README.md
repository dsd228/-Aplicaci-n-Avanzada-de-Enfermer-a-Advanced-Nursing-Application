# Aplicación Avanzada de Enfermería - Advanced Nursing Application

Una aplicación web progresiva (PWA) integral para profesionales de enfermería que incluye herramientas clínicas avanzadas, calculadoras médicas, y sistemas de monitoreo de pacientes.

## Características Principales

### 🏥 Herramientas Clínicas
- **Calculadora Avanzada**: IMC, dosis, PAM, calorías
- **RCP Interactivo**: Cronómetro y guía para reanimación cardiopulmonar  
- **Combinador de Medicamentos**: Verificación de interacciones farmacológicas
- **Gráfico de Signos Vitales**: Visualización en tiempo real
- **PAE (Plan de Atención de Enfermería)**: Guardar y exportar planes de cuidado

### 🧬 **NUEVO: Calculadora de Estado VIH**

Herramienta especializada para evaluar el estado clínico de pacientes con VIH basándose en parámetros de laboratorio y criterios médicos establecidos.

#### Funcionalidades:
- **Análisis de CD4+**: Clasificación según criterios CDC (Categorías 1, 2, 3)
- **Evaluación de Carga Viral**: Detección de supresión viral o carga elevada
- **Ratio CD4/CD8**: Cálculo automático e interpretación clínica
- **Análisis de Hemoglobina**: Detección de anemia asociada
- **Evaluación de Síntomas**: Incorporación del estado clínico del paciente

#### Parámetros de Entrada:
- Recuento CD4+ (células/µL): 0-5000
- Recuento CD8+ (células/µL): 0-10000  
- Carga viral (copias/mL): ≥0
- Hemoglobina (g/dL): 0-25
- Estado sintomático: Sin síntomas, leves, moderados, severos

#### Criterios Médicos (CDC):
- **CD4+ ≥500**: Estado normal/controlado (Categoría 1)
- **CD4+ 200-499**: Inmunodepresión moderada (Categoría 2)
- **CD4+ <200**: Inmunodepresión severa - SIDA (Categoría 3)
- **Carga viral <50**: Supresión viral (indetectable)
- **Ratio CD4/CD8 normal**: 1.0-2.5

#### Validaciones:
- Verificación de rangos numéricos válidos
- Detección de valores fuera de parámetros clínicos
- Alertas para datos inválidos con guías de corrección

#### Resultados:
- **Clasificación visual** con código de colores por gravedad
- **Recomendaciones clínicas** basadas en guías médicas actuales
- **Interpretación integral** de todos los parámetros
- **Referencia a especialista** cuando corresponda

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **PWA**: Service Worker, Web App Manifest
- **Diseño**: Responsive design con Flexbox/Grid
- **Persistencia**: LocalStorage para datos del usuario

## Instalación

1. Clonar el repositorio
2. Abrir `index.html` en un navegador web
3. La aplicación es completamente funcional sin servidor backend

## Uso

### Calculadora VIH:
1. Navegar a la sección "Herramientas" en el panel lateral derecho
2. Localizar "Calculadora de Estado VIH"
3. Ingresar los valores de laboratorio del paciente
4. Seleccionar el estado sintomático
5. Hacer clic en "Calcular Estado VIH"
6. Revisar el análisis completo y las recomendaciones

## Consideraciones Médicas

⚠️ **Importante**: Esta herramienta es de apoyo clínico únicamente. Siempre consulte con un infectólogo para decisiones de tratamiento. Los criterios están basados en guías CDC y deben ser interpretados por profesionales médicos calificados.

## Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas siguiendo las mejores prácticas de desarrollo web y estándares médicos.
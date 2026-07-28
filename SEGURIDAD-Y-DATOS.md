# Seguridad y protección de datos · Tiza Education

Documento de referencia técnica sobre cómo la plataforma resguarda los datos.
No constituye asesoría legal: la certificación de cumplimiento normativo debe
revisarla el encargado de datos del colegio o un abogado.

## Marco aplicable en Chile

| Norma | Qué exige | Dónde impacta |
|---|---|---|
| Ley 19.628 (vida privada) | Tratamiento con finalidad, proporcionalidad y seguridad | Toda la plataforma |
| Ley 21.719 (protección de datos, vigencia dic-2026) | Datos de menores y de salud son **sensibles**: exigen resguardo reforzado y base de licitud | Fotos, PIE, casos, salud |
| Ley 21.096 | La protección de datos es garantía constitucional | Base de todo lo anterior |
| Ley 20.370 (General de Educación) | Reserva de los antecedentes del estudiante | Casos, entrevistas, bitácoras |

## Medidas implementadas

### Acceso
- Autenticación por cuenta institucional (Supabase Auth); contraseñas
  cifradas, nunca visibles para administradores.
- **RLS** activo en todas las tablas: cada consulta queda acotada a la
  institución del usuario.
- Toda ruta de datos exige token vigente. Se eliminó
  `/api/orientation-records`, que permitía escritura anónima.

### Fotografías de estudiantes (dato sensible: menores)
- Bucket **privado**: sin acceso anónimo.
- Nombre de archivo **aleatorio**. Antes derivaba del RUT, lo que hacía las
  direcciones adivinables.
- Se entregan mediante **enlace firmado** con caducidad.

### Vista pública de clases (`/clases`)
Pensada para que profesores consulten sin sesión. Por eso:
- Expone únicamente curso, fecha, tema y materiales.
- **Nunca** estudiantes, casos, entrevistas ni datos de salud.
- Las observaciones se omiten automáticamente si mencionan a un estudiante.

### Transporte y encabezados
- HTTPS forzado (HSTS con `preload`).
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`.
- `robots.txt` impide la indexación por buscadores.

### Trazabilidad
- `audit_logs` registra cargas masivas, depuraciones y cambios de seguridad.

## Pendientes recomendados

1. **Contraseña compartida**: el equipo se creó con una clave temporal común.
   Cada persona debería cambiarla (existe "¿Olvidaste tu contraseña?").
2. **Historial del repositorio**: hubo archivos semilla con texto íntegro de
   entrevistas. Se eliminaron del código, pero permanecen en el historial de
   git. Conviene verificar que el repositorio sea privado o purgar el historial.
3. **Roles diferenciados**: hoy toda cuenta autenticada ve todo. Convendría
   limitar por perfil (orientación, convivencia, dirección).
4. **Retención**: definir por cuánto tiempo se conservan casos y entrevistas.
5. **Registro de tratamiento** e información a apoderados sobre qué datos se
   almacenan y con qué finalidad.

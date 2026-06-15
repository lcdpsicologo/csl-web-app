# Tiza Education

App web en Next.js para gestión institucional escolar. Incluye una pestaña interna llamada `Juegos Vinculares` con juegos socioemocionales interactivos para abrir desde la app o compartir en Canva mediante enlace o QR.

## Juegos Vinculares

- Dentro de la app: menú lateral `Juegos Vinculares`.
- `/revoltijo-emociones` juego listo: Revoltijo Vincular de las Emociones.
- `/bingo-fortalezas` ruta preparada.
- `/ruleta-preguntas` ruta preparada.
- `/semaforo-emocional` ruta preparada.

## Editar contenidos

- Catálogo de juegos: `src/lib/games.ts`
- Tarjetas, niveles, colores y fortalezas: `src/lib/revoltijoCards.ts`
- Interfaz del juego Revoltijo: `src/components/RevoltijoGame.tsx`
- Logo colegio: reemplazar `public/logo-san-lucas.png`
- Logo fortalezas: reemplazar el bloque visual en `src/components/BrandHeader.tsx` y `src/components/RevoltijoGame.tsx` por una imagen real cuando esté disponible.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. En Vercel, crear un nuevo proyecto e importar el repositorio.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Output directory: dejar vacío.
6. Deploy.

Luego se puede copiar cada URL de juego en Canva o generar un QR con esa ruta.

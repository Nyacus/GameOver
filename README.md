# Configuración de Despedida - App Web

Esta aplicación permite a los usuarios configurar y presupuestar paquetes de despedida de soltero/a, incluyendo actividades, cenas, y alojamiento.

## 🚀 Puesta en Marcha (Local)

Para editar y probar este proyecto en tu ordenador:

1.  Asegúrate de tener **Node.js** instalado.
2.  Abre una terminal en la carpeta del proyecto.
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 📦 Generar Versión de Producción

Para crear la versión optimizada para subir a internet:

1.  Ejecuta el comando de construcción:
    ```bash
    npm run build
    ```
2.  Esto creará una carpeta llamada **`dist`**.
3.  El contenido de la carpeta `dist` es lo que debes subir a tu hosting (Netlify, Vercel, FTP, etc.).

## 🛠 Tecnologías

*   **React:** Biblioteca de interfaz de usuario.
*   **TypeScript:** Lógica tipada y segura.
*   **Vite:** Empaquetador y servidor de desarrollo rápido.
*   **Tailwind CSS:** Estilos (vía CDN en desarrollo, recomendable instalar vía PostCSS para producción avanzada).
*   **jsPDF:** Generación de PDFs en el cliente.

## 📝 Notas Importantes

*   **Google Sheets CSV:** La aplicación lee precios dinámicos de un CSV publicado. Asegúrate de mantener actualizada la URL en `App.tsx` (`GOOGLE_SHEET_CSV_URL`).
*   **Imágenes:** Las imágenes (Logo, Footer) se cargan desde URLs externas. Para producción, considera alojarlas localmente en la carpeta `public` si deseas evitar dependencias externas.

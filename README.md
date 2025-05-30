# PF-DETECTOR

PROCESO PARA LA CONSTRUCCIÓN, DESARROLLO E IMPLEMENTACIÓN DE LA APP MÓVIL

Comandos Claves Para Devorar
	cd proyecto: Entrar a la Carpeta del Proyecto
	source venv/bin/actívate: Activar el ambiente
	wget + link: Subir imagenes desde la web
	mv 'nombre como se guardo la imagen' nuevo nombre .jpg: renombrar imagen subida desde la web
	cd tu-proyecto-react-native
	cd Android
	./gradlew assembleDebug
	android/app/build/outputs/apk/debug/app-debug.apk
Descargar APK:
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
./gradlew assembleReleas

LA CARPETA QUE DESEO LLEVAR A MI GITHUB SE LLAMA imagenes
ChatGPT dijo:
Perfecto. Vamos a subir la carpeta llamada imagenes, que está en esta ruta:
C:\Users\jpere\imagenes, al repositorio de GitHub llamado PF-DETECTOR.
________________________________________
✅ Instrucciones completas (una sola vez)
1. Abre Git Bash o CMD.
2. Clona tu repositorio de GitHub si aún no lo has hecho:
bash
CopiarEditar
git clone https://github.com/tu-usuario/PF-DETECTOR.git
Reemplaza tu-usuario por tu usuario de GitHub.
________________________________________
3. Entra en la carpeta del repositorio clonado:
bash
CopiarEditar
cd PF-DETECTOR
________________________________________
4. Copia la carpeta imagenes al repositorio:
bash
CopiarEditar
xcopy "C:\Users\jpere\imagenes" ".\imagenes" /E /I
________________________________________
5. Verifica que esté copiada correctamente (opcional):
bash
CopiarEditar
dir imagenes
________________________________________
6. Agrega la carpeta al control de versiones:
bash
CopiarEditar
git add imagenes
________________________________________
7. Crea el commit:
bash
CopiarEditar
git commit -m "Agregada carpeta 'imagenes' desde C:/Users/jpere"
________________________________________
8. Sube los cambios a GitHub:
bash
CopiarEditar
git push origin main
Cambia main por master si tu rama principal tiene otro nombre.
 

![image](https://github.com/user-attachments/assets/602ca023-90d2-4e4e-9fed-1d84d69bff2d)


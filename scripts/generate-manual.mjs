import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const INK = "#1a1a1a";
const SOFT = "#4b5563";
const ACCENT = "#3b7a57";
const LINE = "#d8d2c6";
const OUT = "Manual-de-Usuario-Encuentralo-CCA.pdf";

const doc = new PDFDocument({ size: "A4", margin: 64, info: { Title: "Manual de Usuario - Encuéntralo CCA", Author: "Colegio Centro América" } });
doc.pipe(createWriteStream(OUT));

const W = doc.page.width - 128; // ancho útil

function space(n = 14) {
  doc.moveDown(0);
  doc.y += n;
}

function h1(text) {
  if (doc.y > 680) doc.addPage();
  doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(19).text(text, { width: W });
  doc.moveTo(64, doc.y + 6).lineTo(64 + W, doc.y + 6).lineWidth(1).strokeColor(LINE).stroke();
  space(18);
}

function h2(text) {
  if (doc.y > 700) doc.addPage();
  space(6);
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(13).text(text, { width: W });
  space(6);
}

function p(text) {
  doc.fillColor(SOFT).font("Helvetica").fontSize(11).text(text, { width: W, align: "left", lineGap: 3 });
  space(8);
}

function bullet(text) {
  const y = doc.y;
  doc.circle(70, y + 6, 2).fill(ACCENT);
  doc.fillColor(SOFT).font("Helvetica").fontSize(11).text(text, 82, y, { width: W - 18, lineGap: 3 });
  space(6);
}

function step(n, title, text) {
  const y = doc.y;
  doc.roundedRect(64, y, 26, 26, 6).fill(ACCENT);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(12).text(String(n), 64, y + 7, { width: 26, align: "center" });
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(12).text(title, 102, y + 1, { width: W - 38 });
  doc.fillColor(SOFT).font("Helvetica").fontSize(11).text(text, 102, doc.y + 1, { width: W - 38, lineGap: 2 });
  space(12);
}

// ---------- PORTADA ----------
doc.rect(0, 0, doc.page.width, doc.page.height).fill("#faf7f2");
doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(13).text("COLEGIO CENTRO AMÉRICA", 64, 150, { characterSpacing: 2 });
doc.fillColor(INK).font("Helvetica-Bold").fontSize(40).text("Encuéntralo CCA", 64, 180, { width: W });
doc.fillColor(SOFT).font("Helvetica").fontSize(15).text("Manual de usuario", 64, 240);
doc.fillColor(INK).font("Helvetica").fontSize(13).text(
  "La forma fácil de reportar lo que perdiste, publicar lo que encontraste y devolverlo a su dueño dentro del colegio.",
  64, 290, { width: W, lineGap: 4 },
);
doc.moveTo(64, 380).lineTo(64 + W, 380).lineWidth(2).strokeColor(ACCENT).stroke();
doc.fillColor(SOFT).font("Helvetica").fontSize(11).text("Proyecto estudiantil · Portal web para la comunidad del CCA", 64, 395);

// ---------- CONTENIDO ----------
doc.addPage();

h1("¿Qué es Encuéntralo CCA?");
p("Es una página web hecha para los estudiantes del Colegio Centro América. Sirve para una cosa muy concreta: ayudar a que las cosas perdidas en el colegio regresen a su dueño.");
p("Funciona como un \"tablero de anuncios\" digital. Si perdiste algo, lo reportas. Si encontraste algo, lo publicas. Los demás pueden buscar y, si reconocen su objeto, pedirlo.");

h1("¿Qué problema resuelve?");
p("Todos los días en el colegio se pierden mochilas, calculadoras, llaves, suéteres, audífonos… Antes, recuperar algo dependía de la suerte: preguntar de salón en salón, revisar con el conserje o simplemente darlo por perdido.");
p("Con esta página todo queda en un solo lugar y ordenado:");
bullet("No tienes que andar preguntando a todo el mundo.");
bullet("Quien encuentra algo tiene dónde reportarlo en vez de quedárselo o dejarlo tirado.");
bullet("Hay un registro con foto, lugar y fecha, así es más fácil identificar las cosas.");
bullet("Tu información de contacto queda protegida hasta que tú aceptes entregar el objeto.");

h1("¿Cómo funciona, en pocas palabras?");
step(1, "Alguien publica", "Una persona reporta un objeto perdido o sube uno que encontró, con foto y una descripción.");
step(2, "Otra persona lo reconoce", "Quien cree que el objeto es suyo manda una solicitud explicando señas que solo el dueño sabría.");
step(3, "Se confirma y se entrega", "El que publicó revisa la solicitud, la acepta si las señas coinciden, y coordinan la entrega.");

h1("Cómo usarlo paso a paso");

h2("1. Crear tu cuenta");
p("Entra a la página y haz clic en \"Registrarse\". Necesitas tu correo del colegio (el que termina en @est.cca.edu.ni), tu nombre, grado, aula y una contraseña. Solo se aceptan correos del colegio para que sea una comunidad de confianza.");

h2("2. Iniciar sesión");
p("Con tu correo y contraseña entras a tu cuenta. Hay un botón de \"ojito\" para ver la contraseña mientras la escribes y no equivocarte.");

h2("3. Publicar un objeto");
p("Toca \"Publicar\". Eliges si lo perdiste o lo encontraste, le pones un título, la categoría (por ejemplo Electrónica o Llaves), el lugar, la fecha, una descripción y hasta 5 fotos. Las fotos se ven en una vista previa antes de enviar.");

h2("4. Buscar en el catálogo");
p("En \"Catálogo\" aparecen todos los objetos. Puedes cambiar entre Todos, Perdidos y Encontrados, buscar por palabra, ordenar por fecha y filtrar por categoría. La lista se actualiza al instante mientras escribes.");

h2("5. Reclamar un objeto");
p("Si ves algo que es tuyo, abres la publicación y mandas una solicitud describiendo señas distintivas (algo que solo el dueño conocería). El dueño la revisa y decide. Así se evita que alguien reclame cosas que no son suyas.");

h2("6. Gestionar lo tuyo");
p("En \"Mis publicaciones\" ves lo que reportaste y puedes editarlo, marcarlo como resuelto o eliminarlo. En \"Perfil\" actualizas tus datos. Cuando aceptas una solicitud, el objeto se marca como devuelto.");

h1("El panel de administración");
p("Los administradores tienen una sección extra para cuidar la plataforma. Desde ahí pueden:");
bullet("Ver estadísticas: cuántos estudiantes, objetos reportados y casos resueltos.");
bullet("Revisar todas las publicaciones y solicitudes.");
bullet("Administrar las categorías (crear, activar o desactivar).");
bullet("Ver la lista de usuarios registrados.");

h1("Las tecnologías que usa (y para qué sirven)");
p("Estas son las herramientas con las que está construido, explicadas en simple:");
bullet("Next.js: arma toda la página web y hace que cargue rápido y se sienta fluida.");
bullet("TypeScript: el lenguaje en el que está escrito; ayuda a evitar errores antes de tiempo.");
bullet("Tailwind CSS: se encarga de los estilos y de que se vea bien en celular y computadora.");
bullet("Motion: pone las animaciones y los pequeños detalles que se mueven al navegar.");
bullet("PostgreSQL: la base de datos donde se guardan usuarios, publicaciones y solicitudes.");
bullet("Prisma: el puente que conecta la página con la base de datos de forma ordenada y segura.");
bullet("Auth.js: maneja el inicio de sesión y revisa quién puede entrar a cada sección.");
bullet("Almacenamiento en la nube (S3): guarda las fotos de los objetos fuera del dispositivo.");

h1("¿Cómo se hizo el proyecto?");
p("Sin entrar en tecnicismos, esto es lo que hay por debajo:");
bullet("Es una aplicación web moderna: una sola página que carga rápido y se siente fluida, con animaciones suaves al navegar.");
bullet("Tiene una base de datos donde se guardan los usuarios, las publicaciones, las categorías y las solicitudes de forma ordenada.");
bullet("Las fotos se guardan en un servicio de almacenamiento en la nube, no en el celular ni en la computadora de nadie.");
bullet("El inicio de sesión es seguro: las contraseñas nunca se guardan tal cual, se guardan \"revueltas\" (cifradas) para que nadie pueda leerlas.");
bullet("Las reglas importantes (quién puede editar o borrar algo) se revisan en el servidor, no solo escondiendo botones, así nadie puede hacer trampa.");
bullet("El diseño cuida los detalles: colores consistentes, todo en español y pensado para usarse igual de bien en el celular que en la computadora.");
space(4);
p("La idea central fue mantenerlo simple: que cualquier estudiante pueda usarlo sin instrucciones complicadas, y que de verdad ayude a que las cosas perdidas vuelvan a su dueño.");

doc.end();
console.log("✓ PDF generado:", OUT);

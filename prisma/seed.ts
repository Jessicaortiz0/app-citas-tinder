import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Keep these emails so the user's manual accounts are not deleted
  const keepEmails = ["jpburi@sudamericano.edu.ec", "juanburi94@gmail.com"];

  // Find users to delete
  const usersToDelete = await prisma.usuario.findMany({
    where: {
      contacto: {
        correo: {
          notIn: keepEmails,
        },
      },
    },
    select: {
      id_usuario: true,
    },
  });

  const idsToDelete = usersToDelete.map((u) => u.id_usuario);

  if (idsToDelete.length > 0) {
    console.log(`Deleting ${idsToDelete.length} old seed users...`);
    await prisma.usuario.deleteMany({
      where: {
        id_usuario: {
          in: idsToDelete,
        },
      },
    });
  }

  const seedUsers = [
    {
      nombre: "Sofía",
      edad: 24,
      genero: "Femenino",
      nacionalidad: "Argentina",
      ciudad_pais: "Buenos Aires",
      verificado: true,
      bio: "Amante del buen café, los libros de misterio y los paseos por la tarde. ¿Vamos por una cerveza artesanal?",
      email: "sofia.arg@example.com",
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
    },
    {
      nombre: "Mateo",
      edad: 27,
      genero: "Masculino",
      nacionalidad: "Colombia",
      ciudad_pais: "Medellín",
      verificado: true,
      bio: "Apasionado por el senderismo, la fotografía y el ciclismo de montaña. Buscando a alguien con quien compartir aventuras al aire libre.",
      email: "mateo.col@example.com",
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
    },
    {
      nombre: "Camila",
      edad: 22,
      genero: "Femenino",
      nacionalidad: "Chile",
      ciudad_pais: "Santiago",
      verificado: false,
      bio: "Melómana de corazón. Toco la guitarra y amo los conciertos indie. Si te gusta viajar y la pizza los domingos, ya nos llevamos bien.",
      email: "camila.chi@example.com",
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    },
    {
      nombre: "Valeria",
      edad: 25,
      genero: "Femenino",
      nacionalidad: "Ecuador",
      ciudad_pais: "Cuenca",
      verificado: true,
      bio: "Diseñadora de interiores. Me encanta el arte moderno, pintar en acuarela y recorrer cafeterías de especialidad.",
      email: "valeria.ecu@example.com",
      foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600",
    },
    {
      nombre: "Diego",
      edad: 29,
      genero: "Masculino",
      nacionalidad: "México",
      ciudad_pais: "CDMX",
      verificado: false,
      bio: "Cocinero aficionado y fanático del cine de suspenso. Te puedo preparar los mejores tacos si me recomiendas tu película favorita.",
      email: "diego.mex@example.com",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
    },
    {
      nombre: "Valentina",
      edad: 26,
      genero: "Femenino",
      nacionalidad: "Perú",
      ciudad_pais: "Lima",
      verificado: true,
      bio: "Viajera incansable, amante de la gastronomía marina y de los atardeceres en la playa. Buscando conocer gente nueva y vibras positivas.",
      email: "valentina.per@example.com",
      foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    },
  ];

  console.log("Creating new seed users...");
  for (const user of seedUsers) {
    await prisma.usuario.create({
      data: {
        nombre: user.nombre,
        edad: user.edad,
        genero: user.genero,
        nacionalidad: user.nacionalidad,
        ciudad_pais: user.ciudad_pais,
        verificado: user.verificado,
        contacto: {
          create: {
            correo: user.email,
          },
        },
        perfil: {
          create: {
            biografia: user.bio,
          },
        },
        fotografias: {
          create: {
            url_imagen: user.foto,
            es_principal: true,
          },
        },
      },
    });
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

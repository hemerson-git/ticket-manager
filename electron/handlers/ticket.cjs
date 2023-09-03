const { prisma } = require("../lib/prisma.cjs");
const z = require("zod");

const saveTicketHandler = async (event, data) => {
  const {
    recipient,
    ticketNumber,
    ticketValue,
    paymentPlace,
    isPaid,
    isOnline,
    expiryDate,
    userId,
  } = data;

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        document_number: ticketNumber,
        expiry_date: new Date(expiryDate),
        payment_place: paymentPlace,
        recipient,
        value: ticketValue,
        is_paid: isPaid,
        is_online: isOnline,
        userId,
      },
    });

    return newTicket;
  } catch (err) {
    console.log("ERROR: " + err);
  }
};

const editTicketHandler = async (event, data) => {
  const { id } = data;
  const dataSchema = z.object({
    recipient: z.string(),
    ticketNumber: z.string(),
    ticketValue: z.number(),
    paymentPlace: z.string(),
    isPaid: z.boolean(),
    isOnline: z.boolean(),
    expiryDate: z.string(),
    userId: z.string(),
  });

  const {
    expiryDate,
    isPaid,
    paymentPlace,
    recipient,
    ticketNumber,
    ticketValue,
    userId,
    isOnline,
  } = dataSchema.parse(data);

  try {
    let ticket = await prisma.ticket.findUniqueOrThrow({
      where: {
        id,
      },
    });

    ticket = await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        document_number: ticketNumber,
        expiry_date: new Date(expiryDate),
        is_paid: isPaid,
        is_online: isOnline,
        payment_place: paymentPlace,
        recipient,
        value: ticketValue,
        userId,
      },
    });

    return ticket;
  } catch (err) {
    return err;
  }
};

const deleteTicketHandler = async (event, data) => {
  const dataSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = dataSchema.parse(data);

    const ticket = prisma.ticket.findFirstOrThrow({
      where: {
        id,
      },
    });

    if (!ticket) return { message: "Erro ao deletar boleto!" };

    await prisma.ticket.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    return err;
  }
};

const listTicketHandler = async (event, data) => {
  try {
    const schema = z.object({
      page: z.number().positive(),
      size: z.number().positive().optional(),
    });

    const { page, size = 20 } = schema.parse(data);

    const tickets = await prisma.ticket.findMany({
      orderBy: [
        {
          expiry_date: "asc",
        },
        {
          document_number: "asc",
        },
      ],

      take: size,
      skip: (page - 1) * size,

      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return tickets;
  } catch (e) {
    console.log(e);

    return {
      message: "Sorry, something went wrong. Please try again!",
    };
  }
};

const filterTicketHandler = async (event, data) => {
  const dataSchema = z.object({
    is_paid: z.boolean().nullable(),
    recipient: z.string(),
    document_number: z.string(),
    is_online: z.boolean().nullable(),
    expiry_date: z.date(),
  });

  // const {} = z.parse(data);

  console.log(data);

  const tickets = await prisma.ticket.findMany({
    orderBy: [
      {
        expiry_date: "asc",
      },
      {
        document_number: "asc",
      },
    ],

    where: {
      is_paid: {
        equals: data.is_paid,
      },
      recipient: {
        contains: data.recipient,
      },
      document_number: {
        contains: data.document_number,
      },
      is_online: {
        equals: data.is_online,
      },
      expiry_date: {
        equals: data.expiry_date,
      },
    },

    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return tickets;
};

const getTotalTickets = async () => {
  const total = await prisma.ticket.count();
  return total;
};

module.exports = {
  saveTicketHandler,
  listTicketHandler,
  editTicketHandler,
  deleteTicketHandler,
  filterTicketHandler,
  getTotalTickets,
};

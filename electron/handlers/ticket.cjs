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

    const { page = 1, size = 100 } = schema.parse(data);

    const tickets = await prisma.ticket.findMany({
      orderBy: [
        {
          expiry_date: "desc",
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

    const totalTickets = await prisma.ticket.count();

    const totalPages = Math.ceil(totalTickets / size ?? 100);

    return { tickets, pages: totalPages };
  } catch (e) {
    console.log(e);

    return {
      message: "Sorry, something went wrong. Please try again!",
    };
  }
};

const filterTicketHandler = async (event, data) => {
  const dataSchema = z.object({
    is_paid: z.boolean().optional(),
    recipient: z.string().optional(),
    document_number: z.string().optional(),
    is_online: z.boolean().optional(),
    expiry_date: z.coerce.date().optional(),
    limite_expire_date: z.coerce.date().optional(),
    page: z.number().positive().optional(),
    size: z.number().positive().optional(),
  });

  try {
    const {
      is_paid,
      recipient,
      document_number,
      is_online,
      expiry_date,
      limite_expire_date,
      page = 1,
      size = 100,
    } = dataSchema.parse(data);

    function getDateFilter() {
      if (!expiry_date) return undefined;
      if (limite_expire_date) return { gte: expiry_date, lte: limite_expire_date };
      return { equals: expiry_date };
    }

    const where = {
      ...(recipient && { recipient: { startsWith: recipient } }),
      ...(document_number && { document_number: { startsWith: document_number } }),
      ...(is_online !== undefined && { is_online: { equals: is_online } }),
      ...(is_paid !== undefined && { is_paid: { equals: is_paid } }),
      expiry_date: getDateFilter(),
    };

    const [tickets, totalTickets] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: [{ expiry_date: "desc" }, { document_number: "asc" }],
        take: size,
        skip: (page - 1) * size,
        include: { user: { select: { name: true } } },
      }),
      prisma.ticket.count({ where }),
    ]);

    return { tickets, pages: Math.ceil(totalTickets / size) };
  } catch (e) {
    console.log(e);
    return { message: "Sorry, something went wrong. Please try again!" };
  }
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

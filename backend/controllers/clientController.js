import Client from "../models/Client.js";

const getAstrologerFilter = (user) => {
  return user.role === "admin" ? {} : { assignedAstrologer: user._id };
};

export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find(getAstrologerFilter(req.user))
      .populate("assignedAstrologer", "name email role")
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      assignedAstrologer:
        req.user.role === "admin" ? req.body.assignedAstrologer || req.user._id : req.user._id
    };

    const client = await Client.create(payload);
    const populatedClient = await client.populate("assignedAstrologer", "name email role");

    res.status(201).json(populatedClient);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const client = await Client.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }).populate("assignedAstrologer", "name email role");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAstrologerFilter(req.user) };
    const client = await Client.findOneAndDelete(filter);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted" });
  } catch (error) {
    next(error);
  }
};

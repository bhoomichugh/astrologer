import Client from "../models/Client.js";
import Lead from "../models/Lead.js";

const getAssignedFilter = (user) => {
  return user.role === "admin" ? {} : { assignedTo: user._id };
};

export const getLeads = async (req, res, next) => {
  try {
    const filter = { ...getAssignedFilter(req.user) };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      assignedTo: req.user.role === "admin" ? req.body.assignedTo : req.user._id
    };

    const lead = await Lead.create(payload);
    const populatedLead = await lead.populate("assignedTo", "name email");

    res.status(201).json(populatedLead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAssignedFilter(req.user) };
    const lead = await Lead.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    }).populate("assignedTo", "name email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAssignedFilter(req.user) };
    const lead = await Lead.findOneAndDelete(filter);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
};

export const convertLead = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id, ...getAssignedFilter(req.user) };
    const lead = await Lead.findOne(filter);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (lead.status === "Converted") {
      return res.status(400).json({ message: "Lead is already converted" });
    }

    const client = await Client.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      source: lead.source,
      notes: lead.notes,
      assignedAstrologer: lead.assignedTo || req.user._id
    });

    lead.status = "Converted";
    lead.convertedClientId = client._id;
    await lead.save();

    const populatedLead = await lead.populate("assignedTo", "name email");
    const populatedClient = await client.populate("assignedAstrologer", "name email role");

    res.json({ lead: populatedLead, client: populatedClient });
  } catch (error) {
    next(error);
  }
};

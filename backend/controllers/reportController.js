import Appointment from "../models/Appointment.js";
import Client from "../models/Client.js";
import Lead from "../models/Lead.js";
import Payment from "../models/Payment.js";

export const getRevenueReport = async (req, res, next) => {
  try {
    const matchStage = { status: "Paid" };

    if (req.query.from || req.query.to) {
      matchStage.paidAt = {};
      if (req.query.from) matchStage.paidAt.$gte = new Date(req.query.from);
      if (req.query.to) matchStage.paidAt.$lte = new Date(req.query.to);
    }

    const revenue = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            month: { $month: "$paidAt" },
            year: { $year: "$paidAt" }
          },
          total: { $sum: "$amount" },
          paidCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: 1,
          paidCount: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json(revenue);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentReport = async (req, res, next) => {
  try {
    const report = await Appointment.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          scheduled: {
            $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          scheduled: 1,
          completed: 1,
          cancelled: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const getCustomerReport = async (req, res, next) => {
  try {
    const monthlyData = await Client.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    let cumulative = 0;
    const report = monthlyData.map((item) => {
      cumulative += item.newCustomers;
      return {
        month: item._id.month,
        year: item._id.year,
        newCustomers: item.newCustomers,
        totalCumulative: cumulative
      };
    });

    res.json(report);
  } catch (error) {
    next(error);
  }
};

export const getLeadReport = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const report = statusCounts.map((item) => ({
      status: item._id,
      count: item.count,
      percentage: totalLeads > 0 ? Math.round((item.count / totalLeads) * 1000) / 10 : 0
    }));

    res.json(report);
  } catch (error) {
    next(error);
  }
};

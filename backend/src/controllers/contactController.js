const Contact = require('../models/Contact');
const logger = require('../utils/logger');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

//GET /api/contacts
exports.listContacts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const search = (req.query.search || '').trim();

    const query = {};
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [
        { name: re },
        { email: re },
        { phone: re }
      ];
    }

    const [total, contacts] = await Promise.all([
      Contact.countDocuments(query),
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return res.status(200).json({
      success: true,
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error listing contacts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//POST /api/contacts
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, tags, subscribed } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    const existing = await Contact.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Contact with that email already exists' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.length ? tags.split(/[;,]+/).map(t => t.trim()).filter(Boolean) : [])
    });

    return res.status(201).json({ success: true, data: contact });
  } catch (error) {
    logger.error('Error creating contact:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//DELETE /api/contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    return res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    logger.error('Error deleting contact:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

 //bulk DELETE /api/contacts
exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array is required' });
    }
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    logger.error('Error bulk deleting contacts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//POST /api/contacts/import
exports.importContacts = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'CSV file required' });
    }

    const rows = [];
    const stream = Readable.from(req.file.buffer.toString());
    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser({ skipLines: 0, mapHeaders: ({ header }) => header && header.trim() }))
        .on('data', (row) => {
          const name = (row.name || row.fullname || '').toString().trim();
          const email = (row.email || '').toString().trim().toLowerCase();
          const phone = (row.phone || '').toString().trim();
          const tagsRaw = row.tags || '';
          const tags = tagsRaw.toString().split(/[;,]+/).map(t => t.trim()).filter(Boolean);
          if (name && email) {
            rows.push({ name, email, phone, tags});
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    if (!rows.length) {
      return res.status(400).json({ success: false, error: 'No valid rows found in CSV' });
    }
    const bulkOps = rows.map(r => ({
      updateOne: {
        filter: { email: r.email },
        update: { $set: { name: r.name, phone: r.phone, tags: r.tags} },
        upsert: true
      }
    }));

    const bulkResult = await Contact.bulkWrite(bulkOps, { ordered: false });

    return res.status(200).json({
      success: true,
      imported: rows.length,
      result: bulkResult
    });
  } catch (error) {
    logger.error('Error importing contacts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//GET /api/contacts/export
exports.exportContacts = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const query = {};
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ name: re }, { email: re }, { phone: re }];
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 }).lean();

    const header = ['name', 'email', 'phone', 'tags', 'createdAt'];
    const lines = [header.join(',')];

    for (const c of contacts) {
      const safe = (v) => {
        if (v === undefined || v === null) return '';
        const s = Array.isArray(v) ? v.join(';') : String(v);
        if (/[,"\n]/.test(s)) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };
      lines.push([
        safe(c.name),
        safe(c.email),
        safe(c.phone),
        safe(c.tags || []),
        safe(c.createdAt)
      ].join(','));
    }

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="contacts_${Date.now()}.csv"`);
    return res.send(csv);
  } catch (error) {
    logger.error('Error exporting contacts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
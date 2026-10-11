const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'productcopy-dev-secret';
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const HISTORY_FILE = path.join(__dirname, 'data', 'history.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFiles() {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function generateFallbackCopy({ productName, category, audience, tone, keyword }) {
  const safeName = productName || 'Sản phẩm';
  const safeCategory = category || 'Gia dụng';
  const safeAudience = audience || 'khách hàng hiện đại';
  const safeTone = tone || 'Thực dụng';
  const safeKeyword = keyword || safeName;

  const toneMap = {
    'Thực dụng': 'mang lại sự đơn giản, tiện lợi và hiệu quả cho mọi nhu cầu hằng ngày.',
    'Premium': 'mang đến sự sang trọng, đẳng cấp và trải nghiệm cao cấp.',
    'Hấp dẫn': 'khiến sản phẩm bứt phá ngay từ cái nhìn đầu tiên.',
    'Đồng hồ giỏi': 'tối ưu hiệu năng, độ bền và trải nghiệm mượt mà.',
    'Vui tươi': 'mang cảm giác thoải mái, sáng tạo và dễ yêu thích.'
  };

  const title = `${safeName} - ${safeKeyword} | Chất lượng ${safeCategory.toLowerCase()}`;
  const description = `${safeName} là lựa chọn phù hợp cho ${safeAudience}. Sản phẩm này ${toneMap[safeTone] || toneMap['Thực dụng']} Với thiết kế tối ưu, ${safeName} giúp bạn tiết kiệm thời gian, nâng cao hiệu quả và mang lại trải nghiệm tiện lợi mỗi ngày.`;

  const benefits = [
    `Thiết kế phù hợp với ${safeAudience}.`,
    'Dễ sử dụng, tiện lợi cho mọi nhu cầu hằng ngày.',
    'Chất lượng được tối ưu cho độ bền và hiệu suất.',
    'Tạo sự khác biệt trong trải nghiệm mua sắm và sử dụng.'
  ];

  const adCopy = `Tận dụng ngay ${safeName} để mang lại sự tiện lợi tối ưu cho cuộc sống của bạn. ${safeName} ${toneMap[safeTone] || toneMap['Thực dụng']} Đặt hàng ngay hôm nay để trải nghiệm sự khác biệt.`;
  const seo = [
    safeKeyword,
    `${safeKeyword} chất lượng cao`,
    `${safeKeyword} giá tốt`,
    `${safeKeyword} cho ${safeAudience}`,
    `${safeCategory.toLowerCase()} tiện lợi`,
    `${safeName} mới nhất`
  ].join(', ');

  return {
    title,
    description,
    benefits,
    adCopy,
    seo,
    mode: 'local'
  };
}

async function generateAIProductCopy({ productName, category, audience, tone, keyword }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateFallbackCopy({ productName, category, audience, tone, keyword });

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Bạn là chuyên gia marketing và copywriting. Hãy tạo tiêu đề, mô tả ngắn, lợi ích, ad copy và keyword SEO cho sản phẩm.'
        },
        {
          role: 'user',
          content: `Tên sản phẩm: ${productName}\nDanh mục: ${category}\nKhách hàng mục tiêu: ${audience}\nPhong cách: ${tone}\nKeyword: ${keyword}\nHãy trả về JSON với cấu trúc: {"title":"...","description":"...","benefits":[...],"adCopy":"...","seo":"..."}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const raw = completion.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);

    return {
      title: parsed.title || `${productName} - ${keyword}`,
      description: parsed.description || '',
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
      adCopy: parsed.adCopy || '',
      seo: parsed.seo || '',
      mode: 'ai'
    };
  } catch (error) {
    console.error('OpenAI error:', error.message);
    return generateFallbackCopy({ productName, category, audience, tone, keyword });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'ProductCopy Pro API is running' });
});

app.post('/api/auth/register', (req, res) => {
  ensureDataFiles();
  const { email, password, name } = req.body || {};

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const users = readJson(USERS_FILE);
  const exist = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (exist) return res.status(409).json({ error: 'User already exists' });

  const user = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name: name || 'New User',
    password: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
    plan: 'free'
  };

  users.push(user);
  writeJson(USERS_FILE, users);

  const token = signToken(user);
  return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

app.post('/api/auth/login', (req, res) => {
  ensureDataFiles();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user);
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  ensureDataFiles();
  const users = readJson(USERS_FILE);
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
});

app.post('/api/generate', authMiddleware, async (req, res) => {
  const { productName, category, audience, tone, keyword } = req.body || {};

  if (!productName || !category) {
    return res.status(400).json({ error: 'productName and category are required' });
  }

  const copy = await generateAIProductCopy({ productName, category, audience, tone, keyword });

  const history = readJson(HISTORY_FILE);
  const entry = {
    id: Date.now().toString(),
    userId: req.user.id,
    createdAt: new Date().toISOString(),
    payload: { productName, category, audience, tone, keyword },
    result: copy
  };

  history.unshift(entry);
  writeJson(HISTORY_FILE, history);

  res.json({ success: true, result: copy });
});

app.get('/api/history', authMiddleware, (req, res) => {
  const history = readJson(HISTORY_FILE);
  const filtered = history.filter(item => item.userId === req.user.id).slice(0, 20);
  res.json({ history: filtered });
});

app.delete('/api/history/:id', authMiddleware, (req, res) => {
  const history = readJson(HISTORY_FILE);
  const updated = history.filter(item => !(item.id === req.params.id && item.userId === req.user.id));
  writeJson(HISTORY_FILE, updated);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`ProductCopy Pro server running at http://localhost:${PORT}`);
});

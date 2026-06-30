require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const multer = require('multer');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

const User = require('./models/User');
const Otp = require('./models/Otp');

const app = express();
const port = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Generate a 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { name }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ type: 'email', message: 'Email is already registered. Please go back to log in page.' });
      }
      return res.status(400).json({ type: 'name', message: 'Username already exists. Please enter a different username.' });
    }

    // 2. Generate OTP
    const otp = generateOTP();

    // 3. Save OTP to DB (upsert so we only have one active OTP per email)
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, name, password, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // 4. Send email
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
      try {
        await resend.emails.send({
          from: 'Chitira Crypta <onboarding@resend.dev>', // You may need a verified domain here in production
          to: email,
          subject: 'Your Verification Code',
          html: `<p>Your verification code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        });
        console.log(`Sent OTP to ${email} via Resend`);
      } catch (emailErr) {
        console.error('Error sending email via Resend:', emailErr);
        // Continue anyway in development or notify the user
      }
    } else {
      console.log(`MOCK MODE: Pretend sent OTP ${otp} to ${email} (Configure RESEND_API_KEY in .env to send real emails)`);
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid. Create the User.
    const newUser = new User({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password
    });

    await newUser.save();
    
    // Delete the OTP record so it can't be used again
    await Otp.deleteOne({ email });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

app.post('/api/decode', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  const passphrase = req.body.passphrase || 'taravusecret';
  const inputImagePath = req.file.path;

  const pythonScript = path.join(__dirname, 'bridge.py');
  
  execFile('python', [pythonScript, 'decode', inputImagePath, passphrase], (error, stdout, stderr) => {
    // Delete the temp uploaded file
    if (fs.existsSync(inputImagePath)) fs.unlinkSync(inputImagePath);
    
    if (error) {
      console.error('Python decode error:', stderr || error.message);
      // Try to extract exact error from bridge.py stdout
      try {
        const lines = stdout.trim().split('\n');
        const result = JSON.parse(lines[lines.length - 1]);
        if (result.error) {
           return res.status(500).json({ success: false, error: result.error });
        }
      } catch (e) {
          // Ignore parse errors here
      }
      return res.status(500).json({ success: false, error: 'Decryption failed or image corrupted.' });
    }

    try {
      const lines = stdout.trim().split('\n');
      const result = JSON.parse(lines[lines.length - 1]);
      
      if (result.error) {
        return res.status(400).json({ success: false, error: result.error });
      }

      // Try to parse the nested data as JSON if it's a JSON string, otherwise return as-is
      let parsedData;
      try {
        parsedData = JSON.parse(result.data);
      } catch (e) {
        parsedData = result.data;
      }

      res.status(200).json({ success: true, data: parsedData });
    } catch (parseErr) {
      console.error('Parse error:', parseErr);
      res.status(500).json({ success: false, error: 'Failed to parse python output' });
    }
  });
});

app.post('/api/encode', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  const passphrase = req.body.passphrase;
  const text = req.body.text;
  
  if (!passphrase || !text) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Missing passphrase or text" });
  }

  const inputImagePath = req.file.path;
  const outputImagePath = path.join(__dirname, 'uploads', 'encoded_' + Date.now() + '.png');
  const pythonScript = path.join(__dirname, 'bridge.py');

  execFile('python', [pythonScript, 'encode', inputImagePath, text, passphrase, outputImagePath], (error, stdout, stderr) => {
    if (fs.existsSync(inputImagePath)) fs.unlinkSync(inputImagePath);

    if (error) {
      console.error('Python encode error:', stderr || error.message);
      if (fs.existsSync(outputImagePath)) fs.unlinkSync(outputImagePath);
      return res.status(500).json({ success: false, error: 'Encoding failed.' });
    }

    try {
      const lines = stdout.trim().split('\n');
      const result = JSON.parse(lines[lines.length - 1]);
      
      if (result.error) {
        if (fs.existsSync(outputImagePath)) fs.unlinkSync(outputImagePath);
        return res.status(400).json({ success: false, error: result.error });
      }

      // Send the encoded image back to the client
      res.download(outputImagePath, 'encoded_image.png', (err) => {
        if (fs.existsSync(outputImagePath)) fs.unlinkSync(outputImagePath);
      });
    } catch (parseErr) {
      console.error('Parse error:', parseErr);
      if (fs.existsSync(outputImagePath)) fs.unlinkSync(outputImagePath);
      res.status(500).json({ success: false, error: 'Failed to parse python output' });
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { codi, name, username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ codi }, { email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'El codi, email o nom d\'usuari ja està en ús' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ codi, name, username, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuari' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Credencials incorrectes' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Credencials incorrectes' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role, name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sessió' });
    }
};

// Verificar si un token es válido
exports.verificacio = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionat' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Token invàlid o caducat' });
    }
};

// Olvidar contraseña: envío de email
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'No existeix cap usuari amb aquest email.' });
        }

        const token = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1h
        await user.save();

        const resetUrl = `http://localhost:5000/reset_password.html?token=${token}`;

        await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Recuperació de Contrasenya',
            html: `
                <p>Has sol·licitat recuperar la teva contrasenya.</p>
                <p>Fes clic aquí: <a href="${resetUrl}">${resetUrl}</a></p>
                <p>Aquest enllaç expira en 1 hora.</p>
            `
        });

        res.json({ message: 'Correu enviat! Comprova la teva safata d\'entrada.' });
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        res.status(500).json({ message: 'Error al enviar email' });
    }
};

// Resetear contraseña
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token invàlid o caducat.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Contrasenya canviada correctament.' });
    } catch (error) {
        console.error('Error canviant la contrasenya:', error);
        res.status(500).json({ message: 'Error en canviar la contrasenya' });
    }
};

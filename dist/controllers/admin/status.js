"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../models/user");
const statusHandler = async (req, res, next) => {
    const { status, email } = req.body;
    if (!status)
        return res.status(400).json({ message: 'Need accurate informations' });
    await user_1.Users.update({ status }, { where: { email } }).then(d => {
        if (d[0] === 0)
            return res.status(404).json({ message: 'Email can not be found' });
        let message = `User ${email} `;
        if (status === 9) {
            message = message + 'become a admin';
        }
        ;
        if (status === 3) {
            message = message + 'is banned';
        }
        ;
        if (status === 1) {
            message = message + 'become a user';
        }
        ;
        res.status(200).json({ message });
    });
};
exports.default = statusHandler;

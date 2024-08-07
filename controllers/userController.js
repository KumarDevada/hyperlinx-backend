const User = require('../models/User');

const generateUniqueKey = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueKey;
    let keyExists = true;

    while (keyExists) {
        uniqueKey = '';
        for (let i = 0; i < 5; i++) {
            uniqueKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        const existingUser = await User.findOne({ uniqueKey });
        if (!existingUser) {
            keyExists = false;
        }
    }

    return uniqueKey;
};

const registerUser = async (req, res) => {
    const { username, phoneNumber, password } = req.body;
    // console.log(req.body)

    try {
        const userExists = await User.findOne({ phoneNumber });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists...!' });
        }

        const uniqueKey = await generateUniqueKey();

        const user = new User({
            username,
            phoneNumber,
            password,
            uniqueKey
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', uniqueKey });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        res.status(201).json({ uniqueKey: user.uniqueKey });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserLinks = async (req, res) => {
    const { uniqueKey } = req.params;

    try {
        const user = await User.findOne({ uniqueKey });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.links);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addLink = async (req, res) => {
    const { uniqueKey } = req.params;
    const { websiteName, link } = req.body;

    try {
        const user = await User.findOne({ uniqueKey });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.links.push({ websiteName, link });
        await user.save();

        res.status(201).json(user.links);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
};

const updateLink = async (req, res) => {
    const { uniqueKey, linkId } = req.params;
    const { websiteName, link } = req.body;

    try {
        const user = await User.findOne({ uniqueKey });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const linkToUpdate = user.links.id(linkId);

        if (!linkToUpdate) {
            return res.status(404).json({ message: 'Link not found' });
        }

        linkToUpdate.websiteName = websiteName;
        linkToUpdate.link = link;

        await user.save();

        res.status(201).json(user.links);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// const deleteLink = async (req, res) => {
//     const { uniqueKey, linkId } = req.params;

//     try {
//         const user = await User.findOne({ uniqueKey });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.links.id(linkId).remove();
//         await user.save();

//         res.json(user.links);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const deleteLink = async (req, res) => {
    const { uniqueKey, linkId } = req.params;

    try {
        const user = await User.findOne({ uniqueKey });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the link to be deleted
        const linkIndex = user.links.findIndex(link => link._id.toString() === linkId);

        if (linkIndex === -1) {
            return res.status(404).json({ message: 'Link not found' });
        }

        // Remove the link from the array
        user.links.splice(linkIndex, 1);

        await user.save();

        res.json(user.links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserLinks,
    addLink,
    updateLink,
    deleteLink
};

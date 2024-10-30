const getIpUser = async (req, res) => {

    try {
        // Extrae la IP del usuario de la solicitud
        let userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Si la IP es "::1", la convertimos a "127.0.0.1" para IPv4 en local
        if (userIP === '::1') {
            userIP = '127.0.0.1';
        }

        res.status(200).json({ ip: userIP });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la ip.', error });
    }


}

module.exports = { getIpUser };
const express = require('express');
const router = express.Router();
const pool = require('../models/dbConnection');
// const nodemailer = require('nodemailer');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
const prizeFrequency = {
    prize1: 0,
    prize2: 2,
    prize3: 10
};

const date = '2024-07-01';

let endContest = false;
var availablePrizes = [];
let isInitializing = false;
*/

// Crear instancia de DOMPurify
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

/*
const transporter = nodemailer.createTransport({
    host: 'mail.lbcontest.it',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});
*/

/*
const getWeekOfYear = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
};

const getPrizes = async () => {
    try {
        let currentDate = new Date().toISOString().split('T')[0];
        const rows = await pool.query('SELECT prize FROM lb_contest_available_prizes ORDER BY id ASC', [currentDate]);
        const prizesFromDB = [];
        if (rows.length > 0) {
            rows.forEach(row => {
                prizesFromDB.push(row.prize);
            });
            return prizesFromDB;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error, error.message)
    }
}

const saveInitializationDate = async () => {
    const currentDay = new Date().toISOString().split('T')[0];

    try {
        // Inserta la fecha de inicialización
        await pool.query('INSERT INTO lb_contest_date (date) VALUES (?)', [currentDay]);
    } catch (error) {
        console.error('Error saving initialization date:', error);
    }
};

const initializeAvailablePrizes = async () => {
    if (isInitializing) return;
    isInitializing = true;
    const currentDay = new Date().toISOString().split('T')[0];

    try {
        let initDate = false;

        const [rows] = await pool.query('SELECT date FROM lb_contest_date WHERE date = ?', [currentDay]);
        const initializationRows = rows !== undefined ? [rows.date] : [];
        console.log(initializationRows[0])

        if (initializationRows.length > 0) {
            initDate = initializationRows[0];
        } else {
            initDate = true;
        }  

        let currentDate = new Date();
        let maxDate = new Date('2024-07-01');

        // Verifica si la semana actual ya ha sido inicializada
        if (initDate === currentDay) {
            console.log(`Day ${currentDay} already initialized.`);

            isInitializing = false;
            return;
        } else if (currentDate >= maxDate) {
            // Verifica si han pasado más de MAX_DAYS dias desde la primera inicialización
            console.log(`Contest has finished`);
            endContest = true;
            isInitializing = false;
            return;

        } else {
            console.log('Populating prizes list')
            const prizeCount = { prize1: 0, prize2: 0, prize3: 0 };
            const remainingPrizes = await getPrizes();
            availablePrizes = [];

            if (remainingPrizes.length > 0) {
                remainingPrizes.forEach(remPrize => {
                    if (remPrize !== 'no prize') {
                        availablePrizes.push(remPrize);
                    }
                })
            }
            
            for (let prize in prizeFrequency) {
                const remaining = Math.max(0, prizeFrequency[prize]);
                for (let i = 0; i < remaining; i++) {
                    availablePrizes.push(prize);
                }
            }
        
            const remainingSlots = Math.max(0, 38 - Object.values(prizeCount).reduce((acc, cur) => acc + cur, 0));
            for (let i = 0; i < remainingSlots; i++) {
                availablePrizes.push('no prize');
            }
        
            shuffleArray(availablePrizes);
            await saveInitializationDate();
            await saveAvailablePrizesToDB();

            isInitializing = false;
        }
    } catch (error) {
        isInitializing = false;
        console.log(error, error.message);
    }
};

const saveAvailablePrizesToDB = async () => {
    const currentWeek = getWeekOfYear();
    const currentDay = new Date().toISOString().split('T')[0];
    
    try {
        const [rows] = await pool.query('SELECT date FROM lb_contest_date WHERE date = ?', [currentDay]);
        const initializationRows = rows ? JSON.parse(JSON.stringify(rows)) : [];
        const initDateRegister = initializationRows.date ? initializationRows.date.split('T')[0] : false;
        if (initDateRegister) {
            await pool.query('DELETE FROM lb_contest_available_prizes WHERE date != ?', [currentDay]);
        }

        for (let prize of availablePrizes) {
            await pool.query('INSERT INTO lb_contest_available_prizes (prize, week, date) VALUES (?, ?, ?)', [prize, currentWeek, currentDay]);
        }
    } catch (error) {
        console.log(error, error.message);
    }
    
};

const getRandomPrize = async () => {
        await initializeAvailablePrizes();
        try {
            const prizesFromDb = await getPrizes();
            if (prizesFromDb.length > 0 && !endContest) {
                console.log('Getting prize..')
                const prize = prizesFromDb.shift();
                await pool.query('DELETE FROM lb_contest_available_prizes WHERE id = (SELECT id FROM (SELECT id FROM lb_contest_available_prizes WHERE prize = ? ORDER BY id ASC LIMIT 1) AS subquery)', [prize]);
                return prize;
            } else {
                console.log('No prizes..')
                return 'no prize';
            }
        
        } catch (error) {
            console.log('Error getting prizes..', error);
            return 'no prize';
        }
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const sendPrizeEmail = async (email, prize, code, image) => {
    const mailOptions = {
        from: 'no-reply@laurabiagiottiparfums.com',
        to: email,
        subject: 'Congratulazioni! Hai vinto un premio con Laura Biaggioti Parfums',
        html: `
        <div id="mail" style="background-color: #fff5ef;color: #303133;width: 600px;margin: 0 auto;font-family: Arial, Helvetica, sans-serif;">
            <div id="mail-heading">
                <div id="mail-logo-wrapper" style="display: flex;background-color: white;padding: 45px;">
                    <img src="https://lbcontest.it/assets/mail-logo.png" style="margin: auto" />
                </div>
                <img src="https://lbcontest.it/assets/${image}.png" style="width: 100%;" />
            </div>
            <div id="mail-body" style="background-color: #FFF5EF;padding: 64px 30px 71px;text-align: center;">
            <div id="mail-body-title" style="display: flex;margin: 0 auto 40px;filter: drop-shadow(2px 4px 6px black);max-width: max-content">
                <h1 style="font-size: 26px;line-height: 0;color: #000000">CONGRATULAZIONI!</h1>
                <img src="https://lbcontest.it/assets/cheers-icon.png" />
            </div>
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">HAI VINTO ${prize}</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">È con piacere che ti confermiamo che sei stato il fortunato vincitore del contest Indovina le note e vinci.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Verrai presto contattato dal team Laura Biagiotti Parfums che ti invierà le indicazioni per ricevere il tuo premio.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Nel frattempo ti inviamo il codice di riferimento del premio, che servirà per verificare l’assegnazione. Ti consigliamo di custodirlo!</p>
            <div id="mail-code" style="padding: 15px 40px;background-color: white;margin: 40px auto;width: max-content;border: 1px solid #000000;">
                <p style="margin: 0;font-weight: 600;">Cocide del premio:</p> 
                <span style="font-size: 16px;line-height: 24px;">${code}</span>
            </div>
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Ti ringraziamo per aver partecipato al concorso e ci auguriamo che ti sia piaciuta la nuova collezione AQVE ROMANE.</p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Resta in contatto con noi tramite i profili Facebbok e Instagram Laura Biagiotti Parfums e facci sapere quale è la tua fraganza preferita. </p><br /><br />
            <p style="color: #444444;font-size: 14px;line-height: 18px;font-weight: 500;margin: 0;">Grazie e a presto! 
                Il tuo team 
                LAURA BIAGIOTTI PARFUMS
            </p>
            </div>
            <div id="mail-footer">
                <div id="mail-footer-logo" style="display: flex;background-color: #ffffff;padding: 45px;border-top: 1px solid #444444;border-bottom: 1px solid #444444;">
                    <img src="https://lbcontest.it/assets/mail-logo.png" style="margin:auto" />
                </div>
                <div id="mail-footer-bottom" style="display: block;padding: 50px 30px 14px;">
                    <div id="mail-rrss" style="display: flex;margin: auto;width: max-content;margin-bottom: 42px">
                        <p style="font-size: 16px;font-weight: bold;text-transform: uppercase;color: #000000;line-height: 2;">Follow Us:</p>
                        <ul style="display: flex;list-style-type: none;padding-left: 24px;">
                        <li><a href="https://www.facebook.com/laurabiagiottiparfums"><img src="https://lbcontest.it/assets/fb.png" /></a></li>
                        <li style="margin-left: 24px"><a href="https://www.instagram.com/laurabiagiottiparfums/?hl=it"><img src="https://lbcontest.it/assets/ig.png" /></a></li>
                        <li style="margin-left: 24px"><a href="https://www.instagram.com/laurabiagiottiparfums/?hl=it"><img src="https://lbcontest.it/assets/yt.png" /></a></li>
                        </ul>
                    </div>
                    <div id="mail-footer-menu" style="max-width: max-content;margin: auto;">
                        <p style="font-size: 14px;line-height: 22px;color: #444444;text-align: center;">2024 &copy;Laura Biagiotti Parfums.</p>
                        <p style="font-size: 14px;line-height: 22px;color: #444444;text-align: center;"><a href="https://www.laurabiagiottiparfums.com/termini-duso/" style="font-size: 12px;line-height: 22px;color: #444444;">Termini d&lsquo;uso</a> | <a href="https://www.laurabiagiottiparfums.com/privacy-policy/" style="font-size: 12px;line-height: 22px;color: #444444;">Politica sulla privacy</a> | <a href="mailto:info@laurabiagiottiparfums.com" style="font-size: 12px;line-height: 22px;color: #444444;">Contatti</a></p>
                    </div>
                </div>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

*/

router.post('/participants', async (req, res) => {
    try {
        const name = DOMPurify.sanitize(req.body.username);

        const rawPassword = DOMPurify.sanitize(req.body.password);
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const mail = DOMPurify.sanitize(req.body.mail);
        const city = DOMPurify.sanitize(req.body.city);
        const position = DOMPurify.sanitize(req.body.position);
        const prefFoot = DOMPurify.sanitize(req.body.prefFoot);

        // const uniqueId = DOMPurify.sanitize(req.body.uniqueId);
        // const wonGame = req.body.wonGame;
        
        
        // const queryCheck = 'SELECT COUNT(*) as count FROM lb_contest_participants WHERE tax_code = ?';

        // const [checkResult] = await pool.query(queryCheck, [taxCode]);
        // const isRegistered = checkResult.count > 0;
        const query = `
        INSERT INTO he_public_users (username, password, email, city, position, preferredFoot)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await pool.query(query, [name, hashedPassword, mail, city, position, prefFoot]);
        console.log('Participant registered - Name: ' + name + ', Mail: ' + mail + ', Position: ' + position + ', Preferred Foot: ' + prefFoot);
        res.status(201).json({ success: 'success' });
        
        // let consoleMsg = '';

        /*
        if (!isRegistered) {
            //const prize = wonGame ? await getRandomPrize() : 'no prize';
            const participantId = result.insertId;

            if (prize !== 'no prize') {
                await pool.query(
                    'INSERT INTO lb_contest_winners (participant_id, name, lastname, phone, email, tax_code, city, postal_code, province, address, communications, prize, unique_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    [participantId, name, lastname, phone, mail, taxCode, city, postCode, province, address, communications, prize, uniqueId]
                );
                let message;
                let imgUrl;

                switch (prize) {
                    case 'prize1':
                        message = 'UN <strong>soggiorno di 1 notte per due persone con percorso benessere in una struttura a scelta tra QC Terme Garda, QC Terme Roma, QC Terme Monte Bianco, QC Terme Bagni Vecchi e Bagni Nuovi, entrambi a Bormio.</strong>';
                        imgUrl = 'acque-termali';
                        break;
                    case 'prize2':
                        message = 'UNA <strong>Eau De Toilette Aqve Romane</strong>';
                        imgUrl = 'eau-de-toilete';
                        break;
                    case 'prize3':
                        message = 'UN <strong>Shower Gel travel size Aqve Romane</strong>';
                        imgUrl = 'shower-gel';
                        break
                }

                await sendPrizeEmail(mail, message, uniqueId, imgUrl);
            }

            consoleMsg = 'Participant Registered Successfully';
            res.status(201).json({ message: consoleMsg, registered: isRegistered, prize: prize });
        } else {
            consoleMsg = 'Participant Already Registered';
            res.status(201).json({ message: consoleMsg, registered: isRegistered });
        }
        */
    } catch (err) {
        console.error('Error registering participant:', err);
        res.status(500).json({ error: err.message });
    }
});

/*
router.get('/winners/:uniqueId', async (req, res) => {
    const { uniqueId } = req.params;
    const query = 'SELECT prize FROM lb_contest_winners WHERE unique_id = ?';

    try {
        const [rows] = await pool.query(query, [uniqueId]);
        const results = rows ? JSON.parse(JSON.stringify(rows)) : [];
        if (results.prize) {
            res.status(200).json({ prize: results.prize });
        } else {
            res.status(404).json({ message: 'No winner found for the given unique ID' });
        }
    } catch (err) {
        console.error('Error retrieving winner:', err);
        res.status(500).json({ error: err.message });
    }
});
*/
module.exports = router;
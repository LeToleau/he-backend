var express = require('express');
var router = express.Router();
var db = require('../models/dbConnection');

/* GET home page. */
router.get('/', async (req, res, next) => {
  /*
  try {
    const queryP = 'SELECT * FROM lb_contest_participants LIMIT 10';
    const queryW = 'SELECT * FROM lb_contest_winners LIMIT 10';
    const queryRemainingPrizes = 'SELECT COUNT(*) AS prize_count FROM lb_contest_available_prizes WHERE prize != ?';
    const queryRemainingUnitPrizes = 'SELECT COUNT(*) AS prize_count FROM lb_contest_available_prizes WHERE prize = ?';
    const queryDeliveredPrizes = 'SELECT COUNT(*) AS prize_count FROM lb_contest_winners WHERE prize = ?';
    const queryLastPrize = 'SELECT prize FROM lb_contest_winners ORDER BY created_at DESC LIMIT 1';
    const queryLastPrizeDate = 'SELECT created_at FROM lb_contest_winners ORDER BY created_at DESC LIMIT 1';
    const queryInitDate = 'SELECT initialization_date FROM lb_contest_initialization ORDER BY id ASC LIMIT 1';

    // Obtener los datos
    const participants = await db.query(queryP);
    const winners = await db.query(queryW);
    const remainingPrizes = await db.query(queryRemainingPrizes, ['no prize']);
    const remainingPrizes1 = await db.query(queryRemainingUnitPrizes, ['prize1']);
    const remainingPrizes2 = await db.query(queryRemainingUnitPrizes, ['prize2']);
    const remainingPrizes3 = await db.query(queryRemainingUnitPrizes, ['prize3']);

    const deliveredPrizes1 = await db.query(queryDeliveredPrizes, ['prize1']);
    const deliveredPrizes2 = await db.query(queryDeliveredPrizes, ['prize2']);
    const deliveredPrizes3 = await db.query(queryDeliveredPrizes, ['prize3']);

    const lastPrizeObj = await db.query(queryLastPrize);
    const lastPrizeDateObj = await db.query(queryLastPrizeDate);
    const initDateObj = await db.query(queryInitDate);

    const validValue = (value) => {
      if (value.length > 0) {
        return value;
      } else {
        return false;
      }
    } 
    
    function formatDateTime(date) {
      if (date !== undefined) {
        // Obtener la fecha en formato YYYY-MM-DD
        const dateOnly = date.toISOString().split('T')[0];
        
        // Obtener la hora en formato HH:MM:SS
        const timeOnly = date.toISOString().split('T')[1].split('.')[0];

        return {
          date: dateOnly,
          time: timeOnly
        };
      } else {
        return 'no date'
      }
      
    }
    
    const lastPrize = (str) => {
      let prizeName;
      switch (str) {
        case "prize1":
          prizeName = 'Acque Termali'
          break;
        case "prize2":
          prizeName = 'Aqve Romane Parfum'
          break;
        case "prize3":
          prizeName = 'Shower Gele Aqve Romane'
          break;
        default:
          prizeName = 'Not Found'
      }

      return prizeName;
    }

    const lastPrizeInfo = validValue(lastPrizeDateObj) ? formatDateTime(validValue(lastPrizeDateObj)[0].created_at) : { date: 'Not Found', time: 'Not Found'};
    const lastPrizeName = validValue(lastPrizeObj) ? lastPrize(validValue(lastPrizeObj)[0].prize) : 'Name Not Found';
    const initDate = validValue(initDateObj) ? formatDateTime(validValue(initDateObj)[0].initialization_date) : { date: 'Contest Not Initializated', time: ''};

    const day = new Date().toISOString().split('T')[0];

    // Renderizar la vista index y pasar los datos
    res.render('index', {
      layout: 'layout',
      title: 'Informazioni sul Concorso AQVE ROMANE',
      participants: participants ? participants : [],
      winners: winners ? winners : [],
      remainingPrizes: remainingPrizes[0].prize_count,
      remainingFirstPrize: remainingPrizes1[0].prize_count,
      remainingSecondPrize: remainingPrizes2[0].prize_count,
      remainingThirdPrize: remainingPrizes3[0].prize_count,
      deliveredFirstPrize: deliveredPrizes1[0].prize_count,
      deliveredSecondPrize: deliveredPrizes2[0].prize_count,
      deliveredThirdPrize: deliveredPrizes3[0].prize_count,
      date: day,
      lastPrize: lastPrizeName,
      lastPrizeInfo: lastPrizeInfo,
      initDate: initDate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
    */

  res.render('index', {
    layout: 'layout',
    title: 'Hay Equipo!'
  });
});

module.exports = router;
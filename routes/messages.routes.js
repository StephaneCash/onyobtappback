const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.newMessage);
router.get('/:senderId/:receiveId', messageController.getAllMsgsByReceiveAndSender);

module.exports = router;
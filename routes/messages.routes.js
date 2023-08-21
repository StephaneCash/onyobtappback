const router = require('express').Router();
const messageController = require('../controllers/messageController');
const uploadIlmageMsg = require('../middleware/uplaodImageMsg');

router.post('/', uploadIlmageMsg, messageController.newMessage);
router.post('/deleteMessages', messageController.deleteMessage);
router.get('/:senderId/:recepientId', messageController.getAllMsgsByReceiveAndSender);

module.exports = router;
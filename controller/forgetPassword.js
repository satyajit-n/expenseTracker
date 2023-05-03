const Sib = require("sib-api-v3-sdk");
const User = require("../models/user");

const forgetPassword = async (req, res, next) => {
  try {
    const client = Sib.ApiClient.instance;
    const { email } = req.body;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const transactionalEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "namawar.satyajeet@gmail.com",
    };

    const emailExist = await User.findOne({
      where: { email: email },
    });
    if (emailExist) {
      const reciever = [
        {
          email: email,
        },
      ];

      await transactionalEmailApi.sendTransacEmail({
        sender,
        to: reciever,
        subject: "Reset Password to Expense Tracker",
        textContent: `This is an email for resetting your password for Expense Tracker`,
      });
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(404).json({ message: "USER NOT FOUND" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { forgetPassword };

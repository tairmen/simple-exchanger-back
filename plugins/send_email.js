let nodemailer = require('nodemailer');

let mail = nodemailer.createTransport({
    service: process.env.EMAIL_TYPE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const send_email =  (data) => {
    let mailOptions = {
        from: `TrueMoneyExchange <${process.env.EMAIL}>`,
        to: process.env.EMAIL_SUPPORT,
        subject: `Сделан заказ ${data.uuid} для обмена денег`,
        html: `
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
            <style>
                h2 {
                    font-weight: 300;
                }

                .main {
                    font-family: Ubuntu;
                    text-align: center;
                    padding: 40px 20px;
                }

                .colored {
                    font-weight: 500;
                    color: #0357D6;
                }
            </style>
        </head>
        <div class="main">
            <h2>
                Email <span class="colored">${data.email}</span>
            </h2>
            <h2>Телефон <span class="colored">${data.telephone}</span></h2>
            <h2>Сумма которую отдает <span class="colored">${data.value} ${data.currencyToBuyName}</span></h2>
            <h2>Сумма которую получает <span class="colored">${data.valueSell} ${data.currencyToSellName}</span></h2>
        </div>
        `
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'anastasiya.sychova@gmail.com',
        subject: 'This is my first email.',
        text: `Welcome to the app ${name}.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'anastasiya.sychova@gmail.com',
        subject: 'Goodbye',
        text: `Sorry to see you go ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

// sgMail.send({
//     to: 'anastasiya.sychova@gmail.com',
//     from: 'anastasiya.sychova@gmail.com',
//     subject: 'This is my first email.',
//     text: 'Hope this works.'
// })

// then try node src/emails/account.js
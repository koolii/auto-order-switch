const Nightmare = require('nightmare')
const env = require('./secret.json')

const checkPurchasable = () => {
  const selector = '.btn__primary'

  return Nightmare({ show: false })
    .goto('https://store.nintendo.co.jp/customize.html')
    .exists(selector)
    .end()
}

const autoStart = async () => {
  const INTERVAL = 600

  const addSplatoonToCart = (nightmare) => {
    return nightmare
      .goto('https://store.nintendo.co.jp/item/HAC_P_AAB6A.html')
      .click('.add')
      .wait(INTERVAL)
      .evaluate(function() {
        return document.querySelector('title').innerHTML === 'My Nintendo Store（マイニンテンドーストア）'
      })
      .then(result => {
        console.log(result)
      })
  }

  const addSwitchToCart = (nightmare) => {
    return nightmare
      .goto('https://store.nintendo.co.jp/customize.html')
      .scrollTo(500, 0)
      .click('#HAC_8_JCLPA')
      .wait(INTERVAL)
      .click('#HAC_8_JATBA')
      .wait(INTERVAL)
      .click('#HAC_8_JCRYA')
      .wait(INTERVAL)
      .click('#HAC_8_JATKA')
      .wait(INTERVAL)
      .scrollTo(6000, 0)
      .click('.to_cart')
      .evaluate(function() {
        return document.querySelector('title').innerHTML === 'My Nintendo Store（マイニンテンドーストア）'
      })
      .then(result => {
        console.log(result)
      })
  }

  const gotoLogin = (nightmare) => {
    return nightmare
      .click('.add')
      .wait(INTERVAL)
      .evaluate(function() {
        return document.querySelector('title').innerHTML === 'ニンテンドーアカウント'
      })
      .then(result => {
        console.log(result)
      })
  }

  const login = (nightmare) => {
    return nightmare
      .type('input[name=subject_id]', env.id)
      .type('input[name=subject_password]', env.pass)
      .click('#accounts-login-button')
      .wait(INTERVAL)
      .evaluate(function() {
        return location.href.includes('cart_seisan.html')
      })
      .then(result => {
        console.log('gone to cart_seisan.html')
      })
  }

  const inputPersonalInfo = (nightmare) => {
    return nightmare
      .type('input[name=L_NAME]', env.last_name)
      .type('input[name=F_NAME]', env.first_name)
      .type('input[name=L_KANA]', env.last_name_kana)
      .type('input[name=F_KANA]', env.first_name_kana)
      .type('input[name=ZIP]', env.zip_code)
      .select('#ADDR1', env.prefecture)
      .type('#ADDR2', env.city)
      .type('#ADDR3', env.address)
      .type('input[name=TEL]', env.tel)
      .type('input[name=CREDIT_NAME]', env.credit.name)
      .type('input[name=CREDIT_NO]', env.credit.no)
      .select('#CREDIT_LIMIT_MONTH', env.credit.month)
      .select('#CREDIT_LIMIT_YEAR', env.credit.year)
      .type('input[name=SECURITY_CD]', env.credit.security)
      .click('input[type=submit]')
      .wait(INTERVAL)
  }

  const nightmare = Nightmare({ show: true })

  await addSplatoonToCart(nightmare)
  
// this method can not executed
//  await addSwitchToCart(nightmare)
  await gotoLogin(nightmare)
  await login(nightmare)
  await inputPersonalInfo(nightmare)
}

const main = async () => {
  const isPurchasable = await checkPurchasable()

  if (!isPurchasable) {
    console.log('SOLD OUT')
    return Promise.resolve()
  }

  await autoStart()
}

Promise.all([main()])

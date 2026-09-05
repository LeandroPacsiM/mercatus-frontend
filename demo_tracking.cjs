const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:5173';

async function step(msg) {
  console.log('\n=== ' + msg + ' ===');
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 350 });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  const custEmail = `cliente.demo+${Date.now()}@test.com`;
  const custPass = 'demo1234';

  try {
    await step('Limpiar estado y abrir tienda');
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/tienda/techstore`);
    await page.waitForSelector('.catalog__grid');

    await step('Agregar producto de ENVIO FISICO al carrito (Laptop UltraBook 14")');
    const card = page.locator('.catalog__card', { hasText: 'Laptop UltraBook 14' });
    await card.locator('button.catalog__add').click();
    await page.waitForTimeout(800);

    await step('Ir al carrito y al checkout');
    await page.goto(`${BASE}/carrito`);
    await page.waitForSelector('.cart');
    await page.locator('a.checkout__back, a:has-text("Pagar"), button:has-text("Ir a pagar")').first().click().catch(() => {});
    await page.goto(`${BASE}/checkout`);
    await page.waitForSelector('.checkout');

    await step('Crear cuenta de cliente (gate de pago)');
    await page.locator('.checkout .storefront__auth-btn--primary').click();
    await page.waitForSelector('#sf-name');
    await page.fill('#sf-name', 'Cliente Demo');
    await page.fill('#sf-email-r', custEmail);
    await page.fill('#sf-pass-r', custPass);
    await page.fill('#sf-conf', custPass);
    await page.locator('.sf-auth__form button[type="submit"]').click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('.checkout__form', { timeout: 8000 });

    await step('Completar checkout y pagar');
    await page.fill('.checkout__input', 'Cliente Demo');
    await page.fill('input[type="email"]', custEmail);
    await page.fill('.checkout__textarea', 'Av. Demo 123, Lima');
    await page.getByRole('button', { name: /Pagar/ }).click();
    await page.waitForSelector('.confirm', { timeout: 8000 });
    await page.waitForTimeout(800);

    const code = await page.evaluate(() => {
      const orders = JSON.parse(localStorage.getItem('mercatus_orders') || '[]');
      const mine = orders.find((o) => o.code.startsWith('MCS-')) || orders[0];
      return mine.code;
    });
    console.log('Pedido creado:', code);

    await step('Administrador inicia sesion en el backoffice');
    await page.goto(`${BASE}/login`);
    await page.waitForSelector('#login-email');
    await page.fill('#login-email', 'admin@mercatus.app');
    await page.fill('#login-password', 'admin1234');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForSelector('.sidebar', { timeout: 8000 });

    await step('Ir a Pedidos y marcar el pedido como ENVIADO');
    await page.getByRole('button', { name: 'Tiendas' }).click();
    await page.waitForSelector('.store-card');
    await page.locator('.store-card', { hasText: 'Tech Store' }).locator('.store-card__header').click();
    await page.waitForSelector('.store-layout');
    await page.getByRole('button', { name: 'Pedidos' }).click();
    await page.waitForSelector('.orders__table');
    const debugRows = await page.$$eval('.orders__row .orders__code', (els) => els.map((e) => e.textContent));
    const debugOrders = await page.evaluate(() => {
      const orders = JSON.parse(localStorage.getItem('mercatus_orders') || '[]');
      return orders.map((o) => ({ code: o.code, store_id: o.store_id, status: o.status }));
    });
    console.log('FILAS EN TABLA:', JSON.stringify(debugRows));
    console.log('ORDENES LS:', JSON.stringify(debugOrders));
    const row = page.locator('.orders__row', { hasText: '#' + code });
    await row.click();
    await page.waitForSelector('.orders__shipment');
    await page.locator('.orders__shipment select').selectOption('SHIPPED');
    await page.getByRole('button', { name: 'Guardar seguimiento' }).click();
    await page.waitForTimeout(800);
    console.log('Pedido marcado como ENVIADO. Volviendo a la vista del cliente...');

    await step('Cliente abre "Mis pedidos" y observa el seguimiento en tiempo real');
    await page.goto(`${BASE}/tienda/techstore/pedidos`);
    await page.waitForSelector('.tracking-map');
    console.log('Mapa visible. El repartidor (🛵) viaja desde el almacen (🏪) hasta tu direccion (📍)...');

    const delivered = await page
      .waitForFunction(
        () => {
          const el = document.querySelector('.tracking-map__status');
          return el && el.textContent.includes('Entregado');
        },
        { timeout: 45000 },
      )
      .then(() => true)
      .catch(() => false);

    const finalStatus = await page.$eval('.tracking-map__status', (el) => el.textContent).catch(() => 'n/a');
    console.log('RESULTADO:', delivered ? 'ENTREGADO ✅' : 'NO LLEGO', '| estado:', finalStatus);

    await step('Demo completa. Dejando la ventana abierta 15s para que lo veas');
    await page.waitForTimeout(15000);
  } catch (e) {
    console.log('ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
